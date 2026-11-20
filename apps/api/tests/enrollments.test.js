import request from 'supertest'
import { createApp } from '../src/app.js'
import { Course } from '../src/models/Course.js'
import { Enrollment } from '../src/models/Enrollment.js'
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/testDb.js'

function coursePayload(overrides = {}) {
  return {
    title: 'Published',
    slug: 'published',
    description: 'd',
    category: 'technology',
    level: 'beginner',
    priceCents: 1000,
    currency: 'usd',
    imageUrl: '/courses/product-design.svg',
    published: true,
    durationWeeks: 4,
    outcomes: ['Do the work'],
    modules: [
      {
        title: 'Start',
        summary: 'The first module',
        lessons: [
          { id: 'start-1', title: 'First lesson', kind: 'lesson', minutes: 15, objective: 'Understand the idea.' },
          { id: 'start-2', title: 'First lab', kind: 'lab', minutes: 30, objective: 'Use the idea.' }
        ]
      }
    ],
    ...overrides
  }
}

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

    const course = await Course.create(coursePayload())

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

  test('enrolls directly and saves lesson progress', async () => {
    const app = createApp()
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Sam',
      email: 'sam@example.com',
      password: 'ChangeMe123!',
    })
    const course = await Course.create(coursePayload())

    const enrolled = await request(app)
      .post('/api/me/enrollments')
      .set('Authorization', `Bearer ${reg.body.accessToken}`)
      .send({ courseId: String(course._id) })

    expect(enrolled.status).toBe(201)
    expect(enrolled.body.enrollment.completedLessons).toEqual([])

    const completed = await request(app)
      .put(`/api/me/enrollments/${course._id}/progress`)
      .set('Authorization', `Bearer ${reg.body.accessToken}`)
      .send({ lessonId: 'start-1', completed: true })

    expect(completed.status).toBe(200)
    expect(completed.body.enrollment.completedLessons).toContain('start-1')
    expect(completed.body.enrollment.lastLessonId).toBe('start-1')

    const reopened = await request(app)
      .put(`/api/me/enrollments/${course._id}/progress`)
      .set('Authorization', `Bearer ${reg.body.accessToken}`)
      .send({ lessonId: 'start-1', completed: false })

    expect(reopened.body.enrollment.completedLessons).not.toContain('start-1')
  })

  test('rejects enrollment without auth and unknown lessons', async () => {
    const app = createApp()
    const course = await Course.create(coursePayload())

    const anonymous = await request(app)
      .post('/api/me/enrollments')
      .send({ courseId: String(course._id) })
    expect(anonymous.status).toBe(401)

    const reg = await request(app).post('/api/auth/register').send({
      name: 'Nia',
      email: 'nia@example.com',
      password: 'ChangeMe123!',
    })
    await request(app)
      .post('/api/me/enrollments')
      .set('Authorization', `Bearer ${reg.body.accessToken}`)
      .send({ courseId: String(course._id) })

    const unknown = await request(app)
      .put(`/api/me/enrollments/${course._id}/progress`)
      .set('Authorization', `Bearer ${reg.body.accessToken}`)
      .send({ lessonId: 'not-a-lesson', completed: true })
    expect(unknown.status).toBe(400)
  })
})
