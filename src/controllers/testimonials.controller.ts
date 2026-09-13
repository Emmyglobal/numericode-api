import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, ok, created } from '../utils/response'

interface TestimonialRow {
  id: string
  name: string
  email: string
  course: string | null
  location: string | null
  message: string
  consent: boolean
  status: string
  created_at: Date
}

/** GET /api/testimonials — public list of approved testimonials. */
export async function listPublicTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<TestimonialRow>(
      `SELECT t.id, t.name, t.email, t.course, t.location, t.message, t.consent, t.status, t.created_at
       FROM testimonials t
       WHERE t.status = 'approved'
       ORDER BY t.created_at DESC
       LIMIT 50`
    )
    return ok(res, rows.map(r => ({
      id: r.id, name: r.name, course: r.course, location: r.location, message: r.message,
      createdAt: r.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

/** POST /api/testimonials — public submission. Authenticated users are linked via email. */
export async function submitTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, course, location, message, consent } = req.body as {
      name?: string; email?: string; course?: string; location?: string; message?: string; consent?: boolean
    }
    if (!name || !name.trim()) return fail(res, 'Name is required', 400)
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return fail(res, 'A valid email is required', 400)
    if (!message || !message.trim() || message.trim().length < 20) return fail(res, 'Message must be at least 20 characters', 400)
    if (message.trim().length > 2000) return fail(res, 'Message must be 2000 characters or fewer', 400)
    // Consent is explicitly required for publication (not a hidden flag).
    if (!consent) return fail(res, 'You must consent to publication of your testimonial.', 400)

    let validCourse: string | null = null
    if (course && course.trim()) {
      const { rows: cr } = await query<{ title: string }>('SELECT title FROM courses WHERE title = $1 AND status = \'published\'', [course.trim()])
      if (cr[0]) validCourse = cr[0].title
    }

    // Prevent obvious duplicate spam within a 24h window from the same email.
    const { rows: dup } = await query<{ id: string }>(
      `SELECT id FROM testimonials WHERE email = $1 AND message = $2 AND created_at > NOW() - INTERVAL '24 hours' LIMIT 1`,
      [email.trim(), message.trim()]
    )
    if (dup[0]) return fail(res, 'A testimonial with this message was recently submitted from this email.', 409)

    const { rows: ins } = await query<{ id: string; status: string }>(
      `INSERT INTO testimonials (email, name, course, location, message, consent, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING id, status`,
      [email.trim().toLowerCase(), name.trim(), validCourse, location?.trim() || null, message.trim(), consent]
    )
    return created(res, { id: ins[0].id, status: ins[0].status, message: 'Thank you! Your testimonial has been submitted for review.' })
  } catch (err) { next(err) }
}

/** GET /api/admin/testimonials — admin/trainer list all testimonials for moderation. */
export async function listAllTestimonials(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as string | undefined
    const where = status && ['pending', 'approved', 'rejected'].includes(status) ? `WHERE t.status = $1` : ''
    const params = status && ['pending', 'approved', 'rejected'].includes(status) ? [status] : []
    const { rows } = await query<TestimonialRow>(
      `SELECT t.id, t.name, t.email, t.course, t.location, t.message, t.consent, t.status, t.created_at
       FROM testimonials t ${where} ORDER BY t.created_at DESC LIMIT 100`,
      params
    )
    return ok(res, rows.map(r => ({
      id: r.id, name: r.name, email: r.email, course: r.course, location: r.location, message: r.message,
      consent: r.consent, status: r.status, createdAt: r.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

/** PATCH /api/admin/testimonials/:id — admin/trainer approve/reject. */
export async function moderateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status?: string }
    if (!status || !['approved', 'rejected'].includes(status)) return fail(res, 'Status must be "approved" or "rejected"', 400)
    const { rows } = await query<{ id: string; status: string }>(
      `UPDATE testimonials SET status = $1 WHERE id = $2 RETURNING id, status`,
      [status, req.params.id]
    )
    if (!rows[0]) return fail(res, 'Testimonial not found', 404)
    return ok(res, { id: rows[0].id, status: rows[0].status })
  } catch (err) { next(err) }
}