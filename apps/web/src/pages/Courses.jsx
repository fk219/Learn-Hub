import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6'
import { apiFetch } from '../lib/apiClient'
import CourseCard from '../components/CourseCard'

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-low', label: 'Price, low to high' },
  { value: 'price-high', label: 'Price, high to low' },
  { value: 'title', label: 'Title, A–Z' }
]

export default function Courses() {
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
  }, [searchParams])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    apiFetch('/api/courses')
      .then((result) => {
        if (active) setCourses(result.items || [])
      })
      .catch(() => {
        if (active) setError('The catalogue could not be loaded.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(courses.map((course) => course.category).filter(Boolean))).sort()],
    [courses]
  )
  const levels = useMemo(
    () => ['all', ...Array.from(new Set(courses.map((course) => course.level).filter(Boolean))).sort()],
    [courses]
  )

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return courses
      .filter((course) => {
        if (query) {
          const haystack = `${course.title} ${course.description} ${course.category}`.toLowerCase()
          if (!haystack.includes(query)) return false
        }
        if (category !== 'all' && course.category !== category) return false
        if (level !== 'all' && course.level !== level) return false
        return true
      })
      .sort((a, b) => {
        if (sort === 'price-low') return a.priceCents - b.priceCents
        if (sort === 'price-high') return b.priceCents - a.priceCents
        if (sort === 'title') return a.title.localeCompare(b.title)
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      })
  }, [courses, searchTerm, category, level, sort])

  const hasFilters = Boolean(searchTerm || category !== 'all' || level !== 'all')

  const clear = () => {
    setSearchTerm('')
    setCategory('all')
    setLevel('all')
    setSort('newest')
  }

  return (
    <div className="bg-chalk">
      <section className="container-studio pb-10 pt-12 lg:pb-14 lg:pt-16" aria-labelledby="courses-title">
        <div className="flex flex-col justify-between gap-8 border-b border-line pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Catalogue / {courses.length || '—'} routes</p>
            <h1 id="courses-title" className="mt-4 max-w-[12ch] font-display text-[clamp(3rem,6.5vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-ink">
              The course <span className="italic text-cobalt">catalogue.</span>
            </h1>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted">
            Each course is a route of modules, lessons, and work. Filter by the room you want to spend
            time in.
          </p>
        </div>

        <form
          role="search"
          aria-label="Filter courses"
          onSubmit={(event) => event.preventDefault()}
          className="mt-7 border border-line bg-paper p-4 sm:p-5"
        >
          <div className="grid gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-5">
              <label htmlFor="course-search" className="label">Search</label>
              <div className="relative mt-2">
                <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  id="course-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Title, topic, or category"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="course-category" className="label">Category</label>
              <select id="course-category" value={category} onChange={(event) => setCategory(event.target.value)} className="input-field mt-2">
                {categories.map((item) => <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="course-level" className="label">Level</label>
              <select id="course-level" value={level} onChange={(event) => setLevel(event.target.value)} className="input-field mt-2">
                {levels.map((item) => <option key={item} value={item}>{item === 'all' ? 'All levels' : item}</option>)}
              </select>
            </div>

            <div className="md:col-span-3">
              <label htmlFor="course-sort" className="label">Order</label>
              <select id="course-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="input-field mt-2">
                {SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex justify-end border-t border-line pt-4">
              <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cobalt">
                <FaXmark className="h-3 w-3" aria-hidden="true" />
                Clear filters
              </button>
            </div>
          )}
        </form>
      </section>

      <section className="container-studio pb-16 lg:pb-24" aria-labelledby="course-results-title">
        <h2 id="course-results-title" className="sr-only">Course results</h2>
        <div className="flex items-center justify-between border-b border-line pb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted" aria-live="polite">
            {loading
              ? 'Opening the catalogue'
              : `${filtered.length} ${filtered.length === 1 ? 'route' : 'routes'}${hasFilters ? ' matching' : ''}`}
          </p>
          {!loading && courses.length > 0 && (
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {courses.length} total
            </p>
          )}
        </div>

        {error ? (
          <div className="mt-8 border border-line bg-paper p-10">
            <p className="font-display text-3xl text-ink">The catalogue is unavailable.</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              The course request failed. This is a server problem, not an empty catalogue.
            </p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-outline mt-6">
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border border-line bg-paper">
                <div className="aspect-[4/3] animate-pulse bg-clay" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-1/3 animate-pulse bg-clay" />
                  <div className="h-6 w-2/3 animate-pulse bg-clay" />
                  <div className="h-3 w-1/2 animate-pulse bg-clay" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 border border-line bg-paper px-6 py-16 text-center">
            <p className="eyebrow">Nothing matches</p>
            <p className="mt-4 font-display text-3xl text-ink">No routes on this shelf.</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Try a different category or level, or clear the search.
            </p>
            <button type="button" onClick={clear} className="btn-outline mt-6">Clear filters</button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course, index) => (
              <CourseCard key={course._id} course={course} priority={index < 3} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
