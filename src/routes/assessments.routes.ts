import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { getAssignmentSubmissions, getStudentGradeBook, getTrainerGradeBook, gradeSubmission, submitAssignment } from '../controllers/assessments.controller'

const router = Router()
router.post('/assignments/:assignmentId/submission', requireAuth, requireRole('student'), submitAssignment)
router.get('/gradebook', requireAuth, requireRole('student'), getStudentGradeBook)
router.get('/trainer/assignments/:assignmentId/submissions', requireAuth, requireRole('trainer'), getAssignmentSubmissions)
router.patch('/trainer/submissions/:submissionId', requireAuth, requireRole('trainer'), gradeSubmission)
router.get('/trainer/courses/:courseId/gradebook', requireAuth, requireRole('trainer'), getTrainerGradeBook)
export default router
