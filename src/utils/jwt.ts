import jwt, { type SignOptions } from 'jsonwebtoken'
import type { JwtPayload, UserRole } from '../types'

const SECRET  = process.env.JWT_SECRET || 'dev-secret-change-me'
const EXPIRES = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn']

export function signToken(userId: string, role: UserRole): string {
  return jwt.sign({ userId, role }, SECRET, { expiresIn: EXPIRES })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
