const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5002/api').replace(/\/$/, '')

export const aiService = {
  async generateDescription(title) {
    let response
    try {
      response = await fetch(`${API_BASE_URL}/ai/generate-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
    } catch {
      throw new Error(`Cannot reach the backend at ${API_BASE_URL}. Start the backend and check the frontend API URL.`)
    }

    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || 'Could not generate a task description.')
    return data
  },
}
