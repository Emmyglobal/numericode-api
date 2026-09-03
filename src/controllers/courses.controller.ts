import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, notFound, fail, forbidden } from '../utils/response'
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
        // Lesson body content is gated content: public consumers (GET /courses/:id)
        // receive curriculum metadata only (Phase 11). Full content is returned
        // only to enrolled students via the protected dashboard endpoint
        // (GET /dashboard/courses/:id, includeProtectedContent=true).
        ...(includeProtectedContent ? { content: lesson.content } : {}),
        isCompleted: userId ? Boolean((await query<{ id: string }>('SELECT id FROM lesson_completions WHERE user_id = $1 AND lesson_id = $2', [userId, lesson.id])).rows[0]) : false,
        resources: includeProtectedContent ? resources.map(r => ({ id: r.id, title: r.title, type: r.type, url: r.url })) : [],
      }
    }))
    return { id: mod.id, title: mod.title, lessons: lessonsWithResources }
  }))

  const { rows: liveClasses } = await query<LiveClassRow>(
    'SELECT * FROM live_classes WHERE course_id = $1 ORDER BY date', [course.id]
  )

  // ── Prerequisite quiz (course-level gating) ────────────────────────────────
  // A course may declare a single course-level quiz (module_id/lesson_id NULL)
  // that an enrolled student must PASS before the course content unlocks.
  let prerequisiteQuiz: { id: string; title: string; description: string; passingScore: number } | null = null
  let isPrerequisiteQuizPassed = false
  if (course.prerequisite_quiz_id && userId) {
    const { rows: pqRows } = await query<{ id: string; title: string; description: string; passing_score: number }>(
      'SELECT id, title, description, passing_score FROM quizzes WHERE id = $1',
      [course.prerequisite_quiz_id]
    )
    if (pqRows[0]) {
      prerequisiteQuiz = {
        id: pqRows[0].id,
        title: pqRows[0].title,
        description: pqRows[0].description,
        passingScore: Number(pqRows[0].passing_score),
      }
      // A passing attempt (passed = TRUE) counts as unlocked.
      const { rows: passRows } = await query<{ passed: boolean }>(
        'SELECT passed FROM quiz_attempts WHERE quiz_id = $1 AND user_id = $2 AND passed = TRUE LIMIT 1',
        [course.prerequisite_quiz_id, userId]
      )
      isPrerequisiteQuizPassed = passRows.length > 0
    }
  }

  return {
    id: course.id, title: course.title, description: course.description, content: course.content,
    subject: course.subject, level: course.level, lessonCount: course.lesson_count,
    accessLevel: course.access_level, priceCents: course.price_cents, currency: course.currency, premiumEnabled: course.premium_enabled,
    outcomes: course.outcomes, createdAt: course.created_at.toISOString(), updatedAt: course.updated_at.toISOString(),
    instructor: { id: instructor.id, name: instructor.name, bio: instructor.bio, avatarUrl: instructor.avatar_url ?? undefined, credentials: [] as string[] },
    modules: modulesWithLessons,
    liveClasses: liveClasses.map(lc => ({
      id: lc.id, title: lc.title, date: lc.date.toISOString(),
      duration: lc.duration, meetUrl: includeProtectedContent ? lc.meet_url : '', status: lc.status,
    })),
    prerequisiteQuiz: prerequisiteQuiz ? { ...prerequisiteQuiz, isPrerequisiteQuizPassed } : undefined,
  }
}

export async function listCourses(req: Request, res: Response) {
  try {
    const subject = typeof req.query.subject === "string" ? req.query.subject.trim() : ""
    const q = typeof req.query.q === "string" ? req.query.q.trim() : ""
    const accessLevel = typeof req.query.accessLevel === "string" ? req.query.accessLevel.trim() : ""
    const level = typeof req.query.level === "string" ? req.query.level.trim() : ""
    const instructorId = typeof req.query.instructorId === "string" ? req.query.instructorId.trim() : ""
    const sort = typeof req.query.sort === "string" ? req.query.sort : "newest"

    // Pagination — safe bounds: default limit 12, maximum 50, offset never negative.
    const limitRaw = req.query.limit !== undefined ? parseInt(String(req.query.limit), 10) : 12
    const offsetRaw = req.query.offset !== undefined ? parseInt(String(req.query.offset), 10) : 0
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 12
    const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0

    // Public catalogue: published courses only.
    const where: string[] = ["c.status = 'published'"]
    const params: unknown[] = []
    if (subject) {
      params.push(subject)
      where.push(`subject = $${params.length}`)
    }
    if (accessLevel) {
      params.push(accessLevel)
      where.push(`access_level = $${params.length}`)
    }
    if (level) {
      params.push(level)
      where.push(`level = $${params.length}`)
    }
    if (instructorId) {
      params.push(instructorId)
      where.push(`instructor_id::text = $${params.length}`)
    }
    if (q) {
      params.push(`%${q}%`)
      where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`)
    }
    const whereSql = where.join(" AND ")

    // Whitelisted sort options — never interpolate raw user input.
    const orderBy =
      sort === "title"
        ? "c.title ASC"
        : sort === "level"
          ? "CASE c.level WHEN 'beginner' THEN 0 WHEN 'intermediate' THEN 1 ELSE 2 END ASC, c.created_at DESC"
          : "c.created_at DESC"

    const countResult = await query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM courses c WHERE ${whereSql}`,
      params
    )
    const total = parseInt(countResult.rows[0]?.total ?? "0", 10)

    const listParams = [...params, limit, offset]
    const limitIdx = listParams.length - 1
    const offsetIdx = listParams.length

    // Slim catalogue payload — course-card fields only, with privacy-safe
    // public trainer information (id, name, bio, avatar_url). No modules,
    // lessons or resources: those belong to the single-course detail endpoint.
    const { rows } = await query<{
      id: string
      title: string
      description: string
      subject: string
      level: string
      lesson_count: number
      outcomes: string[] | null
      thumbnail_url: string | null
      access_level: string
      price_cents: number | null
      currency: string | null
      premium_enabled: boolean
      created_at: string
      updated_at: string
      instructor_id: string
      instructor_name: string
      instructor_bio: string | null
      instructor_avatar: string | null
    }>(
      `SELECT c.id, c.title, c.description, c.subject, c.level, c.lesson_count, c.outcomes,
              c.thumbnail_url, c.access_level, c.price_cents, c.currency, c.premium_enabled, c.created_at, c.updated_at,
              u.id AS instructor_id, u.name AS instructor_name, u.bio AS instructor_bio,
              u.avatar_url AS instructor_avatar
         FROM courses c
         JOIN users u ON u.id = c.instructor_id
        WHERE ${whereSql}
        ORDER BY ${orderBy}
        LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      listParams
    )

    const courses = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      subject: row.subject,
      level: row.level,
      lessonCount: row.lesson_count,
      outcomes: row.outcomes ?? [],
      thumbnailUrl: row.thumbnail_url,
      accessLevel: row.access_level,
      priceCents: row.price_cents,
      currency: row.currency,
      premiumEnabled: row.premium_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      instructor: {
        id: row.instructor_id,
        name: row.instructor_name,
        bio: row.instructor_bio ?? "",
        avatarUrl: row.instructor_avatar,
      },
    }))

    return res.json({
      success: true,
      data: courses,
      pagination: {
        total,
        limit,
        offset,
        count: courses.length,
        hasMore: offset + courses.length < total,
      },
    })
  } catch (err) {
    console.error("listCourses error:", err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function listAvailableTeachers(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{
      id: string; name: string; bio: string; avatarUrl: string | null; subjects: string[]; courses: { id: string; title: string; subject: string; level: string }[]
    }>(
      `SELECT u.id, u.name, u.bio, u.avatar_url AS "avatarUrl",
              ARRAY_AGG(DISTINCT c.subject ORDER BY c.subject) AS subjects,
              COALESCE(
                json_agg(json_build_object('id', c.id, 'title', c.title, 'subject', c.subject, 'level', c.level) ORDER BY c.title)
                  FILTER (WHERE c.status = 'published'), '[]'
              ) AS courses
       FROM users u
       INNER JOIN courses c ON c.instructor_id = u.id
       WHERE u.status = 'active'
       GROUP BY u.id, u.name, u.bio, u.avatar_url
       ORDER BY u.name`
    )
    return ok(res, rows)
  } catch (err) { next(err) }
}

export async function getTrainerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    // Public profiles only: active trainers. Draft/suspended/deactivated trainers are not discoverable.
    const { rows: trainerRows } = await query<{ id: string; name: string; bio: string | null; avatar_url: string | null }>(
      `SELECT id, name, bio, avatar_url FROM users WHERE id = $1 AND role = 'trainer' AND status = 'active'`,
      [req.params.id]
    )
    if (!trainerRows[0]) return notFound(res, 'Registered trainer not found')
    const trainer = trainerRows[0]
    // Only published courses appear on the public profile. The payload mirrors
    // the slim catalogue shape so the frontend can render shared CourseCards.
    const { rows: courseRows } = await query<{
      id: string
      title: string
      description: string
      subject: string
      level: string
      lesson_count: number
      outcomes: string[] | null
      thumbnail_url: string | null
      access_level: string
      price_cents: number | null
      currency: string | null
      premium_enabled: boolean
      created_at: string
    }>(
      `SELECT c.id, c.title, c.description, c.subject, c.level, c.lesson_count, c.outcomes,
              c.thumbnail_url, c.access_level, c.price_cents, c.currency, c.premium_enabled, c.created_at
       FROM courses c
       WHERE c.instructor_id = $1 AND c.status = 'published'
       ORDER BY c.title`,
      [trainer.id]
    )
    const subjects = [...new Set(courseRows.map(c => c.subject))] as string[]
    return ok(res, {
      id: trainer.id,
      name: trainer.name,
      bio: trainer.bio ?? '',
      avatarUrl: trainer.avatar_url ?? undefined,
      subjects,
      courses: courseRows.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        subject: c.subject,
        level: c.level,
        lessonCount: c.lesson_count,
        outcomes: c.outcomes ?? [],
        thumbnailUrl: c.thumbnail_url,
        accessLevel: c.access_level,
        priceCents: c.price_cents,
        currency: c.currency,
        premiumEnabled: c.premium_enabled,
        createdAt: c.created_at,
        instructor: {
          id: trainer.id,
          name: trainer.name,
          bio: trainer.bio ?? '',
          avatarUrl: trainer.avatar_url ?? undefined,
        },
      })),
    })
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
    // Public detail endpoint: ONLY published courses are accessible.
    // (Draft/archived management happens through authenticated trainer/admin routes.)
    const { rows } = await query<CourseRow>(
            `SELECT * FROM courses WHERE id = $1 AND status = 'published'`,
      [req.params.id]
    )
    if (!rows[0]) return notFound(res, 'Course not found')
    return ok(res, await buildFullCourse(rows[0]))
  } catch (err) { next(err) }
}

// ─── Prerequisite quiz toggle (trainer who owns the course, or admin) ────────

/** GET /courses/:id/prerequisite-quiz → { courseId, prerequisiteQuizId } */
export async function getPrerequisiteQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ id: string; prerequisite_quiz_id: string | null }>(
      'SELECT id, prerequisite_quiz_id FROM courses WHERE id = $1',
      [req.params.id]
    )
    if (!rows[0]) return notFound(res, 'Course not found')
    return ok(res, { courseId: rows[0].id, prerequisiteQuizId: rows[0].prerequisite_quiz_id })
  } catch (err) { next(err) }
}

/**
 * PUT /courses/:id/prerequisite-quiz  body: { quizId: string | null }
 * Attach a course-level prerequisite quiz to a course, or detach it with null.
 * Only the owning trainer or an admin may change this.
 */
export async function setPrerequisiteQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const { quizId } = req.body as { quizId?: string | null }
    if (quizId !== null && quizId !== undefined && typeof quizId !== 'string') {
      return fail(res, 'quizId must be a quiz id or null', 400)
    }

    const { rows: courseRows } = await query<CourseRow>('SELECT * FROM courses WHERE id = $1', [req.params.id])
    if (!courseRows[0]) return notFound(res, 'Course not found')
    const course = courseRows[0]

    // Ownership: admins may manage any course; trainers only their own.
    if (req.user!.role !== 'admin' && course.instructor_id !== req.user!.userId) {
      return forbidden(res, 'You can only manage prerequisite quizzes for your own courses')
    }

    if (quizId) {
      // The quiz must exist AND belong to this course.
      const { rows: quizRows } = await query<{ id: string; course_id: string }>(
        'SELECT id, course_id FROM quizzes WHERE id = $1',
        [quizId]
      )
      if (!quizRows[0]) return notFound(res, 'Quiz not found')
      if (quizRows[0].course_id !== course.id) {
        return fail(res, 'The quiz must belong to the same course', 400)
      }
    }

    const { rows: updated } = await query<{ id: string; prerequisite_quiz_id: string | null }>(
      'UPDATE courses SET prerequisite_quiz_id = $1 WHERE id = $2 RETURNING id, prerequisite_quiz_id',
      [quizId ?? null, course.id]
    )
    return ok(res, {
      courseId: updated[0].id,
      prerequisiteQuizId: updated[0].prerequisite_quiz_id,
      message: updated[0].prerequisite_quiz_id
        ? 'Prerequisite quiz set — students must pass it to unlock this course.'
        : 'Prerequisite quiz removed — the course is now open to enrolled students.',
    })
  } catch (err) { next(err) }
}
