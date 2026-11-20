import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/apiClient'

export default function Learners() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/api/admin/users')
      .then((result) => setUsers(result.items || []))
      .catch(() => setError('The learner records could not be loaded.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="admin-page">
      <header className="border-b border-line pb-8">
        <p className="eyebrow">Course ledger / Accounts</p>
        <h1 className="admin-title mt-4">Learners.</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          {loading ? 'Reading accounts…' : `${users.length} ${users.length === 1 ? 'account' : 'accounts'} in this demo.`}
        </p>
      </header>

      {error ? (
        <div className="mt-8 surface p-8">
          <p className="font-display text-2xl">The accounts are unavailable.</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      ) : loading ? (
        <div className="mt-6 space-y-2">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-16 animate-pulse border border-line bg-paper" />)}
        </div>
      ) : (
        <div className="mt-6">
          <div className="hidden grid-cols-[1.2fr_1.6fr_7rem_8rem] gap-4 border-b border-line pb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted md:grid">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
          </div>
          {users.map((user) => (
            <div key={user._id} className="grid gap-2 border-b border-line py-4 md:grid-cols-[1.2fr_1.6fr_7rem_8rem] md:items-center md:gap-4">
              <p className="text-sm text-ink">{user.name || 'Unnamed learner'}</p>
              <p className="truncate font-mono text-[10px] text-muted">{user.email}</p>
              <span className={user.role === 'admin' ? 'badge-acid w-fit' : 'badge w-fit'}>{user.role}</span>
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
