import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, notFound, fail } from '../utils/response'
import type { CourseRow, ModuleRow, LessonRow, ResourceRow, LiveClassRow } from '../types'

export async function buildFullCourse(course: CourseRow, includeProtectedContent = false, userId?: string) {
  const { rows: instructorRows } = await query<{ id: string; name: string; bio: string; avatar_url: string | null }>(
    'SELECT id, name, bio, avatar_url FROM users WHERE id = $1', [course.instructor_id]
  )
  const instructor = instructorRows[0]

  const { rows: modules } = await query<ModuleRow>(
    'SELECT * FROM modules WHERE course_id = $1 ORDER BY position', [course.id]
  )

  const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
    const { rows: lessons } = await query<LessonRow>(
      'SELECT * FROM lessons WHERE module_id = $1 ORDER BY position', [mod.id]
    )
    const lessonsWithResources = await Promise.all(lessons.map(async (lesson) => {
      const { rows: resources } = await query<ResourceRow>(
        'SELECT * FROM resources WHERE lesson_id = $1', [lesson.id]
      )
      return {
        id: lesson.id, title: lesson.title, content: lesson.content, duration: lesson.duration,
        isCompleted: userId ? Boolean((await query<{ id: string }>('SELECT id FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2', [userId, lesson.id])).rows[0]) : false,
        resources: includeProtectedContent ? resources.map(r => ({ id: r.id, title: r.title, type: r.type, url: r.url })) : [],
      }
    }))
    return { id: mod.id, title: mod.title, lessons: lessonsWithResources }
  }))

  const { rows: liveClasses } = await query<LiveClassRow>(
    'SELECT * FROM live_classes WHERE course_id = $1 ORDER BY date', [course.id]
  )

  return {
    id: course.id, title: course.title, description: course.description, content: course.content,
    subject: course.subject, level: course.level, lessonCount: course.lesson_count,
    accessLevel: course.access_level, priceCents: course.price_cents, currency: course.currency, premiumEnabled: course.premium_enabled,
    outcomes: course.outcomes, createdAt: course.created_at.toISOString(),
    instructor: { id: instructor.id, name: instructor.name, bio: instructor.bio, avatarUrl: instructor.avatar_url ?? undefined, credentials: [] as string[] },
    modules: modulesWithLessons,
    liveClasses: liveClasses.map(lc => ({
      id: lc.id, title: lc.title, date: lc.date.toISOString(),
      duration: lc.duration, meetUrl: includeProtectedContent ? lc.meet_url : '', status: lc.status,
    })),
  }
}

export async function listCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const { subject, q, accessLevel } = req.query as { subject?: string; q?: string; accessLevel?: string }
    const conditions: string[] = [`status = 'published'`]
    const params: unknown[] = []

    if (subject) { params.push(subject); conditions.push(`subject = $${params.length}`) }
    if (q)       { params.push(`%${q}%`); conditions.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`) }
    if (accessLevel && ['free', 'premium'].includes(accessLevel)) { params.push(accessLevel); conditions.push(`access_level = $${params.length}`) }

    const { rows } = await query<CourseRow>(
      `SELECT * FROM courses WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
      params
    )
    const fullCourses = await Promise.all(rows.map(course => buildFullCourse(course)))
    return ok(res, fullCourses)
  } catch (err) { next(err) }
}

export async function listAvailableTeachers(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ id: string; name: string; bio: string; avatarUrl: string | null; subjects: string[] }>(
      `SELECT u.id, u.name, u.bio, u.avatar_url AS "avatarUrl", ARRAY_AGG(DISTINCT c.subject ORDER BY c.subject) AS subjects
       FROM users u
       INNER JOIN courses c ON c.instructor_id = u.id
       WHERE c.status = 'published' AND u.status = 'active'
       GROUP BY u.id, u.name
       ORDER BY u.name`
    )
    return ok(res, rows)
  } catch (err) { next(err) }
}

export async function requestCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: courses } = await query<CourseRow>(`SELECT * FROM courses WHERE id = $1 AND status = 'published'`, [req.params.id])
    if (!courses[0]) return notFound(res, 'Course is not available for enrolment')
    const course = courses[0]
    const { rows: enrolled } = await query(`SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2`, [req.user!.userId, req.params.id])
    if (enrolled[0]) return fail(res, 'You are already enrolled in this course', 409)
    if (course.access_level === 'premium') {
      if (!course.premium_enabled) return fail(res, 'Premium access is temporarily unavailable for this course', 403)
      const { rows: subscriptions } = await query<{ id: string }>(
        `SELECT id FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW() LIMIT 1`, [req.user!.userId]
      )
      if (!subscriptions[0]) return fail(res, 'An active Premium subscription is required to enrol in this course', 403)
    }
    await query(`INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [req.user!.userId, req.params.id])
    return ok(res, { status: 'enrolled', courseId: req.params.id }, 201)
  } catch (err) { next(err) }
}

export async function getAvailableCoursesForEnrollment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { teacherId } = req.query as { teacherId?: string }

    let { rows } = await query<{ id: string; title: string; subject: string; level: string; instructor_name: string; instructor_id: string }>(
      `SELECT c.id, c.title, c.subject, c.level, u.name AS instructor_name, c.instructor_id
       FROM courses c
       JOIN users u ON u.id = c.instructor_id
       WHERE c.status = 'published'
         AND c.id NOT IN (SELECT course_id FROM enrollments WHERE user_id = $1)
         ${teacherId ? 'AND c.instructor_id = $2' : ''}
       ORDER BY c.subject, c.title`,
      teacherId ? [userId, teacherId] : [userId]
    )

    return ok(res, rows.map(r => ({
      id: r.id,
      title: r.title,
      subject: r.subject,
      level: r.level,
      instructorName: r.instructor_name,
      instructorId: r.instructor_id,
    })))
  } catch (err) { next(err) }
}

export async function enrollInCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseIds } = req.body as { courseIds?: string[] }
    const userId = req.user!.userId

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return fail(res, 'Please select at least one course to enrol in', 400)
    }

    // Verify all courses exist, are published, and student isn't already enrolled
    const { rows: validCourses } = await query<{ id: string; title: string; access_level: string; premium_enabled: boolean }>(
      `SELECT id, title, access_level, premium_enabled FROM courses
       WHERE id = ANY($1::uuid[]) AND status = 'published'`,
      [courseIds]
    )

    if (validCourses.length !== courseIds.length) {
      return fail(res, 'One or more selected courses are not available for enrolment', 400)
    }

    // Check for premium courses
    const premiumCourses = validCourses.filter(c => c.access_level === 'premium')
    if (premiumCourses.length > 0) {
      const hasPremium = premiumCourses.some(c => !c.premium_enabled)
      if (hasPremium) return fail(res, 'Premium access is temporarily unavailable for one of the selected courses', 403)

      const { rows: subscriptions } = await query<{ id: string }>(
        `SELECT id FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW() LIMIT 1`,
        [userId]
      )
      if (!subscriptions[0]) return fail(res, 'An active Premium subscription is required to enrol in premium courses', 403)
    }

    // Check which courses the student is already enrolled in
    const { rows: alreadyEnrolled } = await query<{ course_id: string }>(
      'SELECT course_id FROM enrollments WHERE user_id = $1 AND course_id = ANY($2::uuid[])',
      [userId, courseIds]
    )

    if (alreadyEnrolled.length > 0) {
      return fail(res, 'You are already enrolled in one or more of the selected courses', 409)
    }

    // Enroll in all selected courses
    const enrolledIds: string[] = []
    for (const courseId of courseIds) {
      const { rows } = await query<{ course_id: string }>(
        `INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING course_id`,
        [userId, courseId]
      )
      if (rows[0]) enrolledIds.push(rows[0].course_id)
    }

    if (enrolledIds.length === 0) {
      return fail(res, 'Could not enrol in any of the selected courses', 409)
    }

    return ok(res, { enrolledCourses: enrolledIds, count: enrolledIds.length }, 201)
  } catch (err) { next(err) }
}

export async function getCourseById(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CourseRow>('SELECT * FROM courses WHERE id = $1', [req.params.id])
    if (!rows[0]) return notFound(res, 'Course not found')
    return ok(res, await buildFullCourse(rows[0]))
  } catch (err) { next(err) }
}
