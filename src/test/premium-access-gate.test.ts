import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

// ─── Phase C — premium course access gate ─────────────────────────────────────
// Requirement: premium course content (lesson resources, assignment details,
// lesson completion, assignment submission, quiz content/attempts) is only
// served to a student who holds the canonical entitlement — a VERIFIED payment
// for that course or an ACTIVE, unexpired subscription — on a course that is
// premium (access_level='premium') and still has premium_enabled=TRUE. Free
// courses keep their existing behaviour. Everything is decided server-side from
// the protected resource's own course, never from the request.
//
// Fixtures use real endpoints where a real flow exists (enrol, quiz/assignment
// creation) and direct rows only for the states a real flow cannot produce
// (a bare enrollment on a premium course, a pending/failed/refunded payment),
// following premium-enrollment-gate.test.ts.

const app = createApp()
const PASSWORD = 'password123'

const UNENTITLED_EMAIL = 'phasec.unentitled@numerycode.test'
const ENTITLED_EMAIL = 'phasec.entitled@numerycode.test'
const TRAINER_EMAIL = 'phasec.trainer@numerycode.test'
const OTHER_TRAINER_EMAIL = 'phasec.other-trainer@numerycode.test'
const ADMIN_EMAIL = 'phasec.admin@numerycode.test'

const REF_PREFIX = `PHASEC-${Date.now()}-`

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

const createdCourseIds: string[] = []
const createdLessonIds: string[] = []
const createdUserIds: string[] = []

// Actor tokens
let unentitledToken: string
let entitledToken: string
let trainerToken: string
let otherTrainerToken: string
let adminToken: string

// Ids
let unentitledId: string
let entitledId: string
let trainerId: string
let otherTrainerId: string

// Free course (owned by the main trainer) — existing behaviour must be preserved.
let freeCourse: string
let freeLesson: string
let freeAssignment: string

// Premium course A (owned by the main trainer) — the subject of the findings.
let premiumCourse: string
let premiumLesson: string
/** A premium lesson with no attached work, so completion is not gated by it. */
let premiumLessonPlain: string
const PREMIUM_RESOURCE_TITLE = 'PhaseC premium handout'
let premiumAssignment: string
let premiumQuiz: string
let freeQuiz: string
const PREMIUM_QUESTION_TEXT = 'PhaseC premium quiz question?'

// Premium course B (owned by the other trainer) — IDOR target.
let otherPremiumCourse: string
let otherPremiumLesson: string
let otherPremiumAssignment: string

async function upsertUser(name: string, email: string, role: 'student' | 'trainer' | 'admin'): Promise<string> {
  const passwordHash = await bcrypt.hash(PASSWORD, 10)
  const { rows } = await query<{ id: string }>(
    `INSERT INTO users (name, email, password_hash, role, status, account_activated, email_verified_at)
     VALUES ($1, $2, $3, $4, 'active', TRUE, NOW())
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role,
           status = 'active', account_activated = TRUE, email_verified_at = NOW()
     RETURNING id`,
    [name, email, passwordHash, role]
  )
  return rows[0].id
}

async function login(email: string): Promise<string> {
  const res = await request(app).post('/api/auth/login').send({ email, password: PASSWORD })
  if (res.status !== 200) throw new Error(`login failed for ${email}: ${JSON.stringify(res.body)}`)
  return res.body.data.token as string
}

async function createCourse(opts: {
  label: string; accessLevel: 'free' | 'premium'; premiumEnabled?: boolean; instructorId: string
}): Promise<string> {
  const { rows } = await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes,
                          access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Phase C premium access course', 'mathematics', 'beginner', $2, 'published',
             ARRAY[]::text[], $3, $4, 'NGN', $5)
     RETURNING id`,
    [
      `PhaseC ${opts.label} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      opts.instructorId,
      opts.accessLevel,
      opts.accessLevel === 'premium' ? 50000 : 0,
      opts.premiumEnabled ?? true,
    ]
  )
  createdCourseIds.push(rows[0].id)
  return rows[0].id
}

async function addLesson(courseId: string, title: string): Promise<string> {
  // `modules` is UNIQUE(course_id, position) and `lessons` is
  // UNIQUE(module_id, position), so each lesson needs its own slot or the second
  // call for the same course raises 23505.
  const { rows: slot } = await query<{ position: number }>(
    'SELECT COALESCE(MAX("position"), -1) + 1 AS position FROM modules WHERE course_id = $1',
    [courseId]
  )
  const { rows: moduleRows } = await query<{ id: string }>(
    `INSERT INTO modules (course_id, title, "position") VALUES ($1, $2, $3) RETURNING id`,
    [courseId, `${title} module`, slot[0].position]
  )
  const { rows } = await query<{ id: string }>(
    `INSERT INTO lessons (module_id, title, content, duration, "position")
     VALUES ($1, $2, 'PhaseC protected lesson body', 10, 0) RETURNING id`,
    [moduleRows[0].id, title]
  )
  createdLessonIds.push(rows[0].id)
  return rows[0].id
}

async function attachResource(lessonId: string): Promise<void> {
  const res = await request(app).post('/api/resources').set(auth(trainerToken)).send({
    lessonId, title: PREMIUM_RESOURCE_TITLE, type: 'link', url: 'https://example.test/handout.pdf',
  })
  expect(res.status).toBe(201)
}

async function attachAssignment(lessonId: string, token: string, label: string): Promise<string> {
  const res = await request(app).post(`/api/trainer/lessons/${lessonId}/assignment`).set(auth(token)).send({
    title: `${label} assignment`, description: 'PhaseC protected assignment prompt',
    totalMarks: 100, passingScore: 50,
  })
  expect(res.status).toBe(201)
  return res.body.data.id as string
}

async function attachQuiz(courseId: string, lessonId: string, title: string): Promise<string> {
  const res = await request(app).post('/api/quizzes/quizzes').set(auth(trainerToken)).send({
    courseId, lessonId, title, description: 'PhaseC protected quiz', passingScore: 70, maxAttempts: 3,
    shuffleQuestions: false, showResults: true,
    questions: [{
      questionText: PREMIUM_QUESTION_TEXT, questionType: 'multiple_choice',
      options: [{ id: 'a', text: 'no', isCorrect: false }, { id: 'b', text: 'yes', isCorrect: true }],
      correctAnswer: 'b', points: 10, position: 0,
    }],
  })
  expect(res.status).toBe(201)
  return res.body.data.id as string
}

async function enroll(token: string, courseId: string): Promise<void> {
  const res = await request(app).post('/api/courses/enroll').set(auth(token)).send({ courseIds: [courseId] })
  expect(res.status).toBe(201)
}

/** A bare enrollment row: what an unpaid premium student has after paying nothing. */
async function enrollDirect(userId: string, courseId: string): Promise<void> {
  await query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, courseId])
}

async function insertPayment(userId: string, courseId: string, status: string): Promise<void> {
  await query(
    `INSERT INTO payments (user_id, course_id, reference, email, amount_subunits, currency, status, paid_at, verified_at)
     VALUES ($1, $2, $3, $4, 50000, 'NGN', $5::varchar,
             CASE WHEN $5::varchar = 'verified' THEN NOW() END,
             CASE WHEN $5::varchar = 'verified' THEN NOW() END)`,
    [userId, courseId, `NCP-${REF_PREFIX}${Math.random().toString(36).slice(2, 10)}`, ENTITLED_EMAIL, status]
  )
}

async function replacePayment(userId: string, courseId: string, status: string): Promise<void> {
  await query('DELETE FROM payments WHERE user_id = $1 AND course_id = $2', [userId, courseId])
  await insertPayment(userId, courseId, status)
}

async function insertSubscription(userId: string, status: string, endsAt: Date): Promise<void> {
  await query(
    `INSERT INTO subscriptions (user_id, plan_code, status, provider_reference, starts_at, ends_at)
     VALUES ($1, 'premium', $2, $3, NOW(), $4)`,
    [userId, status, `${REF_PREFIX}${Math.random().toString(36).slice(2, 10)}`, endsAt]
  )
}

async function replaceSubscription(userId: string, status: string, endsAt: Date): Promise<void> {
  await query('DELETE FROM subscriptions WHERE user_id = $1', [userId])
  await insertSubscription(userId, status, endsAt)
}

async function clearEntitlements(userId: string): Promise<void> {
  await query('DELETE FROM subscriptions WHERE user_id = $1', [userId])
  await query('DELETE FROM payments WHERE user_id = $1', [userId])
}

async function countRows(sql: string, params: unknown[] = []): Promise<number> {
  const { rows } = await query<{ n: string | number }>(sql, params)
  return Number(rows[0].n)
}

async function progressOf(userId: string, courseId: string): Promise<number> {
  const { rows } = await query<{ progress: number }>(
    'SELECT progress FROM enrollments WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  )
  return rows[0] ? Number(rows[0].progress) : -1
}

const futureDate = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
const pastDate = () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

beforeAll(async () => {
  unentitledId = await upsertUser('PhaseC Unentitled Student', UNENTITLED_EMAIL, 'student')
  entitledId = await upsertUser('PhaseC Entitled Student', ENTITLED_EMAIL, 'student')
  trainerId = await upsertUser('PhaseC Trainer', TRAINER_EMAIL, 'trainer')
  otherTrainerId = await upsertUser('PhaseC Other Trainer', OTHER_TRAINER_EMAIL, 'trainer')
  const adminId = await upsertUser('PhaseC Admin', ADMIN_EMAIL, 'admin')
  createdUserIds.push(unentitledId, entitledId, trainerId, otherTrainerId, adminId)

  // Isolation: no leftover entitlement or enrollment state from a previous run.
  for (const id of [unentitledId, entitledId, trainerId, otherTrainerId, adminId]) {
    await clearEntitlements(id)
    await query('DELETE FROM enrollments WHERE user_id = $1', [id])
    await query('DELETE FROM lesson_completions WHERE user_id = $1', [id])
    await query('DELETE FROM submissions WHERE user_id = $1', [id])
  }

  unentitledToken = await login(UNENTITLED_EMAIL)
  entitledToken = await login(ENTITLED_EMAIL)
  trainerToken = await login(TRAINER_EMAIL)
  otherTrainerToken = await login(OTHER_TRAINER_EMAIL)
  adminToken = await login(ADMIN_EMAIL)

  // Free course — enrolled through the real flow, no entitlement involved.
  freeCourse = await createCourse({ label: 'free', accessLevel: 'free', instructorId: trainerId })
  freeLesson = await addLesson(freeCourse, 'PhaseC free lesson')
  freeAssignment = await attachAssignment(freeLesson, trainerToken, 'PhaseC free')
  freeQuiz = await attachQuiz(freeCourse, freeLesson, 'PhaseC free quiz')
  await enroll(unentitledToken, freeCourse)

  // Premium course A, complete protected material.
  premiumCourse = await createCourse({ label: 'premium', accessLevel: 'premium', instructorId: trainerId })
  premiumLesson = await addLesson(premiumCourse, 'PhaseC premium lesson')
  premiumLessonPlain = await addLesson(premiumCourse, 'PhaseC premium lesson (no attached work)')
  await attachResource(premiumLesson)
  premiumAssignment = await attachAssignment(premiumLesson, trainerToken, 'PhaseC premium')
  premiumQuiz = await attachQuiz(premiumCourse, premiumLesson, 'PhaseC premium quiz')

  // Premium course B — another trainer's course, used for ID substitution.
  otherPremiumCourse = await createCourse({ label: 'premium B', accessLevel: 'premium', instructorId: otherTrainerId })
  otherPremiumLesson = await addLesson(otherPremiumCourse, 'PhaseC premium B lesson')
  otherPremiumAssignment = await attachAssignment(otherPremiumLesson, otherTrainerToken, 'PhaseC premium B')

  // Enrollment rows exist for BOTH students on both premium courses (the state a
  // student has after the course was free, or after a manual/admin enrollment) —
  // an enrollment must never be enough on a premium course.
  await enrollDirect(unentitledId, premiumCourse)
  await enrollDirect(unentitledId, otherPremiumCourse)
  await enrollDirect(entitledId, premiumCourse)
  await enrollDirect(entitledId, otherPremiumCourse)

  // The only entitlement: a verified payment for premium course A.
  await insertPayment(entitledId, premiumCourse, 'verified')
})

afterAll(async () => {
  const users = createdUserIds
  const courses = createdCourseIds
  const lessons = createdLessonIds
  if (users.length) {
    await query('DELETE FROM lesson_completions WHERE user_id = ANY($1::uuid[])', [users])
    await query('DELETE FROM submissions WHERE user_id = ANY($1::uuid[])', [users])
    await query('DELETE FROM enrollments WHERE user_id = ANY($1::uuid[])', [users])
    await query('DELETE FROM payments WHERE user_id = ANY($1::uuid[])', [users])
    await query('DELETE FROM subscriptions WHERE user_id = ANY($1::uuid[])', [users])
  }
  if (courses.length) {
    await query('DELETE FROM quiz_attempts WHERE quiz_id IN (SELECT id FROM quizzes WHERE course_id = ANY($1::uuid[]))', [courses])
    await query('DELETE FROM quiz_questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE course_id = ANY($1::uuid[]))', [courses])
    await query('DELETE FROM quizzes WHERE course_id = ANY($1::uuid[])', [courses])
    await query('DELETE FROM assignments WHERE course_id = ANY($1::uuid[])', [courses])
    await query('DELETE FROM modules WHERE course_id = ANY($1::uuid[])', [courses])
    await query('DELETE FROM courses WHERE id = ANY($1::uuid[])', [courses])
  }
  if (lessons.length) {
    await query('DELETE FROM resources WHERE lesson_id = ANY($1::uuid[])', [lessons])
    await query('DELETE FROM lesson_completions WHERE lesson_id = ANY($1::uuid[])', [lessons])
    await query('DELETE FROM lessons WHERE id = ANY($1::uuid[])', [lessons])
  }
  if (users.length) await query('DELETE FROM users WHERE id = ANY($1::uuid[])', [users])
})

// ─── H6 — lesson resources ───────────────────────────────────────────────────

const resourcesPath = (lessonId: string) => `/api/lessons/${lessonId}/resources`

describe('H6 — GET /api/lessons/:lessonId/resources', () => {
  it('rejects unauthenticated callers with 401', async () => {
    expect((await request(app).get(resourcesPath(premiumLesson))).status).toBe(401)
  })

  it('keeps a free course readable by its enrolled student', async () => {
    const res = await request(app).get(resourcesPath(freeLesson)).set(auth(unentitledToken))
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('denies a premium course to an enrolled student with no entitlement', async () => {
    const res = await request(app).get(resourcesPath(premiumLesson)).set(auth(unentitledToken))
    expect(res.status).toBe(403)
    expect(res.body.data).toBeNull()
    expect(JSON.stringify(res.body)).not.toContain(PREMIUM_RESOURCE_TITLE)
  })

  it('denies an enrolled student for every non-verified payment state', async () => {
    for (const status of ['pending', 'failed', 'abandoned', 'refunded', 'disputed']) {
      await replacePayment(unentitledId, premiumCourse, status)
      const res = await request(app).get(resourcesPath(premiumLesson)).set(auth(unentitledToken))
      expect(res.status, `payment status '${status}' must not grant access`).toBe(403)
      expect(res.body.data).toBeNull()
    }
    await query('DELETE FROM payments WHERE user_id = $1 AND course_id = $2', [unentitledId, premiumCourse])
  })

  it('allows a premium course with a verified payment', async () => {
    const res = await request(app).get(resourcesPath(premiumLesson)).set(auth(entitledToken))
    expect(res.status).toBe(200)
    expect(res.body.data.map((r: { title: string }) => r.title)).toContain(PREMIUM_RESOURCE_TITLE)
  })

  it('allows a premium course with an active subscription and denies expired/cancelled ones', async () => {
    await insertSubscription(unentitledId, 'active', futureDate())
    expect((await request(app).get(resourcesPath(premiumLesson)).set(auth(unentitledToken))).status).toBe(200)

    await replaceSubscription(unentitledId, 'active', pastDate())
    expect((await request(app).get(resourcesPath(premiumLesson)).set(auth(unentitledToken))).status).toBe(403)

    await replaceSubscription(unentitledId, 'cancelled', futureDate())
    expect((await request(app).get(resourcesPath(premiumLesson)).set(auth(unentitledToken))).status).toBe(403)

    await query('DELETE FROM subscriptions WHERE user_id = $1', [unentitledId])
  })

  it('denies even a verified payer when premium access is switched off', async () => {
    const disabledCourse = await createCourse({ label: 'premium disabled', accessLevel: 'premium', premiumEnabled: false, instructorId: trainerId })
    const disabledLesson = await addLesson(disabledCourse, 'PhaseC disabled premium lesson')
    await enrollDirect(unentitledId, disabledCourse)
    await insertPayment(unentitledId, disabledCourse, 'verified')

    const res = await request(app).get(resourcesPath(disabledLesson)).set(auth(unentitledToken))
    expect(res.status).toBe(403)

    await query('DELETE FROM payments WHERE user_id = $1 AND course_id = $2', [unentitledId, disabledCourse])
    await query('DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2', [unentitledId, disabledCourse])
  })

  it("a student entitled to one premium course cannot read another course's resources", async () => {
    // entitledToken holds a verified payment for premiumCourse only.
    expect((await request(app).get(resourcesPath(premiumLesson)).set(auth(entitledToken))).status).toBe(200)
    const res = await request(app).get(resourcesPath(otherPremiumLesson)).set(auth(entitledToken))
    expect(res.status).toBe(403)
    expect(res.body.data).toBeNull()
  })

  it('returns 404 — never a driver error — for unknown and malformed lesson ids', async () => {
    expect((await request(app).get(resourcesPath('00000000-0000-4000-8000-000000000000')).set(auth(entitledToken))).status).toBe(404)
    expect((await request(app).get(resourcesPath('not-a-uuid')).set(auth(entitledToken))).status).toBe(404)
  })

  it('keeps trainer ownership and admin access intact', async () => {
    expect((await request(app).get(resourcesPath(premiumLesson)).set(auth(trainerToken))).status).toBe(200)
    expect((await request(app).get(resourcesPath(premiumLesson)).set(auth(adminToken))).status).toBe(200)
    expect((await request(app).get(resourcesPath(premiumLesson)).set(auth(otherTrainerToken))).status).toBe(403)
  })
})

// ─── M9 — assignment detail ──────────────────────────────────────────────────

const assignmentPath = (assignmentId: string) => `/api/assignments/${assignmentId}`
const completionPath = (lessonId: string) => `/api/dashboard/lessons/${lessonId}/complete`

describe('M9 — GET /api/assignments/:id', () => {
  it('rejects unauthenticated callers with 401 and trainers with 403', async () => {
    expect((await request(app).get(assignmentPath(premiumAssignment))).status).toBe(401)
    expect((await request(app).get(assignmentPath(premiumAssignment)).set(auth(trainerToken))).status).toBe(403)
    expect((await request(app).get(assignmentPath(premiumAssignment)).set(auth(adminToken))).status).toBe(403)
  })

  it('keeps a free course assignment readable by its enrolled student', async () => {
    const res = await request(app).get(assignmentPath(freeAssignment)).set(auth(unentitledToken))
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(freeAssignment)
    expect(res.body.data.title).toContain('PhaseC free')
  })

  it('denies a premium assignment to an enrolled but unentitled student', async () => {
    const res = await request(app).get(assignmentPath(premiumAssignment)).set(auth(unentitledToken))
    expect(res.status).toBe(404)
    expect(res.body.data).toBeNull()
    // The prompt must not leak through the denial payload.
    expect(JSON.stringify(res.body)).not.toContain('PhaseC protected assignment prompt')
  })

  it('denies for every non-verified payment state', async () => {
    for (const status of ['pending', 'failed', 'abandoned', 'refunded', 'disputed']) {
      await replacePayment(unentitledId, premiumCourse, status)
      const res = await request(app).get(assignmentPath(premiumAssignment)).set(auth(unentitledToken))
      expect(res.status, `payment status '${status}' must not grant access`).toBe(404)
    }
    await query('DELETE FROM payments WHERE user_id = $1 AND course_id = $2', [unentitledId, premiumCourse])
  })

  it('allows the detail with a verified payment, exactly like the assignment list', async () => {
    const res = await request(app).get(assignmentPath(premiumAssignment)).set(auth(entitledToken))
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(premiumAssignment)
    expect(res.body.data.description).toBe('PhaseC protected assignment prompt')
  })

  it("cannot read another course's assignment with an entitlement for a different course", async () => {
    const res = await request(app).get(assignmentPath(otherPremiumAssignment)).set(auth(entitledToken))
    expect(res.status).toBe(404)
    expect(res.body.data).toBeNull()
  })

  it('returns 404 — never a driver error — for unknown and malformed ids', async () => {
    expect((await request(app).get(assignmentPath('00000000-0000-4000-8000-000000000000')).set(auth(entitledToken))).status).toBe(404)
    expect((await request(app).get(assignmentPath('not-a-uuid')).set(auth(entitledToken))).status).toBe(404)
  })
})

// ─── M10 — lesson completion ─────────────────────────────────────────────────

describe('M10 — PUT /api/dashboard/lessons/:lessonId/complete', () => {
  it('rejects unauthenticated callers with 401 and trainers with 403', async () => {
    expect((await request(app).put(completionPath(premiumLessonPlain))).status).toBe(401)
    expect((await request(app).put(completionPath(premiumLessonPlain)).set(auth(trainerToken))).status).toBe(403)
  })

  it('keeps free-course completion working', async () => {
    // freeLesson carries an unsubmitted assignment + quiz, and the product rule
    // is that attached work must be submitted first: 409 here is the PRE-EXISTING
    // behaviour and must be preserved. A free lesson with nothing attached is
    // what actually completes.
    const pending = await request(app).put(completionPath(freeLesson)).set(auth(unentitledToken))
    expect(pending.status).toBe(409)

    const plainFreeLesson = await addLesson(freeCourse, 'PhaseC free lesson (no attached work)')
    const res = await request(app).put(completionPath(plainFreeLesson)).set(auth(unentitledToken))
    expect(res.status).toBe(200)
    expect(res.body.data.completed).toBe(true)
    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [unentitledId, plainFreeLesson]
    )).toBe(1)
    expect(await progressOf(unentitledId, freeCourse)).toBeGreaterThan(0)
  })

  it('denies premium completion without entitlement and mutates nothing', async () => {
    const before = await progressOf(unentitledId, premiumCourse)
    const res = await request(app).put(completionPath(premiumLessonPlain)).set(auth(unentitledToken))
    expect(res.status).toBe(403)
    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [unentitledId, premiumLessonPlain]
    )).toBe(0)
    expect(await progressOf(unentitledId, premiumCourse)).toBe(before)
  })

  it('denies for every non-verified payment state and mutates nothing', async () => {
    for (const status of ['pending', 'failed', 'abandoned', 'refunded', 'disputed']) {
      await replacePayment(unentitledId, premiumCourse, status)
      const res = await request(app).put(completionPath(premiumLessonPlain)).set(auth(unentitledToken))
      expect(res.status, `payment status '${status}' must not grant access`).toBe(403)
    }
    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [unentitledId, premiumLessonPlain]
    )).toBe(0)
    await query('DELETE FROM payments WHERE user_id = $1 AND course_id = $2', [unentitledId, premiumCourse])
  })

  it('allows premium completion with a verified payment', async () => {
    const res = await request(app).put(completionPath(premiumLessonPlain)).set(auth(entitledToken))
    expect(res.status).toBe(200)
    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [entitledId, premiumLessonPlain]
    )).toBe(1)
    expect(await progressOf(entitledId, premiumCourse)).toBeGreaterThan(0)
  })

  it('allows premium completion with an active subscription and stops once it lapses', async () => {
    await insertSubscription(unentitledId, 'active', futureDate())
    expect((await request(app).put(completionPath(premiumLessonPlain)).set(auth(unentitledToken))).status).toBe(200)

    await replaceSubscription(unentitledId, 'active', pastDate())
    expect((await request(app).put(completionPath(premiumLessonPlain)).set(auth(unentitledToken))).status).toBe(403)
    await query('DELETE FROM subscriptions WHERE user_id = $1', [unentitledId])
  })

  it("cannot complete another premium course's lesson", async () => {
    const res = await request(app).put(completionPath(otherPremiumLesson)).set(auth(entitledToken))
    expect(res.status).toBe(403)
    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [entitledId, otherPremiumLesson]
    )).toBe(0)
  })

  it('returns 404 for an unknown lesson', async () => {
    expect((await request(app).put(completionPath('00000000-0000-4000-8000-000000000000')).set(auth(entitledToken))).status).toBe(404)
  })
})

// ─── Adjacent student-learning endpoints (same class of bypass) ──────────────

describe('Adjacent — POST /api/assignments/:assignmentId/submission', () => {
  // NOTE the real path uses :assignmentId (assessments.routes.ts). The handler
  // answers 200 on success — that is its existing contract and is preserved.
  const submissionPath = (assignmentId: string) => `/api/assignments/${assignmentId}/submission`

  it('rejects unauthenticated callers and non-students', async () => {
    expect((await request(app).post(submissionPath(freeAssignment)).send({ content: 'x' })).status).toBe(401)
    expect((await request(app).post(submissionPath(freeAssignment)).set(auth(trainerToken)).send({ content: 'x' })).status).toBe(403)
  })

  it('keeps working for a free course', async () => {
    const res = await request(app).post(submissionPath(freeAssignment)).set(auth(unentitledToken)).send({ content: 'PhaseC free work' })
    expect(res.status).toBe(200)
    expect(await countRows(
      'SELECT COUNT(*) n FROM submissions WHERE user_id = $1 AND assignment_id = $2',
      [unentitledId, freeAssignment]
    )).toBe(1)
  })

  it('denies a premium course submission without entitlement and writes nothing', async () => {
    const res = await request(app).post(submissionPath(premiumAssignment)).set(auth(unentitledToken)).send({ content: 'PhaseC unpaid work' })
    expect(res.status).toBe(403)
    expect(await countRows(
      'SELECT COUNT(*) n FROM submissions WHERE user_id = $1 AND assignment_id = $2',
      [unentitledId, premiumAssignment]
    )).toBe(0)
  })

  it('denies for every non-verified payment state and writes nothing', async () => {
    for (const status of ['pending', 'failed', 'abandoned', 'refunded', 'disputed']) {
      await replacePayment(unentitledId, premiumCourse, status)
      const res = await request(app).post(submissionPath(premiumAssignment)).set(auth(unentitledToken)).send({ content: 'PhaseC unpaid work' })
      expect(res.status, `payment status '${status}' must not grant access`).toBe(403)
    }
    expect(await countRows(
      'SELECT COUNT(*) n FROM submissions WHERE user_id = $1 AND assignment_id = $2',
      [unentitledId, premiumAssignment]
    )).toBe(0)
    await query('DELETE FROM payments WHERE user_id = $1 AND course_id = $2', [unentitledId, premiumCourse])
  })

  it('allows a premium submission with a verified payment', async () => {
    const res = await request(app).post(submissionPath(premiumAssignment)).set(auth(entitledToken)).send({ content: 'PhaseC paid work' })
    expect(res.status).toBe(200)
    expect(await countRows(
      'SELECT COUNT(*) n FROM submissions WHERE user_id = $1 AND assignment_id = $2',
      [entitledId, premiumAssignment]
    )).toBe(1)
  })

  it("cannot submit to another premium course's assignment with an entitlement for a different course", async () => {
    const res = await request(app).post(submissionPath(otherPremiumAssignment)).set(auth(entitledToken)).send({ content: 'PhaseC cross-course' })
    expect(res.status).toBe(403)
    expect(await countRows(
      'SELECT COUNT(*) n FROM submissions WHERE user_id = $1 AND assignment_id = $2',
      [entitledId, otherPremiumAssignment]
    )).toBe(0)
  })
})

describe('Adjacent — quiz content, attempts and listings', () => {
  const quizPath = (quizId: string) => `/api/quizzes/quizzes/${quizId}`

  it('denies premium quiz content to an enrolled but unentitled student', async () => {
    const res = await request(app).get(quizPath(premiumQuiz)).set(auth(unentitledToken))
    expect(res.status).toBe(403)
    expect(res.body.data).toBeNull()
    expect(JSON.stringify(res.body)).not.toContain(PREMIUM_QUESTION_TEXT)
  })

  it('denies start, submit and attempt history without entitlement', async () => {
    expect((await request(app).post(`${quizPath(premiumQuiz)}/start`).set(auth(unentitledToken))).status).toBe(403)
    expect((await request(app).post(`${quizPath(premiumQuiz)}/submit`).set(auth(unentitledToken)).send({ answers: {} })).status).toBe(403)
    expect((await request(app).get(`${quizPath(premiumQuiz)}/attempts`).set(auth(unentitledToken))).status).toBe(403)
    expect(await countRows('SELECT COUNT(*) n FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2', [unentitledId, premiumQuiz])).toBe(0)
  })

  it('denies the lesson and course quiz listings without entitlement', async () => {
    expect((await request(app).get(`/api/quizzes/lessons/${premiumLesson}`).set(auth(unentitledToken))).status).toBe(403)
    expect((await request(app).get(`/api/quizzes/courses/${premiumCourse}/quizzes`).set(auth(unentitledToken))).status).toBe(403)
  })

  it('keeps free-course quiz access unchanged', async () => {
    expect((await request(app).get(quizPath(freeQuiz)).set(auth(unentitledToken))).status).toBe(200)
    expect((await request(app).get(`/api/quizzes/courses/${freeCourse}/quizzes`).set(auth(unentitledToken))).status).toBe(200)
    const start = await request(app).post(`${quizPath(freeQuiz)}/start`).set(auth(unentitledToken))
    expect(start.status).toBe(201)
  })

  it('allows the quiz end-to-end with a verified payment and never leaks the answer key', async () => {
    const view = await request(app).get(quizPath(premiumQuiz)).set(auth(entitledToken))
    expect(view.status).toBe(200)
    expect(JSON.stringify(view.body)).toContain(PREMIUM_QUESTION_TEXT)
    expect(JSON.stringify(view.body)).not.toContain('isCorrect')

    const start = await request(app).post(`${quizPath(premiumQuiz)}/start`).set(auth(entitledToken))
    expect(start.status).toBe(201)

    const submit = await request(app).post(`${quizPath(premiumQuiz)}/submit`).set(auth(entitledToken)).send({ answers: {} })
    expect(submit.status).toBe(200)

    expect((await request(app).get(`${quizPath(premiumQuiz)}/attempts`).set(auth(entitledToken))).status).toBe(200)
  })
})


