import 'dotenv/config'
import { createApp } from './app'
import cron from 'node-cron'
import { migrate } from './db/migrate'
import { processSessionAlerts, processExpiredSessions } from './services/scheduler.service'

const PORT = process.env.PORT || 3001

async function start() {
  // Apply the database schema before accepting traffic. Migration is
  // idempotent (CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS), so it's
  // safe on every boot. If it fails (unreachable DB, permission error, etc.) it
  // crashes loudly here instead of starting and returning 500s everywhere.
  await migrate()

  const app = createApp()

  // Bind to '0.0.0.0' to accept standard cloud proxy traffic
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`NumeriCode API listening on port:  ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`)
  })
}

start().catch((err) => {
  console.error('Startup failed (database migration):', err)
  process.exit(1)
})

// Scheduler: run every 5 minutes to send alerts and mark expired sessions
if (cron.schedule('*/5 * * * *', async () => {
  try {
    await processSessionAlerts()
    await processExpiredSessions()
  } catch (err) {
    console.error('Scheduler run failed:', err)
  }
}, { timezone: 'Africa/Lagos' })) {
  console.log('Live class scheduler started (every 5 minutes)')
}
