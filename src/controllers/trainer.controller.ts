import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'
import { notifyAudience } from '../utils/notify'
import type { CourseRow, LiveClassRow, AssignmentRow, UserRow } from '../types'

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const trainerId = req.user!.userId

    const { rows: studentRows } = await query<{ count: string }>(
      `SELECT COUNT(DISTINCT e.user_id) FROM enrollments e
       JOIN courses c ON c.id = e.course_id WHERE c.instructor_id = $1`, [trainerId]
    )
    const { rows: courseRows } = await query<{ count: string }>(
      `SELECT COUNT(*) FROM courses WHERE instructor_id = $1 AND status = 'published'`, [trainerId]
    )
    const { rows: sessionRows } = await query<{ count: string }>(
      `SELECT COUNT(*) FROM live_classes lc JOIN courses c ON c.id = lc.course_id WHERE c.instructor_id = $1`, [trainerId]
    )
    const { rows: upcomingRows } = await query<{ count: string }>(
      `SELECT COUNT(*) FROM live_classes lc JOIN courses c ON c.id = lc.course_id
       WHERE c.instructor_id = $1 AND lc.status = 'scheduled'`, [trainerId]
    )
    const { rows: pendingRows } = await query<{ count: string }>(
      `SELECT COUNT(*) FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id JOIN courses c ON c.id = a.course_id
       WHERE c.instructor_id = $1 AND s.status = 'pending'`, [trainerId]
    )
    const { rows: avgRows } = await query<{ avg: string }>(
      `SELECT COALESCE(AVG(e.progress), 0) AS avg FROM enrollments e
       JOIN courses c ON c.id = e.course_id WHERE c.instructor_id = $1`, [trainerId]
    )

    return ok(res, {
      totalStudents:     Number(studentRows[0].count),
      activeCourses:     Number(courseRows[0].count),
      totalSessions:     Number(sessionRows[0].count),
      avgCompletionRate: Math.round(Number(avgRows[0].avg)),
      pendingReviews:    Number(pendingRows[0].count),
      upcomingSessions:  Number(upcomingRows[0].count),
    })
  } catch (err) { next(err) }
}

export async function getTrainerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<UserRow>('SELECT * FROM users WHERE id = $1', [req.user!.userId])
    if (!rows[0]) return notFound(res, 'Trainer not found')
    const trainer = rows[0]
    return ok(res, { id: trainer.id, name: trainer.name, email: trainer.email, bio: trainer.bio, avatarUrl: trainer.avatar_url ?? undefined, createdAt: trainer.created_at.toISOString() })
  } catch (err) { next(err) }
}

export async function updateTrainerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, bio, avatarUrl } = req.body as { name?: string; bio?: string; avatarUrl?: string }
    const { rows } = await query<UserRow>(
      `UPDATE users SET name = COALESCE($1, name), bio = COALESCE($2, bio), avatar_url = COALESCE($3, avatar_url) WHERE id = $4 RETURNING *`,
      [name, bio, avatarUrl, req.user!.userId]
    )
    const trainer = rows[0]
    return ok(res, { id: trainer.id, name: trainer.name, email: trainer.email, bio: trainer.bio, avatarUrl: trainer.avatar_url ?? undefined, createdAt: trainer.created_at.toISOString() })
  } catch (err) { next(err) }
}

export async function getTrainerCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CourseRow & { enrolled_count: string; completion_rate: string }>(
      `SELECT c.*,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrolled_count,
        (SELECT COALESCE(AVG(e.progress), 0) FROM enrollments e WHERE e.course_id = c.id) AS completion_rate
       FROM courses c WHERE c.instructor_id = $1 ORDER BY c.created_at DESC`,
      [req.user!.userId]
    )
    return ok(res, rows.map(c => ({
      id: c.id, title: c.title, subject: c.subject, level: c.level, status: c.status,
      enrolledCount: Number(c.enrolled_count), lessonCount: c.lesson_count,
      completionRate: Math.round(Number(c.completion_rate)), createdAt: c.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function getTrainerStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{
      id: string; name: string; email: string; last_active: Date; created_at: Date
      course_id: string; progress: number
    }>(
      `SELECT DISTINCT u.id, u.name, u.email, u.last_active, u.created_at, e.course_id, e.progress
       FROM users u
       JOIN enrollments e ON e.user_id = u.id
       JOIN courses c ON c.id = e.course_id
       WHERE c.instructor_id = $1`,
      [req.user!.userId]
    )

    const studentsMap = new Map<string, {
      id: string; name: string; email: string; enrolledCourses: string[]
      progress: Record<string, number>; lastActive: string; joinedAt: string
    }>()

    for (const row of rows) {
      if (!studentsMap.has(row.id)) {
        studentsMap.set(row.id, {
          id: row.id, name: row.name, email: row.email,
          enrolledCourses: [], progress: {},
          lastActive: row.last_active.toISOString().slice(0, 10),
          joinedAt: row.created_at.toISOString().slice(0, 10),
        })
      }
      const student = studentsMap.get(row.id)!
      student.enrolledCourses.push(row.course_id)
      student.progress[row.course_id] = row.progress
    }

    return ok(res, Array.from(studentsMap.values()))
  } catch (err) { next(err) }
}

export async function getTrainerSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<LiveClassRow & { course_title: string }>(
      `SELECT lc.*, c.title AS course_title FROM live_classes lc
       JOIN courses c ON c.id = lc.course_id WHERE c.instructor_id = $1 ORDER BY lc.date DESC`,
      [req.user!.userId]
    )
    return ok(res, rows.map(s => ({
      id: s.id, courseId: s.course_id, courseTitle: s.course_title, title: s.title,
      date: s.date.toISOString(), duration: s.duration, meetUrl: s.meet_url,
      status: s.status, attendees: s.attendees,
    })))
  } catch (err) { next(err) }
}

export async function getTrainerAssignments(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<AssignmentRow & { course_title: string; total: string; pending: string }>(
      `SELECT a.*, c.title AS course_title,
        (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) AS total,
        (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id AND s.status = 'pending') AS pending
       FROM assignments a JOIN courses c ON c.id = a.course_id
       WHERE c.instructor_id = $1 ORDER BY a.due_date DESC`,
      [req.user!.userId]
    )
    return ok(res, rows.map(a => ({
      id: a.id, courseId: a.course_id, courseTitle: a.course_title, title: a.title,
      dueDate: a.due_date.toISOString().slice(0, 10),
      totalSubmissions: Number(a.total), pendingReview: Number(a.pending),
      totalMarks: Number(a.total_marks), passingScore: Number(a.passing_score),
      createdAt: a.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function getTrainerLessons(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ id: string; title: string; module_title: string; course_id: string; course_title: string }>(
      `SELECT l.id, l.title, m.title AS module_title, c.id AS course_id, c.title AS course_title FROM lessons l
       JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id
       WHERE c.instructor_id = $1 ORDER BY c.title, m.position, l.position`, [req.user!.userId]
    )
    return ok(res, rows.map(lesson => ({ id: lesson.id, title: lesson.title, moduleTitle: lesson.module_title, courseId: lesson.course_id, courseTitle: lesson.course_title })))
  } catch (error) { next(error) }
}

export async function createTrainerCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, subject, level, outcomes } = req.body as {
      title?: string; description?: string; subject?: string; level?: string; outcomes?: string[]
    }
    if (!title || !description || !subject || !level) {
      return fail(res, 'Title, description, subject, and level are required', 400)
    }
    if (!['mathematics', 'programming'].includes(subject)) return fail(res, 'Invalid subject', 400)
    if (!['beginner', 'intermediate', 'advanced'].includes(level)) return fail(res, 'Invalid level', 400)

    const { rows } = await query<CourseRow>(
      `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes)
       VALUES ($1, $2, $3, $4, $5, 'draft', $6) RETURNING *`,
      [title, description, subject, level, req.user!.userId, outcomes ?? []]
    )
    const c = rows[0]
    return ok(res, {
      id: c.id, title: c.title, subject: c.subject, level: c.level, status: c.status,
      enrolledCount: 0, lessonCount: 0, completionRate: 0, createdAt: c.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateTrainerCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: existingRows } = await query<CourseRow>('SELECT * FROM courses WHERE id = $1', [req.params.id])
    if (!existingRows[0]) return notFound(res, 'Course not found')
    if (existingRows[0].instructor_id !== req.user!.userId) {
      return forbidden(res, 'You can only edit your own courses')
    }

    const { title, description, subject, level, outcomes } = req.body as {
      title?: string; description?: string; subject?: string; level?: string; outcomes?: string[]
    }
    if (subject && !['mathematics', 'programming'].includes(subject)) return fail(res, 'Invalid subject', 400)
    if (level && !['beginner', 'intermediate', 'advanced'].includes(level)) return fail(res, 'Invalid level', 400)

    const { rows } = await query<CourseRow>(
      `UPDATE courses SET
        title = COALESCE($1, title), description = COALESCE($2, description),
        subject = COALESCE($3, subject), level = COALESCE($4, level),
        outcomes = COALESCE($5, outcomes)
       WHERE id = $6 RETURNING *`,
      [title, description, subject, level, outcomes, req.params.id]
    )
    const c = rows[0]
    return ok(res, { id: c.id, title: c.title, subject: c.subject, level: c.level, status: c.status })
  } catch (err) { next(err) }
}

export async function updateTrainerCourseStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status?: string }
    if (!status || !['published', 'draft', 'archived'].includes(status)) {
      return fail(res, 'status must be one of: published, draft, archived', 400)
    }

    const { rows: existingRows } = await query<CourseRow>('SELECT * FROM courses WHERE id = $1', [req.params.id])
    if (!existingRows[0]) return notFound(res, 'Course not found')
    if (existingRows[0].instructor_id !== req.user!.userId) {
      return forbidden(res, 'You can only manage your own courses')
    }

    const { rows } = await query<CourseRow>(
      `UPDATE courses SET status = $1 WHERE id = $2 RETURNING *`, [status, req.params.id]
    )
    const c = rows[0]

    if (status === 'published') {
      await notifyAudience('students', 'New course published',
        `"${c.title}" is now available. Check it out!`, 'course', `/courses/${c.id}`)
    }

    return ok(res, { id: c.id, status: c.status })
  } catch (err) { next(err) }
}
