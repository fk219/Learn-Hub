import { Router } from 'express'
import { z } from 'zod'
import { User } from '../models/User.js'
import { hashPassword, verifyPassword } from '../services/password.js'
import { signAccessToken } from '../services/jwt.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function wrap(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

router.post('/register', wrap(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body)
  const normalizedEmail = email.toLowerCase()

  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) return res.status(409).json({ error: { message: 'Email already in use' } })

  const passwordHash = await hashPassword(password)
  const user = await User.create({ name, email: normalizedEmail, passwordHash, role: 'user' })
  const accessToken = signAccessToken(user)

  res.json({
    accessToken,
    user: { id: String(user._id), email: user.email, name: user.name, role: user.role },
  })
}))

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/login', wrap(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } })

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } })

  const accessToken = signAccessToken(user)
  res.json({
    accessToken,
    user: { id: String(user._id), email: user.email, name: user.name, role: user.role },
  })
}))

router.get('/me', requireAuth, (req, res) => {
  const u = req.user
  res.json({ user: { id: String(u._id), email: u.email, name: u.name, role: u.role } })
})

export default router
