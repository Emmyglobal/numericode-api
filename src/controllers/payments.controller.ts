import crypto from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, forbidden, notFound, ok, created } from '../utils/response'
import {
  initializeTransaction,
  verifyTransaction,
  verifyWebhookSignature,
  isPaystackConfigured,
} from '../services/paystack.service'

// ─── Payments controller (Phase 16 — premium-course checkout) ─────────────────
// Invariants enforced here:
//  1. The DATABASE is authoritative for price, currency, course identity and
//     user identity. Nothing from the browser can change the charged amount.
//  2. Only trusted server-side verification (webhook signature + field checks,
//     or a provider verify call) may move a payment to 'verified'.
//  3. Enrollment is granted exclusively by applyVerifiedPayment() — idempotently,
//     guarded by the payments.status transition and enrollments UNIQUE constraint.
//  4. Provider secrets never leave the backend; responses expose only safe fields.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface PaymentRow {
  id: string
  user_id: string
  course_id: string
  reference: string
  provider_reference: string | null
  email: string
  amount_subunits: number
  currency: string
  status: 'pending' | 'verified' | 'failed' | 'abandoned' | 'refunded' | 'disputed'
  failure_reason: string | null
  initialized_at: Date
  paid_at: Date | null
  metadata: Record<string, unknown>
}

interface CoursePricingRow {
  id: string
  title: string
  access_level: 'free' | 'premium'
  price_cents: number
  currency: string
  premium_enabled: boolean
}

/** Grant access through the EXISTING enrollment mechanism (idempotent). */
async function grantEnrollmentForPayment(payment: PaymentRow): Promise<void> {
  await query(
    'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING',
    [payment.user_id, payment.course_id]
  )
}

/**
 * The single trusted transition into 'verified'. Validates amount/currency
 * against the persisted payment record, then flips status atomically
 * ('pending' → 'verified') and grants enrollment. Safe to call from BOTH the
 * webhook and the status-verification path — one of them wins the atomic
 * update, the other sees the row already verified and does nothing.
 */
async function applyVerifiedPayment(
  payment: PaymentRow,
  verified: { amountSubunits: number; currency: string; providerReference: string | null; paidAt: string | null }
): Promise<PaymentRow> {
  // Price integrity: the provider must confirm the exact stored amount/currency.
  if (verified.amountSubunits !== payment.amount_subunits || verified.currency !== payment.currency) {
    const reason = `Amount/currency mismatch: expected ${payment.amount_subunits} ${payment.currency}, got ${verified.amountSubunits} ${verified.currency}`
    await query(
      `UPDATE payments SET status = 'failed', failure_reason = $2, updated_at = NOW() WHERE id = $1 AND status = 'pending'`,
      [payment.id, reason]
    )
    return { ...payment, status: 'failed', failure_reason: reason }
  }

  // Atomic idempotent transition: only a 'pending' row may become 'verified'.
  const { rows } = await query<PaymentRow>(
    `UPDATE payments
        SET status = 'verified',
            provider_reference = COALESCE($2, provider_reference),
            paid_at = COALESCE($3::timestamptz, paid_at),
            verified_at = NOW(),
            updated_at = NOW()
      WHERE id = $1 AND status = 'pending'
      RETURNING *`,
    [payment.id, verified.providerReference, verified.paidAt]
  )
  if (!rows[0]) {
    // Another path (webhook vs. status check) already verified it — re-read.
    const { rows: current } = await query<PaymentRow>('SELECT * FROM payments WHERE id = $1', [payment.id])
    return current[0] ?? payment
  }
  await grantEnrollmentForPayment(rows[0])
  return rows[0]
}

/** Ask Paystack for the truth about a pending payment (status endpoint path). */
async function reconcilePendingPayment(payment: PaymentRow): Promise<PaymentRow> {
  let verification
  try {
    verification = await verifyTransaction(payment.reference)
    if (!verification || typeof verification.status !== 'string') {
      return payment // malformed provider response — stay pending; webhook remains authoritative
    }
  } catch {
    // Provider unreachable/timeout — stay pending; the webhook remains authoritative.
    return payment
  }
  if (verification.status === 'success') {
    return applyVerifiedPayment(payment, {
      amountSubunits: verification.amountSubunits,
      currency: verification.currency,
      providerReference: verification.providerTransactionId,
      paidAt: verification.paidAt,
    })
  }
  if (verification.status === 'failed' || verification.status === 'abandoned') {
    const reason = verification.status === 'abandoned' ? 'Checkout abandoned' : 'Provider reported a failed charge'
    const { rows } = await query<PaymentRow>(
      `UPDATE payments SET status = $2, failure_reason = $3, updated_at = NOW() WHERE id = $1 AND status = 'pending' RETURNING *`,
      [payment.id, verification.status, reason]
    )
    return rows[0] ?? payment
  }
  return payment // still pending at the provider
}

/**
 * POST /api/payments/initiate  (student)
 * Body: { courseId } — nothing else is trusted. Price/currency come from the DB.
 */
export async function initiateCoursePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.body as { courseId?: string }
    if (!courseId || !UUID_RE.test(courseId)) return fail(res, 'A valid courseId is required', 400)
    if (!isPaystackConfigured()) {
      return fail(res, 'Payments are temporarily unavailable. Please try again later.', 503)
    }

    // Authoritative course load: exists, published, premium, purchasable.
    const { rows: courses } = await query<CoursePricingRow>(
      `SELECT id, title, access_level, price_cents, currency, premium_enabled
         FROM courses WHERE id = $1 AND status = 'published'`,
      [courseId]
    )
    if (!courses[0]) return notFound(res, 'Course is not available for purchase')
    const course = courses[0]
    if (course.access_level !== 'premium') return fail(res, 'This course is free — enroll directly instead', 400)
    if (!course.premium_enabled) return fail(res, 'Premium access is temporarily unavailable for this course', 403)
    if (!(course.price_cents > 0)) return fail(res, 'This course is not open for purchase yet', 400)

    // Already has access? Never charge twice for the same course.
    const { rows: enrolled } = await query(
      'SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user!.userId, courseId]
    )
    if (enrolled[0]) return fail(res, 'You already have access to this course', 409)
    const { rows: paid } = await query(
      `SELECT 1 FROM payments WHERE user_id = $1 AND course_id = $2 AND status = 'verified'`,
      [req.user!.userId, courseId]
    )
    if (paid[0]) return fail(res, 'You have already paid for this course', 409)

    const { rows: users } = await query<{ email: string }>('SELECT email FROM users WHERE id = $1', [req.user!.userId])
    if (!users[0]?.email) return fail(res, 'Your account has no email — checkout cannot start', 400)

    // Internal reference: Paystack allows only alphanumerics, '-', '.', '='.
    const reference = `NCP-${crypto.randomUUID().replace(/-/g, '')}`

    // Persist the pending payment BEFORE calling the provider (audit trail even
    // on provider failure). Amount/currency come from the course row, NOT the browser.
    const { rows: inserted } = await query<PaymentRow>(
      `INSERT INTO payments (user_id, course_id, reference, email, amount_subunits, currency, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        req.user!.userId,
        courseId,
        reference,
        users[0].email,
        course.price_cents,
        course.currency,
        JSON.stringify({ userId: req.user!.userId, courseId, courseTitle: course.title }),
      ]
    )
    const payment = inserted[0]

    try {
      const init = await initializeTransaction({
        email: users[0].email,
        amountSubunits: course.price_cents,
        currency: course.currency,
        reference,
        callbackUrl: `${process.env.CLIENT_URL ?? ''}/payment/callback`,
        metadata: { paymentId: payment.id, userId: req.user!.userId, courseId },
      })
      // Safe response: no secrets, no provider internals beyond the redirect URL.
      return created(res, {
        reference: payment.reference,
        authorizationUrl: init.authorizationUrl,
        amountSubunits: course.price_cents,
        currency: course.currency,
        courseTitle: course.title,
      })
    } catch {
      await query(
        `UPDATE payments SET status = 'failed', failure_reason = $2, updated_at = NOW() WHERE id = $1`,
        [payment.id, 'Checkout initialization failed']
      )
      return fail(res, 'Could not start checkout. Please try again.', 502)
    }
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/payments/:reference  (payment owner or admin)
 * Pending payments are re-verified against the provider before answering —
 * the browser return page can therefore NEVER manufacture success.
 */
export async function getPaymentStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { reference } = req.params
    const { rows } = await query<PaymentRow>('SELECT * FROM payments WHERE reference = $1', [reference])
    const payment = rows[0]
    if (!payment) return notFound(res, 'Payment not found')
    if (payment.user_id !== req.user!.userId && req.user!.role !== 'admin') {
      return forbidden(res)
    }

    let current = payment
    if (payment.status === 'pending') {
      current = await reconcilePendingPayment(payment)
    }
    if (current.status === 'verified') {
      // Self-healing: if the webhook verified but the process died before the
      // enrollment insert, this completes it (idempotent).
      await grantEnrollmentForPayment(current)
    }

    const { rows: courses } = await query<{ id: string; title: string }>(
      'SELECT id, title FROM courses WHERE id = $1',
      [current.course_id]
    )
    const { rows: enrolled } = await query(
      'SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [current.user_id, current.course_id]
    )
    return ok(res, {
      reference: current.reference,
      status: current.status,
      amountSubunits: current.amount_subunits,
      currency: current.currency,
      course: courses[0] ?? null,
      enrollmentGranted: Boolean(enrolled[0]),
      failureReason: current.failure_reason ?? null,
      paidAt: current.paid_at ? current.paid_at.toISOString() : null,
      createdAt: current.initialized_at.toISOString(),
    })
  } catch (err) {
    next(err)
  }
}

interface WebhookPayload {
  event?: string
  data?: {
    reference?: string
    status?: string
    amount?: number
    currency?: string
    id?: number | string
    paid_at?: string | null
  }
}

/**
 * POST /api/payments/webhook/paystack  (public; authenticated by signature)
 * Acknowledge fast with 200 — Paystack retries non-200s for 72 hours.
 * Every handler below is idempotent; duplicates and replays are no-ops.
 */
export async function paystackWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody
    const signature = req.headers['x-paystack-signature'] as string | undefined
    if (!rawBody || !verifyWebhookSignature(rawBody, signature)) {
      // Do not leak verification details to attackers.
      return fail(res, 'Invalid webhook signature', 401)
    }

    let event: WebhookPayload
    try {
      event = JSON.parse(rawBody.toString('utf8')) as WebhookPayload
    } catch {
      return fail(res, 'Invalid webhook payload', 400)
    }
    const eventType = event.event ?? ''
    const data = event.data ?? {}

    if (eventType === 'charge.success') {
      if (!data.reference) return ok(res, { received: true, handled: false })
      const { rows } = await query<PaymentRow>('SELECT * FROM payments WHERE reference = $1', [data.reference])
      const payment = rows[0]
      if (!payment) return ok(res, { received: true, handled: false }) // unknown reference — ack, no-op
      if (data.status !== 'success') return ok(res, { received: true, handled: false })
      await applyVerifiedPayment(payment, {
        amountSubunits: Number(data.amount ?? -1),
        currency: String(data.currency ?? ''),
        providerReference: data.id != null ? String(data.id) : null,
        paidAt: data.paid_at ?? null,
      })
      return ok(res, { received: true, handled: true })
    }

    if (eventType === 'refund.processed' || eventType === 'refund.processing') {
      if (!data.reference) return ok(res, { received: true, handled: false })
      await query(
        `UPDATE payments SET status = 'refunded', updated_at = NOW()
          WHERE reference = $1 AND status IN ('verified','disputed')`,
        [data.reference]
      )
      return ok(res, { received: true, handled: true })
    }

    if (eventType === 'charge.dispute.create') {
      if (!data.reference) return ok(res, { received: true, handled: false })
      await query(
        `UPDATE payments SET status = 'disputed', updated_at = NOW()
          WHERE reference = $1 AND status = 'verified'`,
        [data.reference]
      )
      return ok(res, { received: true, handled: true })
    }

    if (eventType === 'charge.dispute.resolve') {
      if (!data.reference) return ok(res, { received: true, handled: false })
      // Revert a disputed payment to verified — the partial unique index
      // (uq_payments_verified_user_course) guarantees this cannot create a
      // second verified row for the same (user, course).
      try {
        await query(
          `UPDATE payments SET status = 'verified', updated_at = NOW()
            WHERE reference = $1 AND status = 'disputed'`,
          [data.reference]
        )
      } catch {
        // Unique violation: another verified payment already exists — leave as disputed.
      }
      return ok(res, { received: true, handled: true })
    }

    // Unsupported/uninteresting events are acknowledged so Paystack stops retrying.
    return ok(res, { received: true, handled: false })
  } catch (err) {
    next(err)
  }
}