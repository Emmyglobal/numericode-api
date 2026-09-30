import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'
import { ensureSevenDayMathChallengeCourse, CHALLENGE_COURSE_TITLE } from '../db/seven-day-math-challenge'
import { CHALLENGE_WORK } from '../db/seven-day-math-challenge/work'
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
let dayOneLesson2Id: string
let dayOneQuizId: string
let dayOneQuiz2Id: string
let dayOneAssignmentId: string
let dayOneAssignment2Id: string

async function countRows(sql: string, params: unknown[] = []): Promise<number> {
  const { rows } = await query<{ n: string }>(sql, params)
  return Number(rows[0].n)
}

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
      ORDER BY m.position, l.position LIMIT 2`,
    [courseId],
  )
  dayOneLessonId = lessonRows[0].id
  // A second lesson, used to isolate the other half of the completion rule.
  dayOneLesson2Id = lessonRows[1].id

  const { rows: quizRows } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 LIMIT 1',
    [dayOneLessonId],
  )
  dayOneQuizId = quizRows[0].id

  const { rows: quiz2Rows } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 LIMIT 1',
    [dayOneLesson2Id],
  )
  dayOneQuiz2Id = quiz2Rows[0].id

  const { rows: assignmentRows } = await query<{ id: string }>(
    'SELECT id FROM assignments WHERE lesson_id = $1 LIMIT 1',
    [dayOneLessonId],
  )
  dayOneAssignmentId = assignmentRows[0].id

  const { rows: assignment2Rows } = await query<{ id: string }>(
    'SELECT id FROM assignments WHERE lesson_id = $1 LIMIT 1',
    [dayOneLesson2Id],
  )
  dayOneAssignment2Id = assignment2Rows[0].id

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
    await query('DELETE FROM submissions WHERE user_id = $1', [studentId])
    await query('DELETE FROM lesson_completions WHERE user_id = $1', [studentId])
    await query('DELETE FROM enrollments WHERE user_id = $1', [studentId])
    await query('DELETE FROM users WHERE id = $1', [studentId])
  }
  // Removing the course cascades to modules -> lessons -> quizzes -> questions
  // (every FK in that chain is ON DELETE CASCADE).
  if (courseId) await query('DELETE FROM courses WHERE id = $1', [courseId])
})

/** The quiz a lesson actually receives when seeded. */
const quizFor = (lesson: { title: string; quiz?: { questions: unknown[] } }) =>
  CHALLENGE_WORK[lesson.title]?.quiz ?? lesson.quiz

const ALL_LESSONS = MODULES.flatMap((m) => m.lessons)

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

  it('gives every lesson a quiz and an assignment', () => {
    // The seeded work is keyed by lesson title, so a typo would silently leave a
    // lesson with no graded work. Every one of the 25 must resolve.
    expect(ALL_LESSONS).toHaveLength(25)
    for (const lesson of ALL_LESSONS) {
      expect(CHALLENGE_WORK[lesson.title], `no work for "${lesson.title}"`).toBeTruthy()
      expect(quizFor(lesson), `no quiz for "${lesson.title}"`).toBeTruthy()
      expect(CHALLENGE_WORK[lesson.title].assignment, `no assignment for "${lesson.title}"`).toBeTruthy()
    }
  })

  it('keeps the per-day quiz sizes and adds a 3-question check elsewhere', () => {
    const dayQuizSizes = MODULES.map(
      (m) => m.lessons.find((l) => !CHALLENGE_WORK[l.title]?.quiz && l.quiz)?.quiz?.questions.length ?? 0,
    )
    expect(dayQuizSizes).toEqual([5, 5, 5, 5, 5, 10, 15])

    // Every other lesson carries a short 3-question check.
    const checkSizes = ALL_LESSONS
      .filter((l) => CHALLENGE_WORK[l.title]?.quiz)
      .map((l) => CHALLENGE_WORK[l.title].quiz!.questions.length)
    expect(checkSizes).toHaveLength(18)
    expect(new Set(checkSizes)).toEqual(new Set([3]))

    // Totals actually seeded: 25 quizzes, 50 + 18x3 = 104 questions.
    expect(ALL_LESSONS.filter((l) => quizFor(l))).toHaveLength(25)
    const totalQuestions = ALL_LESSONS.reduce(
      (sum, l) => sum + (quizFor(l)?.questions.length ?? 0),
      0,
    )
    expect(totalQuestions).toBe(104)
  })

  it('gives every assignment a description, marks and questions', () => {
    for (const lesson of ALL_LESSONS) {
      const assignment = CHALLENGE_WORK[lesson.title].assignment
      const where = assignment.title
      expect(assignment.title, where).toBeTruthy()
      expect(assignment.description.length, where).toBeGreaterThan(20)
      expect(assignment.totalMarks, where).toBeGreaterThan(0)
      expect(assignment.passingScore, where).toBeGreaterThan(0)
      expect(assignment.passingScore, where).toBeLessThan(assignment.totalMarks)
      expect(assignment.questions.length, where).toBeGreaterThanOrEqual(3)
      // Marks must add up to the stated total, or the grade screen will mislead.
      const marks = assignment.questions.reduce((sum, q) => sum + q.marks, 0)
      expect(marks, `${where}: marks ${marks} != totalMarks ${assignment.totalMarks}`).toBe(
        assignment.totalMarks,
      )
      for (const q of assignment.questions) {
        expect(q.id, where).toBeTruthy()
        expect(q.title.length, where).toBeGreaterThan(10)
        expect(['theory', 'subjective', 'file']).toContain(q.type)
        expect(q.marks, where).toBeGreaterThan(0)
      }
      // A far-future due date keeps this open self-paced course usable.
      expect(Date.parse(assignment.dueDate), where).toBeGreaterThan(Date.now())
    }
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
    for (const lesson of ALL_LESSONS) {
      for (const question of quizFor(lesson)?.questions ?? []) {
        const q = question as {
          questionText: string
          questionType: string
          options?: Array<{ id: string; isCorrect: boolean }>
          correctAnswer: string
          explanation?: string
        }
        expect(q.explanation, q.questionText).toBeTruthy()
        if (q.questionType === 'multiple_choice') {
          const correct = q.options?.filter((o) => o.isCorrect) ?? []
          expect(correct, q.questionText).toHaveLength(1)
          expect(
            q.options?.some((o) => o.id === q.correctAnswer && o.isCorrect),
            q.questionText,
          ).toBe(true)
        } else {
          expect(q.correctAnswer, q.questionText).toBeTruthy()
        }
      }
    }
  })
})

// ─── The student journey ──────────────────────────────────────────────────────

/** Counts the rows this course owns, so a second seed run can be compared. */
async function countCourseRows() {
  const { rows } = await query<{
    modules: string; lessons: string; quizzes: string; questions: string; assignments: string
  }>(
    `SELECT
       (SELECT COUNT(*)::text FROM modules m WHERE m.course_id = c.id) AS modules,
       (SELECT COUNT(*)::text FROM lessons l JOIN modules m ON m.id = l.module_id
         WHERE m.course_id = c.id) AS lessons,
       (SELECT COUNT(*)::text FROM quizzes q WHERE q.course_id = c.id) AS quizzes,
       (SELECT COUNT(*)::text FROM quiz_questions qq
          JOIN quizzes q ON q.id = qq.quiz_id WHERE q.course_id = c.id) AS questions,
       (SELECT COUNT(*)::text FROM assignments a WHERE a.course_id = c.id) AS assignments
     FROM courses c WHERE c.id = $1`,
    [courseId],
  )
  const row = rows[0]
  return {
    modules: Number(row.modules),
    lessons: Number(row.lessons),
    quizzes: Number(row.quizzes),
    questions: Number(row.questions),
    assignments: Number(row.assignments),
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

  it('refuses to complete a lesson with attached work until the work is done', async () => {
    // The first Day 1 lesson carries a 3-question quiz and an assignment, and the
    // product rule is that the work attached to THAT lesson must be submitted
    // before the lesson can be ticked off. Completing straight away is refused
    // with 409 and must not write a completion row.
    const premature = await request(app)
      .put(`/api/dashboard/lessons/${dayOneLessonId}/complete`)
      .set(auth(studentToken))
    expect(premature.status).toBe(409)
    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [studentId, dayOneLessonId],
    )).toBe(0)
  })

  it('lets the student take the lesson quiz and keeps the attempt', async () => {
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

    expect(await countRows(
      'SELECT COUNT(*) n FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2',
      [studentId, dayOneQuizId],
    )).toBe(1)
  })

  it('refuses to complete when the assignment is still pending, even with the quiz done', async () => {
    // Isolates the ASSIGNMENT half of the rule: the quiz attempt above exists, so
    // the only thing left outstanding on this lesson is the assignment. It must
    // still block, and must still write no completion row.
    const attempt = await request(app)
      .put(`/api/dashboard/lessons/${dayOneLessonId}/complete`)
      .set(auth(studentToken))
    expect(attempt.status).toBe(409)
    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [studentId, dayOneLessonId],
    )).toBe(0)
  })

  it('lets the student read and submit the lesson assignment', async () => {
    const detail = await request(app)
      .get(`/api/assignments/${dayOneAssignmentId}`)
      .set(auth(studentToken))
    expect(detail.status).toBe(200)
    expect(detail.body.data.questions.length).toBeGreaterThanOrEqual(3)

    const submit = await request(app)
      .post(`/api/assignments/${dayOneAssignmentId}/submission`)
      .set(auth(studentToken))
      .send({ content: 'Phase E Day 1 assignment answer.' })
    expect(submit.status).toBe(200)

    expect(await countRows(
      'SELECT COUNT(*) n FROM submissions WHERE user_id = $1 AND assignment_id = $2',
      [studentId, dayOneAssignmentId],
    )).toBe(1)
  })

  it('refuses to complete when the quiz is still pending, even with the assignment done', async () => {
    // Isolates the QUIZ half of the rule on a different lesson: the assignment
    // for lesson 2 is submitted first, so only its quiz is outstanding.
    const assignment = await request(app)
      .post(`/api/assignments/${dayOneAssignment2Id}/submission`)
      .set(auth(studentToken))
      .send({ content: 'Phase E Day 1 lesson 2 assignment answer.' })
    expect(assignment.status).toBe(200)

    const attempt = await request(app)
      .put(`/api/dashboard/lessons/${dayOneLesson2Id}/complete`)
      .set(auth(studentToken))
    expect(attempt.status).toBe(409)
    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [studentId, dayOneLesson2Id],
    )).toBe(0)

    // Sanity: lesson 2 really does have a quiz, so the block above is the quiz.
    expect(await countRows(
      'SELECT COUNT(*) n FROM quizzes WHERE lesson_id = $1',
      [dayOneLesson2Id],
    )).toBe(1)
  })

  it('records progress once the quiz and assignment are both done', async () => {
    const res = await request(app)
      .put(`/api/dashboard/lessons/${dayOneLessonId}/complete`)
      .set(auth(studentToken))
    expect(res.status).toBe(200)
    expect(res.body.data.completed).toBe(true)

    expect(await countRows(
      'SELECT COUNT(*) n FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [studentId, dayOneLessonId],
    )).toBe(1)
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
    expect(after.quizzes).toBe(25)
    expect(after.questions).toBe(104)
    expect(after.assignments).toBe(25)
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
