import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, ok, created } from '../utils/response'

interface TestimonialRow {
  id: string
  name: string
  course_name: string | null
  location: string | null
  message: string
  rating: number | null
  status: string
  created_at: Date
}

/** GET /api/testimonials — public list of approved testimonials. */
export async function listPublicTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<TestimonialRow>(
      `SELECT t.id, t.name, c.title AS course_name, t.location, t.message, t.rating, t.status, t.created_at
       FROM testimonials t
       LEFT JOIN courses c ON c.id = t.course_id
       WHERE t.status = 'approved'
       ORDER BY t.created_at DESC
       LIMIT 50`
    )
    return ok(res, rows.map(r => ({
      id: r.id, name: r.name, course: r.course_name, location: r.location, message: r.message, rating: r.rating,
    })))
  } catch (err) { next(err) }
}

/** POST /api/testimonials — public submission. Authenticated users are linked automatically. */
export async function submitTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, courseId, location, message, rating } = req.body as {
      name?: string; email?: string; courseId?: string; location?: string; message?: string; rating?: number
    }
    if (!name || !name.trim()) return fail(res, 'Name is required', 400)
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return fail(res, 'A valid email is required', 400)
    if (!message || !message.trim() || message.trim().length < 20) return fail(res, 'Message must be at least 20 characters', 400)
    if (message.trim().length > 2000) return fail(res, 'Message must be 2000 characters or fewer', 400)
    if (rating !== undefined && rating !== null) {
      const r = Number(rating)
      if (!Number.isInteger(r) || r < 1 || r > 5) return fail(res, 'Rating must be an integer between 1 and 5', 400)
    }
    const userId = req.user?.userId ?? null
    let validCourseId: string | null = null
    if (courseId) {
      const { rows: cr } = await query<{ id: string }>('SELECT id FROM courses WHERE id = $1 AND status = \'published\'', [courseId])
      if (cr[0]) validCourseId = cr[0].id
    }
    const { rows: dup } = await query<{ id: string }>(
      `SELECT id FROM testimonials WHERE email = $1 AND message = $2 AND created_at > NOW() - INTERVAL '24 hours' LIMIT 1`,
      [email.trim(), message.trim()]
    )
    if (dup[0]) return fail(res, 'A testimonial with this message was recently submitted from this email.', 409)
    const { rows } = await query<{ id: string; status: string }>(
      `INSERT INTO testimonials (user_id, name, email, course_id, location, message, rating, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING id, status`,
      [userId, name.trim(), email.trim().toLowerCase(), validCourseId, location?.trim() || null, message.trim(), rating ?? null]
    )
    return created(res, { id: rows[0].id, status: rows[0].status, message: 'Thank you! Your testimonial has been submitted for review.' })
  } catch (err) { next(err) }
}

/** GET /api/admin/testimonials — admin/trainer list all testimonials for moderation. */
export async function listAllTestimonials(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as string | undefined
    const where = status && ['pending', 'approved', 'rejected'].includes(status) ? `WHERE t.status = $1` : ''
    const params = status && ['pending', 'approved', 'rejected'].includes(status) ? [status] : []
    const { rows } = await query<TestimonialRow & { email: string }>(
      `SELECT t.id, t.name, t.email, c.title AS course_name, t.location, t.message, t.rating, t.status, t.created_at
       FROM testimonials t LEFT JOIN courses c ON c.id = t.course_id ${where} ORDER BY t.created_at DESC LIMIT 100`,
      params
    )
    return ok(res, rows.map(r => ({
      id: r.id, name: r.name, email: r.email, course: r.course_name, location: r.location, message: r.message, rating: r.rating, status: r.status, createdAt: r.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

/** PATCH /api/admin/testimonials/:id — admin/trainer approve/reject. */
export async function moderateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status?: string }
    if (!status || !['approved', 'rejected'].includes(status)) return fail(res, 'Status must be "approved" or "rejected"', 400)
    const { rows } = await query<{ id: string; status: string }>(
      `UPDATE testimonials SET status = $1, reviewed_by = $2, reviewed_at = NOW() WHERE id = $3 RETURNING id, status`,
      [status, req.user!.userId, req.params.id]
    )
    if (!rows[0]) return fail(res, 'Testimonial not found', 404)
    return ok(res, { id: rows[0].id, status: rows[0].status })
  } catch (err) { next(err) }
}
