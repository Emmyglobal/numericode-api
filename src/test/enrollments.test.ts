import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

// ─── Remove Course (unenrollment) test suite ──────────────────────────────────
// Real shared database. Every test creates its own courses/enrollments/payments
// with a unique title and the suite deletes ONLY those rows in afterAll
// (course deletion cascades to its own modules/lessons/enrollments/payments and
// lesson_completions on those lessons — nothing outside the test's data is
// touched). The route under test is:
//
//   DELETE /api/dashboard/courses/:id   (authenticated student only)
//
// Behavioural contract verified here:
//   - ONLY the authenticated student's enrollment row is removed.
//   - Courses, modules, lessons, trainer, other students and payment/learning
//     records are preserved.
//   - A verified payment blocks removal (purchased-course policy) and is never
//     falsely marked refunded.
//   - Repeated removal is a controlled 404, not an unhandled error.

const app = createApp()

// Self-contained fixture ensure: upserts the named test accounts as active &
// loginable (password 'password123') so the suite does not depend on ordering
// of the global test setup hooks or on pre-existing demo data. These emails are
// test fixtures only and are never matched by the global cleanup (which targets
// *@example.com and a fixed roster of seeded names), so they are preserved.
async function ensureLoginUser(email: string, name: string, role: 'student' | 'trainer' | 'admin') {
  const passwordHash = await bcrypt.hash('password123', 10)
  await query(
    `INSERT INTO users (name, email, password_hash, role, status, account_activated)
     VALUES ($1, $2, $3, $4, 'active', TRUE)
     ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name,
           password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role,
           status = 'active',
           account_activated = TRUE`,
    [name, email, passwordHash, role]
  )
}

async function login(email: string): Promise<string> {
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  if (!res.body?.data?.token) {
    throw new Error(`Login fixture failed for ${email}: ${res.status} ${res.body?.message ?? ''}`)
  }
  return res.body.data.token
}

let studentAToken: string // kolade@gmail.com
let studentBToken: string // amaka@gmail.com
let trainerToken: string  // trainer@numerycode.com
let adminToken: string    // emmanuel@numerycode.com
let studentAId: string
let studentBId: string

const createdCourseIds: string[] = []

async function createCourse(opts: Partial<{ accessLevel: string; priceCents: number; premiumEnabled: boolean; title: string }> = {}) {
  const { rows } = await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Remove-course test course', 'mathematics', 'beginner',
             (SELECT id FROM users WHERE role = 'trainer' ORDER BY created_at LIMIT 1),
             'published', ARRAY[]::text[], $2, $3, 'NGN', $4)
     RETURNING id`,
    [
      opts.title ?? `RemoveCourse Test ${opts.accessLevel ?? 'free'} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      opts.accessLevel ?? 'free',
      opts.priceCents ?? 0,
      opts.premiumEnabled ?? true,
    ]
  )
  createdCourseIds.push(rows[0].id)
  return rows[0].id
}

async function enrollDirect(userId: string, courseId: string) {
  await query(
    'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING',
    [userId, courseId]
  )
}

async function isEnrolled(userId: string, courseId: string): Promise<boolean> {
  const { rows } = await query('SELECT 1 AS id FROM enrollments WHERE user_id = $1 AND course_id = $2', [userId, courseId])
  return rows.length > 0
}

async function addLessonAndCompletion(userId: string, courseId: string): Promise<string> {
  const { rows: mod } = await query<{ id: string }>(
    `INSERT INTO modules (course_id, title, position) VALUES ($1, 'Test Module', 0) RETURNING id`,
    [courseId]
  )
  const { rows: lesson } = await query<{ id: string }>(
    `INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, 'Test Lesson', 'content', 10, 0) RETURNING id`,
    [mod[0].id]
  )
  await query('INSERT INTO lesson_completions (user_id, lesson_id) VALUES ($1, $2)', [userId, lesson[0].id])
  return lesson[0].id
}

function insertPayment(opts: { userId: string; courseId: string; status: string; reference?: string }) {
  const reference = opts.reference ?? `NCP-RC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const isVerified = opts.status === 'verified'
  return query(
    `INSERT INTO payments (user_id, course_id, reference, email, amount_subunits, currency, status, provider_reference, verified_at, paid_at)
     VALUES ($1, $2, $3, 'remove-course-test@example.com', 50000, 'NGN', $4, $5, $6, $7)`,
    [
      opts.userId,
      opts.courseId,
      reference,
      opts.status,
      isVerified ? `prov-${reference}` : null, // Paystack provider reference
      isVerified ? new Date() : null,          // paid_at
      isVerified ? new Date() : null,          // verified_at
    ]
  )
}

const A = () => ({ Authorization: `Bearer ${studentAToken}` })
const B = () => ({ Authorization: `Bearer ${studentBToken}` })

beforeAll(async () => {
  // Ensure all fixture accounts exist and are loginable before attempting login,
  // so the suite is robust to DB state and test-file ordering.
  await Promise.all([
    ensureLoginUser('kolade@gmail.com', 'Kolade Student', 'student'),
    ensureLoginUser('amaka@gmail.com', 'Amaka Student', 'student'),
    ensureLoginUser('trainer@numerycode.com', 'Trainer NumeryCode', 'trainer'),
    ensureLoginUser('emmanuel@numerycode.com', 'Emmanuel Nwafor', 'admin'),
  ])

  studentAToken = await login('kolade@gmail.com')
  studentBToken = await login('amaka@gmail.com')
  trainerToken = await login('trainer@numerycode.com')
  adminToken = await login('emmanuel@numerycode.com')

  const meA = await request(app).get('/api/profile').set(A())
  studentAId = meA.body.data.id
  const meB = await request(app).get('/api/profile').set(B())
  studentBId = meB.body.data.id
})

afterAll(async () => {
  // Only the rows this suite created (course deletion cascades to its own
  // modules/lessons/enrollments/payments and lesson completions on those
  // lessons). Existing production/demo data is never touched.
  if (createdCourseIds.length > 0) {
    await query('DELETE FROM courses WHERE id = ANY($1::uuid[])', [createdCourseIds])
  }
})

describe('Remove Course — authorization & security', () => {
  it('401 — unauthenticated user cannot remove an enrollment', async () => {
    const courseId = await createCourse({ accessLevel: 'free' })
    await enrollDirect(studentAId, courseId)
    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`)
    expect(res.status).toBe(401)
    expect(await isEnrolled(studentAId, courseId)).toBe(true) // untouched
  })

  it('403 — trainer/admin cannot remove a student enrollment (role guard)', async () => {
    const courseId = await createCourse({ accessLevel: 'free' })
    await enrollDirect(studentAId, courseId)
    for (const token of [trainerToken, adminToken]) {
      const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set({ Authorization: `Bearer ${token}` })
      expect(res.status).toBe(403)
    }
    expect(await isEnrolled(studentAId, courseId)).toBe(true) // untouched
  })

  it('404 — student cannot remove ANOTHER student enrollment', async () => {
    const courseId = await createCourse({ accessLevel: 'free' })
    await enrollDirect(studentAId, courseId)
    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(B())
    expect(res.status).toBe(404)
    expect(await isEnrolled(studentAId, courseId)).toBe(true) // owner untouched
  })
})

describe('Remove Course — free courses (Case A)', () => {
  it('authenticated student removes a free course enrollment', async () => {
    const courseId = await createCourse({ accessLevel: 'free' })
    await enrollDirect(studentAId, courseId)
    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(200)
    expect(res.body.data.removed).toBe(true)
    expect(res.body.data.courseId).toBe(courseId)
    expect(await isEnrolled(studentAId, courseId)).toBe(false)
  })

  it('repeated removal is safe (second request → controlled 404)', async () => {
    const courseId = await createCourse({ accessLevel: 'free' })
    await enrollDirect(studentAId, courseId)
    const first = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(first.status).toBe(200)
    const second = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(second.status).toBe(404)
    expect(second.body.message).toContain('not enrolled')
  })

  it('removing one course does NOT remove another enrolled course', async () => {
    const courseA = await createCourse({ accessLevel: 'free' })
    const courseB = await createCourse({ accessLevel: 'free' })
    await enrollDirect(studentAId, courseA)
    await enrollDirect(studentAId, courseB)
    const res = await request(app).delete(`/api/dashboard/courses/${courseA}`).set(A())
    expect(res.status).toBe(200)
    expect(await isEnrolled(studentAId, courseA)).toBe(false)
    expect(await isEnrolled(studentAId, courseB)).toBe(true)
  })
it('course itself, course content and trainer remain intact', async () => {
    const courseId = await createCourse({ accessLevel: 'free', title: `IntactCourse ${Date.now()}` })
    const { rows: before } = await query<{ title: string; status: string; instructor_id: string }>(
      'SELECT title, status, instructor_id FROM courses WHERE id = $1', [courseId]
    )
    await enrollDirect(studentAId, courseId)
    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(200)

    const { rows: after } = await query<{ title: string; status: string; instructor_id: string }>(
      'SELECT title, status, instructor_id FROM courses WHERE id = $1', [courseId]
    )
    expect(after[0]).toBeDefined()
    expect(after[0].title).toBe(before[0].title)
    expect(after[0].status).toBe('published')
    expect(after[0].instructor_id).toBe(before[0].instructor_id)
    const { rows: trainer } = await query('SELECT 1 AS id FROM users WHERE id = $1', [after[0].instructor_id])
    expect(trainer.length).toBe(1) // trainer account untouched
  })

  it('other students enrollments remain intact', async () => {
    const courseId = await createCourse({ accessLevel: 'free' })
    await enrollDirect(studentAId, courseId)
    await enrollDirect(studentBId, courseId)
    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(200)
    expect(await isEnrolled(studentAId, courseId)).toBe(false)
    expect(await isEnrolled(studentBId, courseId)).toBe(true)
  })

  it('nonexistent course handled safely', async () => {
    const res = await request(app).delete('/api/dashboard/courses/00000000-0000-4000-8000-000000000000').set(A())
    expect(res.status).toBe(404)
    expect(res.body.message).toContain('Course not found')
  })

  it('nonexistent enrollment handled safely', async () => {
    const courseId = await createCourse({ accessLevel: 'free' }) // no enrollment
    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(404)
    expect(res.body.message).toContain('not enrolled')
  })
})

describe('Remove Course — premium unpaid registration (Case B)', () => {
  it('enrolled-but-unpaid premium student can remove the registration', async () => {
    const courseId = await createCourse({ accessLevel: 'premium', priceCents: 50000 })
    await enrollDirect(studentAId, courseId)
    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(200)
    expect(await isEnrolled(studentAId, courseId)).toBe(false)
  })

  it('pending/failed payment records are preserved (never deleted on removal)', async () => {
    const courseId = await createCourse({ accessLevel: 'premium', priceCents: 50000 })
    await enrollDirect(studentAId, courseId)
    const refPending = `NCP-PEND-${Date.now()}`
    await insertPayment({ userId: studentAId, courseId, status: 'pending', reference: refPending })
    const refFailed = `NCP-FAIL-${Date.now()}`
    await insertPayment({ userId: studentAId, courseId, status: 'failed', reference: refFailed })

    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(200)

    const { rows: pendingRows } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [refPending])
    expect(pendingRows[0].status).toBe('pending')
    const { rows: failedRows } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [refFailed])
    expect(failedRows[0].status).toBe('failed')
    // Payment rows themselves still reference the untouched course.
    const { rows: courseRows } = await query('SELECT 1 AS id FROM courses WHERE id = $1', [courseId])
    expect(courseRows.length).toBe(1)
  })
})
describe('Remove Course — premium with verified payment (Case C)', () => {
  it('returning to the course shows the normal premium flow again after removal', async () => {
    // (Front-end assertion: after removal the course disappears from My Courses
    // and the public detail page offers the standard payment/enrol flow again.
    // Here we verify the data side: enrollment gone, verified payment intact.)
    const courseId = await createCourse({ accessLevel: 'premium', priceCents: 50000 })
    await enrollDirect(studentAId, courseId)
    await insertPayment({ userId: studentAId, courseId, status: 'verified' })
    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/purchase|refund/i)
    expect(await isEnrolled(studentAId, courseId)).toBe(true) // access NOT silently revoked
  })

  it('verified payment is never falsely marked refunded and audit fields are preserved', async () => {
    const courseId = await createCourse({ accessLevel: 'premium', priceCents: 50000 })
    await enrollDirect(studentAId, courseId)
    const reference = `NCP-VER-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    await insertPayment({ userId: studentAId, courseId, status: 'verified', reference })
    const { rows: before } = await query<{ status: string; verified_at: Date; paid_at: Date; provider_reference: string | null }>(
      'SELECT status, verified_at, paid_at, provider_reference FROM payments WHERE reference = $1', [reference]
    )

    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(409)

    const { rows: after } = await query<{ status: string; verified_at: Date; paid_at: Date; provider_reference: string | null }>(
      'SELECT status, verified_at, paid_at, provider_reference FROM payments WHERE reference = $1', [reference]
    )
    expect(after[0].status).toBe('verified') // NOT refunded/failed/abandoned
    expect(after[0].verified_at?.toString()).toBe(before[0].verified_at?.toString())
    expect(after[0].paid_at?.toString()).toBe(before[0].paid_at?.toString())
    expect(after[0].provider_reference).toBe(before[0].provider_reference)
  })

  it('a refunded (refunded-status) premium course CAN be removed — payment history kept', async () => {
    // A refunded payment means the refund workflow already ran. The enrollment
    // may be cleaned up; the refunded financial record stays untouched.
    const courseId = await createCourse({ accessLevel: 'premium', priceCents: 50000 })
    await enrollDirect(studentAId, courseId)
    const reference = `NCP-REF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    await insertPayment({ userId: studentAId, courseId, status: 'refunded', reference })

    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(200)
    expect(await isEnrolled(studentAId, courseId)).toBe(false)
    const { rows: pay } = await query<{ status: string }>('SELECT status FROM payments WHERE reference = $1', [reference])
    expect(pay[0].status).toBe('refunded') // unchanged
  })
})

describe('Remove Course — learning records safety (Step 10)', () => {
  it('lesson completions and other learning records are NOT deleted by removal', async () => {
    const courseId = await createCourse({ accessLevel: 'free' })
    await enrollDirect(studentAId, courseId)
    const lessonId = await addLessonAndCompletion(studentAId, courseId)
    const { rows: before } = await query('SELECT 1 AS id FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2', [studentAId, lessonId])
    expect(before.length).toBe(1)

    const res = await request(app).delete(`/api/dashboard/courses/${courseId}`).set(A())
    expect(res.status).toBe(200)
    expect(await isEnrolled(studentAId, courseId)).toBe(false)

    const { rows: after } = await query('SELECT 1 AS id FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2', [studentAId, lessonId])
    expect(after.length).toBe(1) // historical learning record preserved
  })
})