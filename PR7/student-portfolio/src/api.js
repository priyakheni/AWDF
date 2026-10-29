const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const TOKEN_KEY = 'task_manager_token'

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}, { authenticated = true } = {}) {
  const token = authenticated ? getToken() : null
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new Error(`Cannot reach the task API at ${API_BASE_URL}. Make sure the backend is running.`)
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      clearToken()
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    const error = new Error(data.error?.message || `The request failed (${response.status}).`)
    error.status = response.status
    error.fields = data.error?.fields || {}
    throw error
  }
  return data
}

const taskApi = {
  getToken,
  clearToken,
  async register(credentials) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(credentials) }, { authenticated: false })
  },
  async login(credentials) {
    const result = await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, { authenticated: false })
    window.localStorage.setItem(TOKEN_KEY, result.token)
    return result
  },
  async getMe() {
    const result = await request('/me')
    return result.user
  },
  async getTasks() {
    const result = await request('/tasks')
    return result.tasks
  },
  async getTask(id) {
    const result = await request(`/tasks/${encodeURIComponent(id)}`)
    return result.task
  },
  async createTask(task) {
    const result = await request('/tasks', { method: 'POST', body: JSON.stringify(task) })
    return result.task
  },
  async updateTask(id, task) {
    const result = await request(`/tasks/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(task) })
    return result.task
  },
  async deleteTask(id) {
    return request(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}

export default taskApi
