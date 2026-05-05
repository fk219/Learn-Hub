import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Enrollment } from '../models/Enrollment.js'

const router = Router()

router.use(requireAuth)

router.get('/enrollments', async (req, res, next) => {
  try {
    const items = await Enrollment.find({ userId: req.user._id, status: 'active' }).populate('courseId')
    res.json({
      items: items.map(e => ({
        id: String(e._id),
        course: e.courseId,
        createdAt: e.createdAt,
      })),
    })
  } catch (e) {
    next(e)
  }
})

export default router

