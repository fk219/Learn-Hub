import request from 'supertest'
import { createApp } from '../src/app.js'
import { Course } from '../src/models/Course.js'
import { Enrollment } from '../src/models/Enrollment.js'
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/testDb.js'

describe('enrollments', () => {
  beforeAll(async () => {
    await connectTestDb()
  })

  beforeEach(async () => {
    await clearTestDb()
  })

  afterAll(async () => {
    await disconnectTestDb()
  })

  test('GET /api/me/enrollments returns active enrollments for current user', async () => {
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

    await Enrollment.create({
      userId: reg.body.user.id,
      courseId: course._id,
      status: 'active',
    })

    const res = await request(app)
      .get('/api/me/enrollments')
      .set('Authorization', `Bearer ${reg.body.accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].course.title).toBe('Published')
  })
})

