import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa6'

export default function AuthFrame({ eyebrow, title, description, children }) {
  return (
    <div className="container-studio py-10 lg:py-16">
      <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
        <FaArrowLeft className="h-3 w-3" aria-hidden="true" />
        Back to LearnHub
      </Link>

      <div className="mt-8 grid items-stretch border border-line bg-paper lg:grid-cols-12">
        <aside className="hidden border-r border-line bg-ink p-10 text-chalk lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-chalk/40">The route belongs to you</p>
            <p className="mt-5 max-w-[11ch] font-display text-[clamp(2.8rem,4vw,4.2rem)] font-semibold leading-[0.88] tracking-[-0.05em]">
              See where you are. <span className="text-acid">Keep going.</span>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-chalk/55">
              A learner account keeps lesson progress across courses, so the next piece of work is
              waiting when you come back.
            </p>
          </div>

          <ol className="border-t border-chalk/15 pt-6">
            {[
              ['A visible route', 'Modules, lessons, and the work between them.'],
              ['Saved progress', 'Mark a lesson complete and it stays complete.'],
              ['A way back in', 'Continue from the next open lesson, not the beginning.']
            ].map(([heading, body], index) => (
              <li key={heading} className="grid grid-cols-[1.5rem_1fr] gap-3 border-b border-chalk/10 py-3 last:border-b-0">
                <span className="font-mono text-[9px] tracking-[0.12em] text-acid">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block text-sm text-chalk">{heading}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-chalk/45">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </aside>

        <section className="p-6 sm:p-9 lg:col-span-7">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,4vw,3.6rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-ink">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{description}</p>
          {children}
        </section>
      </div>
    </div>
  )
}
