import jwt from 'jsonwebtoken'

function secret() {
  const value = process.env.JWT_SECRET
  if (value) return value
  if (process.env.NODE_ENV === 'test') return 'test-secret'
  throw new Error('JWT_SECRET is required. Set it in apps/api/.env before starting the API.')
}

export function signAccessToken(user) {
  return jwt.sign({ role: user.role }, secret(), {
    subject: String(user._id),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, secret())
}
