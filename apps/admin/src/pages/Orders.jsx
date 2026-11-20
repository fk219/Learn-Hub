import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/apiClient'

function money(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((cents || 0) / 100)
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/api/admin/orders')
      .then((result) => setOrders(result.items || []))
      .catch(() => setError('The order records could not be loaded.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="admin-page">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">Course ledger / Payments</p>
        <h1 className="admin-title mt-4">Orders.</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          Learner enrollment is a demo action and does not create a payment. Any records here come from
          the optional Stripe checkout path.
        </p>
      </header>

      {error ? (
        <div className="mt-8 surface p-8">
          <p className="font-display text-2xl">The orders are unavailable.</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      ) : loading ? (
        <div className="mt-6 space-y-2">
          {Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-20 animate-pulse border border-line bg-paper" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 border border-line bg-paper px-6 py-16 text-center">
          <p className="eyebrow">No payments</p>
          <p className="mt-4 font-display text-3xl">Nothing has been charged.</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            The learner app enrolls directly for the demo. The Stripe endpoints remain in the API, but
            they are not part of the enrollment flow.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="hidden grid-cols-[1fr_1.2fr_8rem_8rem] gap-4 border-b border-line pb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted md:grid">
            <span>Customer</span>
            <span>Courses</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {orders.map((order) => (
            <div key={order._id} className="grid gap-2 border-b border-line py-4 md:grid-cols-[1fr_1.2fr_8rem_8rem] md:items-center md:gap-4">
              <div>
                <p className="text-sm text-ink">{order.userId?.name || order.userId?.email || 'Unknown learner'}</p>
                <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
              <p className="truncate text-sm text-muted">
                {(order.items || []).map((item) => item.courseId?.title || 'Course').join(', ')}
              </p>
              <p className="font-mono text-sm tabular-nums">{money(order.amountTotalCents)}</p>
              <span className={order.status === 'paid' ? 'badge-acid w-fit' : 'badge w-fit'}>{order.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
