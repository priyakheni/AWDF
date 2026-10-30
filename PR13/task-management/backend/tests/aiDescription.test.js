const request = require('supertest')
const { app } = require('../server')
const { isRateLimited } = require('../controllers/aiController')

describe('POST /api/ai/generate-description', () => {
  it('rejects an empty task title', async () => {
    const response = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: '   ' })

    expect(response.status).toBe(400)
    expect(response.body.error).toMatch(/non-empty task title/i)
  })

  it('rejects titles longer than the task form limit', async () => {
    const response = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'x'.repeat(121) })

    expect(response.status).toBe(400)
    expect(response.body.error).toMatch(/120 characters/i)
  })

  it('returns a useful error when OpenAI is unavailable', async () => {
    const originalKey = process.env.OPENAI_API_KEY
    process.env.OPENAI_API_KEY = 'your_actual_api_key'
    const logError = jest.spyOn(console, 'error').mockImplementation(() => {})

    try {
      const response = await request(app)
        .post('/api/ai/generate-description')
        .send({ title: `Fallback test ${Date.now()}` })

      expect(response.status).toBe(503)
      expect(response.body.error).toMatch(/temporarily unavailable/i)
    } finally {
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY
      else process.env.OPENAI_API_KEY = originalKey
      logError.mockRestore()
    }
  })

  it('allows at most one request for a normalized title in one minute', () => {
    const title = `Rate limit test ${Date.now()}`

    expect(isRateLimited(title, 1000)).toBe(false)
    expect(isRateLimited(`  ${title.toUpperCase()} `, 59_999)).toBe(true)
    expect(isRateLimited(title, 61_000)).toBe(false)
  })
})
