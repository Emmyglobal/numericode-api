import { query } from '../db/pool'

/**
 * Recompute an enrollment's composite progress and update it only if the new
 * value is greater than the existing stored progress (ensures monotonic growth).
 *
 * Weighted components:
 *  - lesson completion percentage (computed from lesson_completions) - 50%
 *  - assignment average percentage (graded submissions) - 30%
 *  - quizzes passed percentage (quizzes in course, passed attempts) - 20%
 */
export async function recomputeAndUpdateEnrollmentProgress(userId: string, courseId: string): Promise<number> {
  // Lesson progress
  const { rows: lessonRows } = await query<{ total: string; completed: string }>(
    `SELECT 
      (SELECT COUNT(*) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = $1) as total,
      (SELECT COUNT(*) FROM lesson_completions lc JOIN lessons l ON l.id = lc.lesson_id JOIN modules m ON m.id = l.module_id WHERE m.course_id = $1 AND lc.user_id = $2) as completed`,
    [courseId, userId]
  )
  const totalLessons = Number(lessonRows[0]?.total ?? 0)
  const completedLessons = Number(lessonRows[0]?.completed ?? 0)
  const lessonProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Assignment percentage (average of graded submissions for this user & course)
  const { rows: assignmentRows } = await query<{ assignment_percentage: string }>(
    `SELECT COALESCE((SELECT AVG((s.score / NULLIF(a.total_marks, 0)) * 100) FROM submissions s JOIN assignments a ON a.id = s.assignment_id WHERE s.user_id = $1 AND a.course_id = $2 AND s.status IN ('graded','passed','failed')), 0) as assignment_percentage`,
    [userId, courseId]
  )
  const assignmentPercentage = Number(assignmentRows[0]?.assignment_percentage ?? 0)

  // Quiz pass percentage: percent of quizzes in the course that the user has a passed attempt for
  const { rows: quizRows } = await query<{ passed: string; total: string }>(
    `SELECT 
       COALESCE(SUM(CASE WHEN qa.passed = TRUE THEN 1 ELSE 0 END), 0)::text AS passed,
       COALESCE(COUNT(q.*), 0)::text AS total
     FROM quizzes q
     LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.user_id = $1
     WHERE q.course_id = $2`,
    [userId, courseId]
  )
  const passed = Number(quizRows[0]?.passed ?? 0)
  const quizTotal = Number(quizRows[0]?.total ?? 0)
  const quizPercentage = quizTotal > 0 ? (passed / quizTotal) * 100 : 0

  // Composite weighting
  const composite = Math.round((lessonProgress * 0.5) + (assignmentPercentage * 0.3) + (quizPercentage * 0.2))

  // Ensure monotonic: only increase stored progress
  const { rows: existingRows } = await query<{ progress: number }>(`SELECT progress FROM enrollments WHERE user_id = $1 AND course_id = $2`, [userId, courseId])
  if (!existingRows[0]) return composite
  const existing = Number(existingRows[0].progress ?? 0)
  const newProgress = Math.max(existing, composite)
  if (newProgress > existing) {
    await query(`UPDATE enrollments SET progress = $1 WHERE user_id = $2 AND course_id = $3`, [newProgress, userId, courseId])
  }
  return newProgress
}
