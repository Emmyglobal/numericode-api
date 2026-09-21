// ─── React Course — Module 5: Props ──────────────────────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module05: ModuleData = moduleOf('Module 5 — Props', [
  lesson('R5.1 — What Are Props?', {
    duration: 12,
    intro: 'A component that always shows the same text is not very useful. Props let you give a component the information it should show — the same way you hand ingredients to a cook.',
    objectives: [
      'Explain what props are in your own words',
      'Compare props with function parameters',
      'Explain why props are read-only',
    ],
    teach: [
      ['Inputs for a Component', 'Think of a function you already know: `Math.max(4, 9)` returns 9 because you gave it two numbers. The numbers you pass are its parameters.\n\nProps are exactly that idea for components. `<StudentCard name="Ada" score={92} />` hands the card two pieces of information.'],
      ['Same Component, Different Data', 'Because props are inputs, one component can show many different things. Three `<StudentCard />` tags with different props show three different students — yet you wrote the card once.'],
      ['Props Are Read-Only', 'A component must never change the props it receives. Treat them like a school register: you may read the names, but you do not rewrite the register yourself.\n\nIf a value must change over time, that value belongs in **state** — which is the next module.'],
    ],
    code: {
      language: 'jsx',
      title: 'One Card, Two Students',
      code: `function StudentCard({ name, score }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Score: {score}</p>
    </div>
  );
}

function ClassList() {
  return (
    <div>
      <StudentCard name="Ada" score={92} />
      <StudentCard name="Bola" score={78} />
    </div>
  );
}`,
      explain: 'The curly braces in the parameter list pull the props out of the object the component receives.\n\nNow `name` and `score` can be used like ordinary variables, and each `<StudentCard />` shows its own data.',
    },
    tryIt: {
      task: 'Give a component a `title` prop.',
      steps: [
        'Create `LessonTitle({ title })` that returns the title in an `<h2>`.',
        'Use it once with "Props" and once with "State".',
        'Add a second prop `minutes` and show it after the title.',
      ],
      starter: `function LessonTitle({ title }) {
  return <h2>{title}</h2>;
}`,
      expected: 'Two headings with different text, produced by the same component — proof that props make a component reusable.',
    },
    mistakes: [
      ['Trying to change a prop inside the component', 'React will not allow it and your code becomes confusing. Changing values belong in state.'],
      ['Forgetting that props arrive as one object', '`function Card(props)` gives you `props.name`; destructuring is the shorthand you just used.'],
    ],
    check: ['What is the best description of props?', [
      'Inputs that a parent passes to a child component',
      'A place to store values that change',
      'A CSS class name',
      'A type of HTML element',
    ], 0, 'Props are read-only inputs passed from a parent component to a child component.'],
    summary: [
      'Props are inputs, like function parameters for components.',
      'They let one component display many different sets of data.',
      'Props are read-only; changing values belong in state.',
    ],
    quiz: [
      mcq('Props are most similar to:', ['Function parameters', 'CSS rules', 'Database rows', 'Browser tabs'], 0, 'Props are passed into a component much like arguments are passed into a function.'),
      tf('A component may freely change the props it receives.', false, 'Props are read-only. Values that change are stored in state.'),
      fill('Data passed into a component from its parent is called ______.', 'props', 'Props are the inputs a parent hands to a child component.'),
      mcq('Why can one `StudentCard` show different students?', ['The parent passes different props each time', 'The component rewrites itself', 'React copies the file', 'Because of CSS'], 0, 'Different props produce different output from the same component.'),
      mcq('Which value belongs in state rather than props?', ['A number that changes when the student clicks a button', 'The school name', 'The page title', 'The name of the course'], 0, 'Values that change because of user actions belong in state.'),
    ],
  }),

  lesson('R5.2 — Passing Props', {
    duration: 12,
    intro: 'You know what props are. Now learn the small syntax rules for passing them: text, numbers, true-or-false values, and how to read them inside the component.',
    objectives: [
      'Pass text, numbers and booleans as props',
      'Read props with or without destructuring',
      'Pass several props and required values correctly',
    ],
    teach: [
      ['Text Uses Quotes, Everything Else Uses Braces', '```jsx\n<StudentCard name="Ada" score={92} active={true} />\n```\n\n`name="Ada"` passes the text Ada. `score={92}` passes the *number* 92, because the braces say "this is a JavaScript value".\n\nThis matters: `score="92"` would pass text, and `"92" + 1` gives `"921"` instead of `93`.'],
      ['Reading Props', 'There are two styles, and both are correct:\n\n```jsx\nfunction Card(props) {\n  return <h3>{props.name}</h3>;\n}\n\nfunction Card({ name }) {\n  return <h3>{name}</h3>;\n}\n```\n\nThe second style — destructuring in the parameter list — is shorter and shows the reader which props the component expects.'],
      ['Default Values and Missing Props', 'If a prop is missing, it is simply `undefined`, and nothing appears where you used it. Give a default value when a prop is optional:\n\n```jsx\nfunction Badge({ label = "New" }) {\n  return <span>{label}</span>;\n}\n```'],
    ],
    code: {
      language: 'jsx',
      title: 'All Three Kinds of Prop',
      code: `function CourseCard({ title, lessons, isNew }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{lessons} lessons</p>
      {isNew && <span className="badge">New</span>}
    </article>
  );
}

export function Catalogue() {
  return (
    <section>
      <CourseCard title="React Basics" lessons={12} isNew={true} />
      <CourseCard title="JSX Deep Dive" lessons={8} isNew={false} />
    </section>
  );
}`,
      explain: '`title` arrives as text, `lessons` as a number, and `isNew` as a boolean that controls the badge.\n\nThe `&&` inside JSX shows the badge only when `isNew` is true — you will meet this pattern again in Module 8.',
    },
    tryIt: {
      task: 'Build a `SubjectRow` component with three props.',
      steps: [
        'Create `SubjectRow({ subject, score, passed })`.',
        'Show the subject and score on one line.',
        'Render two rows: one subject that passed and one that did not.',
      ],
      starter: `function SubjectRow({ subject, score, passed }) {
  return (
    <div>
      {/* show subject and score, then a Pass or Retake label */}
    </div>
  );
}`,
      expected: 'Two rows appear, each with its own subject and score, and each showing the correct label for `passed`.',
    },
    mistakes: [
      ['Passing a number inside quotes', '`score="92"` is text. Use braces for numbers: `score={92}`.'],
      ['Spelling a prop differently in the parent and the child', 'The value then arrives as `undefined` and nothing shows. Keep the names identical.'],
    ],
    check: ['How do you pass the number 10 as a prop?', ['lessons={10}', 'lessons="10"', 'lessons=10', 'lessons:10'], 0, 'Braces pass a JavaScript value, so the component receives a number, not text.'],
    summary: [
      'Text props use quotes; numbers, booleans and variables use braces.',
      'Destructuring in the parameter list is the clearest way to read props.',
      'A missing prop is `undefined`; give defaults for optional props.',
    ],
    quiz: [
      mcq('Which prop passes the number 5?', ['count={5}', 'count="5"', 'count=5', 'count:[5]'], 0, 'Braces pass JavaScript values, so the component receives the number 5.'),
      mcq('What does `function Row({ subject })` do?', ['Takes the subject value out of the props object', 'Creates a global variable', 'Sends data to the parent', 'Styles the row'], 0, 'It is destructuring — pulling named values straight out of props.'),
      fill('A prop that is not passed has the value ______.', 'undefined', 'Missing props are undefined, so nothing is rendered for them.'),
      tf('A child component can change the props it receives.', false, 'Props are read-only; only the parent can pass different values.'),
      mcq('`function Badge({ label = "New" })` is called as `<Badge />`. What shows?', ['New', 'undefined', 'An error', 'Nothing'], 0, 'The default value is used when the prop is not provided.'),
    ],
  }),

  // __APPEND__
])
