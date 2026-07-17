import 'dotenv/config'
import { createApp } from './app'

const app  = createApp()
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`NumeriCode API listening on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
