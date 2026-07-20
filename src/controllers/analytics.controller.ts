import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound } from '../utils/response'

interface LearningAnalyticsRow {
  id: string; user_id: string; course_id: string; lesson_id: string | null
  time_spent: number; interactions: number; last_accessed: Date; created_at: Date
  course_title: string; lesson_title: string | null
}

interface DripContentRow {
  id: string; course_id: string; module_id: string | null; lesson_id: string | null
  release_date: Date; created_at: Date
  module_title: string | null; lesson_title: string | null
}

interface PrerequisiteRow {
  id: string; course_id: string; prerequisite_id: string
  prerequisite_title: string; prerequisite_description: string
}

// ─── Learning Analytics ──────────────────────────────────────────────────────

export async function trackLearningActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { courseId, lessonId, timeSpent, interactions } = req.body as {
      courseId: string; lessonId?: string; timeSpent: number; interactions: number
    }

    if (!courseId || !timeSpent) {
      return fail(res, 'Course ID and time spent are required', 400)
    }

    // Upsert learning analytics
    await query(
      `INSERT INTO learning_analytics (user_id, course_id, lesson_id, time_spent, interactions, last_accessed)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id, course_id, lesson_id) 
       DO UPDATE SET 
         time_spent = learning_analytics.time_spent + EXCLUDED.time_spent,
         interactions = learning_analytics.interactions + EXCLUDED.interactions,
         last_accessed = NOW()`,
      [userId, courseId, lessonId || null, timeSpent, interactions || 0]
    )

    return ok(res, { success: true })
  } catch (err) { next(err) }
}

export async function getLearningAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { courseId } = req.params

    const { rows } = await query<LearningAnalyticsRow>(
      `SELECT la.*, c.title as course_title, l.title as lesson_title
       FROM learning_analytics la
       JOIN courses c ON c.id = la.course_id
       LEFT JOIN lessons l ON l.id = la.lesson_id
       WHERE la.user_id = $1 AND la.course_id = $2
       ORDER BY la.last_accessed DESC`,
      [userId, courseId]
    )

    const totalTimeSpent = rows.reduce((sum, row) => sum + Number(row.time_spent), 0)
    const totalInteractions = rows.reduce((sum, row) => sum + Number(row.interactions), 0)

    return ok(res, {
      courseId,
      courseTitle: rows[0]?.course_title || '',
      totalTimeSpent,
      totalInteractions,
      lessonAnalytics: rows.map(r => ({
        id: r.id,
        lessonId: r.lesson_id,
        lessonTitle: r.lesson_title,
        timeSpent: Number(r.time_spent),
        interactions: Number(r.interactions),
        lastAccessed: r.last_accessed.toISOString(),
      })),
    })
  } catch (err) { next(err) }
}

export async function getStudentEngagementReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params

    const { rows } = await query<{
      user_id: string; name: string; email: string
      lessons_accessed: string; total_time_spent: string; total_interactions: string
      last_accessed: Date | null
    }>(
      `SELECT u.id as user_id, u.name, u.email,
        COUNT(DISTINCT la.lesson_id) as lessons_accessed,
        SUM(la.time_spent) as total_time_spent,
        SUM(la.interactions) as total_interactions,
        MAX(la.last_accessed) as last_accessed
       FROM learning_analytics la
       JOIN users u ON u.id = la.user_id
       WHERE la.course_id = $1
       GROUP BY u.id, u.name, u.email
       ORDER BY total_time_spent DESC`,
      [courseId]
    )

    return ok(res, rows.map(r => ({
      userId: r.user_id,
      name: r.name,
      email: r.email,
      lessonsAccessed: Number(r.lessons_accessed),
      totalTimeSpent: Number(r.total_time_spent),
      totalInteractions: Number(r.total_interactions),
      lastAccessed: r.last_accessed?.toISOString() || null,
    })))
  } catch (err) { next(err) }
}

// ─── Drip Content ────────────────────────────────────────────────────────────

export async function getDripContentSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params
    const userId = req.user!.userId

    const { rows } = await query<DripContentRow>(
      `SELECT ds.*, m.title as module_title, l.title as lesson_title
       FROM drip_content_schedule ds
       LEFT JOIN modules m ON m.id = ds.module_id
       LEFT JOIN lessons l ON l.id = ds.lesson_id
       WHERE ds.course_id = $1 AND ds.release_date <= NOW()
       ORDER BY ds.release_date ASC`,
      [courseId]
    )

    return ok(res, rows.map(r => ({
      id: r.id,
      courseId: r.course_id,
      moduleId: r.module_id,
      moduleTitle: r.module_title,
      lessonId: r.lesson_id,
      lessonTitle: r.lesson_title,
      releaseDate: r.release_date.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function createDripContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, moduleId, lessonId, releaseDate } = req.body as {
      courseId: string; moduleId?: string; lessonId?: string; releaseDate: string
    }

    if (!courseId || !releaseDate) {
      return fail(res, 'Course ID and release date are required', 400)
    }

    const { rows: [schedule] } = await query<DripContentRow>(
      `INSERT INTO drip_content_schedule (course_id, module_id, lesson_id, release_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [courseId, moduleId || null, lessonId || null, releaseDate]
    )

    return ok(res, {
      id: schedule.id,
      courseId: schedule.course_id,
      moduleId: schedule.module_id,
      lessonId: schedule.lesson_id,
      releaseDate: schedule.release_date.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

// ─── Course Prerequisites ────────────────────────────────────────────────────

export async function getCoursePrerequisites(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params

    const { rows } = await query<PrerequisiteRow>(
      `SELECT cp.*, c.title as prerequisite_title, c.description as prerequisite_description
       FROM course_prerequisites cp
       JOIN courses c ON c.id = cp.prerequisite_id
       WHERE cp.course_id = $1`,
      [courseId]
    )

    return ok(res, rows.map(r => ({
      id: r.id,
      courseId: r.course_id,
      prerequisiteId: r.prerequisite_id,
      prerequisiteTitle: r.prerequisite_title,
      prerequisiteDescription: r.prerequisite_description,
    })))
  } catch (err) { next(err) }
}

export async function addCoursePrerequisite(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, prerequisiteId } = req.body as { courseId: string; prerequisiteId: string }

    if (!courseId || !prerequisiteId) {
      return fail(res, 'Course ID and prerequisite ID are required', 400)
    }

    const { rows: [prereq] } = await query<PrerequisiteRow>(
      `INSERT INTO course_prerequisites (course_id, prerequisite_id)
       VALUES ($1, $2) RETURNING *`,
      [courseId, prerequisiteId]
    )

    return ok(res, {
      id: prereq.id,
      courseId: prereq.course_id,
      prerequisiteId: prereq.prerequisite_id,
    }, 201)
  } catch (err) { next(err) }
}