import { useState } from 'react'
import { apiFetch, setAdminAccessToken } from '../lib/apiClient'

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const signIn = async (emailValue, passwordValue) => {
    setError('')
    setLoading(true)
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: emailValue, password: passwordValue })
      })
      if (data.user?.role !== 'admin') {
        setError('This account does not have admin access.')
        return
      }
      setAdminAccessToken(data.accessToken)
      localStorage.setItem('adminUser', JSON.stringify(data.user))
      onSuccess()
    } catch (err) {
      setError(err.message || 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    signIn(email, password)
  }

  const handleDemo = () => signIn('admin@learnhub.example', 'LearnHub123!')

  return (
    <div className="flex min-h-screen flex-col bg-chalk">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <span className="flex items-center gap-3">
            <span className="grid h-9 w-9 grid-cols-2 gap-0.5" aria-hidden="true">
              <span className="col-span-1 row-span-2 bg-cobalt" />
              <span className="bg-acid" />
              <span className="border border-ink" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold tracking-tight">LearnHub</span>
              <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">Course ledger</span>
            </span>
          </span>
          <a href={import.meta.env.VITE_WEB_URL || 'http://localhost:5173'} className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
            Learner site
          </a>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 items-stretch px-5 py-10 sm:px-8 lg:grid-cols-12 lg:py-16">
        <section className="hidden border border-line bg-ink p-10 text-chalk lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-chalk/40">Administration</p>
            <p className="mt-5 max-w-[10ch] font-display text-[clamp(2.6rem,4vw,4rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
              The course ledger, in one room.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-chalk/55">
              Catalogue counts, learners, enrollments, and orders are read from the same API the
              learner site uses.
            </p>
          </div>
          <ol className="space-y-3 border-t border-chalk/15 pt-6">
            {['Publish or retire a course', 'Read real learner and enrollment records', 'No fake revenue or engagement charts'].map((item, index) => (
              <li key={item} className="grid grid-cols-[1.5rem_1fr] gap-3">
                <span className="font-mono text-[9px] text-acid">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm leading-relaxed text-chalk/60">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border border-line bg-paper p-6 sm:p-9 lg:col-span-7">
          <p className="eyebrow">Admin sign in</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,3.6vw,3.4rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
            Open the ledger.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Use the seeded administrator account. Learner accounts cannot open this console.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-5">
            <div>
              <label htmlFor="admin-email" className="label">Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="field mt-2"
                placeholder="admin@learnhub.example"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="label">Password</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="field mt-2"
                placeholder="Your password"
              />
            </div>

            {error && (
              <p className="border border-cobalt/30 bg-cobalt/5 px-4 py-3 text-sm text-cobalt" role="alert">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 max-w-md border border-line bg-chalk p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cobalt">Seeded demo admin</p>
            <dl className="mt-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex gap-2"><dt className="text-muted">Email</dt><dd>admin@learnhub.example</dd></div>
              <div className="flex gap-2"><dt className="text-muted">Password</dt><dd>LearnHub123!</dd></div>
            </dl>
            <button
              type="button"
              onClick={handleDemo}
              disabled={loading}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center border border-ink px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-chalk disabled:opacity-50"
            >
              {loading ? 'Opening the ledger…' : 'Enter demo ledger'}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
