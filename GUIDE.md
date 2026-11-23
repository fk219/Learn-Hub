# LearnHub — Guide

## What it is

LearnHub is a studio-style learning platform built around a route: modules, lessons, labs, and projects. Progress is stored with the learner's account, and the catalogue and enrollments are managed from a separate admin ledger.

- **Learner site:** https://learnhub.furqankhan.dev
- **Admin ledger:** https://learnhub-admin.furqankhan.dev
- **API:** https://learnhub-api-6maa.onrender.com

## Learner flow

1. Open **Courses**.
2. Choose a course.
3. Open a course to read the route, outcomes, modules, and lesson list.
4. Sign in or create an account.
5. Press **Enroll in this course**.
6. Choose a lesson, read its objective, and mark it complete.
7. Open **My learning** to see every started route, the next lesson, and overall progress.

Sign in with the seeded demo learner if you want progress already in place:

- **Email:** `demo@learnhub.example`
- **Password:** `LearnHubDemo123!`

## Admin flow

Sign in with:

- **Email:** `admin@learnhub.example`
- **Password:** `LearnHub123!`

The ledger provides:

- Course and enrollment counts.
- A learner list.
- Course creation and editing.
- Publish/unpublish controls.
- Live enrollment counts.
- The orders view, which explains that demo enrollment does not create a payment.

## What is real

- Courses, modules, lessons, users, and enrollments are stored in MongoDB Atlas.
- Enrollment, lesson completion, and progress hit the live API.
- The admin ledger reads the same API as the learner site.
- Admin-only routes are protected by role.

## Tech

React, Vite, Tailwind CSS, Express, MongoDB Atlas, JWT.

## Honest limits

- Enrollment is a demo action; no payment is taken.
- The Stripe path remains in the API but is not part of the demo enrollment flow.
- The free Render API can cold-start after inactivity.
