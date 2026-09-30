import { Router } from 'express'
import { authenticate, requireRole } from '../middleware/auth'
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

const adminOnly = [requireRole('admin' as const)]

// Badges — platform-wide definitions with no per-course owner column, so only
// an admin may create, edit or delete them. Reading the catalogue stays open to
// any authenticated user (the dashboard badge gallery reads it).
router.get('/badges', listBadges)
router.post('/badges', ...adminOnly, createBadge)
router.put('/badges/:badgeId', ...adminOnly, updateBadge)
router.delete('/badges/:badgeId', ...adminOnly, deleteBadge)

// User Badges
// Awarding needs an object-level decision (admin, or the instructor of the
// course being cited) — resolved from the database in the controller.
router.get('/my/badges', getUserBadges)
router.post('/badges/award', awardBadge)

// Certificate Templates — shared rendering assets: admin-managed.
router.get('/certificate-templates', listCertificateTemplates)
router.post('/certificate-templates', ...adminOnly, createCertificateTemplate)
router.put('/certificate-templates/:templateId', ...adminOnly, updateCertificateTemplate)
router.delete('/certificate-templates/:templateId', ...adminOnly, deleteCertificateTemplate)

// Late Submission Penalties — per-assignment trainer configuration: the
// instructor who owns the assignment (or an admin) may set or remove it.
// Reading stays open so a student can see the deduction rule before submitting.
router.get('/assignments/:assignmentId/late-penalty', getLateSubmissionPenalty)
router.post('/assignments/:assignmentId/late-penalty', setLateSubmissionPenalty)
router.delete('/assignments/:assignmentId/late-penalty', deleteLateSubmissionPenalty)

export default router