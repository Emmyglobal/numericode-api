import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

// ─── Phase 20 — quiz & assessment security suite ──────────────────────────────
// Real database. Verifies the quiz access-control model:
//   - unauthenticated → 401
//   - authenticated but NOT enrolled → 403
//   - enrolled free student → allowed
//   - correct answers are NEVER exposed to students (answer-key leakage)
//   - scoring is server-authoritative (browser cannot inject score/passed)
//   - duplicate submissions are idempotent
//   - cross-course quiz access blocked

const app = createApp()

let studentToken: string
let trainerToken: string
let studentId: string
const createdQuizIds: string[] = []
const createdCourseIds: string[] = []

function auth(token: string) {
  return { Authorization: `Bearer ${token}` }
}
async function createQuizCourse() {
  const { rows } = await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Phase 20 quiz test course', 'mathematics', 'beginner',
             (SELECT id FROM users WHERE role = 'trainer' ORDER BY created_at LIMIT 1),
             'published', ARRAY[]::text[], 'free', 0, 'NGN', FALSE)
     RETURNING id`,
    [`Phase20 Quiz Course ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`]
  )
  createdCourseIds.push(rows[0].id)
  return rows[0].id
}

async function createQuizOnCourse(courseId: string, title: string) {
  const res = await request(app).post('/api/quizzes/quizzes').set(auth(trainerToken)).send({
    courseId,
    title,
    description: 'Phase 20 test quiz',
    passingScore: 70,
    maxAttempts: 2,
    shuffleQuestions: false,
    showResults: true,
    questions: [
      {
        questionText: 'What is 2 + 2?',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: '3', isCorrect: false },
          { id: 'b', text: '4', isCorrect: true },
          { id: 'c', text: '5', isCorrect: false },
          { id: 'd', text: '22', isCorrect: false },
        ],
        correctAnswer: 'b',
        points: 10,
        position: 0,
      },
      {
        questionText: 'True or false: 1 < 2',
        questionType: 'true_false',
        options: null,
        correctAnswer: 'true',
        points: 10,
        position: 1,
      },
    ],
  })
  expect(res.status).toBe(201)
  createdQuizIds.push(res.body.data.id)
  return { quiz: res.body.data, res }
}

async function enrollStudent(courseId: string) {
  const res = await request(app).post('/api/courses/enroll').set(auth(studentToken)).send({ courseIds: [courseId] })
  expect(res.status).toBe(201)
}

beforeAll(async () => {
  const student = await request(app).post('/api/auth/login').send({ email: 'chidi@gmail.com', password: 'password123' })
  const trainer = await request(app).post('/api/auth/login').send({ email: 'trainer@numerycode.com', password: 'password123' })
  studentToken = student.body.data.token
  trainerToken = trainer.body.data.token
  const me = await request(app).get('/api/profile').set(auth(studentToken))
  studentId = me.body.data.id
})

afterAll(async () => {
  if (createdQuizIds.length > 0) {
    await query('DELETE FROM quizzes WHERE id = ANY($1::uuid[])', [createdQuizIds])
  }
  if (createdCourseIds.length > 0) {
    await query('DELETE FROM courses WHERE id = ANY($1::uuid[])', [createdCourseIds])
  }
describe('quizzes: authorization', () => {
  it('401 — unauthenticated user cannot view, start, or submit a quiz', async () => {
    const courseId = await createQuizCourse()
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Auth Quiz')

    const view = await request(app).get(`/api/quizzes/quizzes/${quiz.id}`)
    expect(view.status).toBe(401)

    const start = await request(app).post(`/api/quizzes/quizzes/${quiz.id}/start`)
    expect(start.status).toBe(401)

    const submit = await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).send({ answers: {} })
    expect(submit.status).toBe(401)
  })

  it('403 — authenticated but NOT enrolled student cannot view a quiz', async () => {
    const courseId = await createQuizCourse()
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Unenrolled Quiz')
    const res = await request(app).get(`/api/quizzes/quizzes/${quiz.id}`).set(auth(studentToken))
    expect(res.status).toBe(403)
  })

  it('403 — authenticated but NOT enrolled student cannot start a quiz', async () => {
    const courseId = await createQuizCourse()
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Unenrolled Start')
    const res = await request(app).post(`/api/quizzes/quizzes/${quiz.id}/start`).set(auth(studentToken))
    expect(res.status).toBe(403)
  })

  it('403 — authenticated but NOT enrolled student cannot submit a quiz', async () => {
    const courseId = await createQuizCourse()
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Unenrolled Submit')
    const res = await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({ answers: {} })
    expect(res.status).toBe(403)
  })

  it('403 — cross-course access: quiz from an unenrolled course stays blocked', async () => {
    const courseA = await createQuizCourse()
    const courseB = await createQuizCourse()
    const { quiz } = await createQuizOnCourse(courseA, 'Phase20 Cross Course Quiz')
    await enrollStudent(courseB)
    const res = await request(app).get(`/api/quizzes/quizzes/${quiz.id}`).set(auth(studentToken))
    expect(res.status).toBe(403)
  })

  it('200 — enrolled free student can view quiz and answer-key is NOT leaked', async () => {
    const courseId = await createQuizCourse()
    await enrollStudent(courseId)
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Enrolled View')
    const res = await request(app).get(`/api/quizzes/quizzes/${quiz.id}`).set(auth(studentToken))
    expect(res.status).toBe(200)
    expect(res.body.data.questions.length).toBe(2)
    for (const q of res.body.data.questions) {
      expect(q).not.toHaveProperty('correctAnswer')
      expect(q).not.toHaveProperty('correct_answer')
      if (q.questionType === 'multiple_choice') {
        for (const opt of q.options as Array<{ isCorrect?: boolean }>) {
          expect(opt.isCorrect).toBeUndefined()
        }
      }
    }
  })
})
})
describe('quizzes: grading authority & idempotency', () => {
  it('scores a fully-correct attempt at 100 and marks it passed', async () => {
    const courseId = await createQuizCourse()
    await enrollStudent(courseId)
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Correct Attempt')

    const { rows: qRows } = await query<{ id: string; options: unknown; question_type: string }>(
      'SELECT id, options, question_type FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quiz.id]
    )
    const answers: Record<string, unknown> = {}
    for (const q of qRows) {
      if (q.options) {
        const opts = q.options as Array<{ id: string; isCorrect: boolean }>
        const correct = opts.find(o => o.isCorrect)
        answers[q.id] = [correct!.id]
      } else {
        answers[q.id] = 'true'
      }
    }

    const submit = await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({ answers })
    expect(submit.status).toBe(200)
    expect(submit.body.data.score).toBe(100)
    expect(submit.body.data.passed).toBe(true)
  })

  it('scores a fully-wrong attempt at 0 and marks it not passed', async () => {
    const courseId = await createQuizCourse()
    await enrollStudent(courseId)
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Wrong Attempt')

    const { rows: qRows } = await query<{ id: string; options: unknown; question_type: string }>(
      'SELECT id, options, question_type FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quiz.id]
    )
    const answers: Record<string, unknown> = {}
    for (const q of qRows) {
      if (q.options) {
        const opts = q.options as Array<{ id: string; isCorrect: boolean }>
        const wrong = opts.find(o => !o.isCorrect)
        answers[q.id] = [wrong!.id]
      } else {
        answers[q.id] = 'false'
      }
    }

    const submit = await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({ answers })
    expect(submit.status).toBe(200)
    expect(submit.body.data.score).toBe(0)
    expect(submit.body.data.passed).toBe(false)
  })
it('ignores client-supplied score/passed and grades server-side only', async () => {
    const courseId = await createQuizCourse()
    await enrollStudent(courseId)
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Client Score Spoof')

    const { rows: qRows } = await query<{ id: string; options: unknown; question_type: string }>(
      'SELECT id, options, question_type FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quiz.id]
    )
    const answers: Record<string, unknown> = {}
    for (const q of qRows) {
      if (q.options) {
        const opts = q.options as Array<{ id: string; isCorrect: boolean }>
        const wrong = opts.find(o => !o.isCorrect)
        answers[q.id] = [wrong!.id]
      } else {
        answers[q.id] = 'false'
      }
    }

    const submit = await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({
      answers,
      score: 100,
      passed: true,
    })
    expect(submit.status).toBe(200)
    expect(submit.body.data.score).toBe(0)
    expect(submit.body.data.passed).toBe(false)
  })

  

    const courseId = await createQuizCourse()
    await enrollStudent(courseId)
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Idempotent Submit')

    const { rows: qRows } = await query<{ id: string; options: unknown; question_type: string }>(
      'SELECT id, options, question_type FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quiz.id]
    )
    const answers: Record<string, unknown> = {}
    for (const q of qRows) {
      if (q.options) {
        const opts = q.options as Array<{ id: string; isCorrect: boolean }>
        const correct = opts.find(o => o.isCorrect)
        answers[q.id] = [correct!.id]
      } else {
        answers[q.id] = 'true'
      }
    }

    await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({ answers })
    await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({ answers })
    await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({ answers })

    const { rows: attempts } = await query<{ completed_at: Date | null }>(
      `SELECT completed_at FROM quiz_attempts WHERE quiz_id = $1 AND user_id = $2 ORDER BY started_at`,
      [quiz.id, studentId]
    )
    expect(attempts.length).toBeGreaterThan(0)
    const completed = attempts.filter(a => a.completed_at !== null)
    expect(completed.length).toBe(1)
  })

  it('persists the attempt and shows it in attempt history', async () => {
    const courseId = await createQuizCourse()
    await enrollStudent(courseId)
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Attempt History')

    const { rows: qRows } = await query<{ id: string; options: unknown; question_type: string }>(
      'SELECT id, options, question_type FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quiz.id]
    )
    const answers: Record<string, unknown> = {}
    for (const q of qRows) {
      if (q.options) {
        const opts = q.options as Array<{ id: string; isCorrect: boolean }>
        const correct = opts.find(o => o.isCorrect)
        answers[q.id] = [correct!.id]
      } else {
        answers[q.id] = 'true'
      }
    }

    await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({ answers })

    const history = await request(app).get(`/api/quizzes/quizzes/${quiz.id}/attempts`).set(auth(studentToken))
    expect(history.status).toBe(200)
    expect(history.body.data.length).toBeGreaterThan(0)
    const completed = history.body.data.filter(a => a.completedAt)
    expect(completed.length).toBe(1)
    expect(completed[0].score).toBe(100)
    expect(completed[0].passed).toBe(true)
  })

  it('grades only real questions — unknown/foreign question ids are ignored', async () => {
    const courseId = await createQuizCourse()
    await enrollStudent(courseId)
    const { quiz } = await createQuizOnCourse(courseId, 'Phase20 Foreign Answer')

    const { rows: qRows } = await query<{ id: string; options: unknown; question_type: string }>(
      'SELECT id, options, question_type FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quiz.id]
    )
    const bogusAnswers: Record<string, unknown> = {
      'not-a-real-question-id': ['b'],
      [qRows[0].id]: ['b'], // correct answer for question 1
    }
    const submit = await request(app).post(`/api/quizzes/quizzes/${quiz.id}/submit`).set(auth(studentToken)).send({ answers: bogusAnswers })
    expect(submit.status).toBe(200)
    // q1 correct (10pts), q2 unanswered → 10/20 = 50%
    expect(submit.body.data.score).toBe(50)
  })
})