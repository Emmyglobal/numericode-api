import { query } from '../db/pool'

type NotificationType = 'general' | 'trainer_approval' | 'trainer_status' | 'announcement' | 'course'

/** Creates a notification for a single user. */
export async function notifyUser(
  userId: string, title: string, body: string,
  type: NotificationType = 'general', link?: string
) {
  await query(
    `INSERT INTO notifications (user_id, title, body, type, link) VALUES ($1, $2, $3, $4, $5)`,
    [userId, title, body, type, link ?? null]
  )
}

/** Creates the same notification for every user matching a role (e.g. all admins). */
export async function notifyRole(
  role: 'student' | 'trainer' | 'admin', title: string, body: string,
  type: NotificationType = 'general', link?: string
) {
  const { rows } = await query<{ id: string }>('SELECT id FROM users WHERE role = $1', [role])
  await Promise.all(rows.map(u => notifyUser(u.id, title, body, type, link)))
}

/** Creates the same notification for every user matching an announcement audience. */
export async function notifyAudience(
  audience: 'all' | 'students' | 'trainers', title: string, body: string,
  type: NotificationType = 'announcement', link?: string
) {
  const roleFilter =
    audience === 'students' ? `role = 'student'` :
    audience === 'trainers' ? `role = 'trainer'` :
    `role IN ('student','trainer')` // 'all' excludes admins from their own broadcast noise

  const { rows } = await query<{ id: string }>(`SELECT id FROM users WHERE ${roleFilter}`)
  await Promise.all(rows.map(u => notifyUser(u.id, title, body, type, link)))
}
