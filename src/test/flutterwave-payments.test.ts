import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'
import { getActiveProviderName } from '../services/payment-provider'

// ─── Phase 21 — Flutterwave provider test suite ───────────────────────────────
// Real database, mocked Flutterwave HTTP transport. Webhook authentication uses
// the REAL verif-hash comparison (our own env-based logic, not a network call).

vi.mock('../services/flutterwave.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/flutterwave.service')>()
  return {
    ...actual,
    initializeCheckout: vi.fn(),
    verifyTransaction: vi.fn(),
  }
})

import { initializeCheckout, verifyTransaction } from '../services/flutterwave.service'
const mockInitialize = vi.mocked(initializeCheckout)
const mockVerify = vi.mocked(verifyTransaction)

// Test-mode values — NOT real credentials.
const TEST_SECRET_KEY = 'FLWSECK_TEST-phase21-secret'
const TEST_SECRET_HASH = 'phase21-secret-hash'
process.env.FLW_SECRET_KEY = TEST_SECRET_KEY
process.env.FLW_SECRET_HASH = TEST_SECRET_HASH
process.env.PAYMENT_PROVIDER = 'flutterwave'

const app = createApp()

let studentToken: string
let trainerToken: string
let studentId: string
const createdCourseIds: string[] = []
let txCounter = 7_400_000
const nextTxId = () => String(txCounter++)

const auth = () => ({ Authorization: `Bearer ${studentToken}` })

async function createCourse(opts: Partial<{ priceCents: number; accessLevel: string; premiumEnabled: boolean; published: boolean }> = {}) {
  const { rows } = await query<{ id: string; price_cents: number; currency: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Phase 21 Flutterwave test course', 'mathematics', 'beginner',
             (SELECT id FROM users WHERE role = 'trainer' ORDER BY created_at LIMIT 1),
             $2, ARRAY[]::text[], $3, $4, 'NGN', $5)
     RETURNING id, price_cents, currency`,
    [
      `Phase21 FLW Test ${opts.accessLevel ?? 'premium'} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      opts.published === false ? 'draft' : 'published',
      opts.accessLevel ?? 'premium',
      opts.priceCents ?? 50000,
      opts.premiumEnabled ?? true,
    ]
  )
  createdCourseIds.push(rows[0].id)
  return rows[0]
}

async function initiateFor(courseId: string) {
  return request(app).post('/api/payments/initiate').set(auth()).send({ courseId })
}

/** Successful-verification fixture for the payment with this reference. */
function successfulVerification(reference: string, amountSubunits: number, txId = nextTxId()) {
  return {
    status: 'success' as const,
    reference,
    amountSubunits,
    currency: 'NGN',
    providerTransactionId: txId,
    paidAt: new Date().toISOString(),
    rawStatus: 'successful',
  }
}

function flutterwaveWebhook(reference: string, overrides: Record<string, unknown> = {}) {
  return {
    event: 'charge.completed',
    data: {
      id: overrides.id ?? nextTxId(),
      tx_ref: reference,
      status: 'successful',
      amount: 500,
      currency: 'NGN',
      ...overrides,
    },
  }
}

beforeAll(async () => {
  const student = await request(app).post('/api/auth/login').send({ email: 'kolade@gmail.com', password: 'password123' })
  const trainer = await request(app).post('/api/auth/login').send({ email: 'trainer@numerycode.com', password: 'password123' })
  studentToken = student.body.data.token
  trainerToken = trainer.body.data.token
  const me = await request(app).get('/api/profile').set(auth())
  studentId = me.body.data.id
  mockInitialize.mockResolvedValue({
    checkoutUrl: 'https://checkout.flutterwave.com/v3/hosted/pay/phase21-test',
    reference: 'whatever-the-provider-echoes',
  })
  // Default: still pending (individual tests override).
  mockVerify.mockResolvedValue({
    status: 'pending', reference: 'unknown', amountSubunits: 0,
    currency: '', providerTransactionId: null, paidAt: null, rawStatus: 'pending',
  })
})

afterAll(async () => {
  // Test hygiene: payments keep FIXED provider_transaction_id values across runs
  // (UNIQUE index on provider_reference), so remove everything this file created.
  if (createdCourseIds.length > 0) {
    const ids = createdCourseIds
    await query('DELETE FROM payments WHERE course_id = ANY($1::uuid[])', [ids])
    await query('DELETE FROM enrollments WHERE course_id = ANY($1::uuid[])', [ids])
    await query('DELETE FROM courses WHERE id = ANY($1::uuid[])', [ids])
  }
  // Restore the ambient selection so nothing leaks into other expectations.
  delete process.env.PAYMENT_PROVIDER
})

// ── Provider selection (configuration switching) ───────────────────────────────

describe('flutterwave: active-provider selection', () => {
  it('selects the provider from PAYMENT_PROVIDER and defaults to paystack (rollback-safe)', () => {
    process.env.PAYMENT_PROVIDER = 'flutterwave'
    expect(getActiveProviderName()).toBe('flutterwave')
    process.env.PAYMENT_PROVIDER = 'paystack'
    expect(getActiveProviderName()).toBe('paystack')
    delete process.env.PAYMENT_PROVIDER
    expect(getActiveProviderName()).toBe('paystack')
    process.env.PAYMENT_PROVIDER = 'not-a-provider'
    expect(getActiveProviderName()).toBe('paystack')
    process.env.PAYMENT_PROVIDER = 'flutterwave'
  })
})

// ── Checkout initiation ────────────────────────────────────────────────────────

describe('flutterwave: checkout initiation', () => {
  it('401 — unauthenticated user cannot initialize checkout', async () => {
    const course = await createCourse()
    const res = await request(app).post('/api/payments/initiate').send({ courseId: course.id })
    expect(res.status).toBe(401)
  })

  it('403 — trainer cannot use the student payment endpoint', async () => {
    const course = await createCourse()
    const res = await request(app).post('/api/payments/initiate').set({ Authorization: `Bearer ${trainerToken}` }).send({ courseId: course.id })
    expect(res.status).toBe(403)
  })

  it('creates a pending Flutterwave payment and returns only the checkout URL', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const res = await initiateFor(course.id)
    expect(res.status).toBe(201)
    expect(res.body.data.provider).toBe('flutterwave')
    expect(res.body.data.checkoutUrl).toBe('https://checkout.flutterwave.com/v3/hosted/pay/phase21-test')
    // No secrets / provider internals are ever returned to the browser.
    const serialized = JSON.stringify(res.body)
    expect(serialized).not.toContain(TEST_SECRET_KEY)
    expect(serialized).not.toContain(TEST_SECRET_HASH)
    expect(res.body.data.amountSubunits).toBe(50000)
    expect(res.body.data.currency).toBe('NGN')

    const { rows } = await query<{ provider: string; status: string; amount_subunits: number; currency: string }>(
      'SELECT provider, status, amount_subunits, currency FROM payments WHERE reference = $1',
      [res.body.data.reference]
    )
    expect(rows[0]).toMatchObject({ provider: 'flutterwave', status: 'pending', amount_subunits: 50000, currency: 'NGN' })
  })

  it('uses the DATABASE price even when the browser sends a different price/currency', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const res = await request(app).post('/api/payments/initiate').set(auth())
      .send({ courseId: course.id, priceCents: 1, currency: 'USD', amount: 1 })
    expect(res.status).toBe(201)
    expect(res.body.data.amountSubunits).toBe(50000)
    expect(res.body.data.currency).toBe('NGN')
    // The provider was asked for the server-side amount (50000 kobo = ₦500).
    expect(mockInitialize).toHaveBeenCalledWith(expect.objectContaining({ amountSubunits: 50000, currency: 'NGN' }))
  })

  it('rejects a free course (no payment path required)', async () => {
    const course = await createCourse({ accessLevel: 'free', priceCents: 0 })
    const res = await initiateFor(course.id)
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/free/i)
  })

  it('marks the payment failed when Flutterwave initialization fails', async () => {
    const course = await createCourse()
    mockInitialize.mockRejectedValueOnce(new Error('Flutterwave request failed: network error'))
    const res = await initiateFor(course.id)
    expect(res.status).toBe(502)
    const { rows } = await query<{ status: string; failure_reason: string | null }>(
      'SELECT status, failure_reason FROM payments WHERE course_id = $1',
      [course.id]
    )
    expect(rows[0].status).toBe('failed')
    expect(rows[0].failure_reason).toBe('Checkout initialization failed: Flutterwave request failed: network error')
  })
})

// ── Verification (status endpoint + provider dispatch) ─────────────────────────

describe('flutterwave: server-side verification', () => {
  it('verifies a successful payment and grants enrollment', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string

    mockVerify.mockResolvedValueOnce(successfulVerification(reference, 50000))
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.status).toBe(200)
    expect(status.body.data.status).toBe('verified')
    expect(status.body.data.enrollmentGranted).toBe(true)
    expect(status.body.data.provider).toBe('flutterwave')

    const { rows: payments } = await query<{ status: string; provider_reference: string | null }>(
      'SELECT status, provider_reference FROM payments WHERE reference = $1', [reference]
    )
    expect(payments[0].status).toBe('verified')
    expect(payments[0].provider_reference).toBeTruthy()
    const { rows: enrollments } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(enrollments).toHaveLength(1)
  })

  it('rejects an AMOUNT mismatch without enrolling', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string

    mockVerify.mockResolvedValueOnce(successfulVerification(reference, 49999))
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.body.data.status).toBe('failed')
    expect(status.body.data.enrollmentGranted).toBe(false)
    const { rows } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(rows).toHaveLength(0)
  })

  it('rejects a CURRENCY mismatch without enrolling', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string

    mockVerify.mockResolvedValueOnce({ ...successfulVerification(reference, 50000), currency: 'USD' })
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.body.data.status).toBe('failed')
    expect(status.body.data.enrollmentGranted).toBe(false)
  })

  it('rejects a TRANSACTION-REFERENCE mismatch without enrolling', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string

    mockVerify.mockResolvedValueOnce({ ...successfulVerification(reference, 50000), reference: 'someone-elses-txref' })
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.body.data.status).toBe('failed')
    expect(status.body.data.enrollmentGranted).toBe(false)
  })

  it('a provider-reported failure never enrolls', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string

    mockVerify.mockResolvedValueOnce({
      status: 'failed', reference, amountSubunits: 50000, currency: 'NGN',
      providerTransactionId: nextTxId(), paidAt: null, rawStatus: 'failed',
    })
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.body.data.status).toBe('failed')
    expect(status.body.data.enrollmentGranted).toBe(false)
  })

  it('a cancelled (abandoned) checkout never enrolls and can be retried', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string

    mockVerify.mockResolvedValueOnce({
      status: 'abandoned', reference, amountSubunits: 0, currency: 'NGN',
      providerTransactionId: null, paidAt: null, rawStatus: 'cancelled',
    })
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.body.data.status).toBe('abandoned')
    expect(status.body.data.enrollmentGranted).toBe(false)
    // The student still has a payment path: a fresh checkout can be initiated.
    const retry = await initiateFor(course.id)
    expect(retry.status).toBe(201)
  })

  it('403 — a non-owner cannot read a payment status (ownership enforced)', async () => {
    const course = await createCourse()
    const init = await initiateFor(course.id)
    const res = await request(app).get(`/api/payments/${init.body.data.reference}`).set({ Authorization: `Bearer ${trainerToken}` })
    expect(res.status).toBe(403)
  })

  it('verifies a Flutterwave payment through Flutterwave even after PAYMENT_PROVIDER switches to paystack', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string

    // Operator rolls back to paystack; in-flight Flutterwave payments must still verify.
    process.env.PAYMENT_PROVIDER = 'paystack'
    try {
      mockVerify.mockResolvedValueOnce(successfulVerification(reference, 50000))
      const status = await request(app).get(`/api/payments/${reference}`).set(auth())
      expect(status.body.data.status).toBe('verified')
      expect(status.body.data.enrollmentGranted).toBe(true)
    } finally {
      process.env.PAYMENT_PROVIDER = 'flutterwave'
    }
  })
})

// ── Webhook authentication + idempotency ──────────────────────────────────────

describe('flutterwave: webhook', () => {
  it('401 — an invalid verif-hash is rejected', async () => {
    const course = await createCourse()
    const init = await initiateFor(course.id)
    const res = await request(app)
      .post('/api/payments/webhook/flutterwave')
      .set('verif-hash', 'wrong-hash')
      .send(flutterwaveWebhook(init.body.data.reference as string))
    expect(res.status).toBe(401)
  })

  it('401 — a missing verif-hash is rejected', async () => {
    const res = await request(app).post('/api/payments/webhook/flutterwave').send({ event: 'charge.completed', data: {} })
    expect(res.status).toBe(401)
  })

  it('verifies + enrolls on a valid webhook and is idempotent on duplicates', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string
    const txId = nextTxId()
    mockVerify
      .mockResolvedValueOnce(successfulVerification(reference, 50000, txId))
      .mockResolvedValueOnce(successfulVerification(reference, 50000, txId))

    const first = await request(app).post('/api/payments/webhook/flutterwave')
      .set('verif-hash', TEST_SECRET_HASH)
      .send(flutterwaveWebhook(reference, { id: txId, amount: 500 }))
    expect(first.status).toBe(200)
    expect(first.body.data).toMatchObject({ received: true, handled: true })

    // Duplicate delivery must be a safe no-op (ack without re-enrolling).
    const second = await request(app).post('/api/payments/webhook/flutterwave')
      .set('verif-hash', TEST_SECRET_HASH)
      .send(flutterwaveWebhook(reference, { id: txId, amount: 500 }))
    expect(second.status).toBe(200)

    const { rows: payments } = await query<{ status: string }>('SELECT status FROM payments WHERE course_id = $1', [course.id])
    expect(payments.filter(p => p.status === 'verified')).toHaveLength(1)
    const { rows: enrollments } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(enrollments).toHaveLength(1)
  })

  it('does NOT trust the webhook payload — a claimed success with a failed server-side verify stays failed', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const init = await initiateFor(course.id)
    const reference = init.body.data.reference as string
    mockVerify.mockResolvedValueOnce({
      status: 'failed', reference, amountSubunits: 50000, currency: 'NGN',
      providerTransactionId: nextTxId(), paidAt: null, rawStatus: 'failed',
    })
    const res = await request(app).post('/api/payments/webhook/flutterwave')
      .set('verif-hash', TEST_SECRET_HASH)
      .send(flutterwaveWebhook(reference, { status: 'successful', amount: 500 }))
    expect(res.status).toBe(200)
    const { rows } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [reference])
    expect(rows[0].status).toBe('failed')
    const { rows: enrollments } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(enrollments).toHaveLength(0)
  })

  it('acknowledges an unknown tx_ref without touching payment state', async () => {
    const res = await request(app).post('/api/payments/webhook/flutterwave')
      .set('verif-hash', TEST_SECRET_HASH)
      .send(flutterwaveWebhook(`NCP-unknown-${Date.now()}`))
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ received: true, handled: false })
  })

  it('ignores non-charge events (acknowledged, no state change)', async () => {
    const res = await request(app).post('/api/payments/webhook/flutterwave')
      .set('verif-hash', TEST_SECRET_HASH)
      .send({ event: 'transfer.completed', data: { tx_ref: 'irrelevant' } })
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ received: true, handled: false })
  })
})

// ── CRITICAL REGRESSION (Phase 19): the premium dead-end is eliminated ────────

describe('flutterwave: premium enrolment flow (critical regression)', () => {
  it('rejects direct unpaid enrolment, then payment → verification → enrollment → access', async () => {
    const course = await createCourse({ priceCents: 50000 })

    // 1) Direct premium enrolment without payment is still rejected. The RULE is
    //    unchanged — the dead-end was the missing payment path, not the gate.
    const blocked = await request(app).post('/api/courses/enroll').set(auth()).send({ courseIds: [course.id] })
    expect(blocked.status).toBe(403)
    expect(blocked.body.message).toMatch(/An active Premium subscription or verified payment is required to enrol in premium courses/)

    // 2) No access before paying.
    const before = await request(app).get(`/api/courses/${course.id}/access`).set(auth())
    expect(before.body.data.hasAccess).toBe(false)

    // 3) The student can now INITIATE payment directly (checkout URL returned).
    const init = await initiateFor(course.id)
    expect(init.status).toBe(201)
    expect(init.body.data.checkoutUrl).toContain('checkout.flutterwave.com')
    const reference = init.body.data.reference as string

    // 4) Simulated successful Flutterwave TEST payment → webhook confirms it.
    const txId = nextTxId()
    mockVerify.mockResolvedValueOnce(successfulVerification(reference, 50000, txId))
    const webhook = await request(app).post('/api/payments/webhook/flutterwave')
      .set('verif-hash', TEST_SECRET_HASH)
      .send(flutterwaveWebhook(reference, { id: txId, amount: 500 }))
    expect(webhook.body.data.handled).toBe(true)

    // 5) Payment verified + enrollment granted + course accessible.
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.body.data.status).toBe('verified')
    expect(status.body.data.enrollmentGranted).toBe(true)

    const access = await request(app).get(`/api/courses/${course.id}/access`).set(auth())
    expect(access.body.data).toMatchObject({ hasAccess: true, isEnrolled: true, entitledBy: 'payment' })

    // 6) Refresh is stable; the course no longer needs a payment button.
    const refreshed = await request(app).get(`/api/courses/${course.id}/access`).set(auth())
    expect(refreshed.body.data.hasAccess).toBe(true)

    // 7) Starting checkout again never charges twice — access is reported instead.
    const again = await initiateFor(course.id)
    expect(again.status).toBe(200)
    expect(again.body.data).toMatchObject({ alreadyHasAccess: true, enrollmentGranted: true })

    // 8) Exact-once: one verified payment, one enrollment for this course.
    const { rows: verified } = await query('SELECT 1 FROM payments WHERE user_id = $1 AND course_id = $2 AND status = $3', [studentId, course.id, 'verified'])
    expect(verified).toHaveLength(1)
    const { rows: enrolled } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(enrolled).toHaveLength(1)
  })
})
