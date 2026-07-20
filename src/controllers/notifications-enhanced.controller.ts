import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound } from '../utils/response'
import { notifyUser } from '../utils/notify'
import { sendEmail } from '../utils/mailer'

interface NotificationPrefRow {
  id: string; user_id: string; email_enabled: boolean; push_enabled: boolean
  digest_frequency: string; created_at: Date; updated_at: Date
}

// ─── Notification Preferences ────────────────────────────────────────────────

export async function getNotificationPreferences(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { rows: [prefs] } = await query<NotificationPrefRow>(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [userId]
    )
    
    if (!prefs) {
      // Create default preferences
      const { rows: [newPrefs] } = await query<NotificationPrefRow>(
        `INSERT INTO notification_preferences (user_id) VALUES ($1) RETURNING *`,
        [userId]
      )
      return ok(res, {
        emailEnabled: newPrefs.email_enabled,
        pushEnabled: newPrefs.push_enabled,
        digestFrequency: newPrefs.digest_frequency,
      })
    }
    
    return ok(res, {
      emailEnabled: prefs.email_enabled,
      pushEnabled: prefs.push_enabled,
      digestFrequency: prefs.digest_frequency,
    })
  } catch (err) { next(err) }
}

export async function updateNotificationPreferences(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { emailEnabled, pushEnabled, digestFrequency } = req.body as {
      emailEnabled?: boolean; pushEnabled?: boolean; digestFrequency?: string
    }
    
    const { rows: [prefs] } = await query<NotificationPrefRow>(
      `UPDATE notification_preferences SET
        email_enabled = COALESCE($1, email_enabled),
        push_enabled = COALESCE($2, push_enabled),
        digest_frequency = COALESCE($3, digest_frequency),
        updated_at = NOW()
       WHERE user_id = $4 RETURNING *`,
      [emailEnabled, pushEnabled, digestFrequency, userId]
    )
    
    if (!prefs) {
      // Create if doesn't exist
      const { rows: [newPrefs] } = await query<NotificationPrefRow>(
        `INSERT INTO notification_preferences (user_id, email_enabled, push_enabled, digest_frequency)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [userId, emailEnabled ?? true, pushEnabled ?? false, digestFrequency ?? 'instant']
      )
      return ok(res, {
        emailEnabled: newPrefs.email_enabled,
        pushEnabled: newPrefs.push_enabled,
        digestFrequency: newPrefs.digest_frequency,
      })
    }
    
    return ok(res, {
      emailEnabled: prefs.email_enabled,
      pushEnabled: prefs.push_enabled,
      digestFrequency: prefs.digest_frequency,
    })
  } catch (err) { next(err) }
}

// ─── Notification History ────────────────────────────────────────────────────

export async function getNotificationHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { page = '1', limit = '20', unreadOnly = 'false' } = req.query
    const offset = (Number(page) - 1) * Number(limit)
    
    let whereClause = 'WHERE user_id = $1'
    const params: unknown[] = [userId]
    
    if (unreadOnly === 'true') {
      whereClause += ' AND is_read = FALSE'
    }
    
    const { rows } = await query<{
      id: string; user_id: string; title: string; body: string
      type: string; link: string | null; is_read: boolean; created_at: Date
    }>(
      `SELECT * FROM notifications ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    )
    
    const { rows: [countResult] } = await query<{ count: string }>(
      `SELECT COUNT(*) FROM notifications ${whereClause}`,
      params
    )
    
    return ok(res, {
      notifications: rows.map(n => ({
        id: n.id, userId: n.user_id, title: n.title, body: n.body,
        type: n.type, link: n.link, isRead: n.is_read,
        createdAt: n.created_at.toISOString(),
      })),
      total: Number(countResult.count),
      page: Number(page),
      limit: Number(limit),
    })
  } catch (err) { next(err) }
}

export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const { notificationId } = req.params
    const userId = req.user!.userId
    
    const { rows } = await query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [notificationId, userId]
    )
    
    if (!rows[0]) return notFound(res, 'Notification not found')
    
    return ok(res, { success: true })
  } catch (err) { next(err) }
}

export async function markAllNotificationsAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    
    await query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    )
    
    return ok(res, { success: true })
  } catch (err) { next(err) }
}

// ─── Notification Templates ──────────────────────────────────────────────────

export async function sendCustomNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, title, body, type, link } = req.body as {
      userId: string; title: string; body: string; type?: string; link?: string
    }
    
    if (!userId || !title || !body) {
      return fail(res, 'User ID, title, and body are required', 400)
    }
    
    // Check user preferences
    const { rows: [prefs] } = await query<NotificationPrefRow>(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [userId]
    )
    
    // Only send if user has email notifications enabled
    if (prefs && !prefs.email_enabled) {
      return ok(res, { message: 'Notification not sent - user has disabled email notifications' })
    }
    
    // Send notification
    await notifyUser(userId, title, body, (type as 'general' | 'announcement' | 'course' | 'trainer_approval' | 'trainer_status') || 'general', link)
    
    return ok(res, { message: 'Notification sent successfully' })
  } catch (err) { next(err) }
}

// ─── Bulk Notifications ──────────────────────────────────────────────────────

export async function sendBulkNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const { audience, title, body, type, link } = req.body as {
      audience: 'all' | 'students' | 'trainers'; title: string; body: string; type?: string; link?: string
    }
    
    if (!audience || !title || !body) {
      return fail(res, 'Audience, title, and body are required', 400)
    }
    
    // Get users by audience
    const roleMap = { all: null, students: 'student', trainers: 'trainer' }
    const role = roleMap[audience]
    
    let userIds: string[] = []
    if (role) {
      const { rows } = await query<{ id: string }>(
        'SELECT id FROM users WHERE role = $1 AND status = $2',
        [role, 'active']
      )
      userIds = rows.map(r => r.id)
    } else {
      const { rows } = await query<{ id: string }>(
        'SELECT id FROM users WHERE status = $1',
        ['active']
      )
      userIds = rows.map(r => r.id)
    }
    
    // Send notifications to all users in audience
    const sendPromises = userIds.map(userId => notifyUser(userId, title, body, (type as 'general' | 'announcement' | 'course' | 'trainer_approval' | 'trainer_status') || 'announcement', link).catch(() => {}))
    await Promise.all(sendPromises)
    
    return ok(res, { 
      message: `Notification sent to ${userIds.length} users`,
      recipientCount: userIds.length,
    })
  } catch (err) { next(err) }
}

// ─── Notification Stats ──────────────────────────────────────────────────────

export async function getNotificationStats(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    
    const { rows: [unreadCount] } = await query<{ count: string }>(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    )
    
    const { rows: [totalCount] } = await query<{ count: string }>(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1',
      [userId]
    )
    
    const { rows: [prefs] } = await query<NotificationPrefRow>(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [userId]
    )
    
    return ok(res, {
      unreadCount: Number(unreadCount.count),
      totalCount: Number(totalCount.count),
      preferences: prefs ? {
        emailEnabled: prefs.email_enabled,
        pushEnabled: prefs.push_enabled,
        digestFrequency: prefs.digest_frequency,
      } : null,
    })
  } catch (err) { next(err) }
}

// ─── Email Digests ────────────────────────────────────────────────────────────

export async function sendEmailDigest(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, frequency } = req.body as { userId: string; frequency: 'daily' | 'weekly' }
    
    if (!userId || !frequency) {
      return fail(res, 'User ID and frequency are required', 400)
    }
    
    // Get user info
    const { rows: [user] } = await query<{ email: string; name: string }>(
      'SELECT email, name FROM users WHERE id = $1',
      [userId]
    )
    
    if (!user) return notFound(res, 'User not found')
    
    // Get unread notifications
    const { rows: notifications } = await query<{ title: string; body: string; created_at: Date }>(
      `SELECT title, body, created_at FROM notifications
       WHERE user_id = $1 AND is_read = FALSE
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    )
    
    if (notifications.length === 0) {
      return ok(res, { message: 'No new notifications to send' })
    }
    
    // Send email digest
    const subject = frequency === 'daily' ? 'Daily Notification Digest' : 'Weekly Notification Digest'
    const html = `
      <h2>Hello ${user.name},</h2>
      <p>Here's your ${frequency} notification digest:</p>
      <ul>
        ${notifications.map(n => `
          <li>
            <strong>${n.title}</strong><br/>
            ${n.body}<br/>
            <small>${new Date(n.created_at).toLocaleString()}</small>
          </li>
        `).join('')}
      </ul>
      <p>Visit the platform to view all notifications.</p>
    `
    
    await sendEmail({
      to: user.email,
      subject,
      html,
    })
    
    // Mark notifications as read
    await query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    )
    
    return ok(res, { message: 'Email digest sent successfully' })
  } catch (err) { next(err) }
}

export async function processDigestQueue(req: Request, res: Response, next: NextFunction) {
  try {
    // This endpoint can be called by a cron job to send digests
    const { frequency } = req.body as { frequency: 'daily' | 'weekly' }
    
    if (!frequency) {
      return fail(res, 'Frequency is required', 400)
    }
    
    // Get all users with matching digest preference
    const { rows: users } = await query<{ user_id: string }>(
      `SELECT user_id FROM notification_preferences
       WHERE digest_frequency = $1 AND email_enabled = TRUE`,
      [frequency]
    )
    
    const results = await Promise.allSettled(
      users.map(u => 
        sendEmailDigestInternal(u.user_id, frequency).catch(() => ({}))
      )
    )
    
    const successCount = results.filter(r => r.status === 'fulfilled').length
    
    return ok(res, {
      message: `Processed ${users.length} users, ${successCount} successful`,
      totalUsers: users.length,
      successCount,
    })
  } catch (err) { next(err) }
}

async function sendEmailDigestInternal(userId: string, frequency: 'daily' | 'weekly') {
  const { rows: [user] } = await query<{ email: string; name: string }>(
    'SELECT email, name FROM users WHERE id = $1',
    [userId]
  )
  
  if (!user) return
  
  const { rows: notifications } = await query<{ title: string; body: string; created_at: Date }>(
    `SELECT title, body, created_at FROM notifications
     WHERE user_id = $1 AND is_read = FALSE
     ORDER BY created_at DESC
     LIMIT 10`,
    [userId]
  )
  
  if (notifications.length === 0) return
  
  const subject = frequency === 'daily' ? 'Daily Notification Digest' : 'Weekly Notification Digest'
  const html = `
    <h2>Hello ${user.name},</h2>
    <p>Here's your ${frequency} notification digest:</p>
    <ul>
      ${notifications.map(n => `
        <li>
          <strong>${n.title}</strong><br/>
          ${n.body}<br/>
          <small>${new Date(n.created_at).toLocaleString()}</small>
        </li>
      `).join('')}
    </ul>
    <p>Visit the platform to view all notifications.</p>
  `
  
  await sendEmail({
    to: user.email,
    subject,
    html,
  })
  
  await query(
    'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
    [userId]
  )
}

// ─── Push Notifications ───────────────────────────────────────────────────────

export async function registerPushSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId
    const { subscription } = req.body as { subscription: unknown }
    
    if (!subscription) {
      return fail(res, 'Push subscription is required', 400)
    }
    
    // Store push subscription (in production, use a proper push notification service)
    await query(
      `INSERT INTO notification_preferences (user_id, push_enabled)
       VALUES ($1, TRUE)
       ON CONFLICT (user_id) DO UPDATE SET push_enabled = TRUE, updated_at = NOW()`,
      [userId]
    )
    
    // In production, you would store the subscription in a separate table
    // and use a service like Firebase Cloud Messaging or OneSignal
    
    return ok(res, { message: 'Push subscription registered successfully' })
  } catch (err) { next(err) }
}

export async function sendPushNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, title, body, data } = req.body as {
      userId: string; title: string; body: string; data?: unknown
    }
    
    if (!userId || !title || !body) {
      return fail(res, 'User ID, title, and body are required', 400)
    }
    
    // Check if user has push notifications enabled
    const { rows: [prefs] } = await query<NotificationPrefRow>(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [userId]
    )
    
    if (!prefs || !prefs.push_enabled) {
      return ok(res, { message: 'Push notifications not enabled for this user' })
    }
    
    // In production, use a push notification service
    // For now, we'll just log it
    console.log(`Push notification to ${userId}: ${title} - ${body}`)
    
    return ok(res, { message: 'Push notification sent successfully' })
  } catch (err) { next(err) }
}

// ─── Announcement Targeting ──────────────────────────────────────────────────

export async function createTargetedAnnouncement(req: Request, res: Response, next: NextFunction) {
  try {
    const trainerId = req.user!.userId
    const { title, body, audience, courseId, targetRoles } = req.body as {
      title: string; body: string; audience: 'all' | 'course' | 'roles'
      courseId?: string; targetRoles?: ('student' | 'trainer')[]
    }
    
    if (!title || !body || !audience) {
      return fail(res, 'Title, body, and audience are required', 400)
    }
    
    // Get target users based on audience
    let userIds: string[] = []
    
    if (audience === 'all') {
      const { rows } = await query<{ id: string }>(
        'SELECT id FROM users WHERE status = $1',
        ['active']
      )
      userIds = rows.map(r => r.id)
    } else if (audience === 'course' && courseId) {
      const { rows } = await query<{ id: string }>(
        `SELECT u.id FROM users u
         JOIN enrollments e ON e.user_id = u.id
         WHERE e.course_id = $1 AND u.status = $2`,
        [courseId, 'active']
      )
      userIds = rows.map(r => r.id)
    } else if (audience === 'roles' && targetRoles) {
      const { rows } = await query<{ id: string }>(
        `SELECT id FROM users WHERE role = ANY($1::text[]) AND status = $2`,
        [targetRoles, 'active']
      )
      userIds = rows.map(r => r.id)
    }
    
    // Create notifications for all target users
    const notificationPromises = userIds.map(userId =>
      notifyUser(userId, title, body, 'announcement', '/dashboard/announcements').catch(() => {})
    )
    
    await Promise.all(notificationPromises)
    
    return ok(res, {
      message: `Announcement sent to ${userIds.length} users`,
      recipientCount: userIds.length,
    })
  } catch (err) { next(err) }
}
