import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, forbidden, notFound, ok } from '../utils/response'

type CodeEditorRow = {
  id: string
  lesson_id: string
  owner_id: string
  code_data: unknown
  is_shared: boolean
  is_locked: boolean
  share_type: string
  target_student_ids: string[]
  revision: number
  updated_at: Date
}

const emptyCodeData = {
  version: 1,
  files: [
    {
      id: 'main',
      name: 'main.js',
      language: 'javascript',
      content: '// Welcome to the collaborative code editor!\n// Write your code here and run it together.\nconsole.log("Hello, NumeryCode!");',
    },
  ],
}

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
     AND (c.access_level = 'free' OR (c.premium_enabled AND (
       EXISTS (SELECT 1 FROM subscriptions s WHERE s.user_id = $1 AND s.status = 'active' AND s.ends_at > NOW())
       OR EXISTS (SELECT 1 FROM payments p WHERE p.user_id = $1 AND p.course_id = c.id AND p.status = 'verified')
     )))`, [userId, lessonId]
  )
  return Boolean(rows[0])
}

function serialize(row: CodeEditorRow) {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    codeData: row.code_data,
    isShared: row.is_shared,
    isLocked: row.is_locked,
    shareType: row.share_type ?? 'group',
    targetStudentIds: row.target_student_ids ?? [],
    revision: row.revision ?? 0,
    updatedAt: row.updated_at.toISOString(),
  }
}

// ─── GET /api/code-editor/lessons/:lessonId (student) ────────────────────────
export async function getStudentCodeEditor(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    if (!await studentCanAccess(req.user!.userId, lessonId)) return forbidden(res, 'You do not have access to this code editor')
    const { rows } = await query<CodeEditorRow>(
      `SELECT * FROM code_editor_sessions WHERE lesson_id = $1 AND (
         owner_id = $2 OR
         (is_shared = TRUE AND (share_type = 'group' OR $2 = ANY(target_student_ids)))
       ) ORDER BY (owner_id = $2) DESC LIMIT 1`,
      [lessonId, req.user!.userId]
    )
    return ok(res, rows[0] ? serialize(rows[0]) : { lessonId, codeData: emptyCodeData, isShared: false, isLocked: false, shareType: 'group', targetStudentIds: [], revision: 0 })
  } catch (error) { next(error) }
}

// ─── PUT /api/code-editor/lessons/:lessonId (student) ────────────────────────
export async function saveStudentCodeEditor(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    if (!await studentCanAccess(req.user!.userId, lessonId)) return forbidden(res, 'You do not have access to this code editor')
    const { rows: locks } = await query<{ id: string }>(`SELECT id FROM code_editor_sessions WHERE lesson_id = $1 AND is_shared = TRUE AND is_locked = TRUE`, [lessonId])
    if (locks[0]) return forbidden(res, 'This code editor is locked by the trainer')
    const { codeData } = req.body as { codeData?: unknown }
    if (!codeData || typeof codeData !== 'object') return fail(res, 'codeData must be a JSON object', 400)
    const { rows } = await query<CodeEditorRow>(
      `INSERT INTO code_editor_sessions (lesson_id, owner_id, code_data) VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (lesson_id, owner_id) DO UPDATE SET code_data = EXCLUDED.code_data, updated_at = NOW()
       RETURNING *`, [lessonId, req.user!.userId, JSON.stringify(codeData)]
    )
    return ok(res, serialize(rows[0]))
  } catch (error) { next(error) }
}

// ─── GET /api/code-editor/trainer/lessons/:lessonId (trainer) ────────────────
export async function getTrainerCodeEditor(req: Request, res: Response, next: NextFunction) {
  try {
    const lesson = await getLessonAccess(String(req.params.lessonId))
    if (!lesson) return notFound(res, 'Lesson not found')
    if (lesson.instructor_id !== req.user!.userId) return forbidden(res, 'You can only manage code editors in your courses')
    const lessonId = String(req.params.lessonId)
    const { rows } = await query<CodeEditorRow>('SELECT * FROM code_editor_sessions WHERE lesson_id = $1 AND owner_id = $2', [lessonId, req.user!.userId])
    return ok(res, rows[0] ? serialize(rows[0]) : { lessonId, codeData: emptyCodeData, isShared: false, isLocked: false, shareType: 'group', targetStudentIds: [], revision: 0 })
  } catch (error) { next(error) }
}

// ─── PUT /api/code-editor/trainer/lessons/:lessonId (trainer) ────────────────
export async function saveTrainerCodeEditor(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    const lesson = await getLessonAccess(lessonId)
    if (!lesson) return notFound(res, 'Lesson not found')
    if (lesson.instructor_id !== req.user!.userId) return forbidden(res, 'You can only manage code editors in your courses')
    const { codeData } = req.body as { codeData?: unknown }
    if (!codeData || typeof codeData !== 'object') return fail(res, 'codeData must be a JSON object', 400)
    const { rows } = await query<CodeEditorRow>(
      `INSERT INTO code_editor_sessions (lesson_id, owner_id, code_data) VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (lesson_id, owner_id) DO UPDATE SET code_data = EXCLUDED.code_data, revision = code_editor_sessions.revision + 1, updated_at = NOW() RETURNING *`,
      [lessonId, req.user!.userId, JSON.stringify(codeData)]
    )
    return ok(res, serialize(rows[0]))
  } catch (error) { next(error) }
}

// ─── GET /api/code-editor/lessons/:lessonId/live (student) ───────────────────
export async function getTrainerSharedCodeEditorForStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    if (!await studentCanAccess(req.user!.userId, lessonId)) return forbidden(res, 'You do not have access to this code editor')
    const { rows } = await query<CodeEditorRow>(
      `SELECT * FROM code_editor_sessions WHERE lesson_id = $1 AND is_shared = TRUE AND (
         share_type = 'group' OR $2 = ANY(target_student_ids)
       ) ORDER BY updated_at DESC LIMIT 1`,
      [lessonId, req.user!.userId]
    )
    return ok(res, rows[0] ? serialize(rows[0]) : { lessonId, codeData: emptyCodeData, isShared: false, isLocked: false, shareType: 'group', targetStudentIds: [], revision: 0 })
  } catch (error) { next(error) }
}

// ─── PATCH /api/code-editor/trainer/lessons/:lessonId (trainer) ──────────────
export async function updateTrainerCodeEditorState(req: Request, res: Response, next: NextFunction) {
  try {
    const lessonId = String(req.params.lessonId)
    const lesson = await getLessonAccess(lessonId)
    if (!lesson) return notFound(res, 'Lesson not found')
    if (lesson.instructor_id !== req.user!.userId) return forbidden(res, 'You can only manage code editors in your courses')
    const { isShared, isLocked, shareType, targetStudentIds } = req.body as { isShared?: boolean; isLocked?: boolean; shareType?: 'group' | 'individual'; targetStudentIds?: string[] }
    if (typeof isShared !== 'boolean' && typeof isLocked !== 'boolean' && !shareType) return fail(res, 'Provide isShared, isLocked, or shareType', 400)
    // Changing the lock or visibility must not discard individual recipients.
    const finalShareType = shareType === undefined ? null : (shareType === 'individual' ? 'individual' : 'group')
    const finalTargetIds = shareType === undefined ? null : (finalShareType === 'individual' ? (targetStudentIds ?? []) : [])
    const { rows } = await query<CodeEditorRow>(
      `INSERT INTO code_editor_sessions (lesson_id, owner_id, code_data, is_shared, is_locked, share_type, target_student_ids)
       VALUES ($1, $2, $3::jsonb, COALESCE($4, FALSE), COALESCE($5, FALSE), COALESCE($6, 'group'), COALESCE($7::uuid[], '{}'))
       ON CONFLICT (lesson_id, owner_id) DO UPDATE SET
         is_shared = COALESCE($4, code_editor_sessions.is_shared),
         is_locked = COALESCE($5, code_editor_sessions.is_locked),
         share_type = COALESCE($6, code_editor_sessions.share_type),
         target_student_ids = COALESCE($7, code_editor_sessions.target_student_ids),
         updated_at = NOW() RETURNING *`,
      [lessonId, req.user!.userId, JSON.stringify(emptyCodeData), isShared, isLocked, finalShareType, finalTargetIds]
    )
    return ok(res, serialize(rows[0]))
  } catch (error) { next(error) }
}
