import { Course } from '../models/Course.js'
import { Enrollment } from '../models/Enrollment.js'
import { User } from '../models/User.js'
import { hashPassword } from './password.js'

const lesson = (id, title, kind, minutes, objective) => ({ id, title, kind, minutes, objective })

const courses = [
  {
    title: 'Product Design Foundations',
    slug: 'product-design-foundations',
    description:
      'A studio course in turning a product problem into a flow, an interface, and a handoff someone can build.',
    category: 'Design',
    level: 'Beginner',
    priceCents: 8900,
    currency: 'usd',
    imageUrl: '/courses/product-design.svg',
    durationWeeks: 6,
    outcomes: [
      'Frame a product problem before drawing screens.',
      'Turn research notes into a testable flow.',
      'Build a small interface system with clear hierarchy.',
      'Run a critique that produces decisions, not opinions.',
    ],
    modules: [
      {
        title: 'See the problem',
        summary: 'Start with the job, the current path, and the constraint that matters.',
        lessons: [
          lesson('see-1', 'Start with the job', 'lesson', 18, 'Write a job story that names the person, the trigger, and the outcome.'),
          lesson('see-2', 'Map the current path', 'lab', 45, 'Trace one real task through the existing product and mark every decision point.'),
          lesson('see-3', 'Choose the constraint', 'lesson', 15, 'Pick the single constraint that will make the first design testable.'),
        ],
      },
      {
        title: 'Shape the flow',
        summary: 'Move from a task to a sequence, then test the weakest step.',
        lessons: [
          lesson('flow-1', 'From task to sequence', 'lesson', 20, 'Turn the job story into a five-step flow with a clear beginning and end.'),
          lesson('flow-2', 'Sketch three routes', 'lab', 50, 'Sketch three genuinely different routes before choosing one.'),
          lesson('flow-3', 'Test the weakest step', 'lab', 40, 'Write the question that would expose the weakest step in the flow.'),
        ],
      },
      {
        title: 'Make the interface',
        summary: 'Type, spacing, hierarchy, and the states people actually hit.',
        lessons: [
          lesson('make-1', 'Type, spacing, hierarchy', 'lesson', 25, 'Build a three-level type hierarchy and a spacing scale that supports it.'),
          lesson('make-2', 'Build the component set', 'lab', 60, 'Design the button, field, and card states needed for the flow.'),
          lesson('make-3', 'Design the empty state', 'lesson', 18, 'Write and design an empty state that gives the next action.'),
        ],
      },
      {
        title: 'Critique and handoff',
        summary: 'Make the work legible to a team and honest about its open questions.',
        lessons: [
          lesson('crit-1', 'Run a decision-led critique', 'critique', 30, 'Frame a critique around three decisions instead of a general reaction.'),
          lesson('crit-2', 'Write the handoff', 'lab', 35, 'Document the flow, states, and edge cases a builder needs.'),
          lesson('crit-3', 'Ship a small slice', 'project', 90, 'Take one slice from problem to a reviewable prototype.'),
        ],
      },
    ],
  },
  {
    title: 'Full-Stack React',
    slug: 'full-stack-react',
    description:
      'Build a real React application with a routed front end, a typed API boundary, authentication, and a production build.',
    category: 'Development',
    level: 'Intermediate',
    priceCents: 12900,
    currency: 'usd',
    imageUrl: '/courses/full-stack-react.svg',
    durationWeeks: 8,
    outcomes: [
      'Split a React app into routes, features, and shared primitives.',
      'Design a data boundary that survives real loading and error states.',
      'Add authentication without leaking token handling into every component.',
      'Ship a production build and measure its first load.',
    ],
    modules: [
      {
        title: 'App architecture',
        summary: 'Routes, boundaries, and state that lives in the right place.',
        lessons: [
          lesson('arch-1', 'Routes and boundaries', 'lesson', 25, 'Draw the route tree and name the boundary between pages and features.'),
          lesson('arch-2', 'State that belongs where', 'lesson', 30, 'Separate server state, form state, and interface state in one feature.'),
          lesson('arch-3', 'Lab: split the app', 'lab', 60, 'Move one oversized page into a feature folder without changing behaviour.'),
        ],
      },
      {
        title: 'Data and forms',
        summary: 'Fetching, validation, and feedback that does not flicker.',
        lessons: [
          lesson('data-1', 'Fetching without flicker', 'lesson', 25, 'Model loading, empty, error, and success as separate interface states.'),
          lesson('data-2', 'Forms and validation', 'lesson', 30, 'Validate at the edge and show errors next to the field that caused them.'),
          lesson('data-3', 'Lab: a real form', 'lab', 55, 'Build a create form with client and server validation and a recovery path.'),
        ],
      },
      {
        title: 'API and auth',
        summary: 'A contract that the front end can trust.',
        lessons: [
          lesson('api-1', 'Design the contract', 'lesson', 25, 'Write the request, response, and error shapes before implementing the screen.'),
          lesson('api-2', 'Tokens and sessions', 'lesson', 30, 'Keep token storage and refresh behaviour in one place.'),
          lesson('api-3', 'Lab: protected routes', 'lab', 60, 'Protect a route and preserve the intended destination after sign-in.'),
        ],
      },
      {
        title: 'Ship it',
        summary: 'Build, measure, and make the deployment boring.',
        lessons: [
          lesson('ship-1', 'Build and deploy', 'lesson', 25, 'Create a repeatable production build and start command.'),
          lesson('ship-2', 'Measure the first load', 'lesson', 20, 'Inspect the bundle and name the largest cost.'),
          lesson('ship-3', 'Project: ship a slice', 'project', 120, 'Ship one vertical slice of the app with real data and a working error state.'),
        ],
      },
    ],
  },
  {
    title: 'Data Stories with Python',
    slug: 'data-stories-with-python',
    description:
      'Go from a messy export to one honest chart and a short written claim, using Python and a clear narrative structure.',
    category: 'Data Science',
    level: 'Beginner',
    priceCents: 9900,
    currency: 'usd',
    imageUrl: '/courses/data-stories.svg',
    durationWeeks: 6,
    outcomes: [
      'Ask a question a table can actually answer.',
      'Clean missing values and types without hiding the decision.',
      'Compare groups and trends without overclaiming.',
      'Publish a chart and a written claim together.',
    ],
    modules: [
      {
        title: 'First data',
        summary: 'Load a table and learn what it can honestly support.',
        lessons: [
          lesson('data-first-1', 'Ask a question a table can answer', 'lesson', 20, 'Turn a vague curiosity into a question with a measurable answer.'),
          lesson('data-first-2', 'Load and inspect', 'lesson', 30, 'Inspect shape, types, ranges, and missingness before plotting anything.'),
          lesson('data-first-3', 'Lab: your first DataFrame', 'lab', 45, 'Load a CSV and produce a small, honest summary table.'),
        ],
      },
      {
        title: 'Clean',
        summary: 'Every cleaning step is a decision that belongs in the record.',
        lessons: [
          lesson('clean-1', 'Missing values are a decision', 'lesson', 25, 'Decide whether to drop, fill, or flag missing values and write the reason.'),
          lesson('clean-2', 'Types and dates', 'lesson', 25, 'Fix types and time zones before they distort the analysis.'),
          lesson('clean-3', 'Lab: clean a messy export', 'lab', 50, 'Clean a real export and keep a short log of every transformation.'),
        ],
      },
      {
        title: 'Analyze',
        summary: 'Compare, trend, and resist the chart that flatters the story.',
        lessons: [
          lesson('analyze-1', 'Compare groups honestly', 'lesson', 25, 'Choose a comparison that accounts for group size and spread.'),
          lesson('analyze-2', 'Trends without overclaiming', 'lesson', 25, 'Distinguish a trend from a cause and name what the data cannot show.'),
          lesson('analyze-3', 'Lab: one chart, one claim', 'lab', 45, 'Make one chart and write the single claim it supports.'),
        ],
      },
      {
        title: 'Tell',
        summary: 'A data story is a chart, a sentence, and a boundary.',
        lessons: [
          lesson('tell-1', 'Structure the narrative', 'lesson', 20, 'Order the context, finding, and limitation in three sentences.'),
          lesson('tell-2', 'Design the chart', 'lesson', 30, 'Remove decoration and make the comparison readable at a glance.'),
          lesson('tell-3', 'Project: publish a data story', 'project', 90, 'Publish the chart, the claim, the method, and the limitation.'),
        ],
      },
    ],
  },
  {
    title: 'Brand Systems in Practice',
    slug: 'brand-systems-in-practice',
    description:
      'Turn a brand idea into a usable system of type, color, components, and written rules — not a logo file and a moodboard.',
    category: 'Design',
    level: 'Intermediate',
    priceCents: 10900,
    currency: 'usd',
    imageUrl: '/courses/brand-systems.svg',
    durationWeeks: 5,
    outcomes: [
      'Write a positioning statement that can guide design choices.',
      'Build a type and color system with assigned roles.',
      'Design primitives that can be reused without a designer present.',
      'Package the system as a short, usable brand book.',
    ],
    modules: [
      {
        title: 'Brand core',
        summary: 'Find the one idea and make it sayable.',
        lessons: [
          lesson('brand-1', 'Find the one idea', 'lesson', 25, 'Reduce the brand story to one sentence a new teammate could repeat.'),
          lesson('brand-2', 'Write the positioning', 'lesson', 25, 'Write who it is for, what it replaces, and why it is different.'),
          lesson('brand-3', 'Lab: a one-page brief', 'lab', 45, 'Turn the idea into a one-page brief with three design implications.'),
        ],
      },
      {
        title: 'Type and color',
        summary: 'Assign roles instead of collecting swatches.',
        lessons: [
          lesson('type-1', 'Choose a type voice', 'lesson', 25, 'Pick a display and text pairing that supports the brand idea.'),
          lesson('type-2', 'Build a color role set', 'lesson', 25, 'Assign color to ground, text, action, and signal roles.'),
          lesson('type-3', 'Lab: the type/color sheet', 'lab', 50, 'Build one sheet that proves the type and color system in use.'),
        ],
      },
      {
        title: 'Components',
        summary: 'A system starts when the logo is no longer doing the work.',
        lessons: [
          lesson('comp-1', 'From logo to system', 'lesson', 25, 'Translate the brand idea into spacing, shape, and state rules.'),
          lesson('comp-2', 'Design three primitives', 'lesson', 30, 'Design the button, field, and card so they can be assembled.'),
          lesson('comp-3', 'Lab: a component sheet', 'lab', 60, 'Document the primitives with usage and misuse notes.'),
        ],
      },
      {
        title: 'Guidelines',
        summary: 'Rules people can use on a Tuesday afternoon.',
        lessons: [
          lesson('guide-1', 'Write rules people use', 'lesson', 25, 'Write short rules with an example and a counterexample.'),
          lesson('guide-2', 'Package the system', 'lesson', 30, 'Organize the files and decisions so another person can apply them.'),
          lesson('guide-3', 'Project: publish a mini brand book', 'project', 90, 'Publish a short brand book with the core, type, color, and primitives.'),
        ],
      },
    ],
  },
  {
    title: 'Writing for Interfaces',
    slug: 'writing-for-interfaces',
    description:
      'A practical copy course for the words around the buttons: labels, errors, empty states, confirmations, and voice.',
    category: 'Writing',
    level: 'Beginner',
    priceCents: 6900,
    currency: 'usd',
    imageUrl: '/courses/interface-writing.svg',
    durationWeeks: 4,
    outcomes: [
      'Write interface copy that names the action and the outcome.',
      'Rewrite errors so a person knows what happened and what to do.',
      'Build a voice that stays consistent without sounding canned.',
      'Run a copy pass on a real screen.',
    ],
    modules: [
      {
        title: 'Clear language',
        summary: 'Short sentences, real verbs, and fewer nouns.',
        lessons: [
          lesson('write-1', 'Cut the noun stack', 'lesson', 20, 'Turn a noun-heavy label into a verb a person recognises.'),
          lesson('write-2', 'Verbs before decoration', 'lesson', 20, 'Rewrite three labels so the action comes first.'),
          lesson('write-3', 'Lab: rewrite a settings page', 'lab', 40, 'Rewrite a settings screen without losing any meaning.'),
        ],
      },
      {
        title: 'Flows and errors',
        summary: 'Say what happened, then say what happens next.',
        lessons: [
          lesson('error-1', 'Say what happened', 'lesson', 20, 'Write an error that names the problem without blaming the person.'),
          lesson('error-2', 'Say what happens next', 'lesson', 20, 'Give a recovery action that is available on the same screen.'),
          lesson('error-3', 'Lab: rewrite five errors', 'lab', 40, 'Rewrite five error states and mark the action in each.'),
        ],
      },
      {
        title: 'Voice',
        summary: 'A voice with edges still has to be useful.',
        lessons: [
          lesson('voice-1', 'A voice with edges', 'lesson', 20, 'Choose three voice principles and one place each should not be used.'),
          lesson('voice-2', 'Consistency without sameness', 'lesson', 20, 'Write the same message for a calm state and an urgent one.'),
          lesson('voice-3', 'Lab: a microcopy sheet', 'lab', 45, 'Build a small sheet of repeated interface phrases and their variants.'),
        ],
      },
      {
        title: 'Edit',
        summary: 'Read it aloud and cut what is performing.',
        lessons: [
          lesson('edit-1', 'Read it aloud', 'lesson', 15, 'Find the sentence that only works on the page, not in the ear.'),
          lesson('edit-2', 'Edit with a checklist', 'lesson', 25, 'Apply a short checklist for meaning, action, and tone.'),
          lesson('edit-3', 'Project: ship a copy pass', 'project', 75, 'Complete a copy pass on one real flow and document the changes.'),
        ],
      },
    ],
  },
  {
    title: 'Accessible Front-End',
    slug: 'accessible-front-end',
    description:
      'Build interfaces that work with a keyboard, a screen reader, high contrast, and reduced motion — without treating accessibility as a final checklist.',
    category: 'Development',
    level: 'Intermediate',
    priceCents: 9500,
    currency: 'usd',
    imageUrl: '/courses/accessible-frontend.svg',
    durationWeeks: 5,
    outcomes: [
      'Choose semantic elements before reaching for ARIA.',
      'Design a keyboard and focus model for a real flow.',
      'Fix contrast, state, and motion issues at the component level.',
      'Test a page with a keyboard and a basic automated pass.',
    ],
    modules: [
      {
        title: 'Semantics',
        summary: 'The DOM is the first accessibility API.',
        lessons: [
          lesson('sem-1', 'Buttons are not links', 'lesson', 20, 'Choose the element from the behaviour, not the appearance.'),
          lesson('sem-2', 'Structure in the DOM', 'lesson', 25, 'Use headings, landmarks, and lists to make the page legible without CSS.'),
          lesson('sem-3', 'Lab: audit a page', 'lab', 45, 'Audit a page for semantic issues and rank them by impact.'),
        ],
      },
      {
        title: 'Keyboard and focus',
        summary: 'A focus model is part of the interaction design.',
        lessons: [
          lesson('key-1', 'Tab order by design', 'lesson', 25, 'Order the tab stops around the task, not the markup.'),
          lesson('key-2', 'Focus that is visible', 'lesson', 20, 'Make focus visible without relying on the browser default alone.'),
          lesson('key-3', 'Lab: build a dialog', 'lab', 60, 'Build a dialog with focus entry, trap, Escape, and return.'),
        ],
      },
      {
        title: 'Color and motion',
        summary: 'Contrast, state, and an off switch.',
        lessons: [
          lesson('color-1', 'Contrast in practice', 'lesson', 20, 'Check text and non-text contrast in the states that matter.'),
          lesson('color-2', 'Motion with an off switch', 'lesson', 20, 'Respect reduced motion without losing state changes.'),
          lesson('color-3', 'Lab: fix the states', 'lab', 45, 'Fix hover, focus, disabled, and error states on one component.'),
        ],
      },
      {
        title: 'Testing',
        summary: 'Use the interface the way a person has to.',
        lessons: [
          lesson('test-1', 'Test with the keyboard', 'lesson', 25, 'Complete one real task with only the keyboard.'),
          lesson('test-2', 'Automate the basics', 'lesson', 30, 'Add an automated check for the issues that should never return.'),
          lesson('test-3', 'Project: accessibility pass', 'project', 90, 'Run an accessibility pass on one flow and document the fixes.'),
        ],
      },
    ],
  },
]

export async function seedCourses() {
  const count = await Course.countDocuments()
  if (count === 0) {
    await Course.insertMany(courses)
    process.stdout.write(`Seeded ${courses.length} courses.\n`)
  }
}

export async function seedDemoLearner() {
  const email = process.env.DEMO_EMAIL
  const password = process.env.DEMO_PASSWORD
  if (!email || !password) return

  let user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    user = await User.create({
      name: 'Demo Learner',
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      role: 'user',
    })
    process.stdout.write('Seeded demo learner.\n')
  }

  const design = await Course.findOne({ slug: 'product-design-foundations' })
  const fullStack = await Course.findOne({ slug: 'full-stack-react' })
  const data = await Course.findOne({ slug: 'data-stories-with-python' })

  if (design) {
    await Enrollment.findOneAndUpdate(
      { userId: user._id, courseId: design._id },
      {
        $setOnInsert: {
          status: 'active',
          completedLessons: ['see-1', 'see-2', 'flow-1'],
          lastLessonId: 'flow-1',
        },
      },
      { upsert: true }
    )
  }

  if (fullStack) {
    await Enrollment.findOneAndUpdate(
      { userId: user._id, courseId: fullStack._id },
      {
        $setOnInsert: {
          status: 'active',
          completedLessons: ['arch-1'],
          lastLessonId: 'arch-1',
        },
      },
      { upsert: true }
    )
  }

  if (data) {
    await Enrollment.findOneAndUpdate(
      { userId: user._id, courseId: data._id },
      { $setOnInsert: { status: 'active', completedLessons: [], lastLessonId: null } },
      { upsert: true }
    )
  }
}
