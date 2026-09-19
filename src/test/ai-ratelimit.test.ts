import { afterEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

/**
 * Phase 22B — AI rate limiter regression (test 35).
 *
 * Proves the in-memory IP limiter (20 requests / 15 minutes, shared by all AI
 * endpoints) is still enforced with the provider abstraction in place — the
 * 21st request must be rejected before any provider call is attempted.
 *
 * This lives in its OWN test file because vitest gives every file a fresh
 * module registry, so the limiter starts empty here and the 20-request budget
 * is not shared with the other AI test files.
 */
vi.hoisted(() => {
  process.env.AI_PROVIDER = 'groq'
  process.env.GROQ_API_KEY = 'gsk-test-fake-groq-key-not-real'
})

const app = createApp()

const STUDY_GUIDE_URL = '/api/ai/study-guide'
const FREE_LIMIT = 20

function successPayload(answer: string): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content: answer } }] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('AI rate limiting survives the provider abstraction', () => {
  it('allows the first 20 requests and rejects the 21st from the same IP with 429', async () => {
    // A Response body can only be read once, so build a FRESH Response per call —
    // mockResolvedValue would hand the same (already-consumed) object to every
    // request and make requests 2..20 look like malformed provider responses.
    const fetchMock = vi.fn().mockImplementation(async () => successPayload('ok'))
    vi.stubGlobal('fetch', fetchMock)

    for (let i = 1; i <= FREE_LIMIT; i++) {
      const res = await request(app)
        .post(STUDY_GUIDE_URL)
        .send({ message: `Question number ${i} about fractions` })
      expect(res.status).toBe(200)
    }

    // The 21st request from the same IP must be limited BEFORE the provider is called.
    const limited = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'One question too many' })
      .expect(429)

    expect(limited.body.success).toBe(false)
    expect(limited.body.message).toBe('Too many questions. Please try again in a few minutes.')
    // Exactly the 20 allowed requests reached the provider — the limited one did not.
    expect(fetchMock).toHaveBeenCalledTimes(FREE_LIMIT)
  })
})