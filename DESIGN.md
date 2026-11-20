# LearnHub — Design Direction

## Concept

**Learn by making.** LearnHub is a studio, not a content feed. A course is a visible route: modules, lessons, labs, critiques, and projects. The interface should make the next piece of work obvious and keep the learner’s progress attached to their account.

**One sentence:** A studio-style LMS where the course route is visible, the next lesson is obvious, and the work is the point.

## Audience and register

- Learners who want a clear sequence and a reason for each lesson.
- An administrator who needs an honest catalogue and enrollment record.
- Register: direct, technical, energetic. No corporate-training tone, no fake academic prestige.

## Dials

- **ENERGY 2:** direct and graphic, but not loud.
- **RHYTHM 2:** editorial sections plus one strong route module.
- **MOTION 1:** short functional transitions only.

## Palette

| Token | Hex | Role |
|---|---|---|
| `chalk` | `#F1EFE8` | Page ground |
| `paper` | `#FAF9F4` | Surface |
| `ink` | `#111318` | Primary text and dark panels |
| `cobalt` | `#2743D6` | Primary action and progress |
| `acid` | `#C6F24E` | One high-energy accent |
| `clay` | `#E7E0D2` | Secondary surface |
| `muted` | `rgba(17,19,24,0.62)` | Body copy |
| `line` | `rgba(17,19,24,0.16)` | Rules and borders |

No gradients, no glassmorphism, no purple SaaS palette.

## Typography

- **Display:** Space Grotesk. Geometric, direct, studio-like.
- **Body:** Inter. Clear and neutral.
- **Labels and data:** JetBrains Mono. Lesson kinds, minutes, counts, progress.

## Layout

- A wide studio container (88rem) with an editorial grid.
- Sharp surfaces, hairline rules, and high-contrast type.
- The course route is a real component: numbered modules, connected lesson nodes, and a persistent lesson panel.
- Course covers are flat geometric SVGs, bundled locally.

## Signature moment

**The route.** A course opens as a map of modules and lessons:

- Lesson kind is labelled: lesson, lab, critique, project.
- Every lesson has an objective and a duration.
- Selecting a node opens the objective in a dark lesson panel.
- Marking a lesson complete writes `completedLessons` to the enrollment and moves the route to the next open node.
- Progress is visible in the hero, the route, and My learning.

## Supporting decisions

- Direct demo enrollment instead of a cart or a fake checkout.
- No fake instructors, ratings, review counts, revenue charts, or testimonials.
- The admin ledger shows real counts and records, including an honest empty orders state.
- Admin course creation uses the same course records the learner sees.

## Motion

- Hover: border and small lift changes, 160–220ms.
- Progress: width transition, 300ms.
- No scroll-gated content.
- `prefers-reduced-motion: reduce` removes movement while keeping state changes visible.
