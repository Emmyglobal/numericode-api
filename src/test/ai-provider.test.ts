import { afterEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { resolveAiProvider } from '../services/ai-provider.service'
import { signToken } from '../utils/jwt'

/**
 * Phase 22B — Groq provider tests.
 *
 * Strategy (same as the Phase 21 suite): `fetch` is mocked at the network
 * boundary so the real Groq service is NEVER called and real keys are NEVER
 * used — only obviously-fake sentinel keys below.
 *
 * ⚠️ Rate-limiter budget: the AI controller's in-memory limiter (20 requests /
 * 15 min / IP) lives for this whole worker and vitest gives this file a fresh
 * module registry. Every AI-reaching test below was counted: this file must
 * stay at or under ~19 provider-reaching requests or later tests will 429.
 * Put additional AI-call tests in their own test file.
 */
vi.hoisted(() => {
  process.env.AI_PROVIDER = 'groq'
  process.env.GROQ_API_KEY = 'gsk-test-fake-groq-key-not-real'
  // Sentinel for the INACTIVE provider: must never be sent anywhere by the
  // Groq adapter (test 12).
  process.env.OPENAI_API_KEY = 'sk-test-fake-openai-key-not-real'
  process.env.AI_MODEL = 'openai/gpt-oss-120b'
  process.env.AI_TIMEOUT_MS = '200'
  delete process.env.OPENAI_TIMEOUT_MS
  delete process.env.AI_BASE_URL
})

const app = createApp()

const STUDY_GUIDE_URL = '/api/ai/study-guide'
const GENERATE_QUIZ_URL = '/api/ai/generate-quiz'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_FAKE_KEY = 'gsk-test-fake-groq-key-not-real'
const OPENAI_FAKE_KEY = 'sk-test-fake-openai-key-not-real'
const GROQ_MODEL = 'openai/gpt-oss-120b'

/** Marker substrings that must NEVER appear in any client-facing response. */
const SECRET_MARKERS = [
  GROQ_FAKE_KEY,
  OPENAI_FAKE_KEY,
  'gsk_',
  'sk-',
  'Bearer ',
  'api.groq.com',
  'api.openai.com',
  'GROQ_API_KEY',
  'OPENAI_API_KEY',
  'Authorization',
]

function providerResponse(status: number, body: unknown = {}, rawBody?: string): Response {
  return new Response(rawBody ?? JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function successPayload(answer: string): Response {
  return providerResponse(200, { choices: [{ message: { content: answer } }] })
}

function expectNoSecretLeak(body: unknown): void {
  const serialized = JSON.stringify(body) ?? ''
  for (const marker of SECRET_MARKERS) {
    expect(serialized).not.toContain(marker)
  }
}

/**
 * Asserts the outbound request is a correctly-shaped Groq request and that the
 * inactive provider's key is absent. Returns the parsed request body.
 */
function expectGroqRequest(init: { headers: Record<string, unknown>; body: string }): Record<string, unknown> {
  expect(init.headers.Authorization).toBe(`Bearer ${GROQ_FAKE_KEY}`)
  const parsed = JSON.parse(init.body) as Record<string, unknown>
  expect(parsed.model).toBe(GROQ_MODEL)
  expect(parsed.stream).toBe(false)
  // Groq uses max_completion_tokens (live-verified); max_tokens must not be sent.
  expect(parsed.max_tokens).toBeUndefined()
  // The inactive provider's key must never appear in the outbound request.
  const serialized = JSON.stringify({ headers: init.headers, body: parsed })
  expect(serialized).not.toContain(OPENAI_FAKE_KEY)
  // No other OpenAI-style secret material may be present either. The active Groq
  // key legitimately contains the substring 'sk-' (e.g. 'gsk-…'), so redact it
  // first — anything 'sk-' left after that is stray credential material.
  expect(serialized.split(GROQ_FAKE_KEY).join('<active-provider-key>')).not.toContain('sk-')
  return parsed
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('provider configuration (server-side only)', () => {
  it('resolves AI_PROVIDER=groq to the Groq provider with env-configured model/base URL', () => {
    const cfg = resolveAiProvider()
    expect(cfg.name).toBe('groq')
    expect(cfg.baseUrl).toBe('https://api.groq.com/openai/v1')
    expect(cfg.model).toBe(GROQ_MODEL)
    expect(cfg.apiKey).toBe(GROQ_FAKE_KEY)
  })

  it('resolves AI_PROVIDER=openai, and an unset AI_PROVIDER defaults to openai (rollback)', () => {
    const savedProvider = process.env.AI_PROVIDER
    const savedOpenAiKey = process.env.OPENAI_API_KEY
    const savedOpenAiModel = process.env.OPENAI_MODEL
    try {
      process.env.AI_PROVIDER = 'openai'
      delete process.env.OPENAI_MODEL
      let cfg = resolveAiProvider()
      expect(cfg.name).toBe('openai')
      expect(cfg.baseUrl).toBe('https://api.openai.com/v1')
      expect(cfg.model).toBe('gpt-4o-mini')

      delete process.env.AI_PROVIDER
      cfg = resolveAiProvider()
      expect(cfg.name).toBe('openai')
    } finally {
      if (savedProvider === undefined) delete process.env.AI_PROVIDER
      else process.env.AI_PROVIDER = savedProvider
      process.env.OPENAI_API_KEY = savedOpenAiKey
      process.env.OPENAI_MODEL = savedOpenAiModel
    }
  })

  it('fails safely for an unsupported provider value', () => {
    const saved = process.env.AI_PROVIDER
    try {
      process.env.AI_PROVIDER = 'not-a-real-provider'
      expect(() => resolveAiProvider()).toThrow('AI is not configured. Please contact support.')
    } finally {
      if (saved === undefined) delete process.env.AI_PROVIDER
      else process.env.AI_PROVIDER = saved
    }
  })

  it('fails safely when the active Groq provider is missing its key', () => {
    const savedKey = process.env.GROQ_API_KEY
    try {
      delete process.env.GROQ_API_KEY
      expect(() => resolveAiProvider()).toThrow('AI is not configured. Please contact support.')
    } finally {
      process.env.GROQ_API_KEY = savedKey
    }
  })

  it('fails safely when the active OpenAI provider is missing its key', () => {
    const savedProvider = process.env.AI_PROVIDER
    const savedKey = process.env.OPENAI_API_KEY
    try {
      process.env.AI_PROVIDER = 'openai'
      delete process.env.OPENAI_API_KEY
      expect(() => resolveAiProvider()).toThrow('AI is not configured. Please contact support.')
    } finally {
      process.env.AI_PROVIDER = savedProvider
      process.env.OPENAI_API_KEY = savedKey
    }
  })
})

describe('Groq request shape (study-guide)', () => {
  it('calls the Groq endpoint with the Groq key, server-side model and stream:false', async () => {
    const fetchMock = vi.fn().mockResolvedValue(successPayload('Groq answered fine.'))
    vi.stubGlobal('fetch', fetchMock)

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'What is photosynthesis?' })
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.answer).toBe('Groq answered fine.')
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { headers: Record<string, unknown>; body: string }]
    expect(url).toBe(GROQ_URL)
    expect(init.method).toBe('POST')
    const parsed = expectGroqRequest(init)
    expect(parsed.max_completion_tokens).toBe(400)
    expect(parsed.temperature).toBe(0.7)
    expect((parsed.messages as unknown[])[0]).toEqual({ role: 'system', content: expect.any(String) })

    expectNoSecretLeak(res.body)
  })

  it('ignores provider/model/apiKey supplied in the request body (server-side config only)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(successPayload('Still Groq.'))
    vi.stubGlobal('fetch', fetchMock)

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({
        message: 'Explain gravity',
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'attacker-supplied-value',
      })
      .expect(200)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { headers: Record<string, unknown>; body: string }]
    expect(url).toBe(GROQ_URL)
    const parsed = expectGroqRequest(init)
    expect(parsed.model).toBe(GROQ_MODEL)
    expectNoSecretLeak(res.body)
  })
})

describe('JSON mode (trainer quiz generation)', () => {
  it('sends response_format json_object and normalizes the reply to the app contract', async () => {
    const quiz = {
      title: 'Fractions basics',
      description: 'Answer all questions.',
      questions: [
        { title: 'What is 1/2 + 1/2?', type: 'mcq', marks: 10, options: ['1', '2', '1/4', '3/4'], correctOptionIndex: 0 },
      ],
    }
    const fetchMock = vi.fn().mockResolvedValue(
      providerResponse(200, { choices: [{ message: { content: JSON.stringify(quiz) } }] }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const trainerToken = signToken('11111111-1111-4111-8111-111111111111', 'trainer')
    const res = await request(app)
      .post(GENERATE_QUIZ_URL)
      .set('Authorization', `Bearer ${trainerToken}`)
      .send({ topic: 'Fractions', subject: 'Mathematics', level: 'beginner' })
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.title).toBe('Fractions basics')
    expect(res.body.data.questions).toHaveLength(1)
    expect(res.body.data.questions[0].title).toBe('What is 1/2 + 1/2?')
    expect(res.body.data.aiGenerated).toBe(true)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { headers: Record<string, unknown>; body: string }]
    expect(url).toBe(GROQ_URL)
    const parsed = expectGroqRequest(init)
    expect(parsed.response_format).toEqual({ type: 'json_object' })

    expectNoSecretLeak(res.body)
  })
})

describe('malformed provider responses', () => {
  it('maps a 200 with missing choices to a safe 502', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(providerResponse(200, {})))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain mitosis' })
      .expect(502)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('The AI assistant could not generate a response. Please try again.')
    expectNoSecretLeak(res.body)
  })

  it('maps a 200 with a non-JSON body to a safe 502', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(providerResponse(200, {}, 'this is not json')))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain osmosis' })
      .expect(502)

    expect(res.body.message).toBe('The AI assistant could not generate a response. Please try again.')
    expectNoSecretLeak(res.body)
  })
})

describe('provider error classification (Groq)', () => {
  it('maps a Groq 401 to 503 with a safe support message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      providerResponse(401, { error: { message: 'Invalid API key' } }),
    ))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain fractions' })
      .expect(503)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('AI authentication failed. Please contact support.')
    expectNoSecretLeak(res.body)
  })

  it('maps a Groq 403 to 503 with the same safe support message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      providerResponse(403, { error: { message: 'Model access denied' } }),
    ))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain algebra' })
      .expect(503)

    expect(res.body.message).toBe('AI authentication failed. Please contact support.')
    expectNoSecretLeak(res.body)
  })

  it('maps a Groq 402 (insufficient credits) to 429 with a retry-later message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      providerResponse(402, { error: { code: 'insufficient_credits', message: 'Insufficient balance' } }),
    ))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain geometry' })
      .expect(429)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe(
      'The AI service has reached its current request or credit limit. Please try again later.',
    )
    expectNoSecretLeak(res.body)
  })

  it('maps a Groq 429 (rate limit) to 429 with a retry-later message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      providerResponse(429, { error: { message: 'Rate limit exceeded' } }),
    ))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain trigonometry' })
      .expect(429)

    expect(res.body.message).toBe(
      'The AI service has reached its current request or credit limit. Please try again later.',
    )
    expectNoSecretLeak(res.body)
  })

  it('maps a Groq 408 (provider request timeout) to 503 with the timeout message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      providerResponse(408, { error: { message: 'request timed out' } }),
    ))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain statistics' })
      .expect(503)

    expect(res.body.message).toBe('The AI assistant is taking longer than expected. Please try again shortly.')
    expectNoSecretLeak(res.body)
  })

  it.each([500, 502, 503, 504])('maps a Groq %d to 503 with a safe message', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      providerResponse(status, { error: { message: 'internal provider error' } }),
    ))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain economics' })
      .expect(503)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('The AI assistant is temporarily unavailable. Please try again shortly.')
    expectNoSecretLeak(res.body)
  })

  it('maps a Groq timeout (AbortError from a real AbortSignal.timeout) to 503', async () => {
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

    expect(res.body.message).toBe('The AI assistant is taking longer than expected. Please try again shortly.')
    expectNoSecretLeak(res.body)
    const signal = (fetchMock.mock.calls[0] as unknown as [unknown, { signal?: AbortSignal }])[1]?.signal
    expect(signal?.aborted).toBe(true)
  })

  it('maps a network TypeError to 503 without leaking the host or socket error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(
      new TypeError('fetch failed: getaddrinfo ENOTFOUND api.groq.com'),
    ))

    const res = await request(app)
      .post(STUDY_GUIDE_URL)
      .send({ message: 'Explain biology' })
      .expect(503)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('The AI assistant is temporarily unavailable. Please try again shortly.')
    expectNoSecretLeak(res.body)
    expect(res.body.message).not.toContain('ENOTFOUND')
    expect(res.body.message).not.toContain('groq')
  })
})

describe('GET /api/ai/health (groq provider)', () => {
  it('reports the groq provider and model without exposing secrets', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = await request(app).get('/api/ai/health').expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.configured).toBe(true)
    expect(res.body.data.provider).toBe('groq')
    expect(res.body.data.model).toBe(GROQ_MODEL)
    expectNoSecretLeak(res.body)
    // Health must never perform an AI completion.
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports configured=false without leaking which secret is missing when the key is absent', async () => {
    const savedKey = process.env.GROQ_API_KEY
    try {
      delete process.env.GROQ_API_KEY
      const res = await request(app).get('/api/ai/health').expect(200)

      expect(res.body.data.configured).toBe(false)
      expect(res.body.data.model).toBeNull()
      expect(res.body.data.provider).toBe('groq')
      expectNoSecretLeak(res.body)
    } finally {
      process.env.GROQ_API_KEY = savedKey
    }
  })
})