import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

// In-memory data resets whenever the server restarts.
let tasks = []
let nextTaskId = 1

// Log each request before it reaches a route.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} ${new Date().toISOString()}`)
  next()
})

// Parse JSON bodies when the request has an application/json content type.
app.use(express.json())

// POST and PUT must send JSON.
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

// Task IDs in this API are positive integers.
function validateTaskId(req, res, next) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'Task ID must be a positive integer.',
      },
    })
  }
  req.taskId = id
  next()
}

function validateTaskBody(req, res, next) {
  const { title, completed } = req.body ?? {}
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'The title field is required and must be a non-empty string.',
      },
    })
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'The completed field must be true or false.',
      },
    })
  }
  req.validTask = { title: title.trim(), completed: completed ?? false }
  next()
}

// GET /tasks — return all tasks.
app.get('/tasks', (req, res) => {
  res.status(200).json({ count: tasks.length, tasks })
})

// POST /tasks — create a task and return its location.
app.post('/tasks', requireJson, validateTaskBody, (req, res) => {
  const task = { id: nextTaskId++, ...req.validTask }
  tasks.push(task)
  res.location(`/tasks/${task.id}`).status(201).json({ task })
})

// PUT /tasks/:id — replace a task's editable fields.
app.put('/tasks/:id', requireJson, validateTaskId, validateTaskBody, (req, res) => {
  const taskIndex = tasks.findIndex((task) => task.id === req.taskId)
  if (taskIndex === -1) {
    return res.status(404).json({
      error: { status: 404, message: `Task ${req.taskId} was not found.` },
    })
  }
  tasks[taskIndex] = { id: req.taskId, ...req.validTask }
  res.status(200).json({ task: tasks[taskIndex] })
})

// DELETE /tasks/:id — remove a task.
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const taskIndex = tasks.findIndex((task) => task.id === req.taskId)
  if (taskIndex === -1) {
    return res.status(404).json({
      error: { status: 404, message: `Task ${req.taskId} was not found.` },
    })
  }
  const [deletedTask] = tasks.splice(taskIndex, 1)
  res.status(200).json({ message: 'Task deleted.', task: deletedTask })
})

// Structured 404 for any route not handled above.
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

// Keep this last so route, parser, and unexpected errors reach one handler.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)
  const status = err.status === 400 ? 400 : 500
  console.error(err)
  res.status(status).json({
    error: {
      status,
      message: status === 400 ? 'Invalid JSON request body.' : 'Internal server error.',
    },
  })
})

app.listen(PORT, () => {
  console.log(`Task Manager API listening on http://localhost:${PORT}`)
})
