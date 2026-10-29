import jwt from 'jsonwebtoken'
import User from '../models/User.js'

async function authenticateToken(req, res, next) {
  const authorization = req.get('authorization') || ''
  const match = authorization.match(/^Bearer\s+(.+)$/i)

  if (!match) {
    return res.status(401).json({
      error: { status: 401, message: 'Authentication required. Send a Bearer token.' },
    })
  }

  let payload
  try {
    payload = jwt.verify(match[1], process.env.JWT_SECRET)
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'Your session has expired. Please sign in again.'
      : 'Invalid authentication token.'
    return res.status(401).json({ error: { status: 401, message } })
  }

  const user = await User.findById(payload.sub).select('_id email createdAt')
  if (!user) {
    return res.status(401).json({
      error: { status: 401, message: 'This account is no longer available. Please sign in again.' },
    })
  }

  req.user = user
  next()
}

export default authenticateToken
