import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound } from '../utils/response'
import { singleResourceUpload } from '../middleware/upload'
import { persistUploadedFile } from '../utils/fileStorage'
import type { ResourceRow } from '../types'

/**
 * GET /api/resources
 * List resources based on the caller's role:
 *  - trainer → resources across their own courses
 *  - student → resources from the courses they are enrolled in
 *  - admin   → all resources (also reachable via GET /api/admin/resources)
 */
export async function getResources(req: Request, res: Response, next: NextFunction) {
  try {
    const role = req.user!.role
    const userId = req.user!.userId

    const select = `SELECT r.*, l.title AS lesson_title, l.module_id, m.course_id, c.title AS course_title, c.instructor_id`
    const from = ` FROM resources r
       JOIN lessons l ON l.id = r.lesson_id
       JOIN modules m ON m.id = l.module_id
       JOIN courses c ON c.id = m.course_id`

    let where = ''
    const params: unknown[] = []

    if (role === 'trainer') {
      where = ' WHERE c.instructor_id = $1'
      params.push(userId)
    } else if (role === 'student') {
      where = ` JOIN enrollments e ON e.course_id = c.id AND e.user_id = $1
         WHERE c.access_level = 'free' OR (c.premium_enabled AND (
           EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = $1 AND s.status = 'active' AND s.ends_at > NOW())
           OR EXISTS (SELECT 1 FROM payments p WHERE p.user_id = $1 AND p.course_id = c.id AND p.status = 'verified')
         ))`
      params.push(userId)
    }

    const { rows } = await query<ResourceRow & {
      lesson_title: string; course_id: string; course_title: string
    }>(
      `${select}${from}${where} ORDER BY c.title, m.position, l.position`,
      params
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
      const file = (req as any).file as { mimetype: string; filename: string; originalname: string; path?: string; buffer?: Buffer }
      if (!finalType) {
        if (file.mimetype.startsWith('video/')) finalType = 'video'
        else if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) finalType = 'pdf'
        else finalType = 'file'
      }
      finalUrl = await persistUploadedFile(file as Express.Multer.File, req)
    }

    if (!finalType || !finalUrl) {
      return fail(res, 'type and url are required', 400)
    }
    if (!['pdf', 'video', 'link', 'file'].includes(finalType)) return fail(res, 'Invalid resource type', 400)

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
