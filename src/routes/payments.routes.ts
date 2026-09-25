import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { initiateCoursePayment, getPaymentStatus, paystackWebhook, flutterwaveWebhook } from '../controllers/payments.controller'

// Payments (Phase 16 — premium-course checkout; Phase 21 — provider-neutral).
// The ACTIVE provider (PAYMENT_PROVIDER) is used for new checkouts; each payment
// row records its provider and is always verified through it.
//  - /initiate      → authenticated students only (server-authoritative pricing)
//  - /:reference    → payment status; owner or admin (backend-verified state)
//  - /webhook/paystack    → NO auth middleware: authenticated by x-paystack-signature
//    (HMAC-SHA512 over the raw body — see services/paystack.service.ts)
//  - /webhook/flutterwave → NO auth middleware: authenticated by verif-hash
//    (compared to FLW_SECRET_HASH — see services/flutterwave.service.ts)
const router = Router()

router.post('/initiate', requireAuth, requireRole('student' as const), initiateCoursePayment)
router.get('/:reference', requireAuth, getPaymentStatus)
router.post('/webhook/paystack', paystackWebhook)
router.post('/webhook/flutterwave', flutterwaveWebhook)

export default router