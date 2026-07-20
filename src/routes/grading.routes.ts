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

// Grading Rubrics (trainer only)
router.get('/assignments/:assignmentId/rubrics', ...guard, requireRole('trainer' as const), listGradingRubrics)
router.post('/assignments/:assignmentId/rubrics', ...guard, requireRole('trainer' as const), createGradingRubric)
router.put('/rubrics/:rubricId', ...guard, requireRole('trainer' as const), updateGradingRubric)
router.delete('/rubrics/:rubricId', ...guard, requireRole('trainer' as const), deleteGradingRubric)

// Rubric Scores (trainer only)
router.post('/submissions/:submissionId/rubric-scores', ...guard, requireRole('trainer' as const), submitRubricScores)
router.get('/submissions/:submissionId/rubric-scores', ...guard, getRubricScores)

// Grade Categories (trainer only)
router.get('/courses/:courseId/grade-categories', ...guard, requireRole('trainer' as const), listGradeCategories)
router.post('/courses/:courseId/grade-categories', ...guard, requireRole('trainer' as const), createGradeCategory)
router.put('/grade-categories/:categoryId', ...guard, requireRole('trainer' as const), updateGradeCategory)
router.delete('/grade-categories/:categoryId', ...guard, requireRole('trainer' as const), deleteGradeCategory)

// Student Grade Report
router.get('/courses/:courseId/grade-report', ...guard, getStudentGradeReport)

// Grade Export (trainer only)
router.get('/courses/:courseId/export/csv', ...guard, requireRole('trainer' as const), exportGradesCSV)
router.get('/courses/:courseId/export/pdf', ...guard, requireRole('trainer' as const), exportGradesPDF)

// Grade Visibility (trainer only)
router.put('/courses/:courseId/grade-visibility', ...guard, requireRole('trainer' as const), updateGradeVisibility)

export default router
