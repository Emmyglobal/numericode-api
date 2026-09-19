import { afterEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

/**
 * Phase 21 (D6) — AI assistant regression tests.
 *
 * Strategy:
 *   - `fetch` is mocked **at the network boundary** (globalThis.fetch) so the
 *     real OpenAI service is NEVER called and the real OPENAI_API_KEY is
 *     NEVER used — only the fake key below.
 *   - The actual Express app and the real AI controller/route are exercised
 *     through Supertest (POST /api/ai/study-guide, GET /api/ai/health).
 *   - Every failure mode the controller classifies is covered: provider
 *     401/403, 429 quota/rate-limit, 5xx outage, timeout (AbortError raised
 *     by a REAL AbortSignal.timeout), and network-level TypeError.
 *   - Every response is asserted to be "safe": success/failure shape is the
 *     standard API envelope and nothing about the provider, the key, the
 *     Authorization header, or the provider's error body leaks to the client.
 *
 * OPENAI_TIMEOUT_MS is lowered to 200 ms BEFORE the controller module is
 * imported (it is read once at module load) so the timeout test finishes fast.
 */
vi.hoisted(() => {
  process.env.OPENAI_TIMEOUT_MS = '200'
  // Phase 22B: pin the provider for this regression file. The test environment
  // loads .env via setup.ts, and AI_PROVIDER must be 'openai' here so the
  // OpenAI rollback provider (and this file's URL/header assertions) hold.
  process.env.AI_PROVIDER = 'openai'
  // Fake, obviously-invalid key. The real key (if present in the environment)
  // is deliberately overwritten — tests must never depend on or reveal it.
  process.env.OPENAI_API_KEY = 'sk-test-fake-key-not-real'
})

const app = createApp()

const STUDY_GUIDE_URL = '/api/ai/study-guide'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

/** Marker substrings that must NEVER appear in any client-facing response. */
const SECRET_MARKERS = [
  'sk-test-fake-key-not-real',
  'sk-',
  'Bearer ',
  'api.openai.com',
  'OPENAI_API_KEY',
  'Authorization',
]

function providerResponse(status: number, body: unknown = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** A successful OpenAI chat-completions payload. */
function successPayload(answer: string): Response {
  return providerResponse(200, {
    choices: [{ message: { content: answer } }],
  })
}

/** Assert the response leaks no provider internals/secrets. */
function expectNoSecretLeak(body: unknown): void {
  const serialized = JSON.stringify(body) ?? ''
  for (const marker of SECRET_MARKERS) {
    expect(serialized).not.toContain(marker)
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('AI assistant regression (D6)', () => {
  describe('GET /api/ai/health', () => {
    it('reports configuration without exposing any secret value', async () => {
      const res = await request(app).get('/api/ai/health').expect(200)

      expect(res.body.success).toBe(true)
      expect(res.body.data.configured).toBe(true)
      expect(res.body.data.provider).toBe('openai')
      expectNoSecretLeak(res.body)
    })
  })

  describe('POST /api/ai/study-guide — success path', () => {
    it('returns the assistant answer from a successful provider response', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        successPayload('Machine learning is a branch of AI that learns from data.'),
      )
      vi.stubGlobal('fetch', fetchMock)

      const res = await request(app)
        .post(STUDY_GUIDE_URL)
        .send({ message: 'What is machine learning?' })
        .expect(200)

      expect(res.body.success).toBe(true)
      expect(res.body.data.answer).toBe(
        'Machine learning is a branch of AI that learns from data.',
      )

      // The real provider endpoint was called exactly once, with the (fake)
      // key confined to the outbound Authorization header — and the AbortSignal
      // timeout was actually wired onto the outbound request.
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [url, init] = fetchMock.mock.calls[0]
      expect(url).toBe(OPENAI_URL)
      expect(init.method).toBe('POST')
      expect(init.headers.Authorization).toBe('Bearer sk-test-fake-key-not-real')
      expect(init.signal).toBeInstanceOf(AbortSignal)

      expectNoSecretLeak(res.body)
    })
  })
  describe('provider authentication failures (401/403)', () => {
    it('maps a provider 401 to 503 with a safe support message', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
        providerResponse(401, { error: { message: 'Incorrect API key provided: sk-XXXX' } }),
      ))

      const res = await request(app)
        .post(STUDY_GUIDE_URL)
        .send({ message: 'Explain fractions' })
        .expect(503)

      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe('AI authentication failed. Please contact support.')
      // The provider's error body (which includes a masked key fragment) must
      // never reach the client.
      expectNoSecretLeak(res.body)
      expect(res.body.message).not.toContain('Incorrect API key')
    })

    it('maps a provider 403 to 503 with the same safe support message', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
        providerResponse(403, { error: { message: 'Project does not have access' } }),
      ))

      const res = await request(app)
        .post(STUDY_GUIDE_URL)
        .send({ message: 'Explain algebra' })
        .expect(503)

      expect(res.body.message).toBe('AI authentication failed. Please contact support.')
      expectNoSecretLeak(res.body)
    })
  })

  describe('provider quota / rate limiting (429)', () => {
    it('maps a provider 429 to 429 with a retry-later message', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
        providerResponse(429, { error: { message: 'You exceeded your current quota' } }),
      ))

      const res = await request(app)
        .post(STUDY_GUIDE_URL)
        .send({ message: 'Explain geometry' })
        .expect(429)

      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe(
        'The AI service has reached its current request or credit limit. Please try again later.',
      )
      // The provider's quota/billing details must not leak.
      expectNoSecretLeak(res.body)
      expect(res.body.message).not.toContain('quota')
    })
  })

  describe('provider outages (5xx)', () => {
    it.each([500, 502, 503, 504])('maps a provider %d to 503 with a safe message', async (status) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
        providerResponse(status, { error: { message: 'internal provider error' } }),
      ))

      const res = await request(app)
        .post(STUDY_GUIDE_URL)
        .send({ message: 'Explain statistics' })
        .expect(503)

      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe(
        'The AI assistant is temporarily unavailable. Please try again shortly.',
      )
      expectNoSecretLeak(res.body)
    })
  })
  describe('timeout (AbortError from a real AbortSignal.timeout)', () => {
    it('returns 503 with the timeout message when the provider hangs past OPENAI_TIMEOUT_MS', async () => {
      // Simulates the real failure mode: the fetch promise only settles when
      // the AbortSignal created by AbortSignal.timeout(OPENAI_TIMEOUT_MS)
      // fires — i.e. the same mechanism used in production code.
      const fetchMock = vi.fn(
        (_url: unknown, init?: { signal?: AbortSignal }) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              const abortErr = new Error('This operation was aborted')
              abortErr.name = 'AbortError'
              reject(abortErr)
            })
          }),
      )
      vi.stubGlobal('fetch', fetchMock)

      const res = await request(app)
        .post(STUDY_GUIDE_URL)
        .send({ message: 'Explain physics' })
        .expect(503)

      expect(res.body.message).toBe(
        'The AI assistant is taking longer than expected. Please try again shortly.',
      )
      expectNoSecretLeak(res.body)
      // The abort signal was actually created by AbortSignal.timeout — by the
      // time the request completed it must have aborted within the 200 ms budget.
      const signal = fetchMock.mock.calls[0][1]?.signal as AbortSignal
      expect(signal.aborted).toBe(true)
    })
  })

  describe('network failure (TypeError at the fetch boundary)', () => {
    it('maps DNS/connection failures to 503 without leaking the host or socket error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(
        new TypeError('fetch failed: getaddrinfo ENOTFOUND api.openai.com'),
      ))

      const res = await request(app)
        .post(STUDY_GUIDE_URL)
        .send({ message: 'Explain biology' })
        .expect(503)

      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe(
        'The AI assistant is temporarily unavailable. Please try again shortly.',
      )
      // Neither the failing host nor the socket error text may leak.
      expectNoSecretLeak(res.body)
      expect(res.body.message).not.toContain('ENOTFOUND')
      expect(res.body.message).not.toContain('openai')
    })
  })

  describe('unconfigured provider', () => {
    it('returns 503 "not configured" when OPENAI_API_KEY is absent', async () => {
      const originalKey = process.env.OPENAI_API_KEY
      delete process.env.OPENAI_API_KEY
      try {
        const res = await request(app)
          .post(STUDY_GUIDE_URL)
          .send({ message: 'Explain chemistry' })
          .expect(503)

        expect(res.body.message).toBe('AI is not configured. Please contact support.')
        expectNoSecretLeak(res.body)
      } finally {
        process.env.OPENAI_API_KEY = originalKey
      }
    })
  })

  describe('input validation', () => {
    it('rejects an empty message before reaching the provider', async () => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)

      await request(app).post(STUDY_GUIDE_URL).send({ message: '   ' }).expect(400)
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})