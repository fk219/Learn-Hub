import { User } from '../models/User.js'
import { verifyAccessToken } from '../services/jwt.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization') || ''
    const [type, token] = header.split(' ')
    if (type !== 'Bearer' || !token) return res.status(401).json({ error: { message: 'Unauthorized' } })

    const payload = verifyAccessToken(token)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ error: { message: 'Unauthorized' } })

    req.user = user
    next()
  } catch (e) {
    res.status(401).json({ error: { message: 'Unauthorized' } })
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: { message: 'Forbidden' } })
  next()
}
