import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, notFound } from '../utils/response'

interface NotificationRow {
  id: string; title: string; body: string; type: string
  link: string | null; is_read: boolean; created_at: Date
}

export async function listNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<NotificationRow>(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user!.userId]
    )
    const { rows: unread } = await query<{ count: string }>(
      `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
      [req.user!.userId]
    )
    return ok(res, {
      unreadCount: Number(unread[0].count),
      notifications: rows.map(n => ({
        id: n.id, title: n.title, body: n.body, type: n.type,
        link: n.link, isRead: n.is_read, createdAt: n.created_at.toISOString(),
      })),
    })
  } catch (err) { next(err) }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<NotificationRow>(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *`,
      [req.params.id, req.user!.userId]
    )
    if (!rows[0]) return notFound(res, 'Notification not found')
    return ok(res, { id: rows[0].id, isRead: true })
  } catch (err) { next(err) }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    await query(`UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`, [req.user!.userId])
    return ok(res, { success: true })
  } catch (err) { next(err) }
}
