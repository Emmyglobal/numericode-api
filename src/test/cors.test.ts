import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

// The app is created once at module scope (tests run sequentially by default in
// vitest). Because NODE_ENV=test in vitest, the corsOptions allowlist includes
// the localhost origins plus the always-present production origin
// (https://www.numerycode.com, driven by CLIENT_URL or its default).
const app = createApp()

const PROD_ORIGIN = 'https://www.numerycode.com'
const DEV_ORIGIN = 'http://localhost:5173'
const PAYSTACK_ORIGIN = 'https://api.paystack.co'
const ARBITRARY_ORIGIN = 'https://evil.example.com'

function acaoHeader(res: request.Response): string | undefined {
  return res.headers['access-control-allow-origin']
}

describe('CORS allowlist (D4 hardening)', () => {
  describe('allowed origins', () => {
    it('accepts the canonical production origin and echoes it in ACAO', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', PROD_ORIGIN)
        .expect(200)

      expect(acaoHeader(res)).toBe(PROD_ORIGIN)
      expect(res.headers['access-control-allow-credentials']).toBe('true')
    })

    it('accepts the Vite dev origin (allowed in non-production)', async () => {
      // In test mode NODE_ENV is "test", so localhost origins are on the allowlist.
      const res = await request(app)
        .get('/health')
        .set('Origin', DEV_ORIGIN)
        .expect(200)

      expect(acaoHeader(res)).toBe(DEV_ORIGIN)
    })

    it('accepts the Paystack webhook origin so payment callbacks are reachable', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', PAYSTACK_ORIGIN)
        .expect(200)

      expect(acaoHeader(res)).toBe(PAYSTACK_ORIGIN)
      expect(res.headers['access-control-allow-credentials']).toBe('true')
    })
  })

  describe('arbitrary origins', () => {
    it('rejects an unknown browser origin (no ACAO header, browser will block reading the response)', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', ARBITRARY_ORIGIN)
        // Do not assert a specific HTTP status here: the server responds (the route
        // still ran), but with NO Access-Control-Allow-Origin header, so a browser
        // on evil.example.com cannot read the credentialed response.
        .expect(200)

      expect(acaoHeader(res)).toBeUndefined()
      expect(res.headers['access-control-allow-credentials']).toBeUndefined()
    })

    it('rejects a second arbitrary origin with a different scheme + host', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://www.numerycode.com')
        .expect(200)

      // http (not https) is not on the allowlist.
      expect(acaoHeader(res)).toBeUndefined()
    })

    it('rejects an arbitrary origin even when it shares a similar-looking host', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'https://numerycode.com')
        .expect(200)

      // The non-www httpS origin is NOT the canonical www origin on the allowlist.
      expect(acaoHeader(res)).toBeUndefined()
    })
  })

  describe('server-to-server / webhook traffic (no Origin header)', () => {
    it('does not crash and still returns a normal response when no Origin header is sent', async () => {
      // Simulates a server-to-server call or webhook push that never sends an Origin
      // header (Paystack webhooks, curl, backend-to-backend fetches). These must
      // continue to work even in production.
      const res = await request(app)
        .get('/health')
        // No Origin header at all.
        .expect(200)

      expect(res.body.success).toBe(true)
      expect(res.body.version).toBe('TEST-12345')
    })
  })

  describe('credentials + exposed headers still behave correctly for allowed origins', () => {
    it('sends ACAC=true and the Vary header for an allowed origin', async () => {
      const res = await request(app)
        .options('/health')
        .set('Origin', DEV_ORIGIN)
        .set('Access-Control-Request-Method', 'GET')
        // The cors middleware answers preflights with 204 No Content.
        .expect(204)

      expect(acaoHeader(res)).toBe(DEV_ORIGIN)
      expect(res.headers['access-control-allow-credentials']).toBe('true')
      expect(res.headers['access-control-allow-methods']).toContain('GET')
    })
  })
})
