# LearnHub Full-Stack LMS (Monorepo)

## Apps

- `apps/api`: Express + MongoDB API (JWT auth, Stripe Checkout + webhook, single admin)
- `apps/web`: Learner web app (Vite + React)
- `apps/admin`: Admin panel (Vite + React)

## Prerequisites

- Node.js + npm
- MongoDB running locally (or a MongoDB URI)

## Setup

1. Install dependencies

```bash
npm install
```

2. Create env files

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```

3. Update `apps/api/.env`

- Set `MONGODB_URI`
- Set `JWT_SECRET`
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- For local demo checkout without Stripe, keep `STRIPE_MOCK=1`

## Run (Dev)

```bash
npm run dev
```

Default ports:

- API: `http://localhost:4000`
- Web: `http://localhost:5173`
- Admin: `http://localhost:3001`

## Admin Access

The API bootstraps exactly one admin user from:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Use those credentials to sign in to the admin panel.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```

