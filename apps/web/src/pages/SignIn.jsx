import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { AuthContext } from '../contexts/AuthContext'
import AuthFrame from '../components/AuthFrame'

export default function SignIn() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from
  const destination = from ? `${from.pathname}${from.search || ''}` : '/my-courses'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(event.target.email.value.trim(), event.target.password.value)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setError('')
    setLoading(true)
    try {
      await login('demo@learnhub.example', 'LearnHubDemo123!')
      navigate('/my-courses', { replace: true })
    } catch (err) {
      setError(err.message || 'Demo learner unavailable.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame
      eyebrow="Learner sign in"
      title="Return to the route."
      description="Your progress, enrollments, and next lesson are waiting."
    >
      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-5">
        <div>
          <label htmlFor="signin-email" className="label">Email</label>
          <input id="signin-email" name="email" type="email" autoComplete="email" required className="input-field mt-2" placeholder="you@example.com" />
        </div>

        <div>
          <label htmlFor="signin-password" className="label">Password</label>
          <div className="relative">
            <input
              id="signin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="input-field mt-2 pr-12"
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-0 top-2 flex h-12 w-12 items-center justify-center text-muted transition-colors hover:text-ink"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="border border-cobalt/30 bg-cobalt/5 px-4 py-3 text-sm text-cobalt" role="alert">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm text-muted">
          New here?{' '}
          <Link to="/signup" state={location.state} className="link-line font-medium text-cobalt">Create an account</Link>
        </p>
      </form>

      <div className="mt-8 max-w-md border border-line bg-chalk p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cobalt">Seeded demo learner</p>
        <dl className="mt-3 space-y-1.5 font-mono text-[11px] text-ink">
          <div className="flex flex-wrap gap-x-2"><dt className="text-muted">Email</dt><dd>demo@learnhub.example</dd></div>
          <div className="flex flex-wrap gap-x-2"><dt className="text-muted">Password</dt><dd>LearnHubDemo123!</dd></div>
        </dl>
        <button
          type="button"
          onClick={handleDemo}
          disabled={loading}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center border border-ink px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-chalk disabled:opacity-50"
        >
          {loading ? 'Opening the route…' : 'Enter as demo learner'}
        </button>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">Seeded progress only. Do not enter personal information.</p>
      </div>
    </AuthFrame>
  )
}
