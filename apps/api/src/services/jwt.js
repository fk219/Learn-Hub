import jwt from 'jsonwebtoken'

function secret() {
  return process.env.JWT_SECRET || 'dev-secret'
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
