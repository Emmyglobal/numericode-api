import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  submitTestimonial,
  listPublicTestimonials,
  listPendingTestimonials,
  moderateTestimonial,
} from '../controllers/testimonials.controller'

// Mounted in app.ts at BOTH public (`/api/testimonials`) and admin
// (`/api/admin/testimonials`) prefixes. Public endpoints are unauthenticated;
// the pending/moderation endpoints behind requireAuth+admin are safe under
// either prefix because the auth guard runs before the handler.
const router = Router()

router.get('/', listPublicTestimonials)
router.post('/', submitTestimonial)
router.get('/admin/pending', requireAuth, requireRole('admin' as const), listPendingTestimonials)
router.patch('/admin/:id', requireAuth, requireRole('admin' as const), moderateTestimonial)

export default router