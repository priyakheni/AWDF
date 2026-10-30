require('dotenv').config({ path: require('path').join(__dirname, '.env') })

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const taskRoutes = require('./routes/taskRoutes')
const aiRoutes = require('./routes/aiRoutes')

const app = express()
const PORT = Number(process.env.PORT) || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskdb'

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

// Keep the health check independent of MongoDB so it can verify that the
// Express process is available without opening a database connection.
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true })
})
app.use('/api/ai', aiRoutes)
app.use('/api/tasks', taskRoutes)

app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` }))
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Request body must contain valid JSON' })
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ error: err.message, details: err.errors ? Object.values(err.errors).map((item) => item.message) : undefined })
  }
  console.error('Request failed:', err)
  return res.status(500).json({ error: 'Internal server error' })
})

function start() {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Task API listening on 0.0.0.0:${PORT}`)
  })

  // The AI endpoint does not use MongoDB, so a database outage should not
  // prevent the HTTP API from starting. Task operations still require MongoDB.
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB; task routes require a database:', error.message))

  return server
}

if (require.main === module) start()

module.exports = { app, start }
