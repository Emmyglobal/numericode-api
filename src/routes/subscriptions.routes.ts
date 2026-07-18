import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { createCheckoutIntent, getMySubscription, grantSubscription } from '../controllers/subscriptions.controller'

const router = Router()
router.get('/me', requireAuth, requireRole('student'), getMySubscription)
router.post('/checkout-intents', requireAuth, requireRole('student'), createCheckoutIntent)
router.post('/users/:userId', requireAuth, requireRole('admin'), grantSubscription)
export default router
