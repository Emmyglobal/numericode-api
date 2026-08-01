import type { Request, Response, NextFunction } from 'express'
import { query, getClient } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'

const isAdmin = (req: Request) => req.user!.role === 'admin'

interface QuizRow { id: string; title: string; lesson_id: string; passing_score: number; created_by: string }
interface AssignmentRow { id: string; title: string; lesson_id: string; due_date: Date; total_marks: number; description?: string }
interface LessonRow { id: string; module_id: string; title: string; content: string; position: number }
interface ModuleRow { id: string; course_id: string; title: string; position: number }

export async function getCourseBuilderContent(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = req.params.courseId
    const { rows: courseRows } = await query('SELECT id, title FROM courses WHERE id = $1', [courseId])
    if (!courseRows[0]) return notFound(res, 'Course not found')

    const { rows: modules } = await query<ModuleRow>(
      'SELECT * FROM modules WHERE course_id = $1 ORDER BY position', [courseId]
    )

    const modulesWithContent = await Promise.all(modules.map(async (mod) => {
      const { rows: lessons } = await query<LessonRow>(
        'SELECT * FROM lessons WHERE module_id = $1 ORDER BY position', [mod.id]
      )

      const lessonsWithAssessments = await Promise.all(lessons.map(async (lesson) => {
        let quizzes: QuizRow[] = []
        try {
          const { rows: quizRows } = await query<QuizRow>(
            'SELECT id, title, lesson_id, passing_score, created_by FROM quizzes WHERE lesson_id = $1 ORDER BY title',
            [lesson.id]
          )
          quizzes = quizRows
        } catch {
          // lesson_id column may not exist yet — return empty quizzes
        }
        let assignments: AssignmentRow[] = []
        try {
          const { rows: assignmentRows } = await query<AssignmentRow>(
            'SELECT id, title, lesson_id, due_date, total_marks, description FROM assignments WHERE lesson_id = $1 ORDER BY title',
            [lesson.id]
          )
          assignments = assignmentRows
        } catch {
          // lesson_id column may not exist yet — return empty assignments
        }
        return {
          id: lesson.id,
          title: lesson.title,
          content: lesson.content || '',
          quizzes: quizzes.map(q => ({ id: q.id, title: q.title })),
          assignments: assignments.map(a => ({ id: a.id, title: a.title })),
        }
      }))

      return { id: mod.id, title: mod.title, lessons: lessonsWithAssessments }
    }))

    return ok(res, {
      id: courseRows[0].id,
      title: courseRows[0].title,
      modules: modulesWithContent,
    })
  } catch (err) { next(err) }
}

export async function createModule(req: Request, res: Response, next: NextFunction) {
  try {
    const { title } = req.body as { title?: string }
    const courseId = req.params.courseId
    if (!title?.trim()) return fail(res, 'Module title is required', 400)

    const { rows: courseRows } = await query('SELECT id, instructor_id FROM courses WHERE id = $1', [courseId])
    if (!courseRows[0]) return notFound(res, 'Course not found')
    if (!isAdmin(req) && courseRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only add modules to your own courses')

    const { rows } = await query(
      `INSERT INTO modules (course_id, title, position)
       VALUES ($1, $2, (SELECT COUNT(*) FROM modules WHERE course_id = $1)) RETURNING *`,
      [courseId, title.trim()]
    )
    return ok(res, { id: rows[0].id, title: rows[0].title, lessons: [] }, 201)
  } catch (err) { next(err) }
}

export async function updateModule(req: Request, res: Response, next: NextFunction) {
  try {
    const { title } = req.body as { title?: string }
    const moduleId = req.params.moduleId
    if (!title?.trim()) return fail(res, 'Module title is required', 400)

    const { rows: moduleRows } = await query(
      `SELECT m.*, c.instructor_id FROM modules m JOIN courses c ON c.id = m.course_id WHERE m.id = $1`,
      [moduleId]
    )
    if (!moduleRows[0]) return notFound(res, 'Module not found')
    if (!isAdmin(req) && moduleRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only update your own modules')

    const { rows } = await query(
      'UPDATE modules SET title = $1 WHERE id = $2 RETURNING id, title',
      [title.trim(), moduleId]
    )
    return ok(res, { id: rows[0].id, title: rows[0].title })
  } catch (err) { next(err) }
}

export async function deleteModule(req: Request, res: Response, next: NextFunction) {
  try {
    const moduleId = req.params.moduleId

    const { rows: moduleRows } = await query(
      `SELECT m.*, c.instructor_id FROM modules m JOIN courses c ON c.id = m.course_id WHERE m.id = $1`,
      [moduleId]
    )
    if (!moduleRows[0]) return notFound(res, 'Module not found')
    if (!isAdmin(req) && moduleRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only delete your own modules')

    await query('DELETE FROM modules WHERE id = $1', [moduleId])
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

export async function createLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const moduleId = req.params.moduleId
    const { title, content } = req.body as { title?: string; content?: string }
    if (!title?.trim()) return fail(res, 'Lesson title is required', 400)

    const { rows: moduleRows } = await query(
      `SELECT m.*, c.instructor_id FROM modules m JOIN courses c ON c.id = m.course_id WHERE m.id = $1`,
      [moduleId]
    )
    if (!moduleRows[0]) return notFound(res, 'Module not found')
    if (!isAdmin(req) && moduleRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only add lessons to your own modules')

    const { rows } = await query(
      `INSERT INTO lessons (module_id, title, content, position)
       VALUES ($1, $2, $3, (SELECT COUNT(*) FROM lessons WHERE module_id = $1)) RETURNING *`,
      [moduleId, title.trim(), content || '']
    )
    return ok(res, { id: rows[0].id, title: rows[0].title, content: rows[0].content }, 201)
  } catch (err) { next(err) }
}

export async function updateLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = req.params.lessonId
    const { title, content } = req.body as { title?: string; content?: string }

    const { rows: lessonRows } = await query(
      `SELECT l.*, m.course_id, c.instructor_id FROM lessons l
       JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = $1`,
      [lessonId]
    )
    if (!lessonRows[0]) return notFound(res, 'Lesson not found')
    if (!isAdmin(req) && lessonRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only update lessons in your own courses')

    const { rows } = await query(
      `UPDATE lessons SET
        title = COALESCE($1, title),
        content = COALESCE($2, content)
       WHERE id = $3 RETURNING *`,
      [title || null, content !== undefined ? content : null, lessonId]
    )
    return ok(res, { id: rows[0].id, title: rows[0].title, content: rows[0].content })
  } catch (err) { next(err) }
}

export async function deleteLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = req.params.lessonId

    const { rows: lessonRows } = await query(
      `SELECT l.*, m.course_id, c.instructor_id FROM lessons l
       JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = $1`,
      [lessonId]
    )
    if (!lessonRows[0]) return notFound(res, 'Lesson not found')
    if (!isAdmin(req) && lessonRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only delete lessons in your own courses')

    await query('DELETE FROM lessons WHERE id = $1', [lessonId])
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

export async function getLessons(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = req.params.lessonId
    const { rows: lessonRows } = await query(
      `SELECT l.*, m.course_id, c.instructor_id FROM lessons l
       JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = $1`,
      [lessonId]
    )
    if (!lessonRows[0]) return notFound(res, 'Lesson not found')
    if (!isAdmin(req) && lessonRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only access lessons in your own courses')
    return ok(res, { id: lessonRows[0].id, title: lessonRows[0].title, content: lessonRows[0].content || '' })
  } catch (err) { next(err) }
}

export async function createQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = req.params.lessonId
    const { title, description, passingScore, timeLimit, maxAttempts, shuffleQuestions, showResults, questions } = req.body as {
      title: string; description?: string; passingScore?: number; timeLimit?: number; maxAttempts?: number;
      shuffleQuestions?: boolean; showResults?: boolean;
      questions?: Array<{ questionText: string; questionType: string; options?: unknown; correctAnswer?: string; points: number; position: number }>
    }
    if (!title?.trim()) return fail(res, 'Quiz title is required', 400)

    const { rows: lessonRows } = await query(
      `SELECT l.*, m.course_id, c.instructor_id FROM lessons l
       JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = $1`,
      [lessonId]
    )
    if (!lessonRows[0]) return notFound(res, 'Lesson not found')
    if (!isAdmin(req) && lessonRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only add quizzes to your own lessons')

    const client = await getClient()
    try {
      await client.query('BEGIN')

      const { rows } = await client.query(
        `INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [lessonRows[0].course_id, lessonId, title.trim(), description || '', timeLimit || null, passingScore || 70, maxAttempts || 1, shuffleQuestions || false, showResults !== false, req.user!.userId]
      )

      // Insert questions if provided
      if (questions && questions.length > 0) {
        for (const q of questions) {
          await client.query(
            `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [rows[0].id, q.questionText, q.questionType, q.options ? JSON.stringify(q.options) : null, q.correctAnswer || null, q.points, q.position]
          )
        }
      }

      await client.query('COMMIT')
      return ok(res, { id: rows[0].id, title: rows[0].title, lessonId, questionCount: questions?.length || 0 }, 201)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (err) { next(err) }
}

export async function updateQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const quizId = req.params.quizId
    const { title, description, passingScore, timeLimit, maxAttempts, shuffleQuestions, showResults } = req.body as {
      title?: string; description?: string; passingScore?: number; timeLimit?: number; maxAttempts?: number;
      shuffleQuestions?: boolean; showResults?: boolean
    }

    const { rows: [quiz] } = await query(
      `UPDATE quizzes SET
        title = COALESCE($1, title), description = COALESCE($2, description),
        time_limit = COALESCE($3, time_limit), passing_score = COALESCE($4, passing_score),
        max_attempts = COALESCE($5, max_attempts), shuffle_questions = COALESCE($6, shuffle_questions),
        show_results = COALESCE($7, show_results), updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [title, description, timeLimit, passingScore, maxAttempts, shuffleQuestions, showResults, quizId]
    )

    if (!quiz) return notFound(res, 'Quiz not found')
    return ok(res, { id: quiz.id, title: quiz.title, lessonId: quiz.lesson_id })
  } catch (err) { next(err) }
}

export async function deleteQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const quizId = req.params.quizId

    // Check permissions
    const { rows: quizRows } = await query(
      `SELECT q.*, c.instructor_id FROM quizzes q
       JOIN courses c ON c.id = q.course_id WHERE q.id = $1`,
      [quizId]
    )
    if (!quizRows[0]) return notFound(res, 'Quiz not found')
    if (!isAdmin(req) && quizRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only delete your own quizzes')

    await query('DELETE FROM quizzes WHERE id = $1', [quizId])
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

export async function createAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = req.params.lessonId
    const { title, description, dueDate, totalMarks, passingScore } = req.body as {
      title: string; description?: string; dueDate?: string; totalMarks?: number; passingScore?: number
    }
    if (!title?.trim()) return fail(res, 'Assignment title is required', 400)

    const { rows: lessonRows } = await query(
      `SELECT l.*, m.course_id, c.instructor_id FROM lessons l
       JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = $1`,
      [lessonId]
    )
    if (!lessonRows[0]) return notFound(res, 'Lesson not found')
    if (!isAdmin(req) && lessonRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only add assignments to your own lessons')

    const { rows } = await query(
      `INSERT INTO assignments (course_id, lesson_id, title, description, due_date, total_marks, passing_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        lessonRows[0].course_id,
        lessonId,
        title.trim(),
        description || '',
        dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalMarks || 100,
        passingScore || 50
      ]
    )
    return ok(res, { id: rows[0].id, title: rows[0].title, lessonId, dueDate: rows[0].due_date, totalMarks: Number(rows[0].total_marks) }, 201)
  } catch (err) { next(err) }
}

export async function updateAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentId = req.params.assignmentId
    const { title, description, dueDate, totalMarks, passingScore } = req.body as {
      title?: string; description?: string; dueDate?: string; totalMarks?: number; passingScore?: number
    }

    const { rows: [assignment] } = await query(
      `UPDATE assignments SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        due_date = COALESCE($3, due_date),
        total_marks = COALESCE($4, total_marks),
        passing_score = COALESCE($5, passing_score)
       WHERE id = $6 RETURNING *`,
      [title, description, dueDate ? new Date(dueDate) : null, totalMarks, passingScore, assignmentId]
    )

    if (!assignment) return notFound(res, 'Assignment not found')
    return ok(res, { id: assignment.id, title: assignment.title, lessonId: assignment.lesson_id, dueDate: assignment.due_date, totalMarks: Number(assignment.total_marks) })
  } catch (err) { next(err) }
}

export async function getQuizDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const quizId = req.params.quizId
    const { rows: [quiz] } = await query(
      `SELECT q.*, c.instructor_id FROM quizzes q
       JOIN courses c ON c.id = q.course_id WHERE q.id = $1`,
      [quizId]
    )
    if (!quiz) return notFound(res, 'Quiz not found')
    if (!isAdmin(req) && quiz.instructor_id !== req.user!.userId) return forbidden(res, 'Access denied')

    const { rows: questions } = await query(
      'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quizId]
    )

    return ok(res, {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      lessonId: quiz.lesson_id,
      passingScore: Number(quiz.passing_score),
      timeLimit: quiz.time_limit,
      maxAttempts: quiz.max_attempts,
      shuffleQuestions: quiz.shuffle_questions,
      showResults: quiz.show_results,
      questions: questions.map((q: any) => ({
        id: q.id,
        questionText: q.question_text,
        questionType: q.question_type,
        options: q.options,
        correctAnswer: q.correct_answer,
        points: Number(q.points),
        position: q.position,
      })),
    })
  } catch (err) { next(err) }
}

export async function getAssignmentDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentId = req.params.assignmentId
    const { rows: [assignment] } = await query<any>(
      `SELECT a.*, c.instructor_id FROM assignments a
       JOIN courses c ON c.id = a.course_id WHERE a.id = $1`,
      [assignmentId]
    )
    if (!assignment) return notFound(res, 'Assignment not found')
    if (!isAdmin(req) && assignment.instructor_id !== req.user!.userId) return forbidden(res, 'Access denied')

    return ok(res, {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      lessonId: assignment.lesson_id,
      dueDate: assignment.due_date instanceof Date ? assignment.due_date.toISOString().slice(0, 10) : '',
      totalMarks: Number(assignment.total_marks),
      passingScore: Number(assignment.passing_score),
    })
  } catch (err) { next(err) }
}

export async function deleteAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentId = req.params.assignmentId

    // Check permissions
    const { rows: assignRows } = await query(
      `SELECT a.*, c.instructor_id FROM assignments a
       JOIN courses c ON c.id = a.course_id WHERE a.id = $1`,
      [assignmentId]
    )
    if (!assignRows[0]) return notFound(res, 'Assignment not found')
    if (!isAdmin(req) && assignRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only delete your own assignments')

    await query('DELETE FROM assignments WHERE id = $1', [assignmentId])
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}