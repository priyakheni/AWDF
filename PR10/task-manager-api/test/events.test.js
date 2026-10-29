import assert from 'node:assert/strict'
import { test } from 'node:test'
import { emitTaskEvent, taskEvents } from '../events.js'
import {
  createTaskCreatedListener,
  createTaskDeletedListener,
  registerTaskListeners,
} from '../listeners.js'

const createdPayloads = []
const deletedPayloads = []
registerTaskListeners({
  onTaskCreated: (payload) => createdPayloads.push(payload),
  onTaskDeleted: (payload) => deletedPayloads.push(payload),
})

test('task listeners register only once', () => {
  const createdCount = taskEvents.listenerCount('task-created')
  const deletedCount = taskEvents.listenerCount('task-deleted')
  assert.equal(registerTaskListeners(), false)
  assert.equal(registerTaskListeners(), false)
  assert.equal(taskEvents.listenerCount('task-created'), createdCount)
  assert.equal(taskEvents.listenerCount('task-deleted'), deletedCount)
})

test('task-created emits title, timestamp, and assigned user', () => {
  const payload = {
    title: 'Write event tests',
    timestamp: '2026-10-29T10:00:00.000Z',
    assignedUser: { id: 'user-123', email: 'student@example.test' },
  }

  assert.equal(emitTaskEvent('task-created', payload), true)
  assert.deepEqual(createdPayloads.at(-1), payload)
})

test('task-deleted emits to its distinct listener', () => {
  const payload = {
    title: 'Remove old task',
    timestamp: '2026-10-29T10:01:00.000Z',
    assignedUser: { id: 'user-123', email: 'student@example.test' },
  }

  assert.equal(emitTaskEvent('task-deleted', payload), true)
  assert.deepEqual(deletedPayloads.at(-1), payload)
})

test('task-created schedules completion after 2000 ms without waiting', () => {
  const logs = []
  let scheduledCallback
  let scheduledDelay
  const listener = createTaskCreatedListener({
    schedule(callback, delay) {
      scheduledCallback = callback
      scheduledDelay = delay
    },
    logger: { log: (message) => logs.push(message), error: (message) => logs.push(message) },
  })
  const payload = {
    title: 'Background task',
    timestamp: '2026-10-29T10:02:00.000Z',
    assignedUser: { id: 'user-456', email: 'owner@example.test' },
  }
  const startedAt = Date.now()

  assert.equal(listener(payload), undefined)
  assert.ok(Date.now() - startedAt < 500)
  assert.equal(scheduledDelay, 2000)
  assert.equal(typeof scheduledCallback, 'function')
  assert.ok(logs[0].includes(payload.title))
  assert.ok(logs[0].includes(payload.assignedUser.email))
  assert.equal(logs.some((message) => message.includes('notification completed')), false)

  scheduledCallback()
  assert.ok(logs.some((message) => message.includes('notification completed')))
})

test('task-deleted listener uses a distinct log message', () => {
  const logs = []
  createTaskDeletedListener({ logger: { log: (message) => logs.push(message), error: (message) => logs.push(message) } })({
    title: 'Deleted task',
    timestamp: '2026-10-29T10:03:00.000Z',
    assignedUser: { id: 'user-789', email: 'owner@example.test' },
  })
  assert.ok(logs[0].includes('task-deleted event received'))
})

test('notification logging failures are caught', () => {
  const errors = []
  const listener = createTaskCreatedListener({
    schedule(callback) { callback() },
    logger: {
      log() { throw new Error('simulated notification failure') },
      error(message) { errors.push(message) },
    },
  })
  assert.doesNotThrow(() => listener({
    title: 'Failure case',
    timestamp: new Date().toISOString(),
    assignedUser: { id: 'user-error', email: 'error@example.test' },
  }))
  assert.ok(errors.some((message) => message.includes('simulated notification failure')))
})

test('synchronous event listener failures do not escape the safe emitter', () => {
  const throwingListener = () => { throw new Error('listener exploded') }
  taskEvents.on('test-notification-failure', throwingListener)
  try {
    assert.equal(emitTaskEvent('test-notification-failure', {}), false)
  } finally {
    taskEvents.off('test-notification-failure', throwingListener)
  }
})

test('rejected async listeners reach the registered event error handler', async () => {
  const listenerError = new Promise((resolve) => taskEvents.once('error', resolve))
  taskEvents.once('test-async-notification-failure', async () => {
    throw new Error('async listener rejected')
  })
  taskEvents.emit('test-async-notification-failure', {})
  const error = await listenerError
  assert.equal(error.message, 'async listener rejected')
})
