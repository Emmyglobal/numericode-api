import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { listNotifications, markAsRead, markAllAsRead } from '../controllers/notifications.controller'

const router = Router()
const guard = [requireAuth]

router.get('/notifications',            ...guard, listNotifications)
router.patch('/notifications/:id/read', ...guard, markAsRead)
router.patch('/notifications/read-all', ...guard, markAllAsRead)

export default router
