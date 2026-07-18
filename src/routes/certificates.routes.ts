import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { generateCertificate, getMyCertificates, getCertificateById, verifyCertificate } from '../controllers/certificates.controller'

const router = Router()
router.get('/me', requireAuth, requireRole('student'), getMyCertificates)
router.post('/courses/:courseId/generate', requireAuth, requireRole('student'), generateCertificate)
router.get('/:id', requireAuth, requireRole('student'), getCertificateById)
router.get('/verify/:code', verifyCertificate)
export default router