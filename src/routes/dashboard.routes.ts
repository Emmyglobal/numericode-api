import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  getOverview, getMyCourses, getAssignments, getAnnouncements,
  getResources, getLiveClasses, getProfile, updateProfile, getMyCourse,
} from '../controllers/dashboard.controller'

const router = Router()

// Auth applied per-route (not via router.use) so unmatched paths correctly
// fall through to the global 404 handler instead of being intercepted here.
const guard = [requireAuth, requireRole('student' as const)]

router.get('/dashboard',         ...guard, getOverview)
router.get('/dashboard/courses', ...guard, getMyCourses)
router.get('/dashboard/courses/:id', ...guard, getMyCourse)
router.get('/assignments',       ...guard, getAssignments)
router.get('/announcements',     ...guard, getAnnouncements)
router.get('/resources',         ...guard, getResources)
router.get('/live-classes',      ...guard, getLiveClasses)
router.get('/profile',           ...guard, getProfile)
router.put('/profile',           ...guard, updateProfile)

export default router
