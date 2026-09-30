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

// Trainer/Admin only — AI content generation tools.
// Both roles are course authors in this app: trainers own their own courses and
// admins manage any course, and both builders expose the AI generator
// (TrainerCourseBuilderPage / AdminCourseBuilderPage). Matches the existing
// trainer-or-admin pattern in courses.routes.ts (setPrerequisiteQuiz).
const authorOnly = requireRole('trainer' as const, 'admin' as const)

router.post('/generate-lesson', requireAuth, authorOnly, generateLessonContent)
router.post('/generate-quiz', requireAuth, authorOnly, generateQuizQuestions)
router.post('/generate-assignment', requireAuth, authorOnly, generateAssignment)
router.post('/generate-note', requireAuth, authorOnly, generateNote)

export default router