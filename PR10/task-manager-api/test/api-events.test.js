import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import 'dotenv/config'
import mongoose from 'mongoose'

const apiDirectory = fileURLToPath(new URL('../', import.meta.url))
const canRunMongoIntegration = Boolean(process.env.MONGO_URI && process.env.JWT_SECRET)

function uriForTestDatabase(uri, databaseName) {
  const parsedUri = new URL(uri)
  parsedUri.pathname = `/${databaseName}`
  return parsedUri.toString()
}

async function waitForLog(readLogs, text, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const currentLogs = readLogs()
    if (currentLogs.includes(text)) return currentLogs
    await delay(20)
  }
  throw new Error(`Timed out waiting for log: ${text}\n${readLogs()}`)
}

test('task HTTP responses stay unchanged while notifications run in the background', {
  skip: !canRunMongoIntegration && 'Set MONGO_URI and JWT_SECRET to run the MongoDB integration test.',
  timeout: 30000,
}, async () => {
  const databaseName = `pr10_events_test_${process.pid}_${Date.now()}`
  const testMongoUri = uriForTestDatabase(process.env.MONGO_URI, databaseName)
  let logs = ''
  let serverProcess
  let testConnection

  try {
    serverProcess = spawn(process.execPath, ['server.js'], {
      cwd: apiDirectory,
      env: { ...process.env, MONGO_URI: testMongoUri, PORT: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    serverProcess.stdout.on('data', (chunk) => { logs += chunk.toString() })
    serverProcess.stderr.on('data', (chunk) => { logs += chunk.toString() })

    await waitForLog(() => logs, 'Task Manager API listening on http://localhost:')
    const port = Number(logs.match(/Task Manager API listening on http:\/\/localhost:(\d+)/)?.[1])
    assert.ok(port > 0)
    const baseUrl = `http://127.0.0.1:${port}`
    const testEmail = `pr10-${process.pid}-${Date.now()}@example.test`
    const password = 'Practical10!Test'

    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password }),
    })
    assert.equal(registerResponse.status, 201)

    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password }),
    })
    assert.equal(loginResponse.status, 200)
    const { token } = await loginResponse.json()
    const authHeaders = { Authorization: `Bearer ${token}` }

    const createResponse = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Practical 10 event test', description: 'Check async notifications', priority: 'medium' }),
    })
    assert.equal(createResponse.status, 201)
    const createBody = await createResponse.json()
    assert.deepEqual(Object.keys(createBody), ['task'])
    assert.equal(createBody.task.title, 'Practical 10 event test')
    assert.equal(createResponse.headers.get('location'), `/tasks/${createBody.task._id}`)

    await waitForLog(() => logs, 'POST /tasks HTTP 201 response finished')
    assert.match(logs, /task-created handler started/)
    assert.equal(logs.includes('task-created notification completed'), false)
    await waitForLog(() => logs, 'task-created notification completed', 4000)

    const deleteResponse = await fetch(`${baseUrl}/tasks/${createBody.task._id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    assert.equal(deleteResponse.status, 200)
    const deleteBody = await deleteResponse.json()
    assert.deepEqual(Object.keys(deleteBody).sort(), ['message', 'task'])
    assert.equal(deleteBody.message, 'Task deleted.')
    await waitForLog(() => logs, 'task-deleted event received')
    await waitForLog(() => logs, 'HTTP 200 response finished')
  } finally {
    if (serverProcess && serverProcess.exitCode === null) {
      serverProcess.kill('SIGTERM')
      await new Promise((resolve) => serverProcess.once('exit', resolve))
    }

    testConnection = await mongoose.createConnection(testMongoUri).asPromise()
    await testConnection.dropDatabase()
    await testConnection.close()
  }
})
