import type { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { query, getClient } from '../db/pool'
import { ok, fail, notFound } from '../utils/response'
import { notifyUser, notifyAudience } from '../utils/notify'
import { sendActivationEmail } from '../utils/mailer'
import type { UserRow, CourseRow, AnnouncementRow } from '../types'

export async function getStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const [{ rows: totalUsers }, { rows: students }, { rows: trainers },
           { rows: courses }, { rows: activeCourses }, { rows: sessions },
           { rows: enrolments }, { rows: pendingTrainers }] = await Promise.all([
      query<{ count: string }>(`SELECT COUNT(*) FROM users`),
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE role = 'student'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE role = 'trainer'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM courses`),
      query<{ count: string }>(`SELECT COUNT(*) FROM courses WHERE status = 'published'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM live_classes`),
      query<{ count: string }>(`SELECT COUNT(*) FROM enrollments`),
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE role = 'trainer' AND status = 'pending'`),
    ])

    return ok(res, {
      totalUsers:        Number(totalUsers[0].count),
      totalStudents:     Number(students[0].count),
      totalTrainers:     Number(trainers[0].count),
      totalCourses:      Number(courses[0].count),
      activeCourses:     Number(activeCourses[0].count),
      totalLiveSessions: Number(sessions[0].count),
      totalEnrolments:   Number(enrolments[0].count),
      pendingTrainers:   Number(pendingTrainers[0].count),
      platformGrowth:    23, // Placeholder — requires historical snapshot table for real calculation
    })
  } catch (err) { next(err) }
}

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<UserRow>(`SELECT * FROM users ORDER BY created_at DESC`)
    return ok(res, rows.map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role, status: u.status,
      joinedAt: u.created_at.toISOString().slice(0, 10),
      lastActive: u.last_active.toISOString().slice(0, 10),
    })))
  } catch (err) { next(err) }
}

/** Trainers only, used to populate the "Assign Instructor" dropdown when admin creates a course. */
export async function getTrainers(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<UserRow>(`SELECT * FROM users WHERE role = 'trainer' AND status = 'active' ORDER BY name`)
    return ok(res, rows.map(u => ({ id: u.id, name: u.name, email: u.email })))
  } catch (err) { next(err) }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, role } = req.body as { status?: string; role?: string }
    const validStatuses = ['active', 'suspended', 'pending']
    const validRoles    = ['student', 'trainer', 'admin']
    if (status && !validStatuses.includes(status)) return fail(res, 'Invalid status value', 400)
    if (role && !validRoles.includes(role))         return fail(res, 'Invalid role value', 400)

    const { rows: beforeRows } = await query<UserRow>('SELECT * FROM users WHERE id = $1', [req.params.id])
    if (!beforeRows[0]) return notFound(res, 'User not found')
    const before = beforeRows[0]

    const { rows } = await query<UserRow>(
      `UPDATE users SET status = COALESCE($1, status), role = COALESCE($2, role) WHERE id = $3 RETURNING *`,
      [status, role, req.params.id]
    )
    const u = rows[0]

    // When a user transitions from pending → active, generate activation token and send email
    if (status === 'active' && before.status === 'pending') {
      // Generate a secure activation token (expires in 7 days)
      const activationToken = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(activationToken).digest('hex')
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await query(
        `INSERT INTO activation_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [u.id, tokenHash, expiresAt]
      )

      // Send activation email (non-blocking — don't let email failures break approval)
      sendActivationEmail(u.email, u.name, u.role, activationToken).catch(() => {})

      // In-app notification
      await notifyUser(u.id, `Your ${u.role} account was approved!`,
        'Please check your email and click the activation link to access your dashboard.', 'general')
    } else if (status === 'suspended' && before.status !== 'suspended') {
      await notifyUser(u.id, 'Your account was suspended',
        'Contact platform support if you believe this is a mistake.', 'general')
    } else if (status === 'active' && before.status === 'suspended') {
      await notifyUser(u.id, 'Your account was reactivated',
        'You can now log in again.', 'general', u.role === 'trainer' ? '/trainer' : '/dashboard')
    }

    return ok(res, {
      id: u.id, name: u.name, email: u.email, role: u.role, status: u.status,
      joinedAt: u.created_at.toISOString().slice(0, 10),
      lastActive: u.last_active.toISOString().slice(0, 10),
    })
  } catch (err) { next(err) }
}

export async function getCourses(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CourseRow & { instructor_name: string; enrolled_count: string }>(
      `SELECT c.*, u.name AS instructor_name,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrolled_count
       FROM courses c JOIN users u ON u.id = c.instructor_id ORDER BY c.created_at DESC`
    )
    return ok(res, rows.map(c => ({
      id: c.id, title: c.title, subject: c.subject, level: c.level,
      instructor: c.instructor_name, instructorId: c.instructor_id, status: c.status,
      accessLevel: c.access_level, priceCents: c.price_cents, currency: c.currency, premiumEnabled: c.premium_enabled,
      enrolledCount: Number(c.enrolled_count), createdAt: c.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, subject, level, instructorId, outcomes, accessLevel = 'free', priceCents = 0, currency = 'NGN', premiumEnabled = true } = req.body as {
      title?: string; description?: string; subject?: string; level?: string
      instructorId?: string; outcomes?: string[]; accessLevel?: string; priceCents?: number; currency?: string; premiumEnabled?: boolean
    }
    if (!title || !description || !subject || !level || !instructorId) {
      return fail(res, 'Title, description, subject, level, and instructorId are required', 400)
    }
    if (!['mathematics', 'programming'].includes(subject)) return fail(res, 'Invalid subject', 400)
    if (!['beginner', 'intermediate', 'advanced'].includes(level)) return fail(res, 'Invalid level', 400)
    if (!['free', 'premium'].includes(accessLevel)) return fail(res, 'Invalid accessLevel', 400)
    if (!Number.isInteger(priceCents) || priceCents < 0) return fail(res, 'priceCents must be a non-negative integer', 400)

    const { rows: instructorRows } = await query<UserRow>(
      `SELECT * FROM users WHERE id = $1 AND role = 'trainer'`, [instructorId]
    )
    if (!instructorRows[0]) return fail(res, 'instructorId must reference an existing trainer', 400)

    const { rows } = await query<CourseRow>(
      `INSERT INTO courses (title, description, subject, level, instructor_id, status, outcomes, access_level, price_cents, currency, premium_enabled)
       VALUES ($1, $2, $3, $4, $5, 'draft', $6, $7, $8, $9, $10) RETURNING *`,
      [title, description, subject, level, instructorId, outcomes ?? [], accessLevel, priceCents, currency, premiumEnabled]
    )
    const c = rows[0]

    await notifyUser(instructorId, 'A course was created for you',
      `An admin created the course "${c.title}" and assigned you as instructor. It's currently a draft.`,
      'course', '/trainer/courses')

    return ok(res, {
      id: c.id, title: c.title, subject: c.subject, level: c.level,
      instructor: instructorRows[0].name, status: c.status,
      enrolledCount: 0, accessLevel: c.access_level, priceCents: c.price_cents, currency: c.currency, premiumEnabled: c.premium_enabled, createdAt: c.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateCourseAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const { accessLevel, priceCents, currency, premiumEnabled } = req.body as { accessLevel?: string; priceCents?: number; currency?: string; premiumEnabled?: boolean }
    if (accessLevel && !['free', 'premium'].includes(accessLevel)) return fail(res, 'Invalid accessLevel', 400)
    if (priceCents !== undefined && (!Number.isInteger(priceCents) || priceCents < 0)) return fail(res, 'priceCents must be a non-negative integer', 400)
    if (currency && !/^[A-Z]{3}$/.test(currency)) return fail(res, 'currency must be a three-letter code', 400)
    const { rows } = await query<CourseRow>(
      `UPDATE courses SET access_level = COALESCE($1, access_level), price_cents = COALESCE($2, price_cents),
        currency = COALESCE($3, currency), premium_enabled = COALESCE($4, premium_enabled) WHERE id = $5 RETURNING *`,
      [accessLevel, priceCents, currency, premiumEnabled, req.params.id]
    )
    if (!rows[0]) return notFound(res, 'Course not found')
    const course = rows[0]
    return ok(res, { id: course.id, accessLevel: course.access_level, priceCents: course.price_cents, currency: course.currency, premiumEnabled: course.premium_enabled })
  } catch (error) { next(error) }
}

export async function getCourseCompletionSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ minimum_lesson_completion: number; minimum_assignment_percentage: number; minimum_attendance_percentage: number }>(
      `SELECT * FROM course_completion_settings WHERE course_id = $1`, [req.params.id]
    )
    const settings = rows[0] ?? { minimum_lesson_completion: 100, minimum_assignment_percentage: 50, minimum_attendance_percentage: 0 }
    return ok(res, { minimumLessonCompletion: settings.minimum_lesson_completion, minimumAssignmentPercentage: Number(settings.minimum_assignment_percentage), minimumAttendancePercentage: Number(settings.minimum_attendance_percentage) })
  } catch (error) { next(error) }
}

export async function updateCourseCompletionSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { minimumLessonCompletion = 100, minimumAssignmentPercentage = 50, minimumAttendancePercentage = 0 } = req.body as { minimumLessonCompletion?: number; minimumAssignmentPercentage?: number; minimumAttendancePercentage?: number }
    const values = [minimumLessonCompletion, minimumAssignmentPercentage, minimumAttendancePercentage]
    if (values.some(value => typeof value !== 'number' || value < 0 || value > 100)) return fail(res, 'Completion settings must be percentages between 0 and 100', 400)
    const { rows: courses } = await query<{ id: string }>('SELECT id FROM courses WHERE id = $1', [req.params.id])
    if (!courses[0]) return notFound(res, 'Course not found')
    const { rows } = await query<{ minimum_lesson_completion: number; minimum_assignment_percentage: number; minimum_attendance_percentage: number }>(
      `INSERT INTO course_completion_settings (course_id, minimum_lesson_completion, minimum_assignment_percentage, minimum_attendance_percentage)
       VALUES ($1, $2, $3, $4) ON CONFLICT (course_id) DO UPDATE SET minimum_lesson_completion = EXCLUDED.minimum_lesson_completion,
       minimum_assignment_percentage = EXCLUDED.minimum_assignment_percentage, minimum_attendance_percentage = EXCLUDED.minimum_attendance_percentage RETURNING *`,
      [req.params.id, minimumLessonCompletion, minimumAssignmentPercentage, minimumAttendancePercentage]
    )
    const settings = rows[0]
    return ok(res, { minimumLessonCompletion: settings.minimum_lesson_completion, minimumAssignmentPercentage: Number(settings.minimum_assignment_percentage), minimumAttendancePercentage: Number(settings.minimum_attendance_percentage) })
  } catch (error) { next(error) }
}

export async function updateCourseStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status?: string }
    if (!status || !['published', 'draft', 'archived'].includes(status)) {
      return fail(res, 'status must be one of: published, draft, archived', 400)
    }
    const { rows } = await query<CourseRow>(
      `UPDATE courses SET status = $1 WHERE id = $2 RETURNING *`, [status, req.params.id]
    )
    if (!rows[0]) return notFound(res, 'Course not found')
    const c = rows[0]

    if (status === 'published') {
      await notifyAudience('students', 'New course published',
        `"${c.title}" is now available. Check it out!`, 'course', `/courses/${c.id}`)
    }

    return ok(res, { id: c.id, status: c.status })
  } catch (err) { next(err) }
}

export async function getCourseRequests(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ id: string; status: string; created_at: Date; student_name: string; course_title: string }>(
      `SELECT cr.id, cr.status, cr.created_at, u.name AS student_name, c.title AS course_title
       FROM course_requests cr JOIN users u ON u.id = cr.user_id JOIN courses c ON c.id = cr.course_id
       ORDER BY cr.created_at DESC`
    )
    return ok(res, rows.map(request => ({ id: request.id, status: request.status, requestedAt: request.created_at.toISOString(), studentName: request.student_name, courseTitle: request.course_title })))
  } catch (err) { next(err) }
}

export async function reviewCourseRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status?: 'approved' | 'rejected' }
    if (!status || !['approved', 'rejected'].includes(status)) return fail(res, 'Status must be approved or rejected', 400)
    const { rows } = await query<{ user_id: string; course_id: string }>(
      `UPDATE course_requests SET status = $1, reviewed_at = NOW(), reviewed_by = $2 WHERE id = $3 AND status = 'pending' RETURNING user_id, course_id`,
      [status, req.user!.userId, req.params.id]
    )
    if (!rows[0]) return notFound(res, 'Pending course request not found')
    if (status === 'approved') await query(`INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [rows[0].user_id, rows[0].course_id])
    return ok(res, { id: req.params.id, status })
  } catch (err) { next(err) }
}

export async function getAnnouncements(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<AnnouncementRow & { created_by_name: string }>(
      `SELECT a.*, u.name AS created_by_name FROM announcements a
       JOIN users u ON u.id = a.created_by ORDER BY a.created_at DESC`
    )
    return ok(res, rows.map(a => ({
      id: a.id, title: a.title, body: a.body, audience: a.audience,
      createdAt: a.created_at.toISOString().slice(0, 10), createdBy: a.created_by_name,
    })))
  } catch (err) { next(err) }
}

export async function createAnnouncement(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, body, audience } = req.body as { title?: string; body?: string; audience?: string }
    if (!title || !body) return fail(res, 'Title and body are required', 400)
    const finalAudience = ['all', 'students', 'trainers'].includes(audience ?? '') ? audience! : 'all'

    const { rows } = await query<AnnouncementRow>(
      `INSERT INTO announcements (title, body, audience, created_by) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, body, finalAudience, req.user!.userId]
    )
    const a = rows[0]

    await notifyAudience(finalAudience as 'all' | 'students' | 'trainers', a.title, a.body, 'announcement')

    return ok(res, {
      id: a.id, title: a.title, body: a.body, audience: a.audience,
      createdAt: a.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}
