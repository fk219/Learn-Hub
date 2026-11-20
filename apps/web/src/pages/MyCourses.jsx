import { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaCircleCheck, FaPlay } from 'react-icons/fa6'
import { apiFetch } from '../lib/apiClient'
import { AuthContext } from '../contexts/AuthContext'
import { courseProgress } from '../lib/course'

export default function MyCourses() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!user) {
      setEnrollments([])
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    setError('')
    apiFetch('/api/me/enrollments')
      .then((result) => {
        if (active) setEnrollments(result.items || [])
      })
      .catch(() => {
        if (active) setError('Your learning record could not be loaded.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user, reloadKey])

  const rows = useMemo(
    () =>
      enrollments.map((item) => {
        const course = item.course
        const progress = courseProgress(course, item.completedLessons || [])
        return { enrollment: item, course, progress }
      }),
    [enrollments]
  )

  const totalLessons = rows.reduce((sum, row) => sum + row.progress.total, 0)
  const completedLessons = rows.reduce((sum, row) => sum + row.progress.completed, 0)
  const overall = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0

  if (authLoading) {
    return (
      <div className="container-studio py-16">
        <div className="h-4 w-28 animate-pulse bg-clay" />
        <div className="mt-6 h-14 w-2/3 animate-pulse bg-clay" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-chalk">
        <div className="container-studio flex min-h-[60vh] items-center py-16">
          <div className="max-w-xl">
            <p className="eyebrow">My learning / Account required</p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink">
              Your route lives with your account.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Sign in to keep lesson progress, return to the next piece of work, and see the routes
              you have started.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signin" className="btn-primary">Sign in</Link>
              <Link to="/signup" className="btn-outline">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-chalk">
      <section className="container-studio pb-14 pt-12 lg:pt-16">
        <div className="flex flex-col justify-between gap-8 border-b border-line pb-9 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">My learning / {user.name || user.email}</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,5.5vw,5.2rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-ink">
              My <span className="italic text-cobalt">route.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              The courses you have started, the next lesson on each, and the work already marked
              complete.
            </p>
          </div>
          <Link to="/courses" className="btn-primary">
            Find another route
            <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <dl className="grid grid-cols-3 border-b border-line">
          {[
            { label: 'Routes', value: rows.length },
            { label: 'Lessons done', value: completedLessons },
            { label: 'Overall', value: `${overall}%` }
          ].map((stat) => (
            <div key={stat.label} className="border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{stat.label}</dt>
              <dd className="mt-1.5 font-display text-3xl font-semibold tabular-nums text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-studio pb-16 lg:pb-24">
        {error ? (
          <div className="border border-line bg-paper p-8">
            <p className="font-display text-2xl text-ink">Your learning record is unavailable.</p>
            <p className="mt-2 text-sm text-muted">{error}</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-outline mt-5">Try again</button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-48 animate-pulse border border-line bg-paper" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="border border-line bg-paper px-6 py-16 text-center">
            <p className="eyebrow">No routes yet</p>
            <p className="mt-4 font-display text-3xl text-ink">Choose a room to start in.</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Open a course, read its route, and enroll. Lesson progress will appear here.
            </p>
            <Link to="/courses" className="btn-primary mt-6">Browse the catalogue</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map(({ enrollment, course, progress }) => (
              <article key={enrollment.id} className="grid gap-5 border border-line bg-paper p-4 sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:p-5">
                <Link to={`/course/${course._id}`} className="block aspect-[4/3] overflow-hidden border border-line bg-clay">
                  <img src={course.imageUrl} alt="" className="h-full w-full object-cover" />
                </Link>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge">{course.category}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                      {progress.completed} / {progress.total} lessons
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink">
                    <Link to={`/course/${course._id}`} className="hover:text-cobalt">{course.title}</Link>
                  </h2>
                  <div className="mt-3 max-w-md">
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progress.percent}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                      <span>{progress.percent}% complete</span>
                      <span>{progress.total - progress.completed} left</span>
                    </div>
                  </div>
                  {progress.nextLesson && (
                    <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                      <FaPlay className="h-2.5 w-2.5 text-cobalt" aria-hidden="true" />
                      Next: {progress.nextLesson.title}
                    </p>
                  )}
                  {!progress.nextLesson && (
                    <p className="mt-3 flex items-center gap-2 text-xs text-cobalt">
                      <FaCircleCheck className="h-3 w-3" aria-hidden="true" />
                      Route complete.
                    </p>
                  )}
                </div>

                <div className="flex sm:justify-end">
                  <Link
                    to={progress.nextLesson ? `/course/${course._id}?lesson=${progress.nextLesson.id}` : `/course/${course._id}`}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {progress.nextLesson ? 'Continue' : 'Review route'}
                    <FaArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
