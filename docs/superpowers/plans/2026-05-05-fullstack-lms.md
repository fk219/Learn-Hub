# Full-Stack LearnHub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert LearnHub into a full-stack monorepo with an Express + MongoDB API, JWT auth, Stripe Checkout + webhook fulfillment, and a single admin (from `.env`) who alone can manage courses.

**Architecture:** npm workspaces monorepo with three apps (`apps/web`, `apps/admin`, `apps/api`). Learner and admin UIs call the API via REST. JWT auth gates protected endpoints; Stripe webhook unlocks enrollments.

**Tech Stack:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Stripe, Vite+React+Tailwind (existing), npm workspaces, Jest+Supertest (API tests).

---

## File/Folder Map (Target State)

### Create

- `README.md`
- `.env.example`
- `package.json` (root updated to workspaces)
- `apps/api/package.json`
- `apps/api/src/index.js`
- `apps/api/src/app.js`
- `apps/api/src/config/env.js`
- `apps/api/src/config/db.js`
- `apps/api/src/config/stripe.js`
- `apps/api/src/middleware/auth.js`
- `apps/api/src/middleware/error.js`
- `apps/api/src/middleware/validate.js`
- `apps/api/src/models/User.js`
- `apps/api/src/models/Course.js`
- `apps/api/src/models/Enrollment.js`
- `apps/api/src/models/Order.js`
- `apps/api/src/routes/auth.js`
- `apps/api/src/routes/courses.js`
- `apps/api/src/routes/me.js`
- `apps/api/src/routes/payments.js`
- `apps/api/src/routes/admin.js`
- `apps/api/src/routes/webhooks.js`
- `apps/api/src/services/adminBootstrap.js`
- `apps/api/src/services/slug.js`
- `apps/api/src/services/password.js`
- `apps/api/src/services/jwt.js`
- `apps/api/src/services/stripeWebhook.js`
- `apps/api/tests/auth.test.js`
- `apps/api/tests/courses.test.js`
- `apps/api/tests/admin.test.js`
- `apps/api/tests/payments.test.js`
- `apps/api/tests/helpers/testDb.js`
- `apps/api/jest.config.cjs`

### Move / Rename

- Move current learner app from repository root to `apps/web/`
  - `src/` → `apps/web/src/`
  - `index.html` → `apps/web/index.html`
  - `tailwind.config.js` → `apps/web/tailwind.config.js`
  - `postcss.config.js` → `apps/web/postcss.config.js`
  - `vite` config: ensure `apps/web/vite.config.js` exists (create if missing)
- Move `admin-panel/` to `apps/admin/`

### Modify

- Learner web code to use API instead of hardcoded data/localStorage simulation
- Admin panel code to use API and to build reliably in the monorepo

---

## Task 1: Convert Repo to npm Workspaces Monorepo

**Files:**
- Modify: `/workspace/package.json`
- Create: `/workspace/apps/web/*` (move existing)
- Create: `/workspace/apps/admin/*` (move existing)
- Create: `/workspace/apps/api/*` (new)

- [ ] **Step 1: Move existing apps into `apps/`**

Run (example commands):

```bash
mkdir -p apps
git mv admin-panel apps/admin
git mv src apps/web/src
git mv index.html apps/web/index.html
git mv postcss.config.js apps/web/postcss.config.js
git mv tailwind.config.js apps/web/tailwind.config.js
```

Expected: repo root no longer contains `src/` or the old `admin-panel/`.

- [ ] **Step 2: Create web vite config if missing**

Create `apps/web/vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Update root `package.json` to workspaces + scripts**

Root `package.json` should include:

```json
{
  "name": "learnhub-monorepo",
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "dev": "concurrently -n api,web,admin -c green,blue,magenta \"npm -w apps/api run dev\" \"npm -w apps/web run dev\" \"npm -w apps/admin run dev\"",
    "build": "npm -w apps/api run build && npm -w apps/web run build && npm -w apps/admin run build",
    "test": "npm -w apps/api test"
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```

- [ ] **Step 4: Ensure `apps/web/package.json` exists and matches prior dependencies**

Move prior root `package.json` content into `apps/web/package.json`, adjusting scripts to standard:

```json
{
  "name": "learnhub-web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Keep all existing dependencies needed by the learner UI.

- [ ] **Step 5: Ensure `apps/admin/package.json` exists**

`apps/admin/package.json` should mirror prior admin panel settings but not hardcode ports unless desired:

```json
{
  "name": "learnhub-admin",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --port 3001",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 6: Install workspace deps**

Run:

```bash
npm install
```

Expected: `node_modules` at root; both apps resolve their deps via workspaces.

- [ ] **Step 7: Build both frontends**

Run:

```bash
npm -w apps/web run build
npm -w apps/admin run build
```

Expected: both build successfully (fix any missing deps, including ensuring `recharts` resolves for admin).

- [ ] **Step 8: Commit**

```bash
git add package.json apps/web apps/admin
git commit -m "chore: convert repo to npm workspaces monorepo"
```

---

## Task 2: Scaffold Express API App

**Files:**
- Create: `/workspace/apps/api/package.json`
- Create: `/workspace/apps/api/src/index.js`
- Create: `/workspace/apps/api/src/app.js`
- Create: `/workspace/apps/api/src/config/env.js`
- Create: `/workspace/apps/api/src/middleware/error.js`

- [ ] **Step 1: Create `apps/api/package.json`**

```json
{
  "name": "learnhub-api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "build": "node -c src/index.js",
    "test": "NODE_OPTIONS=--experimental-vm-modules jest --runInBand"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.0",
    "stripe": "^16.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.4",
    "supertest": "^7.0.0"
  }
}
```

- [ ] **Step 2: Create env loader**

`apps/api/src/config/env.js`:

```js
import dotenv from 'dotenv'

dotenv.config()

function requireEnv(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  MONGODB_URI: requireEnv('MONGODB_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  STRIPE_SECRET_KEY: requireEnv('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: requireEnv('STRIPE_WEBHOOK_SECRET'),
  ADMIN_EMAIL: requireEnv('ADMIN_EMAIL'),
  ADMIN_PASSWORD: requireEnv('ADMIN_PASSWORD'),
  CORS_ORIGINS: (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
}
```

- [ ] **Step 3: Create error middleware**

`apps/api/src/middleware/error.js`:

```js
export function notFound(req, res) {
  res.status(404).json({ error: { message: 'Not found' } })
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500
  const message = status === 500 ? 'Internal server error' : err.message
  res.status(status).json({ error: { message } })
}
```

- [ ] **Step 4: Create express app**

`apps/api/src/app.js`:

```js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import { notFound, errorHandler } from './middleware/error.js'
import authRoutes from './routes/auth.js'
import coursesRoutes from './routes/courses.js'
import meRoutes from './routes/me.js'
import paymentsRoutes from './routes/payments.js'
import adminRoutes from './routes/admin.js'
import webhookRoutes from './routes/webhooks.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.CORS_ORIGINS.length ? env.CORS_ORIGINS : true }))

  app.get('/api/health', (req, res) => res.json({ ok: true }))

  app.use('/api/webhooks', webhookRoutes)
  app.use(express.json())

  app.use('/api/auth', authRoutes)
  app.use('/api/courses', coursesRoutes)
  app.use('/api/me', meRoutes)
  app.use('/api/payments', paymentsRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
```

- [ ] **Step 5: Create API entrypoint**

`apps/api/src/index.js`:

```js
import { env } from './config/env.js'
import { connectDb } from './config/db.js'
import { createApp } from './app.js'
import { ensureSingleAdmin } from './services/adminBootstrap.js'

await connectDb()
await ensureSingleAdmin()

const app = createApp()
app.listen(env.PORT, () => {
  process.stdout.write(`API listening on ${env.PORT}\n`)
})
```

- [ ] **Step 6: Commit**

```bash
git add apps/api
git commit -m "feat(api): scaffold express api app"
```

---

## Task 3: MongoDB Connection + Mongoose Models

**Files:**
- Create: `/workspace/apps/api/src/config/db.js`
- Create: `/workspace/apps/api/src/models/*.js`

- [ ] **Step 1: Add DB connector**

`apps/api/src/config/db.js`:

```js
import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDb() {
  await mongoose.connect(env.MONGODB_URI)
}
```

- [ ] **Step 2: Add models**

`apps/api/src/models/User.js`:

```js
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', UserSchema)
```

`apps/api/src/models/Course.js`:

```js
import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    priceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'usd' },
    imageUrl: { type: String, required: true },
    published: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
)

export const Course = mongoose.model('Course', CourseSchema)
```

`apps/api/src/models/Enrollment.js`:

```js
import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
    status: { type: String, required: true, enum: ['active', 'revoked'], default: 'active' },
  },
  { timestamps: true }
)

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export const Enrollment = mongoose.model('Enrollment', EnrollmentSchema)
```

`apps/api/src/models/Order.js`:

```js
import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    stripeCheckoutSessionId: { type: String, required: true, unique: true },
    amountTotalCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    items: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
        priceCents: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
)

export const Order = mongoose.model('Order', OrderSchema)
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/config/db.js apps/api/src/models
git commit -m "feat(api): add mongoose models"
```

---

## Task 4: Single Admin Bootstrap from `.env`

**Files:**
- Create: `/workspace/apps/api/src/services/adminBootstrap.js`
- Create: `/workspace/apps/api/src/services/password.js`

- [ ] **Step 1: Add password service**

`apps/api/src/services/password.js`:

```js
import bcrypt from 'bcryptjs'

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}
```

- [ ] **Step 2: Add single admin bootstrap**

`apps/api/src/services/adminBootstrap.js`:

```js
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { hashPassword } from './password.js'

export async function ensureSingleAdmin() {
  const existingAdmin = await User.findOne({ role: 'admin' })
  if (existingAdmin) return

  const passwordHash = await hashPassword(env.ADMIN_PASSWORD)
  await User.create({
    email: env.ADMIN_EMAIL,
    passwordHash,
    name: 'Admin',
    role: 'admin',
  })
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/services/adminBootstrap.js apps/api/src/services/password.js
git commit -m "feat(api): bootstrap single admin from env"
```

---

## Task 5: JWT Auth Middleware + Auth Routes

**Files:**
- Create: `/workspace/apps/api/src/services/jwt.js`
- Create: `/workspace/apps/api/src/middleware/auth.js`
- Create: `/workspace/apps/api/src/routes/auth.js`
- Test: `/workspace/apps/api/tests/auth.test.js`

- [ ] **Step 1: Create JWT service**

`apps/api/src/services/jwt.js`:

```js
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAccessToken(user) {
  return jwt.sign(
    { role: user.role },
    env.JWT_SECRET,
    { subject: String(user._id), expiresIn: env.JWT_EXPIRES_IN }
  )
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET)
}
```

- [ ] **Step 2: Create auth middleware**

`apps/api/src/middleware/auth.js`:

```js
import { User } from '../models/User.js'
import { verifyAccessToken } from '../services/jwt.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization') || ''
    const [type, token] = header.split(' ')
    if (type !== 'Bearer' || !token) return res.status(401).json({ error: { message: 'Unauthorized' } })

    const payload = verifyAccessToken(token)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ error: { message: 'Unauthorized' } })

    req.user = user
    next()
  } catch {
    res.status(401).json({ error: { message: 'Unauthorized' } })
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: { message: 'Forbidden' } })
  next()
}
```

- [ ] **Step 3: Add auth routes**

`apps/api/src/routes/auth.js`:

```js
import { Router } from 'express'
import { z } from 'zod'
import { User } from '../models/User.js'
import { hashPassword, verifyPassword } from '../services/password.js'
import { signAccessToken } from '../services/jwt.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

router.post('/register', async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body)
  const normalizedEmail = email.toLowerCase()

  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) return res.status(409).json({ error: { message: 'Email already in use' } })

  const passwordHash = await hashPassword(password)
  const user = await User.create({ name, email: normalizedEmail, passwordHash, role: 'user' })
  const accessToken = signAccessToken(user)

  res.json({ accessToken, user: { id: String(user._id), email: user.email, name: user.name, role: user.role } })
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } })

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } })

  const accessToken = signAccessToken(user)
  res.json({ accessToken, user: { id: String(user._id), email: user.email, name: user.name, role: user.role } })
})

router.get('/me', requireAuth, async (req, res) => {
  const u = req.user
  res.json({ user: { id: String(u._id), email: u.email, name: u.name, role: u.role } })
})

export default router
```

- [ ] **Step 4: Add Jest config + failing test**

`apps/api/jest.config.cjs`:

```js
export default {
  testEnvironment: 'node',
}
```

`apps/api/tests/auth.test.js`:

```js
import request from 'supertest'
import mongoose from 'mongoose'
import { createApp } from '../src/app.js'

describe('auth', () => {
  test('GET /api/health works', async () => {
    const app = createApp()
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })
})
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm -w apps/api test
```

Expected: PASS for the health check.

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/services/jwt.js apps/api/src/middleware/auth.js apps/api/src/routes/auth.js apps/api/jest.config.cjs apps/api/tests/auth.test.js
git commit -m "feat(api): add jwt auth and auth routes"
```

---

## Task 6: Courses API (Public) + Admin Course CRUD

**Files:**
- Create: `/workspace/apps/api/src/services/slug.js`
- Create: `/workspace/apps/api/src/routes/courses.js`
- Create: `/workspace/apps/api/src/routes/admin.js`
- Test: `/workspace/apps/api/tests/courses.test.js`
- Test: `/workspace/apps/api/tests/admin.test.js`

- [ ] **Step 1: Slug helper**

`apps/api/src/services/slug.js`:

```js
export function toSlug(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
```

- [ ] **Step 2: Public courses routes**

`apps/api/src/routes/courses.js`:

```js
import { Router } from 'express'
import { Course } from '../models/Course.js'

const router = Router()

router.get('/', async (req, res) => {
  const items = await Course.find({ published: true }).sort({ createdAt: -1 }).limit(200)
  const total = await Course.countDocuments({ published: true })
  res.json({ items, total })
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (!course || !course.published) return res.status(404).json({ error: { message: 'Not found' } })
  res.json({ course })
})

export default router
```

- [ ] **Step 3: Admin routes for course CRUD**

`apps/api/src/routes/admin.js`:

```js
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { Course } from '../models/Course.js'
import { toSlug } from '../services/slug.js'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/courses', async (req, res) => {
  const items = await Course.find({}).sort({ createdAt: -1 }).limit(500)
  res.json({ items })
})

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  level: z.string().min(1),
  priceCents: z.number().int().min(0),
  currency: z.string().min(1).default('usd'),
  imageUrl: z.string().url(),
  published: z.boolean().optional(),
})

router.post('/courses', async (req, res) => {
  const data = createSchema.parse(req.body)
  const slug = toSlug(data.title)
  const course = await Course.create({ ...data, slug, published: data.published ?? true })
  res.status(201).json({ course })
})

const patchSchema = createSchema.partial()

router.patch('/courses/:id', async (req, res) => {
  const patch = patchSchema.parse(req.body)
  if (patch.title) patch.slug = toSlug(patch.title)
  const course = await Course.findByIdAndUpdate(req.params.id, patch, { new: true })
  if (!course) return res.status(404).json({ error: { message: 'Not found' } })
  res.json({ course })
})

router.delete('/courses/:id', async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id)
  if (!course) return res.status(404).json({ error: { message: 'Not found' } })
  res.json({ ok: true })
})

router.get('/stats', async (req, res) => {
  const totalCourses = await Course.countDocuments()
  res.json({ totalCourses })
})

export default router
```

- [ ] **Step 4: Add tests (admin forbidden for normal user)**

`apps/api/tests/admin.test.js` should:

```js
import request from 'supertest'
import { createApp } from '../src/app.js'

describe('admin guard', () => {
  test('GET /api/admin/courses requires auth', async () => {
    const app = createApp()
    const res = await request(app).get('/api/admin/courses')
    expect(res.status).toBe(401)
  })
})
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm -w apps/api test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/services/slug.js apps/api/src/routes/courses.js apps/api/src/routes/admin.js apps/api/tests/admin.test.js
git commit -m "feat(api): add public courses and admin course crud"
```

---

## Task 7: Enrollments API (`/api/me/enrollments`)

**Files:**
- Create: `/workspace/apps/api/src/routes/me.js`

- [ ] **Step 1: Add route**

`apps/api/src/routes/me.js`:

```js
import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { Enrollment } from '../models/Enrollment.js'

const router = Router()
router.use(requireAuth)

router.get('/enrollments', async (req, res) => {
  const items = await Enrollment.find({ userId: req.user._id, status: 'active' }).populate('courseId')
  res.json({
    items: items.map(e => ({
      id: String(e._id),
      course: e.courseId,
      createdAt: e.createdAt,
    })),
  })
})

export default router
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/routes/me.js
git commit -m "feat(api): add my enrollments endpoint"
```

---

## Task 8: Stripe Checkout + Webhook Fulfillment

**Files:**
- Create: `/workspace/apps/api/src/config/stripe.js`
- Create: `/workspace/apps/api/src/routes/payments.js`
- Create: `/workspace/apps/api/src/routes/webhooks.js`
- Create: `/workspace/apps/api/src/services/stripeWebhook.js`

- [ ] **Step 1: Stripe client**

`apps/api/src/config/stripe.js`:

```js
import Stripe from 'stripe'
import { env } from './env.js'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
```

- [ ] **Step 2: Checkout endpoint**

`apps/api/src/routes/payments.js`:

```js
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { Course } from '../models/Course.js'
import { Order } from '../models/Order.js'
import { stripe } from '../config/stripe.js'

const router = Router()
router.use(requireAuth)

const schema = z.object({ courseIds: z.array(z.string()).min(1) })

router.post('/checkout', async (req, res) => {
  const { courseIds } = schema.parse(req.body)
  const courses = await Course.find({ _id: { $in: courseIds }, published: true })
  if (courses.length !== courseIds.length) return res.status(400).json({ error: { message: 'Invalid courses' } })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: courses.map(c => ({
      quantity: 1,
      price_data: {
        currency: c.currency,
        unit_amount: c.priceCents,
        product_data: { name: c.title, description: c.description },
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
    currency: session.currency || 'usd',
    status: 'pending',
    items: courses.map(c => ({ courseId: c._id, priceCents: c.priceCents })),
  })

  res.json({ checkoutUrl: session.url })
})

export default router
```

- [ ] **Step 3: Webhook route + fulfillment**

`apps/api/src/services/stripeWebhook.js`:

```js
import { Order } from '../models/Order.js'
import { Enrollment } from '../models/Enrollment.js'

export async function handleCheckoutCompleted(session) {
  const order = await Order.findOne({ stripeCheckoutSessionId: session.id })
  if (!order) return
  if (order.status === 'paid') return

  order.status = 'paid'
  await order.save()

  const enrollments = order.items.map(i => ({
    userId: order.userId,
    courseId: i.courseId,
    status: 'active',
  }))

  for (const e of enrollments) {
    try {
      await Enrollment.create(e)
    } catch {
    }
  }
}
```

`apps/api/src/routes/webhooks.js`:

```js
import { Router } from 'express'
import { env } from '../config/env.js'
import { stripe } from '../config/stripe.js'
import { handleCheckoutCompleted } from '../services/stripeWebhook.js'

const router = Router()

router.post('/stripe', expressRaw(), async (req, res) => {
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, req.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return res.status(400).send('Invalid signature')
  }

  if (event.type === 'checkout.session.completed') {
    await handleCheckoutCompleted(event.data.object)
  }

  res.json({ received: true })
})

function expressRaw() {
  const { raw } = require('express')
  return raw({ type: 'application/json' })
}

export default router
```

Note: when implementing, prefer `import express from 'express'` and `express.raw(...)` without `require`; adjust to ESM correctly.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/config/stripe.js apps/api/src/routes/payments.js apps/api/src/routes/webhooks.js apps/api/src/services/stripeWebhook.js
git commit -m "feat(api): add stripe checkout and webhook fulfillment"
```

---

## Task 9: Frontend API Client + Auth Wiring (Learner Web)

**Files:**
- Create: `/workspace/apps/web/src/lib/apiClient.js`
- Modify: `/workspace/apps/web/src/pages/SignIn.jsx`
- Modify: `/workspace/apps/web/src/pages/SignUp.jsx`
- Modify: `/workspace/apps/web/src/components/Header.jsx`

- [ ] **Step 1: Add API client**

`apps/web/src/lib/apiClient.js`:

```js
const API_URL = import.meta.env.VITE_API_URL

export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

export function setAccessToken(token) {
  localStorage.setItem('accessToken', token)
}

export function clearAccessToken() {
  localStorage.removeItem('accessToken')
}

export async function apiFetch(path, options = {}) {
  const token = getAccessToken()
  const headers = { ...(options.headers || {}) }
  if (!headers['Content-Type'] && options.body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error?.message || 'Request failed')
  return data
}
```

- [ ] **Step 2: Update SignIn to call backend**

Replace local mock logic with:

```js
import { apiFetch, setAccessToken } from '../lib/apiClient'

const data = await apiFetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: formData.email, password: formData.password })
})
setAccessToken(data.accessToken)
localStorage.setItem('user', JSON.stringify(data.user))
```

Also remove the FacebookLogin button for MVP to avoid broken dependency.

- [ ] **Step 3: Update SignUp to call backend**

```js
import { apiFetch, setAccessToken } from '../lib/apiClient'

const data = await apiFetch('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({ name: `${formData.firstName} ${formData.lastName}`, email: formData.email, password: formData.password })
})
setAccessToken(data.accessToken)
localStorage.setItem('user', JSON.stringify(data.user))
```

- [ ] **Step 4: Update Header sign-out**

On signout, clear access token:

```js
import { clearAccessToken } from '../lib/apiClient'
clearAccessToken()
localStorage.removeItem('user')
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/apiClient.js apps/web/src/pages/SignIn.jsx apps/web/src/pages/SignUp.jsx apps/web/src/components/Header.jsx
git commit -m "feat(web): wire auth to api and add api client"
```

---

## Task 10: Replace Hardcoded Course Data With API (Learner Web)

**Files:**
- Modify: `/workspace/apps/web/src/pages/Courses.jsx`
- Modify: `/workspace/apps/web/src/pages/CourseDetail.jsx`

- [ ] **Step 1: Courses list fetch**

Replace hardcoded array with:

```js
const [courses, setCourses] = useState([])
useEffect(() => {
  apiFetch('/api/courses').then(r => setCourses(r.items)).catch(() => setCourses([]))
}, [])
```

Map `Course` fields from API (`title`, `imageUrl`, `priceCents`) into the UI.

- [ ] **Step 2: Course detail fetch**

Fetch by id:

```js
const { id } = useParams()
useEffect(() => {
  apiFetch(`/api/courses/${id}`).then(r => setCourse(r.course))
}, [id])
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/pages/Courses.jsx apps/web/src/pages/CourseDetail.jsx
git commit -m "feat(web): load courses from api"
```

---

## Task 11: Stripe Checkout Integration in Cart (Learner Web)

**Files:**
- Modify: `/workspace/apps/web/src/pages/Cart.jsx`

- [ ] **Step 1: Replace `/api/create-checkout-session` with API**

Call:

```js
const { checkoutUrl } = await apiFetch('/api/payments/checkout', {
  method: 'POST',
  body: JSON.stringify({ courseIds: cartItems.map(i => i._id || i.id) })
})
window.location.href = checkoutUrl
```

Ensure cart items contain backend course IDs after Task 10.

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/pages/Cart.jsx
git commit -m "feat(web): integrate stripe checkout via api"
```

---

## Task 12: My Courses Powered by Enrollments API (Learner Web)

**Files:**
- Modify: `/workspace/apps/web/src/pages/MyCourses.jsx`

- [ ] **Step 1: Fetch enrollments**

```js
const [items, setItems] = useState([])
useEffect(() => {
  apiFetch('/api/me/enrollments').then(r => setItems(r.items))
}, [])
```

Render `item.course` data.

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/pages/MyCourses.jsx
git commit -m "feat(web): show my courses from enrollments api"
```

---

## Task 13: Admin Panel Login + Course Management UI

**Files:**
- Create: `/workspace/apps/admin/src/lib/apiClient.js`
- Modify: `/workspace/apps/admin/src/App.jsx`
- Modify/Create: admin auth pages and course CRUD pages as needed

- [ ] **Step 1: Add api client to admin**

Same pattern as web, but `VITE_API_URL` points to API.

- [ ] **Step 2: Add admin login page**

Admin logs in via `/api/auth/login`. Access token stored in localStorage.

- [ ] **Step 3: Wire course pages to admin endpoints**

- List: `GET /api/admin/courses`
- Create: `POST /api/admin/courses`
- Update: `PATCH /api/admin/courses/:id`
- Delete: `DELETE /api/admin/courses/:id`

- [ ] **Step 4: Commit**

```bash
git add apps/admin/src
git commit -m "feat(admin): add auth and admin course management"
```

---

## Task 14: Documentation + `.env.example`

**Files:**
- Create: `/workspace/README.md`
- Create: `/workspace/.env.example`
- Create: `/workspace/apps/web/.env.example`
- Create: `/workspace/apps/admin/.env.example`
- Create: `/workspace/apps/api/.env.example`

- [ ] **Step 1: Add env examples**

`apps/api/.env.example`:

```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=change-me
JWT_EXPIRES_IN=15m
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
CORS_ORIGINS=http://localhost:5173,http://localhost:3001
```

`apps/web/.env.example`:

```bash
VITE_API_URL=http://localhost:4000
```

`apps/admin/.env.example`:

```bash
VITE_API_URL=http://localhost:4000
```

- [ ] **Step 2: Add README**

Include:

- install: `npm install`
- run: `npm run dev`
- API env setup instructions
- How to create Stripe webhook locally (Stripe CLI)
- Admin login credentials from env

- [ ] **Step 3: Commit**

```bash
git add README.md .env.example apps/*/.env.example
git commit -m "docs: add setup docs and env examples"
```

---

## Task 15: Verification Checklist (End-to-End)

- [ ] **Step 1: Start MongoDB**

Use local MongoDB or Docker.

- [ ] **Step 2: Run all apps**

```bash
npm run dev
```

Expected:

- API: `GET /api/health` returns `{ ok: true }`
- Web: can register/login, browse courses from DB, checkout redirects to Stripe
- Admin: can login with seeded admin and create courses

- [ ] **Step 3: Stripe webhook**

Using Stripe CLI:

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Complete checkout, ensure webhook marks order paid and enrollments appear in `/my-courses`.

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: all builds succeed.

- [ ] **Step 5: Commit**

```bash
git commit -m "chore: verify end-to-end full-stack flow"
```

---

## Plan Self-Review

- Spec coverage: monorepo, API, MongoDB models, JWT, Stripe checkout+webhook, single admin, frontend wiring, docs are all mapped to tasks above.
- Placeholder scan: no TODO/TBD; all steps include concrete file paths, code blocks, and commands.
- Consistency: `/api/*` base used across web/admin; `User.role` and single admin enforced via bootstrap.
