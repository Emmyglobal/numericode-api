import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound, forbidden } from '../utils/response'

const isAdmin = (req: Request) => req.user!.role === 'admin'

interface QuizRow { id: string; title: string; lesson_id: string; passing_score: number; created_by: string }
interface AssignmentRow { id: string; title: string; lesson_id: string; due_date: Date; total_marks: number }
interface LessonRow { id: string; module_id: string; title: string; position: number }
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
        const { rows: assignments } = await query<AssignmentRow>(
          'SELECT id, title, lesson_id, due_date, total_marks FROM assignments WHERE lesson_id = $1 ORDER BY title',
          [lesson.id]
        )
        return {
          id: lesson.id,
          title: lesson.title,
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

export async function createLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const moduleId = req.params.moduleId
    const { title } = req.body as { title?: string }
    if (!title?.trim()) return fail(res, 'Lesson title is required', 400)

    const { rows: moduleRows } = await query(
      `SELECT m.*, c.instructor_id FROM modules m JOIN courses c ON c.id = m.course_id WHERE m.id = $1`,
      [moduleId]
    )
    if (!moduleRows[0]) return notFound(res, 'Module not found')
    if (!isAdmin(req) && moduleRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only add lessons to your own modules')

    const { rows } = await query(
      `INSERT INTO lessons (module_id, title, position)
       VALUES ($1, $2, (SELECT COUNT(*) FROM lessons WHERE module_id = $1)) RETURNING *`,
      [moduleId, title.trim()]
    )
    return ok(res, { id: rows[0].id, title: rows[0].title }, 201)
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
    return ok(res, { id: lessonRows[0].id, title: lessonRows[0].title })
  } catch (err) { next(err) }
}

export async function createQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = req.params.lessonId
    const { title } = req.body as { title?: string }
    if (!title?.trim()) return fail(res, 'Quiz title is required', 400)

    const { rows: lessonRows } = await query(
      `SELECT l.*, m.course_id, c.instructor_id FROM lessons l
       JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = $1`,
      [lessonId]
    )
    if (!lessonRows[0]) return notFound(res, 'Lesson not found')
    if (!isAdmin(req) && lessonRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only add quizzes to your own lessons')

    let rows: any[]
    try {
      ;({ rows } = await query(
        `INSERT INTO quizzes (course_id, lesson_id, title, description, passing_score, created_by)
         VALUES ($1, $2, $3, $4, 70, $5) RETURNING *`,
        [lessonRows[0].course_id, lessonId, title.trim(), '', req.user!.userId]
      ))
    } catch {
      ;({ rows } = await query(
        `INSERT INTO quizzes (course_id, title, description, passing_score, created_by)
         VALUES ($1, $2, $3, 70, $4) RETURNING *`,
        [lessonRows[0].course_id, title.trim(), '', req.user!.userId]
      ))
    }
    return ok(res, { id: rows[0].id, title: rows[0].title, lessonId }, 201)
  } catch (err) { next(err) }
}

export async function createAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = req.params.lessonId
    const { title } = req.body as { title?: string }
    if (!title?.trim()) return fail(res, 'Assignment title is required', 400)

    const { rows: lessonRows } = await query(
      `SELECT l.*, m.course_id, c.instructor_id FROM lessons l
       JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = $1`,
      [lessonId]
    )
    if (!lessonRows[0]) return notFound(res, 'Lesson not found')
    if (!isAdmin(req) && lessonRows[0].instructor_id !== req.user!.userId) return forbidden(res, 'You can only add assignments to your own lessons')

    const { rows } = await query(
      `INSERT INTO assignments (course_id, lesson_id, title, due_date, total_marks, passing_score)
       VALUES ($1, $2, $3, NOW() + INTERVAL '7 days', 100, 50) RETURNING *`,
      [lessonRows[0].course_id, lessonId, title.trim()]
    )
    return ok(res, { id: rows[0].id, title: rows[0].title, lessonId }, 201)
  } catch (err) { next(err) }
}