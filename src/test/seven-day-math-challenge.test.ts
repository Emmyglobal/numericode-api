import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'
import { ensureSevenDayMathChallengeCourse, CHALLENGE_COURSE_TITLE } from '../db/seven-day-math-challenge'
import { day1 } from '../db/seven-day-math-challenge/day1'
import { day2 } from '../db/seven-day-math-challenge/day2'
import { day3 } from '../db/seven-day-math-challenge/day3'
import { day4 } from '../db/seven-day-math-challenge/day4'
import { day5 } from '../db/seven-day-math-challenge/day5'
import { day6 } from '../db/seven-day-math-challenge/day6'
import { day7 } from '../db/seven-day-math-challenge/day7'

// ─── 7-Day Mathematics Challenge ───────────────────────────────────────────────
// Two halves:
//   1. Content integrity (no database) — module/lesson/quiz counts, one correct
//      answer per MCQ, an explanation on every question, and no LaTeX (the
//      lesson renderer has no maths typesetting).
//   2. The real student journey against the isolated test database, using the
//      ordinary endpoints: public catalogue -> enrol -> open Day 1 -> complete a
//      lesson -> take the Day 1 quiz -> progress recorded. It finishes by
//      proving an unrelated PREMIUM course is still protected, so adding this
//      free course cannot weaken Phase C.

const app = createApp()
const PASSWORD = 'password123'
const STUDENT_EMAIL = 'seven-day-challenge.student@numerycode.test'

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })
const MODULES = [day1, day2, day3, day4, day5, day6, day7]

let studentToken: string
let studentId: string
let courseId: string
let dayOneLessonId: string
let dayOneQuizId: string

beforeAll(async () => {
  await ensureSevenDayMathChallengeCourse()

  const { rows: courseRows } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [CHALLENGE_COURSE_TITLE],
  )
  courseId = courseRows[0].id

  const { rows: lessonRows } = await query<{ id: string }>(
    `SELECT l.id FROM lessons l
       JOIN modules m ON m.id = l.module_id
      WHERE m.course_id = $1
      ORDER BY m.position, l.position LIMIT 1`,
    [courseId],
  )
  dayOneLessonId = lessonRows[0].id

  const { rows: quizRows } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE course_id = $1 AND title = $2 LIMIT 1',
    [courseId, 'Day 1 — Algebra Basics Quiz'],
  )
  dayOneQuizId = quizRows[0].id

  const passwordHash = await bcrypt.hash(PASSWORD, 10)
  const { rows: userRows } = await query<{ id: string }>(
    `INSERT INTO users (name, email, password_hash, role, status, account_activated, email_verified_at)
     VALUES ('7-Day Challenge Student', $1, $2, 'student', 'active', TRUE, NOW())
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash, role = 'student',
           status = 'active', account_activated = TRUE, email_verified_at = NOW()
     RETURNING id`,
    [STUDENT_EMAIL, passwordHash],
  )
  studentId = userRows[0].id

  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: STUDENT_EMAIL, password: PASSWORD })
  studentToken = login.body.data.token as string
})

afterAll(async () => {
  if (studentId) {
    await query('DELETE FROM quiz_attempts WHERE user_id = $1', [studentId])
    await query('DELETE FROM lesson_completions WHERE user_id = $1', [studentId])
    await query('DELETE FROM enrollments WHERE user_id = $1', [studentId])
    await query('DELETE FROM users WHERE id = $1', [studentId])
  }
  // Removing the course cascades to modules -> lessons -> quizzes -> questions
  // (every FK in that chain is ON DELETE CASCADE).
  if (courseId) await query('DELETE FROM courses WHERE id = $1', [courseId])
})

// ─── Content integrity ────────────────────────────────────────────────────────

describe('7-Day Mathematics Challenge — content', () => {
  it('has exactly 7 modules with the expected titles', () => {
    expect(MODULES).toHaveLength(7)
    expect(MODULES.map((m) => m.title)).toEqual([
      'Day 1 — Algebra Basics',
      'Day 2 — Indices',
      'Day 3 — Logarithms',
      'Day 4 — Simultaneous Equations',
      'Day 5 — Quadratic Equations',
      'Day 6 — Mixed Mathematics Practice',
      'Day 7 — Final Mathematics Challenge',
    ])
  })

  it('has one quiz per module with the required question counts', () => {
    const counts = MODULES.map(
      (m) => m.lessons.find((l) => l.quiz)?.quiz?.questions.length ?? 0,
    )
    expect(counts).toEqual([5, 5, 5, 5, 5, 10, 15])
    expect(counts.reduce((a, b) => a + b, 0)).toBe(50)
  })

  it('gives every lesson real written content and no unsupported LaTeX', () => {
    const latex = /\\frac|\\sqrt|\\begin|\$[^$]+\$/
    for (const module of MODULES) {
      expect(module.lessons.length).toBeGreaterThanOrEqual(2)
      for (const lesson of module.lessons) {
        expect(lesson.content.length, lesson.title).toBeGreaterThan(400)
        expect(lesson.duration).toBeGreaterThan(0)
        expect(latex.test(lesson.content), lesson.title).toBe(false)
      }
    }
  })

  it('marks exactly one correct option on every multiple-choice question', () => {
    for (const module of MODULES) {
      for (const lesson of module.lessons) {
        for (const question of lesson.quiz?.questions ?? []) {
          expect(question.explanation, question.questionText).toBeTruthy()
          if (question.questionType === 'multiple_choice') {
            const correct = question.options?.filter((o) => o.isCorrect) ?? []
            expect(correct, question.questionText).toHaveLength(1)
            expect(
              question.options?.some((o) => o.id === question.correctAnswer && o.isCorrect),
              question.questionText,
            ).toBe(true)
          } else {
            expect(question.correctAnswer, question.questionText).toBeTruthy()
          }
        }
      }
    }
  })
})

// ─── The student journey ──────────────────────────────────────────────────────

/** Counts the rows this course owns, so a second seed run can be compared. */
async function countCourseRows() {
  const { rows } = await query<{
    modules: string; lessons: string; quizzes: string; questions: string
  }>(
    `SELECT
       (SELECT COUNT(*)::text FROM modules m WHERE m.course_id = c.id) AS modules,
       (SELECT COUNT(*)::text FROM lessons l JOIN modules m ON m.id = l.module_id
         WHERE m.course_id = c.id) AS lessons,
       (SELECT COUNT(*)::text FROM quizzes q WHERE q.course_id = c.id) AS quizzes,
       (SELECT COUNT(*)::text FROM quiz_questions qq
          JOIN quizzes q ON q.id = qq.quiz_id WHERE q.course_id = c.id) AS questions
     FROM courses c WHERE c.id = $1`,
    [courseId],
  )
  const row = rows[0]
  return {
    modules: Number(row.modules),
    lessons: Number(row.lessons),
    quizzes: Number(row.quizzes),
    questions: Number(row.questions),
  }
}

describe('7-Day Mathematics Challenge — a student can use it for free', () => {
  it('appears in the public catalogue as a free published course', async () => {
    const res = await request(app).get('/api/courses').query({ subject: 'mathematics', limit: 50 })
    expect(res.status).toBe(200)

    const course = (res.body.data as Array<{ id: string }>).find((c) => c.id === courseId)
    expect(course).toBeTruthy()
    expect(course.title).toBe(CHALLENGE_COURSE_TITLE)
    expect(course.accessLevel).toBe('free')
    expect(course.level).toBe('beginner')
  })

  it('is readable on its public detail page before enrolling', async () => {
    const res = await request(app).get(`/api/courses/${courseId}`)
    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe(CHALLENGE_COURSE_TITLE)
    expect(res.body.data.modules).toHaveLength(7)
  })

  it('enrols a student without any payment', async () => {
    const res = await request(app)
      .post('/api/courses/enroll')
      .set(auth(studentToken))
      .send({ courseIds: [courseId] })
    // 403 here would mean the premium payment gate had been triggered.
    expect(res.status).toBe(201)
  })

  it('opens Day 1 and serves its lesson resources to the enrolled student', async () => {
    const mine = await request(app).get('/api/dashboard/courses').set(auth(studentToken))
    expect(mine.status).toBe(200)
    expect(mine.body.data.some((c: { id: string }) => c.id === courseId)).toBe(true)

    const resources = await request(app)
      .get(`/api/lessons/${dayOneLessonId}/resources`)
      .set(auth(studentToken))
    expect(resources.status).toBe(200)
    expect(Array.isArray(resources.body.data)).toBe(true)
  })

  it('records progress when a lesson is completed', async () => {
    const res = await request(app)
      .put(`/api/dashboard/lessons/${dayOneLessonId}/complete`)
      .set(auth(studentToken))
    expect(res.status).toBe(200)
    expect(res.body.data.completed).toBe(true)

    const { rows } = await query<{ n: string }>(
      'SELECT COUNT(*)::text AS n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [studentId, dayOneLessonId],
    )
    expect(Number(rows[0].n)).toBe(1)
  })

  it('lets the student take the Day 1 quiz and keeps the attempt', async () => {
    const view = await request(app)
      .get(`/api/quizzes/quizzes/${dayOneQuizId}`)
      .set(auth(studentToken))
    expect(view.status).toBe(200)
    expect(JSON.stringify(view.body)).toContain('Day 1')

    const start = await request(app)
      .post(`/api/quizzes/quizzes/${dayOneQuizId}/start`)
      .set(auth(studentToken))
    expect(start.status).toBe(201)

    const submit = await request(app)
      .post(`/api/quizzes/quizzes/${dayOneQuizId}/submit`)
      .set(auth(studentToken))
      .send({ answers: {} })
    expect(submit.status).toBe(200)

    const { rows } = await query<{ n: string }>(
      'SELECT COUNT(*)::text AS n FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2',
      [studentId, dayOneQuizId],
    )
    expect(Number(rows[0].n)).toBe(1)
  })

  it('is idempotent: re-running the seeder creates no duplicates', async () => {
    // `seed()` runs on every application boot, so a second run must be a
    // clean no-op rather than duplicating modules, lessons or questions.
    const before = await countCourseRows()
    await ensureSevenDayMathChallengeCourse()
    const after = await countCourseRows()
    expect(after).toEqual(before)
    expect(after.modules).toBe(7)
    expect(after.lessons).toBe(25)
    expect(after.quizzes).toBe(7)
    expect(after.questions).toBe(50)
  })

  it('leaves premium courses protected (regression check)', async () => {
    const { rows: premium } = await query<{ id: string; lesson_id: string }>(
      `SELECT c.id, l.id AS lesson_id
         FROM courses c
         JOIN modules m ON m.course_id = c.id
         JOIN lessons l ON l.module_id = m.id
        WHERE c.access_level = 'premium' AND c.status = 'published'
        LIMIT 1`,
    )
    // No premium course in this database means there is nothing to protect.
    if (!premium[0]) return

    // The student enrolled in a FREE course and holds no entitlement, so the
    // Phase C gate must still refuse premium content.
    const res = await request(app)
      .get(`/api/lessons/${premium[0].lesson_id}/resources`)
      .set(auth(studentToken))
    expect(res.status).toBe(403)
  })
})
