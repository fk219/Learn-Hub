import request from 'supertest'
import { createApp } from '../src/app.js'
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/testDb.js'
import { User } from '../src/models/User.js'
import { Course } from '../src/models/Course.js'
import { Order } from '../src/models/Order.js'
import { Enrollment } from '../src/models/Enrollment.js'
import { hashPassword } from '../src/services/password.js'
import { handleCheckoutCompleted } from '../src/services/stripeWebhook.js'

describe('payments', () => {
  beforeAll(async () => {
    await connectTestDb()
  })

  beforeEach(async () => {
    await clearTestDb()
  })

  afterAll(async () => {
    await disconnectTestDb()
  })

  test('POST /api/payments/checkout requires auth', async () => {
    const app = createApp()
    const res = await request(app).post('/api/payments/checkout').send({ courseIds: [] })
    expect(res.status).toBe(401)
  })

  test('POST /api/payments/checkout creates order and returns checkoutUrl (mock stripe)', async () => {
    process.env.STRIPE_MOCK = '1'

    const app = createApp()
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    const course = await Course.create({
      title: 'Published',
      slug: 'published',
      description: 'd',
      category: 'technology',
      level: 'beginner',
      priceCents: 1000,
      currency: 'usd',
      imageUrl: 'https://example.com/1.jpg',
      published: true,
    })

    const res = await request(app)
      .post('/api/payments/checkout')
      .set('Authorization', `Bearer ${reg.body.accessToken}`)
      .send({ courseIds: [String(course._id)] })

    expect(res.status).toBe(200)
    expect(typeof res.body.checkoutUrl).toBe('string')

    const orders = await Order.find({})
    expect(orders).toHaveLength(1)
    expect(orders[0].status).toBe('pending')
  })

  test('handleCheckoutCompleted marks order paid and creates enrollments', async () => {
    const user = await User.create({
      email: 'u@example.com',
      passwordHash: await hashPassword('ChangeMe123!'),
      name: 'U',
      role: 'user',
    })

    const c1 = await Course.create({
      title: 'Published',
      slug: 'published',
      description: 'd',
      category: 'technology',
      level: 'beginner',
      priceCents: 1000,
      currency: 'usd',
      imageUrl: 'https://example.com/1.jpg',
      published: true,
    })

    const order = await Order.create({
      userId: user._id,
      stripeCheckoutSessionId: 'cs_test_123',
      amountTotalCents: 1000,
      currency: 'usd',
      status: 'pending',
      items: [{ courseId: c1._id, priceCents: 1000 }],
    })

    await handleCheckoutCompleted({ id: 'cs_test_123' })

    const updated = await Order.findById(order._id)
    expect(updated.status).toBe('paid')

    const enrollments = await Enrollment.find({ userId: user._id })
    expect(enrollments).toHaveLength(1)
    expect(String(enrollments[0].courseId)).toBe(String(c1._id))
  })

  test('POST /api/webhooks/stripe can fulfill order in mock mode', async () => {
    process.env.STRIPE_MOCK = '1'
    const app = createApp()

    const user = await User.create({
      email: 'u2@example.com',
      passwordHash: await hashPassword('ChangeMe123!'),
      name: 'U2',
      role: 'user',
    })

    const c1 = await Course.create({
      title: 'Published',
      slug: 'published',
      description: 'd',
      category: 'technology',
      level: 'beginner',
      priceCents: 1000,
      currency: 'usd',
      imageUrl: 'https://example.com/1.jpg',
      published: true,
    })

    await Order.create({
      userId: user._id,
      stripeCheckoutSessionId: 'cs_test_999',
      amountTotalCents: 1000,
      currency: 'usd',
      status: 'pending',
      items: [{ courseId: c1._id, priceCents: 1000 }],
    })

    const res = await request(app).post('/api/webhooks/stripe').send({
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test_999' } },
    })

    expect(res.status).toBe(200)

    const updated = await Order.findOne({ stripeCheckoutSessionId: 'cs_test_999' })
    expect(updated.status).toBe('paid')
  })
})
