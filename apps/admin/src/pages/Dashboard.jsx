import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CreditCard, Users } from 'lucide-react'
import { apiFetch } from '../lib/apiClient'

function formatMoney(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((cents || 0) / 100)
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [statsResult, coursesResult, enrollmentsResult] = await Promise.all([
        apiFetch('/api/admin/stats'),
        apiFetch('/api/admin/courses'),
        apiFetch('/api/admin/enrollments')
      ])
      setStats(statsResult)
      setCourses(coursesResult.items || [])
      setEnrollments(enrollmentsResult.items || [])
    } catch {
      setError('The ledger could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const enrollmentCounts = enrollments.reduce((counts, enrollment) => {
    const title = enrollment.courseId?.title || 'Unknown course'
    counts[title] = (counts[title] || 0) + 1
    return counts
  }, {})

  return (
    <div className="admin-page">
      <header className="flex flex-col justify-between gap-6 border-b border-line pb-8 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">Course ledger / Overview</p>
          <h1 className="admin-title mt-4 max-w-[14ch]">
            The ledger, <span className="bg-acid px-1">open.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            Real catalogue, learner, and enrollment records from the same API the learner site uses.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/courses" className="btn-primary">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Manage courses
          </Link>
          <Link to="/learners" className="btn-outline">
            View learners
          </Link>
        </div>
      </header>

      {error ? (
        <div className="mt-8 surface p-8">
          <p className="font-display text-2xl text-ink">The ledger is unavailable.</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
          <button type="button" onClick={() => void load()} className="btn-outline mt-5">Try again</button>
        </div>
      ) : loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse border border-line bg-paper" />
          ))}
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 border-b border-line xl:grid-cols-4">
            {[
              { label: 'Courses', value: stats?.courses || 0, note: `${stats?.publishedCourses || 0} published` },
              { label: 'Learners', value: stats?.users || 0, note: 'all accounts' },
              { label: 'Enrollments', value: stats?.enrollments || 0, note: 'active routes' },
              { label: 'Revenue', value: formatMoney(stats?.revenueCents), note: `${stats?.paidOrders || 0} paid orders` }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`border-b border-line py-5 pr-4 even:border-l even:pl-4 xl:border-b-0 xl:border-r xl:px-6 xl:first:pl-0 xl:last:border-r-0 xl:even:border-l-0`}
              >
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{stat.label}</dt>
                <dd className="mt-2 font-display text-3xl font-semibold tabular-nums text-ink">{stat.value}</dd>
                <dd className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">{stat.note}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 grid gap-10 xl:grid-cols-12">
            <section className="xl:col-span-7" aria-labelledby="catalogue-title">
              <div className="flex items-end justify-between border-b border-line pb-3">
                <h2 id="catalogue-title" className="font-display text-2xl font-semibold">Catalogue</h2>
                <Link to="/courses" className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted hover:text-ink">
                  All courses <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>
              <div>
                {courses.slice(0, 6).map((course) => {
                  const enrollmentCount = enrollmentCounts[course.title] || 0
                  const lessonCount = (course.modules || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0)
                  return (
                    <div key={course._id} className="grid gap-3 border-b border-line py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={course.published ? 'badge-acid' : 'badge'}>{course.published ? 'Published' : 'Draft'}</span>
                          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">{course.category}</span>
                        </div>
                        <p className="mt-1.5 truncate font-display text-lg font-semibold leading-tight">{course.title}</p>
                        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                          {lessonCount} lessons · {enrollmentCount} enrolled
                        </p>
                      </div>
                      <Link to="/courses" className="font-mono text-[9px] uppercase tracking-[0.12em] text-cobalt hover:text-ink">Manage</Link>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="xl:col-span-4 xl:col-start-9" aria-labelledby="enrollments-title">
              <div className="flex items-end justify-between border-b border-line pb-3">
                <h2 id="enrollments-title" className="font-display text-2xl font-semibold">Recent enrollments</h2>
                <Users className="h-4 w-4 text-muted" aria-hidden="true" />
              </div>
              {enrollments.length === 0 ? (
                <p className="border-b border-line py-8 text-sm text-muted">No enrollment records yet.</p>
              ) : (
                <div>
                  {enrollments.slice(0, 6).map((enrollment) => (
                    <div key={enrollment._id} className="border-b border-line py-4">
                      <p className="text-sm text-ink">{enrollment.userId?.name || enrollment.userId?.email || 'Learner'}</p>
                      <p className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                        {enrollment.courseId?.title || 'Course'} · {(enrollment.completedLessons || []).length} done
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-5 border border-line p-4">
                <p className="label">Orders</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {stats?.orders ? `${stats.orders} order records.` : 'No orders. Learner enrollment is a demo action and does not create a payment.'}
                </p>
                <Link to="/orders" className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cobalt">
                  Order records <CreditCard className="h-2.5 w-2.5" />
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
