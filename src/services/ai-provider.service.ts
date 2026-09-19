/**
 * Phase 22B — AI provider abstraction.
 *
 * A single, small seam between the AI controller and the outbound AI provider.
 * The controller keeps owning validation, authorization, rate limiting, prompt
 * construction and response formatting; this module owns:
 *   - which provider is active (AI_PROVIDER: 'openai' | 'groq', default 'openai')
 *   - the provider base URL, Authorization header and model (server-side config only)
 *   - request-body provider details (token parameter name, JSON mode, stream:false)
 *   - the outbound timeout
 *   - response parsing and provider-agnostic error classification
 *
 * Security rules enforced here:
 *   - The active provider's API key is read from server-side env config and is
 *     only ever placed in the outbound Authorization header. The INACTIVE
 *     provider's key is never read and therefore never sent anywhere.
 *   - Provider/model are never accepted from the request body.
 *   - Raw provider error bodies are logged server-side only, never returned.
 *
 * Error messages produced here are intentionally identical to the Phase 20/21
 * classifications so the controller's status-code mapping and the Phase 21
 * regression tests keep working unchanged.
 */

export type AiProviderName = 'openai' | 'groq'

export interface AiProviderConfig {
  name: AiProviderName
  baseUrl: string
  apiKey: string
  model: string
  timeoutMs: number
}

const OPENAI_BASE_URL = 'https://api.openai.com/v1'
const GROQ_DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1'
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini'
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b'
const DEFAULT_TIMEOUT_MS = 30_000

/** Safe, client-facing configuration failure message (same as Phase 20/21). */
const NOT_CONFIGURED_MESSAGE = 'AI is not configured. Please contact support.'

function readTimeoutMs(): number {
  // AI_TIMEOUT_MS is the new provider-generic name; OPENAI_TIMEOUT_MS is kept as a
  // fallback so existing deployments that already set it keep working unchanged.
  const raw = process.env.AI_TIMEOUT_MS ?? process.env.OPENAI_TIMEOUT_MS
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

/**
 * Resolves the active provider configuration from server-side environment
 * configuration. Reads env at CALL time (not module load) so configuration is
 * always current and so tests can pin providers per test file.
 *
 * Throws a safe, non-leaking Error when the active provider is unsupported or
 * is missing its required API key. The INACTIVE provider's key is never read.
 */
export function resolveAiProvider(): AiProviderConfig {
  const raw = (process.env.AI_PROVIDER || 'openai').trim().toLowerCase()
  const timeoutMs = readTimeoutMs()

  if (raw === 'groq') {
    const apiKey = process.env.GROQ_API_KEY || ''
    if (!apiKey) throw new Error(NOT_CONFIGURED_MESSAGE)
    return {
      name: 'groq',
      baseUrl: trimTrailingSlash(process.env.AI_BASE_URL || GROQ_DEFAULT_BASE_URL),
      apiKey,
      model: process.env.AI_MODEL || DEFAULT_GROQ_MODEL,
      timeoutMs,
    }
  }

  if (raw === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY || ''
    if (!apiKey) throw new Error(NOT_CONFIGURED_MESSAGE)
    return {
      name: 'openai',
      baseUrl: OPENAI_BASE_URL,
      apiKey,
      model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      timeoutMs,
    }
  }

  // Unknown provider value — fail safe with the same non-leaking message used
  // for any other configuration problem (never echo the invalid value).
  throw new Error(NOT_CONFIGURED_MESSAGE)
}

export interface AiProviderStatus {
  provider: string
  configured: boolean
  model: string | null
}

/**
 * The single response shape this application consumes from any provider. Both
 * OpenAI and Groq return the OpenAI-compatible chat-completions envelope, and
 * anything else is normalized (or rejected) inside `callAiProvider`.
 */
type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>
}

/**
 * Non-throwing introspection for GET /api/ai/health. Reports only safe,
 * configuration-level information — never keys, URLs or headers — and never
 * performs an AI completion.
 */
export function describeAiProvider(): AiProviderStatus {
  const raw = (process.env.AI_PROVIDER || 'openai').trim().toLowerCase()

  if (raw === 'groq') {
    const configured = Boolean(process.env.GROQ_API_KEY)
    return {
      provider: 'groq',
      configured,
      model: configured ? process.env.AI_MODEL || DEFAULT_GROQ_MODEL : null,
    }
  }

  if (raw === 'openai') {
    const configured = Boolean(process.env.OPENAI_API_KEY)
    return {
      provider: 'openai',
      configured,
      model: configured ? process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL : null,
    }
  }

  return { provider: raw, configured: false, model: null }
}

/**
 * Runs one chat completion against the active provider and returns the model's
 * text content. Throws Errors whose messages are the established, safe Phase
 * 20/21 classifications (the controller maps them to status codes).
 */
export async function callAiProvider(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 500,
  jsonMode = false,
): Promise<string> {
  const config = resolveAiProvider()

  const body: Record<string, unknown> = {
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    // Both providers support non-streaming chat completions; being explicit
    // guarantees ordinary JSON responses (Groq defaults to streaming).
    stream: false,
  }

  // Token-limit parameter name differs by provider. Groq was live-verified with
  // max_completion_tokens; OpenAI keeps its existing max_tokens behaviour.
  if (config.name === 'groq') {
    body.max_completion_tokens = maxTokens
  } else {
    body.max_tokens = maxTokens
  }

  // Ask the model for a strict JSON object when the app needs to parse the result.
  // Groq documents JSON Object Mode on all models, so the same parameter works.
  if (jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  // Phase 20/21 hardening: the provider call must never hard-crash the request
  // lifecycle. We cap the outbound call with an HTTP-level timeout, then classify
  // every failure mode into a user-facing message that leaks nothing about the
  // provider, key, model, or internal stack.
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(config.timeoutMs),
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      console.error('AI provider error:', config.name, response.status, errorBody)
      // 401/403 means the key or model is invalid — do not retry blindly; route to
      // support so the configuration can be fixed (never expose the key itself).
      if (response.status === 401 || response.status === 403) {
        throw new Error('AI authentication failed. Please contact support.')
      }
      // 402 means the provider account is out of credits/funds — same user-facing
      // semantics as a credit limit: transient for the student, fixable by the operator.
      if (response.status === 402) {
        throw new Error('The AI service has reached its current request or credit limit. Please try again later.')
      }
      // 429 means the provider rate/credit limit is hit right now — a transient
      // condition the caller can retry after a short pause.
      if (response.status === 429) {
        throw new Error('The AI service has reached its current request or credit limit. Please try again later.')
      }
      // Provider-side request timeout: the provider gave up before completing.
      if (response.status === 408) {
        throw new Error('The AI assistant is taking longer than expected. Please try again shortly.')
      }
      // 500/502/503/504 and any other non-2xx from the provider are treated as a
      // temporary provider-side outage. The same graceful message is used for all so
      // we never surface provider-internal status text to the client.
      if (
        response.status === 500 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504
      ) {
        throw new Error('The AI assistant is temporarily unavailable. Please try again shortly.')
      }
      throw new Error('The AI assistant is temporarily unavailable. Please try again shortly.')
    }

    let result: ChatCompletionResponse
    try {
      // `Response.json()` is typed as `unknown` — cast it to the one shape this
      // application consumes (choices[0].message.content), matching the original
      // OpenAI implementation. Providers are normalized to this boundary.
      result = (await response.json()) as ChatCompletionResponse
    } catch {
      // A 200 response whose body is not valid JSON is a malformed provider
      // response. Classify it safely here so it can never fall through to the
      // generic error handler (which would echo internal detail outside prod).
      throw new Error('The AI assistant could not generate a response. Please try again.')
    }

    const text = result?.choices?.[0]?.message?.content
    if (!text) throw new Error('The AI assistant could not generate a response. Please try again.')

    return text.trim()
  } catch (err: any) {
    // Network/DNS/TLS failures surface as TypeError in the fetch implementation.
    // Classify them as a transient connection problem, never exposing the failing
    // host, socket error text, or provider identity.
    if (err instanceof TypeError) {
      console.error('AI provider network error:', config.name, err)
      throw new Error('The AI assistant is temporarily unavailable. Please try again shortly.')
    }

    // AbortError/TimeoutError is thrown when the AbortSignal.timeout elapses — i.e.
    // the provider call did not respond within the configured window.
    const errName = err && typeof err === 'object' && 'name' in err ? (err as { name: string }).name : ''
    if (errName === 'AbortError' || errName === 'TimeoutError') {
      console.error('AI provider request timed out after', config.timeoutMs, 'ms')
      throw new Error('The AI assistant is taking longer than expected. Please try again shortly.')
    }

    // Re-throw configuration / rate-limit / provider-outage errors we already
    // classified above, plus any other application-level error.
    if (err instanceof Error) throw err
    throw new Error('The AI assistant is temporarily unavailable. Please try again shortly.')
  }
}