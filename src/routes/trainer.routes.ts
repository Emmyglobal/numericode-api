import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  getStats, getTrainerCourses, getTrainerStudents,
  getTrainerSessions, getTrainerAssignments,
  createTrainerCourse, updateTrainerCourse, updateTrainerCourseStatus,
  getTrainerProfile, updateTrainerProfile,
  getTrainerLessons,
} from '../controllers/trainer.controller'

const router = Router()
const guard = [requireAuth, requireRole('trainer' as const)]

router.get('/stats',              ...guard, getStats)
router.get('/courses',            ...guard, getTrainerCourses)
router.post('/courses',           ...guard, createTrainerCourse)
router.put('/courses/:id',        ...guard, updateTrainerCourse)
router.patch('/courses/:id/status', ...guard, updateTrainerCourseStatus)
router.get('/students',           ...guard, getTrainerStudents)
router.get('/sessions',           ...guard, getTrainerSessions)
router.get('/assignments',        ...guard, getTrainerAssignments)
router.get('/lessons',            ...guard, getTrainerLessons)
router.get('/profile',            ...guard, getTrainerProfile)
router.put('/profile',            ...guard, updateTrainerProfile)

export default router
