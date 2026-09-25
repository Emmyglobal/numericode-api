import crypto from 'crypto'

// ─── Flutterwave adapter (Phase 21 — provider-neutral premium checkout) ───────
// Implements ONLY the surface verified against Flutterwave's CURRENT official
// docs (https://developer.flutterwave.com/docs/flutterwave-standard-1,
// /docs/transaction-verification, /docs/webhooks):
//   - POST /v3/payments                              → { status, message, data: { link } }
//   - GET  /v3/transactions/verify_by_reference      → { data: { id, tx_ref, status, amount, currency, … } }
//   - Webhook authentication: the `verif-hash` header must equal the secret hash
//     configured in the Flutterwave dashboard (FLW_SECRET_HASH) — compared with
//     a timing-safe equality check.
//   - Flutterwave charges DECIMAL base-currency units (₦25,000 = 25000) while the
//     payments table stores subunits (kobo/cents) — conversions happen here with
//     explicit rounding so float noise can never break an amount comparison.
//   - Failed webhook deliveries are retried → handlers must ack fast and be idempotent.
// The secret key and secret hash live in env and NEVER leave the backend.

const FLW_BASE_URL = 'https://api.flutterwave.com'
const TIMEOUT_MS = 15_000
const CHECKOUT_TITLE_MAX = 120

export type NormalizedPaymentStatus = 'success' | 'failed' | 'abandoned' | 'pending'

export interface FlutterwaveVerification {
  status: NormalizedPaymentStatus
  reference: string
  amountSubunits: number
  currency: string
  providerTransactionId: string | null
  paidAt: string | null
  rawStatus: string
}

export function isFlutterwaveConfigured(): boolean {
  return Boolean(process.env.FLW_SECRET_KEY)
}

function requireSecretKey(): string {
  const key = process.env.FLW_SECRET_KEY
  if (!key) throw new Error('FLW_SECRET_KEY is not configured')
  return key
}

/** payments.amount_subunits (kobo) → Flutterwave decimal base amount (₦). */
export function toBaseAmount(amountSubunits: number): number {
  return Math.round(amountSubunits) / 100
}

/** Flutterwave decimal base amount (₦) → payments.amount_subunits (kobo). */
export function toSubunits(amount: number | string): number {
  return Math.round(Number(amount) * 100)
}

interface FlutterwaveEnvelope<T> {
  status: string
  message: string
  data: T
}

async function flutterwaveFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${FLW_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${requireSecretKey()}`,
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    // Error messages never include the key or headers.
    throw new Error(`Flutterwave request failed: ${err instanceof Error ? err.message : 'network error'}`)
  }
  const json = (await res.json().catch(() => null)) as FlutterwaveEnvelope<T> | null
  if (!res.ok || json?.status !== 'success') {
    throw new Error(`Flutterwave request failed (${res.status}): ${json?.message ?? 'unknown error'}`)
  }
  return json.data
}

/**
 * Create a Standard-checkout payment link. `reference` is our own unique
 * tx_ref (generated server-side) — it is how the callback, the webhook and the
 * payments table all map back to the same transaction.
 */
export async function initializeCheckout(input: {
  email: string
  name?: string | null
  amountSubunits: number
  currency: string
  reference: string
  callbackUrl?: string
  courseTitle?: string
  metadata?: Record<string, unknown>
}): Promise<{ checkoutUrl: string; reference: string }> {
  const title = input.courseTitle
    ? `NumeryCode — ${input.courseTitle}`.slice(0, CHECKOUT_TITLE_MAX)
    : 'NumeryCode — Premium course'
  const data = await flutterwaveFetch<{ link: string }>('/v3/payments', {
    method: 'POST',
    body: JSON.stringify({
      tx_ref: input.reference,
      amount: toBaseAmount(input.amountSubunits),
      currency: input.currency,
      ...(input.callbackUrl ? { redirect_url: input.callbackUrl } : {}),
      customer: {
        email: input.email,
        ...(input.name ? { name: input.name } : {}),
      },
      customizations: { title, description: 'Premium course enrolment' },
      // Safe metadata only — never secrets, provider credentials or card data.
      ...(input.metadata ? { meta: input.metadata } : {}),
    }),
  })
  return { checkoutUrl: data.link, reference: input.reference }
}

interface FlutterwaveTransactionData {
  id: number | string
  tx_ref: string
  status: string
  amount: number | string
  currency: string
  created_at?: string | null
}

/**
 * Ask Flutterwave for the truth about one of our references. This is the ONLY
 * trustworthy source for a Flutterwave payment's outcome — callback query
 * parameters and webhook payload fields are never trusted on their own.
 */
export async function verifyTransaction(reference: string): Promise<FlutterwaveVerification> {
  const data = await flutterwaveFetch<FlutterwaveTransactionData>(
    `/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`
  )
  const rawStatus = String(data.status ?? '').trim().toLowerCase()
  const status: NormalizedPaymentStatus =
    rawStatus === 'successful'
      ? 'success'
      : rawStatus === 'cancelled' || rawStatus === 'canceled'
        ? 'abandoned'
        : rawStatus === 'failed' || rawStatus === 'reversed'
          ? 'failed'
          : 'pending'
  return {
    status,
    reference: String(data.tx_ref ?? reference),
    amountSubunits: toSubunits(data.amount ?? 0),
    currency: String(data.currency ?? ''),
    providerTransactionId: data.id != null ? String(data.id) : null,
    paidAt: data.created_at ?? null,
    rawStatus,
  }
}

/**
 * Verify a Flutterwave webhook per its documented scheme: the `verif-hash`
 * header must exactly equal the secret hash configured in the dashboard.
 * Compared with a timing-safe equality check.
 */
export function verifyWebhookSignature(headerValue: string | string[] | undefined): boolean {
  const secretHash = process.env.FLW_SECRET_HASH
  if (!secretHash) return false
  const signature = Array.isArray(headerValue) ? headerValue[0] : headerValue
  if (!signature) return false
  const a = Buffer.from(secretHash, 'utf8')
  const b = Buffer.from(signature, 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

