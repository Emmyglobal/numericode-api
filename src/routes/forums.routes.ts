import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  listForumCategories, createForumCategory, updateForumCategory, deleteForumCategory,
  listForumThreads, getForumThread, createForumThread, updateForumThread, deleteForumThread,
  listForumPosts, createForumPost, updateForumPost, deleteForumPost,
  searchForumPosts
} from '../controllers/forums.controller'

const router = Router()
const guard = [requireAuth]

// Forum Categories
router.get('/courses/:courseId/forum/categories', ...guard, listForumCategories)
router.post('/forum/categories', ...guard, createForumCategory)
router.put('/forum/categories/:categoryId', ...guard, updateForumCategory)
router.delete('/forum/categories/:categoryId', ...guard, deleteForumCategory)

// Forum Threads
router.get('/forum/categories/:categoryId/threads', ...guard, listForumThreads)
router.get('/forum/threads/:threadId', ...guard, getForumThread)
router.post('/forum/threads', ...guard, createForumThread)
router.put('/forum/threads/:threadId', ...guard, updateForumThread)
router.delete('/forum/threads/:threadId', ...guard, deleteForumThread)

// Forum Posts
router.get('/forum/threads/:threadId/posts', ...guard, listForumPosts)
router.post('/forum/threads/:threadId/posts', ...guard, createForumPost)
router.put('/forum/threads/:threadId/posts/:postId', ...guard, updateForumPost)
router.delete('/forum/threads/:threadId/posts/:postId', ...guard, deleteForumPost)

// Search
router.get('/forum/search', ...guard, searchForumPosts)

export default router