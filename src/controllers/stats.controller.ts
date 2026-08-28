import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok } from '../utils/response'

/**
 * Public, aggregate-only statistics for the homepage. Counts ONLY non-sensitive
 * totals — no personal data. Uses the same source tables as the admin stats
 * (`live_classes`, `users`, `courses`), scoped to publicly visible/active rows.
 */
export async function getPublicStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const [{ rows: courses }, { rows: learners }, { rows: trainers }, { rows: liveClasses }] = await Promise.all([
      query<{ count: string }>(`SELECT COUNT(*) FROM courses WHERE status = 'published'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE role = 'student' AND status = 'active'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM users WHERE role = 'trainer' AND status = 'active'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM live_classes`),
    ])
    return ok(res, {
      publishedCourses: Number(courses[0].count),
      learners: Number(learners[0].count),
      registeredTrainers: Number(trainers[0].count),
      liveClasses: Number(liveClasses[0].count),
    })
  } catch (err) { next(err) }
}