import { Router } from 'express'
import { authenticate } from '../middleware/auth'
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

// Learning Analytics
router.post('/analytics/track', trackLearningActivity)
router.get('/analytics/courses/:courseId', getLearningAnalytics)
router.get('/analytics/courses/:courseId/engagement', getStudentEngagementReport)

// Drip Content
router.get('/courses/:courseId/drip-content', getDripContentSchedule)
router.post('/courses/:courseId/drip-content', createDripContent)

// Course Prerequisites
router.get('/courses/:courseId/prerequisites', getCoursePrerequisites)
router.post('/courses/:courseId/prerequisites', addCoursePrerequisite)

export default router