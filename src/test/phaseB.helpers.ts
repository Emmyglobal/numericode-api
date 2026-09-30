import request from 'supertest'
import bcrypt from 'bcryptjs'
import { createApp } from '../app'
import { query } from '../db/pool'

// Shared fixtures for the Phase B object-level authorization suites.
// Two courses owned by two different trainers; one student enrolled in A.
export const app = createApp()
export const PASSWORD = 'password123'
export const RANDOM_UUID = '00000000-0000-4000-8000-000000000000'
export const UNKNOWN_UUID = RANDOM_UUID
export const NOT_A_UUID = 'not-a-uuid'

export const F: any = {}

export function auth(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function login(email: string): Promise<string> {
  const res = await request(app).post('/api/auth/login').send({ email, password: PASSWORD })
  if (res.status !== 200) throw new Error(`login failed for ${email}: ${JSON.stringify(res.body)}`)
  return res.body.data.token as string
}

async function ensureTrainer(name: string, email: string): Promise<string> {
  const { rows } = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', [email])
  if (rows.length > 0) return rows[0].id
  const hash = await bcrypt.hash(PASSWORD, 10)
  const { rows: [u] } = await query<{ id: string }>(
    `INSERT INTO users (name, email, password_hash, role, status, account_activated)
     VALUES ($1, $2, $3, 'trainer', 'active', TRUE) RETURNING id`,
    [name, email, hash]
  )
  F.createdUserIds.push(u.id)
  return u.id
}

async function userIdByEmail(email: string): Promise<string> {
  const { rows } = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', [email])
  if (!rows.length) throw new Error(`fixture user missing: ${email}`)
  return rows[0].id
}

async function createCourse(title: string, instructorId: string): Promise<string> {
  const { rows } = await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status,
                          outcomes, access_level, price_cents, currency, premium_enabled)
     VALUES ($1, 'Phase B fixture', 'mathematics', 'beginner', $2,
             'published', ARRAY[]::text[], 'free', 0, 'NGN', FALSE) RETURNING id`,
    [title, instructorId]
  )
  F.createdCourseIds.push(rows[0].id)
  return rows[0].id
}

async function insert(sql: string, params: unknown[]): Promise<string> {
  const { rows } = await query<{ id: string }>(sql, params)
  return rows[0].id
}

export async function countRows(sql: string, params: unknown[] = []): Promise<number> {
  const { rows } = await query<{ n: string | number }>(sql, params)
  return Number(rows[0].n)
}

export async function setupPhaseB() {
  F.createdCourseIds = []
  F.createdBadgeIds = []
  F.createdUserIds = []
  F.studentId = await userIdByEmail('kolade@gmail.com')
  F.otherStudentId = await userIdByEmail('amaka@gmail.com')
  F.ownerId = await userIdByEmail('trainer@numerycode.com')
  F.intruderId = await ensureTrainer('PhaseB Intruder', 'phaseb.intruder@numerycode.test')
  F.studentToken = await login('kolade@gmail.com')
  F.otherStudentToken = await login('amaka@gmail.com')
  F.ownerToken = await login('trainer@numerycode.com')
  F.intruderToken = await login('phaseb.intruder@numerycode.test')
  F.adminToken = await login('emmanuel@numerycode.com')
  F.courseA = await createCourse(`PhaseB A ${Date.now()}`, F.ownerId)
  F.courseB = await createCourse(`PhaseB B ${Date.now()}`, F.intruderId)
  await query(
    'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [F.studentId, F.courseA]
  )
  const due = new Date(Date.now() + 7 * 864e5).toISOString()
  F.assignmentA = await insert('INSERT INTO assignments (course_id, title, due_date) VALUES ($1,$2,$3) RETURNING id', [F.courseA, 'PA', due])
  F.assignmentB = await insert('INSERT INTO assignments (course_id, title, due_date) VALUES ($1,$2,$3) RETURNING id', [F.courseB, 'PB', due])
  F.submissionA = await insert(
    `INSERT INTO submissions (assignment_id, user_id, status, submitted_at, content) VALUES ($1,$2,'submitted',NOW(),'work') RETURNING id`,
    [F.assignmentA, F.studentId]
  )
  F.rubricA = await insert('INSERT INTO grading_rubrics (assignment_id, criteria_name, max_score, position) VALUES ($1,$2,10,0) RETURNING id', [F.assignmentA, 'RA'])
  F.rubricB = await insert('INSERT INTO grading_rubrics (assignment_id, criteria_name, max_score, position) VALUES ($1,$2,10,0) RETURNING id', [F.assignmentB, 'RB'])
  F.categoryA = await insert('INSERT INTO grade_categories (course_id, name, weight) VALUES ($1,$2,40) RETURNING id', [F.courseA, `PC ${Date.now()}`])
  F.badgeId = await insert('INSERT INTO badges (name, description, criteria) VALUES ($1,$2,$3) RETURNING id', [`PB ${Date.now()}`, 'fx', JSON.stringify({ type: 'manual' })])
  F.createdBadgeIds.push(F.badgeId)
  F.moduleA = await insert('INSERT INTO modules (course_id, title, position) VALUES ($1,$2,0) RETURNING id', [F.courseA, 'MA'])
  F.moduleB = await insert('INSERT INTO modules (course_id, title, position) VALUES ($1,$2,0) RETURNING id', [F.courseB, 'MB'])
  F.lessonA = await insert('INSERT INTO lessons (module_id, title, position) VALUES ($1,$2,0) RETURNING id', [F.moduleA, 'LA'])
  F.lessonB = await insert('INSERT INTO lessons (module_id, title, position) VALUES ($1,$2,0) RETURNING id', [F.moduleB, 'LB'])
  F.forumCategoryA = await insert('INSERT INTO forum_categories (course_id, name) VALUES ($1,$2) RETURNING id', [F.courseA, `PF ${Date.now()}`])
  F.threadByStudent = await insert('INSERT INTO forum_threads (category_id, user_id, title, body) VALUES ($1,$2,$3,$4) RETURNING id', [F.forumCategoryA, F.studentId, 'PT', 'q'])
}

export async function teardownPhaseB() {
  for (const id of F.createdCourseIds ?? []) await query('DELETE FROM courses WHERE id = $1', [id])
  for (const id of F.createdBadgeIds ?? []) await query('DELETE FROM badges WHERE id = $1', [id])
  for (const id of F.createdUserIds ?? []) await query('DELETE FROM users WHERE id = $1', [id])
}
