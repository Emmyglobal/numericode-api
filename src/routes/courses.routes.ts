import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { listCourses, getCourseById, listAvailableTeachers, requestCourse, enrollWithTeacher } from '../controllers/courses.controller'

const router = Router()

router.get('/', listCourses)
router.get('/teachers', listAvailableTeachers)
router.post('/:id/request', requireAuth, requireRole('student' as const), requestCourse)
router.get('/:id', getCourseById)
router.post('/enroll-with-teacher', requireAuth, requireRole('student' as const), enrollWithTeacher)

export default router
