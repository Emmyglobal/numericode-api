import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()

let studentToken: string
let trainerToken: string
let adminToken: string

beforeAll(async () => {
  const student = await request(app).post('/api/auth/login').send({ email: 'kolade@gmail.com', password: 'password123' })
  const trainer = await request(app).post('/api/auth/login').send({ email: 'trainer@numericode.com', password: 'password123' })
  const admin   = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numericode.com', password: 'password123' })

  studentToken = student.body.data.token
  trainerToken = trainer.body.data.token
  adminToken   = admin.body.data.token
})

describe('Role-Based Access Control', () => {
  // ── No token ────────────────────────────────────────────────────────────
  it('rejects /api/dashboard with no token', async () => {
    const res = await request(app).get('/api/dashboard')
    expect(res.status).toBe(401)
  })

  it('rejects /api/trainer/stats with no token', async () => {
    const res = await request(app).get('/api/trainer/stats')
    expect(res.status).toBe(401)
  })

  it('rejects /api/admin/stats with no token', async () => {
    const res = await request(app).get('/api/admin/stats')
    expect(res.status).toBe(401)
  })

  // ── Malformed token ─────────────────────────────────────────────────────
  it('rejects a malformed Authorization header', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', 'NotBearer xyz')
    expect(res.status).toBe(401)
  })

  it('rejects an invalid JWT', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', 'Bearer not-a-real-jwt')
    expect(res.status).toBe(401)
  })

  // ── Wrong role ──────────────────────────────────────────────────────────
  it('blocks a student from accessing trainer routes', async () => {
    const res = await request(app).get('/api/trainer/stats').set('Authorization', `Bearer ${studentToken}`)
    expect(res.status).toBe(403)
  })

  it('blocks a student from accessing admin routes', async () => {
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${studentToken}`)
    expect(res.status).toBe(403)
  })

  it('blocks a trainer from accessing admin routes', async () => {
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${trainerToken}`)
    expect(res.status).toBe(403)
  })

  it('blocks a trainer from accessing student dashboard routes', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', `Bearer ${trainerToken}`)
    expect(res.status).toBe(403)
  })

  it('blocks an admin from accessing student dashboard routes', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(403)
  })

  it('blocks an admin from accessing trainer routes', async () => {
    const res = await request(app).get('/api/trainer/stats').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(403)
  })

  // ── Correct role ────────────────────────────────────────────────────────
  it('allows a student to access student dashboard routes', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', `Bearer ${studentToken}`)
    expect(res.status).toBe(200)
  })

  it('allows a trainer to access trainer routes', async () => {
    const res = await request(app).get('/api/trainer/stats').set('Authorization', `Bearer ${trainerToken}`)
    expect(res.status).toBe(200)
  })

  it('allows an admin to access admin routes', async () => {
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})
