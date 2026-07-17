import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()
let trainerToken: string
let adminToken: string
let trainerId: string

beforeAll(async () => {
  const trainer = await request(app).post('/api/auth/login').send({ email: 'trainer@numericode.com', password: 'password123' })
  trainerToken = trainer.body.data.token
  trainerId    = trainer.body.data.user.id

  const admin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numericode.com', password: 'password123' })
  adminToken = admin.body.data.token
})

describe('Trainer Course CRUD', () => {
  let createdCourseId: string

  it('trainer can create a new draft course', async () => {
    const res = await request(app)
      .post('/api/trainer/courses')
      .set({ Authorization: `Bearer ${trainerToken}` })
      .send({ title: 'Test Course', description: 'A test course', subject: 'programming', level: 'beginner' })

    expect(res.status).toBe(201)
    expect(res.body.data.status).toBe('draft')
    createdCourseId = res.body.data.id
  })

  it('rejects course creation with missing fields', async () => {
    const res = await request(app)
      .post('/api/trainer/courses')
      .set({ Authorization: `Bearer ${trainerToken}` })
      .send({ title: 'Incomplete' })
    expect(res.status).toBe(400)
  })

  it('rejects an invalid subject', async () => {
    const res = await request(app)
      .post('/api/trainer/courses')
      .set({ Authorization: `Bearer ${trainerToken}` })
      .send({ title: 'X', description: 'Y', subject: 'history', level: 'beginner' })
    expect(res.status).toBe(400)
  })

  it('trainer can edit their own course', async () => {
    const res = await request(app)
      .put(`/api/trainer/courses/${createdCourseId}`)
      .set({ Authorization: `Bearer ${trainerToken}` })
      .send({ title: 'Updated Title' })
    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe('Updated Title')
  })

  it('trainer can publish their own draft course', async () => {
    const res = await request(app)
      .patch(`/api/trainer/courses/${createdCourseId}/status`)
      .set({ Authorization: `Bearer ${trainerToken}` })
      .send({ status: 'published' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('published')
  })

  it('published course is now visible on the public course list', async () => {
    const res = await request(app).get('/api/courses')
    expect(res.body.data.some((c: { id: string }) => c.id === createdCourseId)).toBe(true)
  })

  it('trainer can archive their own course', async () => {
    const res = await request(app)
      .patch(`/api/trainer/courses/${createdCourseId}/status`)
      .set({ Authorization: `Bearer ${trainerToken}` })
      .send({ status: 'archived' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('archived')
  })

  it('a second trainer cannot edit the first trainer\'s course', async () => {
    // Register + approve a second trainer
    const email = `second-trainer-${Date.now()}@example.com`
    await request(app).post('/api/auth/register').send({ name: 'Second Trainer', email, password: 'password123', role: 'trainer' })
    const usersRes = await request(app).get('/api/admin/users').set({ Authorization: `Bearer ${adminToken}` })
    const newUser = usersRes.body.data.find((u: { email: string }) => u.email === email)
    await request(app).patch(`/api/admin/users/${newUser.id}`).set({ Authorization: `Bearer ${adminToken}` }).send({ status: 'active' })
    const secondLogin = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    const secondToken = secondLogin.body.data.token

    const res = await request(app)
      .put(`/api/trainer/courses/${createdCourseId}`)
      .set({ Authorization: `Bearer ${secondToken}` })
      .send({ title: 'Hijacked Title' })
    expect(res.status).toBe(403)
  })

  it('a student cannot access trainer course-creation endpoints', async () => {
    const student = await request(app).post('/api/auth/login').send({ email: 'kolade@gmail.com', password: 'password123' })
    const res = await request(app)
      .post('/api/trainer/courses')
      .set({ Authorization: `Bearer ${student.body.data.token}` })
      .send({ title: 'X', description: 'Y', subject: 'mathematics', level: 'beginner' })
    expect(res.status).toBe(403)
  })
})

describe('Admin Course CRUD', () => {
  it('admin can create a course and assign a specific trainer', async () => {
    const res = await request(app)
      .post('/api/admin/courses')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({ title: 'Admin-Created Course', description: 'desc', subject: 'mathematics', level: 'advanced', instructorId: trainerId })
    expect(res.status).toBe(201)
    expect(res.body.data.status).toBe('draft')
    expect(res.body.data.instructor).toBeTypeOf('string')
  })

  it('rejects instructorId that is not a trainer', async () => {
    const student = await request(app).post('/api/auth/login').send({ email: 'kolade@gmail.com', password: 'password123' })
    const res = await request(app)
      .post('/api/admin/courses')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({ title: 'X', description: 'Y', subject: 'mathematics', level: 'beginner', instructorId: student.body.data.user.id })
    expect(res.status).toBe(400)
  })

  it('GET /api/admin/trainers lists only active trainers, for the assign dropdown', async () => {
    const res = await request(app).get('/api/admin/trainers').set({ Authorization: `Bearer ${adminToken}` })
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('admin can publish any course regardless of instructor', async () => {
    const coursesRes = await request(app).get('/api/admin/courses').set({ Authorization: `Bearer ${adminToken}` })
    const draft = coursesRes.body.data.find((c: { status: string }) => c.status === 'draft')
    const res = await request(app)
      .patch(`/api/admin/courses/${draft.id}/status`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({ status: 'published' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('published')
  })

  it('a trainer cannot access admin course-creation endpoints', async () => {
    const res = await request(app)
      .post('/api/admin/courses')
      .set({ Authorization: `Bearer ${trainerToken}` })
      .send({ title: 'X', description: 'Y', subject: 'mathematics', level: 'beginner', instructorId: trainerId })
    expect(res.status).toBe(403)
  })
})
