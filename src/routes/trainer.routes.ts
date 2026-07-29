import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  getStats, getTrainerCourses, getTrainerStudents,
  getTrainerSessions, getTrainerAssignments,
  createTrainerCourse, updateTrainerCourse, updateTrainerCourseStatus,
  getTrainerProfile, updateTrainerProfile,
  getTrainerLessons,
} from '../controllers/trainer.controller'
import { getAnnouncements } from '../controllers/dashboard.controller'
import {
  getTrainerNotes, createTrainerNote, updateTrainerNote, deleteTrainerNote, getCourseNotes,
  createTrainerSession, updateTrainerSession, deleteTrainerSession,
} from '../controllers/notes.controller'

const router = Router()
const guard = [requireAuth, requireRole('trainer' as const)]

router.get('/stats',              ...guard, getStats)
router.get('/courses',            ...guard, getTrainerCourses)
router.post('/courses',           ...guard, createTrainerCourse)
router.put('/courses/:id',        ...guard, updateTrainerCourse)
router.patch('/courses/:id/status', ...guard, updateTrainerCourseStatus)
router.get('/students',           ...guard, getTrainerStudents)
router.get('/sessions',           ...guard, getTrainerSessions)
router.post('/sessions',          ...guard, createTrainerSession)
router.put('/sessions/:id',       ...guard, updateTrainerSession)
router.delete('/sessions/:id',    ...guard, deleteTrainerSession)
router.get('/assignments',        ...guard, getTrainerAssignments)
router.get('/lessons',            ...guard, getTrainerLessons)
router.get('/notes',              ...guard, getTrainerNotes)
router.post('/notes',             ...guard, createTrainerNote)
router.put('/notes/:id',          ...guard, updateTrainerNote)
router.delete('/notes/:id',       ...guard, deleteTrainerNote)
router.get('/notes/courses/:courseId', ...guard, getCourseNotes)
router.get('/announcements',      ...guard, getAnnouncements)
router.get('/profile',            ...guard, getTrainerProfile)
router.put('/profile',            ...guard, updateTrainerProfile)

export default router
