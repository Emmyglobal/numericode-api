import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import authRoutes         from './routes/auth.routes'
import coursesRoutes      from './routes/courses.routes'
import dashboardRoutes    from './routes/dashboard.routes'
import trainerRoutes      from './routes/trainer.routes'
import adminRoutes        from './routes/admin.routes'
import notificationsRoutes from './routes/notifications.routes'
import contactRoutes      from './routes/contact.routes'
import aiRoutes           from './routes/ai.routes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5175', credentials: true }))
  app.use(express.json({ limit: '2mb' }))
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
  }

  app.get('/health', (_req, res) =>
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } })
  )

  app.use('/api/auth',    authRoutes)
  app.use('/api/courses', coursesRoutes)
  app.use('/api',         dashboardRoutes)
  app.use('/api',         notificationsRoutes)
  app.use('/api/trainer', trainerRoutes)
  app.use('/api/admin',   adminRoutes)
  app.use('/api',         contactRoutes)
  app.use('/api/ai',      aiRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
