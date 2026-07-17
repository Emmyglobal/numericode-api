import { Router } from 'express'
import { studyGuide } from '../controllers/ai.controller'

const router = Router()
router.post('/study-guide', studyGuide)
export default router
