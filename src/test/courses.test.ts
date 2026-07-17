import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()

describe('GET /api/courses', () => {
  it('returns a list of published courses', async () => {
    const res = await request(app).get('/api/courses')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('each course has the expected shape', async () => {
    const res = await request(app).get('/api/courses')
    const course = res.body.data[0]
    expect(course).toHaveProperty('id')
    expect(course).toHaveProperty('title')
    expect(course).toHaveProperty('subject')
    expect(course).toHaveProperty('level')
    expect(course).toHaveProperty('instructor')
    expect(course).toHaveProperty('modules')
    expect(course).toHaveProperty('liveClasses')
    expect(Array.isArray(course.modules)).toBe(true)
    expect(Array.isArray(course.liveClasses)).toBe(true)
  })

  it('filters by subject=mathematics', async () => {
    const res = await request(app).get('/api/courses?subject=mathematics')
    expect(res.status).toBe(200)
    res.body.data.forEach((c: { subject: string }) => expect(c.subject).toBe('mathematics'))
  })

  it('filters by subject=programming', async () => {
    const res = await request(app).get('/api/courses?subject=programming')
    res.body.data.forEach((c: { subject: string }) => expect(c.subject).toBe('programming'))
  })

  it('filters by search query', async () => {
    const res = await request(app).get('/api/courses?q=Foundation')
    expect(res.body.data.some((c: { title: string }) => c.title.includes('Foundation'))).toBe(true)
  })

  it('search is case-insensitive', async () => {
    const res = await request(app).get('/api/courses?q=foundation')
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('returns empty array for a query with no matches', async () => {
    const res = await request(app).get('/api/courses?q=zzznonexistentcourse')
    expect(res.body.data).toEqual([])
  })
})

describe('GET /api/courses/:id', () => {
  it('returns a single course with full detail', async () => {
    const listRes = await request(app).get('/api/courses')
    const firstId = listRes.body.data[0].id

    const res = await request(app).get(`/api/courses/${firstId}`)
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(firstId)
    expect(res.body.data).toHaveProperty('outcomes')
    expect(res.body.data).toHaveProperty('description')
  })

  it('returns 404 for a non-existent course ID', async () => {
    const res = await request(app).get('/api/courses/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
    expect(res.body.message).toMatch(/not found/i)
  })
})
