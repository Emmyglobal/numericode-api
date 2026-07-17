import type { Response } from 'express'
import type { ApiResponse } from '../types'

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data } as ApiResponse<T>)
}

export function created<T>(res: Response, data: T) {
  return ok(res, data, 201)
}

export function fail(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, data: null, message } as ApiResponse<null>)
}

export function notFound(res: Response, message = 'Resource not found') {
  return fail(res, message, 404)
}

export function unauthorized(res: Response, message = 'Invalid email or password') {
  return fail(res, message, 401)
}

export function forbidden(res: Response, message = 'You do not have permission to perform this action') {
  return fail(res, message, 403)
}
