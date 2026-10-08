import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createHmac } from 'node:crypto'
import request from 'supertest'
import { createApp } from '../app'

// ─── Resend receiving side: delivery-status webhooks ─────────────────────────
// POST /api/webhooks/resend is public and Svix-signed (verified in-process
// with node:crypto — no `svix` dependency). Bodies are pre-stringified so the
// HMAC is computed over the exact raw bytes the server receives:
//   1. missing secret → 401 (fail-closed, no DB touched)
//   2. bad signature → 401, nothing stored
//   3. valid signature + unsupported type → 200 ack, nothing stored
//   4. valid signature + supported type → 200, email_events insert queued
// Full persistence (idempotent replay against real Postgres) is exercised in
// staging with a real Resend webhook + `npm run db:migrate` applied.

vi.mock('../db/pool', () => ({
  query: vi.fn(async () => ({ rows: [] })),
}))

import { query as mockQuery } from '../db/pool'

const TEST_SECRET = `whsec_${Buffer.from('test-secret-key-123456789012').toString('base64')}`

function signWebhook(id: string, timestamp: string, rawBody: string): string {
  const key = Buffer.from(TEST_SECRET.slice('whsec_'.length), 'base64')
  const digest = createHmac('sha256', key)
    .update(`${id}.${timestamp}.${rawBody}`, 'utf8')
    .digest('base64')
  return `v1,${digest}`
}

function postWebhook(payload: unknown, opts?: { tamper?: boolean; dropSecret?: boolean }) {
  const rawBody = JSON.stringify(payload)
  const id = 'msg_test_1'
  const timestamp = String(Math.floor(Date.now() / 1000))
  if (opts?.dropSecret) delete process.env.RESEND_WEBHOOK_SECRET
  else process.env.RESEND_WEBHOOK_SECRET = TEST_SECRET
  const signature = opts?.tamper ? 'v1,bm90LXJlYWxseS12YWxpZA==' : signWebhook(id, timestamp, rawBody)
  return request(app)
    .post('/api/webhooks/resend')
    .set('Content-Type', 'application/json')
    .set({ 'svix-id': id, 'svix-timestamp': timestamp, 'svix-signature': signature })
    .send(rawBody)
}

const app = createApp()

describe('POST /api/webhooks/resend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_WEBHOOK_SECRET = TEST_SECRET
  })

  it('rejects requests without a configured secret', async () => {
    const res = await postWebhook({ type: 'email.delivered', data: {} }, { dropSecret: true })
    expect(res.status).toBe(401)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('rejects requests with a bad signature', async () => {
    const res = await postWebhook(
      { type: 'email.delivered', data: { email_id: 'x' } },
      { tamper: true },
    )
    expect(res.status).toBe(401)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('acks unsupported event types without touching the database', async () => {
    const res = await postWebhook(
      { type: 'email.unknown_thing', data: { email_id: 'test-unknown', to: 'a@b.c' } },
    )
    // Signature is genuinely valid → unsupported type is acked, not stored.
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject({ received: true, handled: false })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('stores supported events', async () => {
    const res = await postWebhook(
      {
        type: 'email.delivered',
        data: { email_id: 'test-1', to: 'a@b.c', from: 'n@n.c', subject: 'hi' },
      },
    )
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ received: true, handled: true })
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })
})
