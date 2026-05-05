import { Router } from 'express'
import { Course } from '../models/Course.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = { published: true }
    const items = await Course.find(filter).sort({ createdAt: -1 }).limit(200)
    const total = await Course.countDocuments(filter)
    res.json({ items, total })
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course || !course.published) return res.status(404).json({ error: { message: 'Not found' } })
    res.json({ course })
  } catch (e) {
    next(e)
  }
})

export default router

