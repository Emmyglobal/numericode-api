import type { Request, Response, NextFunction } from 'express'
import { accessToCourse } from '../utils/objectAccess'
import { forbidden, notFound, unauthorized } from '../utils/response'

/**
 * Route-level guard for course-scoped routes: resolves the course named in the
 * route param, asks the database who owns it, and requires the caller to be
 * that instructor (or an admin, matching the app's existing admin model).
 *
 * `requireRole('trainer')` alone is not enough — it proves a role, not
 * ownership of *this* course. This guard closes that gap, and it runs before
 * any controller reads or mutates data.
 *
 * A non-existent or malformed course id is a 404, so a probe for someone
 * else's course id and a probe for a course that does not exist look identical.
 */
export function requireCourseInstructorOrAdmin(param = 'courseId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return unauthorized(res, 'Authentication required')
      const access = await accessToCourse(req, req.params[param])
      if (access === 'missing') return notFound(res, 'Course not found')
      if (access === 'forbidden') {
        return forbidden(res, 'You can only manage resources in your own courses')
      }
      return next()
    } catch (err) {
      return next(err)
    }
  }
}
