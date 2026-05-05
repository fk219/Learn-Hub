import Stripe from 'stripe'

let cached

function mockStripe() {
  return {
    checkout: {
      sessions: {
        create: async (params) => {
          const id = `cs_mock_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
          const currency = params?.line_items?.[0]?.price_data?.currency || 'usd'
          const amountTotal = (params?.line_items || []).reduce((sum, li) => {
            const unit = li?.price_data?.unit_amount || 0
            const qty = li?.quantity || 1
            return sum + unit * qty
          }, 0)

          return {
            id,
            url: `http://localhost:5173/mock-checkout/${id}`,
            amount_total: amountTotal,
            currency,
          }
        },
      },
    },
  }
}

export function getStripe() {
  if (process.env.STRIPE_MOCK === '1') return mockStripe()
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY')
  if (!cached) cached = new Stripe(key, { apiVersion: '2024-06-20' })
  return cached
}

