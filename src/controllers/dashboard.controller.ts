import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, notFound } from '../utils/response'
import { forbidden } from '../utils/response'
import { buildFullCourse } from './courses.controller'
import type {
  CourseRow, EnrollmentRow, AssignmentRow, AnnouncementRow,
  LiveClassRow, ResourceRow, UserRow,
} from '../types'

export async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId

    const { rows: enrollments } = await query<EnrollmentRow & { title: string }>(
      `SELECT e.*, c.title FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.user_id = $1`,
      [userId]
    )

    const { rows: completedRows } = await query<{ count: string }>(
      `SELECT COUNT(*) FROM lesson_completions WHERE user_id = $1`, [userId]
    )

    const { rows: upcomingClasses } = await query<LiveClassRow & { course_title: string; subject: string }>(
      `SELECT lc.*, c.title AS course_title, c.subject
       FROM live_classes lc
       JOIN courses c ON c.id = lc.course_id
       JOIN enrollments e ON e.course_id = c.id
       WHERE e.user_id = $1 AND lc.status IN ('scheduled','live') AND lc.date > NOW()
       ORDER BY lc.date ASC LIMIT 3`,
      [userId]
    )

    const { rows: pendingAssignments } = await query<{ count: string }>(
      `SELECT COUNT(*) FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       WHERE s.user_id = $1 AND s.status = 'pending'`,
      [userId]
    )

    const { rows: announcements } = await query<AnnouncementRow>(
      `SELECT * FROM announcements WHERE audience IN ('all','students') ORDER BY created_at DESC LIMIT 3`
    )

    const primary = enrollments[0]
    let continuelearning = null
    if (primary) {
      const { rows: nextLessonRows } = await query<{ id: string; title: string }>(
        `SELECT l.id, l.title FROM lessons l
         JOIN modules m ON m.id = l.module_id
         WHERE m.course_id = $1
         AND l.id NOT IN (SELECT lesson_id FROM lesson_completions WHERE user_id = $2)
         ORDER BY m.position, l.position LIMIT 1`,
        [primary.course_id, userId]
      )
      continuelearning = {
        id: primary.course_id, title: primary.title, progress: primary.progress,
        nextLesson: nextLessonRows[0] ?? { id: '', title: 'Course complete!' },
      }
    }

    return ok(res, {
      enrolledCount: enrollments.length,
      completedLessons: Number(completedRows[0].count),
      upcomingClassesCount: upcomingClasses.length,
      assignmentsDue: Number(pendingAssignments[0].count),
      continuelearning,
      upcomingClasses: upcomingClasses.map(c => ({
        id: c.id, courseTitle: c.course_title, subject: c.subject, title: c.title,
        date: c.date.toISOString(), meetUrl: c.meet_url, status: c.status,
      })),
      recentAnnouncements: announcements.map(a => ({
        id: a.id, title: a.title, createdAt: a.created_at.toISOString(), isRead: false,
      })),
    })
  } catch (err) { next(err) }
}

export async function getMyCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CourseRow & { progress: number; enrolled_at: Date }>(
      `SELECT c.*, e.progress, e.enrolled_at
       FROM courses c JOIN enrollments e ON e.course_id = c.id
       WHERE e.user_id = $1`,
      [req.user!.userId]
    )
    return ok(res, rows.map(c => ({
      id: c.id, title: c.title, description: c.description, subject: c.subject,
      level: c.level, lessonCount: c.lesson_count, progress: c.progress,
      accessLevel: c.access_level, priceCents: c.price_cents, currency: c.currency,
      enrolledAt: c.enrolled_at.toISOString(), createdAt: c.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function getMyCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CourseRow>(
      `SELECT c.* FROM courses c JOIN enrollments e ON e.course_id = c.id WHERE c.id = $1 AND e.user_id = $2`,
      [req.params.id, req.user!.userId]
    )
    if (!rows[0]) return notFound(res, 'Enrolled course not found')
    const course = rows[0]
    if (course.access_level === 'premium') {
      const { rows: subscriptions } = await query<{ id: string }>(`SELECT id FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()`, [req.user!.userId])
      if (!course.premium_enabled || !subscriptions[0]) return forbidden(res, 'An active Premium subscription is required to access this course')
    }
    const fullCourse = await buildFullCourse(course, true, req.user!.userId)
    const { rows: enrollmentRows } = await query<EnrollmentRow>('SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2', [req.user!.userId, course.id])
    return ok(res, { ...fullCourse, progress: enrollmentRows[0].progress, enrolledAt: enrollmentRows[0].enrolled_at.toISOString() })
  } catch (err) { next(err) }
}

export async function getAssignments(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<AssignmentRow & { course_title: string; status: string; score: number | null; feedback: string | null; returned_for_correction: boolean }>(
      `SELECT a.*, c.title AS course_title, s.status
       FROM assignments a
       JOIN courses c ON c.id = a.course_id
       JOIN enrollments e ON e.course_id = c.id AND e.user_id = $1
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = $1
       WHERE c.access_level = 'free' OR (c.premium_enabled AND EXISTS (SELECT 1 FROM subscriptions sub WHERE sub.user_id = $1 AND sub.status = 'active' AND sub.ends_at > NOW()))`,
      [req.user!.userId]
    )
    return ok(res, rows.map(a => ({
      id: a.id, courseId: a.course_id, courseTitle: a.course_title, title: a.title,
      dueDate: a.due_date.toISOString().slice(0, 10), status: a.status ?? 'pending', totalMarks: Number(a.total_marks),
      passingScore: Number(a.passing_score), score: a.score === null ? null : Number(a.score), feedback: a.feedback, returnedForCorrection: a.returned_for_correction,
    })))
  } catch (err) { next(err) }
}

export async function getAnnouncements(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<AnnouncementRow>(
      `SELECT * FROM announcements WHERE audience IN ('all','students') ORDER BY created_at DESC`
    )
    return ok(res, rows.map(a => ({
      id: a.id, title: a.title, body: a.body,
      createdAt: a.created_at.toISOString().slice(0, 10), isRead: false,
    })))
  } catch (err) { next(err) }
}

export async function getResources(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<ResourceRow & { course_title: string }>(
      `SELECT r.*, c.title AS course_title
       FROM resources r
       JOIN lessons l ON l.id = r.lesson_id
       JOIN modules m ON m.id = l.module_id
       JOIN courses c ON c.id = m.course_id
       JOIN enrollments e ON e.course_id = c.id AND e.user_id = $1
       WHERE c.access_level = 'free' OR (c.premium_enabled AND EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = $1 AND s.status = 'active' AND s.ends_at > NOW()))`,
      [req.user!.userId]
    )
    return ok(res, rows.map(r => ({
      id: r.id, courseId: r.lesson_id, courseTitle: r.course_title,
      title: r.title, type: r.type, url: r.url,
    })))
  } catch (err) { next(err) }
}

export async function getLiveClasses(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<LiveClassRow & { course_title: string; subject: string }>(
      `SELECT lc.*, c.title AS course_title, c.subject
       FROM live_classes lc
       JOIN courses c ON c.id = lc.course_id
       JOIN enrollments e ON e.course_id = c.id AND e.user_id = $1
       WHERE c.access_level = 'free' OR (c.premium_enabled AND EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = $1 AND s.status = 'active' AND s.ends_at > NOW()))`,
      [req.user!.userId]
    )
    return ok(res, rows.map(c => ({
      id: c.id, courseId: c.course_id, courseTitle: c.course_title, subject: c.subject,
      title: c.title, date: c.date.toISOString(), duration: c.duration,
      meetUrl: c.meet_url, status: c.status,
    })))
  } catch (err) { next(err) }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<UserRow>('SELECT * FROM users WHERE id = $1', [req.user!.userId])
    if (!rows[0]) return notFound(res, 'User not found')
    const u = rows[0]
    return ok(res, { id: u.id, name: u.name, email: u.email, bio: u.bio, avatarUrl: u.avatar_url ?? undefined, createdAt: u.created_at.toISOString() })
  } catch (err) { next(err) }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, bio, avatarUrl } = req.body as { name?: string; bio?: string; avatarUrl?: string }
    const { rows } = await query<UserRow>(
      `UPDATE users SET name = COALESCE($1, name), bio = COALESCE($2, bio), avatar_url = COALESCE($3, avatar_url) WHERE id = $4 RETURNING *`,
      [name, bio, avatarUrl, req.user!.userId]
    )
    const u = rows[0]
    return ok(res, { id: u.id, name: u.name, email: u.email, bio: u.bio, avatarUrl: u.avatar_url ?? undefined, createdAt: u.created_at.toISOString() })
  } catch (err) { next(err) }
}
