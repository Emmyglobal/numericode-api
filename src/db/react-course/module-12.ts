// ─── React Course — Module 12: Building Real Applications ────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module12: ModuleData = moduleOf('Module 12 — Building Real Applications', [
  lesson('R12.1 — Planning an Application and Breaking the UI into Components', {
    duration: 16,
    intro: 'This is the module where separate skills become a method. Before writing a line of code, professionals sketch the screens, list the data and plan the components.',
    objectives: [
      'Turn a short brief into a list of screens and components',
      'Identify the data each screen needs',
      'Decide which components are reusable and which are page-specific',
    ],
    teach: [
      ['Start With the Brief, Not the Code', 'Take a simple brief: *"Students should be able to browse courses, open one, and see their own dashboard."*\n\nFrom those verbs you already have four screens: Home, Catalogue, Course detail, Dashboard. Writing them down first prevents the most expensive mistake in software — building the wrong thing well.'],
      ['Sketch, Then Name', 'Draw each screen as boxes on paper. Then give every box a name:\n\n```\nCatalogue\n├── SearchBar\n├── CourseFilter\n├── CourseGrid\n│   └── CourseCard\n└── Pagination\n```\n\nThat list is your component plan. Boxes that appear on several screens (CourseCard, SearchBar) are shared; boxes that appear once (Pagination on this screen) stay near their page.'],
      ['Plan the Data', 'For each screen, write down what it needs and where it comes from:\n\n| Screen | Data | Source |\n|---|---|---|\n| Catalogue | list of courses | `GET /api/courses` |\n| Course detail | one course, modules | `GET /api/courses/:id` |\n| Dashboard | enrolled courses, progress | `GET /api/dashboard/courses` |\n\nWhen the data is clear, the components almost write themselves — and you can spot the loading and error states you must design.'],
    ],
    code: {
      language: 'text',
      title: 'A Plan You Can Execute',
      code: `Mini LMS — plan

Screens
  1. Home              → /            welcome + link to catalogue
  2. Catalogue         → /courses     search, filter, grid of cards
  3. Course detail     → /courses/:id curriculum + enrol button
  4. Dashboard         → /dashboard   my courses, progress, empty state

Shared components
  Layout, NavBar, CourseCard, ProgressBar, EmptyState, ErrorState, LoadingState

Data
  courses:        GET /api/courses
  course detail:  GET /api/courses/:id
  my courses:     GET /api/dashboard/courses

States to design for each screen
  loading · empty · error · success`,
      explain: 'One page of planning gives you the routes, the folder structure, the shared components and every state you must handle.\n\nNotice that the plan names the states as well as the screens — that is what separates a demo from a real application.',
    },
    tryIt: {
      task: 'Plan your own mini application on one page.',
      steps: [
        'Write a one-sentence brief for an app you would use at school.',
        'List its screens as routes with a path each.',
        'List the data each screen needs and where it comes from.',
        'List the components you expect to reuse on more than one screen.',
      ],
      expected: 'A single page containing: the brief, 3–5 routes, a data list and 4+ shared components — and no code yet.',
    },
    mistakes: [
      ['Starting with files and folders instead of screens', 'You end up reorganising everything later, because the structure did not follow the product.'],
      ['Planning only the happy path', 'Deciding loading, empty and error behaviour after the fact usually means a rushed, inconsistent UI.'],
      ['Making everything a component', 'A single `<div>` with one class is not worth a component. Split where there is reuse or a clear purpose.'],
    ],
    check: ['What is the most useful first step when starting a new screen?', [
      'Decide which components and data it needs',
      'Choose the colours',
      'Write the CSS file',
      'Set up the database'], 0, 'Naming the components and their data first makes the code straightforward to write.'],
    summary: [
      'Plan screens from the brief before writing code.',
      'Name the boxes on your sketch — that is your component list.',
      'Decide the data and the loading, empty and error states up front.',
    ],
    quiz: [
      mcq('Why plan components before coding?', ['It prevents expensive rework and keeps the structure aligned with the product', 'It makes the build smaller', 'It removes the need for tests', 'It is required by React'], 0, 'Agreeing on screens and components first avoids reorganisation later.'),
      mcq('Which component is most likely shared across screens?', ['CourseCard', 'The page\'s own Pagination', 'A screen-specific form', 'The footer text of one page'], 0, 'Anything appearing on more than one screen belongs in the shared components folder.'),
      fill('For every data-driven screen you must design loading, empty and ______ states.', 'error', 'Error states tell the student what happened and how to recover.'),
      tf('A plan that lists routes and data is less useful than one that lists colours.', false, 'Routes and data determine the architecture; colours are a later concern.'),
      mcq('Your plan lists `GET /api/courses/:id` for one screen. What does `:id` represent?', ['A placeholder for the selected course id', 'A file extension', 'A CSS class', 'A query parameter'], 0, 'Route and API paths commonly use a placeholder segment for the specific record.'),
    ],
  }),

  // __APPEND__
])
