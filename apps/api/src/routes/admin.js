import { Router } from 'express'
import { z } from 'zod'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { Course } from '../models/Course.js'
import { toSlug } from '../services/slug.js'

const router = Router()

function wrap(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

router.use(requireAuth, requireAdmin)

router.get('/courses', wrap(async (req, res) => {
  const items = await Course.find({}).sort({ createdAt: -1 }).limit(500)
  res.json({ items })
}))

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  level: z.string().min(1),
  priceCents: z.number().int().min(0),
  currency: z.string().min(1),
  imageUrl: z.string().url(),
  published: z.boolean(),
})

router.post('/courses', wrap(async (req, res) => {
  const data = createSchema.parse(req.body)
  const slug = toSlug(data.title)
  const course = await Course.create({ ...data, slug })
  res.status(201).json({ course })
}))

export default router
