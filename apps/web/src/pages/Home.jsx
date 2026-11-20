import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaCircleCheck, FaCode, FaPenNib, FaRoute } from 'react-icons/fa6'
import { apiFetch } from '../lib/apiClient'
import { flattenLessons } from '../lib/course'
import CourseCard from '../components/CourseCard'

const principles = [
  {
    number: '01',
    title: 'See the route',
    body: 'Every course opens as a map of modules and lessons, not an endless video list. You can see where the work is going.',
  },
  {
    number: '02',
    title: 'Do the lesson',
    body: 'Lessons, labs, critiques, and projects are different kinds of work. Each one names the thing you should be able to do afterwards.',
  },
  {
    number: '03',
    title: 'Keep the proof',
    body: 'Mark a lesson complete and your route remembers. Progress is stored with your account, not in a browser tab.',
  },
]

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    apiFetch('/api/courses')
      .then((result) => {
        if (active) setCourses(result.items || [])
      })
      .catch(() => {
        if (active) setError('The course catalogue could not be loaded.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  const featured = courses.slice(0, 3)
  const routeCourse = courses.find((course) => (course.modules || []).length >= 3) || courses[0]
  const routeLessons = routeCourse ? flattenLessons(routeCourse) : []
  const workTypes = courses.reduce(
    (counts, course) => {
      for (const lesson of flattenLessons(course)) {
        counts[lesson.kind] = (counts[lesson.kind] || 0) + 1
      }
      return counts
    },
    {}
  )

  return (
    <div className="bg-chalk">
      <section className="container-studio pb-16 pt-12 lg:pb-24 lg:pt-20" aria-labelledby="home-title">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow">A studio, not a content library</p>
            <h1
              id="home-title"
              className="mt-6 max-w-[10ch] font-display text-[clamp(3.4rem,7.5vw,7rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-ink"
            >
              Learn by <span className="bg-acid px-1">making</span> the thing.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Short, specific courses in design, code, data, and writing. Each one is a route: modules,
              lessons, and real work you can finish and mark off.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/courses" className="btn-primary">
                Browse the routes
                <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <a href="#route" className="btn-outline">
                How the route works
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-5 font-mono text-[9px] uppercase tracking-[0.13em] text-muted">
              <span className="inline-flex items-center gap-2">
                <FaRoute className="h-3 w-3 text-cobalt" aria-hidden="true" />
                A real curriculum map
              </span>
              <span className="inline-flex items-center gap-2">
                <FaCircleCheck className="h-3 w-3 text-cobalt" aria-hidden="true" />
                Saved lesson progress
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-ink bg-ink p-6 text-chalk sm:p-8">
              <div className="flex items-center justify-between border-b border-chalk/15 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-chalk/45">
                  Route preview
                </span>
                <span className="badge-acid">{routeCourse?.level || 'Studio'}</span>
              </div>

              {loading ? (
                <div className="mt-6 space-y-4">
                  <div className="h-7 w-2/3 animate-pulse bg-chalk/10" />
                  <div className="h-20 animate-pulse bg-chalk/10" />
                  <div className="h-20 animate-pulse bg-chalk/10" />
                </div>
              ) : routeCourse ? (
                <>
                  <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.035em]">
                    {routeCourse.title}
                  </h2>
                  <p className="mt-2 text-sm text-chalk/55">
                    {(routeCourse.modules || []).length} modules · {routeLessons.length} lessons
                  </p>

                  <ol className="mt-6 space-y-0">
                    {(routeCourse.modules || []).slice(0, 4).map((module, index) => {
                      const moduleLessons = module.lessons || []
                      return (
                        <li key={module.title} className="relative grid grid-cols-[2rem_1fr] gap-4 pb-5 last:pb-0">
                          {index < Math.min(4, (routeCourse.modules || []).length) - 1 && (
                            <span className="absolute left-[0.95rem] top-8 h-[calc(100%-1.5rem)] w-px bg-chalk/15" aria-hidden="true" />
                          )}
                          <span
                            className={`relative z-10 flex h-8 w-8 items-center justify-center border font-mono text-[10px] ${
                              index === 0
                                ? 'border-acid bg-acid text-ink'
                                : 'border-chalk/30 bg-ink text-chalk/60'
                            }`}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm leading-snug text-chalk">{module.title}</p>
                            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-chalk/40">
                              {moduleLessons.length} lessons
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ol>

                  <Link
                    to={`/course/${routeCourse._id}`}
                    className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-acid transition-colors hover:text-chalk"
                  >
                    Open this route
                    <FaArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </>
              ) : (
                <div className="mt-6">
                  <p className="text-sm text-chalk/60">No courses are published yet.</p>
                  <Link to="/courses" className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.12em] text-acid">
                    Visit the catalogue
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="route" className="scroll-mt-24 border-y border-line bg-paper py-16 lg:py-20" aria-labelledby="route-title">
        <div className="container-studio grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">The signature route</p>
            <h2 id="route-title" className="mt-3 max-w-[10ch] font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
              A course that shows its work.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
              The route is the product. Modules give the sequence, lessons give the next action, and
              your progress stays attached to the account.
            </p>
          </div>

          <ol className="lg:col-span-7 lg:col-start-6">
            {principles.map((principle) => (
              <li key={principle.number} className="grid gap-4 border-t border-line py-6 last:border-b sm:grid-cols-[2.5rem_1fr]">
                <span className="font-mono text-[10px] tracking-[0.14em] text-cobalt">{principle.number}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{principle.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-studio py-16 lg:py-24" aria-labelledby="catalogue-title">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Open routes</p>
            <h2 id="catalogue-title" className="mt-3 font-display text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[0.94] tracking-[-0.04em]">
              Choose your next room.
            </h2>
          </div>
          <Link to="/courses" className="link-line font-mono text-[10px] uppercase tracking-[0.14em] text-cobalt">
            View the catalogue
          </Link>
        </div>

        {error ? (
          <div className="mt-8 border border-line bg-paper p-8">
            <p className="font-display text-2xl text-ink">The catalogue is unavailable.</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              The course request failed. This is a server problem, not an empty catalogue.
            </p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-outline mt-5">
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border border-line bg-paper">
                <div className="aspect-[4/3] animate-pulse bg-clay" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 animate-pulse bg-clay" />
                  <div className="h-6 w-2/3 animate-pulse bg-clay" />
                  <div className="h-3 w-1/2 animate-pulse bg-clay" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course, index) => (
              <CourseCard key={course._id} course={course} priority={index === 0} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-line bg-ink py-16 text-chalk lg:py-20" aria-labelledby="work-title">
        <div className="container-studio grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-chalk/40">The work in the room</p>
            <h2 id="work-title" className="mt-4 max-w-[11ch] font-display text-[clamp(2.6rem,4.6vw,4.4rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
              Lessons, labs, critiques, projects.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-chalk/55">
              Not every lesson should be a video. The route names the kind of work so you know what
              you are sitting down to do.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {[
              { key: 'lesson', icon: FaCode, label: 'Lesson', body: 'A focused explanation and a small thing to notice.' },
              { key: 'lab', icon: FaPenNib, label: 'Lab', body: 'Make something with the idea while it is still fresh.' },
              { key: 'critique', icon: FaCircleCheck, label: 'Critique', body: 'Look at the work against a clear decision.' },
              { key: 'project', icon: FaRoute, label: 'Project', body: 'Put the whole route together in one finished slice.' }
            ].map(({ key, icon: Icon, label, body }) => (
              <div key={key} className="border-t border-chalk/15 pt-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl font-semibold">{label}</h3>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-acid">
                    {workTypes[key] || 0} in catalogue
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-chalk/50">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-studio py-16 lg:py-24" aria-labelledby="cta-title">
        <div className="flex flex-col justify-between gap-8 border-b border-line pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Start with one route</p>
            <h2 id="cta-title" className="mt-3 font-display text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
              Pick a room. Do the next lesson.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Create a learner account to keep progress, or browse the full catalogue first. The demo
              catalogue and lesson data are seeded; your progress is real.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/courses" className="btn-primary">Browse courses</Link>
            <Link to="/signup" className="btn-outline">Create an account</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
