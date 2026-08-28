import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { listCourses, getCourseById, listAvailableTeachers, getTrainerProfile, requestCourse, getAvailableCoursesForEnrollment, enrollInCourses, getPrerequisiteQuiz, setPrerequisiteQuiz } from '../controllers/courses.controller'

const router = Router()

router.get('/', listCourses)
router.get('/teachers', listAvailableTeachers)
router.get('/teachers/:id', getTrainerProfile)
router.get('/available-for-enrollment', requireAuth, requireRole('student' as const), getAvailableCoursesForEnrollment)
router.post('/enroll', requireAuth, requireRole('student' as const), enrollInCourses)
router.post('/:id/request', requireAuth, requireRole('student' as const), requestCourse)
router.get('/:id/prerequisite-quiz', requireAuth, getPrerequisiteQuiz)
router.put('/:id/prerequisite-quiz', requireAuth, requireRole('trainer' as const, 'admin' as const), setPrerequisiteQuiz)
router.get('/:id', getCourseById)

export default router
