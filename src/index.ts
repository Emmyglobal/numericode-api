import 'dotenv/config'
import { createApp } from './app'

const app  = createApp()
const PORT = parseInt(process.env.PORT || '3001', 10)

// Change '0.0.0.0' to '::' right here
app.listen(PORT, '::', () => {
  console.log(`NumeriCode API listening on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`)
})