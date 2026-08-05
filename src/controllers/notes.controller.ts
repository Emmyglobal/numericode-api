import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'
import { createMeetingLink } from '../utils/meeting'
import { notifyUser } from '../utils/notify'

interface CourseNoteRow {
  id: string
  course_id: string
  lesson_id: string | null
  title: string
  content: string
  created_by: string
  is_published: boolean
  created_at: Date
  updated_at: Date
  course_title?: string
  lesson_title?: string
  creator_name?: string
}

// ─── GET /api/trainer/notes ──────────────────────────────────────────────────
export async function getTrainerNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const trainerId = req.user!.userId
    const { rows } = await query<CourseNoteRow>(
      `SELECT cn.*, c.title AS course_title, l.title AS lesson_title, u.name AS creator_name
       FROM course_notes cn
       JOIN courses c ON c.id = cn.course_id
       LEFT JOIN lessons l ON l.id = cn.lesson_id
       JOIN users u ON u.id = cn.created_by
       WHERE c.instructor_id = $1
       ORDER BY cn.updated_at DESC`,
      [trainerId]
    )
    return ok(res, rows.map(n => ({
      id: n.id,
      courseId: n.course_id,
      lessonId: n.lesson_id,
      title: n.title,
      content: n.content,
      isPublished: n.is_published,
      courseTitle: n.course_title,
      lessonTitle: n.lesson_title,
      creatorName: n.creator_name,
      createdAt: n.created_at.toISOString(),
      updatedAt: n.updated_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

// ─── POST /api/trainer/notes ─────────────────────────────────────────────────
export async function createTrainerNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, lessonId, title, content, isPublished } = req.body as {
      courseId?: string; lessonId?: string; title?: string; content?: string; isPublished?: boolean
    }
    if (!courseId || !title) return fail(res, 'courseId and title are required', 400)

    // Verify the trainer owns this course
    const { rows: courseRows } = await query<{ instructor_id: string }>(
      'SELECT instructor_id FROM courses WHERE id = $1', [courseId]
    )
    if (!courseRows[0]) return notFound(res, 'Course not found')
    if (courseRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only add notes to your own courses')

    const { rows } = await query<CourseNoteRow>(
      `INSERT INTO course_notes (course_id, lesson_id, title, content, created_by, is_published)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [courseId, lessonId ?? null, title, content ?? '', req.user!.userId, isPublished ?? true]
    )
    const n = rows[0]
    return ok(res, {
      id: n.id, courseId: n.course_id, lessonId: n.lesson_id,
      title: n.title, content: n.content, isPublished: n.is_published,
      createdAt: n.created_at.toISOString(), updatedAt: n.updated_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

// ─── PUT /api/trainer/notes/:id ──────────────────────────────────────────────
export async function updateTrainerNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: existing } = await query<CourseNoteRow & { instructor_id: string }>(
      `SELECT cn.*, c.instructor_id FROM course_notes cn
       JOIN courses c ON c.id = cn.course_id WHERE cn.id = $1`,
      [req.params.id]
    )
    if (!existing[0]) return notFound(res, 'Note not found')
    if (existing[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only edit your own notes')

    const { title, content, lessonId, isPublished } = req.body as {
      title?: string; content?: string; lessonId?: string; isPublished?: boolean
    }
    const { rows } = await query<CourseNoteRow>(
      `UPDATE course_notes SET
        title = COALESCE($1, title), content = COALESCE($2, content),
        lesson_id = COALESCE($3, lesson_id), is_published = COALESCE($4, is_published),
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [title, content, lessonId ?? null, isPublished, req.params.id]
    )
    const n = rows[0]
    return ok(res, {
      id: n.id, courseId: n.course_id, lessonId: n.lesson_id,
      title: n.title, content: n.content, isPublished: n.is_published,
      createdAt: n.created_at.toISOString(), updatedAt: n.updated_at.toISOString(),
    })
  } catch (err) { next(err) }
}

// ─── DELETE /api/trainer/notes/:id ───────────────────────────────────────────
export async function deleteTrainerNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: existing } = await query<{ instructor_id: string }>(
      `SELECT c.instructor_id FROM course_notes cn
       JOIN courses c ON c.id = cn.course_id WHERE cn.id = $1`,
      [req.params.id]
    )
    if (!existing[0]) return notFound(res, 'Note not found')
    if (existing[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only delete your own notes')

    await query('DELETE FROM course_notes WHERE id = $1', [req.params.id])
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── GET /api/trainer/notes/courses/:courseId ────────────────────────────────
export async function getCourseNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CourseNoteRow>(
      `SELECT cn.*, l.title AS lesson_title, u.name AS creator_name
       FROM course_notes cn
       LEFT JOIN lessons l ON l.id = cn.lesson_id
       JOIN users u ON u.id = cn.created_by
       WHERE cn.course_id = $1 AND cn.is_published = TRUE
       ORDER BY cn.updated_at DESC`,
      [req.params.courseId]
    )
    return ok(res, rows.map(n => ({
      id: n.id, courseId: n.course_id, lessonId: n.lesson_id,
      title: n.title, content: n.content, isPublished: n.is_published,
      lessonTitle: n.lesson_title, creatorName: n.creator_name,
      createdAt: n.created_at.toISOString(), updatedAt: n.updated_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

// ─── POST /api/trainer/sessions ──────────────────────────────────────────────
export async function createTrainerSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, title, date, duration, meetUrl, sessionType, studentIds, extensionMinutes } = req.body as {
      courseId?: string; title?: string; date?: string; duration?: number; meetUrl?: string
      sessionType?: 'group' | 'individual'; studentIds?: string[]; extensionMinutes?: number
    }
    if (!courseId || !title || !date) return fail(res, 'courseId, title, and date are required', 400)

    // Verify the trainer owns this course
    const { rows: courseRows } = await query<{ instructor_id: string }>(
      'SELECT instructor_id FROM courses WHERE id = $1', [courseId]
    )
    if (!courseRows[0]) return notFound(res, 'Course not found')
    if (courseRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only schedule sessions for your own courses')

    // Auto-generate meeting link if not provided
    let finalMeetUrl = meetUrl?.trim() ?? ''
    if (!finalMeetUrl) {
      try {
        const meeting = await createMeetingLink({
          title,
          startTime: new Date(date),
          durationMinutes: duration ?? 60,
        })
        finalMeetUrl = meeting.url
      } catch (meetingError) {
        console.error('Failed to auto-generate meeting link:', meetingError)
      }
    }

    const startTime = new Date(date)
    const endTime = new Date(startTime.getTime() + (duration ?? 60) * 60000 + (extensionMinutes ?? 0) * 60000)

    const finalSessionType = sessionType === 'individual' ? 'individual' : 'group'
    const finalStudentIds = finalSessionType === 'individual' ? (studentIds ?? []) : '{}'

    const { rows } = await query<{
      id: string; course_id: string; title: string; date: Date
      duration: number; meet_url: string; status: string; attendees: number
      session_type: string; student_ids: string[]; extension_minutes: number
      start_time: Date | null; end_time: Date | null
    }>(
      `INSERT INTO live_classes (course_id, title, date, duration, meet_url, status, session_type, student_ids, extension_minutes, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5, 'scheduled', $6, $7, $8, $9, $10) RETURNING *`,
      [courseId, title, startTime, duration ?? 60, finalMeetUrl, finalSessionType, finalStudentIds, extensionMinutes ?? 0, startTime, endTime]
    )
    const s = rows[0]
    // Notify targeted students
    const targetStudentIds = finalSessionType === 'individual' ? finalStudentIds : undefined
    const notifyQuery = targetStudentIds?.length
      ? `SELECT id AS user_id FROM users WHERE id = ANY($2::uuid[]) AND role = 'student'`
      : `SELECT e.user_id FROM enrollments e WHERE e.course_id = $1`
    const notifyParams = targetStudentIds?.length ? [courseId, finalStudentIds] : [courseId]
    const { rows: studentRows } = await query<{ user_id: string }>(notifyQuery, notifyParams)
    await Promise.all(studentRows.map(r =>
      notifyUser(r.user_id, 'New Live Class Scheduled',
        `"${s.title}" has been scheduled. Check your dashboard for details.`,
        'announcement', `/dashboard/live-classes`)
    ))
    return ok(res, {
      id: s.id, courseId: s.course_id, title: s.title,
      date: s.date.toISOString(), duration: s.duration,
      meetUrl: s.meet_url, status: s.status, attendees: s.attendees,
      sessionType: s.session_type, studentIds: s.student_ids, extensionMinutes: s.extension_minutes,
      startTime: s.start_time?.toISOString() ?? null, endTime: s.end_time?.toISOString() ?? null,
    }, 201)
  } catch (err) { next(err) }
}

// ─── PUT /api/trainer/sessions/:id ───────────────────────────────────────────
export async function updateTrainerSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: existing } = await query<{ course_id: string; instructor_id: string; title: string; date: Date; duration: number; meet_url: string; session_type: string; student_ids: string[]; extension_minutes: number }>(
      `SELECT lc.*, c.instructor_id FROM live_classes lc
       JOIN courses c ON c.id = lc.course_id WHERE lc.id = $1`,
      [req.params.id]
    )
    if (!existing[0]) return notFound(res, 'Session not found')
    if (existing[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only edit your own sessions')

    const { title, date, duration, meetUrl, status, sessionType, studentIds, extensionMinutes } = req.body as {
      title?: string; date?: string; duration?: number; meetUrl?: string; status?: string
      sessionType?: 'group' | 'individual'; studentIds?: string[]; extensionMinutes?: number
    }

    // Auto-generate meeting link if meetUrl is being cleared or not provided
    let finalMeetUrl = meetUrl
    if (finalMeetUrl === undefined || finalMeetUrl === null) {
      finalMeetUrl = existing[0].meet_url
    }
    
    // If meetUrl is explicitly set to empty string and we have session details, generate one
    if (finalMeetUrl === '' && title && date) {
      try {
        const meeting = await createMeetingLink({
          title: title || existing[0].title,
          startTime: date ? new Date(date) : existing[0].date,
          durationMinutes: duration ?? existing[0].duration,
        })
        finalMeetUrl = meeting.url
      } catch (meetingError) {
        console.error('Failed to auto-generate meeting link:', meetingError)
      }
    }

    const startTime = date ? new Date(date) : existing[0].date
    const endTime = new Date(startTime.getTime() + (duration ?? existing[0].duration) * 60000 + (extensionMinutes ?? 0) * 60000)
    const finalSessionType = sessionType === 'individual' ? 'individual' : existing[0].session_type || 'group'
    const finalStudentIds = finalSessionType === 'individual' ? (studentIds ?? []) : '{}'

    const { rows } = await query<{
      id: string; course_id: string; title: string; date: Date
      duration: number; meet_url: string; status: string; attendees: number
      session_type: string; student_ids: string[]; extension_minutes: number
      start_time: Date | null; end_time: Date | null
    }>(
      `UPDATE live_classes SET
        title = COALESCE($1, title), date = COALESCE($2, date),
        duration = COALESCE($3, duration), meet_url = COALESCE($4, meet_url),
        status = COALESCE($5, status), session_type = COALESCE($6, session_type),
        student_ids = COALESCE($7, student_ids), extension_minutes = COALESCE($8, extension_minutes),
        start_time = COALESCE($9, start_time), end_time = COALESCE($10, end_time)
       WHERE id = $11 RETURNING *`,
      [title, date ? new Date(date) : undefined, duration, finalMeetUrl, status, finalSessionType, finalStudentIds, extensionMinutes ?? 0, startTime, endTime, req.params.id]
    )
    const s = rows[0]
    // Notify enrolled students about the updated session
    const { rows: studentRows } = await query<{ user_id: string }>(
      `SELECT e.user_id FROM enrollments e WHERE e.course_id = $1`, [s.course_id]
    )
    await Promise.all(studentRows.map(r =>
      notifyUser(r.user_id, 'Live Class Updated',
        `"${s.title}" has been updated. Check your dashboard for the latest details.`,
        'announcement', `/dashboard/live-classes`)
    ))
    return ok(res, {
      id: s.id, courseId: s.course_id, title: s.title,
      date: s.date.toISOString(), duration: s.duration,
      meetUrl: s.meet_url, status: s.status, attendees: s.attendees,
      sessionType: s.session_type, studentIds: s.student_ids, extensionMinutes: s.extension_minutes,
      startTime: s.start_time?.toISOString() ?? null, endTime: s.end_time?.toISOString() ?? null,
    })
  } catch (err) { next(err) }
}

// ─── DELETE /api/trainer/sessions/:id ────────────────────────────────────────
export async function deleteTrainerSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: existing } = await query<{ instructor_id: string }>(
      `SELECT c.instructor_id FROM live_classes lc
       JOIN courses c ON c.id = lc.course_id WHERE lc.id = $1`,
      [req.params.id]
    )
    if (!existing[0]) return notFound(res, 'Session not found')
    if (existing[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only delete your own sessions')

    // Notify enrolled students before deleting
    const { rows: studentRows } = await query<{ user_id: string; course_id: string }>(
      `SELECT e.user_id, lc.course_id FROM live_classes lc
       JOIN enrollments e ON e.course_id = lc.course_id WHERE lc.id = $1`,
      [req.params.id]
    )
    await Promise.all(studentRows.map(r =>
      notifyUser(r.user_id, 'Live Class Cancelled',
        `A live class has been cancelled. Please check your dashboard for updates.`,
        'announcement', `/dashboard/live-classes`)
    ))
    await query('DELETE FROM live_classes WHERE id = $1', [req.params.id])
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}