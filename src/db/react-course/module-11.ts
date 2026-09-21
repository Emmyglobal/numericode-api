// ─── React Course — Module 11: React Router ──────────────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module11: ModuleData = moduleOf('Module 11 — React Router', [
  lesson('R11.1 — Why Routing? Routes, Links and Setup', {
    duration: 15,
    intro: 'A one-screen app is rare. A learning platform has a catalogue, a course page and a dashboard. React Router lets each screen have its own address without reloading the page.',
    objectives: [
      'Explain why a single-page app needs a router',
      'Define routes and navigate between them',
      'Explain why Link is used instead of a plain anchor',
    ],
    teach: [
      ['One Page, Many Screens', 'A React app loads once and then updates itself. If the address stayed the same, the student could not bookmark a course, share a link, or use the back button.\n\nA **router** keeps the address bar and the screen in agreement: change the address and the right screen appears; navigate in the app and the address follows.'],
      ['Defining Routes', '```jsx\n<BrowserRouter>\n  <Routes>\n    <Route path="/" element={<Home />} />\n    <Route path="/courses" element={<Courses />} />\n    <Route path="/courses/:id" element={<CourseDetail />} />\n  </Routes>\n</BrowserRouter>\n```\n\nEach `Route` pairs an address pattern with the component that should be shown.'],
      ['Links, Not Reloads', 'A plain `<a href="/courses">` asks the browser to fetch a new document — your whole app restarts and its state is lost.\n\n```jsx\n<Link to="/courses">Browse courses</Link>\n```\n\n`Link` updates the address and lets the router swap only the screen that changed, so the app keeps its state and feels instant.'],
    ],
    code: {
      language: 'jsx',
      title: 'Router + Navigation',
      code: `import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CourseCatalogue />} />
      </Routes>
    </BrowserRouter>
  );
}`,
      explain: '`BrowserRouter` wraps the app so every child can use routing. `nav` holds the links; `Routes` chooses which component matches the current address.\n\nNavigating between Home and Courses never reloads the document, so any state you set is preserved.',
    },
    tryIt: {
      task: 'Give your practice project two screens.',
      steps: [
        'Install React Router: `npm install react-router-dom`.',
        'Create `Home` and `Courses` components.',
        'Wrap the app in `BrowserRouter`, add two `Route`s and two `Link`s, then click between them.',
      ],
      starter: `npm install react-router-dom

// then in main.jsx or App.jsx
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";`,
      expected: 'Clicking the links changes the address bar and swaps the screen without a full page reload.',
    },
    mistakes: [
      ['Using `<a href>` inside a React app', 'It triggers a full reload and loses your state. Use `Link` for in-app navigation.'],
      ['Forgetting to wrap the app in a router', 'Components that call routing hooks throw an error outside a router context.'],
      ['Writing overlapping paths without order in mind', 'A very broad path can match earlier than a specific one. Keep specific routes before general ones.'],
    ],
    check: ['Why use `<Link>` instead of `<a>`?', [
      'It navigates without reloading the page, so app state survives',
      'It styles links automatically',
      'It is faster to type',
      'It works without a router',
    ], 0, 'Link lets the router change screens in place instead of the browser fetching a new document.'],
    summary: [
      'A router keeps the address bar and the visible screen in agreement.',
      'Each `Route` maps an address pattern to a component.',
      'Use `Link` for in-app navigation to avoid full reloads.',
    ],
    quiz: [
      mcq('What does a router give a single-page application?', ['Addressable screens that can be linked, bookmarked and shared', 'Faster CSS', 'A database', 'Automatic testing'], 0, 'Routes give each screen a URL so it can be linked to and revisited.'),
      mcq('Which component wraps the app so routing works everywhere?', ['BrowserRouter', 'Routes', 'Link', 'Navigate'], 0, 'BrowserRouter provides routing context to its children.'),
      fill('To navigate inside a React app you use the ______ component instead of an anchor.', 'Link', 'Link changes the route without a full document reload.'),
      tf('A plain `<a href="/courses">` keeps the app state when clicked.', false, 'It makes the browser fetch a new document, restarting the app and losing state.'),
      mcq('What does `<Route path="/courses" element={<Courses />} />` mean?', ['When the address is /courses, show the Courses component', 'Always show Courses', 'Redirect to Courses', 'Hide Courses'], 0, 'The path is matched against the current address, then the element is rendered.'),
    ],
  }),

  lesson('R11.2 — Parameters, Nested Routes and Protected Routes', {
    duration: 18,
    intro: 'Real applications read an id from the address, keep detail pages inside a shared shell, and block screens that require sign-in. This lesson covers all three.',
    objectives: [
      'Read a route parameter with useParams',
      'Build a nested layout with an Outlet',
      'Protect a route and show a 404 page',
    ],
    teach: [
      ['Reading the Id From the Address', '```jsx\n<Route path="/courses/:id" element={<CourseDetail />} />\n\nfunction CourseDetail() {\n  const { id } = useParams();\n  useEffect(() => { loadCourse(id); }, [id]);\n}\n```\n\nThe `:id` segment is a placeholder and `useParams` returns whatever the student actually typed, so one component serves every course. Add `id` to the dependency array — visiting another course must load new data.'],
      ['Nested Routes Share a Shell', '```jsx\n<Route path="/dashboard" element={<DashboardLayout />}>\n  <Route index element={<Overview />} />\n  <Route path="courses" element={<MyCourses />} />\n</Route>\n```\n\n`DashboardLayout` renders the shared sidebar and heading, plus an `<Outlet />` where the child route appears. The shell is written once and stays mounted while children change.'],
      ['Protected Routes and 404', '```jsx\nfunction RequireAuth({ children }) {\n  const { student } = useAuth();\n  if (!student) return <Navigate to="/login" replace />;\n  return children;\n}\n```\n\nFrontend protection is for **usability** and must always be matched by backend checks, because any visitor can change frontend state. Add `<Route path="*" element={<NotFound />} />` so an unknown address gets a friendly page instead of a blank screen.'],
    ],
    code: {
      language: 'jsx',
      title: 'A Protected Dashboard With Shared Layout',
      code: `function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/dashboard/courses">My courses</NavLink>
      </aside>
      <main><Outlet /></main>
    </div>
  );
}

<Routes>
  <Route path="/courses/:id" element={<CourseDetail />} />
  <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
    <Route index element={<Overview />} />
    <Route path="courses" element={<MyCourses />} />
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>`,
      explain: 'The dashboard shell renders once and its children swap in through the `<Outlet />`.\n\n`RequireAuth` redirects a signed-out visitor and the wildcard route catches every other address — two small pieces that make the app feel finished.',
    },
    tryIt: {
      task: 'Add a detail route and a 404 page.',
      steps: [
        'Create `/courses/:id` that shows the id from `useParams`.',
        'Link each course card with `<Link to={`/courses/${course.id}`}>`.',
        'Add a wildcard route that shows a NotFound page with a link home.',
      ],
      starter: `const { id } = useParams();
// load and show the course for this id

<Route path="*" element={<NotFound />} />`,
      expected: 'Clicking a card opens that course, the address bar shows its id, and a made-up URL shows your 404 page instead of a blank screen.',
    },
    mistakes: [
      ['Forgetting `id` in the effect dependencies', 'Navigating to a second course keeps showing the first one.'],
      ['Relying only on frontend protection', 'The backend must also verify authentication and authorisation on every protected request.'],
      ['Using relative links without checking where they land', 'A nested `to="courses"` resolves against the parent path.'],
    ],
    check: ['Where does a child route appear inside a nested layout?', [
      'At the `<Outlet />` in the layout component',
      'Below the layout, after it closes',
      'Inside the navigation',
      'It replaces the layout',
    ], 0, 'The Outlet marks the spot where the matched child route renders.'],
    summary: [
      'useParams reads the dynamic part of the address; keep it in effect dependencies.',
      'Nested routes render children through an `<Outlet />` inside a shared layout.',
      'Protect routes for usability, back it with server checks, and add a 404 route.',
    ],
    quiz: [
      mcq('Which hook reads the `:id` segment of `/courses/:id`?', ['useParams', 'useState', 'useNavigate', 'useRef'], 0, 'useParams returns the values captured from the route pattern.'),
      mcq('What does `<Outlet />` do?', ['Renders the matched child route inside a parent layout', 'Creates a new route', 'Redirects to home', 'Stops navigation'], 0, 'The Outlet is the placeholder where nested children appear.'),
      fill('An unknown address is handled by the wildcard route path="______".', '*', 'The * pattern matches any address not matched earlier.'),
      tf('Frontend route protection alone keeps premium content safe.', false, 'Frontend checks can be bypassed; the backend must enforce access on every request.'),
      mcq('Which is a real benefit of nested routes for a dashboard?', ['The shared sidebar stays mounted while children change', 'The sidebar reloads on every click', 'Each page needs its own sidebar code', 'The router runs faster'], 0, 'Nesting keeps shared chrome mounted and written once.'),
    ],
    assignment: {
      goal: 'Build a small learning platform with routing: a catalogue, a course detail page, a protected dashboard and a 404 page.',
      requirements: [
        'Routes: /, /courses, /courses/:id, /dashboard (nested with a shared layout) and *.',
        'Course detail reads the id with useParams and loads the matching course.',
        'A RequireAuth component redirects signed-out visitors away from the dashboard.',
        'Navigation uses Link or NavLink with an active style on the current route.',
        'The 404 page explains the problem and links back home.',
        'A short note listing which routes you protect on the backend and why.',
      ],
      starter: 'Reuse the components from Module 8. A boolean in state can stand in for the signed-in student while you build; your note should describe the real check.',
      expected: 'Every route opens the right screen, the dashboard is unreachable while signed out, the active navigation is visible, and a made-up URL shows the 404 page.',
      submission: 'Submit the repository link and a screenshot or short recording of the redirect when a signed-out visitor opens /dashboard.',
      criteria: [['All five routes work with correct nesting', 8], ['Params used correctly for course detail', 6], ['Protected route and 404 handled cleanly', 6]],
      difficulty: 'Challenging',
      time: '2–3 hours',
    },
  }),

  // __APPEND__
])
