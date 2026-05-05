## Full-Stack LearnHub (Monorepo) Design Spec

### Goal

Convert the current frontend-only LearnHub project into a full-stack LMS with:

- Express API + MongoDB backend
- Email/password authentication using JWT
- Stripe Checkout payments + webhook fulfillment
- A single admin account (credentials stored in `.env`) that is the only actor allowed to manage courses
- Two frontends:
  - Learner web app (existing `/src`)
  - Admin panel (existing `/admin-panel`)

Non-goals (for MVP):

- Instructor self-service course creation
- Video hosting/streaming pipeline
- Complex roles/permissions beyond `user` and `admin`
- Multi-tenant admin / multiple admins

### Current State Summary

- Learner web app is Vite + React + Tailwind (root)
- Admin panel is Vite + React + Tailwind (`admin-panel/`)
- Data is currently mocked/hardcoded in UI
- Auth is currently simulated with `localStorage`
- Stripe checkout uses a placeholder key and calls a non-existent endpoint

### Proposed Repository Structure

Use npm workspaces monorepo:

- `apps/web` (move existing root learner app here)
- `apps/admin` (move existing `admin-panel` here)
- `apps/api` (new Express API)
- `packages/shared` (optional, shared types/validators)

Root scripts run all apps in dev and build all apps in CI.

### Tech Choices

- API: Node.js + Express
- DB: MongoDB + Mongoose
- Auth: bcrypt password hashing + JWT access tokens
- Payments: Stripe Checkout + Stripe webhook
- Validation: Zod (recommended) or minimal custom validation for MVP
- Dev: concurrently for running multiple apps, nodemon for API

### Environment Variables

Root `.env` for local dev (not committed) and `.env.example` for documentation.

API (`apps/api/.env`):

- `PORT=4000`
- `MONGODB_URI=mongodb://...`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=15m`
- `STRIPE_SECRET_KEY=...`
- `STRIPE_WEBHOOK_SECRET=...`
- `ADMIN_EMAIL=admin@example.com`
- `ADMIN_PASSWORD=ChangeMe123!`
- `CORS_ORIGINS=http://localhost:5173,http://localhost:3001` (final values depend on dev ports)

Web (`apps/web/.env`):

- `VITE_API_URL=http://localhost:4000`
- `VITE_STRIPE_PUBLISHABLE_KEY=...`

Admin (`apps/admin/.env`):

- `VITE_API_URL=http://localhost:4000`

### Data Model (MongoDB)

#### User

- `_id`
- `email` (unique, lowercase)
- `passwordHash` (nullable for future OAuth; for MVP required for all)
- `name`
- `role` enum: `user | admin`
- `createdAt`, `updatedAt`

Constraints:

- Only one `admin` user exists in the system (enforced by bootstrap logic + defensive checks).

#### Course

- `_id`
- `title`
- `slug` (unique, derived from title)
- `description`
- `category`
- `level`
- `priceCents`
- `currency` (default `usd`)
- `imageUrl`
- `published` boolean
- `createdAt`, `updatedAt`

#### Enrollment

- `_id`
- `userId`
- `courseId`
- `status` enum: `active | revoked`
- `createdAt`, `updatedAt`

Unique compound index:

- `(userId, courseId)` unique

#### Order

- `_id`
- `userId`
- `stripeCheckoutSessionId` (unique)
- `amountTotalCents`
- `currency`
- `status` enum: `pending | paid | failed | refunded`
- `items`: array of `{ courseId, priceCents }`
- `createdAt`, `updatedAt`

### Admin Bootstrap (Single Admin)

Admin is not created via public registration.

On API startup:

- Read `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment
- Ensure there is exactly one admin:
  - If no admin exists, create one using those credentials (hash password)
  - If an admin exists:
    - Do not create another admin
    - Optionally ensure the admin email matches `ADMIN_EMAIL` (MVP: log a non-sensitive warning if mismatch; do not auto-change password)

Public registration always creates `role=user`.

### API Design

Base URL: `/api`

#### Auth

- `POST /api/auth/register`
  - body: `{ name, email, password }`
  - creates `role=user`
  - returns: `{ accessToken, user }`
- `POST /api/auth/login`
  - body: `{ email, password }`
  - returns: `{ accessToken, user }`
- `GET /api/auth/me`
  - header: `Authorization: Bearer <token>`
  - returns: `{ user }`

JWT claims:

- `sub` = user id
- `role` = `user|admin`

#### Courses (public/learner)

- `GET /api/courses`
  - query: `search`, `category`, `level`, `sort`
  - returns: `{ items, total }`
- `GET /api/courses/:id`
  - returns: `{ course }`

#### Enrollments (learner)

- `GET /api/me/enrollments`
  - returns: `{ items }`

#### Payments (learner)

- `POST /api/payments/checkout`
  - auth required
  - body: `{ courseIds: string[] }`
  - creates Stripe Checkout session and an `Order` with `pending` status
  - returns: `{ checkoutUrl }` or `{ sessionId }` depending on frontend integration

#### Stripe Webhook (server-to-server)

- `POST /api/webhooks/stripe`
  - verifies signature using `STRIPE_WEBHOOK_SECRET`
  - on `checkout.session.completed`:
    - mark matching `Order` as `paid`
    - create `Enrollment` records for purchased courses
  - idempotent behavior:
    - ignore if `Order` already marked `paid`

#### Admin (admin-only)

Auth required + role check.

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PATCH /api/admin/courses/:id`
- `DELETE /api/admin/courses/:id`

### Frontend Integration Changes

#### Learner Web (apps/web)

- Replace hardcoded courses with API calls to `/api/courses`
- Replace `localStorage`-based auth simulation with backend auth:
  - Store JWT access token (MVP: localStorage; later improvement: httpOnly cookie + refresh)
  - Add `apiClient` wrapper with `Authorization` header
- Replace cart checkout call:
  - call `POST /api/payments/checkout` with selected courseIds
  - redirect to returned Stripe checkout URL
- “My Courses” page reads enrollments from `GET /api/me/enrollments`
- Remove Facebook login UI for MVP (or implement later as real OAuth)
- Google OAuth remains out of scope for MVP (can be added later)

#### Admin Panel (apps/admin)

- Admin login uses the same `/api/auth/login`
- Admin views call `/api/admin/*` endpoints with JWT auth
- Fix build reproducibility by moving to workspaces and ensuring `recharts` resolves correctly
- Remove dynamic Tailwind class generation patterns or safelist them (avoid production CSS missing)

### Error Handling & Security Baselines

- Passwords hashed with bcrypt
- JWT secret required and never logged
- Stripe webhook signature verification is mandatory
- CORS restricted to known origins in dev
- Rate limiting recommended on auth routes (optional for MVP)
- No secrets committed; provide `.env.example`

### Testing Strategy (MVP)

- API:
  - Unit tests for auth + role middleware
  - Integration tests for key routes (login, list courses, checkout session creation)
- Frontend:
  - Minimal component tests for auth forms or API client (optional)

### Acceptance Criteria (What “Done” Means)

- `apps/api` runs and connects to MongoDB with a seeded single admin from `.env`
- Student can register/login, list courses from DB, checkout via Stripe, and after webhook their purchased courses show in “My Courses”
- Admin can login and create/update/delete courses from admin panel (persisted to MongoDB)
- Monorepo scripts can install once at root and build all apps successfully
- `README.md` explains setup, env vars, and local dev commands
