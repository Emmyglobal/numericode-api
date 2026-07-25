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
        id: lesson.id, title: lesson.title, duration: lesson.duration,
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

export async function enrollWithTeacher(req: Request, res: Response, next: NextFunction) {
  try {
    const { preferredTeacherId, subjects } = req.body as {
      preferredTeacherId?: string; subjects?: string[]
    }
    const userId = req.user!.userId

    if (!preferredTeacherId?.trim()) return fail(res, 'Please select a teacher', 400)
    if (!Array.isArray(subjects) || subjects.length === 0 || subjects.some(s => !['mathematics', 'programming'].includes(s))) {
      return fail(res, 'Select at least one valid subject', 400)
    }

    const useAutomaticMatching = preferredTeacherId === 'auto'

    // Verify teacher exists and teaches the selected subjects
    const { rows: teachers } = useAutomaticMatching
      ? await query<{ name: string; subjects: string[] }>(
          `SELECT 'Automatic matching' AS name, $1::text[] AS subjects`,
          [subjects]
        )
      : await query<{ name: string; subjects: string[] }>(
          `SELECT u.name, ARRAY_AGG(DISTINCT c.subject ORDER BY c.subject) AS subjects FROM users u
           INNER JOIN courses c ON c.instructor_id = u.id
           WHERE u.id = $1 AND u.status = 'active' AND c.status = 'published'
           GROUP BY u.name`,
          [preferredTeacherId]
        )

    if (!teachers[0] || subjects.some(subject => !teachers[0].subjects.includes(subject))) {
      return fail(res, 'The selected teacher does not teach every chosen subject', 400)
    }

    // Enroll in one course per subject (the earliest published one not already enrolled)
    const enrollmentQuery = useAutomaticMatching
      ? `INSERT INTO enrollments (user_id, course_id)
         SELECT $1, id FROM (
           SELECT DISTINCT ON (subject) id FROM courses
           WHERE status = 'published' AND subject = ANY($2::text[])
             AND id NOT IN (SELECT course_id FROM enrollments WHERE user_id = $1)
           ORDER BY subject, created_at ASC
         ) AS matched_courses
         ON CONFLICT (user_id, course_id) DO NOTHING
         RETURNING course_id`
      : `INSERT INTO enrollments (user_id, course_id)
         SELECT $1, id FROM (
           SELECT DISTINCT ON (subject) id FROM courses
           WHERE status = 'published' AND instructor_id = $2 AND subject = ANY($3::text[])
             AND id NOT IN (SELECT course_id FROM enrollments WHERE user_id = $1)
           ORDER BY subject, created_at ASC
         ) AS matched_courses
         ON CONFLICT (user_id, course_id) DO NOTHING
         RETURNING course_id`

    const { rows: enrolled } = await query<{ course_id: string }>(
      enrollmentQuery,
      useAutomaticMatching ? [userId, subjects] : [userId, preferredTeacherId, subjects]
    )

    if (enrolled.length === 0) {
      return fail(res, 'No new courses available for the selected subjects and teacher. You may already be enrolled in all matching courses.', 409)
    }

    return ok(res, {
      enrolledCourses: enrolled.map(r => r.course_id),
      teacherName: teachers[0].name,
      subjects,
    }, 201)
  } catch (err) { next(err) }
}

export async function getCourseById(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CourseRow>('SELECT * FROM courses WHERE id = $1', [req.params.id])
    if (!rows[0]) return notFound(res, 'Course not found')
    return ok(res, await buildFullCourse(rows[0]))
  } catch (err) { next(err) }
}
