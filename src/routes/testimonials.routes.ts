import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  listPublicTestimonials,
  submitTestimonial,
  listAllTestimonials,
  moderateTestimonial,
} from '../controllers/testimonials.controller'

const router = Router()

// Public routes
router.get('/', listPublicTestimonials)
router.post('/', submitTestimonial)

// Admin/Trainer moderation routes
router.get('/admin/all', requireAuth, requireRole('admin', 'trainer'), listAllTestimonials)
router.patch('/admin/:id', requireAuth, requireRole('admin', 'trainer'), moderateTestimonial)

export default router
