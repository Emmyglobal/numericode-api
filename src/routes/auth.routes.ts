import { Router } from 'express'
import { login, register, forgotPassword, resetPassword, changePassword, verifyEmail, activateAccount, resendVerification, getGoogleAuthUrl, googleCallback, getCurrentUser } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/verify-email', verifyEmail)
router.post('/activate-account', activateAccount)
router.post('/resend-verification', resendVerification)
router.post('/change-password', authenticate, changePassword)

// Google OAuth
router.get('/google/url', getGoogleAuthUrl)
router.get('/google/callback', googleCallback)

// Current user
router.get('/me', authenticate, getCurrentUser)

export default router
