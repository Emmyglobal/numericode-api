import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  listQuizzes, getQuiz, createQuiz, updateQuiz, deleteQuiz,
  addQuestion, updateQuestion, deleteQuestion,
  startQuizAttempt, submitQuizAttempt, getQuizAttempts
} from '../controllers/quizzes.controller'

const router = Router()
const guard = [requireAuth]

// Quiz CRUD
router.get('/courses/:courseId/quizzes', ...guard, listQuizzes)
router.get('/quizzes/:id', ...guard, getQuiz)
router.post('/quizzes', ...guard, requireRole('trainer' as const), createQuiz)
router.put('/quizzes/:id', ...guard, requireRole('trainer' as const), updateQuiz)
router.delete('/quizzes/:id', ...guard, requireRole('trainer' as const), deleteQuiz)

// Quiz Questions
router.post('/quizzes/:quizId/questions', ...guard, requireRole('trainer' as const), addQuestion)
router.put('/quizzes/:quizId/questions/:questionId', ...guard, requireRole('trainer' as const), updateQuestion)
router.delete('/quizzes/:quizId/questions/:questionId', ...guard, requireRole('trainer' as const), deleteQuestion)

// Quiz Attempts (students)
router.post('/quizzes/:quizId/start', ...guard, requireRole('student' as const), startQuizAttempt)
router.post('/quizzes/:quizId/submit', ...guard, requireRole('student' as const), submitQuizAttempt)
router.get('/quizzes/:quizId/attempts', ...guard, getQuizAttempts)

export default router