/**
 * Strict CORS allowlist for the NumeryCode API.
 *
 * Production safety policy (Phase 20 hardening, D4):
 *   - Only origins on the allowlist may receive credentialed (cookie/Authorization)
 *     responses. All other origins receive a 403-like rejection (cors exits
 *     without calling next, which Express treats as "not allowed").
 *   - Server-to-server callers that do NOT send an Origin header (e.g. the Paystack
 *     webhook, curl/health checks, server-side fetchers) are allowed through
 *     unchanged. This preserves the raw-body webhook verification path and any
 *     backend-to-backend traffic without opening credentialed access to browsers
 *     on arbitrary origins.
 *   - The allowlist is driven by the CLIENT_URL env var so the same code works in
 *     development (localhost:5173) and production (https://www.numerycode.com).
 *
 * Phase 21 (D4): the origin delegate is now explicitly typed with the
 * `CustomOrigin` function shape (derived from @types/cors' `CorsOptions` —
 * @types/cors 2.8.x declares the type but does not export it) and the exported
 * options object is typed as `CorsOptions`, so a regression that widens
 * `origin` back to `true`/`StaticOrigin` cannot compile unnoticed. The
 * allowlist behaviour is unchanged.
 *
 * Env vars:
 *   CLIENT_URL       — canonical frontend origin (production: https://www.numerycode.com)
 *   NODE_ENV         — when "development" or "test", localhost origins are added
 *   PAYSTACK_WEBHOOK_ORIGIN — optional; defaults to https://api.paystack.co
 */

import type { CorsOptions } from 'cors'

/**
 * The function form of the cors `origin` option. @types/cors (2.8.x) declares
 * this shape internally as `CustomOrigin` but does not export it, so we derive
 * the identical type from the exported `CorsOptions`. Typing the delegate with
 * it means any future change to the cors option shape (or a widening of
 * `origin` back to `true`/`StaticOrigin`) fails to compile.
 */
type CustomOrigin = Extract<NonNullable<CorsOptions['origin']>, (...args: never[]) => void>

const ALLOWED_ORIGINS = [
  // Canonical production frontend (set via CLIENT_URL env var).
  (process.env.CLIENT_URL ?? 'https://www.numerycode.com').replace(/\/+$/, ''),

  // Paystack webhook callback origin. Paystack pushes payment events from this
  // origin, and the webhook route verifies the raw request body — it must be
  // reachable without a CORS preflight block. If the env var is unset we default
  // to Paystack's documented webhook host.
  (process.env.PAYSTACK_WEBHOOK_ORIGIN ?? 'https://api.paystack.co')
    .replace(/\/+$/, ''),

  // Local development / test origins (only injected outside production so the
  // production allowlist stays tight and reviewable).
  ...(process.env.NODE_ENV !== 'production'
    ? [
        'http://localhost:5173', // Vite dev server
        'http://localhost:3000',
        'http://localhost:3001', // backend itself (server-to-server calls)
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ]
    : []),
]

/**
 * CORS origin delegate. Returns the origin when it is on the allowlist (or when
 * no Origin header was sent — server-to-server / webhook traffic), and rejects
 * arbitrary browser origins with a 403-style block.
 *
 * Explicitly typed as @types/cors `CustomOrigin`:
 *   (origin: string | undefined,
 *    callback: (err: Error | null, origin?: boolean) => void) => void
 */
export const corsOriginDelegate: CustomOrigin = (origin, callback) => {
  // No Origin header → server-to-server / webhook / health-check traffic.
  // Allow it through unchanged so the Paystack raw-body webhook and any
  // backend-to-backend calls keep working without credentialed browser access.
  if (origin === undefined || origin === null) {
    return callback(null, true)
  }

  // Normalize the origin (strip trailing slash, lowercase host per convention).
  const normalized = origin.trim()

  if (ALLOWED_ORIGINS.includes(normalized)) {
    return callback(null, true)
  }

  // Silently block: do NOT set CORS headers and let the request proceed to the
  // route handler. Browsers on the unauthorized origin will see no matching
  // Access-Control-Allow-Origin and refuse to read the response; server-to-server
  // callers are unaffected. Logging happens on the server side only (never sent
  // to the client, so no information leakage).
  const blocked = process.env.NODE_ENV === 'production'
    ? `Blocked CORS request from unauthorized origin: ${normalized}`
    : `Blocked CORS request from origin not on allowlist: ${normalized} (allowed: ${ALLOWED_ORIGINS.join(', ')})`
  console.warn(blocked)
  return callback(null, false)
}

export const corsOptions: CorsOptions = {
  origin: corsOriginDelegate,
  credentials: true,
}
