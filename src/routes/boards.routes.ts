import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { getStudentBoard, getTrainerBoard, saveStudentBoard, saveTrainerBoard, updateTrainerBoardState } from '../controllers/boards.controller'

const router = Router()
router.get('/lessons/:lessonId', requireAuth, requireRole('student'), getStudentBoard)
router.put('/lessons/:lessonId', requireAuth, requireRole('student'), saveStudentBoard)
router.get('/trainer/lessons/:lessonId', requireAuth, requireRole('trainer'), getTrainerBoard)
router.put('/trainer/lessons/:lessonId', requireAuth, requireRole('trainer'), saveTrainerBoard)
router.patch('/trainer/lessons/:lessonId', requireAuth, requireRole('trainer'), updateTrainerBoardState)
export default router
