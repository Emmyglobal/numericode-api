// ─── React Course — Module 8: Rendering Lists and Conditional UI ─────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module08: ModuleData = moduleOf('Module 8 — Rendering Lists and Conditional UI', [
  lesson('R8.1 — Rendering Lists with map and Keys', {
    duration: 14,
    intro: 'Real screens show collections: courses, students, messages, subjects. React renders a list by turning an array into an array of elements — and it needs a stable key to keep track of each one.',
    objectives: [
      'Render an array of data with `.map()`',
      'Give every list item a stable `key`',
      'Explain why the index makes a poor key',
    ],
    teach: [
      ['From Data to Elements', '`map` takes every item in an array and turns it into something else. In React that "something else" is JSX:\n\n```jsx\n{students.map(student => (\n  <StudentCard key={student.id} name={student.name} />\n))}\n```\n\nCurly braces switch to JavaScript, `map` builds an array of elements, and React renders them in order.'],
      ['Why Keys Matter', 'When the list changes, React compares the old elements with the new ones. The `key` is the name tag that lets React match them up.\n\nWith correct keys, adding or removing a student updates just that row. Without them React may rebuild the whole list — or, worse, mix up state such as typing in an input.'],
      ['Choosing a Good Key', 'Use a value that belongs to the item and does not change: a database id, an email address, a student number.\n\nThe array index is a weak choice: delete the first student and every remaining index shifts, so React matches the wrong rows.'],
    ],
    code: {
      language: 'jsx',
      title: 'A Course List',
      code: `const courses = [
  { id: "c1", title: "Complete React Development", lessons: 12 },
  { id: "c2", title: "JavaScript Programming", lessons: 24 },
];

function CourseList() {
  return (
    <ul>
      {courses.map(course => (
        <li key={course.id}>
          <strong>{course.title}</strong> — {course.lessons} lessons
        </li>
      ))}
    </ul>
  );
}`,
      explain: '`map` returns one `<li>` per course object. React receives a normal array of elements and renders them.\n\nThe `key={course.id}` uses the stable id, so React can track each row even when the list changes.',
    },
    tryIt: {
      task: 'Render a list of your subjects as cards.',
      steps: [
        'Create an array of objects: `{ id, subject, score }` for four subjects.',
        'Render them with `.map()` inside a `<ul>`, giving each item `key={item.id}`.',
        'Add the class `card` to each `<li>` and check the browser console for warnings.',
      ],
      starter: `const subjects = [
  { id: 1, subject: "Mathematics", score: 88 },
  // add three more
];`,
      expected: 'Four cards appear in the order of the array, and the console shows no "Each child in a list should have a unique key" warning.',
    },
    mistakes: [
      ['Forgetting the key', 'React logs a warning and list updates become unreliable.'],
      ['Using the array index as the key', 'It breaks when items are added, removed or reordered. Prefer a real id.'],
      ['Forgetting `return` inside a multi-line map', 'Using `( )` around the JSX with an arrow function returns it implicitly; a missing return gives an empty list.'],
    ],
    check: ['Which key is the safest choice?', [
      'The database id of the item',
      'The array index',
      'A random number generated while rendering',
      'The item title',
    ], 0, 'A stable, unique, item-owned value such as the id keeps React\'s matching accurate.'],
    summary: [
      'Render lists by mapping data to elements inside curly braces.',
      'Every list item needs a unique, stable `key`.',
      'Avoid indexes as keys when the list can change.',
    ],
    quiz: [
      mcq('How do you render an array of items in React?', ['Map the data to elements inside curly braces', 'Use a for-loop directly in JSX', 'Write innerHTML by hand', 'Load a separate HTML file'], 0, 'JSX cannot contain statements, so you map the data to an array of elements.'),
      mcq('Why does React need a key on list items?', ['To match elements between renders', 'To sort the list automatically', 'To style the rows', 'To make the array smaller'], 0, 'Keys let React match each rendered element with the data it came from.'),
      fill('A key should be ______ and stable for each item.', 'unique', 'Duplicate or changing keys make React match the wrong rows.'),
      tf('Using the array index as a key is always safe.', false, 'When items are reordered or removed, indexes shift and React matches the wrong elements.'),
      mcq('Your list renders nothing and the console is silent. What is the usual cause?', ['The map callback does not return the JSX', 'The key is a string', 'The array is too long', 'CSS is missing'], 0, 'Arrow functions with statement bodies need an explicit return.'),
    ],
  }),

  lesson('R8.2 — Conditional UI: Empty, Loading and Error States', {
    duration: 16,
    intro: 'A screen with data has more than one mood. Handling loading, empty and error properly makes the app trustworthy — the student always knows what is happening.',
    objectives: [
      'Render different JSX depending on a condition',
      'Use the ternary operator and the && shortcut correctly',
      'Design honest empty, loading and error states',
    ],
    teach: [
      ['Conditional Rendering', 'Three shapes cover almost everything:\n\n```jsx\n{isLoggedIn ? <Dashboard /> : <LoginPrompt />}   // either / or\n{isNew && <span className="badge">New</span>}     // show or nothing\nif (loading) return <p>Loading…</p>;              // early return\n```\n\nUse early returns when a whole screen depends on the condition — the main JSX then describes only the successful case.'],
      ['The `&&` Trap', '`{count && <p>{count} items</p>}` fails when `count` is 0: JavaScript renders the number, so a stray "0" appears on the page.\n\n```jsx\n{count > 0 && <p>{count} items</p>}   // safe\n```\n\nThe rule: keep the left side of `&&` a real boolean.'],
      ['Designing the Three States', '- **Loading** — say what is loading: "Loading your courses…"\n- **Empty** — explain why and offer the next step: "You have not enrolled yet. Browse the catalogue."\n- **Error** — say what failed and how to recover, with a Try again button\n\nAn empty result is a success, not an error. Treating the two as different messages is what makes an app feel professional.'],
    ],
    code: {
      language: 'jsx',
      title: 'Three States, One Component',
      code: `function MyCourses({ courses, loading, error, onRetry }) {
  if (loading) return <p role="status">Loading your courses…</p>;

  if (error) {
    return (
      <div role="alert">
        <p>We could not load your courses: {error}</p>
        <button onClick={onRetry}>Try again</button>
      </div>
    );
  }

  if (courses.length === 0) {
    return <p>You have not enrolled yet. <Link to="/courses">Browse courses</Link></p>;
  }

  return (
    <ul>
      {courses.map(c => <li key={c.id}>{c.title} — {c.progress}%</li>)}
    </ul>
  );
}`,
      explain: 'Each early return handles one situation, so the final JSX only describes success.\n\n`role="status"` announces loading politely, `role="alert"` interrupts for errors, and the empty state offers an action instead of a dead end.',
    },
    tryIt: {
      task: 'Add a search that can produce an empty result.',
      steps: [
        'Give the catalogue a search input whose value lives in the parent.',
        'Filter the list with `.filter()` using the search text.',
        'When the filtered list is empty, show "No course matches <your text>" and a Clear search button.',
      ],
      starter: `const visible = courses.filter(c =>
  c.title.toLowerCase().includes(query.toLowerCase()),
);
if (visible.length === 0) return <p>No course matches “{query}”.</p>;`,
      expected: 'Typing text that matches nothing shows the message instead of a blank area, and clearing the search brings the full list back.',
    },
    mistakes: [
      ['Using `{count && ...}` with numbers', 'A zero renders as "0" on the page. Compare explicitly.'],
      ['Using an empty state for a failed request', 'The student thinks they have no courses instead of retrying.'],
      ['Nesting ternaries several levels deep', 'Prefer early returns or a small helper function for readability.'],
    ],
    check: ['Which expression renders nothing when `count` is 0?', [
      'count > 0 && <p>{count}</p>',
      'count && <p>{count}</p>',
      'count ? <p>{count}</p> : <p>0</p>',
      '<p>{count}</p>',
    ], 0, 'Comparing first keeps the left side a boolean, so nothing renders at zero.'],
    summary: [
      'Use ternaries for either/or and `&&` for show-or-nothing.',
      'Keep the left side of `&&` a boolean to avoid printing numbers.',
      'Loading, empty and error are three different, honest messages.',
    ],
    quiz: [
      mcq('Which renders a message only when there are items?', ['items.length > 0 && <p>{items.length} items</p>', 'items.length && <p>{items.length} items</p>', 'items.length ? "" : <p>None</p>', '<p>{items.length} items</p>'], 0, 'Making the comparison explicit avoids printing 0.'),
      mcq('The API returns an empty array. What should the screen show?', ['An empty state with a next step', 'An error message', 'A loading spinner forever', 'Nothing at all'], 0, 'An empty result is a success with no data, so explain it and offer an action.'),
      fill('A polite live region for loading messages uses role="______".', 'status', 'role="status" announces updates without interrupting the student.'),
      tf('An error state should include a way to try again.', true, 'Recovery matters — give the student a retry action.'),
      mcq('When is an early return the better choice?', ['When a whole screen depends on one condition', 'When you need to add a CSS class', 'When the list is long', 'Never'], 0, 'Early returns keep the main JSX flat and readable.'),
    ],
    assignment: {
      goal: 'Build a student course dashboard that handles available courses, completed courses and the loading, empty and error states honestly.',
      requirements: [
        'Two lists — available and completed — each rendered with .map() and stable keys.',
        'A loading state that names what it is loading.',
        'An empty state for each list with a next step or explanation.',
        'An error state with a Try again button that re-runs the load.',
        'A summary line such as "3 completed of 8 enrolled", calculated rather than stored.',
      ],
      starter: 'Reuse the three-state pattern from the lesson. Local data is fine here; Module 10 replaces it with a real API call.',
      expected: 'Switching the data between full, empty and error shows the correct screen every time, and the summary matches the lists exactly.',
      submission: 'Submit your repository link plus screenshots of the loading, empty and error states.',
      criteria: [['Both lists render correctly with keys', 6], ['Loading, empty and error states implemented and distinguishable', 8], ['Summary counts derived from the data, not duplicated in state', 6]],
      difficulty: 'Intermediate',
      time: '75–90 minutes',
    },
  }),

  // __APPEND__
])
