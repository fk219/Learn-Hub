import { FaArrowUpRightFromSquare } from 'react-icons/fa6'

export default function Contact() {
  return (
    <div className="bg-chalk">
      <section className="container-studio py-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Contact / Portfolio demo</p>
          <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(3rem,6vw,5.4rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            The studio is a demo, but the code is open.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted">
            There is no support desk and no contact form pretending to send a message. LearnHub is a
            portfolio project; the useful way to reach it is through the repository.
          </p>
          <a
            href="https://github.com/fk219/Learn-Hub/issues"
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-8"
          >
            Open an issue
            <FaArrowUpRightFromSquare className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <dl className="mt-12 border-t border-line">
            <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[8rem_1fr]">
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Status</dt>
              <dd className="text-sm text-ink">Portfolio demo · seeded catalogue</dd>
            </div>
            <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[8rem_1fr]">
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Learner data</dt>
              <dd className="text-sm text-ink">Local demo accounts only. Do not enter personal information.</dd>
            </div>
            <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[8rem_1fr]">
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Payments</dt>
              <dd className="text-sm text-ink">None. Enrollment is a demo action.</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
