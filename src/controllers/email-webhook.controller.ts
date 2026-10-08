import type { NextFunction, Request, Response } from 'express'
import { Webhook } from 'svix'
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

/** Verify the Svix signature over the RAW body (app.ts stores req.rawBody). */
function verifySignature(rawBody: Buffer | undefined, headers: Request['headers']): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret || !rawBody) return false
  const id = headers['svix-id']
  const timestamp = headers['svix-timestamp']
  const signature = headers['svix-signature']
  if (!id || !timestamp || !signature) return false
  try {
    new Webhook(secret).verify(rawBody.toString('utf8'), {
      'svix-id': Array.isArray(id) ? id[0] : (id as string),
      'svix-timestamp': Array.isArray(timestamp) ? timestamp[0] : (timestamp as string),
      'svix-signature': Array.isArray(signature) ? signature[0] : (signature as string),
    })
    return true
  } catch {
    return false
  }
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
