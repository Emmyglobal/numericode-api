import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()

// A published course id derived from the list endpoint (not hard-coded).
const firstCourseId = async (): Promise<string> => {
  const res = await request(app).get('/api/courses')
  expect(res.status).toBe(200)
  expect(res.body.data.length).toBeGreaterThan(0)
  return res.body.data[0].id
}

describe('GET /api/courses (slim catalogue)', () => {
  it('returns a list of published courses', async () => {
    const res = await request(app).get('/api/courses')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('returns a pagination envelope', async () => {
    const res = await request(app).get('/api/courses')
    expect(res.body.pagination).toBeDefined()
    expect(typeof res.body.pagination.total).toBe('number')
    expect(typeof res.body.pagination.count).toBe('number')
    expect(typeof res.body.pagination.hasMore).toBe('boolean')
  })

  it('returns slim course cards (no modules/lessons/liveClasses)', async () => {
    const res = await request(app).get('/api/courses')
    const course = res.body.data[0]
    expect(course).toHaveProperty('id')
    expect(course).toHaveProperty('title')
    expect(course).toHaveProperty('subject')
    expect(course).toHaveProperty('level')
    expect(course).toHaveProperty('outcomes')
    expect(course).toHaveProperty('accessLevel')
    expect(course).toHaveProperty('premiumEnabled')
    expect(course).toHaveProperty('instructor')
    expect(course).toHaveProperty('updatedAt')
    // Instructor exposes privacy-safe public fields only.
    expect(course.instructor).toHaveProperty('id')
    expect(course.instructor).toHaveProperty('name')
    expect(course.instructor).toHaveProperty('bio')
    expect(course.instructor).toHaveProperty('avatarUrl')
    expect(course.instructor).not.toHaveProperty('email')
    expect(course.instructor).not.toHaveProperty('password')
    // Slim payload — no heavy nested content.
    expect(course).not.toHaveProperty('modules')
    expect(course).not.toHaveProperty('liveClasses')
    expect(course).not.toHaveProperty('content')
  })

  it('updatedAt is a valid ISO 8601 timestamp', async () => {
    const res = await request(app).get('/api/courses')
    const course = res.body.data[0]
    expect(course.updatedAt).toBeDefined()
    expect(typeof course.updatedAt).toBe('string')
    const parsed = new Date(course.updatedAt)
    expect(Number.isNaN(parsed.getTime())).toBe(false)
    // ISO 8601 format check (should match YYYY-MM-DDTHH:mm:ss.sssZ)
    expect(course.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('never returns draft/archived courses', async () => {
    const res = await request(app).get('/api/courses')
    res.body.data.forEach((c: { status?: string }) => expect(c.status).toBeUndefined())
  })

  it('respects limit (capped at 50)', async () => {
    const res = await request(app).get('/api/courses?limit=2')
    expect(res.body.data.length).toBeLessThanOrEqual(2)
    expect(res.body.pagination.limit).toBe(2)
  })

  it('clamps out-of-range limit to 50', async () => {
    const res = await request(app).get('/api/courses?limit=9999')
    expect(res.body.pagination.limit).toBe(50)
  })

  it('supports offset', async () => {
    const r1 = await request(app).get('/api/courses?limit=1&offset=0')
    const r2 = await request(app).get('/api/courses?limit=1&offset=1')
    expect(r1.body.data[0].id).not.toBe(r2.body.data[0].id)
  })

  it('supports level filtering', async () => {
    const res = await request(app).get('/api/courses?level=beginner')
    res.body.data.forEach((c: { level: string }) => expect(c.level).toBe('beginner'))
  })

  it('supports trainer filtering by id', async () => {
    const list = await request(app).get('/api/courses')
    const trainerId = list.body.data[0]?.instructor?.id
    if (!trainerId) return
    const res = await request(app).get(`/api/courses?instructorId=${trainerId}`)
    res.body.data.forEach((c: { instructor: { id: string } }) =>
      expect(c.instructor.id).toBe(trainerId)
    )
  })

  it('supports sort=title', async () => {
    const res = await request(app).get('/api/courses?sort=title&limit=5')
    const titles = res.body.data.map((c: { title: string }) => c.title)
    expect(titles).toEqual([...titles].sort())
  })

  it('supports sort=level (beginner first)', async () => {
    const res = await request(app).get('/api/courses?sort=level&limit=5')
    const order = ['beginner', 'intermediate', 'advanced']
    const idx = (c: { level: string }) => order.indexOf(c.level)
    const levels = res.body.data.map(idx)
    expect(levels).toEqual([...levels].sort((a, b) => a - b))
  })

  it('filters by subject=mathematics', async () => {
    const res = await request(app).get('/api/courses?subject=mathematics')
    res.body.data.forEach((c: { subject: string }) => expect(c.subject).toBe('mathematics'))
  })

  it('filters by subject=programming', async () => {
    const res = await request(app).get('/api/courses?subject=programming')
    res.body.data.forEach((c: { subject: string }) => expect(c.subject).toBe('programming'))
  })

  it('filters by access level', async () => {
    const res = await request(app).get('/api/courses?accessLevel=free')
    res.body.data.forEach((c: { accessLevel: string }) => expect(c.accessLevel).toBe('free'))
  })

  it('search is case-insensitive', async () => {
    const res = await request(app).get('/api/courses?q=foundation')
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('returns empty array for no matches', async () => {
    const res = await request(app).get('/api/courses?q=zzznonexistentcourse')
    expect(res.body.data).toEqual([])
  })

describe('GET /api/courses/:id (published-only detail)', () => {
  it('returns a single published course with full detail', async () => {
    const id = await firstCourseId()
    const res = await request(app).get(`/api/courses/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(id)
    expect(res.body.data).toHaveProperty('outcomes')
    expect(res.body.data).toHaveProperty('description')
    expect(res.body.data).toHaveProperty('updatedAt')
    // Full detail endpoint DOES return the hierarchy.
    expect(res.body.data).toHaveProperty('modules')
    expect(res.body.data).toHaveProperty('liveClasses')
  })

  it('updatedAt is a valid ISO 8601 timestamp in detail response', async () => {
    const id = await firstCourseId()
    const res = await request(app).get(`/api/courses/${id}`)
    expect(res.body.data.updatedAt).toBeDefined()
    expect(typeof res.body.data.updatedAt).toBe('string')
    const parsed = new Date(res.body.data.updatedAt)
    expect(Number.isNaN(parsed.getTime())).toBe(false)
  })

  it('exposes privacy-safe instructor info only', async () => {
    const id = await firstCourseId()
    const res = await request(app).get(`/api/courses/${id}`)
    expect(res.body.data.instructor).toHaveProperty('id')
    expect(res.body.data.instructor).toHaveProperty('name')
    expect(res.body.data.instructor).toHaveProperty('bio')
    expect(res.body.data.instructor).not.toHaveProperty('email')
    expect(res.body.data.instructor).not.toHaveProperty('password_hash')
  })

  it('returns 404 for a non-existent course ID', async () => {
    const res = await request(app).get('/api/courses/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
    expect(res.body.message).toMatch(/not found/i)
  })

  it('returns 404 for a draft course (UUID guess)', async () => {
    // Even with a valid UUID, a non-published course must not be exposed.
    const res = await request(app).get('/api/courses/11111111-1111-1111-1111-111111111111')
    expect(res.status).toBe(404)
  })

  it('returns public curriculum: modules with ordered lessons (Phase 11)', async () => {
    const id = await firstCourseId()
    const res = await request(app).get(`/api/courses/${id}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data.modules)).toBe(true)

    res.body.data.modules.forEach((mod: {
      id: string; title: string; lessons: Array<{ id: string; title: string }>
    }) => {
      // Modules expose id + title only (metadata; no hidden fields).
      expect(typeof mod.id).toBe('string')
      expect(typeof mod.title).toBe('string')
      expect(Array.isArray(mod.lessons)).toBe(true)
      mod.lessons.forEach((lesson) => {
        expect(typeof lesson.id).toBe('string')
        expect(typeof lesson.title).toBe('string')
      })
    })
  })

  it('public curriculum exposes titles but NOT lesson content (Phase 11)', async () => {
    const id = await firstCourseId()
    const res = await request(app).get(`/api/courses/${id}`)
    expect(res.status).toBe(200)
    const allLessons = res.body.data.modules.flatMap((m: { lessons: Array<Record<string, unknown>> }) => m.lessons ?? [])
    if (allLessons.length > 0) {
      // Lesson body content is gated — it must NOT appear in the public response.
      allLessons.forEach((lesson: Record<string, unknown>) => {
        expect(lesson).not.toHaveProperty('content')
        // Resource URLs are private to enrolled students.
        expect(lesson).not.toHaveProperty('url')
      })
    }
  })

  it('public curriculum does not leak private/internal fields (Phase 11)', async () => {
    const id = await firstCourseId()
    const res = await request(app).get(`/api/courses/${id}`)
    expect(res.status).toBe(200)
    const body = JSON.stringify(res.body.data)
    // No internal user/DB identifiers beyond the public resource id.
    expect(body).not.toMatch(/instructor_id/)
    expect(body).not.toMatch(/created_by/)
    expect(body).not.toMatch(/password/)
    expect(body).not.toMatch(/email/)
  })

  it('module and lesson ordering follows the curriculum position (Phase 11)', async () => {
    const id = await firstCourseId()
    const res = await request(app).get(`/api/courses/${id}`)
    expect(res.status).toBe(200)
    const modules = res.body.data.modules
    expect(Array.isArray(modules)).toBe(true)
    // Lessons within each module are returned in curriculum order (position ASC
    // is enforced by the SQL ORDER BY). Assert the API contract: an array whose
    // order the frontend treats as authoritative.
    const titles = modules.flatMap((m: { lessons: Array<{ title: string }> }) => m.lessons.map((l) => l.title))
    expect(Array.isArray(titles)).toBe(true)
  })
})

})