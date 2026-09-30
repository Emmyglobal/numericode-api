import { query } from '../db/pool'
import { isUuid } from './objectAccess'

// ─────────────────────────────────────────────────────────────────────────────
// Premium course entitlement — the single server-side source of truth.
//
// A course is PREMIUM when `courses.access_level = 'premium'`. Premium content
// unlocks with EITHER
//   • a VERIFIED payment for that exact course, or
//   • an ACTIVE, unexpired site-wide subscription,
// and only while the course still has `premium_enabled = true`.
//
// This is the predicate the application already used inline in
//   courses.getCourseAccess, dashboard.getMyCourse / getMyCourses /
//   getAssignments / getLiveClasses / getOverview, and resources.getResources —
// lifted into one function so the gate cannot drift between endpoints. Payment
// states that are NOT 'verified' (pending, failed, abandoned, refunded,
// disputed) grant nothing, so a refund or chargeback revokes access.
//
// Nothing here reads the request body or any client-supplied "paid"/"premium"
// flag: the caller id comes from the verified JWT and the course id is resolved
// from the protected resource (lesson → module → course, assignment → course,
// quiz → course) by the caller.
// ─────────────────────────────────────────────────────────────────────────────

export type EntitlementSource = 'payment' | 'subscription'

export type CourseEntitlement =
  /** The course does not exist (or the id was malformed). */
  | { status: 'missing' }
  /** Non-premium course: never gated on entitlement. */
  | { status: 'free'; courseId: string; accessLevel: string }
  /** Premium course the caller is entitled to. */
  | { status: 'entitled'; courseId: string; accessLevel: string; entitledBy: EntitlementSource }
  /** Premium course the caller has no live entitlement for. */
  | { status: 'unentitled'; courseId: string; accessLevel: string }
  /** Premium course with premium access switched off — nobody gets in. */
  | { status: 'premium-disabled'; courseId: string; accessLevel: string; entitledBy: EntitlementSource | null }

export async function resolveCourseEntitlement(
  userId: string,
  courseId: unknown
): Promise<CourseEntitlement> {
  // A malformed id must never reach Postgres as a UUID comparison (22P02 → 500):
  // it is reported exactly like a course that does not exist.
  if (!isUuid(courseId)) return { status: 'missing' }

  const { rows } = await query<{
    access_level: string; premium_enabled: boolean; entitled_by: EntitlementSource | null
  }>(
    `SELECT c.access_level, c.premium_enabled,
       CASE
         WHEN EXISTS (SELECT 1 FROM payments p
                       WHERE p.user_id = $1 AND p.course_id = c.id AND p.status = 'verified')
           THEN 'payment'
         WHEN EXISTS (SELECT 1 FROM subscriptions s
                       WHERE s.user_id = $1 AND s.status = 'active' AND s.ends_at > NOW())
           THEN 'subscription'
         ELSE NULL
       END AS entitled_by
       FROM courses c
      WHERE c.id = $2`,
    [userId, courseId]
  )

  const row = rows[0]
  if (!row) return { status: 'missing' }
  if (row.access_level !== 'premium') {
    return { status: 'free', courseId, accessLevel: row.access_level }
  }
  if (!row.premium_enabled) {
    return { status: 'premium-disabled', courseId, accessLevel: row.access_level, entitledBy: row.entitled_by }
  }
  return row.entitled_by
    ? { status: 'entitled', courseId, accessLevel: row.access_level, entitledBy: row.entitled_by }
    : { status: 'unentitled', courseId, accessLevel: row.access_level }
}

/**
 * May this caller receive the course's protected content (lesson content,
 * lesson resources, assignment questions, quiz questions) or mutate its
 * learning state? Free courses keep their existing rules; premium courses need
 * a live entitlement.
 */
export function entitlementAllowsContent(entitlement: CourseEntitlement): boolean {
  return entitlement.status === 'free' || entitlement.status === 'entitled'
}

/** Resolve the course that owns a lesson (lesson → module → course). */
export async function courseIdForLesson(lessonId: unknown): Promise<string | null> {
  if (!isUuid(lessonId)) return null
  const { rows } = await query<{ course_id: string }>(
    `SELECT m.course_id FROM lessons l
       JOIN modules m ON m.id = l.module_id
      WHERE l.id = $1`,
    [lessonId]
  )
  return rows[0]?.course_id ?? null
}
