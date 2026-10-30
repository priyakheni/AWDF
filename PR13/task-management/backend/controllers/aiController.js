const OpenAI = require('openai')

const REQUESTS_PER_TITLE_WINDOW_MS = 60 * 1000
const MAX_TITLE_LENGTH = 120
const recentRequests = new Map()

function isRateLimited(title, now = Date.now()) {
  for (const [savedTitle, timestamp] of recentRequests) {
    if (now - timestamp >= REQUESTS_PER_TITLE_WINDOW_MS) recentRequests.delete(savedTitle)
  }

  const normalizedTitle = title.trim().toLowerCase()
  const lastRequest = recentRequests.get(normalizedTitle)
  if (lastRequest && now - lastRequest < REQUESTS_PER_TITLE_WINDOW_MS) return true

  recentRequests.set(normalizedTitle, now)
  return false
}

async function generateDescription(req, res) {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''
  if (!title) return res.status(400).json({ error: 'A non-empty task title is required.' })
  if (title.length > MAX_TITLE_LENGTH) {
    return res.status(400).json({ error: `Task title must be ${MAX_TITLE_LENGTH} characters or fewer.` })
  }
  if (isRateLimited(title)) {
    return res.status(429).json({ error: 'A description was already requested for this title. Please try again in one minute.' })
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === 'your_actual_api_key') throw new Error('OpenAI API key is not configured.')

    const openai = new OpenAI({ apiKey, timeout: 15_000, maxRetries: 0 })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Write one concise, useful task description. Use a clear action and expected outcome. Return only the description.' },
        { role: 'user', content: `Task title: ${title}` },
      ],
      max_tokens: 100,
    })
    const description = completion.choices?.[0]?.message?.content?.trim()
    if (!description) throw new Error('OpenAI returned an empty description.')

    return res.status(200).json({ description, fallback: false })
  } catch (error) {
    console.error('AI description generation failed:', error.message)
    return res.status(503).json({
      error: 'AI description generation is temporarily unavailable. Please try again later or enter a description manually.',
    })
  }
}

module.exports = { generateDescription, isRateLimited }
