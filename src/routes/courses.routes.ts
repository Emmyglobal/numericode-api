import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { listCourses, getCourseById, listAvailableTeachers, requestCourse, getAvailableCoursesForEnrollment, enrollInCourses } from '../controllers/courses.controller'

const router = Router()

router.get('/', listCourses)
router.get('/teachers', listAvailableTeachers)
router.get('/available-for-enrollment', requireAuth, requireRole('student' as const), getAvailableCoursesForEnrollment)
router.post('/enroll', requireAuth, requireRole('student' as const), enrollInCourses)
router.post('/:id/request', requireAuth, requireRole('student' as const), requestCourse)
router.get('/:id', getCourseById)

export default router
