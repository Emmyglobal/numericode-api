import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import {
  getNotificationPreferences, updateNotificationPreferences,
  getNotificationHistory, markNotificationAsRead, markAllNotificationsAsRead,
  sendCustomNotification, sendBulkNotification, getNotificationStats,
  sendEmailDigest, processDigestQueue, registerPushSubscription,
  sendPushNotification, createTargetedAnnouncement
} from '../controllers/notifications-enhanced.controller'

const router = Router()
const guard = [requireAuth]

// User notification preferences
router.get('/notifications/preferences', ...guard, getNotificationPreferences)
router.put('/notifications/preferences', ...guard, updateNotificationPreferences)

// Notification history
router.get('/notifications/history', ...guard, getNotificationHistory)
router.patch('/notifications/:notificationId/read', ...guard, markNotificationAsRead)
router.patch('/notifications/read-all', ...guard, markAllNotificationsAsRead)

// Notification stats
router.get('/notifications/stats', ...guard, getNotificationStats)

// Email Digests
router.post('/notifications/digest/send', ...guard, sendEmailDigest)
router.post('/notifications/digest/process', ...guard, requireRole('trainer' as const), processDigestQueue)

// Push Notifications
router.post('/notifications/push/register', ...guard, registerPushSubscription)
router.post('/notifications/push/send', ...guard, requireRole('trainer' as const), sendPushNotification)

// Announcement Targeting
router.post('/notifications/announcements/targeted', ...guard, requireRole('trainer' as const), createTargetedAnnouncement)

// Admin/Trainer: Send notifications
router.post('/notifications/send', ...guard, requireRole('trainer' as const), sendCustomNotification)
router.post('/notifications/bulk', ...guard, requireRole('trainer' as const), sendBulkNotification)

export default router
