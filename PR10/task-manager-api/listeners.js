import { taskEvents } from './events.js'

function reportNotificationFailure(eventName, error, logger) {
  const message = `[background] ${eventName} notification failed at ${new Date().toISOString()}: ${error?.message || error}`
  try {
    logger.error(message)
  } catch {
    // Even a broken logger must not affect an already-completed API response.
  }
}

export function createTaskCreatedListener({ schedule = setTimeout, logger = console, delayMs = 2000 } = {}) {
  return (details) => {
    try {
      logger.log(`[background] task-created handler started at ${new Date().toISOString()} | title="${details.title}" | assignedUser=${details.assignedUser.email} (${details.assignedUser.id}) | eventTimestamp=${details.timestamp}`)
      schedule(() => {
        try {
          logger.log(`[background] task-created notification completed at ${new Date().toISOString()} | title="${details.title}" | assignedUser=${details.assignedUser.email} (${details.assignedUser.id}) | eventTimestamp=${details.timestamp}`)
        } catch (error) {
          reportNotificationFailure('task-created', error, logger)
        }
      }, delayMs)
    } catch (error) {
      reportNotificationFailure('task-created', error, logger)
    }
  }
}

export function createTaskDeletedListener({ logger = console } = {}) {
  return (details) => {
    try {
      logger.log(`[background] task-deleted event received at ${new Date().toISOString()} | title="${details.title}" | assignedUser=${details.assignedUser.email} (${details.assignedUser.id}) | eventTimestamp=${details.timestamp}`)
    } catch (error) {
      reportNotificationFailure('task-deleted', error, logger)
    }
  }
}

let listenersRegistered = false

export function registerTaskListeners({
  onTaskCreated = createTaskCreatedListener(),
  onTaskDeleted = createTaskDeletedListener(),
} = {}) {
  if (listenersRegistered) return false

  taskEvents.on('task-created', onTaskCreated)
  taskEvents.on('task-deleted', onTaskDeleted)
  listenersRegistered = true
  return true
}
