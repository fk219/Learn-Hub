import { useCallback, useEffect, useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { apiFetch } from '../lib/apiClient'

const COVERS = [
  { value: '/courses/product-design.svg', label: 'Product design cover' },
  { value: '/courses/full-stack-react.svg', label: 'Full-stack cover' },
  { value: '/courses/data-stories.svg', label: 'Data stories cover' },
  { value: '/courses/brand-systems.svg', label: 'Brand systems cover' },
  { value: '/courses/interface-writing.svg', label: 'Interface writing cover' },
  { value: '/courses/accessible-frontend.svg', label: 'Accessible front-end cover' }
]

const empty = {
  title: '',
  description: '',
  category: 'Design',
  level: 'Beginner',
  price: '',
  imageUrl: COVERS[0].value,
  published: true
}

function priceToCents(value) {
  const numeric = Number.parseFloat(value)
  return Number.isFinite(numeric) ? Math.round(numeric * 100) : 0
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [pendingDelete, setPendingDelete] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [coursesResult, enrollmentsResult] = await Promise.all([
        apiFetch('/api/admin/courses'),
        apiFetch('/api/admin/enrollments')
      ])
      setCourses(coursesResult.items || [])
      setEnrollments(enrollmentsResult.items || [])
    } catch {
      setError('The course list could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const openCreate = () => {
    setEditingId('')
    setForm(empty)
    setError('')
    setMessage('')
    setFormOpen(true)
  }

  const openEdit = (course) => {
    setEditingId(course._id)
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: (course.priceCents / 100).toFixed(2),
      imageUrl: course.imageUrl,
      published: course.published
    })
    setError('')
    setMessage('')
    setFormOpen(true)
  }

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        level: form.level,
        priceCents: priceToCents(form.price),
        currency: 'usd',
        imageUrl: form.imageUrl,
        published: form.published
      }
      if (editingId) {
        await apiFetch(`/api/admin/courses/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) })
        setMessage('Course updated.')
      } else {
        await apiFetch('/api/admin/courses', { method: 'POST', body: JSON.stringify(payload) })
        setMessage('Course created.')
      }
      setFormOpen(false)
      await load()
    } catch (err) {
      setError(err.message || 'The course could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  const togglePublished = async (course) => {
    setError('')
    setMessage('')
    try {
      await apiFetch(`/api/admin/courses/${course._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ published: !course.published })
      })
      setMessage(course.published ? 'Course moved to draft.' : 'Course published.')
      await load()
    } catch {
      setError('Could not change the publish state.')
    }
  }

  const remove = async (course) => {
    setError('')
    setMessage('')
    try {
      await apiFetch(`/api/admin/courses/${course._id}`, { method: 'DELETE' })
      setPendingDelete('')
      setMessage('Course deleted.')
      await load()
    } catch {
      setError('Could not delete the course.')
    }
  }

  const filtered = courses.filter((course) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return `${course.title} ${course.category} ${course.level}`.toLowerCase().includes(query)
  })

  const enrollmentCount = (courseId) =>
    enrollments.filter((item) => String(item.courseId?._id || item.courseId) === String(courseId)).length

  return (
    <div className="admin-page">
      <header className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Course ledger / Catalogue</p>
          <h1 className="admin-title mt-4">Manage the courses.</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
            Create a course, publish or retire it, and read its live enrollment count.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add course
        </button>
      </header>

      {(error || message) && (
        <p className={`mt-5 border px-4 py-3 text-sm ${error ? 'border-cobalt/30 bg-cobalt/5 text-cobalt' : 'border-line bg-paper text-muted'}`} role={error ? 'alert' : 'status'}>
          {error || message}
        </p>
      )}

      {formOpen && (
        <section className="mt-6 surface p-5 sm:p-6" aria-labelledby="course-form-title">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 id="course-form-title" className="font-display text-2xl font-semibold">
              {editingId ? 'Edit course' : 'New course'}
            </h2>
            <button type="button" onClick={() => setFormOpen(false)} className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted hover:text-ink">
              Close
            </button>
          </div>

          <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="course-title" className="label">Title</label>
              <input id="course-title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required className="field mt-2" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="course-description" className="label">Description</label>
              <textarea id="course-description" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required className="field mt-2 resize-y" />
            </div>
            <div>
              <label htmlFor="course-category" className="label">Category</label>
              <select id="course-category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="field mt-2">
                {['Design', 'Development', 'Data Science', 'Writing', 'Business'].map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="course-level" className="label">Level</label>
              <select id="course-level" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} className="field mt-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => <option key={level}>{level}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="course-price" className="label">Price (USD)</label>
              <input id="course-price" type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required className="field mt-2 tabular-nums" />
            </div>
            <div>
              <label htmlFor="course-cover" className="label">Cover</label>
              <select id="course-cover" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="field mt-2">
                {COVERS.map((cover) => <option key={cover.value} value={cover.value}>{cover.label}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
              Published
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={busy} className="btn-primary">{busy ? 'Saving…' : editingId ? 'Save course' : 'Create course'}</button>
            </div>
          </form>
        </section>
      )}

      <div className="mt-6 flex items-center gap-3 border border-line bg-paper px-3">
        <Search className="h-4 w-4 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search courses"
          className="min-h-11 w-full bg-transparent text-sm focus:outline-none"
          aria-label="Search courses"
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{filtered.length}</span>
      </div>

      {loading ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse border border-line bg-paper" />)}
        </div>
      ) : (
        <div className="mt-4">
          {filtered.map((course) => {
            const lessonCount = (course.modules || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0)
            return (
              <article key={course._id} className="grid gap-4 border-b border-line py-4 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
                <div className="aspect-[4/3] w-24 overflow-hidden border border-line bg-clay">
                  <img src={course.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={course.published ? 'badge-acid' : 'badge'}>{course.published ? 'Published' : 'Draft'}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">{course.category} · {course.level}</span>
                  </div>
                  <p className="mt-1.5 font-display text-xl font-semibold leading-tight">{course.title}</p>
                  <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                    {lessonCount} lessons · {enrollmentCount(course._id)} enrolled · ${(course.priceCents / 100).toFixed(0)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button type="button" onClick={() => openEdit(course)} className="btn-outline">Edit</button>
                  <button type="button" onClick={() => void togglePublished(course)} className="btn-outline">
                    {course.published ? 'Unpublish' : 'Publish'}
                  </button>
                  {pendingDelete === course._id ? (
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => void remove(course)} className="font-mono text-[9px] uppercase tracking-[0.1em] text-cobalt underline underline-offset-4">Confirm</button>
                      <button type="button" onClick={() => setPendingDelete('')} className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted underline underline-offset-4">Keep</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setPendingDelete(course._id)} aria-label={`Delete ${course.title}`} className="flex h-9 w-9 items-center justify-center text-muted hover:text-cobalt">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
