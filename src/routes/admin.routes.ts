import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  getStats, getUsers, getTrainers, updateUser,
  getCourses, createCourse, updateCourseStatus, deleteCourse,
  getAnnouncements, createAnnouncement, getCourseRequests, reviewCourseRequest,
  updateCourseAccess, getCourseCompletionSettings, updateCourseCompletionSettings,
  reassignStudent, reassignCourse, suspendUser, deleteUser,
  getPayments, approvePayment,
} from '../controllers/admin.controller'

const router = Router()
const guard = [requireAuth, requireRole('admin' as const)]

router.get('/stats',                ...guard, getStats)
router.get('/users',                ...guard, getUsers)
router.get('/trainers',             ...guard, getTrainers)
router.patch('/users/:id',          ...guard, updateUser)
router.patch('/users/:id/suspend',  ...guard, suspendUser)
router.delete('/users/:id',         ...guard, deleteUser)
router.get('/courses',              ...guard, getCourses)
router.post('/courses',             ...guard, createCourse)
router.patch('/courses/:id/status', ...guard, updateCourseStatus)
router.delete('/courses/:id',        ...guard, deleteCourse)
router.patch('/courses/:id/access', ...guard, updateCourseAccess)
router.get('/courses/:id/completion-settings', ...guard, getCourseCompletionSettings)
router.put('/courses/:id/completion-settings', ...guard, updateCourseCompletionSettings)
router.get('/course-requests',       ...guard, getCourseRequests)
router.patch('/course-requests/:id', ...guard, reviewCourseRequest)
router.get('/announcements',        ...guard, getAnnouncements)
router.post('/announcements',       ...guard, createAnnouncement)
router.post('/reassign-student',    ...guard, reassignStudent)
router.post('/reassign-course',     ...guard, reassignCourse)
router.get('/payments',             ...guard, getPayments)
router.post('/payments/:id/approve', ...guard, approvePayment)

export default router
