import express from 'express'
import { Router } from 'express'
import { getStripe } from '../config/stripe.js'
import { handleCheckoutCompleted } from '../services/stripeWebhook.js'

const router = Router()

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const isMock = process.env.STRIPE_MOCK === '1'
    let event

    if (isMock) {
      event = JSON.parse(req.body.toString('utf8'))
    } else {
      const signature = req.get('stripe-signature')
      if (!signature) return res.status(400).send('Missing signature')
      const secret = process.env.STRIPE_WEBHOOK_SECRET
      if (!secret) return res.status(500).send('Missing webhook secret')
      const stripe = getStripe()
      event = stripe.webhooks.constructEvent(req.body, signature, secret)
    }

    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object)
    }

    res.json({ received: true })
  } catch (e) {
    next(e)
  }
})

export default router

