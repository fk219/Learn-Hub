import request from 'supertest'
import { createApp } from '../src/app.js'
import { ensureSingleAdmin } from '../src/services/adminBootstrap.js'
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/testDb.js'

describe('admin', () => {
  beforeAll(async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com'
    process.env.ADMIN_PASSWORD = 'ChangeMe123!'
    await connectTestDb()
  })

  beforeEach(async () => {
    await clearTestDb()
  })

  afterAll(async () => {
    await disconnectTestDb()
  })

  test('ensureSingleAdmin creates exactly one admin', async () => {
    await ensureSingleAdmin()
    await ensureSingleAdmin()

    const app = createApp()
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'ChangeMe123!',
    })

    expect(res.status).toBe(200)
    expect(res.body.user.role).toBe('admin')
  })

  test('admin course creation requires admin token', async () => {
    const app = createApp()
    await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    const login = await request(app).post('/api/auth/login').send({
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    const forbidden = await request(app)
      .post('/api/admin/courses')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        title: 't',
        description: 'd',
        category: 'technology',
        level: 'beginner',
        priceCents: 1000,
        currency: 'usd',
        imageUrl: 'https://example.com/1.jpg',
        published: true,
      })

    expect(forbidden.status).toBe(403)
  })

  test('admin can create course', async () => {
    await ensureSingleAdmin()
    const app = createApp()

    const login = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'ChangeMe123!',
    })

    const created = await request(app)
      .post('/api/admin/courses')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        title: 'React 101',
        description: 'd',
        category: 'technology',
        level: 'beginner',
        priceCents: 1000,
        currency: 'usd',
        imageUrl: 'https://example.com/1.jpg',
        published: true,
      })

    expect(created.status).toBe(201)
    expect(created.body.course.title).toBe('React 101')
    expect(created.body.course.slug).toBe('react-101')
  })

  test('admin can list courses', async () => {
    await ensureSingleAdmin()
    const app = createApp()

    const login = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'ChangeMe123!',
    })

    await request(app)
      .post('/api/admin/courses')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        title: 'React 101',
        description: 'd',
        category: 'technology',
        level: 'beginner',
        priceCents: 1000,
        currency: 'usd',
        imageUrl: 'https://example.com/1.jpg',
        published: true,
      })

    const res = await request(app)
      .get('/api/admin/courses')
      .set('Authorization', `Bearer ${login.body.accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].title).toBe('React 101')
  })
})
