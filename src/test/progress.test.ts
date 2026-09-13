import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

// ─── Phase 2 — course progress suite ──────────────────────────────────────────
// Real database. Verifies the progress flow end-to-end:
//   - completing a lesson records the completion and updates enrollment progress
//   - duplicate completion is idempotent (no double-count, no progress reduction)
//   - unenrolled / unknown lessons are rejected
//   - lessons-only courses renormalize to reach 100% (50/30/20 weights)
//   - progress is monotonic and persists (server-side, not frontend state)

const app = createApp()

let studentToken: string
let studentId: string
const createdCourseIds: string[] = []

function auth(token: string) {
  return { Authorization: `Bearer ${token}` }
}

async function createCourseWithLessons(title: string, lessonCount: number) {
  const { rows } = await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Phase 2 progress test course', 'mathematics', 'beginner',
             (SELECT id FROM users WHERE role = 'trainer' ORDER BY created_at LIMIT 1),
             'published', ARRAY[]::text[], 'free', 0, 'NGN', FALSE)
     RETURNING id`,
    [title]
  )
  const courseId = rows[0].id
  createdCourseIds.push(courseId)
  const { rows: moduleRows } = await query<{ id: string }>(
    `INSERT INTO modules (course_id, title, position) VALUES ($1, 'Phase 2 Module', 0) RETURNING id`,
    [courseId]
  )
  const moduleId = moduleRows[0].id
  const { rows: lessonRows } = await query<{ id: string }>(
    `INSERT INTO lessons (module_id, title, content, duration, position)
     SELECT $1, 'Phase 2 Lesson ' || i, 'Test lesson content', 10, i - 1
     FROM generate_series(1, $2) AS i RETURNING id`,
    [moduleId, lessonCount]
  )
  return { courseId, lessonIds: lessonRows.map(r => r.id) }
}

async function enroll(courseId: string) {
  const res = await request(app).post('/api/courses/enroll').set(auth(studentToken)).send({ courseIds: [courseId] })
  expect(res.status).toBe(201)
}

async function getProgress(courseId: string): Promise<number> {
  const { rows } = await query<{ progress: number }>(
    'SELECT progress FROM enrollments WHERE user_id = $1 AND course_id = $2',
    [studentId, courseId]
  )
  return rows[0] ? Number(rows[0].progress) : -1
}

async function completeLesson(lessonId: string) {
  return request(app).put(`/api/dashboard/lessons/${lessonId}/complete`).set(auth(studentToken))
}

beforeAll(async () => {
  const student = await request(app).post('/api/auth/login').send({ email: 'chidi@gmail.com', password: 'password123' })
  studentToken = student.body.data.token
  const me = await request(app).get('/api/profile').set(auth(studentToken))
  studentId = me.body.data.id
})

describe('progress: lesson completion endpoint', () => {
  it('200 — completing a lesson records the completion', async () => {
    const { courseId, lessonIds } = await createCourseWithLessons(`Phase2 Single ${Date.now()}`, 1)
    await enroll(courseId)
    const res = await completeLesson(lessonIds[0])
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('completed', true)
    const { rows } = await query<{ completed: string }>(
      'SELECT COUNT(*)::text AS completed FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [studentId, lessonIds[0]]
    )
    expect(Number(rows[0].completed)).toBe(1)
  })

  it('404 — completing a lesson for an unenrolled course is rejected', async () => {
    const { courseId, lessonIds } = await createCourseWithLessons(`Phase2 Unenrolled ${Date.now()}`, 1)
    await enroll(courseId)
    void courseId
    // A lesson from a course this student is NOT enrolled in:
    const other = await createCourseWithLessons(`Phase2 Other ${Date.now()}`, 1)
    const res = await completeLesson(other.lessonIds[0])
    expect(res.status).toBe(404)
    void lessonIds
  })

  it('404 — completing an unknown lesson is rejected', async () => {
    const res = await completeLesson('00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
  })

  it('200 — duplicate completion is idempotent (one row, same progress)', async () => {
    const { courseId, lessonIds } = await createCourseWithLessons(`Phase2 Dup ${Date.now()}`, 2)
    await enroll(courseId)
    const first = await completeLesson(lessonIds[0])
    expect(first.status).toBe(200)
    const progressAfterFirst = await getProgress(courseId)
    const second = await completeLesson(lessonIds[0])
    expect(second.status).toBe(200)
    const { rows } = await query<{ completed: string }>(
      'SELECT COUNT(*)::text AS completed FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2',
      [studentId, lessonIds[0]]
    )
    expect(Number(rows[0].completed)).toBe(1)
    expect(await getProgress(courseId)).toBe(progressAfterFirst)
  })
})

describe('progress: server-side recompute and monotonicity', () => {
  it('lessons-only course renormalizes — completing every lesson reaches 100%', async () => {
    const { courseId, lessonIds } = await createCourseWithLessons(`Phase2 Renorm ${Date.now()}`, 3)
    await enroll(courseId)
    expect(await getProgress(courseId)).toBeLessThan(100)
    for (const lessonId of lessonIds) {
      const res = await completeLesson(lessonId)
      expect(res.status).toBe(200)
    }
    expect(await getProgress(courseId)).toBe(100)
  })

  it('progress increases in steps (2-lesson course: before → 50 → 100)', async () => {
    const { courseId, lessonIds } = await createCourseWithLessons(`Phase2 Steps ${Date.now()}`, 2)
    await enroll(courseId)
    const before = await getProgress(courseId)
    await completeLesson(lessonIds[0])
    const afterOne = await getProgress(courseId)
    await completeLesson(lessonIds[1])
    const afterTwo = await getProgress(courseId)
    expect(afterOne).toBeGreaterThan(before)
    expect(afterTwo).toBeGreaterThan(afterOne)
    expect(afterTwo).toBe(100)
  })

  it('is monotonic — recomputing after full completion never reduces progress', async () => {
    const { courseId, lessonIds } = await createCourseWithLessons(`Phase2 Mono ${Date.now()}`, 1)
    await enroll(courseId)
    await completeLesson(lessonIds[0])
    const full = await getProgress(courseId)
    expect(full).toBe(100)
    await completeLesson(lessonIds[0])
    expect(await getProgress(courseId)).toBe(full)
  })

  it('persists — dashboard courses endpoint shows the same stored progress', async () => {
    const { courseId, lessonIds } = await createCourseWithLessons(`Phase2 Persist ${Date.now()}`, 1)
    await enroll(courseId)
    await completeLesson(lessonIds[0])
    const expected = await getProgress(courseId)
    const res = await request(app).get('/api/dashboard/courses').set(auth(studentToken))
    expect(res.status).toBe(200)
    const enrolled = (res.body.data as Array<{ id: string; progress: number }>).find(c => c.id === courseId)
    expect(enrolled).toBeDefined()
    expect(Number(enrolled!.progress)).toBe(expected)
  })
})

afterAll(async () => {
  try {
    await query(`DELETE FROM lesson_completions WHERE user_id = $1 AND lesson_id IN (
      SELECT l.id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ANY($2::uuid[])
    )`, [studentId, createdCourseIds])
    await query('DELETE FROM courses WHERE id = ANY($1::uuid[])', [createdCourseIds])
  } catch { /* ignore cleanup errors in CI */ }
})

