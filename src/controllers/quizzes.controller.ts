import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'

interface QuizRow {
  id: string; course_id: string; module_id: string | null; lesson_id: string | null
  title: string; description: string; time_limit: number | null; passing_score: number
  max_attempts: number; shuffle_questions: boolean; show_results: boolean
  created_by: string; created_at: Date; updated_at: Date
}

interface QuestionRow {
  id: string; quiz_id: string; question_text: string; question_type: string
  options: unknown; correct_answer: string | null; points: number; position: number; created_at: Date
}

interface AttemptRow {
  id: string; quiz_id: string; user_id: string; started_at: Date
  completed_at: Date | null; score: number | null; passed: boolean | null; answers: unknown
}

// ─── Quiz CRUD ───────────────────────────────────────────────────────────────

export async function listQuizzes(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.query
    const { rows } = await query<QuizRow & { question_count: string; attempt_count: string }>(
      `SELECT q.*, 
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count,
        (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id AND user_id = $2) as attempt_count
       FROM quizzes q
       WHERE q.course_id = $1
       ORDER BY q.created_at DESC`,
      [courseId, req.user!.userId]
    )
    return ok(res, rows.map(q => ({
      id: q.id, courseId: q.course_id, moduleId: q.module_id, lessonId: q.lesson_id,
      title: q.title, description: q.description, timeLimit: q.time_limit,
      passingScore: Number(q.passing_score), maxAttempts: q.max_attempts,
      shuffleQuestions: q.shuffle_questions, showResults: q.show_results,
      questionCount: Number(q.question_count), attemptCount: Number(q.attempt_count),
      createdAt: q.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function getQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: [quiz] } = await query<QuizRow>(
      'SELECT * FROM quizzes WHERE id = $1',
      [req.params.id]
    )
    if (!quiz) return notFound(res, 'Quiz not found')
    
    const { rows: questions } = await query<QuestionRow>(
      'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [req.params.id]
    )
    
    return ok(res, {
      id: quiz.id, courseId: quiz.course_id, moduleId: quiz.module_id, lessonId: quiz.lesson_id,
      title: quiz.title, description: quiz.description, timeLimit: quiz.time_limit,
      passingScore: Number(quiz.passing_score), maxAttempts: quiz.max_attempts,
      shuffleQuestions: quiz.shuffle_questions, showResults: quiz.show_results,
      questions: questions.map(q => ({
        id: q.id, questionText: q.question_text, questionType: q.question_type,
        options: q.options, correctAnswer: q.correct_answer, points: Number(q.points), position: q.position,
      })),
      createdAt: quiz.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function createQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, moduleId, lessonId, title, description, timeLimit, passingScore, maxAttempts, shuffleQuestions, showResults, questions } = req.body as {
      courseId: string; moduleId?: string; lessonId?: string; title: string; description?: string
      timeLimit?: number; passingScore?: number; maxAttempts?: number; shuffleQuestions?: boolean; showResults?: boolean
      questions?: Array<{ questionText: string; questionType: string; options?: unknown; correctAnswer?: string; points: number; position: number }>
    }
    
    if (!courseId || !title) return fail(res, 'Course ID and title are required', 400)
    
    const client = await req.app.locals.dbClient || (await import('../db/pool')).getClient()
    
    try {
      await client.query('BEGIN')
      
      const { rows: [quiz] } = await client.query(
        `INSERT INTO quizzes (course_id, module_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [courseId, moduleId || null, lessonId || null, title, description || '', timeLimit || null, passingScore || 70, maxAttempts || 1, shuffleQuestions || false, showResults !== false, req.user!.userId]
      )
      
      // Insert questions if provided
      if (questions && questions.length > 0) {
        for (const q of questions) {
          await client.query(
            `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [quiz.id, q.questionText, q.questionType, q.options ? JSON.stringify(q.options) : null, q.correctAnswer || null, q.points, q.position]
          )
        }
      }
      
      await client.query('COMMIT')
      
      return ok(res, {
        id: quiz.id, courseId: quiz.course_id, moduleId: quiz.module_id, lessonId: quiz.lesson_id,
        title: quiz.title, description: quiz.description, timeLimit: quiz.time_limit,
        passingScore: Number(quiz.passing_score), maxAttempts: quiz.max_attempts,
        shuffleQuestions: quiz.shuffle_questions, showResults: quiz.show_results,
        createdAt: quiz.created_at.toISOString(),
      }, 201)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  } catch (err) { next(err) }
}

export async function updateQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, timeLimit, passingScore, maxAttempts, shuffleQuestions, showResults } = req.body as {
      title?: string; description?: string; timeLimit?: number; passingScore?: number; maxAttempts?: number; shuffleQuestions?: boolean; showResults?: boolean
    }
    
    const { rows: [quiz] } = await query<QuizRow>(
      `UPDATE quizzes SET
        title = COALESCE($1, title), description = COALESCE($2, description),
        time_limit = COALESCE($3, time_limit), passing_score = COALESCE($4, passing_score),
        max_attempts = COALESCE($5, max_attempts), shuffle_questions = COALESCE($6, shuffle_questions),
        show_results = COALESCE($7, show_results), updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [title, description, timeLimit, passingScore, maxAttempts, shuffleQuestions, showResults, req.params.id]
    )
    
    if (!quiz) return notFound(res, 'Quiz not found')
    
    return ok(res, {
      id: quiz.id, courseId: quiz.course_id, title: quiz.title, description: quiz.description,
      timeLimit: quiz.time_limit, passingScore: Number(quiz.passing_score), maxAttempts: quiz.max_attempts,
      shuffleQuestions: quiz.shuffle_questions, showResults: quiz.show_results,
      createdAt: quiz.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query('DELETE FROM quizzes WHERE id = $1 RETURNING id', [req.params.id])
    if (!rows[0]) return notFound(res, 'Quiz not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── Quiz Questions ──────────────────────────────────────────────────────────

export async function addQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { questionText, questionType, options, correctAnswer, points, position } = req.body as {
      questionText: string; questionType: string; options?: unknown; correctAnswer?: string; points: number; position: number
    }
    
    const { rows: [question] } = await query(
      `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.params.quizId, questionText, questionType, options ? JSON.stringify(options) : null, correctAnswer || null, points, position]
    )
    
    return ok(res, {
      id: question.id, quizId: question.quiz_id, questionText: question.question_text,
      questionType: question.question_type, options: question.options, correctAnswer: question.correct_answer,
      points: Number(question.points), position: question.position,
    }, 201)
  } catch (err) { next(err) }
}

export async function updateQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { questionText, questionType, options, correctAnswer, points, position } = req.body as {
      questionText?: string; questionType?: string; options?: unknown; correctAnswer?: string; points?: number; position?: number
    }
    
    const { rows: [question] } = await query(
      `UPDATE quiz_questions SET
        question_text = COALESCE($1, question_text), question_type = COALESCE($2, question_type),
        options = COALESCE($3, options), correct_answer = COALESCE($4, correct_answer),
        points = COALESCE($5, points), position = COALESCE($6, position)
       WHERE id = $7 AND quiz_id = $8 RETURNING *`,
      [questionText, questionType, options ? JSON.stringify(options) : undefined, correctAnswer, points, position, req.params.questionId, req.params.quizId]
    )
    
    if (!question) return notFound(res, 'Question not found')
    
    return ok(res, {
      id: question.id, quizId: question.quiz_id, questionText: question.question_text,
      questionType: question.question_type, options: question.options, correctAnswer: question.correct_answer,
      points: Number(question.points), position: question.position,
    })
  } catch (err) { next(err) }
}

export async function deleteQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query('DELETE FROM quiz_questions WHERE id = $1 AND quiz_id = $2 RETURNING id', [req.params.questionId, req.params.quizId])
    if (!rows[0]) return notFound(res, 'Question not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── Quiz Attempts ───────────────────────────────────────────────────────────

export async function startQuizAttempt(req: Request, res: Response, next: NextFunction) {
  try {
    const { quizId } = req.params
    const userId = req.user!.userId
    
    // Check if user has remaining attempts
    const { rows: [quiz] } = await query<QuizRow>(
      'SELECT * FROM quizzes WHERE id = $1',
      [quizId]
    )
    if (!quiz) return notFound(res, 'Quiz not found')
    
    const { rows: [attemptCount] } = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM quiz_attempts WHERE quiz_id = $1 AND user_id = $2',
      [quizId, userId]
    )
    
    if (Number(attemptCount.count) >= quiz.max_attempts) {
      return fail(res, 'You have exceeded the maximum number of attempts', 403)
    }
    
    // Get questions
    const { rows: questions } = await query<QuestionRow>(
      'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quizId]
    )
    
    // Create attempt
    const { rows: [attempt] } = await query<AttemptRow>(
      'INSERT INTO quiz_attempts (quiz_id, user_id) VALUES ($1, $2) RETURNING *',
      [quizId, userId]
    )
    
    return ok(res, {
      attemptId: attempt.id,
      questions: questions.map(q => ({
        id: q.id, questionText: q.question_text, questionType: q.question_type,
        options: q.options, points: Number(q.points), position: q.position,
      })),
      timeLimit: quiz.time_limit,
      maxAttempts: quiz.max_attempts,
      attemptNumber: Number(attemptCount.count) + 1,
    }, 201)
  } catch (err) { next(err) }
}

export async function submitQuizAttempt(req: Request, res: Response, next: NextFunction) {
  try {
    const { quizId } = req.params
    const { answers } = req.body as { answers: Record<string, unknown> }
    const userId = req.user!.userId
    
    // Get quiz details
    const { rows: [quiz] } = await query<QuizRow>(
      'SELECT * FROM quizzes WHERE id = $1',
      [quizId]
    )
    if (!quiz) return notFound(res, 'Quiz not found')
    
    // Get all questions with correct answers
    const { rows: questions } = await query<QuestionRow>(
      'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [quizId]
    )
    
    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    
    for (const question of questions) {
      totalPoints += Number(question.points)
      
      const userAnswer = answers[question.id]
      
      if (question.question_type === 'multiple_choice') {
        const options = question.options as Array<{ id: string; isCorrect: boolean }> | null
        const correctOptions = options?.filter(o => o.isCorrect) || []
        const userOptions = Array.isArray(userAnswer) ? userAnswer : []
        if (correctOptions.length === userOptions.length && 
            correctOptions.every(co => userOptions.some(uo => uo === co.id))) {
          earnedPoints += Number(question.points)
        }
      } else if (question.question_type === 'true_false') {
        if (userAnswer === question.correct_answer) {
          earnedPoints += Number(question.points)
        }
      } else if (question.question_type === 'fill_blank') {
        if (String(userAnswer).toLowerCase().trim() === question.correct_answer?.toLowerCase().trim()) {
          earnedPoints += Number(question.points)
        }
      }
      // Essay questions are not auto-graded
    }
    
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = score >= quiz.passing_score
    
    // Update attempt
    const { rows: [attempt] } = await query<AttemptRow>(
      `UPDATE quiz_attempts SET completed_at = NOW(), score = $1, passed = $2, answers = $3
       WHERE quiz_id = $4 AND user_id = $5 AND completed_at IS NULL
       RETURNING *`,
      [score, passed, JSON.stringify(answers), quizId, userId]
    )
    
    return ok(res, {
      attemptId: attempt.id,
      score: Number(score),
      passed,
      totalPoints: Number(totalPoints),
      earnedPoints: Number(earnedPoints),
      showResults: quiz.show_results,
      passingScore: Number(quiz.passing_score),
    })
  } catch (err) { next(err) }
}

export async function getQuizAttempts(req: Request, res: Response, next: NextFunction) {
  try {
    const { quizId } = req.params
    const userId = req.user!.userId
    
    const { rows } = await query<AttemptRow>(
      `SELECT * FROM quiz_attempts 
       WHERE quiz_id = $1 AND user_id = $2 
       ORDER BY started_at DESC`,
      [quizId, userId]
    )
    
    return ok(res, rows.map(a => ({
      id: a.id, quizId: a.quiz_id, userId: a.user_id,
      startedAt: a.started_at.toISOString(), completedAt: a.completed_at?.toISOString(),
      score: a.score ? Number(a.score) : null, passed: a.passed,
    })))
  } catch (err) { next(err) }
}
