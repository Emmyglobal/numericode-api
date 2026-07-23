import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound } from '../utils/response'
import { singleResourceUpload } from '../middleware/upload'
import type { ResourceRow } from '../types'

/**
 * GET /api/resources
 * List all resources across the trainer's courses (for trainer use).
 * GET /api/admin/resources
 * List all resources (admin use).
 */
export async function getResources(req: Request, res: Response, next: NextFunction) {
  try {
    const isTrainer = req.user!.role === 'trainer'
    const instructorId = req.user!.userId

    const { rows } = await query<ResourceRow & {
      lesson_title: string; course_id: string; course_title: string; instructor_id: string
    }>(
      isTrainer
        ? `SELECT r.*, l.title AS lesson_title, l.module_id, m.course_id, c.title AS course_title, c.instructor_id
           FROM resources r
           JOIN lessons l ON l.id = r.lesson_id
           JOIN modules m ON m.id = l.module_id
           JOIN courses c ON c.id = m.course_id
           WHERE c.instructor_id = $1 ORDER BY c.title, m.position, l.position`
        : `SELECT r.*, l.title AS lesson_title, m.course_id, c.title AS course_title, c.instructor_id
           FROM resources r
           JOIN lessons l ON l.id = r.lesson_id
           JOIN modules m ON m.id = l.module_id
           JOIN courses c ON c.id = m.course_id
           ORDER BY c.title, m.position, l.position`,
      isTrainer ? [instructorId] : undefined
    )

    return ok(res, rows.map(r => ({
      id: r.id, lessonId: r.lesson_id, lessonTitle: r.lesson_title,
      courseId: r.course_id, courseTitle: r.course_title,
      title: r.title, type: r.type, url: r.url,
    })))
  } catch (err) { next(err) }
}

/**
 * POST /api/resources  (trainer)
 * POST /api/admin/resources  (admin)
 * Create a new resource for a lesson.
 */
export async function createResource(req: Request, res: Response, next: NextFunction) {
  try {
    const isMultipart = typeof (req as any).file !== 'undefined'
    const body = req.body as {
      lessonId?: string; title?: string; type?: string; url?: string
    }
    const lessonId = body.lessonId
    const title = body.title
    const url = body.url

    if (!lessonId || !title) {
      return fail(res, 'lessonId and title are required', 400)
    }

    let finalType = body.type
    let finalUrl = url

    if (isMultipart && (req as any).file) {
      const file = (req as any).file as { mimetype: string; filename: string }
      if (!finalType) {
        if (file.mimetype.startsWith('application/pdf')) finalType = 'pdf'
        else if (file.mimetype.startsWith('video/')) finalType = 'video'
        else if (file.mimetype.startsWith('image/')) finalType = 'pdf'
        else finalType = 'file'
      }
      const host = (req.get('x-forwarded-host') || req.get('host') || '').toString()
      const proto = (req.get('x-forwarded-proto') || req.protocol || 'http').toString()
      finalUrl = `${proto}://${host}/uploads/${(req as any).file.filename}`
    }

    if (!finalType || !finalUrl) {
      return fail(res, 'type and url are required', 400)
    }
    if (!['pdf', 'video', 'link'].includes(finalType)) return fail(res, 'Invalid resource type', 400)

    // Verify the lesson exists and (for trainers) belongs to their course
    const { rows: lessonRows } = await query<{ course_id: string; instructor_id: string }>(
      `SELECT c.id AS course_id, c.instructor_id FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN courses c ON c.id = m.course_id WHERE l.id = $1`,
      [lessonId]
    )
    if (!lessonRows[0]) return notFound(res, 'Lesson not found')

    if (req.user!.role === 'trainer' && lessonRows[0].instructor_id !== req.user!.userId) {
      return fail(res, 'You can only add resources to your own lessons', 403)
    }

    const { rows } = await query<ResourceRow>(
      `INSERT INTO resources (lesson_id, title, type, url) VALUES ($1, $2, $3, $4) RETURNING *`,
      [lessonId, title, finalType, finalUrl]
    )
    const r = rows[0]
    return ok(res, {
      id: r.id, lessonId: r.lesson_id, title: r.title, type: r.type, url: r.url,
    }, 201)
  } catch (err) { next(err) }
}

/**
 * DELETE /api/resources/:id  (trainer)
 * DELETE /api/admin/resources/:id  (admin)
 */
export async function deleteResource(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: existingRows } = await query<ResourceRow & { instructor_id: string }>(
      `SELECT r.*, c.instructor_id FROM resources r
       JOIN lessons l ON l.id = r.lesson_id
       JOIN modules m ON m.id = l.module_id
       JOIN courses c ON c.id = m.course_id WHERE r.id = $1`,
      [req.params.id]
    )
    if (!existingRows[0]) return notFound(res, 'Resource not found')

    if (req.user!.role === 'trainer' && existingRows[0].instructor_id !== req.user!.userId) {
      return fail(res, 'You can only delete resources from your own lessons', 403)
    }

    await query('DELETE FROM resources WHERE id = $1', [req.params.id])
    return ok(res, { id: req.params.id })
  } catch (err) { next(err) }
}

/**
 * GET /api/lessons/:lessonId/resources
 * List resources for a specific lesson (student-facing).
 */
export async function getLessonResources(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<ResourceRow>(
      'SELECT * FROM resources WHERE lesson_id = $1 ORDER BY title',
      [req.params.lessonId]
    )
    return ok(res, rows.map(r => ({ id: r.id, title: r.title, type: r.type, url: r.url })))
  } catch (err) { next(err) }
}
