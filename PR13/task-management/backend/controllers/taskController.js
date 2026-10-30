const mongoose = require('mongoose')
const Task = require('../models/Task')

const isValidId = (id) => mongoose.isValidObjectId(id)

async function listTasks(_req, res) {
  const tasks = await Task.find().sort({ createdAt: -1 })
  res.json(tasks)
}

async function replaceTasks(req, res) {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Request body must be an array of tasks' })

  const tasks = req.body.map((task) => ({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'Medium',
    status: task.status || 'Todo',
    dueDate: task.dueDate || null,
    project: task.project || '',
    ...(task.createdAt ? { createdAt: task.createdAt } : {}),
  }))

  await Task.deleteMany({})
  const saved = tasks.length ? await Task.insertMany(tasks) : []
  res.json(saved)
}

async function getTask(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid task ID' })
  const task = await Task.findById(req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
}

async function createTask(req, res) {
  const task = await Task.create(req.body)
  res.status(201).json(task)
}

async function updateTask(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid task ID' })
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true, context: 'query', overwrite: false,
  })
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
}

async function completeTask(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid task ID' })
  const task = await Task.findByIdAndUpdate(req.params.id, { status: 'Completed' }, { new: true, runValidators: true })
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
}

async function deleteTask(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid task ID' })
  const task = await Task.findByIdAndDelete(req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json({ message: 'Task deleted', task })
}

module.exports = { listTasks, replaceTasks, getTask, createTask, updateTask, completeTask, deleteTask }
