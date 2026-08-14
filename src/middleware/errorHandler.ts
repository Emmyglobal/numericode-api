import type { Request, Response, NextFunction } from 'express'
import { fail } from '../utils/response'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled error:', err)

  // Postgres unique constraint violation
  if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === '23505') {
    return fail(res, 'A record with this value already exists', 409)
  }

  // ⚠️ TEMPORARY DIAGNOSTIC (2026-08-14) — surface the real error message in the
  // API response so the DB 500 cause is visible via curl. The error handler
  // previously masked it as "Internal server error" in production. REVERT this
  // to the masked message once the root cause is fixed and verified.
  const message = err instanceof Error
    ? err.message
    : typeof err === 'string'
      ? err
      : 'Internal server error'
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? (err as { code?: unknown }).code
      : undefined

  return fail(res, code !== undefined ? `${message} (code=${String(code)})` : message, 500)
}

export function notFoundHandler(_req: Request, res: Response) {
  return fail(res, 'Endpoint not found', 404)
}
