import type { Request, Response, NextFunction } from 'express'
import { query, getClient } from '../db/pool'
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

// Validate multiple-choice options: enforce at most one correct option and basic shape
function validateSingleChoiceOptions(
  options: unknown,
  correctAnswer?: string
): { ok: true; normalized: Array<Record<string, unknown>> | null } | { ok: false; message: string } {
  if (!options) return { ok: true, normalized: null }
  if (!Array.isArray(options)) return { ok: false, message: 'Options must be an array' }
  const opts = options as Array<Record<string, unknown>>
  const corrects = opts.filter(o => o && o.isCorrect === true)
  if (corrects.length > 1) return { ok: false, message: 'Multiple choice questions must have at most one correct option' }
  if (corrects.length === 0 && correctAnswer) {
    const found = opts.find(o => o && o.id === correctAnswer)
    if (!found) return { ok: false, message: 'correctAnswer does not match any option id' }
  }
  return { ok: true, normalized: opts }
}

// Strip the answer key from multiple-choice options before sending them to a
// student. The `isCorrect` flags live inside the stored JSONB payload and would
// leak every correct answer through the network tab if forwarded verbatim.
function toStudentOptions(options: unknown): unknown {
  if (!Array.isArray(options)) return options
  return (options as Array<Record<string, unknown>>).map(o => {
    if (!o || typeof o !== 'object' || !('isCorrect' in o)) return o
    const { isCorrect: _stripped, ...rest } = o
    return rest
  })
}

// Key-order-independent JSON comparison used for idempotent-submit detection.
function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`
}

// Product rule: a quiz must be finishable in UNDER one hour. timeLimit is
// expressed in whole minutes, so the valid range is 1..59 (or omitted/null).
function validateTimeLimit(timeLimit: unknown): string | null {
  if (timeLimit === undefined || timeLimit === null) return null
  const n = Number(timeLimit)
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1 || n >= 60) {
    return 'Quiz time limit must be between 1 and 59 minutes (below 1 hour)'
  }
  return null
}

// ─── Quiz CRUD ───────────────────────────────────────────────────────────────

export async function listQuizzes(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = req.params.courseId

    // Authorization: student must be enrolled in the course.
    if (req.user!.role === 'student') {
      const { rows: enrollRows } = await query(
        `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2
         UNION ALL
         SELECT 1 FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()
         UNION ALL
         SELECT 1 FROM payments WHERE user_id = $1 AND course_id = $2 AND status = 'verified'
         LIMIT 1`,
        [req.user!.userId, courseId]
      )
      if (!enrollRows[0]) return forbidden(res, 'You must be enrolled in this course to view quizzes')
    }

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

export async function listLessonQuizzes(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = req.params.lessonId

    // Look up the course_id for the lesson to check enrollment
    const { rows: lessonRows } = await query<{ course_id: string }>(
      'SELECT course_id FROM lessons WHERE id = $1',
      [lessonId]
    )

    // Authorization: student must be enrolled in the course.
    if (req.user!.role === 'student' && lessonRows[0]) {
      const courseId = lessonRows[0].course_id
      const { rows: enrollRows } = await query(
        `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2
         UNION ALL
         SELECT 1 FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()
         UNION ALL
         SELECT 1 FROM payments WHERE user_id = $1 AND course_id = $2 AND status = 'verified'
         LIMIT 1`,
        [req.user!.userId, courseId]
      )
      if (!enrollRows[0]) return forbidden(res, 'You must be enrolled in this course to view quizzes')
    }

    const { rows } = await query<QuizRow & { question_count: string; attempt_count: string }>(
      `SELECT q.*,
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count,
        (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id AND user_id = $2) as attempt_count
       FROM quizzes q
       WHERE q.lesson_id = $1
       ORDER BY q.created_at DESC`,
      [lessonId, req.user!.userId]
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

    // Authorization: student must be enrolled in the quiz's course.
    // Premium courses require a verified payment (enrollment is only created after payment).
    if (req.user!.role === 'student') {
      const { rows: enrollRows } = await query(
        `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2
         UNION ALL
         SELECT 1 FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()
         UNION ALL
         SELECT 1 FROM payments WHERE user_id = $1 AND course_id = $2 AND status = 'verified'
         LIMIT 1`,
        [req.user!.userId, quiz.course_id]
      )
      if (!enrollRows[0]) return forbidden(res, 'You must be enrolled in this course to view this quiz')
    }

    const { rows: questions } = await query<QuestionRow>(
      'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY position',
      [req.params.id]
    )

    // Do NOT expose correct_answer to students (answer-key leakage prevention).
    // Trainers/admins managing the quiz get the full payload.
    const isStudent = req.user!.role === 'student'
    return ok(res, {
      id: quiz.id, courseId: quiz.course_id, moduleId: quiz.module_id, lessonId: quiz.lesson_id,
      title: quiz.title, description: quiz.description, timeLimit: quiz.time_limit,
      passingScore: Number(quiz.passing_score), maxAttempts: quiz.max_attempts,
      shuffleQuestions: quiz.shuffle_questions, showResults: quiz.show_results,
      questions: questions.map(q => ({
        id: q.id, questionText: q.question_text, questionType: q.question_type,
        options: isStudent ? toStudentOptions(q.options) : q.options, points: Number(q.points), position: q.position,
        // correctAnswer is intentionally omitted for students
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
    // Product rule: quizzes must be completable in under 1 hour.
    const timeLimitError = validateTimeLimit(timeLimit)
    if (timeLimitError) return fail(res, timeLimitError, 400)
    
    const client = await getClient()
    
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
          if (q.questionType === 'multiple_choice') {
            const v = validateSingleChoiceOptions(q.options, q.correctAnswer)
            if (!v.ok) {
              await client.query('ROLLBACK')
              return fail(res, v.message, 400)
            }
          }

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
    } finally {
      // Prevent a connection leak — without this the pooled client stays
      // checked out forever, eventually exhausting the pool (EMAXCONNSESSION).
      client.release()
    }
  } catch (err) { next(err) }
}

export async function updateQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, timeLimit, passingScore, maxAttempts, shuffleQuestions, showResults } = req.body as {
      title?: string; description?: string; timeLimit?: number; passingScore?: number; maxAttempts?: number; shuffleQuestions?: boolean; showResults?: boolean
    }
    
    // Product rule: quizzes must be completable in under 1 hour.
    const timeLimitError = validateTimeLimit(timeLimit)
    if (timeLimitError) return fail(res, timeLimitError, 400)
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
    
    if (questionType === 'multiple_choice') {
      const v = validateSingleChoiceOptions(options, correctAnswer)
      if (!v.ok) return fail(res, v.message, 400)
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

    // Fetch existing question to decide whether validation is needed and to provide defaults
    const { rows: [existing] } = await query('SELECT question_type, options, correct_answer FROM quiz_questions WHERE id = $1 AND quiz_id = $2', [req.params.questionId, req.params.quizId])
    if (!existing) return notFound(res, 'Question not found')

    const finalType = questionType ?? existing.question_type
    const existingOptions = existing.options ? existing.options : null
    const optionsToValidate = options !== undefined ? options : existingOptions
    const answerToValidate = correctAnswer !== undefined
      ? String(correctAnswer)
      : (existing.correct_answer as string | null | undefined) ?? undefined

    if (finalType === 'multiple_choice') {
      const v = validateSingleChoiceOptions(optionsToValidate, answerToValidate)
      if (!v.ok) return fail(res, v.message, 400)
    }

    const { rows: [question] } = await query(
      `UPDATE quiz_questions SET
        question_text = COALESCE($1, question_text), question_type = COALESCE($2, question_type),
        options = COALESCE($3, options), correct_answer = COALESCE($4, correct_answer),
        points = COALESCE($5, points), position = COALESCE($6, position)
       WHERE id = $7 AND quiz_id = $8 RETURNING *`,
      [questionText, questionType, options ? JSON.stringify(options) : undefined, correctAnswer, points, position, req.params.questionId, req.params.quizId]
    )

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
    
    // Check if quiz exists
    const { rows: [quiz] } = await query<QuizRow>(
      'SELECT * FROM quizzes WHERE id = $1',
      [quizId]
    )
    if (!quiz) return notFound(res, 'Quiz not found')
    
    // Authorization: student must be enrolled in the quiz's course.
    // Premium courses require a verified payment (enrollment is only created after payment).
    const { rows: enrollRows } = await query(
      `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2
       UNION ALL
       SELECT 1 FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()
       UNION ALL
       SELECT 1 FROM payments WHERE user_id = $1 AND course_id = $2 AND status = 'verified'
       LIMIT 1`,
      [userId, quiz.course_id]
    )
    if (!enrollRows[0]) return forbidden(res, 'You must be enrolled in this course to take this quiz')
    
    // Check if user has remaining attempts
    const { rows: [attemptCount] } = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM quiz_attempts WHERE quiz_id = $1 AND user_id = $2',
      [quizId, userId]
    )
    
    if (Number(attemptCount.count) >= quiz.max_attempts) {
      return fail(res, 'You have exceeded the maximum number of attempts', 403)
    }
    
    // Get questions (without correct answers)
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
        options: toStudentOptions(q.options), points: Number(q.points), position: q.position,
        // correctAnswer is intentionally omitted
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
    
    // Authorization: student must be enrolled in the quiz's course.
    const { rows: enrollRows } = await query(
      `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2
       UNION ALL
       SELECT 1 FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()
       UNION ALL
       SELECT 1 FROM payments WHERE user_id = $1 AND course_id = $2 AND status = 'verified'
       LIMIT 1`,
      [userId, quiz.course_id]
    )
    if (!enrollRows[0]) return forbidden(res, 'You must be enrolled in this course to submit this quiz')
    
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
        const options = question.options as Array<{ id: string; isCorrect?: boolean }> | null
        const correctFromOptions = options?.find(o => o && o.isCorrect === true)
        const correctId = question.correct_answer ?? correctFromOptions?.id ?? null
        const userOption = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer
        if (correctId != null && userOption != null && String(userOption) === String(correctId)) {
          earnedPoints += Number(question.points)
        }
      } else if (question.question_type === 'true_false') {
        // Normalise so "True"/"true"/" true " all match the stored answer.
        if (String(userAnswer ?? '').toLowerCase().trim() === String(question.correct_answer ?? '').toLowerCase().trim()) {
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

    // ── Timing enforcement ──────────────────────────────────────────────────
    // An attempt whose server-side started_at is older than the quiz time limit
    // (plus a 60s network grace) can no longer be graded. The limit itself is
    // capped below 1 hour by validateTimeLimit at create/update time.
    const { rows: openRows } = await query<AttemptRow>(
      'SELECT * FROM quiz_attempts WHERE quiz_id = $1 AND user_id = $2 AND completed_at IS NULL ORDER BY started_at DESC LIMIT 1',
      [quizId, userId]
    )
    const openAttempt = openRows[0]
    if (openAttempt && quiz.time_limit != null) {
      const deadlineMs = new Date(openAttempt.started_at).getTime() + (Number(quiz.time_limit) * 60 + 60) * 1000
      if (Date.now() > deadlineMs) {
        // Close the expired attempt without a score so attempt counting stays honest.
        await query('UPDATE quiz_attempts SET completed_at = NOW() WHERE id = $1 AND completed_at IS NULL', [openAttempt.id])
        return fail(res, 'Time limit exceeded — this attempt has been closed. Retry the quiz if attempts remain.', 403)
      }
    }

    // ── Persist the graded attempt (idempotently) ───────────────────────────
    // 1. An open attempt is completed in place.
    // 2. With no open attempt: an exact repeat of the last graded answer set
    //    (double-click / network retry) returns the ORIGINAL result instead of
    //    recording a duplicate attempt.
    // 3. A genuinely new submission is only accepted while the student has
    //    attempts left (completed attempts < max_attempts).
    const { rows: [attempt] } = await query<AttemptRow>(
      `UPDATE quiz_attempts SET completed_at = NOW(), score = $1, passed = $2, answers = $3
       WHERE quiz_id = $4 AND user_id = $5 AND completed_at IS NULL
       RETURNING *`,
      [score, passed, JSON.stringify(answers), quizId, userId]
    )

    let attemptId = attempt?.id
    let finalScore = score
    let finalPassed = passed
    if (!attemptId) {
      const { rows: completedRows } = await query<AttemptRow>(
        `SELECT * FROM quiz_attempts WHERE quiz_id = $1 AND user_id = $2 AND completed_at IS NOT NULL ORDER BY started_at DESC`,
        [quizId, userId]
      )
      const lastCompleted = completedRows[0]
      if (lastCompleted && stableStringify(lastCompleted.answers) === stableStringify(answers)) {
        // Idempotent retry — same answers as the recorded attempt: replay it.
        attemptId = lastCompleted.id
        finalScore = lastCompleted.score != null ? Number(lastCompleted.score) : score
        finalPassed = lastCompleted.passed ?? passed
      } else if (completedRows.length >= quiz.max_attempts) {
        return fail(res, 'You have exceeded the maximum number of attempts', 403)
      } else {
        const { rows: [created] } = await query<AttemptRow>(
          `INSERT INTO quiz_attempts (quiz_id, user_id, completed_at, score, passed, answers)
           VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING *`,
          [quizId, userId, score, passed, JSON.stringify(answers)]
        )
        attemptId = created?.id
      }
    }

    // Recompute composite progress (lessons + assignments + quizzes) when a quiz is
    // completed so the user's enrollment progress reflects engagement with quizzes.
    try {
      const { recomputeAndUpdateEnrollmentProgress } = await import('../utils/progress')
      await recomputeAndUpdateEnrollmentProgress(userId, quiz.course_id)
    } catch (e) {
      // Non-fatal: progress update failure should not block quiz submission response
      console.error('progress recompute failed after quiz submission', e)
    }

    // ── Server-side marking result + per-question corrections ──────────────
    // The corrections payload is the ONLY source of correct answers for the
    // student review screen — it is emitted after grading, only when the quiz
    // allows showing results, and is always consistent with the recorded score.
    const corrections = quiz.show_results
      ? questions.map(q => {
          const userAnswer = (answers ?? {})[q.id]
          const options = q.options as Array<{ id: string; text?: string; isCorrect?: boolean }> | null
          const correctFromOptions = options?.filter(o => o && o.isCorrect === true).map(o => String(o.id)) ?? []
          const correctId = q.correct_answer != null && q.correct_answer !== ''
            ? String(q.correct_answer)
            : correctFromOptions[0] ?? null
          let earned: boolean | null = null
          if (q.question_type === 'multiple_choice') {
            const userOption = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer
            earned = correctId != null && userOption != null && String(userOption) === correctId
          } else if (q.question_type === 'true_false' || q.question_type === 'fill_blank') {
            earned = String(userAnswer ?? '').toLowerCase().trim() === String(q.correct_answer ?? '').toLowerCase().trim()
          } // essay → null (awaiting manual grading)
          return {
            questionId: q.id,
            earned,
            userAnswer: userAnswer ?? null,
            correctOptionIds: q.question_type === 'multiple_choice'
              ? (correctFromOptions.length > 0 ? correctFromOptions : correctId != null ? [correctId] : [])
              : [],
            correctOptionText: options?.find(o => o && String(o.id) === correctId)?.text ?? null,
            correctAnswerText: q.question_type === 'multiple_choice' ? null : (q.correct_answer ?? null),
          }
        })
      : undefined

    return ok(res, {
      attemptId,
      score: Number(finalScore),
      passed: finalPassed,
      totalPoints: Number(totalPoints),
      earnedPoints: Number(earnedPoints),
      showResults: quiz.show_results,
      passingScore: Number(quiz.passing_score),
      corrections,
    })
  } catch (err) { next(err) }
}

export async function getQuizAttempts(req: Request, res: Response, next: NextFunction) {
  try {
    const { quizId } = req.params
    const userId = req.user!.userId
    
    // Get quiz to find course_id
    const { rows: [quiz] } = await query<{ course_id: string }>(
      'SELECT course_id FROM quizzes WHERE id = $1',
      [quizId]
    )
    if (!quiz) return notFound(res, 'Quiz not found')
    
    // Authorization: student must be enrolled in the quiz's course.
    const { rows: enrollRows } = await query(
      `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2
       UNION ALL
       SELECT 1 FROM subscriptions WHERE user_id = $1 AND status = 'active' AND ends_at > NOW()
       UNION ALL
       SELECT 1 FROM payments WHERE user_id = $1 AND course_id = $2 AND status = 'verified'
       LIMIT 1`,
      [userId, quiz.course_id]
    )
    if (!enrollRows[0]) return forbidden(res, 'You must be enrolled in this course to view attempts')
    
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
