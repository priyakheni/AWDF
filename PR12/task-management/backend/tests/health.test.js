const request = require('supertest')
const { app } = require('../server')

describe('GET /api/health', () => {
  it('returns HTTP 200 and success true without connecting to MongoDB', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true })
  })
})
