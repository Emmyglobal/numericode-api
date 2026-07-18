import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, forbidden, notFound, ok } from '../utils/response'

type BoardRow = { id: string; lesson_id: string; owner_id: string; board_data: unknown; is_shared: boolean; is_locked: boolean; updated_at: Date }

async function getLessonAccess(lessonId: string) {
  const { rows } = await query<{ course_id: string; instructor_id: string; access_level: string; premium_enabled: boolean }>(
    `SELECT m.course_id, c.instructor_id, c.access_level, c.premium_enabled
     FROM lessons l JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = $1`, [lessonId]
  )
  return rows[0]
}

async function studentCanAccess(userId: string, lessonId: string) {
  const { rows } = await query<{ id: string }>(
    `SELECT e.id FROM enrollments e JOIN modules m ON m.course_id = e.course_id JOIN lessons l ON l.module_id = m.id
     JOIN courses c ON c.id = e.course_id WHERE e.user_id = $1 AND l.id = $2
     AND (c.access_level = 'free' OR (c.premium_enabled AND EXISTS (
       SELECT 1 FROM subscriptions s WHERE s.user_id = $1 AND s.status = 'active' AND s.ends_at > NOW()
     )))`, [userId, lessonId]
  )
  return Boolean(rows[0])
}

function serialize(row: BoardRow) {
  return { id: row.id, lessonId: row.lesson_id, boardData: row.board_data, isShared: row.is_shared, isLocked: row.is_locked, updatedAt: row.updated_at.toISOString() }
}

export async function getStudentBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    if (!await studentCanAccess(req.user!.userId, lessonId)) return forbidden(res, 'You do not have access to this lesson board')
    const { rows } = await query<BoardRow>(
      `SELECT * FROM lesson_boards WHERE lesson_id = $1 AND (owner_id = $2 OR is_shared = TRUE) ORDER BY (owner_id = $2) DESC LIMIT 1`,
      [lessonId, req.user!.userId]
    )
    return ok(res, rows[0] ? serialize(rows[0]) : { lessonId, boardData: { version: 1, elements: [] }, isShared: false, isLocked: false })
  } catch (error) { next(error) }
}

export async function saveStudentBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    if (!await studentCanAccess(req.user!.userId, lessonId)) return forbidden(res, 'You do not have access to this lesson board')
    const { rows: locks } = await query<{ id: string }>(`SELECT id FROM lesson_boards WHERE lesson_id = $1 AND is_shared = TRUE AND is_locked = TRUE`, [lessonId])
    if (locks[0]) return forbidden(res, 'This board is locked by the trainer')
    const { boardData } = req.body as { boardData?: unknown }
    if (!boardData || typeof boardData !== 'object') return fail(res, 'boardData must be a JSON object', 400)
    const { rows } = await query<BoardRow>(
      `INSERT INTO lesson_boards (lesson_id, owner_id, board_data) VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (lesson_id, owner_id) DO UPDATE SET board_data = EXCLUDED.board_data, updated_at = NOW()
       RETURNING *`, [lessonId, req.user!.userId, JSON.stringify(boardData)]
    )
    return ok(res, serialize(rows[0]))
  } catch (error) { next(error) }
}

export async function getTrainerBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const lesson = await getLessonAccess(String(req.params.lessonId))
    if (!lesson) return notFound(res, 'Lesson not found')
    if (lesson.instructor_id !== req.user!.userId) return forbidden(res, 'You can only manage boards in your courses')
    const lessonId = String(req.params.lessonId)
    const { rows } = await query<BoardRow>('SELECT * FROM lesson_boards WHERE lesson_id = $1 AND owner_id = $2', [lessonId, req.user!.userId])
    return ok(res, rows[0] ? serialize(rows[0]) : { lessonId, boardData: { version: 1, elements: [] }, isShared: false, isLocked: false })
  } catch (error) { next(error) }
}

export async function saveTrainerBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    const lesson = await getLessonAccess(lessonId)
    if (!lesson) return notFound(res, 'Lesson not found')
    if (lesson.instructor_id !== req.user!.userId) return forbidden(res, 'You can only manage boards in your courses')
    const { boardData } = req.body as { boardData?: unknown }
    if (!boardData || typeof boardData !== 'object') return fail(res, 'boardData must be a JSON object', 400)
    const { rows } = await query<BoardRow>(
      `INSERT INTO lesson_boards (lesson_id, owner_id, board_data) VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (lesson_id, owner_id) DO UPDATE SET board_data = EXCLUDED.board_data, updated_at = NOW() RETURNING *`,
      [lessonId, req.user!.userId, JSON.stringify(boardData)]
    )
    return ok(res, serialize(rows[0]))
  } catch (error) { next(error) }
}

export async function updateTrainerBoardState(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    const lesson = await getLessonAccess(lessonId)
    if (!lesson) return notFound(res, 'Lesson not found')
    if (lesson.instructor_id !== req.user!.userId) return forbidden(res, 'You can only manage boards in your courses')
    const { isShared, isLocked } = req.body as { isShared?: boolean; isLocked?: boolean }
    if (typeof isShared !== 'boolean' && typeof isLocked !== 'boolean') return fail(res, 'Provide isShared or isLocked', 400)
    const { rows } = await query<BoardRow>(
      `INSERT INTO lesson_boards (lesson_id, owner_id, board_data, is_shared, is_locked)
       VALUES ($1, $2, '{"version":1,"elements":[]}'::jsonb, COALESCE($3, FALSE), COALESCE($4, FALSE))
       ON CONFLICT (lesson_id, owner_id) DO UPDATE SET is_shared = COALESCE($3, lesson_boards.is_shared), is_locked = COALESCE($4, lesson_boards.is_locked), updated_at = NOW() RETURNING *`,
      [lessonId, req.user!.userId, isShared, isLocked]
    )
    return ok(res, serialize(rows[0]))
  } catch (error) { next(error) }
}
