import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  sendMessage,
  getMessages,
  getConversation,
  markMessageAsRead,
  createGroupConversation,
  getGroupConversations,
  getGroupMessages,
  sendGroupMessage,
} from '../controllers/messaging.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Direct Messages
router.post('/messages', sendMessage)
router.get('/messages', getMessages)
router.get('/messages/conversations/:userId', getConversation)
router.patch('/messages/:messageId/read', markMessageAsRead)

// Group Conversations
router.post('/group-conversations', createGroupConversation)
router.get('/group-conversations', getGroupConversations)
router.get('/group-conversations/:conversationId/messages', getGroupMessages)
router.post('/group-conversations/:conversationId/messages', sendGroupMessage)

export default router