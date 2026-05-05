import request from 'supertest'
import { createApp } from '../src/app.js'
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/testDb.js'

describe('auth', () => {
  beforeAll(async () => {
    await connectTestDb()
  })

  beforeEach(async () => {
    await clearTestDb()
  })

  afterAll(async () => {
    await disconnectTestDb()
  })

  test('POST /api/auth/register creates a user and returns accessToken', async () => {
    const app = createApp()
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    expect(res.status).toBe(200)
    expect(typeof res.body.accessToken).toBe('string')
    expect(res.body.user).toMatchObject({
      email: 'alice@example.com',
      name: 'Alice',
      role: 'user',
    })
  })

  test('POST /api/auth/login returns accessToken for valid credentials', async () => {
    const app = createApp()
    await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    expect(res.status).toBe(200)
    expect(typeof res.body.accessToken).toBe('string')
    expect(res.body.user.email).toBe('alice@example.com')
  })

  test('GET /api/auth/me returns current user for valid token', async () => {
    const app = createApp()
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe('alice@example.com')
  })

  test('GET /api/auth/me rejects invalid token', async () => {
    const app = createApp()
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here')
    expect(res.status).toBe(401)
  })

  test('register rejects duplicate email', async () => {
    const app = createApp()
    await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice 2',
      email: 'alice@example.com',
      password: 'ChangeMe123!',
    })

    expect(res.status).toBe(409)
  })

  test('register validates input', async () => {
    const app = createApp()
    const res = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'not-an-email',
      password: 'short',
    })
    expect(res.status).toBe(400)
  })
})
