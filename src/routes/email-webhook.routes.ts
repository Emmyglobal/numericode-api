import { Router } from 'express'
import { resendWebhook } from '../controllers/email-webhook.controller'

// Email delivery webhooks (Resend receiving side).
//  - POST /webhooks/resend → NO auth middleware: authenticated by Svix
//    signature (svix-id / svix-timestamp / svix-signature over the raw body —
//    see controllers/email-webhook.controller.ts).
// Configure the URL https://<your-api-domain>/api/webhooks/resend in the
// Resend dashboard (https://resend.com/webhooks) with events email.sent,
// email.delivered, email.delivery_delayed, email.bounced, email.complained
// (+ email.opened / email.clicked optional).
const router = Router()

router.post('/webhooks/resend', resendWebhook)

export default router
