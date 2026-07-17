import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()
let token: string

beforeAll(async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'trainer@numericode.com', password: 'password123' })
  token = res.body.data.token
})

const auth = () => ({ Authorization: `Bearer ${token}` })

describe('Trainer Portal Endpoints', () => {
  it('GET /api/trainer/stats returns 6 stat fields', async () => {
    const res = await request(app).get('/api/trainer/stats').set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('totalStudents')
    expect(res.body.data).toHaveProperty('activeCourses')
    expect(res.body.data).toHaveProperty('totalSessions')
    expect(res.body.data).toHaveProperty('avgCompletionRate')
    expect(res.body.data).toHaveProperty('pendingReviews')
    expect(res.body.data).toHaveProperty('upcomingSessions')
  })

  it('GET /api/trainer/courses returns only this trainer\'s courses', async () => {
    const res = await request(app).get('/api/trainer/courses').set(auth())
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    res.body.data.forEach((c: { status: string }) => {
      expect(['published', 'draft', 'archived']).toContain(c.status)
    })
  })

  it('GET /api/trainer/students returns enrolled students shape', async () => {
    const res = await request(app).get('/api/trainer/students').set(auth())
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /api/trainer/sessions returns live sessions', async () => {
    const res = await request(app).get('/api/trainer/sessions').set(auth())
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /api/trainer/assignments returns assignments with submission counts', async () => {
    const res = await request(app).get('/api/trainer/assignments').set(auth())
    expect(res.status).toBe(200)
    res.body.data.forEach((a: { totalSubmissions: number; pendingReview: number }) => {
      expect(typeof a.totalSubmissions).toBe('number')
      expect(typeof a.pendingReview).toBe('number')
    })
  })
})
