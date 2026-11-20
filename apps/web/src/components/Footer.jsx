import { Link } from 'react-router-dom'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'

const links = [
  { label: 'Courses', to: '/courses' },
  { label: 'My learning', to: '/my-courses' },
  { label: 'About', to: '/about' }
]

export default function Footer() {
  return (
    <footer className="border-t border-ink bg-ink text-chalk">
      <div className="container-studio grid gap-12 py-16 md:grid-cols-[1.7fr_1fr_1fr] lg:py-20">
        <div>
          <Link to="/" className="inline-flex items-center gap-3" aria-label="LearnHub home">
            <span className="grid h-10 w-10 grid-cols-2 gap-0.5" aria-hidden="true">
              <span className="col-span-1 row-span-2 bg-cobalt" />
              <span className="bg-acid" />
              <span className="border border-chalk" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">LearnHub</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-chalk/60">
            A studio-style learning platform built around a route: see where you are, finish the next
            lesson, and keep the progress.
          </p>
          <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-chalk/35">
            Portfolio demo · Seeded catalogue · No real payments
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-chalk/40">Explore</h2>
          <ul className="mt-5 space-y-3">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-chalk/70 transition-colors hover:text-chalk">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-chalk/40">Source</h2>
          <p className="mt-5 text-sm leading-relaxed text-chalk/60">
            React, Express, MongoDB. The course catalogue, enrollment, and lesson progress are backed
            by the API.
          </p>
          <a
            href="https://github.com/fk219/Learn-Hub"
            target="_blank"
            rel="noreferrer"
            className="link-line mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-chalk/70 transition-colors hover:text-chalk"
          >
            GitHub
            <FaArrowUpRightFromSquare className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="border-t border-chalk/10">
        <div className="container-studio flex flex-col justify-between gap-3 py-6 font-mono text-[9px] uppercase tracking-[0.14em] text-chalk/40 sm:flex-row">
          <span>© {new Date().getFullYear()} LearnHub</span>
          <span>Built by Furqan</span>
        </div>
      </div>
    </footer>
  )
}
