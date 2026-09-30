import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { requireCourseInstructorOrAdmin } from '../middleware/authorization'
import {
  trackLearningActivity,
  getLearningAnalytics,
  getStudentEngagementReport,
  getDripContentSchedule,
  createDripContent,
  getCoursePrerequisites,
  addCoursePrerequisite,
} from '../controllers/analytics.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Course-managed routes: the route param is the authorization anchor, and the
// guard resolves courses.instructor_id before the controller runs.
const ownsCourse = requireCourseInstructorOrAdmin('courseId')

// Learning Analytics
// POST /analytics/track is self-scoped (it records the caller's own activity),
// but the controller verifies the caller actually belongs to the course.
router.post('/analytics/track', trackLearningActivity)
// Own learning data only (the controller filters on the caller's user id).
router.get('/analytics/courses/:courseId', getLearningAnalytics)
// Per-student engagement: names + emails of every learner in the course —
// instructor of that course, or an admin.
router.get('/analytics/courses/:courseId/engagement', ownsCourse, getStudentEngagementReport)

// Drip Content
// Students read what has been released; only the course owner schedules it.
router.get('/courses/:courseId/drip-content', getDripContentSchedule)
router.post('/courses/:courseId/drip-content', ownsCourse, createDripContent)

// Course Prerequisites
// Students read the entry requirements; only the course owner defines them.
router.get('/courses/:courseId/prerequisites', getCoursePrerequisites)
router.post('/courses/:courseId/prerequisites', ownsCourse, addCoursePrerequisite)

export default router