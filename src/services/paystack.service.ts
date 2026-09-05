import crypto from 'crypto'

// ─── Paystack adapter (Phase 16) ──────────────────────────────────────────────
// Implements ONLY the surface verified against Paystack's CURRENT official docs
// (https://paystack.com/docs/api/transaction/, /docs/payments/webhooks/):
//   - POST /transaction/initialize  → { authorization_url, access_code, reference }
//   - GET  /transaction/verify/{reference} → { status, amount (subunits), currency, id, paid_at }
//   - Webhook signature: HMAC-SHA512 of the RAW request body with the secret key,
//     delivered in the `x-paystack-signature` header (timing-safe compare).
//   - Amounts are ALWAYS subunits (kobo for NGN — base × 100).
//   - Without a 200 OK, webhooks are retried for 72h → handlers must ack fast and be idempotent.
// The secret key lives in env and NEVER leaves the backend.

const PAYSTACK_BASE_URL = 'https://api.paystack.co'
const TIMEOUT_MS = 15_000

export type NormalizedPaymentStatus = 'success' | 'failed' | 'abandoned' | 'pending'

export interface PaystackVerification {
  status: NormalizedPaymentStatus
  reference: string
  amountSubunits: number
  currency: string
  providerTransactionId: string | null
  paidAt: string | null
  rawStatus: string
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY)
}

function requireSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not configured')
  return key
}

interface PaystackEnvelope<T> {
  status: boolean
  message: string
  data: T
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${requireSecretKey()}`,
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    throw new Error(`Paystack request failed: ${err instanceof Error ? err.message : 'network error'}`)
  }
  const json = (await res.json().catch(() => null)) as PaystackEnvelope<T> | null
  if (!res.ok || !json?.status) {
    throw new Error(`Paystack request failed (${res.status}): ${json?.message ?? 'unknown error'}`)
  }
  return json.data
}

export async function initializeTransaction(input: {
  email: string
  amountSubunits: number
  currency: string
  reference: string
  callbackUrl?: string
  metadata?: Record<string, unknown>
}): Promise<{ authorizationUrl: string; accessCode: string | null; reference: string }> {
  const data = await paystackFetch<{ authorization_url: string; access_code: string | null; reference: string }>(
    '/transaction/initialize',
    {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        amount: input.amountSubunits,
        currency: input.currency,
        reference: input.reference,
        ...(input.callbackUrl ? { callback_url: input.callbackUrl } : {}),
        ...(input.metadata ? { metadata: JSON.stringify(input.metadata) } : {}),
      }),
    }
  )
  return { authorizationUrl: data.authorization_url, accessCode: data.access_code ?? null, reference: data.reference }
}

interface PaystackVerifyData {
  id: number | string
  status: string
  reference: string
  amount: number
  currency: string
  paid_at: string | null
}

export async function verifyTransaction(reference: string): Promise<PaystackVerification> {
  const data = await paystackFetch<PaystackVerifyData>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  )
  const rawStatus = String(data.status ?? '').toLowerCase()
  const status: NormalizedPaymentStatus =
    rawStatus === 'success'
      ? 'success'
      : rawStatus === 'abandoned'
        ? 'abandoned'
        : rawStatus === 'failed' || rawStatus === 'reversed'
          ? 'failed'
          : 'pending'
  return {
    status,
    reference: String(data.reference ?? reference),
    amountSubunits: Number(data.amount ?? 0),
    currency: String(data.currency ?? ''),
    providerTransactionId: data.id != null ? String(data.id) : null,
    paidAt: data.paid_at ?? null,
    rawStatus,
  }
}

/**
 * Verify a webhook signature per Paystack's documented scheme: the
 * `x-paystack-signature` header is an HMAC-SHA512 of the RAW request body
 * computed with the SECRET KEY. Compared with a timing-safe equality check.
 */
export function verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
  if (!signature || !rawBody) return false
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) return false
  const expected = crypto.createHmac('sha512', key).update(rawBody).digest('hex')
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(signature, 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}