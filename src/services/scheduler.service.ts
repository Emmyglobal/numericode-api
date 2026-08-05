import { query } from '../db/pool'
import { notifyUser } from '../utils/notify'

interface SessionRow {
  id: string
  course_id: string
  title: string
  status: string
  session_type: string
  student_ids: string[]
  start_time: Date | null
  end_time: Date | null
}

const ALERT_MINUTES_BEFORE = 15

export async function processSessionAlerts() {
  try {
    const now = new Date()
    const alertWindow = new Date(now.getTime() + ALERT_MINUTES_BEFORE * 60000)

    // Find sessions starting within the alert window
    const { rows: upcoming } = await query<SessionRow>(
      `SELECT lc.* FROM live_classes lc
       WHERE lc.status = 'scheduled'
         AND lc.start_time IS NOT NULL
         AND lc.start_time <= $1
         AND lc.start_time > $2
         AND NOT EXISTS (
           SELECT 1 FROM notifications n
           WHERE n.user_id IN (SELECT e.user_id FROM enrollments e WHERE e.course_id = lc.course_id)
             AND n.link = '/dashboard/live-classes'
             AND n.title = 'Class Starting Soon'
             AND n.created_at > NOW() - INTERVAL '30 minutes'
         )`,
      [alertWindow.toISOString(), now.toISOString()]
    )

    for (const session of upcoming) {
      const studentQuery = session.session_type === 'individual'
        ? `SELECT id AS user_id FROM users WHERE id = ANY($2::uuid[]) AND role = 'student'`
        : `SELECT e.user_id FROM enrollments e WHERE e.course_id = $1`
      const params = session.session_type === 'individual'
        ? [session.course_id, session.student_ids]
        : [session.course_id]
      const { rows: students } = await query<{ user_id: string }>(studentQuery, params)

      const startStr = session.start_time
        ? new Date(session.start_time).toLocaleString('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true })
        : 'soon'

      await Promise.all(students.map(s =>
        notifyUser(s.user_id, 'Class Starting Soon',
          `"${session.title}" starts at ${startStr}. Join now!`,
          'announcement', '/dashboard/live-classes')
      ))
    }
  } catch (error) {
    console.error('Session alert processing failed:', error)
  }
}

export async function processExpiredSessions() {
  try {
    const now = new Date()
    const { rows: expired } = await query<SessionRow>(
      `UPDATE live_classes
       SET status = 'expired'
       WHERE status = 'scheduled'
         AND end_time IS NOT NULL
         AND end_time < $1
       RETURNING *`,
      [now.toISOString()]
    )

    for (const session of expired) {
      const studentQuery = session.session_type === 'individual'
        ? `SELECT id AS user_id FROM users WHERE id = ANY($2::uuid[]) AND role = 'student'`
        : `SELECT e.user_id FROM enrollments e WHERE e.course_id = $1`
      const params = session.session_type === 'individual'
        ? [session.course_id, session.student_ids]
        : [session.course_id]
      const { rows: students } = await query<{ user_id: string }>(studentQuery, params)

      await Promise.all(students.map(s =>
        notifyUser(s.user_id, 'Live Class Ended',
          `"${session.title}" has ended. You can review the recording or continue learning.`,
          'announcement', '/dashboard/live-classes')
      ))
    }
  } catch (error) {
    console.error('Session expiry processing failed:', error)
  }
}