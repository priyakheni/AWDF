import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import Task from './models/Task.js'

const app = express()
const PORT = process.env.PORT || 5000
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

// Allow the Vite frontend to call this API from the browser.
app.use(cors({ origin: clientOrigin }))

// Log each request before it reaches a route.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} ${new Date().toISOString()}`)
  next()
})

// Parse JSON bodies when the request has an application/json content type.
app.use(express.json())

function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({
      error: {
        status: 415,
        message: 'Content-Type must be application/json.',
      },
    })
  }
  next()
}

function validateTaskId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'Task ID must be a valid MongoDB ObjectId.',
      },
    })
  }
  next()
}

function validateTaskBody(req, res, next) {
  const { title, description, completed, priority } = req.body ?? {}
  const errors = {}

  if (typeof title !== 'string' || title.trim() === '') {
    errors.title = 'The title field is required and must be a non-empty string.'
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.description = 'The description field must be a string.'
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.completed = 'The completed field must be true or false.'
  }
  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    errors.priority = 'Priority must be low, medium, or high.'
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'Task validation failed.',
        fields: errors,
      },
    })
  }

  req.validTask = {
    title: title.trim(),
    description: description ?? '',
    completed: completed ?? false,
    priority: priority ?? 'medium',
  }
  next()
}

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 })
  res.status(200).json({ count: tasks.length, tasks })
})

app.get('/tasks/:id', validateTaskId, async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (!task) {
    return res.status(404).json({
      error: { status: 404, message: `Task ${req.params.id} was not found.` },
    })
  }
  res.status(200).json({ task })
})

app.post('/tasks', requireJson, validateTaskBody, async (req, res) => {
  const task = await Task.create(req.validTask)
  res.location(`/tasks/${task.id}`).status(201).json({ task })
})

app.put('/tasks/:id', requireJson, validateTaskId, validateTaskBody, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.validTask, {
    new: true,
    runValidators: true,
  })
  if (!task) {
    return res.status(404).json({
      error: { status: 404, message: `Task ${req.params.id} was not found.` },
    })
  }
  res.status(200).json({ task })
})

app.delete('/tasks/:id', validateTaskId, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id)
  if (!task) {
    return res.status(404).json({
      error: { status: 404, message: `Task ${req.params.id} was not found.` },
    })
  }
  res.status(200).json({ message: 'Task deleted.', task })
})

app.use((req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: 'Route not found.',
      method: req.method,
      path: req.originalUrl,
    },
  })
})

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)

  if (err instanceof mongoose.Error.ValidationError) {
    const fields = Object.fromEntries(
      Object.entries(err.errors).map(([field, fieldError]) => [field, fieldError.message]),
    )
    return res.status(400).json({
      error: { status: 400, message: 'Task validation failed.', fields },
    })
  }

  if (err instanceof mongoose.Error.CastError || err.name === 'BSONError') {
    return res.status(400).json({
      error: { status: 400, message: 'A supplied ID or field value is invalid.' },
    })
  }

  if (err.status === 400 && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { status: 400, message: 'Invalid JSON request body.' },
    })
  }

  console.error(err)
  res.status(500).json({
    error: { status: 500, message: 'Internal server error.' },
  })
})

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to a .env file before starting the API.')
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB.')
  app.listen(PORT, () => {
    console.log(`Task Manager API listening on http://localhost:${PORT}`)
    console.log(`CORS enabled for ${clientOrigin}`)
  })
}

startServer().catch((error) => {
  console.error(`Could not start Task Manager API: ${error.message}`)
  process.exitCode = 1
})
