import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  listBadges,
  createBadge,
  updateBadge,
  deleteBadge,
  getUserBadges,
  awardBadge,
  listCertificateTemplates,
  createCertificateTemplate,
  updateCertificateTemplate,
  deleteCertificateTemplate,
  getLateSubmissionPenalty,
  setLateSubmissionPenalty,
  deleteLateSubmissionPenalty,
} from '../controllers/badges.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Badges
router.get('/badges', listBadges)
router.post('/badges', createBadge)
router.put('/badges/:badgeId', updateBadge)
router.delete('/badges/:badgeId', deleteBadge)

// User Badges
router.get('/my/badges', getUserBadges)
router.post('/badges/award', awardBadge)

// Certificate Templates
router.get('/certificate-templates', listCertificateTemplates)
router.post('/certificate-templates', createCertificateTemplate)
router.put('/certificate-templates/:templateId', updateCertificateTemplate)
router.delete('/certificate-templates/:templateId', deleteCertificateTemplate)

// Late Submission Penalties
router.get('/assignments/:assignmentId/late-penalty', getLateSubmissionPenalty)
router.post('/assignments/:assignmentId/late-penalty', setLateSubmissionPenalty)
router.delete('/assignments/:assignmentId/late-penalty', deleteLateSubmissionPenalty)

export default router