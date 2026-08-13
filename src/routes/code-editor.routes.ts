import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  getStudentCodeEditor,
  saveStudentCodeEditor,
  getTrainerCodeEditor,
  saveTrainerCodeEditor,
  getTrainerSharedCodeEditorForStudent,
  updateTrainerCodeEditorState,
} from '../controllers/code-editor.controller'

const router = Router()

// Student routes
router.get('/lessons/:lessonId', requireAuth, requireRole('student'), getStudentCodeEditor)
router.put('/lessons/:lessonId', requireAuth, requireRole('student'), saveStudentCodeEditor)
router.get('/lessons/:lessonId/live', requireAuth, requireRole('student'), getTrainerSharedCodeEditorForStudent)

// Trainer routes
router.get('/trainer/lessons/:lessonId', requireAuth, requireRole('trainer'), getTrainerCodeEditor)
router.put('/trainer/lessons/:lessonId', requireAuth, requireRole('trainer'), saveTrainerCodeEditor)
router.patch('/trainer/lessons/:lessonId', requireAuth, requireRole('trainer'), updateTrainerCodeEditorState)

export default router