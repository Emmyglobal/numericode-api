import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

// ─── Resend receiving side: delivery-status webhooks ─────────────────────────
// POST /api/webhooks/resend is public and Svix-signed. The suite mocks `svix`
// so no real signature or database row is needed to prove routing + auth:
//   1. missing secret → 401 (fail-closed, no DB touched)
//   2. mocked-valid signature + unsupported type → 200 ack, nothing stored
// Full persistence (email_events insert, idempotent replay) is exercised in
// staging with a real Resend webhook + `npm run db:migrate` applied.

vi.mock('svix', () => ({
  Webhook: class {
    secret: string
    constructor(secret: string) {
      if (!secret) throw new Error('missing secret')
      this.secret = secret
    }
    verify() {
      return { type: 'email.delivered', data: {} }
    }
  },
}))

vi.mock('../db/pool', () => ({
  query: vi.fn(async () => ({ rows: [] })),
}))

const app = createApp()

describe('POST /api/webhooks/resend', () => {
  it('rejects requests without a valid Svix signature', async () => {
    const saved = process.env.RESEND_WEBHOOK_SECRET
    delete process.env.RESEND_WEBHOOK_SECRET
    const res = await request(app)
      .post('/api/webhooks/resend')
      .send({ type: 'email.delivered', data: { email_id: 'test-x', to: 'a@b.c' } })
    expect(res.status).toBe(401)
    if (saved !== undefined) process.env.RESEND_WEBHOOK_SECRET = saved
    else delete process.env.RESEND_WEBHOOK_SECRET
  })

  it('acks unsupported event types without touching the database', async () => {
    process.env.RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || 'whsec_test'
    const res = await request(app)
      .post('/api/webhooks/resend')
      .set({ 'svix-id': 'msg_1', 'svix-timestamp': String(Date.now()), 'svix-signature': 'v1,sig' })
      .send({ type: 'email.unknown_thing', data: { email_id: 'test-unknown', to: 'a@b.c' } })
    // Signature is mocked valid → unsupported type is acked, not stored.
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject({ received: true, handled: false })
  })
})
