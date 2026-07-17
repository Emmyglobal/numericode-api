import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { unauthorized, forbidden } from '../utils/response'
import type { UserRole } from '../types'

/** Verifies the Bearer token and attaches the decoded payload to req.user */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return unauthorized(res, 'Missing or malformed Authorization header')
  }

  const token = header.slice('Bearer '.length)
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return unauthorized(res, 'Invalid or expired token')
  }
}

/** Restricts a route to one or more roles. Must run after requireAuth. */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return unauthorized(res)
    if (!roles.includes(req.user.role)) {
      return forbidden(res, `This action requires role: ${roles.join(' or ')}`)
    }
    next()
  }
}
