import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

const app = createApp()

let adminToken: string

beforeAll(async () => {
  const adminLogin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numerycode.com', password: 'password123' })
  adminToken = adminLogin.body.data.token
})

// Testimonial submission is a PUBLIC endpoint (no auth required) by design.
const basePayload = {
  name: 'Test Student',
  course: 'Foundation Mathematics',
  message: 'This is a genuine testimonial message of at least twenty characters.',
  consent: true,
}

describe('Testimonials — submission (public endpoint)', () => {
  it('201 — anyone can submit a testimonial', async () => {
    const res = await request(app).post('/api/testimonials').send({ ...basePayload, email: `pub-${Date.now()}@example.com` })
    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data.status).toBe('pending')
  })

  it('400 — missing name is rejected', async () => {
    const res = await request(app).post('/api/testimonials').send({ ...basePayload, email: `noname-${Date.now()}@example.com`, name: '' })
    expect(res.status).toBe(400)
  })

  it('400 — invalid email is rejected', async () => {
    const res = await request(app).post('/api/testimonials').send({ ...basePayload, email: 'not-an-email' })
    expect(res.status).toBe(400)
  })

  it('400 — message too short is rejected', async () => {
    const res = await request(app).post('/api/testimonials').send({ ...basePayload, email: `short-${Date.now()}@example.com`, message: 'too short' })
    expect(res.status).toBe(400)
  })

  it('400 — missing consent is rejected', async () => {
    const res = await request(app).post('/api/testimonials').send({ ...basePayload, email: `nc-${Date.now()}@example.com`, consent: false })
    expect(res.status).toBe(400)
  })

  it('409 — duplicate submission within 24h is rejected', async () => {
    const dupEmail = `dup-${Date.now()}@example.com`
    const payload = { ...basePayload, email: dupEmail, name: 'Dup' }
    const first = await request(app).post('/api/testimonials').send(payload)
    expect(first.status).toBe(201)
    const second = await request(app).post('/api/testimonials').send(payload)
    expect(second.status).toBe(409)
  })
})

describe('Testimonials — public list', () => {
  it('200 — returns approved testimonials', async () => {
    const res = await request(app).get('/api/testimonials')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('200 — never exposes email or status', async () => {
    const res = await request(app).get('/api/testimonials')
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).not.toHaveProperty('email')
      expect(res.body.data[0]).not.toHaveProperty('status')
    }
  })
})

describe('Testimonials — admin moderation', () => {
  it('403 — student cannot list all testimonials', async () => {
    const studentLogin = await request(app).post('/api/auth/login').send({ email: 'chidi@gmail.com', password: 'password123' })
    const studentToken = studentLogin.body.data.token
    const res = await request(app).get('/api/testimonials/admin/all').set({ Authorization: `Bearer ${studentToken}` })
    expect(res.status).toBe(403)
  })

  it('403 — student cannot moderate a testimonial', async () => {
    const studentLogin = await request(app).post('/api/auth/login').send({ email: 'chidi@gmail.com', password: 'password123' })
    const studentToken = studentLogin.body.data.token
    const res = await request(app).patch('/api/testimonials/admin/00000000-0000-0000-0000-000000000000').set({ Authorization: `Bearer ${studentToken}` }).send({ status: 'approved' })
    expect(res.status).toBe(403)
  })

  it('200 — admin can list all testimonials', async () => {
    const res = await request(app).get('/api/testimonials/admin/all').set({ Authorization: `Bearer ${adminToken}` })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('200 — admin can approve a pending testimonial', async () => {
    const created = await request(app).post('/api/testimonials').send({ ...basePayload, email: `approve-${Date.now()}@example.com` })
    expect(created.status).toBe(201)
    const testimonialId = created.body.data.id
    const res = await request(app).patch(`/api/testimonials/admin/${testimonialId}`).set({ Authorization: `Bearer ${adminToken}` }).send({ status: 'approved' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('approved')
  })

  it('400 — invalid moderation status is rejected', async () => {
    const res = await request(app).patch('/api/testimonials/admin/00000000-0000-0000-0000-000000000000').set({ Authorization: `Bearer ${adminToken}` }).send({ status: 'published' })
    expect(res.status).toBe(400)
  })

  it('404 — moderating a non-existent testimonial returns 404', async () => {
    const res = await request(app).patch('/api/testimonials/admin/00000000-0000-0000-0000-000000000000').set({ Authorization: `Bearer ${adminToken}` }).send({ status: 'approved' })
    expect(res.status).toBe(404)
  })
})

afterAll(async () => {
  try {
    await query(`DELETE FROM testimonials WHERE email LIKE 'pub-%' OR email LIKE 'dup-%' OR email LIKE 'approve-%' OR email LIKE 'noname-%' OR email LIKE 'short-%' OR email LIKE 'nc-%'`)
  } catch { /* ignore cleanup errors in CI */ }
})