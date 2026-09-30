import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'
import {
  accessToCourse,
  accessToCourseOwningAssignment,
  accessToCourseOwningGradeCategory,
  accessToCourseOwningRubric,
  accessToCourseOwningSubmission,
  denyAccess,
  isEnrolledIn,
  readAccessToSubmission,
  rubricBelongsToAssignment,
} from '../utils/objectAccess'

interface RubricRow {
  id: string; assignment_id: string; criteria_name: string; description: string | null
  max_score: number; position: number; created_at: Date
}

interface RubricScoreRow {
  id: string; rubric_id: string; submission_id: string; score: number; feedback: string | null; created_at: Date
}

interface GradeCategoryRow {
  id: string; course_id: string; name: string; weight: number; created_at: Date
}

interface StudentGradeRow {
  id: string; name: string; email: string
  assignments_graded: string; average_score: number | null
}

// ─── Grading Rubrics ─────────────────────────────────────────────────────────

export async function listGradingRubrics(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignmentId } = req.params
    // Any trainer may otherwise read the rubric of any assignment in the
    // platform — the assignment's course owner (or an admin) decides.
    const access = await accessToCourseOwningAssignment(req, assignmentId)
    if (denyAccess(res, access, 'Assignment not found', 'You can only manage rubrics for assignments in your own courses')) return
    const { rows } = await query<RubricRow>(
      'SELECT * FROM grading_rubrics WHERE assignment_id = $1 ORDER BY position',
      [assignmentId]
    )
    return ok(res, rows.map(r => ({
      id: r.id, assignmentId: r.assignment_id, criteriaName: r.criteria_name,
      description: r.description, maxScore: Number(r.max_score), position: r.position,
      createdAt: r.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function createGradingRubric(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignmentId: bodyAssignmentId, criteriaName, description, maxScore, position } = req.body as {
      assignmentId?: string; criteriaName: string; description?: string; maxScore: number; position?: number
    }
    
    // The assignment named in the path is authoritative: a body-supplied id can
    // never redirect the insert into another trainer's assignment.
    const assignmentId = req.params.assignmentId
    if (bodyAssignmentId && bodyAssignmentId !== assignmentId) {
      return fail(res, 'Assignment ID does not match the requested assignment', 400)
    }

    if (!criteriaName || !maxScore) {
      return fail(res, 'Criteria name and max score are required', 400)
    }

    // Ownership is resolved through assignments → courses → instructor_id.
    const access = await accessToCourseOwningAssignment(req, assignmentId)
    if (denyAccess(res, access, 'Assignment not found', 'You can only manage rubrics for assignments in your own courses')) return
    
    const { rows: [rubric] } = await query<RubricRow>(
      `INSERT INTO grading_rubrics (assignment_id, criteria_name, description, max_score, position)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [assignmentId, criteriaName, description || '', maxScore, position || 0]
    )
    
    return ok(res, {
      id: rubric.id, assignmentId: rubric.assignment_id, criteriaName: rubric.criteria_name,
      description: rubric.description, maxScore: Number(rubric.max_score), position: rubric.position,
      createdAt: rubric.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateGradingRubric(req: Request, res: Response, next: NextFunction) {
  try {
    // The rubric's owning course decides — grading_rubrics → assignments →
    // courses.instructor_id. Without this any trainer could rewrite any rubric.
    const access = await accessToCourseOwningRubric(req, req.params.rubricId)
    if (denyAccess(res, access, 'Rubric not found', 'You can only manage rubrics for assignments in your own courses')) return

    const { criteriaName, description, maxScore, position } = req.body as {
      criteriaName?: string; description?: string; maxScore?: number; position?: number
    }
    
    const { rows: [rubric] } = await query<RubricRow>(
      `UPDATE grading_rubrics SET
        criteria_name = COALESCE($1, criteria_name), description = COALESCE($2, description),
        max_score = COALESCE($3, max_score), position = COALESCE($4, position)
       WHERE id = $5 RETURNING *`,
      [criteriaName, description, maxScore, position, req.params.rubricId]
    )
    
    if (!rubric) return notFound(res, 'Rubric not found')
    
    return ok(res, {
      id: rubric.id, assignmentId: rubric.assignment_id, criteriaName: rubric.criteria_name,
      description: rubric.description, maxScore: Number(rubric.max_score), position: rubric.position,
      createdAt: rubric.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteGradingRubric(req: Request, res: Response, next: NextFunction) {
  try {
    const access = await accessToCourseOwningRubric(req, req.params.rubricId)
    if (denyAccess(res, access, 'Rubric not found', 'You can only manage rubrics for assignments in your own courses')) return

    const { rows } = await query('DELETE FROM grading_rubrics WHERE id = $1 RETURNING id', [req.params.rubricId])
    if (!rows[0]) return notFound(res, 'Rubric not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── Rubric Scores ───────────────────────────────────────────────────────────

export async function submitRubricScores(req: Request, res: Response, next: NextFunction) {
  try {
    const { submissionId } = req.params
    const { scores } = req.body as { scores: Array<{ rubricId: string; score: number; feedback?: string }> }
    
    if (!scores || !Array.isArray(scores)) {
      return fail(res, 'Scores array is required', 400)
    }
    
    // Grading writes into another person's record, so the submission id alone
    // is not enough: resolve submissions → assignments → courses.instructor_id
    // and require the caller to instruct that course (or be an admin).
    const access = await accessToCourseOwningSubmission(req, submissionId)
    if (denyAccess(res, access, 'Submission not found', 'You can only grade submissions in your own courses')) return

    // Verify submission exists (and learn which assignment it answers)
    const { rows: [submission] } = await query<{ assignment_id: string }>(
      'SELECT assignment_id FROM submissions WHERE id = $1',
      [submissionId]
    )
    if (!submission) return notFound(res, 'Submission not found')

    // Every rubric being scored must belong to that assignment, otherwise a
    // trainer could attach their own rubric to someone else's submission.
    for (const scoreData of scores) {
      if (!(await rubricBelongsToAssignment(scoreData.rubricId, submission.assignment_id))) {
        return fail(res, 'Every rubric must belong to the assignment of this submission', 400)
      }
    }
    
    // NOTE: `await req.app.locals.dbClient || getClient()` parses as
    // (await dbClient) || getClient() — the right-hand side is a *Promise*, so
    // `client.query`/`client.release` would not exist and the endpoint would
    // always answer 500. Await the client itself.
    const injected = await req.app.locals.dbClient
    const client = injected ?? await (await import('../db/pool')).getClient()
    
    try {
      await client.query('BEGIN')
      
      // Calculate total score
      let totalScore = 0
      for (const scoreData of scores) {
        totalScore += Number(scoreData.score)
        
        // Upsert rubric score
        await client.query(
          `INSERT INTO rubric_scores (rubric_id, submission_id, score, feedback)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (rubric_id, submission_id) 
           DO UPDATE SET score = EXCLUDED.score, feedback = EXCLUDED.feedback`,
          [scoreData.rubricId, submissionId, scoreData.score, scoreData.feedback || '']
        )
      }
      
      // Update submission with total score
      await client.query(
        'UPDATE submissions SET score = $1, status = $2, graded_at = NOW() WHERE id = $3',
        [totalScore, 'graded', submissionId]
      )
      
      await client.query('COMMIT')
      
      return ok(res, { totalScore: Number(totalScore), message: 'Rubric scores submitted successfully' })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      // Prevent a connection leak — without this every call holds a pooled
      // client forever, eventually exhausting the pool (EMAXCONNSESSION).
      client.release()
    }
  } catch (err) { next(err) }
}

export async function getRubricScores(req: Request, res: Response, next: NextFunction) {
  try {
    const { submissionId } = req.params
    // This route is open to every role (a student must be able to read their own
    // feedback), so the decision is made here: the submitting student, the
    // instructor of the course, or an admin — never an arbitrary user id.
    const readAccess = await readAccessToSubmission(req, submissionId)
    if (denyAccess(res, readAccess, 'Submission not found', "You can only view rubric feedback for your own submissions")) return

    const { rows } = await query<RubricScoreRow & { criteria_name: string; max_score: number }>(
      `SELECT rs.*, r.criteria_name, r.max_score
       FROM rubric_scores rs
       JOIN grading_rubrics r ON r.id = rs.rubric_id
       WHERE rs.submission_id = $1
       ORDER BY r.position`,
      [submissionId]
    )
    
    return ok(res, rows.map(s => ({
      id: s.id, rubricId: s.rubric_id, submissionId: s.submission_id,
      criteriaName: s.criteria_name, score: Number(s.score), maxScore: Number(s.max_score),
      feedback: s.feedback, createdAt: s.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

// ─── Grade Categories ────────────────────────────────────────────────────────

export async function listGradeCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params
    // Trainer-only is not enough: only the owner of this course may read its
    // grading configuration.
    const access = await accessToCourse(req, courseId)
    if (denyAccess(res, access, 'Course not found', 'You can only manage grade categories in your own courses')) return

    const { rows } = await query<GradeCategoryRow>(
      'SELECT * FROM grade_categories WHERE course_id = $1 ORDER BY name',
      [courseId]
    )
    return ok(res, rows.map(c => ({
      id: c.id, courseId: c.course_id, name: c.name, weight: Number(c.weight),
      createdAt: c.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function createGradeCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId: bodyCourseId, name, weight } = req.body as {
      courseId?: string; name?: string; weight?: number
    }
    
    // The course in the path is authoritative (and is the one the trainer must
    // own); a body-supplied course id can never create categories on someone
    // else's course.
    const courseId = req.params.courseId
    if (bodyCourseId && bodyCourseId !== courseId) {
      return fail(res, 'Course ID does not match the requested course', 400)
    }
    if (!name || weight === undefined || weight === null) {
      return fail(res, 'Name and weight are required', 400)
    }

    const categoryAccess = await accessToCourse(req, courseId)
    if (denyAccess(res, categoryAccess, 'Course not found', 'You can only manage grade categories in your own courses')) return
    
    const { rows: [category] } = await query<GradeCategoryRow>(
      `INSERT INTO grade_categories (course_id, name, weight)
       VALUES ($1, $2, $3) RETURNING *`,
      [courseId, name, weight]
    )
    
    return ok(res, {
      id: category.id, courseId: category.course_id, name: category.name,
      weight: Number(category.weight), createdAt: category.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateGradeCategory(req: Request, res: Response, next: NextFunction) {
  try {
    // grade_categories → courses.instructor_id decides; the id in the path is
    // only a lookup key.
    const access = await accessToCourseOwningGradeCategory(req, req.params.categoryId)
    if (denyAccess(res, access, 'Grade category not found', 'You can only manage grade categories in your own courses')) return

    const { name, weight } = req.body as { name?: string; weight?: number }
    
    const { rows: [category] } = await query<GradeCategoryRow>(
      `UPDATE grade_categories SET
        name = COALESCE($1, name), weight = COALESCE($2, weight)
       WHERE id = $3 RETURNING *`,
      [name, weight, req.params.categoryId]
    )
    
    if (!category) return notFound(res, 'Grade category not found')
    
    return ok(res, {
      id: category.id, courseId: category.course_id, name: category.name,
      weight: Number(category.weight), createdAt: category.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteGradeCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const access = await accessToCourseOwningGradeCategory(req, req.params.categoryId)
    if (denyAccess(res, access, 'Grade category not found', 'You can only manage grade categories in your own courses')) return

    const { rows } = await query('DELETE FROM grade_categories WHERE id = $1 RETURNING id', [req.params.categoryId])
    if (!rows[0]) return notFound(res, 'Grade category not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── Grade Calculation ───────────────────────────────────────────────────────

export async function getStudentGradeReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params
    const userId = req.user!.userId
    // The report is always computed for the caller (never for an id from the
    // request), but the course must exist and the caller must belong to it —
    // otherwise anyone could read another course's grading configuration.
    // The existence check runs for admins too: an unknown course is a 404
    // rather than a report built from empty data.
    const reportAccess = await accessToCourse(req, courseId)
    if (reportAccess === 'missing') return notFound(res, 'Course not found')
    if (reportAccess === 'forbidden' && !(await isEnrolledIn(userId, courseId))) {
      return forbidden(res, 'You can only view the grade report for courses you are enrolled in')
    }

    // Course-wide quiz + assignment averages — computed ONCE, outside the
    // categories loop, so a student's quiz performance always rolls into the
    // course academic performance even when no grade categories are configured.
    const { rows: [assignmentAvg] } = await query<{ avg_score: number | null }>(
      `SELECT AVG(s.score) as avg_score
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
       WHERE s.user_id = $1 AND a.course_id = $2 AND s.status = 'graded'`,
      [userId, courseId]
    )
    const assignmentAverage = assignmentAvg?.avg_score != null ? Number(assignmentAvg.avg_score) : null

    const { rows: [QuizAvg] } = await query<{ avg_score: number | null }>(
      `SELECT AVG(qa.score) as avg_score
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       WHERE qa.user_id = $1 AND q.course_id = $2 AND qa.completed_at IS NOT NULL AND qa.score IS NOT NULL`,
      [userId, courseId]
    )
    const quizAverage = QuizAvg?.avg_score != null ? Number(QuizAvg.avg_score) : null

    // Grade categories (if configured)
    const { rows: categories } = await query<GradeCategoryRow>(
      'SELECT * FROM grade_categories WHERE course_id = $1',
      [courseId]
    )

    const categoryGrades = await Promise.all(
      categories.map(async (category) => {
        // Assignment + quiz averages scoped to this course. (The schema doesn't
        // link categories to specific assignments, so each category reflects the
        // course-wide averages — as the original implementation did.)
        const assignmentScore = assignmentAverage
        const quizScore = quizAverage

        let combined = 0
        if (assignmentScore != null && quizScore != null) combined = (assignmentScore + quizScore) / 2
        else if (assignmentScore != null) combined = assignmentScore
        else if (quizScore != null) combined = quizScore

        return {
          categoryId: category.id,
          categoryName: category.name,
          weight: Number(category.weight),
          averageScore: combined,
        }
      })
    )

    // Overall grade: use weighted categories when the total weight is meaningful.
    const totalWeight = categoryGrades.reduce((sum, cat) => sum + cat.weight, 0)
    let overallGrade: number

    if (categoryGrades.length > 0 && totalWeight > 0) {
      // Normalize weights so configured categories always sum to 100%.
      const normalized = categoryGrades.reduce((sum, cat) => {
        return sum + (cat.averageScore * cat.weight / totalWeight)
      }, 0)
      overallGrade = normalized
    } else {
      // No (usable) grade categories — derive performance from actual quiz and
      // assignment averages so taking the quiz directly affects the course grade.
      const values: number[] = []
      if (quizAverage != null) values.push(quizAverage)
      if (assignmentAverage != null) values.push(assignmentAverage)
      overallGrade = values.length > 0
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0
    }

    return ok(res, {
      courseId,
      categories: categoryGrades,
      quizAverage: quizAverage != null ? Number(quizAverage.toFixed(2)) : null,
      assignmentAverage: assignmentAverage != null ? Number(assignmentAverage.toFixed(2)) : null,
      overallGrade: Number(overallGrade.toFixed(2)),
      letterGrade: getLetterGrade(Number(overallGrade.toFixed(2))),
    })
  } catch (err) { next(err) }
}

function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

// ─── Grade Export ────────────────────────────────────────────────────────────

export async function exportGradesCSV(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params
    const trainerId = req.user!.userId

    // Verify trainer owns the course
    const { rows: [course] } = await query(
      'SELECT id FROM courses WHERE id = $1 AND instructor_id = $2',
      [courseId, trainerId]
    )
    if (!course) return fail(res, 'Unauthorized', 403)

    // Get all students with their grades
    const { rows: students } = await query<StudentGradeRow>(
      `SELECT u.id, u.name, u.email,
        COUNT(DISTINCT s.assignment_id) as assignments_graded,
        AVG(s.score) as average_score
       FROM users u
       JOIN enrollments e ON e.user_id = u.id
       LEFT JOIN submissions s ON s.user_id = u.id AND s.status = 'graded'
       WHERE e.course_id = $1 AND u.role = 'student'
       GROUP BY u.id, u.name, u.email
       ORDER BY u.name`,
      [courseId]
    )

    // Generate CSV manually
    const csvRows = [
      'Student ID,Name,Email,Assignments Graded,Average Score',
      ...students.map(s => 
        `${s.id},"${s.name.replace(/"/g, '""')}","${s.email.replace(/"/g, '""')}",${Number(s.assignments_graded)},${s.average_score ? Number(s.average_score).toFixed(2) : 'N/A'}`
      )
    ]
    const csv = csvRows.join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=grades_${courseId}.csv`)
    res.send(csv)
  } catch (err) { next(err) }
}

export async function exportGradesPDF(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params
    const trainerId = req.user!.userId

    // Verify trainer owns the course
    const { rows: [course] } = await query(
      'SELECT id, title FROM courses WHERE id = $1 AND instructor_id = $2',
      [courseId, trainerId]
    )
    if (!course) return fail(res, 'Unauthorized', 403)

    // Get all students with their grades
    const { rows: students } = await query(
      `SELECT u.id, u.name, u.email,
        COUNT(DISTINCT s.assignment_id) as assignments_graded,
        AVG(s.score) as average_score
       FROM users u
       JOIN enrollments e ON e.user_id = u.id
       LEFT JOIN submissions s ON s.user_id = u.id AND s.status = 'graded'
       WHERE e.course_id = $1 AND u.role = 'student'
       GROUP BY u.id, u.name, u.email
       ORDER BY u.name`,
      [courseId]
    )

    // Generate simple HTML-based PDF (in production, use a proper PDF library)
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Grade Report - ${course.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Grade Report</h1>
        <p><strong>Course:</strong> ${course.title}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Assignments Graded</th>
              <th>Average Score</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${Number(s.assignments_graded)}</td>
                <td>${s.average_score ? Number(s.average_score).toFixed(2) : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Generated by NumeryCode LMS</p>
        </div>
      </body>
      </html>
    `

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Disposition', `attachment; filename=grades_${courseId}.html`)
    res.send(html)
  } catch (err) { next(err) }
}

// ─── Grade Visibility Controls ───────────────────────────────────────────────

export async function updateGradeVisibility(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params
    const { showGrades, showRankings } = req.body as { showGrades?: boolean; showRankings?: boolean }

    // Writes course_completion_settings for the course named in the path — only
    // its instructor (or an admin) may do that.
    const visibilityAccess = await accessToCourse(req, courseId)
    if (denyAccess(res, visibilityAccess, 'Course not found', 'You can only manage grade visibility for your own courses')) return

    // Create or update grade visibility settings
    await query(
      `INSERT INTO course_completion_settings (course_id, minimum_lesson_completion, minimum_assignment_percentage, minimum_attendance_percentage)
       VALUES ($1, 100, 50, 0)
       ON CONFLICT (course_id) DO NOTHING`,
      [courseId]
    )

    // In a real implementation, you'd have a separate table for grade visibility
    // For now, we'll store it in the course settings
    const { rows: [settings] } = await query(
      `UPDATE course_completion_settings 
       SET minimum_assignment_percentage = $2
       WHERE course_id = $1
       RETURNING *`,
      [courseId, showGrades !== undefined ? (showGrades ? 0 : 100) : 50]
    )

    return ok(res, {
      courseId: settings.course_id,
      showGrades: showGrades ?? true,
      showRankings: showRankings ?? true,
    })
  } catch (err) { next(err) }
}
