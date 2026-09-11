import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { created, fail, forbidden, notFound } from '../utils/response'
import type { AssignmentRow, EnrollmentRow, SubmissionRow } from '../types'
export async function submitAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignmentId } = req.params
    const { content } = req.body as { content?: string }
    const userId = req.user!.userId

    if (!content || typeof content !== 'string' || !content.trim()) {
      return fail(res, 'Submission content is required', 400)
    }

    const { rows: [assignment] } = await query<AssignmentRow>(
      'SELECT * FROM assignments WHERE id = $1',
      [assignmentId]
    )
    if (!assignment) return notFound(res, 'Assignment not found')

    // Enrollment check
    const { rows: [enrollment] } = await query<EnrollmentRow>(
      `SELECT e.id, e.progress, c.id as course_id
       FROM enrollments e JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = $1 AND e.course_id = $2`,
      [userId, assignment.course_id]
    )
    if (!enrollment) return forbidden(res, 'You are not enrolled in this course')

    // Check for existing submission
    const { rows: [existing] } = await query<SubmissionRow>(
      'SELECT * FROM submissions WHERE assignment_id = $1 AND user_id = $2',
      [assignmentId, userId]
    )
    if (existing) return fail(res, 'You have already submitted this assignment', 409)

    // Insert submission
    const { rows: [submission] } = await query<SubmissionRow>(
      `INSERT INTO submissions (assignment_id, user_id, content, status, submitted_at)
       VALUES ($1, $2, $3, 'submitted', NOW()) RETURNING *`,
      [assignmentId, userId, content.trim()]
    )

    // Recompute enrollment progress (assignments contribute 30% of composite progress)
    try {
      const { recomputeAndUpdateEnrollmentProgress } = await import('../utils/progress')
      await recomputeAndUpdateEnrollmentProgress(userId, assignment.course_id)
    } catch (e) {
      console.error('Progress recompute failed after assignment submission:', e)
    }

    return created(res, {
      id: submission.id,
      assignmentId: submission.assignment_id,
      status: submission.status,
      submittedAt: (submission.submitted_at ?? new Date()).toISOString(),
      message: 'Assignment submitted successfully',
    })
  } catch (err) { next(err) }
}