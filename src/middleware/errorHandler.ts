import type { Request, Response, NextFunction } from 'express'
import { fail } from '../utils/response'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled error:', err)

  // Postgres unique constraint violation
  if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === '23505') {
    return fail(res, 'A record with this value already exists', 409)
  }

  // ⚠️ TEMPORARY DIAGNOSTIC (2026-08-14) — production-safe scope note: internal error
  // text (SQL syntax errors, driver messages, schema names) is returned only
  // when NODE_ENV !== 'production'. The full error is always logged above via
  // console.error, and production clients receive the masked message.
  const isProduction = process.env.NODE_ENV === 'production'
  const detail = err instanceof Error
    ? err.message
    : typeof err === 'string'
      ? err
      : 'Internal server error'
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? (err as { code?: unknown }).code
      : undefined

  // Production MUST never leak internal error text to API clients.
  if (isProduction) return fail(res, 'Internal server error', 500)

  return fail(res, code !== undefined ? `${detail} (code=${String(code)})` : detail, 500)
}

export function notFoundHandler(_req: Request, res: Response) {
  return fail(res, 'Endpoint not found', 404)
}
