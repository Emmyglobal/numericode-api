import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'

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
    const { assignmentId, criteriaName, description, maxScore, position } = req.body as {
      assignmentId: string; criteriaName: string; description?: string; maxScore: number; position?: number
    }
    
    if (!assignmentId || !criteriaName || !maxScore) {
      return fail(res, 'Assignment ID, criteria name, and max score are required', 400)
    }
    
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
    
    // Verify submission exists
    const { rows: [submission] } = await query(
      'SELECT * FROM submissions WHERE id = $1',
      [submissionId]
    )
    if (!submission) return notFound(res, 'Submission not found')
    
    const client = await req.app.locals.dbClient || (await import('../db/pool')).getClient()
    
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
    }
  } catch (err) { next(err) }
}

export async function getRubricScores(req: Request, res: Response, next: NextFunction) {
  try {
    const { submissionId } = req.params
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
    const { courseId, name, weight } = req.body as { courseId: string; name: string; weight: number }
    
    if (!courseId || !name || !weight) {
      return fail(res, 'Course ID, name, and weight are required', 400)
    }
    
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
    
    // Get grade categories
    const { rows: categories } = await query<GradeCategoryRow>(
      'SELECT * FROM grade_categories WHERE course_id = $1',
      [courseId]
    )
    
    // Calculate grades for each category
    const categoryGrades = await Promise.all(
      categories.map(async (category) => {
        // This is a simplified version - in production, you'd calculate based on actual submissions
        const { rows: [avgScore] } = await query<{ avg_score: number | null }>(
          `SELECT AVG(s.score) as avg_score
           FROM submissions s
           JOIN assignments a ON a.id = s.assignment_id
           WHERE s.user_id = $1 AND a.course_id = $2 AND s.status = 'graded'`,
          [userId, courseId]
        )
        
        return {
          categoryId: category.id,
          categoryName: category.name,
          weight: Number(category.weight),
          averageScore: avgScore?.avg_score ? Number(avgScore.avg_score) : 0,
        }
      })
    )
    
    // Calculate overall grade
    const overallGrade = categoryGrades.reduce((sum, cat) => {
      return sum + (cat.averageScore * cat.weight / 100)
    }, 0)
    
    return ok(res, {
      courseId,
      categories: categoryGrades,
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
          <p>Generated by NumeriCode LMS</p>
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
