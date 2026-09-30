import type { Request, Response } from 'express'
import { query } from '../db/pool'
import { forbidden, notFound } from './response'

/**
 * Object-level authorization helpers.
 *
 * Every helper resolves the *server-side* relationship chain
 *   resource → owning course → instructor_id  (or the resource's own author)
 * and compares it with the authenticated caller. Ids taken from the request
 * body are never treated as proof of ownership — they are only ever used as a
 * lookup key, and the decision comes from what the database says.
 *
 * The result is a three-way outcome so controllers can keep the existing API
 * semantics without leaking which resources exist:
 *   'missing'   → the resource (or its course) does not exist  → 404
 *   'forbidden' → it exists but the caller may not touch it    → 403
 *   'allowed'   → authorized
 *
 * Admin behaves exactly as it does elsewhere in the app (course-content,
 * courses.setPrerequisiteQuiz): an admin may manage any course.
 */
export type ObjectAccess = 'allowed' | 'forbidden' | 'missing'

/**
 * A malformed id must never reach Postgres as a UUID comparison: the driver
 * raises 22P02 and the error handler would surface a 500. Treating it as
 * 'missing' keeps a guessed id indistinguishable from a non-existent one.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

/** Same rule as `src/controllers/course-content.controller.ts`. */
export const isAdmin = (req: Request): boolean => req.user?.role === 'admin'

/** Admin wins outright; otherwise the caller must be the course instructor. */
function decideCourseAccess(req: Request, instructorId: string | null | undefined): ObjectAccess {
  if (!instructorId) return 'missing'
  if (isAdmin(req)) return 'allowed'
  return instructorId === req.user?.userId ? 'allowed' : 'forbidden'
}

/** Admin wins outright; otherwise the caller must be the author of the row. */
function decideAuthorAccess(req: Request, authorId: string | null | undefined): ObjectAccess {
  if (!authorId) return 'missing'
  if (isAdmin(req)) return 'allowed'
  return authorId === req.user?.userId ? 'allowed' : 'forbidden'
}

/** Does the caller manage this course (owner, or admin)? */
export async function accessToCourse(req: Request, courseId: unknown): Promise<ObjectAccess> {
  if (!isUuid(courseId)) return 'missing'
  const { rows } = await query<{ instructor_id: string }>(
    'SELECT instructor_id FROM courses WHERE id = $1',
    [courseId]
  )
  return decideCourseAccess(req, rows[0]?.instructor_id)
}

/** Follow assignments → courses and decide. */
export async function accessToCourseOwningAssignment(
  req: Request,
  assignmentId: unknown
): Promise<ObjectAccess> {
  if (!isUuid(assignmentId)) return 'missing'
  const { rows } = await query<{ instructor_id: string }>(
    `SELECT c.instructor_id
       FROM assignments a
       JOIN courses c ON c.id = a.course_id
      WHERE a.id = $1`,
    [assignmentId]
  )
  return decideCourseAccess(req, rows[0]?.instructor_id)
}

/** Follow grading_rubrics → assignments → courses and decide. */
export async function accessToCourseOwningRubric(
  req: Request,
  rubricId: unknown
): Promise<ObjectAccess> {
  if (!isUuid(rubricId)) return 'missing'
  const { rows } = await query<{ instructor_id: string }>(
    `SELECT c.instructor_id
       FROM grading_rubrics r
       JOIN assignments a ON a.id = r.assignment_id
       JOIN courses c ON c.id = a.course_id
      WHERE r.id = $1`,
    [rubricId]
  )
  return decideCourseAccess(req, rows[0]?.instructor_id)
}

/** Follow grade_categories → courses and decide. */
export async function accessToCourseOwningGradeCategory(
  req: Request,
  categoryId: unknown
): Promise<ObjectAccess> {
  if (!isUuid(categoryId)) return 'missing'
  const { rows } = await query<{ instructor_id: string }>(
    `SELECT c.instructor_id
       FROM grade_categories gc
       JOIN courses c ON c.id = gc.course_id
      WHERE gc.id = $1`,
    [categoryId]
  )
  return decideCourseAccess(req, rows[0]?.instructor_id)
}

/**
 * A forum category either belongs to a course (its instructor, or an admin,
 * manages it) or is a global category with no course (admin only).
 */
export async function accessToForumCategory(
  req: Request,
  categoryId: unknown
): Promise<ObjectAccess> {
  if (!isUuid(categoryId)) return 'missing'
  const { rows } = await query<{ course_id: string | null }>(
    'SELECT course_id FROM forum_categories WHERE id = $1',
    [categoryId]
  )
  if (!rows[0]) return 'missing'
  // Global category: there is no instructor to authorize, so only an admin.
  if (!rows[0].course_id) return isAdmin(req) ? 'allowed' : 'forbidden'
  return accessToCourse(req, rows[0].course_id)
}

/** The caller manages the course that owns this submission. */
export async function accessToCourseOwningSubmission(
  req: Request,
  submissionId: unknown
): Promise<ObjectAccess> {
  if (!isUuid(submissionId)) return 'missing'
  const { rows } = await query<{ instructor_id: string }>(
    `SELECT c.instructor_id
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       JOIN courses c ON c.id = a.course_id
      WHERE s.id = $1`,
    [submissionId]
  )
  return decideCourseAccess(req, rows[0]?.instructor_id)
}

/**
 * Who may read a submission's rubric feedback: the student who made the
 * submission, the instructor of its course, or an admin.
 */
export async function readAccessToSubmission(
  req: Request,
  submissionId: unknown
): Promise<ObjectAccess> {
  if (!isUuid(submissionId)) return 'missing'
  const { rows } = await query<{ user_id: string; instructor_id: string }>(
    `SELECT s.user_id, c.instructor_id
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       JOIN courses c ON c.id = a.course_id
      WHERE s.id = $1`,
    [submissionId]
  )
  if (!rows[0]) return 'missing'
  if (isAdmin(req)) return 'allowed'
  if (rows[0].user_id === req.user?.userId) return 'allowed'
  return rows[0].instructor_id === req.user?.userId ? 'allowed' : 'forbidden'
}

/** Thread author, or an admin (moderation). */
export async function accessToForumThread(
  req: Request,
  threadId: unknown
): Promise<ObjectAccess> {
  if (!isUuid(threadId)) return 'missing'
  const { rows } = await query<{ user_id: string }>(
    'SELECT user_id FROM forum_threads WHERE id = $1',
    [threadId]
  )
  return decideAuthorAccess(req, rows[0]?.user_id)
}

/** Post author, or an admin (moderation). `threadId` binds the id to its parent. */
export async function accessToForumPost(
  req: Request,
  postId: unknown,
  threadId: unknown
): Promise<ObjectAccess> {
  if (!isUuid(postId) || !isUuid(threadId)) return 'missing'
  const { rows } = await query<{ user_id: string }>(
    'SELECT user_id FROM forum_posts WHERE id = $1 AND thread_id = $2',
    [postId, threadId]
  )
  return decideAuthorAccess(req, rows[0]?.user_id)
}

/** Is this user enrolled in the course? */
export async function isEnrolledIn(userId: string, courseId: unknown): Promise<boolean> {
  if (!isUuid(courseId)) return false
  const { rows } = await query<{ id: string }>(
    'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
    [userId, courseId]
  )
  return Boolean(rows[0])
}

/**
 * Child resources must live in the course they are attached to — otherwise a
 * caller could point another course's module/lesson/assignment at their own
 * course. Mirrors the quiz check in `courses.controller.setPrerequisiteQuiz`.
 */
export async function moduleBelongsToCourse(
  moduleId: unknown,
  courseId: unknown
): Promise<boolean> {
  if (!isUuid(moduleId) || !isUuid(courseId)) return false
  const { rows } = await query<{ id: string }>(
    'SELECT id FROM modules WHERE id = $1 AND course_id = $2',
    [moduleId, courseId]
  )
  return Boolean(rows[0])
}

export async function lessonBelongsToCourse(
  lessonId: unknown,
  courseId: unknown
): Promise<boolean> {
  if (!isUuid(lessonId) || !isUuid(courseId)) return false
  const { rows } = await query<{ id: string }>(
    `SELECT l.id
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
      WHERE l.id = $1 AND m.course_id = $2`,
    [lessonId, courseId]
  )
  return Boolean(rows[0])
}

export async function assignmentBelongsToCourse(
  assignmentId: unknown,
  courseId: unknown
): Promise<boolean> {
  if (!isUuid(assignmentId) || !isUuid(courseId)) return false
  const { rows } = await query<{ id: string }>(
    'SELECT id FROM assignments WHERE id = $1 AND course_id = $2',
    [assignmentId, courseId]
  )
  return Boolean(rows[0])
}

/** Does a rubric belong to the assignment it is being scored against? */
export async function rubricBelongsToAssignment(
  rubricId: unknown,
  assignmentId: unknown
): Promise<boolean> {
  if (!isUuid(rubricId) || !isUuid(assignmentId)) return false
  const { rows } = await query<{ id: string }>(
    'SELECT id FROM grading_rubrics WHERE id = $1 AND assignment_id = $2',
    [rubricId, assignmentId]
  )
  return Boolean(rows[0])
}

/**
 * Translate an authorization verdict into the standard error response.
 * Returns true when the request was denied, so a controller can stop with
 *   if (denyAccess(res, access, 'Rubric not found', 'You can only manage …')) return
 * Keeps every patched endpoint answering 404/403 the same way.
 */
export function denyAccess(
  res: Response,
  access: ObjectAccess,
  missingMessage: string,
  forbiddenMessage: string
): boolean {
  if (access === 'missing') {
    notFound(res, missingMessage)
    return true
  }
  if (access === 'forbidden') {
    forbidden(res, forbiddenMessage)
    return true
  }
  return false
}
