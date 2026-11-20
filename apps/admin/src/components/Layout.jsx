import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, CreditCard, LayoutDashboard, LogOut, Menu, Users, X, ArrowUpRight } from 'lucide-react'
import { clearAdminAccessToken } from '../lib/apiClient'

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard, end: true },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Learners', href: '/learners', icon: Users },
  { name: 'Orders', href: '/orders', icon: CreditCard }
]

const learnerSite = import.meta.env.VITE_WEB_URL || 'http://localhost:5173'

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser') || 'null')
    } catch {
      return null
    }
  })()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const signOut = () => {
    clearAdminAccessToken()
    localStorage.removeItem('adminUser')
    navigate('/')
    window.location.reload()
  }

  const nav = (
    <nav className="flex-1 space-y-1 px-2 py-4" aria-label="Admin">
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 border-l-2 px-3 transition-colors ${
                isActive
                  ? 'border-acid bg-chalk/10 text-chalk'
                  : 'border-transparent text-chalk/45 hover:bg-chalk/5 hover:text-chalk'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{item.name}</span>
          </NavLink>
        )
      })}
      <a
        href={learnerSite}
        className="flex min-h-11 items-center gap-3 border-l-2 border-transparent px-3 text-chalk/45 transition-colors hover:bg-chalk/5 hover:text-chalk"
      >
        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Learner site</span>
      </a>
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-chalk">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-chalk/10 bg-ink text-chalk lg:flex">
        <Link to="/" className="flex h-20 items-center gap-3 border-b border-chalk/10 px-5" aria-label="LearnHub admin">
          <span className="grid h-9 w-9 shrink-0 grid-cols-2 gap-0.5" aria-hidden="true">
            <span className="col-span-1 row-span-2 bg-cobalt" />
            <span className="bg-acid" />
            <span className="border border-chalk" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-tight">LearnHub</span>
            <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-chalk/40">Course ledger</span>
          </span>
        </Link>

        <div className="border-b border-chalk/10 px-5 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-chalk/35">Signed in</p>
          <p className="mt-1 truncate text-sm text-chalk/75">{admin?.name || admin?.email || 'Admin'}</p>
        </div>

        {nav}

        <div className="border-t border-chalk/10 p-2">
          <button
            type="button"
            onClick={signOut}
            className="flex min-h-11 w-full items-center gap-3 border-l-2 border-transparent px-3 text-chalk/50 transition-colors hover:bg-chalk/5 hover:text-acid"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Sign out</span>
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-chalk px-5 lg:hidden">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-8 w-8 grid-cols-2 gap-0.5" aria-hidden="true">
              <span className="col-span-1 row-span-2 bg-cobalt" />
              <span className="bg-acid" />
              <span className="border border-ink" />
            </span>
            <span className="font-display text-lg font-semibold">LearnHub Admin</span>
          </Link>
          <button type="button" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center" aria-label="Open admin menu">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink text-chalk">
              <div className="flex h-16 items-center justify-between border-b border-chalk/10 px-5">
                <span className="font-display text-xl font-semibold">LearnHub Admin</span>
                <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center" aria-label="Close admin menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {nav}
              <div className="border-t border-chalk/10 p-3">
                <button type="button" onClick={signOut} className="flex min-h-11 w-full items-center gap-3 px-3 text-chalk/60">
                  <LogOut className="h-4 w-4" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main>{children}</main>
      </div>
    </div>
  )
}
