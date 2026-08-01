import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  createModule, updateModule, deleteModule,
  createLesson, updateLesson, deleteLesson,
  createQuiz, updateQuiz, deleteQuiz,
  createAssignment, updateAssignment, deleteAssignment,
  getLessons, getCourseBuilderContent,
  getQuizDetail, getAssignmentDetail
} from '../controllers/course-content.controller'

const router = Router()
const guard = [requireAuth, requireRole('trainer' as const)]

router.get('/courses/:courseId/builder', ...guard, getCourseBuilderContent)
router.post('/courses/:courseId/modules', ...guard, createModule)
router.put('/modules/:moduleId', ...guard, updateModule)
router.delete('/modules/:moduleId', ...guard, deleteModule)
router.post('/modules/:moduleId/lessons', ...guard, createLesson)
router.put('/lessons/:lessonId', ...guard, updateLesson)
router.delete('/lessons/:lessonId', ...guard, deleteLesson)
router.post('/lessons/:lessonId/quiz', ...guard, createQuiz)
router.put('/quizzes/:quizId', ...guard, updateQuiz)
router.delete('/quizzes/:quizId', ...guard, deleteQuiz)
router.post('/lessons/:lessonId/assignment', ...guard, createAssignment)
router.put('/assignments/:assignmentId', ...guard, updateAssignment)
router.delete('/assignments/:assignmentId', ...guard, deleteAssignment)
router.get('/lessons/:lessonId', ...guard, getLessons)
router.get('/quizzes/:quizId', ...guard, getQuizDetail)
router.get('/assignments/:assignmentId', ...guard, getAssignmentDetail)

export default router
