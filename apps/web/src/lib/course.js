export function flattenLessons(course) {
  const lessons = []
  for (const [moduleIndex, module] of (course?.modules || []).entries()) {
    for (const [lessonIndex, lesson] of (module.lessons || []).entries()) {
      lessons.push({
        ...lesson,
        moduleIndex,
        moduleTitle: module.title,
        lessonIndex,
        number: lessons.length + 1,
      })
    }
  }
  return lessons
}

export function courseProgress(course, completedLessons = []) {
  const lessons = flattenLessons(course)
  const completed = new Set(completedLessons)
  const done = lessons.filter((lesson) => completed.has(lesson.id))
  const nextLesson = lessons.find((lesson) => !completed.has(lesson.id)) || null
  return {
    lessons,
    total: lessons.length,
    completed: done.length,
    percent: lessons.length ? Math.round((done.length / lessons.length) * 100) : 0,
    nextLesson,
  }
}

export function formatPrice(priceCents, currency = 'usd') {
  if (priceCents === 0) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(priceCents / 100)
}
