import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, forbidden, notFound, ok } from '../utils/response'

type BoardRow = { id: string; lesson_id: string; owner_id: string; board_data: unknown; is_shared: boolean; is_locked: boolean; updated_at: Date; board_type: string; target_student_ids: string[]; revision: number }

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
  return { id: row.id, lessonId: row.lesson_id, boardData: row.board_data, isShared: row.is_shared, isLocked: row.is_locked, updatedAt: row.updated_at.toISOString(), boardType: row.board_type ?? 'group', targetStudentIds: row.target_student_ids ?? [], revision: row.revision ?? 0 }
}

export async function getStudentBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    if (!await studentCanAccess(req.user!.userId, lessonId)) return forbidden(res, 'You do not have access to this lesson board')
    const { rows } = await query<BoardRow>(
      `SELECT * FROM lesson_boards WHERE lesson_id = $1 AND (
         owner_id = $2 OR
         (is_shared = TRUE AND (board_type = 'group' OR $2 = ANY(target_student_ids)))
       ) ORDER BY (owner_id = $2) DESC LIMIT 1`,
      [lessonId, req.user!.userId]
    )
    return ok(res, rows[0] ? serialize(rows[0]) : { lessonId, boardData: { version: 1, elements: [] }, isShared: false, isLocked: false, boardType: 'group', targetStudentIds: [], revision: 0 })
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
    return ok(res, rows[0] ? serialize(rows[0]) : { lessonId, boardData: { version: 1, elements: [] }, isShared: false, isLocked: false, boardType: 'group', targetStudentIds: [], revision: 0 })
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
       ON CONFLICT (lesson_id, owner_id) DO UPDATE SET board_data = EXCLUDED.board_data, revision = lesson_boards.revision + 1, updated_at = NOW() RETURNING *`,
      [lessonId, req.user!.userId, JSON.stringify(boardData)]
    )
    return ok(res, serialize(rows[0]))
  } catch (error) { next(error) }
}

export async function getTrainerSharedBoardForStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    if (!await studentCanAccess(req.user!.userId, lessonId)) return forbidden(res, 'You do not have access to this lesson board')
    const { rows } = await query<BoardRow>(
      `SELECT * FROM lesson_boards WHERE lesson_id = $1 AND is_shared = TRUE AND (
         board_type = 'group' OR $2 = ANY(target_student_ids)
       ) ORDER BY updated_at DESC LIMIT 1`,
      [lessonId, req.user!.userId]
    )
    return ok(res, rows[0] ? serialize(rows[0]) : { lessonId, boardData: { version: 1, elements: [] }, isShared: false, isLocked: false, boardType: 'group', targetStudentIds: [], revision: 0 })
  } catch (error) { next(error) }
}

export async function updateTrainerBoardState(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    const lesson = await getLessonAccess(lessonId)
    if (!lesson) return notFound(res, 'Lesson not found')
    if (lesson.instructor_id !== req.user!.userId) return forbidden(res, 'You can only manage boards in your courses')
    const { isShared, isLocked, boardType, targetStudentIds } = req.body as { isShared?: boolean; isLocked?: boolean; boardType?: 'group' | 'individual'; targetStudentIds?: string[] }
    if (typeof isShared !== 'boolean' && typeof isLocked !== 'boolean' && !boardType) return fail(res, 'Provide isShared, isLocked, or boardType', 400)
    // Preserve selected students when changing only lock or visibility state.
    const finalBoardType = boardType === undefined ? null : (boardType === 'individual' ? 'individual' : 'group')
    const finalTargetIds = boardType === undefined ? null : (finalBoardType === 'individual' ? (targetStudentIds ?? []) : [])
    const { rows } = await query<BoardRow>(
      `INSERT INTO lesson_boards (lesson_id, owner_id, board_data, is_shared, is_locked, board_type, target_student_ids)
       VALUES ($1, $2, '{"version":1,"elements":[]}'::jsonb, COALESCE($3, FALSE), COALESCE($4, FALSE), COALESCE($5, 'group'), COALESCE($6::uuid[], '{}'))
       ON CONFLICT (lesson_id, owner_id) DO UPDATE SET
         is_shared = COALESCE($3, lesson_boards.is_shared),
         is_locked = COALESCE($4, lesson_boards.is_locked),
         board_type = COALESCE($5, lesson_boards.board_type),
         target_student_ids = COALESCE($6, lesson_boards.target_student_ids),
         updated_at = NOW() RETURNING *`,
      [lessonId, req.user!.userId, isShared, isLocked, finalBoardType, finalTargetIds]
    )
    return ok(res, serialize(rows[0]))
  } catch (error) { next(error) }
}
