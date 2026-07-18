import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, forbidden, notFound, ok } from '../utils/response'

type SubmissionWithAssignment = {
  id: string; assignment_id: string; user_id: string; status: string; submitted_at: Date | null; content: string | null
  score: number | null; feedback: string | null; graded_at: Date | null; returned_for_correction: boolean
  title: string; course_id: string; course_title: string; due_date: Date; total_marks: number; passing_score: number
  student_name?: string; student_email?: string
}

export async function submitAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content = '' } = req.body as { content?: string }
    const { rows: assignments } = await query<{ id: string; due_date: Date }>(
      `SELECT a.id, a.due_date FROM assignments a JOIN enrollments e ON e.course_id = a.course_id
       WHERE a.id = $1 AND e.user_id = $2`, [req.params.assignmentId, req.user!.userId]
    )
    if (!assignments[0]) return notFound(res, 'Assignment not found or unavailable')
    const status = assignments[0].due_date < new Date() ? 'overdue' : 'submitted'
    const { rows } = await query<{ id: string; status: string; submitted_at: Date }>(
      `INSERT INTO submissions (assignment_id, user_id, status, content, submitted_at, returned_for_correction)
       VALUES ($1, $2, $3, $4, NOW(), FALSE)
       ON CONFLICT (assignment_id, user_id) DO UPDATE SET status = EXCLUDED.status, content = EXCLUDED.content,
         submitted_at = NOW(), returned_for_correction = FALSE, score = NULL, feedback = NULL, graded_at = NULL
       RETURNING id, status, submitted_at`, [req.params.assignmentId, req.user!.userId, status, content]
    )
    return ok(res, { id: rows[0].id, status: rows[0].status, submittedAt: rows[0].submitted_at.toISOString() })
  } catch (error) { next(error) }
}

export async function getAssignmentSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<SubmissionWithAssignment>(
      `SELECT s.*, a.title, a.course_id, a.due_date, a.total_marks, a.passing_score, c.title AS course_title,
        u.name AS student_name, u.email AS student_email
       FROM submissions s JOIN assignments a ON a.id = s.assignment_id JOIN courses c ON c.id = a.course_id JOIN users u ON u.id = s.user_id
       WHERE s.assignment_id = $1 AND c.instructor_id = $2 ORDER BY s.submitted_at DESC NULLS LAST`, [req.params.assignmentId, req.user!.userId]
    )
    return ok(res, rows.map(row => ({
      id: row.id, studentId: row.user_id, studentName: row.student_name, studentEmail: row.student_email,
      status: row.status, submittedAt: row.submitted_at?.toISOString(), content: row.content, score: row.score,
      feedback: row.feedback, gradedAt: row.graded_at?.toISOString(), returnedForCorrection: row.returned_for_correction,
      totalMarks: Number(row.total_marks), passingScore: Number(row.passing_score),
    })))
  } catch (error) { next(error) }
}

export async function gradeSubmission(req: Request, res: Response, next: NextFunction) {
  try {
    const { score, feedback = '', returnForCorrection = false, publish = true } = req.body as {
      score?: number; feedback?: string; returnForCorrection?: boolean; publish?: boolean
    }
    if (typeof score !== 'number' || score < 0) return fail(res, 'score must be a non-negative number', 400)
    const { rows: existing } = await query<{ id: string; total_marks: number; passing_score: number }>(
      `SELECT s.id, a.total_marks, a.passing_score FROM submissions s JOIN assignments a ON a.id = s.assignment_id
       JOIN courses c ON c.id = a.course_id WHERE s.id = $1 AND c.instructor_id = $2`, [req.params.submissionId, req.user!.userId]
    )
    if (!existing[0]) return notFound(res, 'Submission not found')
    if (score > Number(existing[0].total_marks)) return fail(res, 'score cannot exceed total marks', 400)
    const status = returnForCorrection ? 'submitted' : !publish ? 'under_review' : score >= Number(existing[0].passing_score) ? 'passed' : 'failed'
    const { rows } = await query<SubmissionWithAssignment>(
      `UPDATE submissions SET score = $1, feedback = $2, returned_for_correction = $3, status = $4,
       graded_at = CASE WHEN $5 THEN NOW() ELSE NULL END WHERE id = $6 RETURNING *`,
      [score, feedback, returnForCorrection, status, publish && !returnForCorrection, req.params.submissionId]
    )
    return ok(res, { id: rows[0].id, status: rows[0].status, score: Number(rows[0].score), feedback: rows[0].feedback, returnedForCorrection: rows[0].returned_for_correction })
  } catch (error) { next(error) }
}

async function buildGradeBook(courseId: string, studentId?: string) {
  const params: unknown[] = [courseId]
  const studentFilter = studentId ? `AND e.user_id = $2` : ''
  if (studentId) params.push(studentId)
  const { rows } = await query<{
    student_id: string; student_name: string; lesson_progress: number; assignment_percentage: number; attendance_percentage: number
  }>(
    `SELECT e.user_id AS student_id, u.name AS student_name, e.progress AS lesson_progress,
      COALESCE((SELECT AVG((s.score / NULLIF(a.total_marks, 0)) * 100) FROM submissions s JOIN assignments a ON a.id = s.assignment_id
        WHERE s.user_id = e.user_id AND a.course_id = c.id AND s.status IN ('graded','passed','failed')), 0) AS assignment_percentage,
      COALESCE((SELECT COUNT(DISTINCT lca.live_class_id)::numeric / NULLIF((SELECT COUNT(*) FROM live_classes WHERE course_id = c.id), 0) * 100
        FROM live_class_attendance lca JOIN live_classes lc ON lc.id = lca.live_class_id WHERE lca.user_id = e.user_id AND lc.course_id = c.id), 0) AS attendance_percentage
     FROM enrollments e JOIN users u ON u.id = e.user_id JOIN courses c ON c.id = e.course_id WHERE e.course_id = $1 ${studentFilter}`,
    params
  )
  const { rows: settingsRows } = await query<{ minimum_lesson_completion: number; minimum_assignment_percentage: number; minimum_attendance_percentage: number }>(
    `SELECT * FROM course_completion_settings WHERE course_id = $1`, [courseId]
  )
  const settings = settingsRows[0] ?? { minimum_lesson_completion: 100, minimum_assignment_percentage: 50, minimum_attendance_percentage: 0 }
  return rows.map(row => {
    const percentage = Math.round((Number(row.lesson_progress) * 0.4) + (Number(row.assignment_percentage) * 0.5) + (Number(row.attendance_percentage) * 0.1))
    const letterGrade = percentage >= 70 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 45 ? 'D' : 'F'
    const completed = Number(row.lesson_progress) >= settings.minimum_lesson_completion && Number(row.assignment_percentage) >= settings.minimum_assignment_percentage && Number(row.attendance_percentage) >= settings.minimum_attendance_percentage
    return { studentId: row.student_id, studentName: row.student_name, lessonCompletion: Number(row.lesson_progress), assignmentScore: Math.round(Number(row.assignment_percentage)), attendanceScore: Math.round(Number(row.attendance_percentage)), finalPercentage: percentage, letterGrade, completed, certificateEligible: completed }
  })
}

export async function getTrainerGradeBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ id: string }>('SELECT id FROM courses WHERE id = $1 AND instructor_id = $2', [req.params.courseId, req.user!.userId])
    if (!rows[0]) return forbidden(res, 'You can only view grade books for your courses')
    return ok(res, await buildGradeBook(String(req.params.courseId)))
  } catch (error) { next(error) }
}

export async function getStudentGradeBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<{ course_id: string; title: string }>(
      `SELECT c.id AS course_id, c.title FROM courses c JOIN enrollments e ON e.course_id = c.id WHERE e.user_id = $1`, [req.user!.userId]
    )
    const gradeBooks = await Promise.all(rows.map(async course => ({ courseId: course.course_id, courseTitle: course.title, ...(await buildGradeBook(course.course_id, req.user!.userId))[0] })))
    return ok(res, gradeBooks)
  } catch (error) { next(error) }
}
