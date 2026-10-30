const STORAGE_KEY = 'taskflow.tasks.v1'
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const today = new Date()
const iso = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10) }
const samples = [
  { id: 'task-1', title: 'Finalize Q3 product roadmap', description: 'Align milestones with the product and engineering teams.', priority: 'High', dueDate: iso(0), status: 'In Progress', project: 'Product launch', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'task-2', title: 'Review homepage wireframes', description: 'Share feedback on the latest desktop and mobile concepts.', priority: 'Medium', dueDate: iso(1), status: 'Todo', project: 'Website redesign', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'task-3', title: 'Prepare customer interview guide', description: 'Draft questions for next week’s discovery calls.', priority: 'Low', dueDate: iso(3), status: 'Todo', project: 'Research', createdAt: new Date().toISOString() },
  { id: 'task-4', title: 'Share sprint update with stakeholders', description: '', priority: 'Medium', dueDate: iso(-1), status: 'Todo', project: 'Product launch', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'task-5', title: 'Audit onboarding email sequence', description: 'Check copy, links, and current brand voice.', priority: 'Low', dueDate: iso(5), status: 'Completed', project: 'Growth', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
]
async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } })
  if (!response.ok) throw new Error(`Task API request failed (${response.status})`)
  return response.status === 204 ? null : response.json()
}
export const taskService = {
  async list() {
    if (API_BASE_URL) {
      const tasks = await request('/tasks')
      return tasks.map(task => ({ ...task, dueDate: task.dueDate?.slice(0, 10) || '' }))
    }
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) { try { return JSON.parse(saved) } catch { localStorage.removeItem(STORAGE_KEY) } }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples)); return samples
  },
  async save(tasks) {
    if (API_BASE_URL) return request('/tasks', { method: 'PUT', body: JSON.stringify(tasks) })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); return tasks
  },
}
