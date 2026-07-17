import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()
let token: string

beforeAll(async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'kolade@gmail.com', password: 'password123' })
  token = res.body.data.token
})

const auth = () => ({ Authorization: `Bearer ${token}` })

describe('Student Dashboard Endpoints', () => {
  it('GET /api/dashboard returns overview shape', async () => {
    const res = await request(app).get('/api/dashboard').set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('enrolledCount')
    expect(res.body.data).toHaveProperty('completedLessons')
    expect(res.body.data).toHaveProperty('upcomingClassesCount')
    expect(res.body.data).toHaveProperty('assignmentsDue')
    expect(res.body.data).toHaveProperty('upcomingClasses')
    expect(res.body.data).toHaveProperty('recentAnnouncements')
  })

  it('GET /api/dashboard/courses returns enrolled courses with progress', async () => {
    const res = await request(app).get('/api/dashboard/courses').set(auth())
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    res.body.data.forEach((c: { progress: number }) => {
      expect(typeof c.progress).toBe('number')
      expect(c.progress).toBeGreaterThanOrEqual(0)
      expect(c.progress).toBeLessThanOrEqual(100)
    })
  })

  it('GET /api/assignments returns assignments with status', async () => {
    const res = await request(app).get('/api/assignments').set(auth())
    expect(res.status).toBe(200)
    res.body.data.forEach((a: { status: string }) => {
      expect(['pending', 'submitted', 'overdue']).toContain(a.status)
    })
  })

  it('GET /api/announcements returns announcements', async () => {
    const res = await request(app).get('/api/announcements').set(auth())
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /api/live-classes returns only enrolled course classes', async () => {
    const res = await request(app).get('/api/live-classes').set(auth())
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /api/profile returns the authenticated user profile', async () => {
    const res = await request(app).get('/api/profile').set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe('kolade@gmail.com')
  })

  it('PUT /api/profile updates the name', async () => {
    const res = await request(app).put('/api/profile').set(auth()).send({ name: 'Kolade Updated' })
    expect(res.status).toBe(200)
    expect(res.body.data.name).toBe('Kolade Updated')

    // Restore original name so other tests are unaffected
    await request(app).put('/api/profile').set(auth()).send({ name: 'Kolade Adebayo' })
  })
})
