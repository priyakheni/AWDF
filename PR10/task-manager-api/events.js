import { EventEmitter } from 'node:events'

export const taskEvents = new EventEmitter({ captureRejections: true })

function logEventFailure(error) {
  const timestamp = new Date().toISOString()
  try {
    console.error(`[events] Background listener failed at ${timestamp}: ${error?.message || error}`)
  } catch {
    // Logging failures must not crash the API process.
  }
}

// captureRejections routes rejected async listeners to this registered handler.
// Never emit EventEmitter's special "error" event from API code.
taskEvents.on('error', logEventFailure)

export function emitTaskEvent(eventName, payload) {
  try {
    return taskEvents.emit(eventName, payload)
  } catch (error) {
    logEventFailure(error)
    return false
  }
}
