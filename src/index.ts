import 'dotenv/config'
import { createApp } from './app'

const app  = createApp()
const PORT = process.env.PORT || 3001

// Add '0.0.0.0' as the second argument here
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`NumeriCode API listening on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
