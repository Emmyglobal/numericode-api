import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

// ─── Phase 22C — lesson completion gate ───────────────────────────────────────
// Product rule: PUT /api/dashboard/lessons/:lessonId/complete only records a
// lesson completion once the student has SUBMITTED the work attached to THAT
// lesson:
//   - lesson-level quiz   → a quiz attempt with completed_at set
//   - lesson-level assignment → a submission (submitted_at set / status ≠ pending)
//
// Explicitly preserved:
//   - lessons with no attached work still complete as before
//   - course-level work (lesson_id NULL) never blocks an individual lesson
//   - 401 unauthenticated, 403 non-student, 404 unknown/not-enrolled

const app = createApp()

let studentToken: string
let otherStudentToken: string
let trainerToken: string
let studentId: string
let otherStudentId: string
let trainerId: string

const createdCourseIds: string[] = []

function auth(token: string) {
  return { Authorization: `Bearer ${token}` }
}

async function login(email: string) {
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  expect(res.status).toBe(200)
  return res.body.data.token as string
}

beforeAll(async () => {
  studentToken = await login('chidi@gmail.com')
  otherStudentToken = await login('kolade@gmail.com')
  trainerToken = await login('trainer@numerycode.com')

  studentId = (await request(app).get('/api/profile').set(auth(studentToken))).body.data.id
  otherStudentId = (await request(app).get('/api/profile').set(auth(otherStudentToken))).body.data.id
  trainerId = (await request(app).get('/api/trainer/profile').set(auth(trainerToken))).body.data.id
})

afterAll(async () => {
  if (createdCourseIds.length > 0) {
    await query('DELETE FROM courses WHERE id = ANY($1::uuid[])', [createdCourseIds])
  }
})

/** Fresh free course (owned by the trainer) with three lessons + two enrolments. */
async function setupCourse() {
  const { rows } = await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Phase 22C lesson gate course', 'mathematics', 'beginner', $2,
             'published', ARRAY[]::text[], 'free', 0, 'NGN', FALSE)
     RETURNING id`,
    [`Phase22C Gate Course ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, trainerId]
  )
  const courseId = rows[0].id
  createdCourseIds.push(courseId)

  const { rows: moduleRows } = await query<{ id: string }>(
    `INSERT INTO modules (course_id, title, position) VALUES ($1, 'Gate Module', 0) RETURNING id`,
    [courseId]
  )
  const { rows: lessonRows } = await query<{ id: string; title: string }>(
    `INSERT INTO lessons (module_id, title, content, duration, position)
     VALUES ($1, 'Plain Lesson', 'content', 10, 0),
            ($1, 'Quiz Lesson', 'content', 10, 1),
            ($1, 'Assignment Lesson', 'content', 10, 2)
     RETURNING id, title`,
    [moduleRows[0].id]
  )
  const lessonId = (title: string) => lessonRows.find(l => l.title === title)!.id

  for (const token of [studentToken, otherStudentToken]) {
    const res = await request(app).post('/api/courses/enroll').set(auth(token)).send({ courseIds: [courseId] })
    expect(res.status).toBe(201)
  }

  return {
    courseId,
    plain: lessonId('Plain Lesson'),
    quizLesson: lessonId('Quiz Lesson'),
    assignmentLesson: lessonId('Assignment Lesson'),
  }
}

/** Trainer-created quiz attached to a lesson (real endpoint, real questions). */
async function attachQuiz(courseId: string, lessonId: string, title: string) {
  const res = await request(app).post('/api/quizzes/quizzes').set(auth(trainerToken)).send({
    courseId,
    lessonId,
    title,
    description: 'Phase 22C gate quiz',
    passingScore: 70,
    maxAttempts: 3,
    shuffleQuestions: false,
    showResults: true,
    questions: [
      {
        questionText: 'What is 2 + 2?',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: '3', isCorrect: false },
          { id: 'b', text: '4', isCorrect: true },
        ],
        correctAnswer: 'b',
        points: 10,
        position: 0,
      },
    ],
  })
  expect(res.status).toBe(201)
  return res.body.data.id as string
}

/** Trainer-created assignment attached to a lesson (real endpoint). */
async function attachAssignment(lessonId: string, title: string) {
  const res = await request(app)
    .post(`/api/trainer/lessons/${lessonId}/assignment`)
    .set(auth(trainerToken))
    .send({ title, description: 'Phase 22C gate assignment', totalMarks: 100, passingScore: 50 })
  expect(res.status).toBe(201)
  return res.body.data.id as string
}

function completeLesson(lessonId: string, token = studentToken) {
  return request(app).put(`/api/dashboard/lessons/${lessonId}/complete`).set(auth(token))
}

async function completionCount(lessonId: string, userId = studentId) {
  const { rows } = await query<{ count: string }>(
    'SELECT COUNT(*) FROM lesson_completions WHERE lesson_id = $1 AND user_id = $2',
    [lessonId, userId]
  )
  return Number(rows[0].count)
}

async function progressOf(courseId: string, userId = studentId) {
  const { rows } = await query<{ progress: number }>(
    'SELECT progress FROM enrollments WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  )
  return rows[0] ? Number(rows[0].progress) : -1
}

/** Submits a fully-correct attempt through the real student quiz endpoint. */
async function submitQuizCorrectly(quizId: string, token = studentToken) {
  const { rows } = await query<{ id: string; options: unknown }>(
    'SELECT id, options FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
    [quizId]
  )
  const answers: Record<string, unknown> = {}
  for (const q of rows) {
    const opts = (q.options as Array<{ id: string; isCorrect: boolean }>) ?? []
    answers[q.id] = [opts.find(o => o.isCorrect)!.id]
  }
  const res = await request(app).post(`/api/quizzes/quizzes/${quizId}/submit`).set(auth(token)).send({ answers })
  expect(res.status).toBe(200)
  return res.body.data
}

function submitAssignment(assignmentId: string, token = studentToken) {
  return request(app)
    .post(`/api/assignments/${assignmentId}/submission`)
    .set(auth(token))
    .send({ content: 'Phase 22C gate submission', answers: [] })
}

describe('lesson completion gate — authorization is unchanged', () => {
  it('rejects an unauthenticated request with 401', async () => {
    const { plain } = await setupCourse()
    const res = await request(app).put(`/api/dashboard/lessons/${plain}/complete`).expect(401)
    expect(res.body.success).toBe(false)
  })

  it('rejects a non-student (trainer) with 403', async () => {
    const { plain } = await setupCourse()
    const res = await completeLesson(plain, trainerToken).expect(403)
    expect(res.body.success).toBe(false)
  })

  it('returns 404 for an unknown lesson and for a course the student is not enrolled in', async () => {
    const unknown = await completeLesson('00000000-0000-0000-0000-000000000000').expect(404)
    expect(unknown.body.success).toBe(false)

    // A course that exists but has no enrolment for this student.
    const { rows } = await query<{ id: string }>(
      `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
       VALUES ($1, 'Phase 22C unenrolled course', 'mathematics', 'beginner', $2,
               'published', ARRAY[]::text[], 'free', 0, 'NGN', FALSE)
       RETURNING id`,
      [`Phase22C Unenrolled ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, trainerId]
    )
    createdCourseIds.push(rows[0].id)
    const { rows: moduleRows } = await query<{ id: string }>(
      `INSERT INTO modules (course_id, title, position) VALUES ($1, 'M', 0) RETURNING id`,
      [rows[0].id]
    )
    const { rows: lessonRows } = await query<{ id: string }>(
      `INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, 'L', 'c', 5, 0) RETURNING id`,
      [moduleRows[0].id]
    )
    await completeLesson(lessonRows[0].id).expect(404)
  })
})

describe('lesson completion gate — lessons with no attached work (unchanged)', () => {
  it('records the completion and increases progress', async () => {
    const { courseId, plain } = await setupCourse()

    const res = await completeLesson(plain).expect(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toEqual({ lessonId: plain, completed: true })

    expect(await completionCount(plain)).toBe(1)
    expect(await progressOf(courseId)).toBeGreaterThan(0)
  })

  it('stays idempotent — a duplicate call does not double-count', async () => {
    const { plain } = await setupCourse()

    await completeLesson(plain).expect(200)
    const second = await completeLesson(plain).expect(200)
    expect(second.body.data.completed).toBe(true)

    expect(await completionCount(plain)).toBe(1)
  })
})

describe('lesson completion gate — lesson-attached quiz', () => {
  it('rejects with 409 until the quiz is submitted, and records nothing', async () => {
    const { courseId, quizLesson } = await setupCourse()
    await attachQuiz(courseId, quizLesson, 'Gate Quiz')

    const progressBefore = await progressOf(courseId)
    const res = await completeLesson(quizLesson).expect(409)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Submit the lesson quiz before marking this lesson complete.')
    expect(await completionCount(quizLesson)).toBe(0)
    expect(await progressOf(courseId)).toBe(progressBefore)
  })

  it('still rejects when the quiz was only started, never submitted', async () => {
    const { courseId, quizLesson } = await setupCourse()
    const quizId = await attachQuiz(courseId, quizLesson, 'Gate Quiz Started')

    const start = await request(app).post(`/api/quizzes/quizzes/${quizId}/start`).set(auth(studentToken))
    expect(start.status).toBe(201)

    await completeLesson(quizLesson).expect(409)
    expect(await completionCount(quizLesson)).toBe(0)
  })

  it('allows completion once the student submits the quiz (end-to-end)', async () => {
    const { courseId, quizLesson } = await setupCourse()
    const quizId = await attachQuiz(courseId, quizLesson, 'Gate Quiz Submitted')

    const result = await submitQuizCorrectly(quizId)
    expect(result.score).toBe(100)

    const res = await completeLesson(quizLesson).expect(200)
    expect(res.body.data.completed).toBe(true)
    expect(await completionCount(quizLesson)).toBe(1)
    expect(await progressOf(courseId)).toBeGreaterThan(0)
  })

  it('another student\'s attempt does not unlock this student\'s lesson', async () => {
    const { courseId, quizLesson } = await setupCourse()
    const quizId = await attachQuiz(courseId, quizLesson, 'Gate Quiz Other Student')

    await submitQuizCorrectly(quizId, otherStudentToken)

    await completeLesson(quizLesson).expect(409)
    expect(await completionCount(quizLesson)).toBe(0)
  })
})

describe('lesson completion gate — lesson-attached assignment', () => {
  it('rejects with 409 until the assignment is submitted', async () => {
    const { assignmentLesson } = await setupCourse()
    await attachAssignment(assignmentLesson, 'Gate Assignment')

    const res = await completeLesson(assignmentLesson).expect(409)
    expect(res.body.message).toBe('Submit the lesson assignment before marking this lesson complete.')
    expect(await completionCount(assignmentLesson)).toBe(0)
  })

  it('a pending (never submitted) submission row does not satisfy the gate', async () => {
    const { assignmentLesson } = await setupCourse()
    const assignmentId = await attachAssignment(assignmentLesson, 'Gate Assignment Pending')

    await query(
      `INSERT INTO submissions (assignment_id, user_id, status, submitted_at) VALUES ($1, $2, 'pending', NULL)`,
      [assignmentId, studentId]
    )

    await completeLesson(assignmentLesson).expect(409)
    expect(await completionCount(assignmentLesson)).toBe(0)
  })

  it('allows completion once the student submits the assignment (end-to-end)', async () => {
    const { courseId, assignmentLesson } = await setupCourse()
    const assignmentId = await attachAssignment(assignmentLesson, 'Gate Assignment Submitted')

    const submitted = await submitAssignment(assignmentId)
    expect(submitted.status).toBe(200)

    const res = await completeLesson(assignmentLesson).expect(200)
    expect(res.body.data.completed).toBe(true)
    expect(await completionCount(assignmentLesson)).toBe(1)
    expect(await progressOf(courseId)).toBeGreaterThan(0)
  })
})

describe('lesson completion gate — scoping rules', () => {
  it('course-level work (lesson_id NULL) never blocks an individual lesson', async () => {
    const { courseId, plain } = await setupCourse()

    // Course-level quiz via the real trainer endpoint (no lessonId).
    const quizRes = await request(app).post('/api/quizzes/quizzes').set(auth(trainerToken)).send({
      courseId,
      title: 'Course-level quiz',
      description: 'not attached to a lesson',
      passingScore: 70,
      maxAttempts: 1,
      questions: [
        {
          questionText: '1 + 1?', questionType: 'multiple_choice',
          options: [{ id: 'a', text: '2', isCorrect: true }, { id: 'b', text: '3', isCorrect: false }],
          correctAnswer: 'a', points: 10, position: 0,
        },
      ],
    })
    expect(quizRes.status).toBe(201)

    // Course-level assignment (lesson_id NULL) via SQL, since the trainer route
    // always attaches to a lesson.
    await query(
      `INSERT INTO assignments (course_id, title, description, due_date, total_marks, passing_score)
       VALUES ($1, 'Course-level assignment', '', NOW() + INTERVAL '7 days', 100, 50)`,
      [courseId]
    )

    await completeLesson(plain).expect(200)
    expect(await completionCount(plain)).toBe(1)
  })

  it('a quiz attached to a different lesson does not block this lesson', async () => {
    const { courseId, quizLesson, assignmentLesson } = await setupCourse()
    await attachQuiz(courseId, quizLesson, 'Other lesson quiz')

    const res = await completeLesson(assignmentLesson).expect(200)
    expect(res.body.data.completed).toBe(true)
  })

  it('requires BOTH when a quiz and an assignment are attached to the same lesson', async () => {
    const { courseId, quizLesson } = await setupCourse()
    const quizId = await attachQuiz(courseId, quizLesson, 'Combined gate quiz')
    const assignmentId = await attachAssignment(quizLesson, 'Combined gate assignment')

    const blocked = await completeLesson(quizLesson).expect(409)
    expect(blocked.body.message).toBe(
      'Submit the lesson quiz and the lesson assignment before marking this lesson complete.'
    )
    expect(await completionCount(quizLesson)).toBe(0)

    // Quiz submitted → assignment still pending → still blocked.
    await submitQuizCorrectly(quizId)
    const stillBlocked = await completeLesson(quizLesson).expect(409)
    expect(stillBlocked.body.message).toBe('Submit the lesson assignment before marking this lesson complete.')

    // Assignment submitted → the lesson may now be completed.
    const submitted = await submitAssignment(assignmentId)
    expect(submitted.status).toBe(200)
    await completeLesson(quizLesson).expect(200)
    expect(await completionCount(quizLesson)).toBe(1)
  })
})
