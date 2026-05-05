import request from 'supertest'
import { createApp } from '../src/app.js'
import { Course } from '../src/models/Course.js'
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/testDb.js'

describe('courses', () => {
  beforeAll(async () => {
    await connectTestDb()
  })

  beforeEach(async () => {
    await clearTestDb()
  })

  afterAll(async () => {
    await disconnectTestDb()
  })

  test('GET /api/courses returns only published courses', async () => {
    await Course.create({
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

    await Course.create({
      title: 'Draft',
      slug: 'draft',
      description: 'd',
      category: 'technology',
      level: 'beginner',
      priceCents: 2000,
      currency: 'usd',
      imageUrl: 'https://example.com/2.jpg',
      published: false,
    })

    const app = createApp()
    const res = await request(app).get('/api/courses')
    expect(res.status).toBe(200)
    expect(res.body.total).toBe(1)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].title).toBe('Published')
  })

  test('GET /api/courses/:id returns course by id when published', async () => {
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

    const app = createApp()
    const res = await request(app).get(`/api/courses/${course._id}`)
    expect(res.status).toBe(200)
    expect(res.body.course.title).toBe('Published')
  })
})

