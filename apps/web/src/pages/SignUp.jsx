import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { AuthContext } from '../contexts/AuthContext'
import AuthFrame from '../components/AuthFrame'

export default function SignUp() {
  const { register } = useContext(AuthContext)
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
    const form = event.target
    if (form.password.value !== form.confirm.value) {
      setError('The passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register(form.name.value.trim(), form.email.value.trim(), form.password.value)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Could not create the account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFrame
      eyebrow="New learner"
      title="Open a route."
      description="Create an account to enroll, mark lessons complete, and return to the next piece of work."
    >
      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-5">
        <div>
          <label htmlFor="signup-name" className="label">Name</label>
          <input id="signup-name" name="name" type="text" autoComplete="name" required maxLength={100} className="input-field mt-2" placeholder="Your name" />
        </div>

        <div>
          <label htmlFor="signup-email" className="label">Email</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" required className="input-field mt-2" placeholder="you@example.com" />
        </div>

        <div>
          <label htmlFor="signup-password" className="label">Password</label>
          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              className="input-field mt-2 pr-12"
              placeholder="At least 8 characters"
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

        <div>
          <label htmlFor="signup-confirm" className="label">Confirm password</label>
          <input
            id="signup-confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="input-field mt-2"
            placeholder="Repeat the password"
          />
        </div>

        {error && (
          <p className="border border-cobalt/30 bg-cobalt/5 px-4 py-3 text-sm text-cobalt" role="alert">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Creating the account…' : 'Create account'}
        </button>

        <p className="text-sm text-muted">
          Already have an account?{' '}
          <Link to="/signin" state={location.state} className="link-line font-medium text-cobalt">Sign in</Link>
        </p>
      </form>

      <p className="mt-8 max-w-md border-t border-line pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted">
        Demo accounts only · No real payments
      </p>
    </AuthFrame>
  )
}
