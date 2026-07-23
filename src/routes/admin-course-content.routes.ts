import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { createModule, createLesson, createQuiz, createAssignment, getLessons, getCourseBuilderContent } from '../controllers/course-content.controller'

const router = Router()
const guard = [requireAuth, requireRole('admin' as const)]

router.get('/courses/:courseId/builder', ...guard, getCourseBuilderContent)
router.post('/courses/:courseId/modules', ...guard, createModule)
router.post('/modules/:moduleId/lessons', ...guard, createLesson)
router.post('/lessons/:lessonId/quiz', ...guard, createQuiz)
router.post('/lessons/:lessonId/assignment', ...guard, createAssignment)
router.get('/lessons/:lessonId', ...guard, getLessons)

export default router