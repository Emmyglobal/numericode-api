import 'dotenv/config'
import { createApp } from './app'
import cron from 'node-cron'
import { migrate } from './db/migrate'
import { seed } from './db/seed'
import { processSessionAlerts, processExpiredSessions } from './services/scheduler.service'

const PORT = process.env.PORT || 3001

// ─────────────────────────────────────────────────────────────────────────────
// Global async error handling.
//
// Without these, an unhandled promise rejection anywhere during startup (e.g. a
// stray DB query, a notification fan-out, a mailer call) makes Node >=15 crash
// the whole process *silently* — no error reaches the console — which Render
// reports as "Application exited early" and crash-loops. We convert rejections
// into a clearly-logged error and STAY UP so the real cause is visible in the
// deploy log and transient failures never kill the API.
// ─────────────────────────────────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error(
    '[startup] Unhandled promise rejection (kept running; cause below):',
    reason
  )
})

process.on('uncaughtException', (reason) => {
  console.error(
    '[startup] Uncaught exception (kept running; cause below):',
    reason
  )
})

async function start() {
  // Apply the database schema before accepting traffic. Migration is
  // idempotent (CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS), so it's
  // safe on every boot. If it fails (unreachable DB, permission error, etc.) it
  // crashes loudly here instead of starting and returning 500s everywhere.
  await migrate()

  // Seed demo data (idempotent — a clean no-op on re-runs). Non-fatal: a seed
  // failure must never prevent the API from starting and serving existing data.
  try {
    await seed()
  } catch (err) {
    console.warn('Seed failed (non-fatal):', (err as Error)?.message ?? err)
  }

  const app = createApp()

  // Bind to '0.0.0.0' to accept standard cloud proxy traffic
  const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`NumeriCode API listening on port:  ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`)
  })

  // Surface bind/socket errors as logs instead of letting the process exit
  // silently (which Render reports as "Application exited early").
  server.on('error', (err: NodeJS.ErrnoException) => {
    console.error('HTTP server error:', err?.message ?? err)
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
