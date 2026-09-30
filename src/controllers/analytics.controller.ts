import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'
import {
  accessToCourse,
  isEnrolledIn,
  isUuid,
  lessonBelongsToCourse,
  moduleBelongsToCourse,
} from '../utils/objectAccess'

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

    // Activity may only be recorded on a course the caller actually belongs to
    // (enrolled learner, its instructor, or an admin). Without this a student
    // could write rows into — and inflate — another course's analytics.
    // The course is resolved first, so a bad id is a 404 for every caller —
    // including an admin, who would otherwise hit a foreign-key 500.
    const trackAccess = await accessToCourse(req, courseId)
    if (trackAccess === 'missing') return notFound(res, 'Course not found')
    if (trackAccess === 'forbidden' && !(await isEnrolledIn(userId, courseId))) {
      return forbidden(res, 'You can only track activity for courses you are enrolled in')
    }

    // A lesson id must belong to the same course, so activity cannot be
    // attributed to another course's content.
    if (lessonId && !(await lessonBelongsToCourse(lessonId, courseId))) {
      return fail(res, 'The lesson must belong to the same course', 400)
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

    // Get quiz performance metrics
    const { rows: [quizStats] } = await query<{
      total_quizzes: string; completed_quizzes: string; average_score: string | null
    }>(
      `SELECT 
        COUNT(DISTINCT q.id) as total_quizzes,
        COUNT(DISTINCT qa.id) FILTER (WHERE qa.completed_at IS NOT NULL) as completed_quizzes,
        AVG(qa.score) as average_score
       FROM quizzes q
       LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = $1 AND qa.completed_at IS NOT NULL
       WHERE q.course_id = $2`,
      [userId, courseId]
    )

    // Get forum activity metrics
    const { rows: [forumStats] } = await query<{ thread_count: string; post_count: string }>(
      `SELECT
        COUNT(DISTINCT ft.id) as thread_count,
        COUNT(DISTINCT fp.id) as post_count
       FROM forum_categories fc
       LEFT JOIN forum_threads ft ON ft.category_id = fc.id AND ft.user_id = $1
       LEFT JOIN forum_posts fp ON fp.thread_id = ft.id AND fp.user_id = $1
       WHERE fc.course_id = $2`,
      [userId, courseId]
    )

    // Get grade performance.
    // (This used to be a FULL JOIN over quizzes/attempts/submissions/assignments,
    // which Postgres rejects outright — "FULL JOIN is only supported with
    // merge-joinable or hash-joinable join conditions" — so the endpoint could
    // never answer anything but 500. Scalar subqueries give the same numbers.)
    const { rows: [gradeStats] } = await query<{
      submission_count: string; submission_avg: string | null
      quiz_count: string; quiz_avg: string | null
    }>(
      `SELECT
         (SELECT COUNT(*) FROM submissions s
            JOIN assignments a ON a.id = s.assignment_id
          WHERE s.user_id = $1 AND a.course_id = $2 AND s.status = 'graded') as submission_count,
         (SELECT AVG(s.score) FROM submissions s
            JOIN assignments a ON a.id = s.assignment_id
          WHERE s.user_id = $1 AND a.course_id = $2 AND s.status = 'graded') as submission_avg,
         (SELECT COUNT(*) FROM quiz_attempts qa
            JOIN quizzes q ON q.id = qa.quiz_id
          WHERE qa.user_id = $1 AND q.course_id = $2
            AND qa.completed_at IS NOT NULL AND qa.score IS NOT NULL) as quiz_count,
         (SELECT AVG(qa.score) FROM quiz_attempts qa
            JOIN quizzes q ON q.id = qa.quiz_id
          WHERE qa.user_id = $1 AND q.course_id = $2
            AND qa.completed_at IS NOT NULL AND qa.score IS NOT NULL) as quiz_avg`,
      [userId, courseId]
    )

    // Average of whatever is graded: both streams averaged together, or the
    // only one present; null when nothing has been graded yet.
    const submissionAverage = gradeStats?.submission_avg != null ? Number(gradeStats.submission_avg) : null
    const quizAverage = gradeStats?.quiz_avg != null ? Number(gradeStats.quiz_avg) : null
    const gradedStreams = [submissionAverage, quizAverage].filter((v): v is number => v != null)
    const overallGrade = gradedStreams.length > 0
      ? Number((gradedStreams.reduce((sum, v) => sum + v, 0) / gradedStreams.length).toFixed(2))
      : null

    return ok(res, {
      courseId,
      courseTitle: rows[0]?.course_title || '',
      totalTimeSpent,
      totalInteractions,
      quizMetrics: {
        totalQuizzes: Number(quizStats?.total_quizzes || 0),
        completedQuizzes: Number(quizStats?.completed_quizzes || 0),
        averageScore: quizStats?.average_score ? Number(quizStats.average_score) : null,
      },
      forumMetrics: {
        threadsCreated: Number(forumStats?.thread_count || 0),
        postsMade: Number(forumStats?.post_count || 0),
      },
      overallGrade,
      lessonAnalytics: rows.map(r => ({
        id: r.id,
        lessonId: r.lesson_id,
        lessonTitle: r.lesson_title,
        timeSpent: Number(r.time_spent),
        interactions: Number(r.interactions),
        lastAccessed: r.last_accessed ? r.last_accessed.toISOString() : null,
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
    const { courseId: bodyCourseId, moduleId, lessonId, releaseDate } = req.body as {
      courseId?: string; moduleId?: string; lessonId?: string; releaseDate: string
    }

    // The route param — already authorized by requireCourseInstructorOrAdmin —
    // is the authoritative course. A body-supplied course id can never widen
    // the target of the write.
    const courseId = req.params.courseId
    if (bodyCourseId && bodyCourseId !== courseId) {
      return fail(res, 'Course ID does not match the requested course', 400)
    }
    if (!releaseDate || Number.isNaN(Date.parse(releaseDate))) {
      return fail(res, 'A valid release date is required', 400)
    }

    // Scheduled content must belong to this course — never another trainer's.
    if (moduleId && !(await moduleBelongsToCourse(moduleId, courseId))) {
      return fail(res, 'The module must belong to this course', 400)
    }
    if (lessonId && !(await lessonBelongsToCourse(lessonId, courseId))) {
      return fail(res, 'The lesson must belong to this course', 400)
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
    const { courseId: bodyCourseId, prerequisiteId } = req.body as {
      courseId?: string; prerequisiteId: string
    }

    // Same rule as drip scheduling: the authorized route param decides which
    // course is being configured, never the request body.
    const courseId = req.params.courseId
    if (bodyCourseId && bodyCourseId !== courseId) {
      return fail(res, 'Course ID does not match the requested course', 400)
    }
    if (!prerequisiteId) {
      return fail(res, 'Prerequisite course ID is required', 400)
    }

    // The prerequisite must be a real, different course — verified server-side.
    if (!isUuid(prerequisiteId) || prerequisiteId === courseId) {
      return fail(res, 'The prerequisite must be a different course', 400)
    }
    const { rows: [prerequisiteCourse] } = await query<{ id: string }>(
      'SELECT id FROM courses WHERE id = $1',
      [prerequisiteId]
    )
    if (!prerequisiteCourse) return notFound(res, 'Prerequisite course not found')

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