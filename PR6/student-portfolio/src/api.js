const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('Cannot reach the task API. Make sure the backend is running on port 5000.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error?.message || `The request failed (${response.status}).`)
  }
  return data
}

const taskApi = {
  async getTasks() {
    const data = await request('/tasks')
    return data.tasks
  },
  async getTask(id) {
    const data = await request(`/tasks/${encodeURIComponent(id)}`)
    return data.task
  },
  async createTask(task) {
    const data = await request('/tasks', { method: 'POST', body: JSON.stringify(task) })
    return data.task
  },
  async updateTask(id, task) {
    const data = await request(`/tasks/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(task) })
    return data.task
  },
  async deleteTask(id) {
    return request(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}

export default taskApi
