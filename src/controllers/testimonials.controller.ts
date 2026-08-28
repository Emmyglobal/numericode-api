import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail } from '../utils/response'
import type { UserRow } from '../types'

// Testimonials are anonymous-by-default on the public list (no email is ever
// exposed). Submissions are email-gated and require explicit consent; only
// admin-approved entries are shown publicly — no fabricated quotes.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, course, location, message, consent } = (req.body ?? {}) as {
      name?: unknown; email?: unknown; course?: unknown; location?: unknown; message?: unknown; consent?: unknown
    }
    if (typeof name !== 'string' || !name.trim()) return fail(res, 'Please provide your name', 400)
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) return fail(res, 'A valid email address is required', 400)
    if (typeof message !== 'string' || message.trim().length < 20) return fail(res, 'Please write a short message (at least 20 characters)', 400)
    if (consent !== true) return fail(res, 'Your consent is required before we can publish your testimonial', 400)

    const { rows } = await query<{ id: string }>(
      `INSERT INTO testimonials (name, email, course, location, message, consent, status)
       VALUES ($1, $2, $3, $4, $5, TRUE, 'pending')
       RETURNING id`,
      [name.trim(), email.trim(), typeof course === 'string' ? course.trim() : null, typeof location === 'string' ? location.trim() : null, message.trim()]
    )
    return ok(res, { id: rows[0].id, status: 'pending' }, 201)
  } catch (err) { next(err) }
}

export async function listPublicTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ id: string; name: string; course: string | null; location: string | null; message: string }>(
      `SELECT id, name, course, location, message
       FROM testimonials
       WHERE status = 'approved'
       ORDER BY created_at DESC
       LIMIT 12`
    )
    return ok(res, rows)
  } catch (err) { next(err) }
}

export async function listPendingTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ id: string; name: string; email: string; course: string | null; message: string; created_at: Date }>(
      `SELECT id, name, email, course, message, created_at
       FROM testimonials
       WHERE status = 'pending'
       ORDER BY created_at ASC`
    )
    return ok(res, rows)
  } catch (err) { next(err) }
}

export async function moderateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = (req.body ?? {}) as { status?: unknown }
    if (status !== 'approved' && status !== 'rejected') return fail(res, 'status must be "approved" or "rejected"', 400)
    const { rows } = await query<{ id: string }>(
      `UPDATE testimonials SET status = $1 WHERE id = $2 RETURNING id`,
      [status, req.params.id]
    )
    if (!rows[0]) return fail(res, 'Testimonial not found', 404)
    return ok(res, { id: rows[0].id, status })
  } catch (err) { next(err) }
}