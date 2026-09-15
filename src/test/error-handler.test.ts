import { describe, it, expect, afterEach, vi } from 'vitest'
import type { Request, Response } from 'express'
import { errorHandler } from '../middleware/errorHandler'

/**
 * Phase 20 regression: the unhandled-error handler must never return internal
 * error text (SQL syntax errors, driver messages, schema names) to API clients
 * when running in production. The raw detail is still logged via console.error
 * and is still returned outside production so local debugging keeps working.
 */
function makeRes() {
  const res = {
    statusCode: 0,
    body: null as unknown,
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(payload: unknown) {
      this.body = payload
      return this
    },
  }
  return res as unknown as Response & { statusCode: number; body: { message?: string } }
}

const originalNodeEnv = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv
  vi.restoreAllMocks()
})

describe('errorHandler production error masking', () => {
  it('masks Postgres driver detail in production', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    process.env.NODE_ENV = 'production'
    const res = makeRes()
    const err = Object.assign(new Error('invalid input syntax for type uuid: "categories"'), { code: '22P02' })

    errorHandler(err, {} as Request, res, (() => {}) as never)

    expect(res.statusCode).toBe(500)
    expect(res.body.message).toBe('Internal server error')
    expect(JSON.stringify(res.body)).not.toContain('22P02')
    expect(JSON.stringify(res.body)).not.toContain('uuid')
  })

  it('keeps the diagnostic detail outside production', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    process.env.NODE_ENV = 'test'
    const res = makeRes()
    const err = Object.assign(new Error('invalid input syntax for type uuid: "categories"'), { code: '22P02' })

    errorHandler(err, {} as Request, res, (() => {}) as never)

    expect(res.statusCode).toBe(500)
    expect(res.body.message).toContain('invalid input syntax for type uuid')
    expect(res.body.message).toContain('code=22P02')
  })

  it('still maps unique-constraint violations to 409 with a client-safe message', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    process.env.NODE_ENV = 'production'
    const res = makeRes()
    const err = Object.assign(new Error('duplicate key value violates unique constraint "users_email_key"'), { code: '23505' })

    errorHandler(err, {} as Request, res, (() => {}) as never)

    expect(res.statusCode).toBe(409)
    expect(res.body.message).toBe('A record with this value already exists')
    expect(JSON.stringify(res.body)).not.toContain('users_email_key')
  })
})