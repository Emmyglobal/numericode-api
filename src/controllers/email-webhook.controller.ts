import type { NextFunction, Request, Response } from 'express'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { query } from '../db/pool'
import { fail, ok } from '../utils/response'

// ─── Resend receiving side: delivery-status webhooks ─────────────────────────
// Public endpoint (NO auth middleware) — authenticated by Svix signature,
// exactly like the Paystack/Flutterwave payment webhooks. Configure in the
// Resend dashboard (https://resend.com/webhooks):
//   URL: https://<your-api-domain>/api/webhooks/resend
//   Events: email.sent, email.delivered, email.delivery_delayed,
//           email.bounced, email.complained (+ email.opened / email.clicked)
//   Signing Secret → RESEND_WEBHOOK_SECRET (SERVER ONLY, never commit).
//
// Behaviour: acknowledge fast with 200 (Resend retries non-2xx), stay fully
// idempotent (UNIQUE(resend_id, type) + ON CONFLICT DO NOTHING), and NEVER
// trust the payload for state changes — it is reporting/retention only.
// Unknown event types are acked so Resend stops retrying.

const HANDLED_TYPES = new Set([
  'email.sent',
  'email.delivered',
  'email.delivery_delayed',
  'email.bounced',
  'email.complained',
  'email.opened',
  'email.clicked',
])

interface ResendWebhookData {
  email_id?: string
  id?: string
  to?: string | string[]
  from?: string
  subject?: string
  created_at?: string
  [key: string]: unknown
}

interface ResendWebhookEvent {
  type?: string
  data?: ResendWebhookData
}

function firstTo(data: ResendWebhookData | undefined): string | null {
  const to = data?.to
  if (!to) return null
  if (Array.isArray(to)) return to[0] ?? null
  return to
}

const WEBHOOK_TOLERANCE_SEC = 5 * 60

function getHeader(headers: Request['headers'], name: string): string | undefined {
  const value = headers[name]
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

/**
 * Verify the Svix signature over the RAW body (app.ts stores req.rawBody).
 * Implemented directly with node:crypto — no `svix` dependency — because the
 * svix npm package is ESM-only and crashes `require()` in this CommonJS
 * service with ERR_REQUIRE_ESM at boot. Algorithm matches Svix's spec:
 *   key      = base64-decode(RESEND_WEBHOOK_SECRET minus the `whsec_` prefix)
 *   signed   = `${svix-id}.${svix-timestamp}.${rawBody}`
 *   expected = HMAC-SHA256(key, signed), compared with timingSafeEqual
 *              against each `v1,…` entry in svix-signature.
 * The timestamp must be within 5 minutes (replay protection).
 */
function verifySignature(rawBody: Buffer | undefined, headers: Request['headers']): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret || !rawBody) return false
  const id = getHeader(headers, 'svix-id')
  const timestamp = getHeader(headers, 'svix-timestamp')
  const signature = getHeader(headers, 'svix-signature')
  if (!id || !timestamp || !signature) return false

  const timestampSec = Number(timestamp)
  if (!Number.isFinite(timestampSec)) return false
  if (Math.abs(Date.now() / 1000 - timestampSec) > WEBHOOK_TOLERANCE_SEC) return false

  const b64 = secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret
  let key: Buffer
  try {
    key = Buffer.from(b64, 'base64')
  } catch {
    return false
  }
  if (key.length === 0) return false

  const expected = createHmac('sha256', key)
    .update(`${id}.${timestamp}.${rawBody.toString('utf8')}`, 'utf8')
    .digest()

  for (const entry of signature.split(' ')) {
    const sep = entry.indexOf(',')
    if (sep === -1 || entry.slice(0, sep) !== 'v1') continue
    let actual: Buffer
    try {
      actual = Buffer.from(entry.slice(sep + 1), 'base64')
    } catch {
      continue
    }
    if (actual.length !== expected.length) continue
    if (timingSafeEqual(actual, expected)) return true
  }
  return false
}

export async function resendWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody
    if (!verifySignature(rawBody, req.headers)) {
      return fail(res, 'Invalid webhook signature', 401)
    }
    if (!rawBody) return fail(res, 'Invalid webhook payload', 400)

    let event: ResendWebhookEvent
    try {
      event = JSON.parse(rawBody.toString('utf8')) as ResendWebhookEvent
    } catch {
      return fail(res, 'Invalid webhook payload', 400)
    }

    const type = event.type ?? ''
    if (!type || !HANDLED_TYPES.has(type)) {
      // Unsupported/uninteresting events are acknowledged so Resend stops retrying.
      return ok(res, { received: true, handled: false })
    }

    const data = event.data ?? {}
    const resendId = data.email_id ?? data.id ?? null
    if (!resendId) return ok(res, { received: true, handled: false })

    await query(
      `INSERT INTO email_events (resend_id, type, to_email, from_email, subject, raw)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       ON CONFLICT (resend_id, type) DO NOTHING`,
      [
        resendId,
        type,
        firstTo(data),
        data.from ?? null,
        data.subject ?? null,
        JSON.stringify(event),
      ]
    )

    if (type === 'email.bounced' || type === 'email.complained') {
      console.warn(`[email-webhook] ${type} for ${firstTo(data) ?? 'unknown recipient'} (resend id ${resendId})`)
    }

    return ok(res, { received: true, handled: true })
  } catch (err) {
    next(err)
  }
}
