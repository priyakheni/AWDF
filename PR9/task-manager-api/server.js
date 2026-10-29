import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import authenticateToken from './middleware/authenticateToken.js'
import Task from './models/Task.js'
import User from './models/User.js'

const app = express()
const PORT = process.env.PORT || 5000
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors({ origin: clientOrigin }))
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} ${new Date().toISOString()}`)
  next()
})
app.use(express.json({ limit: '20kb' }))

function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({
      error: { status: 415, message: 'Content-Type must be application/json.' },
    })
  }
  next()
}

function validateCredentials(req, res, next) {
  const { email, password } = req.body ?? {}
  const errors = {}
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!cleanEmail || cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    errors.email = 'Enter a valid email address.'
  }
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    errors.password = 'Password must be at least 8 characters and no more than 72 bytes.'
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ error: { status: 400, message: 'Please correct the highlighted fields.', fields: errors } })
  }

  req.credentials = { email: cleanEmail, password }
  next()
}

function validateTaskId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({
      error: { status: 400, message: 'Task ID must be a valid MongoDB ObjectId.' },
    })
  }
  next()
}

function validateTaskBody(req, res, next) {
  const { title, description, completed, priority } = req.body ?? {}
  const errors = {}

  if (typeof title !== 'string' || title.trim() === '') {
    errors.title = 'The title field is required and must be a non-empty string.'
  } else if (title.trim().length > 120) {
    errors.title = 'Task titles must be 120 characters or fewer.'
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.description = 'The description field must be a string.'
  } else if (typeof description === 'string' && description.trim().length > 1000) {
    errors.description = 'Task descriptions must be 1000 characters or fewer.'
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.completed = 'The completed field must be true or false.'
  }
  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    errors.priority = 'Priority must be low, medium, or high.'
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ error: { status: 400, message: 'Task validation failed.', fields: errors } })
  }

  req.validTask = {
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    completed: completed ?? false,
    priority: priority ?? 'medium',
  }
  next()
}

function publicUser(user) {
  return { id: user.id, email: user.email, createdAt: user.createdAt }
}

app.post('/auth/register', requireJson, validateCredentials, async (req, res) => {
  const user = await User.create(req.credentials)
  res.status(201).json({ message: 'Account created. Please sign in.', user: publicUser(user) })
})

app.post('/auth/login', requireJson, validateCredentials, async (req, res) => {
  const user = await User.findOne({ email: req.credentials.email }).select('+password')
  const passwordMatches = user && await bcrypt.compare(req.credentials.password, user.password)

  if (!passwordMatches) {
    return res.status(401).json({ error: { status: 401, message: 'Email or password is incorrect.' } })
  }

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' })
  res.status(200).json({ token, expiresIn: 3600, user: publicUser(user) })
})

app.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({ user: publicUser(req.user) })
})

// Every task route requires a valid token and operates only on the signed-in user's data.
app.use('/tasks', authenticateToken)

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.status(200).json({ count: tasks.length, tasks })
})

app.get('/tasks/:id', validateTaskId, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
  if (!task) {
    return res.status(404).json({ error: { status: 404, message: 'Task was not found.' } })
  }
  res.status(200).json({ task })
})

app.post('/tasks', requireJson, validateTaskBody, async (req, res) => {
  const task = await Task.create({ ...req.validTask, user: req.user._id })
  res.location(`/tasks/${task.id}`).status(201).json({ task })
})

app.put('/tasks/:id', requireJson, validateTaskId, validateTaskBody, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.validTask,
    { new: true, runValidators: true },
  )
  if (!task) {
    return res.status(404).json({ error: { status: 404, message: 'Task was not found.' } })
  }
  res.status(200).json({ task })
})

app.delete('/tasks/:id', validateTaskId, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!task) {
    return res.status(404).json({ error: { status: 404, message: 'Task was not found.' } })
  }
  res.status(200).json({ message: 'Task deleted.', task })
})

app.use((req, res) => {
  res.status(404).json({
    error: { status: 404, message: 'Route not found.', method: req.method, path: req.originalUrl },
  })
})

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)

  if (err instanceof mongoose.Error.ValidationError) {
    const fields = Object.fromEntries(Object.entries(err.errors).map(([field, fieldError]) => [field, fieldError.message]))
    return res.status(400).json({ error: { status: 400, message: 'Validation failed.', fields } })
  }
  if (err instanceof mongoose.Error.CastError || err.name === 'BSONError') {
    return res.status(400).json({ error: { status: 400, message: 'A supplied ID or field value is invalid.' } })
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: { status: 409, message: 'An account with this email already exists.' } })
  }
  if (err.status === 400 && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { status: 400, message: 'Invalid JSON request body.' } })
  }

  console.error(err)
  res.status(500).json({ error: { status: 500, message: 'Internal server error.' } })
})

async function startServer() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from .env.')
  if (!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters in .env.')

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
