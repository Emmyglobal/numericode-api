import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { initiateCoursePayment, getPaymentStatus, paystackWebhook } from '../controllers/payments.controller'

// Payments (Phase 16 — Paystack premium-course checkout).
//  - /initiate      → authenticated students only (server-authoritative pricing)
//  - /:reference    → payment status; owner or admin (backend-verified state)
//  - /webhook/paystack → NO auth middleware: authenticated by x-paystack-signature
//    (HMAC-SHA512 over the raw body — see services/paystack.service.ts)
const router = Router()

router.post('/initiate', requireAuth, requireRole('student' as const), initiateCoursePayment)
router.get('/:reference', requireAuth, getPaymentStatus)
router.post('/webhook/paystack', paystackWebhook)

export default router