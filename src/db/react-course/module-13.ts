// ─── React Course — Module 13: Modern React Patterns ─────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module13: ModuleData = moduleOf('Module 13 — Modern React Patterns', [
  lesson('R13.1 — Lifting State Up and Derived State', {
    duration: 16,
    intro: 'Two students compare their scores. Two form fields must stay in step. Two panels must agree on one selected item. These situations all need the same answer: move the shared value to the closest common parent.',
    objectives: [
      'Recognise when two components need the same state',
      'Lift state to the closest common parent',
      'Calculate derived values instead of storing them',
    ],
    teach: [
      ['The Problem: Siblings Cannot Share Directly', 'Sibling components cannot see each other\'s state — and that is a good thing, because it keeps them independent.\n\nWhen two siblings must agree, the state belongs in their **common parent**. The parent owns the value and passes it down; the children receive the value and a function to request a change.'],
      ['Lifting State Up, Step by Step', '1. Find the closest component that contains both children.\n2. Move the state there.\n3. Pass the value down as a prop.\n4. Pass a callback down so a child can ask the parent to change it.\n\nThe children stay simple and reusable; the parent becomes the single source of truth.'],
      ['Derived State Is Calculated, Not Stored', 'If a value can be worked out from other values, calculate it during render:\n\n```jsx\nconst total = items.reduce((sum, i) => sum + i.price, 0);\n```\n\nStoring `total` in state means keeping two copies in step — the classic source of "the total is wrong until I refresh". Calculate instead, and it can never disagree.'],
    ],
    code: {
      language: 'jsx',
      title: 'One Selected Course, Two Views',
      code: `function Dashboard() {
  // The shared value lives in the closest common parent.
  const [selected, setSelected] = useState(null);
  const courses = useCourses();

  // Derived, not stored: recomputed on every render, never out of date.
  const selectedCourse = courses.find(c => c.id === selected);
  const completed = courses.filter(c => c.progress === 100).length;

  return (
    <div>
      <CourseList
        courses={courses}
        selectedId={selected}
        onSelect={setSelected}
      />
      <CourseDetails course={selectedCourse} />
      <p>{completed} courses finished</p>
    </div>
  );
}`,
      explain: '`selected` lives in `Dashboard`, so both children can use it. The list shows which row is selected, and the details panel shows that course — from one value.\n\n`selectedCourse` and `completed` are calculated during render, so they can never fall out of sync with `courses`.',
    },
    tryIt: {
      task: 'Lift a filter value to a parent.',
      steps: [
        'Create `SearchBar` with its own input state and `ResultList` that shows every item.',
        'Notice that typing does nothing to the list.',
        'Move the query state into the parent, pass `query` and `onQueryChange` to the bar, and filter the list in the parent.',
      ],
      starter: `// Parent
const [query, setQuery] = useState("");
const visible = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()));

<SearchBar query={query} onQueryChange={setQuery} />
<ResultList items={visible} />`,
      expected: 'Typing in the search bar now filters the list, because both components read the same state from their parent.',
    },
    mistakes: [
      ['Keeping duplicate copies of the same value', 'Two copies drift apart. Keep one, pass it down.'],
      ['Storing a value you can calculate', 'Calculate totals, counts and filtered lists during render instead of storing them.'],
      ['Lifting state too far', 'Move it only as high as the closest common parent; lifting to the very top makes every screen re-render.'],
    ],
    check: ['Where should state live when two siblings must share it?', [
      'In their closest common parent',
      'In each sibling separately',
      'In a global variable',
      'In the CSS',], 0, 'The closest common parent owns the value and passes it down to both children.'],
    summary: [
      'Siblings cannot share state directly — lift it to their common parent.',
      'Pass the value down and a callback down so children can request changes.',
      'Derive values during render rather than storing a second copy.',
    ],
    quiz: [
      mcq('What does "lifting state up" mean?', ['Moving shared state to the closest common parent', 'Copying state into every child', 'Storing state in localStorage', 'Moving state into CSS'], 0, 'The shared value moves to the parent that contains both consumers.'),
      mcq('A child needs to change the parent\'s state. What should the parent pass down?', ['A callback function', 'A copy of the state', 'A DOM reference', 'A CSS class'], 0, 'The parent passes a function that the child calls with the new value.'),
      fill('A value computed from other values during render is called ______ state.', 'derived', 'Derived values are calculated, never stored, so they cannot go stale.'),
      tf('A filtered list should be stored in state so it does not change.', false, 'Filters are derived from the data and the query — calculate them during render.'),
      mcq('Two panels must show the same selected student. Where does the selection belong?', ['In the parent containing both panels', 'In panel one', 'In panel two', 'In both panels, kept in sync by hand'], 0, 'One source of truth in the common parent keeps both panels consistent.'),
    ],
  }),

  // __APPEND__
])
