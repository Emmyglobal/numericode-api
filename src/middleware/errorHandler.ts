import type { Request, Response, NextFunction } from 'express'
import { fail } from '../utils/response'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled error:', err)

  // Postgres unique constraint violation
  if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === '23505') {
    return fail(res, 'A record with this value already exists', 409)
  }

  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err instanceof Error ? err.message : 'Unknown error'

  return fail(res, message, 500)
}

export function notFoundHandler(_req: Request, res: Response) {
  return fail(res, 'Endpoint not found', 404)
}
