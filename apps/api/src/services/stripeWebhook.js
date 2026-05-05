import { Enrollment } from '../models/Enrollment.js'
import { Order } from '../models/Order.js'

export async function handleCheckoutCompleted(session) {
  const order = await Order.findOne({ stripeCheckoutSessionId: session.id })
  if (!order) return
  if (order.status === 'paid') return

  order.status = 'paid'
  await order.save()

  for (const item of order.items) {
    try {
      await Enrollment.create({
        userId: order.userId,
        courseId: item.courseId,
        status: 'active',
      })
    } catch {
    }
  }
}

