import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { getResources, createResource, deleteResource, getLessonResources } from '../controllers/resources.controller'

const router = Router()

// Trainer routes
router.get('/resources', requireAuth, requireRole('trainer' as const), getResources)
router.post('/resources', requireAuth, requireRole('trainer' as const), createResource)
router.delete('/resources/:id', requireAuth, requireRole('trainer' as const), deleteResource)

// Admin routes
router.get('/admin/resources', requireAuth, requireRole('admin' as const), getResources)
router.post('/admin/resources', requireAuth, requireRole('admin' as const), createResource)
router.delete('/admin/resources/:id', requireAuth, requireRole('admin' as const), deleteResource)

// Student-facing route (accessible to authenticated users)
router.get('/lessons/:lessonId/resources', requireAuth, getLessonResources)

export default router
