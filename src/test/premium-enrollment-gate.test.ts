import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

// ─── Premium enrolment gate ───────────────────────────────────────────────────
// Requirement: an ACTIVE Premium subscription OR a VERIFIED payment for the
// course is required to enrol in a premium course. Every check is server-side;
// the browser can neither skip nor fake it. This suite pins that contract for
// both enrolment endpoints and for opening premium content.

const app = createApp()

const STUDENT_EMAIL = `unit5-premium-${Date.now()}@numerycode-test.local`
const REF_PREFIX = `UNIT5-${Date.now()}-`

let studentToken: string
let studentId: string
const createdCourseIds: string[] = []

const auth = () => ({ Authorization: `Bearer ${studentToken}` })

async function createCourse(opts: { accessLevel: 'free' | 'premium'; priceCents?: number; premiumEnabled?: boolean }) {
  const { rows } = await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Premium gate test course', 'mathematics', 'beginner',
             (SELECT id FROM users WHERE role = 'trainer' ORDER BY created_at LIMIT 1),
             'published', ARRAY[]::text[], $2, $3, 'NGN', $4)
     RETURNING id`,
    [
      `Premium Gate ${opts.accessLevel} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      opts.accessLevel,
      opts.priceCents ?? (opts.accessLevel === 'premium' ? 50000 : 0),
      opts.premiumEnabled ?? true,
    ]
  )
  createdCourseIds.push(rows[0].id)
  return rows[0].id
}

async function insertSubscription(status: 'active' | 'cancelled', endsAt: Date) {
  await query(
    `INSERT INTO subscriptions (user_id, plan_code, status, provider_reference, starts_at, ends_at)
     VALUES ($1, 'premium', $2, $3, NOW(), $4)`,
    [studentId, status, `${REF_PREFIX}${Math.random().toString(36).slice(2, 8)}`, endsAt]
  )
}

async function insertPayment(courseId: string, status: 'verified' | 'pending') {
  await query(
    `INSERT INTO payments (user_id, course_id, reference, email, amount_subunits, currency, status, paid_at, verified_at)
     VALUES ($1, $2, $3, $4, 50000, 'NGN', $5::varchar,
             CASE WHEN $5::varchar = 'verified' THEN NOW() END,
             CASE WHEN $5::varchar = 'verified' THEN NOW() END)`,
    [studentId, courseId, `NCP-${REF_PREFIX}${Math.random().toString(36).slice(2, 8)}`, STUDENT_EMAIL, status]
  )
}

async function isEnrolled(courseId: string) {
  const { rows } = await query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2', [studentId, courseId])
  return rows.length > 0
}

const futureDate = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
const pastDate = () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

beforeAll(async () => {
  // Dedicated student fixture (no shared subscription/payment state can leak in).
  const passwordHash = await bcrypt.hash('password123', 10)
  await query(
    `INSERT INTO users (name, email, password_hash, role, status, account_activated, email_verified_at)
     VALUES ('Unit Five Premium Student', $1, $2, 'student', 'active', TRUE, NOW())
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           status = 'active', account_activated = TRUE, email_verified_at = NOW()`,
    [STUDENT_EMAIL, passwordHash]
  )
  const login = await request(app).post('/api/auth/login').send({ email: STUDENT_EMAIL, password: 'password123' })
  studentToken = login.body.data.token
  studentId = login.body.data.user.id
})

afterAll(async () => {
  if (createdCourseIds.length > 0) {
    const ids = createdCourseIds
    await query('DELETE FROM payments WHERE course_id = ANY($1::uuid[])', [ids])
    await query('DELETE FROM enrollments WHERE course_id = ANY($1::uuid[])', [ids])
    await query('DELETE FROM courses WHERE id = ANY($1::uuid[])', [ids])
  }
  await query(`DELETE FROM subscriptions WHERE user_id = $1 AND provider_reference LIKE 'UNIT5-%'`, [studentId])
  await query('DELETE FROM users WHERE email = $1', [STUDENT_EMAIL])
})

describe('Premium gate — POST /api/courses/enroll (continued)', () => {
  it('a VERIFIED payment for the course unlocks premium enrolment', async () => {
    const courseId = await createCourse({ accessLevel: 'premium' })
    await insertPayment(courseId, 'verified')
    const res = await request(app).post('/api/courses/enroll').set(auth()).send({ courseIds: [courseId] })
    expect(res.status).toBe(201)
    expect(await isEnrolled(courseId)).toBe(true)
  })

  it('a PENDING payment does not unlock premium enrolment', async () => {
    const courseId = await createCourse({ accessLevel: 'premium' })
    await insertPayment(courseId, 'pending')
    const res = await request(app).post('/api/courses/enroll').set(auth()).send({ courseIds: [courseId] })
    expect(res.status).toBe(403)
    expect(await isEnrolled(courseId)).toBe(false)
  })

  it('a premium course with premium disabled stays locked even with a verified payment', async () => {
    const courseId = await createCourse({ accessLevel: 'premium', premiumEnabled: false })
    await insertPayment(courseId, 'verified')
    const res = await request(app).post('/api/courses/enroll').set(auth()).send({ courseIds: [courseId] })
    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/temporarily unavailable/i)
    expect(await isEnrolled(courseId)).toBe(false)
  })
})

describe('Premium gate — POST /api/courses/:id/request', () => {
  it('refuses a premium course without access (403) and does NOT enrol', async () => {
    const courseId = await createCourse({ accessLevel: 'premium' })
    const res = await request(app).post(`/api/courses/${courseId}/request`).set(auth())
    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/active Premium subscription or verified payment/i)
    expect(await isEnrolled(courseId)).toBe(false)
  })

  it('enrols when an ACTIVE subscription exists', async () => {
    const courseId = await createCourse({ accessLevel: 'premium' })
    await insertSubscription('active', futureDate())
    const res = await request(app).post(`/api/courses/${courseId}/request`).set(auth())
    expect(res.status).toBe(201)
    expect(await isEnrolled(courseId)).toBe(true)
  })

  it('enrols when a VERIFIED payment exists', async () => {
    const courseId = await createCourse({ accessLevel: 'premium' })
    await insertPayment(courseId, 'verified')
    const res = await request(app).post(`/api/courses/${courseId}/request`).set(auth())
    expect(res.status).toBe(201)
    expect(await isEnrolled(courseId)).toBe(true)
  })
})

describe('Premium gate — opening course content (GET /api/dashboard/courses/:id)', () => {
  it('an enrollment row alone does NOT open premium content', async () => {
    const courseId = await createCourse({ accessLevel: 'premium' })
    // Remove access state left by earlier cases so this specifically proves that
    // an enrollment row by itself does not unlock premium content.
    await query('DELETE FROM subscriptions WHERE user_id = $1', [studentId])
    await query('DELETE FROM payments WHERE user_id = $1', [studentId])
    // Simulates legacy/auto-matched enrollments that exist without access.
    await query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [studentId, courseId])
    const res = await request(app).get(`/api/dashboard/courses/${courseId}`).set(auth())
    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/Premium access/i)
  })

  it('the same enrollment opens once a VERIFIED payment exists', async () => {
    const courseId = await createCourse({ accessLevel: 'premium' })
    await query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [studentId, courseId])
    await insertPayment(courseId, 'verified')
    const res = await request(app).get(`/api/dashboard/courses/${courseId}`).set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(courseId)
  })

  it('an ACTIVE subscription opens premium content too', async () => {
    const courseId = await createCourse({ accessLevel: 'premium' })
    await query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [studentId, courseId])
    await insertSubscription('active', futureDate())
    const res = await request(app).get(`/api/dashboard/courses/${courseId}`).set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(courseId)
  })

  it('a free course opens normally for an enrolled student', async () => {
    const courseId = await createCourse({ accessLevel: 'free' })
    await query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [studentId, courseId])
    const res = await request(app).get(`/api/dashboard/courses/${courseId}`).set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(courseId)
  })
})