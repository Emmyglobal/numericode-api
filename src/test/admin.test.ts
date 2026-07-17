import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()
let token: string

beforeAll(async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numericode.com', password: 'password123' })
  token = res.body.data.token
})

const auth = () => ({ Authorization: `Bearer ${token}` })

describe('Admin Panel Endpoints', () => {
  it('GET /api/admin/stats returns 8 platform metrics', async () => {
    const res = await request(app).get('/api/admin/stats').set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('totalUsers')
    expect(res.body.data).toHaveProperty('totalStudents')
    expect(res.body.data).toHaveProperty('totalTrainers')
    expect(res.body.data).toHaveProperty('totalCourses')
    expect(res.body.data.totalUsers).toBeGreaterThan(0)
  })

  it('GET /api/admin/users returns all platform users', async () => {
    const res = await request(app).get('/api/admin/users').set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeGreaterThanOrEqual(7)
    res.body.data.forEach((u: { role: string; status: string }) => {
      expect(['student', 'trainer', 'admin']).toContain(u.role)
      expect(['active', 'suspended', 'pending']).toContain(u.status)
    })
  })

  it('PATCH /api/admin/users/:id updates a user\'s status', async () => {
    const usersRes = await request(app).get('/api/admin/users').set(auth())
    const targetUser = usersRes.body.data.find((u: { email: string }) => u.email === 'chidi@gmail.com')

    const res = await request(app)
      .patch(`/api/admin/users/${targetUser.id}`)
      .set(auth())
      .send({ status: 'suspended' })

    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('suspended')

    // Restore original status
    await request(app).patch(`/api/admin/users/${targetUser.id}`).set(auth()).send({ status: 'active' })
  })

  it('GET /api/admin/courses returns all courses with instructor names', async () => {
    const res = await request(app).get('/api/admin/courses').set(auth())
    expect(res.status).toBe(200)
    res.body.data.forEach((c: { instructor: string }) => {
      expect(typeof c.instructor).toBe('string')
      expect(c.instructor.length).toBeGreaterThan(0)
    })
  })

  it('GET /api/admin/announcements returns announcements with audience', async () => {
    const res = await request(app).get('/api/admin/announcements').set(auth())
    expect(res.status).toBe(200)
    res.body.data.forEach((a: { audience: string }) => {
      expect(['all', 'students', 'trainers']).toContain(a.audience)
    })
  })

  it('POST /api/admin/announcements creates a new announcement', async () => {
    const res = await request(app)
      .post('/api/admin/announcements')
      .set(auth())
      .send({ title: 'Test Announcement', body: 'This is a test.', audience: 'all' })

    expect(res.status).toBe(201)
    expect(res.body.data.title).toBe('Test Announcement')
    expect(res.body.data.audience).toBe('all')
  })

  it('POST /api/admin/announcements rejects missing title', async () => {
    const res = await request(app)
      .post('/api/admin/announcements')
      .set(auth())
      .send({ body: 'Missing title' })

    expect(res.status).toBe(400)
  })
})
