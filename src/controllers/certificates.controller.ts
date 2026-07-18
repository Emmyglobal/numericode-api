import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, notFound, ok } from '../utils/response'

interface CertificateRow {
  id: string
  user_id: string
  course_id: string
  course_title: string
  student_name: string
  final_percentage: number
  letter_grade: string
  issued_at: Date
  certificate_code: string
}

export async function generateCertificate(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = req.params.courseId
    const userId = req.user!.userId

    const { rows: enrollments } = await query<{ id: string; progress: number }>(
      `SELECT id, progress FROM enrollments WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    )
    if (!enrollments[0]) return notFound(res, 'You are not enrolled in this course')

    const { rows: settingsRows } = await query<{
      minimum_lesson_completion: number
      minimum_assignment_percentage: number
      minimum_attendance_percentage: number
    }>(`SELECT * FROM course_completion_settings WHERE course_id = $1`, [courseId])
    const settings = settingsRows[0] ?? { minimum_lesson_completion: 100, minimum_assignment_percentage: 50, minimum_attendance_percentage: 0 }

    const { rows: lessonRows } = await query<{ total: string; completed: string }>(
      `SELECT COUNT(*) AS total,
        (SELECT COUNT(*) FROM lesson_completions lc JOIN lessons l ON l.id = lc.lesson_id
         JOIN modules m ON m.id = l.module_id WHERE m.course_id = $1 AND lc.user_id = $2) AS completed
       FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = $1`,
      [courseId, userId]
    )
    const totalLessons = Number(lessonRows[0].total)
    const completedLessons = Number(lessonRows[0].completed)
    const lessonCompletionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    const { rows: assignmentRows } = await query<{ avg: string }>(
      `SELECT COALESCE(AVG((s.score / NULLIF(a.total_marks, 0)) * 100), 0) AS avg
       FROM submissions s JOIN assignments a ON a.id = s.assignment_id
       WHERE s.user_id = $1 AND a.course_id = $2 AND s.status IN ('graded','passed','failed')`,
      [userId, courseId]
    )
    const assignmentPct = Math.round(Number(assignmentRows[0].avg))

    const { rows: attendanceRows } = await query<{ pct: string }>(
      `SELECT COALESCE(
        (SELECT COUNT(DISTINCT lca.live_class_id)::numeric / NULLIF((SELECT COUNT(*) FROM live_classes WHERE course_id = $2), 0) * 100
         FROM live_class_attendance lca JOIN live_classes lc ON lc.id = lca.live_class_id
         WHERE lca.user_id = $1 AND lc.course_id = $2), 0) AS pct`,
      [userId, courseId]
    )
    const attendancePct = Math.round(Number(attendanceRows[0].pct))

    const finalPercentage = Math.round((lessonCompletionPct * 0.4) + (assignmentPct * 0.5) + (attendancePct * 0.1))
    const letterGrade = finalPercentage >= 70 ? 'A' : finalPercentage >= 60 ? 'B' : finalPercentage >= 50 ? 'C' : finalPercentage >= 45 ? 'D' : 'F'

    const completed = lessonCompletionPct >= settings.minimum_lesson_completion &&
      assignmentPct >= settings.minimum_assignment_percentage &&
      attendancePct >= settings.minimum_attendance_percentage

    if (!completed) {
      return fail(res, `Course not yet completed. Progress: ${lessonCompletionPct}% lessons, ${assignmentPct}% assignments, ${attendancePct}% attendance. Requirements: ${settings.minimum_lesson_completion}% lessons, ${settings.minimum_assignment_percentage}% assignments, ${settings.minimum_attendance_percentage}% attendance.`, 400)
    }

    const { rows: existing } = await query<CertificateRow>(
      `SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2`, [userId, courseId]
    )
    if (existing[0]) return ok(res, serializeCertificate(existing[0]))

    const code = `NUM-${String(courseId).slice(0, 8).toUpperCase()}-${String(userId).slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    const { rows: courseRows } = await query<{ title: string }>('SELECT title FROM courses WHERE id = $1', [courseId])
    const { rows: userRows } = await query<{ name: string }>('SELECT name FROM users WHERE id = $1', [userId])

    const { rows } = await query<CertificateRow>(
      `INSERT INTO certificates (user_id, course_id, course_title, student_name, final_percentage, letter_grade, certificate_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, courseId, courseRows[0].title, userRows[0].name, finalPercentage, letterGrade, code]
    )
    return ok(res, serializeCertificate(rows[0]), 201)
  } catch (error) { next(error) }
}

export async function getMyCertificates(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CertificateRow>(
      `SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC`,
      [req.user!.userId]
    )
    return ok(res, rows.map(serializeCertificate))
  } catch (error) { next(error) }
}

export async function getCertificateById(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<CertificateRow>(
      `SELECT * FROM certificates WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user!.userId]
    )
    if (!rows[0]) return notFound(res, 'Certificate not found')
    return ok(res, serializeCertificate(rows[0]))
  } catch (error) { next(error) }
}

export async function verifyCertificate(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.params
    const { rows } = await query<CertificateRow>(
      `SELECT * FROM certificates WHERE certificate_code = $1`, [code]
    )
    if (!rows[0]) return notFound(res, 'Invalid certificate code')
    return ok(res, {
      valid: true,
      studentName: rows[0].student_name,
      courseTitle: rows[0].course_title,
      finalPercentage: rows[0].final_percentage,
      letterGrade: rows[0].letter_grade,
      issuedAt: rows[0].issued_at.toISOString(),
      certificateCode: rows[0].certificate_code,
    })
  } catch (error) { next(error) }
}

function serializeCertificate(c: CertificateRow) {
  return {
    id: c.id,
    courseId: c.course_id,
    courseTitle: c.course_title,
    studentName: c.student_name,
    finalPercentage: c.final_percentage,
    letterGrade: c.letter_grade,
    issuedAt: c.issued_at.toISOString(),
    certificateCode: c.certificate_code,
  }
}