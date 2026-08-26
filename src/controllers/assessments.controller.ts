import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, forbidden, notFound, ok } from '../utils/response'

type SubmissionWithAssignment = {
  id: string; assignment_id: string; user_id: string; status: string; submitted_at: Date | null; content: string | null
  score: number | null; feedback: string | null; graded_at: Date | null; returned_for_correction: boolean
  answers: unknown; file_name: string | null; file_data: string | null
  title: string; course_id: string; course_title: string; due_date: Date; total_marks: number; passing_score: number
  student_name?: string; student_email?: string
}

export async function submitAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const { answers = [], content = '', fileName = null, fileData = null } = req.body as {
      answers?: Array<{ questionId: string; selectedIndex?: number; answer?: string; fileName?: string; fileData?: string }>
      content?: string; fileName?: string | null; fileData?: string | null
    }
    const { rows: assignments } = await query<{ id: string; due_date: Date }>(
      `SELECT a.id, a.due_date FROM assignments a JOIN enrollments e ON e.course_id = a.course_id
       WHERE a.id = $1 AND e.user_id = $2`, [req.params.assignmentId, req.user!.userId]
    )
    if (!assignments[0]) return notFound(res, 'Assignment not found or unavailable')
    const status = assignments[0].due_date < new Date() ? 'overdue' : 'submitted'
    const { rows } = await query<{ id: string; status: string; submitted_at: Date }>(
      `INSERT INTO submissions (assignment_id, user_id, status, content, answers, file_name, file_data, submitted_at, returned_for_correction)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), FALSE)
       ON CONFLICT (assignment_id, user_id) DO UPDATE SET status = EXCLUDED.status, content = EXCLUDED.content,
         answers = EXCLUDED.answers, file_name = EXCLUDED.file_name, file_data = EXCLUDED.file_data,
         submitted_at = NOW(), returned_for_correction = FALSE, score = NULL, feedback = NULL, graded_at = NULL
       RETURNING id, status, submitted_at`,
      [req.params.assignmentId, req.user!.userId, status, content, JSON.stringify(answers), fileName, fileData]
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
      answers: row.answers ?? [], fileName: row.file_name, fileData: row.file_data,
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
    const gradeBooks = await Promise.all(rows.map(async course => ({
      courseId: course.course_id,
      courseTitle: course.title,
      ...(await buildGradeBook(course.course_id, req.user!.userId))[0],
      // Itemised results — EVERY written quiz and assignment score for this
      // student in this course, so the grade screen never hides a result.
      ...(await buildStudentCourseGrades(course.course_id, req.user!.userId)),
    })))
    return ok(res, gradeBooks)
  } catch (error) { next(error) }
}

/**
 * Every quiz and assignment score a student has in a course.
 *  - quizzes: one entry per course quiz; `score` is the BEST completed attempt
 *    (null when the student hasn't taken it yet).
 *  - assignments: one entry per course assignment; `score` is null until graded.
 */
async function buildStudentCourseGrades(courseId: string, userId: string) {
  const { rows: quizRows } = await query<{
    quiz_id: string; title: string; passing_score: string
    best_score: string | null; best_passed: boolean | null; attempt_count: string
  }>(
    `SELECT q.id AS quiz_id, q.title, q.passing_score,
       MAX(qa.score) AS best_score,
       BOOL_OR(qa.passed) AS best_passed,
       COUNT(qa.id) FILTER (WHERE qa.completed_at IS NOT NULL) AS attempt_count
     FROM quizzes q
     LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = $2 AND qa.completed_at IS NOT NULL
     WHERE q.course_id = $1
     GROUP BY q.id, q.title, q.passing_score
     ORDER BY MIN(q.created_at)`,
    [courseId, userId]
  )

  const { rows: assignmentRows } = await query<{
    id: string; title: string; total_marks: number; due_date: Date
    status: string | null; score: number | null; feedback: string | null
  }>(
    `SELECT a.id, a.title, a.total_marks, a.due_date,
       s.status, s.score, s.feedback
     FROM assignments a
     LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = $2
     WHERE a.course_id = $1
     ORDER BY a.due_date`,
    [courseId, userId]
  )

  return {
    quizzes: quizRows.map(q => ({
      quizId: q.quiz_id,
      title: q.title,
      // Best attempt as a percentage of points earned; null if never attempted.
      score: q.best_score === null ? null : Math.round(Number(q.best_score)),
      passed: q.best_passed ?? false,
      attemptCount: Number(q.attempt_count),
      passingScore: Math.round(Number(q.passing_score)),
      written: Number(q.attempt_count) > 0,
    })),
    assignments: assignmentRows.map(a => ({
      assignmentId: a.id,
      title: a.title,
      status: a.status ?? 'pending',
      score: a.score === null ? null : Number(a.score),
      totalMarks: Number(a.total_marks),
      percentage: a.score === null || Number(a.total_marks) === 0
        ? null
        : Math.round((Number(a.score) / Number(a.total_marks)) * 100),
      feedback: a.feedback,
      submitted: a.status !== null,
      written: a.status === 'graded' || a.status === 'passed' || a.status === 'failed',
    })),
  }
}
