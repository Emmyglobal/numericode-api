import 'dotenv/config'
import { createApp } from './app'
import cron from 'node-cron'
import { processSessionAlerts, processExpiredSessions } from './services/scheduler.service'

const app  = createApp()
const PORT = process.env.PORT || 3001

// Bind to '0.0.0.0' to accept standard cloud proxy traffic
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`NumeriCode API listening on port:  ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`)
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
