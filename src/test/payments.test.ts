import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import crypto from 'crypto'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

// ─── Phase 16P — payment test suite ───────────────────────────────────────────
// Real database, mocked Paystack HTTP transport. Webhook SIGNATURE verification
// uses the REAL HMAC-SHA512 implementation (it is our own crypto, not a network call).

// Mock only the provider network calls; keep the real signature/config logic.
vi.mock('../services/paystack.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/paystack.service')>()
  return {
    ...actual,
    initializeTransaction: vi.fn(),
    verifyTransaction: vi.fn(),
  }
})

import { initializeTransaction, verifyTransaction } from '../services/paystack.service'
const mockInitialize = vi.mocked(initializeTransaction)
const mockVerify = vi.mocked(verifyTransaction)

// A fake test secret — matches the pattern of real keys, is NOT a real credential.
const TEST_SECRET = 'sk_test_phase16_hmac_secret'
process.env.PAYSTACK_SECRET_KEY = TEST_SECRET

const app = createApp()

let studentToken: string
let trainerToken: string
let adminToken: string
let studentId: string
const createdCourseIds: string[] = []

async function createCourse(opts: Partial<{ priceCents: number; accessLevel: string; premiumEnabled: boolean; published: boolean }> = {}) {
  const { rows } = await query<{ id: string; price_cents: number; currency: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Phase 16 payment test course', 'mathematics', 'beginner',
             (SELECT id FROM users WHERE role = 'trainer' ORDER BY created_at LIMIT 1),
             $2, ARRAY[]::text[], $3, $4, 'NGN', $5)
     RETURNING id, price_cents, currency`,
    [
      `Phase16 Pay Test ${opts.accessLevel ?? 'premium'} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      opts.published === false ? 'draft' : 'published',
      opts.accessLevel ?? 'premium',
      opts.priceCents ?? 50000,
      opts.premiumEnabled ?? true,
    ]
  )
  createdCourseIds.push(rows[0].id)
  return rows[0]
}

const auth = () => ({ Authorization: `Bearer ${studentToken}` })

async function makeCourseAndPayment(courseOpts: Parameters<typeof createCourse>[0] = {}) {
  const course = await createCourse(courseOpts)
  const res = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: course.id })
  return { course, res }
}

function signWebhook(payload: string): string {
  return crypto.createHmac('sha512', TEST_SECRET).update(Buffer.from(payload, 'utf8')).digest('hex')
}

beforeAll(async () => {
  const student = await request(app).post('/api/auth/login').send({ email: 'kolade@gmail.com', password: 'password123' })
  const trainer = await request(app).post('/api/auth/login').send({ email: 'trainer@numerycode.com', password: 'password123' })
  const admin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numerycode.com', password: 'password123' })
  studentToken = student.body.data.token
  trainerToken = trainer.body.data.token
  adminToken = admin.body.data.token
  const me = await request(app).get('/api/profile').set(auth())
  studentId = me.body.data.id
  mockInitialize.mockResolvedValue({
    authorizationUrl: 'https://checkout.paystack.com/phase16-test',
    accessCode: null,
    reference: 'whatever-the-provider-echoes',
  })
  // Default: any unexpected status call reports "still pending" (individual tests override).
  mockVerify.mockResolvedValue({
    status: 'pending', reference: 'unknown', amountSubunits: 0,
    currency: '', providerTransactionId: null, paidAt: null, rawStatus: 'pending',
  })
})

afterAll(async () => {
  if (createdCourseIds.length > 0) {
    await query('DELETE FROM courses WHERE id = ANY($1::uuid[])', [createdCourseIds])
  }
})

// ── Authorization ─────────────────────────────────────────────────────────────

describe('payments: authorization', () => {
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

  it('200 — admin may read a payment status (owner-or-admin rule)', async () => {
    const { res } = await makeCourseAndPayment()
    expect(res.status).toBe(201)
    const status = await request(app).get(`/api/payments/${res.body.data.reference}`).set({ Authorization: `Bearer ${adminToken}` })
    expect(status.status).toBe(200)
    expect(status.body.data.status).toBe('pending')
  })
})

// ── Price integrity ───────────────────────────────────────────────────────────

describe('payments: price integrity (server-authoritative)', () => {
  it('charges the DATABASE price even when the browser sends a different price', async () => {
    const course = await createCourse({ priceCents: 50000 })
    const res = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: course.id, priceCents: 1, currency: 'USD' })
    expect(res.status).toBe(201)
    expect(res.body.data.amountSubunits).toBe(50000)
    expect(res.body.data.currency).toBe('NGN')
    const { rows } = await query<{ amount_subunits: number; currency: string; status: string }>(
      'SELECT amount_subunits, currency, status FROM payments WHERE reference = $1',
      [res.body.data.reference]
    )
    expect(rows[0].amount_subunits).toBe(50000)
    expect(rows[0].currency).toBe('NGN')
    expect(rows[0].status).toBe('pending')
  })

  it('400 — free course is not purchasable', async () => {
    const course = await createCourse({ accessLevel: 'free', priceCents: 0 })
    const res = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: course.id })
    expect(res.status).toBe(400)
  })

  it('404 — unknown/unpublished course', async () => {
    const draft = await createCourse({ published: false })
    const res1 = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: draft.id })
    expect(res1.status).toBe(404)
    const res2 = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: '00000000-0000-0000-0000-000000000000' })
    expect(res2.status).toBe(404)
  })

  it('403 — premium disabled course', async () => {
    const course = await createCourse({ premiumEnabled: false })
    const res = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: course.id })
    expect(res.status).toBe(403)
  })

  it('409 — already-enrolled student is never charged again', async () => {
    const course = await createCourse()
    await query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [studentId, course.id])
    const res = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: course.id })
    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/already have access/i)
  })
})

// ── Payment lifecycle ─────────────────────────────────────────────────────────

describe('payments: initialization and verification', () => {
  it('201 — successful initialization creates a pending payment and returns a redirect URL', async () => {
    const { res } = await makeCourseAndPayment()
    expect(res.status).toBe(201)
    expect(res.body.data.reference).toMatch(/^NCP-[0-9a-f]{32}$/)
    expect(res.body.data.authorizationUrl).toContain('checkout.paystack.com')
    const { rows } = await query<{ status: string; provider: string }>(
      'SELECT status, provider FROM payments WHERE reference = $1',
      [res.body.data.reference]
    )
    expect(rows[0].status).toBe('pending')
    expect(rows[0].provider).toBe('paystack')
  })

  it('502 — provider initialization failure marks the payment failed (no silent success)', async () => {
    mockInitialize.mockRejectedValueOnce(new Error('Paystack down'))
    const { res } = await makeCourseAndPayment()
    expect(res.status).toBe(502)
    const { rows } = await query<{ status: string }>(
      `SELECT status FROM payments WHERE user_id = $1 ORDER BY initialized_at DESC LIMIT 1`,
      [studentId]
    )
    expect(rows[0]?.status).toBe('failed')
  })

  it('pending/failed verification does NOT grant premium access', async () => {
    const { course, res } = await makeCourseAndPayment()
    expect(res.status).toBe(201)
    mockVerify.mockResolvedValueOnce({
      status: 'failed', reference: res.body.data.reference, amountSubunits: 50000,
      currency: 'NGN', providerTransactionId: '999', paidAt: null, rawStatus: 'failed',
    })
    const status = await request(app).get(`/api/payments/${res.body.data.reference}`).set(auth())
    expect(status.status).toBe(200)
    expect(status.body.data.status).toBe('failed')
    expect(status.body.data.enrollmentGranted).toBe(false)
    const { rows } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(rows.length).toBe(0)
  })

  it('verification SUCCESS (browser-return-before-webhook path) grants enrollment', async () => {
    const { course, res } = await makeCourseAndPayment()
    expect(res.status).toBe(201)
    mockVerify.mockResolvedValueOnce({
      status: 'success', reference: res.body.data.reference, amountSubunits: 50000,
      currency: 'NGN', providerTransactionId: '4099260516', paidAt: '2026-08-17T10:00:00.000Z', rawStatus: 'success',
    })
    const status = await request(app).get(`/api/payments/${res.body.data.reference}`).set(auth())
    expect(status.status).toBe(200)
    expect(status.body.data.status).toBe('verified')
    expect(status.body.data.enrollmentGranted).toBe(true)
    expect(status.body.data.course.id).toBe(course.id)
    const { rows } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(rows.length).toBe(1)
  })

  it('verification amount mismatch → failed, NO enrollment', async () => {
    const { course, res } = await makeCourseAndPayment()
    expect(res.status).toBe(201)
    mockVerify.mockResolvedValueOnce({
      status: 'success', reference: res.body.data.reference, amountSubunits: 100,
      currency: 'NGN', providerTransactionId: '4099260517', paidAt: '2026-08-17T10:00:00.000Z', rawStatus: 'success',
    })
    const status = await request(app).get(`/api/payments/${res.body.data.reference}`).set(auth())
    expect(status.body.data.status).toBe('failed')
    expect(status.body.data.failureReason).toMatch(/mismatch/i)
    const { rows } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(rows.length).toBe(0)
  })

  it('verification currency mismatch → failed, NO enrollment', async () => {
    const { course, res } = await makeCourseAndPayment()
    expect(res.status).toBe(201)
    mockVerify.mockResolvedValueOnce({
      status: 'success', reference: res.body.data.reference, amountSubunits: 50000,
      currency: 'GHS', providerTransactionId: '4099260518', paidAt: '2026-08-17T10:00:00.000Z', rawStatus: 'success',
    })
    const status = await request(app).get(`/api/payments/${res.body.data.reference}`).set(auth())
    expect(status.body.data.status).toBe('failed')
    const { rows } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(rows.length).toBe(0)
  })

  it('abandoned payment that later succeeds → verified + enrolled (webhook recovery)', async () => {
    const { course, res } = await makeCourseAndPayment()
    const reference = res.body.data.reference
    // Simulate the callback page polling BEFORE checkout completion: Paystack
    // reports 'abandoned', flipping the row from pending → abandoned.
    await query(`UPDATE payments SET status = 'abandoned', failure_reason = 'Checkout abandoned' WHERE reference = $1`, [reference])
    const payload = JSON.stringify({ event: 'charge.success', data: { reference, status: 'success', amount: 50000, currency: 'NGN', id: 'hook-recovery', paid_at: '2026-08-17T10:00:00.000Z' } })
    const hook = await request(app)
      .post('/api/payments/webhook/paystack')
      .set('Content-Type', 'application/json')
      .set({ 'x-paystack-signature': signWebhook(payload) })
      .send(payload)
    expect(hook.status).toBe(200)
    const { rows: pay } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [reference])
    expect(pay[0].status).toBe('verified')
    const { rows: enr } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(enr.length).toBe(1)
  })

  it('status endpoint reconciles an abandoned payment that later succeeded', async () => {
    const { course, res } = await makeCourseAndPayment()
    const reference = res.body.data.reference
    await query(`UPDATE payments SET status = 'abandoned', failure_reason = 'Checkout abandoned' WHERE reference = $1`, [reference])
    mockVerify.mockResolvedValueOnce({
      status: 'success', reference, amountSubunits: course.price_cents,
      currency: 'NGN', providerTransactionId: '4099260599', paidAt: '2026-08-17T10:00:00.000Z', rawStatus: 'success',
    })
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.status).toBe(200)
    expect(status.body.data.status).toBe('verified')
    expect(status.body.data.enrollmentGranted).toBe(true)
  })

  it('status endpoint keeps a truly abandoned payment non-verified', async () => {
    const { course, res } = await makeCourseAndPayment()
    const reference = res.body.data.reference
    await query(`UPDATE payments SET status = 'abandoned', failure_reason = 'Checkout abandoned' WHERE reference = $1`, [reference])
    mockVerify.mockResolvedValueOnce({
      status: 'abandoned', reference, amountSubunits: 0,
      currency: '', providerTransactionId: null, paidAt: null, rawStatus: 'abandoned',
    })
    const status = await request(app).get(`/api/payments/${reference}`).set(auth())
    expect(status.body.data.status).toBe('abandoned')
    expect(status.body.data.enrollmentGranted).toBe(false)
    const { rows: enr } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(enr.length).toBe(0)
  })

  it('404 — status for a wrong/unknown reference', async () => {
    const res = await request(app).get('/api/payments/NCP-doesnotexist').set(auth())
    expect(res.status).toBe(404)
  })

  it('409 — cannot re-initiate for a course already paid', async () => {
    const course = await createCourse()
    const first = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: course.id })
    expect(first.status).toBe(201)
    await query(`UPDATE payments SET status = 'verified' WHERE reference = $1`, [first.body.data.reference])
    const second = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: course.id })
    expect(second.status).toBe(409)
    expect(second.body.message).toMatch(/already paid/i)
  })
})

// ── Webhooks ──────────────────────────────────────────────────────────────────

describe('payments: webhooks (signature + idempotency)', () => {
  let hookTxId = 4100000000
  function chargeSuccess(reference: string, amount = 50000, currency = 'NGN', status = 'success') {
    return JSON.stringify({ event: 'charge.success', data: { reference, status, amount, currency, id: String(hookTxId++), paid_at: '2026-08-17T10:00:00.000Z' } })
  }

  const deliverWebhook = (payload: string, signature?: string) =>
    request(app)
      .post('/api/payments/webhook/paystack')
      .set('Content-Type', 'application/json')
      .set(signature ? { 'x-paystack-signature': signature } : {})
      .send(payload)

  it('valid signed charge.success → verified + enrolled (webhook-before-browser path)', async () => {
    const { course, res } = await makeCourseAndPayment()
    const reference = res.body.data.reference
    const payload = chargeSuccess(reference)
    const hook = await deliverWebhook(payload, signWebhook(payload))
    expect(hook.status).toBe(200)
    expect(hook.body.data.handled).toBe(true)
    const { rows: pay } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [reference])
    expect(pay[0].status).toBe('verified')
    const { rows: enr } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(enr.length).toBe(1)
  })

  it('duplicate + replay webhooks do NOT duplicate enrollment or corrupt status', async () => {
    const { course, res } = await makeCourseAndPayment()
    const reference = res.body.data.reference
    const payload = chargeSuccess(reference)
    for (let i = 0; i < 3; i++) {
      const hook = await deliverWebhook(payload, signWebhook(payload))
      expect(hook.status).toBe(200)
    }
    const { rows: pay } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [reference])
    expect(pay[0].status).toBe('verified')
    const { rows: enr } = await query<{ n: number }>(
      'SELECT COUNT(*)::int AS n FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [studentId, course.id]
    )
    expect(enr[0].n).toBe(1)
  })

  it('401 — invalid webhook signature', async () => {
    const hook = await deliverWebhook(chargeSuccess('NCP-anything'), 'deadbeef')
    expect(hook.status).toBe(401)
  })

  it('401 — missing webhook signature', async () => {
    const hook = await deliverWebhook(chargeSuccess('NCP-anything'))
    expect(hook.status).toBe(401)
  })

  it('acknowledges (200, handled:false) an unknown transaction reference', async () => {
    const payload = chargeSuccess('NCP-unknown-reference')
    const hook = await deliverWebhook(payload, signWebhook(payload))
    expect(hook.status).toBe(200)
    expect(hook.body.data.handled).toBe(false)
  })

  it('acknowledges unsupported events without side effects', async () => {
    const payload = JSON.stringify({ event: 'transfer.success', data: { reference: 'NCP-whatever' } })
    const hook = await deliverWebhook(payload, signWebhook(payload))
    expect(hook.status).toBe(200)
    expect(hook.body.data.handled).toBe(false)
  })

  it('webhook amount mismatch → payment failed, NO enrollment', async () => {
    const { course, res } = await makeCourseAndPayment()
    const reference = res.body.data.reference
    const payload = chargeSuccess(reference, 100) // wrong amount
    const hook = await deliverWebhook(payload, signWebhook(payload))
    expect(hook.status).toBe(200)
    const { rows: pay } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [reference])
    expect(pay[0].status).toBe('failed')
    const { rows: enr } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(enr.length).toBe(0)
  })

  it('refund.processed marks the payment refunded', async () => {
    const { res } = await makeCourseAndPayment()
    const reference = res.body.data.reference
    await query(`UPDATE payments SET status = 'verified' WHERE reference = $1`, [reference])
    const payload = JSON.stringify({ event: 'refund.processed', data: { reference } })
    const hook = await deliverWebhook(payload, signWebhook(payload))
    expect(hook.status).toBe(200)
    const { rows } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [reference])
    expect(rows[0].status).toBe('refunded')
  })
})

// ── Enrollment integrity + security ───────────────────────────────────────────

describe('payments: enrollment integrity and security', () => {
  it('existing enrollment mechanism accepts a student with a verified payment', async () => {
    const course = await createCourse()
    const init = await request(app).post('/api/payments/initiate').set(auth()).send({ courseId: course.id })
    expect(init.status).toBe(201)
    await query(`UPDATE payments SET status = 'verified' WHERE reference = $1`, [init.body.data.reference])
    // The pre-existing premium gate must now accept the verified-payment path.
    const enroll = await request(app).post(`/api/courses/${course.id}/request`).set(auth())
    expect([200, 201]).toContain(enroll.status)
    const { rows } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, course.id])
    expect(rows.length).toBe(1)
  })

  it('API responses never contain provider secrets', async () => {
    const { res } = await makeCourseAndPayment()
    const initiateRaw = JSON.stringify(res.body)
    expect(initiateRaw).not.toMatch(/sk_test|sk_live|secret/i)
    const status = await request(app).get(`/api/payments/${res.body.data.reference}`).set(auth())
    const statusRaw = JSON.stringify(status.body)
    expect(statusRaw).not.toMatch(/sk_test|sk_live|secret/i)
  })

  it('payment status is private: a non-owner cannot read it', async () => {
    const { res } = await makeCourseAndPayment()
    const outsider = await request(app).get(`/api/payments/${res.body.data.reference}`).set({ Authorization: `Bearer ${trainerToken}` })
    expect([403, 404]).toContain(outsider.status)
  })
})