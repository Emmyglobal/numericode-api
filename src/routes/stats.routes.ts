import { Router } from 'express'
import { getPublicStats } from '../controllers/stats.controller'

const router = Router()

router.get('/', getPublicStats)

export default router