import { User } from '../models/User.js'
import { hashPassword } from './password.js'

export async function ensureSingleAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD')

  const existing = await User.findOne({ role: 'admin' })
  if (existing) return

  const passwordHash = await hashPassword(password)
  await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name: 'Admin',
    role: 'admin',
  })
}

