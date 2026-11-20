import { Link } from 'react-router-dom'
import { FaArrowRight, FaArrowUpRightFromSquare, FaRoute } from 'react-icons/fa6'

const principles = [
  {
    title: 'The route is visible',
    body: 'Modules give the sequence. Lessons name the next action. You should never have to wonder what the course is actually asking you to do.'
  },
  {
    title: 'The work has a kind',
    body: 'Lessons, labs, critiques, and projects are labelled differently because they ask for different kinds of attention.'
  },
  {
    title: 'Progress is earned and kept',
    body: 'A lesson is marked complete by the learner, stored through the API, and used to find the next open piece of work.'
  }
]

const stack = [
  ['Web', 'React 18 · Vite · Tailwind CSS · React Router'],
  ['API', 'Node.js · Express · Zod · JWT'],
  ['Data', 'MongoDB · Mongoose · seeded curriculum'],
  ['Admin', 'React course ledger with real catalogue records']
]

export default function About() {
  return (
    <div className="bg-chalk">
      <section className="container-studio pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">About / The studio</p>
            <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3.2rem,7vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-ink">
              Learning as a <span className="bg-acid px-1">route</span>, not a feed.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted">
              LearnHub is a studio-style LMS. Every course is a sequence of modules and pieces of work:
              a lesson to understand the idea, a lab to use it, a critique to check it, and a project to
              put it together.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              It is also a working portfolio project. The catalogue, enrollment, and lesson progress are
              real records in MongoDB. The course material is seeded demo content.
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border border-line bg-ink p-7 text-chalk">
              <FaRoute className="h-6 w-6 text-acid" aria-hidden="true" />
              <p className="mt-5 font-display text-2xl font-semibold leading-snug tracking-[-0.03em]">
                No fake instructors. No invented ratings. No payment theatre.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-chalk/55">
                The catalogue is seeded and labelled. Enrollment is a demo action. The progress record
                and admin ledger are real.
              </p>
              <a
                href="https://github.com/fk219/Learn-Hub"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 border border-chalk/25 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-chalk/80 transition-colors hover:bg-chalk hover:text-ink"
              >
                View source
                <FaArrowUpRightFromSquare className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 border-t border-line pt-10 md:grid-cols-3">
          {principles.map((principle, index) => (
            <article key={principle.title}>
              <span className="font-mono text-[9px] tracking-[0.14em] text-cobalt">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em]">{principle.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{principle.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Under the hood</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">What is actually running</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              A small MERN monorepo with separate learner and admin surfaces.
            </p>
          </div>
          <dl className="lg:col-span-6 lg:col-start-7">
            {stack.map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[7rem_1fr]">
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{label}</dt>
                <dd className="text-sm text-ink">{value}</dd>
              </div>
            ))}
            <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[7rem_1fr]">
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Demo</dt>
              <dd className="text-sm text-ink">Seeded catalogue · demo enrollment · no real payments</dd>
            </div>
          </dl>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link to="/courses" className="btn-primary">
            Browse the routes
            <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link to="/signup" className="btn-outline">Create a learner account</Link>
        </div>
      </section>
    </div>
  )
}
