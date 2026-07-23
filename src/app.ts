import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'

import authRoutes         from './routes/auth.routes'
import coursesRoutes      from './routes/courses.routes'
import dashboardRoutes    from './routes/dashboard.routes'
import trainerRoutes      from './routes/trainer.routes'
import adminRoutes        from './routes/admin.routes'
import notificationsRoutes from './routes/notifications.routes'
import contactRoutes      from './routes/contact.routes'
import aiRoutes           from './routes/ai.routes'
import subscriptionsRoutes from './routes/subscriptions.routes'
import boardsRoutes       from './routes/boards.routes'
import assessmentsRoutes  from './routes/assessments.routes'
import certificatesRoutes from './routes/certificates.routes'
import quizzesRoutes      from './routes/quizzes.routes'
import forumsRoutes       from './routes/forums.routes'
import gradingRoutes      from './routes/grading.routes'
import notificationsEnhancedRoutes from './routes/notifications-enhanced.routes'
import analyticsRoutes    from './routes/analytics.routes'
import messagingRoutes    from './routes/messaging.routes'
import badgesRoutes       from './routes/badges.routes'
import resourcesRoutes    from './routes/resources.routes'
import trainerCourseContentRoutes from './routes/trainer-course-content.routes'
import adminCourseContentRoutes from './routes/admin-course-content.routes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

export function createApp() {
  const app = express()

app.use(helmet())

console.log('CLIENT_URL =', process.env.CLIENT_URL)

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
  app.use(express.json({ limit: '2mb' }))
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
  }

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    version: "TEST-12345",
    clientUrl: process.env.CLIENT_URL,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

  app.use('/api/auth',    authRoutes)
  app.use('/api/courses', coursesRoutes)
  app.use('/api',         dashboardRoutes)
  app.use('/api',         notificationsRoutes)
  app.use('/api/trainer', trainerRoutes)
  app.use('/api/trainer', trainerCourseContentRoutes)
  app.use('/api/admin',   adminRoutes)
  app.use('/api/admin',   adminCourseContentRoutes)
  app.use('/api',         contactRoutes)
  app.use('/api/ai',      aiRoutes)
  app.use('/api/subscriptions', subscriptionsRoutes)
  app.use('/api/boards', boardsRoutes)
  app.use('/api', assessmentsRoutes)
  app.use('/api/certificates', certificatesRoutes)
  app.use('/api/quizzes', quizzesRoutes)
  app.use('/api/forums', forumsRoutes)
  app.use('/api/grading', gradingRoutes)
  app.use('/api/notifications', notificationsEnhancedRoutes)
  app.use('/api', analyticsRoutes)
  app.use('/api', messagingRoutes)
  app.use('/api', badgesRoutes)
  app.use('/api', resourcesRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
