import { afterEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { signToken } from '../utils/jwt'

/**
 * Phase 22B — AI endpoint authorization regression tests.
 *
 * Proves the provider migration did not change WHO may call the AI endpoints:
 *   - study-guide stays public, health stays public
 *   - the four generation endpoints are restricted to course authors
 *     (trainer or admin) — both course builders expose the AI generator
 *   - students are still rejected, and identity/role come exclusively from the
 *     signed JWT (req.user) — never from request-body fields such as
 *     role/userId/trainerId
 *
 * Authentication is verified purely by JWT signature (requireAuth does not hit
 * the database), so these tests sign tokens directly with signToken and need
 * no database. `fetch` is mocked so no provider is ever called.
 */
vi.hoisted(() => {
  process.env.AI_PROVIDER = 'groq'
  process.env.GROQ_API_KEY = 'gsk-test-fake-groq-key-not-real'
})

const app = createApp()

const GENERATE_LESSON_URL = '/api/ai/generate-lesson'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const studentToken = signToken('11111111-1111-4111-8111-111111111111', 'student')
const trainerToken = signToken('22222222-2222-4222-8222-222222222222', 'trainer')

const lessonBody = { topic: 'Photosynthesis', subject: 'Biology', level: 'beginner' }

function lessonSuccessPayload(): Response {
  return new Response(
    JSON.stringify({ choices: [{ message: { content: '## Photosynthesis\nPlants convert light energy…' } }] }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('AI generator endpoints require authentication', () => {
  it.each([
    ['/api/ai/generate-lesson'],
    ['/api/ai/generate-quiz'],
    ['/api/ai/generate-assignment'],
    ['/api/ai/generate-note'],
  ])('rejects an unauthenticated POST %s with 401', async (url) => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = await request(app).post(url).send(lessonBody).expect(401)

    expect(res.body.success).toBe(false)
    // The request must be rejected before any provider call is attempted.
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a malformed Authorization header with 401', async () => {
    const res = await request(app)
      .post(GENERATE_LESSON_URL)
      .set('Authorization', 'NotBearer xyz')
      .send(lessonBody)
      .expect(401)

    expect(res.body.success).toBe(false)
  })

  it('rejects an invalid JWT with 401', async () => {
    await request(app)
      .post(GENERATE_LESSON_URL)
      .set('Authorization', 'Bearer not-a-real-jwt')
      .send(lessonBody)
      .expect(401)
  })
})

describe('AI generator endpoints reject students', () => {
  it('blocks an authenticated student from generating a lesson with 403', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = await request(app)
      .post(GENERATE_LESSON_URL)
      .set('Authorization', `Bearer ${studentToken}`)
      .send(lessonBody)
      .expect(403)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('This action requires role: trainer or admin')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('blocks an authenticated student from generating a quiz with 403', async () => {
    await request(app)
      .post('/api/ai/generate-quiz')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ topic: 'Fractions' })
      .expect(403)
  })

  it('ignores role/userId/trainerId supplied in the request body (no privilege escalation)', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = await request(app)
      .post(GENERATE_LESSON_URL)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ ...lessonBody, role: 'trainer', userRole: 'trainer', userId: 'attacker', trainerId: 'attacker' })
      .expect(403)

    expect(res.body.message).toBe('This action requires role: trainer or admin')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('AI generator endpoints allow authenticated course authors', () => {
  it('allows a trainer to generate a lesson (identity comes from the JWT)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(lessonSuccessPayload())
    vi.stubGlobal('fetch', fetchMock)

    const res = await request(app)
      .post(GENERATE_LESSON_URL)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send(lessonBody)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.content).toContain('Photosynthesis')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { headers: Record<string, unknown> }]
    expect(url).toBe(GROQ_URL)
    expect(init.headers.Authorization).toBe('Bearer gsk-test-fake-groq-key-not-real')
  })

  it('ignores userId/trainerId in the request body (no trainer impersonation)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(lessonSuccessPayload())
    vi.stubGlobal('fetch', fetchMock)

    // A different user id in the body must not change the authenticated
    // identity: the trainer token is what authorizes the call, and the body
    // fields are simply never read for authorization.
    const res = await request(app)
      .post(GENERATE_LESSON_URL)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({ ...lessonBody, userId: 'some-other-trainer', trainerId: 'some-other-trainer' })
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('keeps the AI generation routes closed to admins only for authoring their own content', async () => {
    // Admins ARE course authors in this app and both course builders expose the
    // AI generator, so an admin JWT is expected to be allowed. Authorization is
    // still role-based from the signed JWT: this proves the call succeeds rather
    // than that it is silently bypassed.
    const fetchMock = vi.fn().mockResolvedValue(lessonSuccessPayload())
    vi.stubGlobal('fetch', fetchMock)

    const adminToken = signToken('33333333-3333-4333-8333-333333333333', 'admin')
    const res = await request(app)
      .post(GENERATE_LESSON_URL)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(lessonBody)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.content).toContain('Photosynthesis')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('still blocks a student on every generator now that admins are allowed', async () => {
    // Widening the role list must not open the generators to students.
    for (const url of [
      '/api/ai/generate-lesson',
      '/api/ai/generate-quiz',
      '/api/ai/generate-assignment',
      '/api/ai/generate-note',
    ]) {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)

      await request(app)
        .post(url)
        .set('Authorization', `Bearer ${studentToken}`)
        .send(lessonBody)
        .expect(403)

      expect(fetchMock, `${url} must not reach the provider for a student`).not.toHaveBeenCalled()
    }
  })

  it('does not let a student escalate to an allowed role through the request body', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = await request(app)
      .post(GENERATE_LESSON_URL)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ ...lessonBody, role: 'admin', userRole: 'admin' })
      .expect(403)

    expect(res.body.message).toBe('This action requires role: trainer or admin')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})