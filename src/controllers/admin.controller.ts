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
           { rows: enrolments }, { rows: pendingTrainers },
           { rows: thisMonthUsersRows }, { rows: lastMonthUsersRows },
            { rows: thisMonthEnrolmentsRows }, { rows: lastMonthEnrolmentsRows }] = await Promise.all([
      query<{ count: string }>(`SELECT COUNT(*) FROM users`),
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE role = 'student'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE role = 'trainer'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM courses`),
      query<{ count: string }>(`SELECT COUNT(*) FROM courses WHERE status = 'published'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM live_classes`),
      query<{ count: string }>(`SELECT COUNT(*) FROM enrollments`),
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE role = 'trainer' AND status = 'pending'`),
      // Users created this month
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE created_at >= date_trunc('month', NOW())`),
      // Users created last month
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE created_at >= date_trunc('month', NOW() - INTERVAL '1 month') AND created_at < date_trunc('month', NOW())`),
      // Enrollments this month
      query<{ count: string }>(`SELECT COUNT(*) FROM enrollments WHERE enrolled_at >= date_trunc('month', NOW())`),
      // Enrollments last month
      query<{ count: string }>(`SELECT COUNT(*) FROM enrollments WHERE enrolled_at >= date_trunc('month', NOW() - INTERVAL '1 month') AND enrolled_at < date_trunc('month', NOW())`),
    ])

    // Calculate growth rates
    const thisMonthUsers = Number(thisMonthUsersRows[0].count)
    const lastMonthUsers = Number(lastMonthUsersRows[0].count)
    const thisMonthEnrollments = Number(thisMonthEnrolmentsRows[0].count)
    const lastMonthEnrollments = Number(lastMonthEnrolmentsRows[0].count)
    
    // Overall platform growth (combination of user signups and enrollments)
    const thisMonthCount = thisMonthUsers + thisMonthEnrollments
    const lastMonthCount = lastMonthUsers + lastMonthEnrollments
    let platformGrowth = 0
    if (lastMonthCount > 0) {
      platformGrowth = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
    } else if (thisMonthCount > 0) {
      platformGrowth = 100
    }
    
    // User-specific growth
    let userGrowth = 0
    if (lastMonthUsers > 0) {
      userGrowth = Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100)
    } else if (thisMonthUsers > 0) {
      userGrowth = 100
    }
    
    // Enrollment-specific growth
    let enrollmentGrowth = 0
    if (lastMonthEnrollments > 0) {
      enrollmentGrowth = Math.round(((thisMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100)
    } else if (thisMonthEnrollments > 0) {
      enrollmentGrowth = 100
    }

    return ok(res, {
      totalUsers:        Number(totalUsers[0].count),
      totalStudents:     Number(students[0].count),
      totalTrainers:     Number(trainers[0].count),
      totalCourses:      Number(courses[0].count),
      activeCourses:     Number(activeCourses[0].count),
      totalLiveSessions: Number(sessions[0].count),
      totalEnrolments:   Number(enrolments[0].count),
      pendingTrainers:   Number(pendingTrainers[0].count),
      platformGrowth,
      userGrowth,
      enrollmentGrowth,
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
      `UPDATE users SET status = COALESCE($1, status), role = COALESCE($2, role), account_activated = CASE WHEN $1 = 'active' THEN TRUE ELSE account_activated END WHERE id = $3 RETURNING *`,
      [status, role, req.params.id]
    )
    const u = rows[0]

    // When a user transitions from pending → active, generate activation token and send email.
    // We also mark the account active immediately so the approved user can sign in without
    // being trapped behind a stale activation flag on the same approval event.
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
      console.log('Sending activation email to:', u.email)
      sendActivationEmail(u.email, u.name, u.role, activationToken).catch(err => {
        console.error('Activation email error:', err)
      })

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

/**
 * Reassign a student to a different trainer by updating the instructor
 * on all courses the student is enrolled in that belong to the old trainer.
 * Also updates the guardian_enrollments.preferred_teacher if it exists.
 */
export async function reassignStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId, newTrainerId } = req.body as { studentId?: string; newTrainerId?: string }
    if (!studentId || !newTrainerId) return fail(res, 'studentId and newTrainerId are required', 400)

    // Verify student exists
    const { rows: studentRows } = await query<UserRow>('SELECT * FROM users WHERE id = $1 AND role = $2', [studentId, 'student'])
    if (!studentRows[0]) return notFound(res, 'Student not found')

    // Verify new trainer exists and is active
    const { rows: trainerRows } = await query<UserRow>(
      'SELECT * FROM users WHERE id = $1 AND role = $2 AND status = $3', [newTrainerId, 'trainer', 'active']
    )
    if (!trainerRows[0]) return fail(res, 'Trainer not found or not active', 400)

    const client = await getClient()
    try {
      await client.query('BEGIN')

      // Get all courses the student is enrolled in
      const { rows: enrolledCourses } = await client.query<{ course_id: string; instructor_id: string }>(
        `SELECT e.course_id, c.instructor_id FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         WHERE e.user_id = $1`,
        [studentId]
      )

      // Reassign each course to the new trainer
      for (const course of enrolledCourses) {
        await client.query(
          `UPDATE courses SET instructor_id = $1 WHERE id = $2`,
          [newTrainerId, course.course_id]
        )
      }

      // Update guardian_enrollments preferred_teacher if exists
      const { rows: guardianRows } = await client.query<{ id: string }>(
        'SELECT id FROM guardian_enrollments WHERE student_id = $1',
        [studentId]
      )
      if (guardianRows[0]) {
        await client.query(
          `UPDATE guardian_enrollments SET preferred_teacher = $1 WHERE student_id = $2`,
          [trainerRows[0].name, studentId]
        )
      }

      await client.query('COMMIT')

      // Notify both users
      await notifyUser(studentId, 'Your trainer has been reassigned',
        `You have been reassigned to trainer ${trainerRows[0].name}.`, 'general')
      await notifyUser(newTrainerId, 'New student assigned to you',
        `Student ${studentRows[0].name} has been reassigned to your courses.`, 'general')

      return ok(res, {
        message: `Student reassigned to trainer ${trainerRows[0].name}`,
        coursesUpdated: enrolledCourses.length,
      })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (err) { next(err) }
}

/**
 * Reassign a course to a different trainer (admin only).
 */
export async function reassignCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, newTrainerId } = req.body as { courseId?: string; newTrainerId?: string }
    if (!courseId || !newTrainerId) return fail(res, 'courseId and newTrainerId are required', 400)

    const { rows: courseRows } = await query<CourseRow>('SELECT * FROM courses WHERE id = $1', [courseId])
    if (!courseRows[0]) return notFound(res, 'Course not found')

    const { rows: trainerRows } = await query<UserRow>(
      'SELECT * FROM users WHERE id = $1 AND role = $2 AND status = $3', [newTrainerId, 'trainer', 'active']
    )
    if (!trainerRows[0]) return fail(res, 'Trainer not found or not active', 400)

    await query('UPDATE courses SET instructor_id = $1 WHERE id = $2', [newTrainerId, courseId])

    await notifyUser(newTrainerId, 'Course assigned to you',
      `The course "${courseRows[0].title}" has been assigned to you.`, 'course', '/trainer/courses')

    return ok(res, { message: `Course reassigned to ${trainerRows[0].name}` })
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

export async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = String(req.params.id)

    // Check if course exists
    const { rows: courseRows } = await query<CourseRow>('SELECT * FROM courses WHERE id = $1', [courseId])
    if (!courseRows[0]) return notFound(res, 'Course not found')

    const course = courseRows[0]

    // Delete course - cascade will handle related data (enrollments, lessons, modules, etc.)
    await query('DELETE FROM courses WHERE id = $1', [courseId])

    return ok(res, {
      message: 'Course and all associated data deleted successfully',
      deletedCourseId: courseId,
      deletedCourseTitle: course.title,
      deletedAt: new Date().toISOString(),
    })
  } catch (err) { next(err) }
}

export async function getPayments(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{
      id: string
      user_id: string
      course_id: string
      reference: string
      email: string
      amount_subunits: number
      currency: string
      status: 'pending' | 'verified' | 'failed' | 'abandoned' | 'refunded' | 'disputed'
      failure_reason: string | null
      initialized_at: Date
      paid_at: Date | null
      verified_at: Date | null
      user_name: string
      user_email: string
      course_title: string
      course_access_level: string
      course_price_cents: number
      course_currency: string
      is_enrolled: boolean
    }>(`
      SELECT
        p.id, p.user_id, p.course_id, p.reference, p.email,
        p.amount_subunits, p.currency, p.status, p.failure_reason,
        p.initialized_at, p.paid_at, p.verified_at,
        u.name AS user_name, u.email AS user_email,
        c.title AS course_title, c.access_level AS course_access_level,
        c.price_cents AS course_price_cents, c.currency AS course_currency,
        EXISTS(SELECT 1 FROM enrollments e WHERE e.user_id = p.user_id AND e.course_id = p.course_id) AS is_enrolled
      FROM payments p
      JOIN users u ON u.id = p.user_id
      JOIN courses c ON c.id = p.course_id
      ORDER BY p.initialized_at DESC
    `)
    return ok(res, rows.map(p => ({
      id: p.id,
      userId: p.user_id,
      courseId: p.course_id,
      reference: p.reference,
      email: p.email,
      amountSubunits: p.amount_subunits,
      currency: p.currency,
      status: p.status,
      failureReason: p.failure_reason,
      initializedAt: p.initialized_at.toISOString(),
      paidAt: p.paid_at?.toISOString() ?? null,
      verifiedAt: p.verified_at?.toISOString() ?? null,
      user: { id: p.user_id, name: p.user_name, email: p.user_email },
      course: { id: p.course_id, title: p.course_title, accessLevel: p.course_access_level, priceCents: p.course_price_cents, currency: p.course_currency },
      isEnrolled: p.is_enrolled,
    })))
  } catch (err) { next(err) }
}

export async function approvePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const paymentId = String(req.params.id)

    // Get the payment record
    const { rows: paymentRows } = await query<{
      id: string
      user_id: string
      course_id: string
      reference: string
      amount_subunits: number
      currency: string
      status: 'pending' | 'verified' | 'failed' | 'abandoned' | 'refunded' | 'disputed'
      provider_reference: string | null
      paid_at: Date | null
    }>('SELECT * FROM payments WHERE id = $1', [paymentId])
    
    if (!paymentRows[0]) return notFound(res, 'Payment not found')

    const payment = paymentRows[0]

    // Can only approve pending payments
    if (payment.status !== 'pending') {
      return fail(res, `Cannot approve payment with status '${payment.status}'`, 400)
    }

    // Update payment status to verified
    await query(
      `UPDATE payments SET status = 'verified', verified_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [paymentId]
    )

    // Grant enrollment (idempotent - won't fail if already enrolled)
    await query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING',
      [payment.user_id, payment.course_id]
    )

    // Notify the user about successful enrollment
    const { rows: userRows } = await query<{ name: string; email: string }>(
      'SELECT name, email FROM users WHERE id = $1',
      [payment.user_id]
    )
    const { rows: courseRows } = await query<{ title: string }>(
      'SELECT title FROM courses WHERE id = $1',
      [payment.course_id]
    )

    if (userRows[0] && courseRows[0]) {
      await notifyUser(
        payment.user_id,
        'Payment Approved — Enrollment Confirmed',
        `Your payment for "${courseRows[0].title}" has been approved. You now have full access to the course.`,
        'general'
      ).catch(() => {})
    }

    return ok(res, {
      message: 'Payment approved and enrollment granted',
      paymentId: payment.id,
      userId: payment.user_id,
      courseId: payment.course_id,
      courseTitle: courseRows[0]?.title,
      approvedAt: new Date().toISOString(),
    })
  } catch (err) { next(err) }
}

export async function suspendUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = req.body as { reason?: string }
    const userId = String(req.params.id)

    // Get user details before suspension
    const { rows: userRows } = await query<UserRow>(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    )
    if (!userRows[0]) return notFound(res, 'User not found')

    const user = userRows[0]
    
    // Don't suspend if already suspended
    if (user.status === 'suspended') {
      return fail(res, 'User is already suspended', 400)
    }

    // Update user status to suspended
    await query(
      'UPDATE users SET status = $1 WHERE id = $2',
      ['suspended', userId]
    )

    // Send suspension email to user
    const { sendAccountSuspendedEmail } = await import('../utils/mailer')
    await sendAccountSuspendedEmail(user.email, user.name, reason).catch((err) => {
      console.error('Failed to send suspension email:', err)
    })

    // Send in-app notification
    await notifyUser(userId, 'Your account has been suspended',
      reason ? `Reason: ${reason}` : 'Contact support if you have questions', 'general')

    return ok(res, {
      message: 'User account suspended successfully',
      userId,
      userEmail: user.email,
      suspendedAt: new Date().toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = req.body as { reason?: string }
    const userId = String(req.params.id)

    // Prevent self-deletion
    if (userId === req.user?.userId) {
      return fail(res, 'Cannot delete your own account', 400)
    }

    // Get user details before deletion
    const { rows: userRows } = await query<UserRow>(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    )
    if (!userRows[0]) return notFound(res, 'User not found')

    const user = userRows[0]

    // Store user info for email before deletion
    const userEmail = user.email
    const userName = user.name

    // Delete user - cascade will handle related data
    // The database schema has ON DELETE CASCADE for most tables
    await query(
      'DELETE FROM users WHERE id = $1',
      [userId]
    )

    // Send deletion email to user (using stored email/name)
    const { sendAccountDeletedEmail } = await import('../utils/mailer')
    await sendAccountDeletedEmail(userEmail, userName, reason).catch((err) => {
      console.error('Failed to send deletion email:', err)
    })

    return ok(res, {
      message: 'User account and all associated data deleted successfully',
      deletedUserId: userId,
      deletedUserEmail: userEmail,
      deletedAt: new Date().toISOString(),
    })
  } catch (err) { next(err) }
}