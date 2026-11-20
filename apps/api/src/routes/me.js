import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { Course } from '../models/Course.js'
import { Enrollment } from '../models/Enrollment.js'

const router = Router()

router.use(requireAuth)

function wrap(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

function serializeEnrollment(enrollment) {
  return {
    id: String(enrollment._id),
    course: enrollment.courseId,
    completedLessons: enrollment.completedLessons || [],
    lastLessonId: enrollment.lastLessonId || null,
    createdAt: enrollment.createdAt,
  }
}

router.get('/enrollments', wrap(async (req, res) => {
  const items = await Enrollment.find({ userId: req.user._id, status: 'active' }).populate('courseId')
  res.json({
    items: items
      .filter((enrollment) => enrollment.courseId)
      .map(serializeEnrollment),
  })
}))

const enrollSchema = z.object({
  courseId: z.string().min(1),
})

router.post('/enrollments', wrap(async (req, res) => {
  const { courseId } = enrollSchema.parse(req.body)
  if (!/^[a-f\d]{24}$/i.test(courseId)) {
    return res.status(400).json({ error: { message: 'Invalid course' } })
  }

  const course = await Course.findOne({ _id: courseId, published: true })
  if (!course) return res.status(404).json({ error: { message: 'Course not found' } })

  let enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: course._id })
  if (!enrollment) {
    enrollment = await Enrollment.create({
      userId: req.user._id,
      courseId: course._id,
      status: 'active',
    })
  } else if (enrollment.status !== 'active') {
    enrollment.status = 'active'
    await enrollment.save()
  }

  const populated = await Enrollment.findById(enrollment._id).populate('courseId')
  res.status(201).json({ enrollment: serializeEnrollment(populated) })
}))

const progressSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
})

router.put('/enrollments/:courseId/progress', wrap(async (req, res) => {
  const { courseId } = req.params
  if (!/^[a-f\d]{24}$/i.test(courseId)) {
    return res.status(400).json({ error: { message: 'Invalid course' } })
  }

  const input = progressSchema.parse(req.body)
  const course = await Course.findById(courseId)
  if (!course) return res.status(404).json({ error: { message: 'Course not found' } })

  const lessonIds = new Set((course.modules || []).flatMap((module) => module.lessons.map((lesson) => lesson.id)))
  if (!lessonIds.has(input.lessonId)) {
    return res.status(400).json({ error: { message: 'Unknown lesson' } })
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: course._id,
    status: 'active',
  })
  if (!enrollment) return res.status(404).json({ error: { message: 'Enrollment not found' } })

  const update = input.completed
    ? { $addToSet: { completedLessons: input.lessonId }, $set: { lastLessonId: input.lessonId } }
    : { $pull: { completedLessons: input.lessonId }, $set: { lastLessonId: input.lessonId } }

  await Enrollment.updateOne({ _id: enrollment._id }, update)
  const updated = await Enrollment.findById(enrollment._id).populate('courseId')
  res.json({ enrollment: serializeEnrollment(updated) })
}))

export default router
