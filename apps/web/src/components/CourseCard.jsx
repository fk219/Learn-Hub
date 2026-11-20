import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa6'
import { formatPrice } from '../lib/course'

export default function CourseCard({ course, priority = false }) {
  const lessonCount = (course.modules || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0)

  return (
    <article className="course-card group">
      <Link to={`/course/${course._id}`} className="block border-b border-line bg-clay">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={course.imageUrl}
            alt={`Cover for ${course.title}`}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge">{course.category}</span>
          <span className="badge">{course.level}</span>
          <span className="ml-auto font-mono text-sm tabular-nums text-ink">
            {formatPrice(course.priceCents, course.currency)}
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink transition-colors group-hover:text-cobalt">
          <Link to={`/course/${course._id}`}>{course.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{course.description}</p>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          <span>
            {lessonCount} lessons · {course.durationWeeks || 4} weeks
          </span>
          <Link to={`/course/${course._id}`} className="inline-flex items-center gap-1.5 text-cobalt transition-colors group-hover:text-ink">
            View route
            <FaArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
