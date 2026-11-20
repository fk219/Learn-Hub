import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCircleCheck,
  FaCirclePlay,
  FaPenNib,
  FaRoute
} from 'react-icons/fa6'
import { apiFetch } from '../lib/apiClient'
import { AuthContext } from '../contexts/AuthContext'
import { courseProgress, flattenLessons, formatPrice } from '../lib/course'

const KIND_META = {
  lesson: { label: 'Lesson', icon: FaCirclePlay },
  lab: { label: 'Lab', icon: FaPenNib },
  critique: { label: 'Critique', icon: FaCircleCheck },
  project: { label: 'Project', icon: FaRoute }
}

export default function CourseDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLessonId, setSelectedLessonId] = useState(searchParams.get('lesson') || '')
  const [selectionTouched, setSelectionTouched] = useState(Boolean(searchParams.get('lesson')))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')

  const loadCourse = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const courseResult = await apiFetch(`/api/courses/${id}`)
      setCourse(courseResult.course)

      if (user) {
        try {
          const enrollmentResult = await apiFetch('/api/me/enrollments')
          const current = (enrollmentResult.items || []).find(
            (item) => String(item.course?._id || item.course?.id) === String(id)
          )
          setEnrollment(current || null)
        } catch {
          setEnrollment(null)
        }
      } else {
        setEnrollment(null)
      }
    } catch {
      setError('This course could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [id, user])

  useEffect(() => {
    void loadCourse()
  }, [loadCourse])

  const progress = useMemo(
    () => courseProgress(course, enrollment?.completedLessons || []),
    [course, enrollment]
  )

  useEffect(() => {
    if (!course) return
    if (selectionTouched && progress.lessons.some((lesson) => lesson.id === selectedLessonId)) return
    const next = progress.nextLesson || progress.lessons[0]
    if (next && next.id !== selectedLessonId) setSelectedLessonId(next.id)
  }, [course, progress.lessons, progress.nextLesson, selectedLessonId, selectionTouched])

  const selectedLesson = progress.lessons.find((lesson) => lesson.id === selectedLessonId) || progress.lessons[0]
  const selectedIndex = progress.lessons.findIndex((lesson) => lesson.id === selectedLesson?.id)
  const selectedMeta = KIND_META[selectedLesson?.kind] || KIND_META.lesson
  const SelectedIcon = selectedMeta.icon

  const selectLesson = (lessonId) => {
    setSelectionTouched(true)
    setSelectedLessonId(lessonId)
    setSearchParams({ lesson: lessonId }, { replace: true })
    setMessage('')
    setActionError('')
  }

  const requireSignIn = () => {
    navigate('/signin', { state: { from: location } })
  }

  const enroll = async () => {
    if (!user) {
      requireSignIn()
      return null
    }
    setSaving(true)
    setActionError('')
    setMessage('')
    try {
      const result = await apiFetch('/api/me/enrollments', {
        method: 'POST',
        body: JSON.stringify({ courseId: course._id })
      })
      setEnrollment(result.enrollment)
      setMessage('You are on the route.')
      return result.enrollment
    } catch {
      setActionError('Enrollment failed. Please try again.')
      return null
    } finally {
      setSaving(false)
    }
  }

  const toggleLesson = async () => {
    if (!selectedLesson) return
    if (!user) {
      requireSignIn()
      return
    }

    let currentEnrollment = enrollment
    if (!currentEnrollment) {
      currentEnrollment = await enroll()
      if (!currentEnrollment) return
    }

    const completed = (currentEnrollment.completedLessons || []).includes(selectedLesson.id)
    setSaving(true)
    setActionError('')
    setMessage('')
    try {
      const result = await apiFetch(`/api/me/enrollments/${course._id}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ lessonId: selectedLesson.id, completed: !completed })
      })
      setEnrollment(result.enrollment)
      setMessage(!completed ? 'Lesson marked complete.' : 'Lesson moved back to open.')
    } catch {
      setActionError('Progress could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container-studio py-16">
        <div className="h-4 w-32 animate-pulse bg-clay" />
        <div className="mt-6 h-16 w-3/5 animate-pulse bg-clay" />
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="h-96 animate-pulse border border-line bg-paper lg:col-span-7" />
          <div className="h-72 animate-pulse border border-line bg-paper lg:col-span-4 lg:col-start-9" />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="container-studio py-16">
        <p className="eyebrow">Course unavailable</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em]">This route could not be opened.</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{error || 'The course was not found.'}</p>
        <Link to="/courses" className="btn-primary mt-6">Back to the catalogue</Link>
      </div>
    )
  }

  const isCompleted = Boolean(
    selectedLesson && (enrollment?.completedLessons || []).includes(selectedLesson.id)
  )

  return (
    <div className="bg-chalk">
      <section className="container-studio pb-10 pt-8 lg:pb-14 lg:pt-12">
        <Link to="/courses" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
          <FaArrowLeft className="h-3 w-3" aria-hidden="true" />
          All courses
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge">{course.category}</span>
              <span className="badge">{course.level}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                LearnHub Studio / {course.durationWeeks || 4} weeks
              </span>
            </div>
            <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(3rem,6vw,5.6rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-ink">
              {course.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{course.description}</p>

            {course.outcomes?.length > 0 && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="eyebrow">What you will be able to do</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-ink">
                      <FaCheck className="mt-0.5 h-3 w-3 shrink-0 text-cobalt" aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="border border-line bg-paper">
              <div className="aspect-[4/3] overflow-hidden border-b border-line bg-clay">
                <img src={course.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-3xl font-semibold tracking-[-0.04em]">
                    {formatPrice(course.priceCents, course.currency)}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                    {progress.total} lessons
                  </span>
                </div>

                {enrollment ? (
                  <div className="mt-5">
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                      <span>{progress.completed} of {progress.total} complete</span>
                      <span className="tabular-nums text-ink">{progress.percent}%</span>
                    </div>
                    <div className="progress-track mt-2">
                      <div className="progress-fill" style={{ width: `${progress.percent}%` }} />
                    </div>
                    <button
                      type="button"
                      onClick={() => progress.nextLesson && selectLesson(progress.nextLesson.id)}
                      disabled={!progress.nextLesson}
                      className="btn-primary mt-5 w-full disabled:opacity-50"
                    >
                      {progress.nextLesson ? 'Continue the route' : 'Route complete'}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => void enroll()}
                      disabled={saving || authLoading}
                      className="btn-primary mt-5 w-full disabled:opacity-50"
                    >
                      {user ? 'Enroll in this course' : 'Sign in to enroll'}
                    </button>
                    <p className="mt-3 text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted">
                      Demo enrollment · No payment is taken
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-12 lg:py-16" aria-labelledby="route-title">
        <div className="container-studio">
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">The route</p>
              <h2 id="route-title" className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">
                {course.modules?.length || 0} modules. {progress.total} pieces of work.
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted">
              Select a lesson to read the objective and mark it complete.
            </p>
          </div>

          {progress.total === 0 ? (
            <div className="py-12">
              <p className="font-display text-2xl text-ink">The syllabus is still being prepared.</p>
              <p className="mt-2 text-sm text-muted">This course has no published lessons yet.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                {(course.modules || []).map((module, moduleIndex) => {
                  const moduleLessons = module.lessons || []
                  return (
                    <div key={module.title} className="grid gap-4 border-b border-line py-5 first:pt-0 last:border-b-0 sm:grid-cols-[2.5rem_1fr]">
                      <span className="font-mono text-[10px] tracking-[0.14em] text-cobalt">
                        {String(moduleIndex + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-semibold tracking-[-0.03em]">{module.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{module.summary}</p>

                        <div className="mt-4 space-y-2">
                          {moduleLessons.map((lesson) => {
                            const meta = KIND_META[lesson.kind] || KIND_META.lesson
                            const Icon = meta.icon
                            const complete = (enrollment?.completedLessons || []).includes(lesson.id)
                            const selected = selectedLesson?.id === lesson.id
                            const lessonNumber = progress.lessons.findIndex((item) => item.id === lesson.id) + 1
                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => selectLesson(lesson.id)}
                                aria-pressed={selected}
                                className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors ${
                                  selected
                                    ? 'border-cobalt bg-cobalt/5'
                                    : 'border-line bg-chalk/60 hover:border-cobalt/50'
                                }`}
                              >
                                <span
                                  className={`flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-[9px] ${
                                    complete
                                      ? 'border-cobalt bg-cobalt text-white'
                                      : selected
                                        ? 'border-cobalt bg-acid text-ink'
                                        : 'border-line text-muted'
                                  }`}
                                >
                                  {complete ? <FaCheck className="h-3 w-3" aria-hidden="true" /> : String(lessonNumber).padStart(2, '0')}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm text-ink">{lesson.title}</span>
                                  <span className="mt-0.5 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                                    <Icon className="h-2.5 w-2.5" aria-hidden="true" />
                                    {meta.label} · {lesson.minutes} min
                                  </span>
                                </span>
                                <FaArrowRight className={`h-3 w-3 shrink-0 ${selected ? 'text-cobalt' : 'text-muted/50'}`} aria-hidden="true" />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <aside className="lg:col-span-4 lg:col-start-9">
                {selectedLesson && (
                  <div className="sticky top-28 border border-line bg-ink p-6 text-chalk">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-acid">
                        <SelectedIcon className="h-3 w-3" aria-hidden="true" />
                        {selectedMeta.label}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-chalk/40">
                        {selectedLesson.minutes} min
                      </span>
                    </div>

                    <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-chalk/40">
                      Lesson {String(selectedIndex + 1).padStart(2, '0')} / {selectedLesson.moduleTitle}
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-semibold leading-[1.02] tracking-[-0.04em]">
                      {selectedLesson.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-chalk/65">{selectedLesson.objective}</p>

                    <button
                      type="button"
                      onClick={() => void toggleLesson()}
                      disabled={saving || authLoading}
                      className={`mt-6 inline-flex min-h-11 w-full items-center justify-center border px-4 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors disabled:opacity-50 ${
                        isCompleted
                          ? 'border-chalk/30 text-chalk/70 hover:border-chalk'
                          : 'border-acid bg-acid text-ink hover:bg-chalk'
                      }`}
                    >
                      {saving
                        ? 'Saving…'
                        : isCompleted
                          ? 'Completed — mark open'
                          : enrollment
                            ? 'Mark this lesson complete'
                            : 'Start the route'}
                    </button>

                    {message && <p className="mt-3 text-xs text-acid" role="status">{message}</p>}
                    {actionError && <p className="mt-3 text-xs text-[#FFB4A8]" role="alert">{actionError}</p>}

                    <div className="mt-5 flex items-center justify-between border-t border-chalk/15 pt-4">
                      <button
                        type="button"
                        onClick={() => selectedIndex > 0 && selectLesson(progress.lessons[selectedIndex - 1].id)}
                        disabled={selectedIndex <= 0}
                        className="font-mono text-[9px] uppercase tracking-[0.12em] text-chalk/50 hover:text-chalk disabled:opacity-30"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => selectedIndex < progress.lessons.length - 1 && selectLesson(progress.lessons[selectedIndex + 1].id)}
                        disabled={selectedIndex >= progress.lessons.length - 1}
                        className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-acid hover:text-chalk disabled:opacity-30"
                      >
                        Next
                        <FaArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </section>

      <section className="container-studio py-14 lg:py-20">
        <div className="grid gap-10 border-b border-line pb-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Course facts</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Built as a route, not a playlist.</h2>
          </div>
          <dl className="lg:col-span-6 lg:col-start-7">
            {[
              ['Level', course.level],
              ['Category', course.category],
              ['Duration', `${course.durationWeeks || 4} weeks`],
              ['Work', `${progress.total} lessons, labs, critiques, and projects`],
              ['Studio', 'LearnHub Studio']
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[7rem_1fr]">
                <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{label}</dt>
                <dd className="text-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  )
}
