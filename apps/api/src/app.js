import express from 'express'
import authRoutes from './routes/auth.js'
import coursesRoutes from './routes/courses.js'
import adminRoutes from './routes/admin.js'
import meRoutes from './routes/me.js'
import paymentsRoutes from './routes/payments.js'
import webhookRoutes from './routes/webhooks.js'

export function createApp() {
  const app = express()

  app.get('/api/health', (req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/webhooks', webhookRoutes)

  app.use(express.json())

  app.use('/api/auth', authRoutes)
  app.use('/api/courses', coursesRoutes)
  app.use('/api/me', meRoutes)
  app.use('/api/payments', paymentsRoutes)
  app.use('/api/admin', adminRoutes)

  app.use((err, req, res, next) => {
    const zodIssues = err?.issues
    if (Array.isArray(zodIssues)) {
      res.status(400).json({ error: { message: 'Validation error' } })
      return
    }
    res.status(500).json({ error: { message: 'Internal server error' } })
  })

  return app
}
