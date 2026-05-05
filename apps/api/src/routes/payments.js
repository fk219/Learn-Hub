import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { Course } from '../models/Course.js'
import { Order } from '../models/Order.js'
import { getStripe } from '../config/stripe.js'

const router = Router()

router.use(requireAuth)

const schema = z.object({
  courseIds: z.array(z.string()).min(1),
})

router.post('/checkout', async (req, res, next) => {
  try {
    const { courseIds } = schema.parse(req.body)
    const courses = await Course.find({ _id: { $in: courseIds }, published: true })
    if (courses.length !== courseIds.length) return res.status(400).json({ error: { message: 'Invalid courses' } })

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: courses.map(c => ({
        quantity: 1,
        price_data: {
          currency: c.currency,
          unit_amount: c.priceCents,
          product_data: {
            name: c.title,
            description: c.description,
          },
        },
      })),
      success_url: 'http://localhost:5173/my-courses?success=1',
      cancel_url: 'http://localhost:5173/cart?canceled=1',
      metadata: {
        userId: String(req.user._id),
        courseIds: courses.map(c => String(c._id)).join(','),
      },
    })

    await Order.create({
      userId: req.user._id,
      stripeCheckoutSessionId: session.id,
      amountTotalCents: session.amount_total || 0,
      currency: session.currency || courses[0].currency,
      status: 'pending',
      items: courses.map(c => ({ courseId: c._id, priceCents: c.priceCents })),
    })

    res.json({ checkoutUrl: session.url })
  } catch (e) {
    next(e)
  }
})

export default router
