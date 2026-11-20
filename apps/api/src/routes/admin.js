import { Router } from 'express'
import { z } from 'zod'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { Course } from '../models/Course.js'
import { Enrollment } from '../models/Enrollment.js'
import { Order } from '../models/Order.js'
import { User } from '../models/User.js'
import { toSlug } from '../services/slug.js'

const router = Router()

function wrap(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

router.use(requireAuth, requireAdmin)

router.get('/stats', wrap(async (req, res) => {
  const [courses, publishedCourses, users, enrollments, paidOrders, allOrders] = await Promise.all([
    Course.countDocuments(),
    Course.countDocuments({ published: true }),
    User.countDocuments(),
    Enrollment.countDocuments({ status: 'active' }),
    Order.find({ status: 'paid' }),
    Order.countDocuments(),
  ])

  const revenueCents = paidOrders.reduce((sum, order) => sum + (order.amountTotalCents || 0), 0)
  res.json({
    courses,
    publishedCourses,
    users,
    enrollments,
    paidOrders: paidOrders.length,
    orders: allOrders,
    revenueCents,
  })
}))

router.get('/users', wrap(async (req, res) => {
  const items = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).limit(500)
  res.json({ items })
}))

router.get('/orders', wrap(async (req, res) => {
  const items = await Order.find({})
    .populate('userId', 'email name')
    .populate('items.courseId', 'title')
    .sort({ createdAt: -1 })
    .limit(500)
  res.json({ items })
}))

router.get('/enrollments', wrap(async (req, res) => {
  const items = await Enrollment.find({ status: 'active' })
    .populate('userId', 'email name')
    .populate('courseId', 'title')
    .sort({ createdAt: -1 })
    .limit(500)
  res.json({ items })
}))

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
  imageUrl: z.string().min(1),
  published: z.boolean(),
})

router.post('/courses', wrap(async (req, res) => {
  const data = createSchema.parse(req.body)
  const slug = toSlug(data.title)
  const course = await Course.create({ ...data, slug })
  res.status(201).json({ course })
}))

const patchSchema = createSchema.partial()

router.patch('/courses/:id', wrap(async (req, res) => {
  const data = patchSchema.parse(req.body)
  const update = { ...data }
  if (data.title) update.slug = toSlug(data.title)
  const course = await Course.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
  if (!course) return res.status(404).json({ error: { message: 'Course not found' } })
  res.json({ course })
}))

router.delete('/courses/:id', wrap(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id)
  if (!course) return res.status(404).json({ error: { message: 'Course not found' } })
  await Enrollment.deleteMany({ courseId: course._id })
  res.json({ ok: true })
}))

export default router
