import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { listCourses, getCourseById, listAvailableTeachers, requestCourse } from '../controllers/courses.controller'

const router = Router()

router.get('/', listCourses)
router.get('/teachers', listAvailableTeachers)
router.post('/:id/request', requireAuth, requireRole('student' as const), requestCourse)
router.get('/:id', getCourseById)

export default router
