import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  listGradingRubrics, createGradingRubric, updateGradingRubric, deleteGradingRubric,
  submitRubricScores, getRubricScores,
  listGradeCategories, createGradeCategory, updateGradeCategory, deleteGradeCategory,
  getStudentGradeReport, exportGradesCSV, exportGradesPDF, updateGradeVisibility
} from '../controllers/grading.controller'

const router = Router()
const guard = [requireAuth]

// Role checks here prove the caller is *a* trainer; they do not prove the
// trainer owns the course/assignment/rubric being touched. Object-level
// ownership is resolved from the database inside each controller via
// src/utils/objectAccess.ts (resource → owning course → instructor_id).
//
// Grading is trainer-managed everywhere in this app (there is no admin
// mount for it), so the role list is left exactly as it was.

// Grading Rubrics (trainer only + owner of the assignment's course)
router.get('/assignments/:assignmentId/rubrics', ...guard, requireRole('trainer' as const), listGradingRubrics)
router.post('/assignments/:assignmentId/rubrics', ...guard, requireRole('trainer' as const), createGradingRubric)
router.put('/rubrics/:rubricId', ...guard, requireRole('trainer' as const), updateGradingRubric)
router.delete('/rubrics/:rubricId', ...guard, requireRole('trainer' as const), deleteGradingRubric)

// Rubric Scores — writing is trainer-only and scoped to the submission's
// course; reading is open to any role because a student must see their own
// score, so the controller decides (owner of submission / its instructor / admin).
router.post('/submissions/:submissionId/rubric-scores', ...guard, requireRole('trainer' as const), submitRubricScores)
router.get('/submissions/:submissionId/rubric-scores', ...guard, getRubricScores)

// Grade Categories (trainer only + owner of the course)
router.get('/courses/:courseId/grade-categories', ...guard, requireRole('trainer' as const), listGradeCategories)
router.post('/courses/:courseId/grade-categories', ...guard, requireRole('trainer' as const), createGradeCategory)
router.put('/grade-categories/:categoryId', ...guard, requireRole('trainer' as const), updateGradeCategory)
router.delete('/grade-categories/:categoryId', ...guard, requireRole('trainer' as const), deleteGradeCategory)

// Student Grade Report — the controller returns the caller's own report for a
// learner, and the full class report only for the course owner.
router.get('/courses/:courseId/grade-report', ...guard, getStudentGradeReport)

// Grade Export (trainer only) — these two already resolve courses.instructor_id
// server-side, so they stay as-is.
router.get('/courses/:courseId/export/csv', ...guard, requireRole('trainer' as const), exportGradesCSV)
router.get('/courses/:courseId/export/pdf', ...guard, requireRole('trainer' as const), exportGradesPDF)

// Grade Visibility (trainer only + owner of the course)
router.put('/courses/:courseId/grade-visibility', ...guard, requireRole('trainer' as const), updateGradeVisibility)

export default router
