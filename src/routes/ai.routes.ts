import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  studyGuide,
  generateLessonContent,
  generateQuizQuestions,
  generateAssignment,
  generateNote,
  aiHealth,
} from '../controllers/ai.controller'

const router = Router()

// Public — no auth required (study assistant is available to everyone)
router.post('/study-guide', studyGuide)

// Health check — reports whether AI is configured (no secrets exposed)
router.get('/health', aiHealth)

// Trainer/Admin only — AI content generation tools
router.post('/generate-lesson', requireAuth, requireRole('trainer' as const), generateLessonContent)
router.post('/generate-quiz', requireAuth, requireRole('trainer' as const), generateQuizQuestions)
router.post('/generate-assignment', requireAuth, requireRole('trainer' as const), generateAssignment)
router.post('/generate-note', requireAuth, requireRole('trainer' as const), generateNote)

export default router