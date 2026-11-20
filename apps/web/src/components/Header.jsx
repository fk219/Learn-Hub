import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaBars, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { label: 'Courses', to: '/courses' },
  { label: 'My learning', to: '/my-courses' },
  { label: 'About', to: '/about' }
]

function navClass({ isActive }) {
  return `font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
    isActive ? 'text-cobalt' : 'text-muted hover:text-ink'
  }`
}

export default function Header() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (menuOpen) {
      if (typeof dialog.showModal === 'function') dialog.showModal()
      else dialog.setAttribute('open', '')
      document.body.style.overflow = 'hidden'
      closeRef.current?.focus()
    } else {
      if (typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const submitSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/courses?search=${encodeURIComponent(query)}` : '/courses')
    setSearch('')
    setMenuOpen(false)
  }

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-chalk">
      <div className="container-studio flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="LearnHub home">
          <span className="grid h-9 w-9 shrink-0 grid-cols-2 gap-0.5" aria-hidden="true">
            <span className="col-span-1 row-span-2 bg-cobalt" />
            <span className="bg-acid" />
            <span className="border border-ink" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">LearnHub</span>
            <span className="mt-1 hidden font-mono text-[8px] uppercase tracking-[0.2em] text-muted sm:block">
              Learn by making
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form role="search" onSubmit={submitSearch} className="relative hidden w-56 xl:block">
          <label htmlFor="header-search" className="sr-only">Search courses</label>
          <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="header-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses"
            className="min-h-10 w-full border border-line bg-paper pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-cobalt focus:outline-none"
          />
        </form>

        <div className="hidden items-center gap-3 lg:flex">
          {!loading && (user ? (
            <>
              <Link to="/my-courses" className="link-line font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
                {user.name || user.email}
              </Link>
              <span className="h-3 w-px bg-line" aria-hidden="true" />
              <button
                type="button"
                onClick={handleSignOut}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-cobalt"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary min-h-10 px-4 py-2">
                Start learning
              </Link>
            </>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="learnhub-menu"
        >
          <FaBars className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="learnhub-menu"
        aria-label="Site menu"
        onClose={() => setMenuOpen(false)}
        className="m-0 h-full w-full max-w-none border-0 bg-chalk p-0 text-ink backdrop:bg-chalk lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="container-studio flex h-16 items-center justify-between border-b border-line">
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 grid-cols-2 gap-0.5" aria-hidden="true">
                <span className="col-span-1 row-span-2 bg-cobalt" />
                <span className="bg-acid" />
                <span className="border border-ink" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">LearnHub</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-ink"
              aria-label="Close menu"
            >
              <FaXmark className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="container-studio flex flex-1 flex-col justify-center py-8">
            <form role="search" onSubmit={submitSearch} className="mb-8">
              <label htmlFor="mobile-search" className="sr-only">Search courses</label>
              <div className="relative">
                <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  id="mobile-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search the course catalogue"
                  className="input-field pl-10"
                />
              </div>
            </form>

            <nav aria-label="Mobile primary" className="flex flex-col">
              {navItems.map((item, index) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-baseline gap-4 border-b border-line py-5 font-display text-4xl font-semibold tracking-[-0.03em] transition-colors hover:text-cobalt"
                >
                  <span className="font-mono text-[10px] tracking-[0.16em] text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="container-studio border-t border-line py-6">
            {!loading && (user ? (
              <>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Signed in as</p>
                <p className="mt-1 text-sm text-ink">{user.name || user.email}</p>
                <div className="mt-4 grid gap-2">
                  <Link to="/my-courses" className="btn-primary">My learning</Link>
                  <button type="button" onClick={handleSignOut} className="btn-outline">Sign out</button>
                </div>
              </>
            ) : (
              <div className="grid gap-2">
                <Link to="/signup" className="btn-primary">
                  Create an account
                  <FaArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
                <Link to="/signin" className="btn-outline">Sign in</Link>
              </div>
            ))}
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Portfolio demo · Seeded course catalogue
            </p>
          </div>
        </div>
      </dialog>
    </header>
  )
}
