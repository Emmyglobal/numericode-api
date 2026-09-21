// ─── React Course — Module 15: Final Project — Student Learning Dashboard ────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module15: ModuleData = moduleOf('Module 15 — Final Project: Student Learning Dashboard', [
  lesson('R15.1 — Stage 1: Plan, Scaffold and Route', {
    duration: 25,
    intro: 'Everything comes together here. In this stage you plan the Student Learning Dashboard, create the project, build the shared layout and get all four routes working with placeholder screens.',
    objectives: [
      'Plan the project from a one-paragraph brief',
      'Scaffold a Vite React project with a clear folder structure',
      'Set up routes and a shared layout',
    ],
    teach: [
      ['The Brief', 'Build a **Student Learning Dashboard** for a small school:\n\n- a landing page that explains the platform\n- a course catalogue with search\n- a course detail page with the curriculum\n- a student dashboard with progress\n\nEverything must work on a phone, be keyboard accessible, and talk to an API.'],
      ['Stage 1 Deliverables', '1. `npm create vite@latest student-dashboard -- --template react`\n2. Folders: `components/`, `pages/`, `services/`, `hooks/`\n3. Router with `/`, `/courses`, `/courses/:id`, `/dashboard`\n4. `Layout` with a header, navigation and a `<main>` landmark\n5. A placeholder component per route\n\nFinishing the stage means the whole skeleton is clickable — not that each screen is complete.'],
      ['Why This Order Works', 'Routing first means every later piece has a home. When you build the catalogue you are filling a page, not inventing a structure — exactly the plan-first habit from Module 12.'],
    ],
    code: {
      language: 'jsx',
      title: 'The Project Skeleton',
      code: `// src/App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CataloguePage } from "./pages/CataloguePage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CataloguePage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}`,
      explain: '`Layout` wraps every route, so the header and navigation exist on every screen and are written once.\n\nEach page is a placeholder for now. Because the routes exist, you can navigate the whole app on the first day — and demonstrate progress early.',
    },
    tryIt: {
      task: 'Complete Stage 1 and prove it works.',
      steps: [
        'Create the project and the four folders.',
        'Add the four placeholder pages and the Layout with a nav.',
        'Click every link and confirm the address bar and the screen agree.',
        'Commit: `git commit -m "feat: project skeleton with routing"`.',
      ],
      starter: `// Each page starts simple — replace the content in later stages
export function CataloguePage() {
  return <h1>Course catalogue</h1>;
}`,
      expected: 'All four routes open the right placeholder, the navigation highlights the current page, and the layout holds together on a narrow window.',
    },
    mistakes: [
      ['Building all screens before any routing', 'You end up restructuring everything when you add navigation.'],
      ['Duplicating the header on each page', 'Put shared chrome in the layout so there is one place to change it.'],
      ['Leaving the layout without landmarks', 'Use `<header>`, `<nav>` and `<main>` so screen-reader users can jump between regions.'],
    ],
    check: ['What marks the end of Stage 1?', [
      'Every route exists and shows a placeholder screen',
      'The catalogue is finished',
      'The API is connected',
      'The CSS is complete',
    ], 0, 'Stage 1 is about structure: routes, layout and placeholders that make the whole app navigable.'],
    summary: [
      'Plan the project, then scaffold it with a clear folder structure.',
      'Wrap the routes in a shared layout with real landmarks.',
      'Finish Stage 1 with a clickable skeleton your trainer can review.',
    ],
    quiz: [
      mcq('Why set up routing before building screens?', ['It gives every later piece a home and lets you demo progress early', 'It makes the CSS shorter', 'It is required by Vite', 'It removes the need for state'], 0, 'Routing defines the structure of the app, which everything else fills in.'),
      fill('Shared page chrome such as the header and navigation belongs in the ______ component.', 'Layout', 'The layout is rendered once and surrounds every route.'),
      tf('Placeholder pages are acceptable at the end of Stage 1.', true, 'Stage 1 delivers a navigable skeleton; the content arrives in later stages.'),
      mcq('Which element should contain the main content of a page?', ['<main>', '<div class="content">', '<section id="main">', '<article>'], 0, 'The <main> landmark tells assistive technology where the primary content lives.'),
      mcq('What should you commit at the end of Stage 1?', ['A working skeleton with routing', 'Half-finished features', 'node_modules', 'Nothing yet'], 0, 'Commit working milestones so each stage has a safe return point.'),
    ],
  }),

  lesson('R15.2 — Stage 2: Catalogue, API and Dashboard', {
    duration: 30,
    intro: 'Stage 2 fills the skeleton with real behaviour: the catalogue loads courses from an API, each card opens its detail page, and the dashboard shows the student\'s own progress with honest loading and error states.',
    objectives: [
      'Load the catalogue from an API through a service and a custom hook',
      'Add search and filtering to the catalogue',
      'Show per-course progress on the dashboard with loading, empty and error states',
    ],
    teach: [
      ['Stage 2 — Data and the Catalogue', 'One service module owns every request and one hook exposes it to the screens:\n\n```jsx\nconst { data: courses, loading, error, retry } = useCourses({ query });\n```\n\nThe catalogue keeps `query` in state, filters the returned courses during render and shows a `CourseCard` for each — passing an id so the card can link to `/courses/:id`.'],
      ['Stage 3 — Dashboard and Forms', 'The dashboard shows the student\'s own data: enrolled courses with a progress bar, a completed count derived from the data, and an empty state that links to the catalogue.\n\nAny form here follows Module 7: controlled inputs, validation on submit, one specific message per field and a confirmation after success. Progress always comes from the API or is derived from it — never stored twice.'],
    ],
    code: {
      language: 'jsx',
      title: 'Catalogue With Real Data',
      code: `function CataloguePage() {
  const [query, setQuery] = useState("");
  const { data: courses, loading, error, retry } = useCourses();

  if (loading) return <p role="status">Loading the catalogue…</p>;
  if (error) return <div role="alert"><p>{error}</p><button onClick={retry}>Try again</button></div>;
  if (!courses) return null;

  const visible = courses.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main>
      <h1>Course catalogue</h1>
      <label htmlFor="search">Search courses</label>
      <input id="search" value={query} onChange={e => setQuery(e.target.value)} />

      {visible.length === 0 ? (
        <p>No course matches “{query}”.</p>
      ) : (
        <ul>
          {visible.map(course => (
            <li key={course.id}>
              <Link to={\`/courses/\${course.id}\`}>{course.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}`,
      explain: 'The page reads data from the hook, filters it during render and handles the states in order: loading, error, empty, then the list.\n\nEach card links with the course id, so the detail route from Stage 1 now shows real content instead of a placeholder.',
    },
    tryIt: {
      task: 'Wire the catalogue to your API and finish the dashboard.',
      steps: [
        'Create `services/courses.service.js` with the GET calls your screens need.',
        'Call the service from a `useCourses` hook and use it in the catalogue.',
        'On the dashboard, show enrolled courses with a progress bar and a completed count.',
        'Break the API URL and confirm the error state offers a working retry.',
      ],
      expected: 'The catalogue loads and filters real data, the detail page shows the selected course, and the dashboard shows progress that matches the API.',
    },
    mistakes: [
      ['Calling fetch directly inside components', 'It duplicates logic and makes the states inconsistent. Keep requests in a service.'],
      ['Storing the filtered list in state', 'Filter during render; a stored copy drifts out of date.'],
      ['Forgetting the empty search result', 'A search that matches nothing must explain itself, not show a blank area.'],
    ],
    check: ['Where should the filtering happen in the catalogue?', [
      'During render, from the loaded courses and the current query',
      'In the API call, stored in state afterwards',
      'In a CSS rule',
      'In localStorage',
    ], 0, 'Filtering during render keeps one source of truth and cannot drift.'],
    summary: [
      'A service owns the requests; a hook shares them with the screens.',
      'Keep the query in state and filter during render.',
      'Every data screen shows loading, empty and error states.',
    ],
    quiz: [
      mcq('Why keep API calls in a service module?', ['One place owns the requests, so states stay consistent and reusable', 'It makes the app load faster', 'React requires it', 'It removes the need for hooks'], 0, 'A single service keeps request logic out of components and consistent across screens.'),
      mcq('Where does the filtered course list belong?', ['Calculated during render from the courses and the query', 'Stored in state as a second copy', 'In the service module', 'In CSS'], 0, 'Derived values belong in render, not in state.'),
      fill('A screen that loads data must handle loading, empty and ______ states.', 'error', 'Error states explain what failed and offer recovery.'),
      tf('The dashboard should calculate completed-course counts from the data it received.', true, 'Counts derived from the data cannot disagree with the lists.'),
      mcq('The catalogue renders nothing and shows no error. What should you check first?', ['The data that reached the component and the three state flags', 'The CSS colours', 'The Git history', 'The router version'], 0, 'Log the incoming data and the states — usually one flag is not handled.'),
    ],
    assignment: {
      goal: 'Deliver the complete Student Learning Dashboard: landing page, navigation, catalogue, course detail, dashboard, forms, routing, API integration, states and accessibility.',
      requirements: [
        'Landing page explaining the platform with a link into the catalogue.',
        'Navigation on every screen with the active route highlighted.',
        'Catalogue loading from the API with search, reusable CourseCard components and stable keys.',
        'Course detail reading the id from the route and listing the course curriculum.',
        'Dashboard with enrolled courses, progress bars, a derived completed count and an empty state linking to the catalogue.',
        'At least one validated form with per-field messages, following Module 7.',
        'Loading, empty and error states everywhere data is fetched.',
        'Responsive on desktop and mobile, keyboard accessible, semantic landmarks, visible focus.',
        'Work committed in clear stages on a branch, with a pull request describing the change.',
      ],
      starter: 'Use the Stage 1 skeleton plus the pieces from Modules 8 to 11. A local JSON file may stand in for the API while you build, but the final submission must fetch over HTTP.',
      expected: 'A visitor can move through every screen, the catalogue and dashboard show real API data, every state is handled, and the project builds without errors and is ready to deploy.',
      submission: 'Submit the repository link, the pull request, and a short README describing the screens, the API endpoints used and how to run the project. Include screenshots of the empty and error states.',
      criteria: [['All screens and routes work with real API data', 12], ['Loading, empty and error states handled everywhere', 10], ['Reusable components, derived state and clean structure', 8], ['Forms validated with accessible, specific feedback', 6], ['Responsive, accessible and documented in Git', 4]],
      difficulty: 'Challenging',
      time: '6–10 hours',
    },
  }),

  // __APPEND__
])
