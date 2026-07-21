import { Router } from 'express'
import { login, register, forgotPassword, resetPassword, changePassword, activateAccount } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/activate-account', activateAccount)
router.post('/change-password', authenticate, changePassword)

export default router