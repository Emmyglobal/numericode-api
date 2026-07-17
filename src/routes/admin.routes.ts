import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  getStats, getUsers, getTrainers, updateUser,
  getCourses, createCourse, updateCourseStatus,
  getAnnouncements, createAnnouncement, getCourseRequests, reviewCourseRequest,
} from '../controllers/admin.controller'

const router = Router()
const guard = [requireAuth, requireRole('admin' as const)]

router.get('/stats',                ...guard, getStats)
router.get('/users',                ...guard, getUsers)
router.get('/trainers',             ...guard, getTrainers)
router.patch('/users/:id',          ...guard, updateUser)
router.get('/courses',              ...guard, getCourses)
router.post('/courses',             ...guard, createCourse)
router.patch('/courses/:id/status', ...guard, updateCourseStatus)
router.get('/course-requests',       ...guard, getCourseRequests)
router.patch('/course-requests/:id', ...guard, reviewCourseRequest)
router.get('/announcements',        ...guard, getAnnouncements)
router.post('/announcements',       ...guard, createAnnouncement)

export default router
