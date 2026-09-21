// ─── React Course — Module 6: State and Interactivity ────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module06: ModuleData = moduleOf('Module 6 — State and Interactivity', [
  lesson('R6.1 — What Is State?', {
    duration: 12,
    intro: 'Props carry information into a component. State is the memory inside a component — a value React remembers between renders, and the reason an app can react to a student.',
    objectives: [
      'Explain what state is and how it differs from props',
      'Describe what "between renders" means',
      'Decide whether a value should be state or an ordinary variable',
    ],
    teach: [
      ['A Component That Remembers', 'A plain variable is wiped away every time a component runs again. When React re-renders, `let count = 0` becomes 0 once more.\n\nState is different: React keeps the value for you, gives it back on the next render, and re-runs the component whenever you change it.'],
      ['State vs Props', '| | Props | State |\n|---|---|---|\n| Who sets it | The parent | The component itself |\n| Can it change? | No | Yes |\n| Example | A student\'s name | Whether a menu is open |\n\nProps are handed in. State is remembered inside.'],
      ['What Counts as State', 'A value is probably state when it changes while the page is open: a count, text typed in a box, which tab is selected, whether a list is loading.\n\nA value is *not* state when it can be worked out from other values. `total = price * quantity` should be calculated, not stored.'],
    ],
    code: {
      language: 'jsx',
      title: 'Why a Plain Variable Fails',
      code: `function Counter() {
  let count = 0;                    // forgotten on every render

  function add() {
    count = count + 1;              // changes a variable React does not watch
    console.log(count);            // the log changes, the page does not
  }

  return <button onClick={add}>Clicked {count} times</button>;
}`,
      explain: 'Clicking the button updates the variable but the page keeps showing 0, because React has no reason to re-render.\n\nThe next lesson fixes this with `useState`, which tells React "remember this value and re-render when it changes".',
    },
    tryIt: {
      task: 'List the values on a school portal and mark each one as props or state.',
      steps: [
        'Write five things a portal shows: student name, points, unread messages, menu open, exam average.',
        'Mark each one: does it change while the page is open?',
        'Decide which should be state and which can be calculated from others.',
      ],
      expected: 'Student name comes from outside (props). Points, unread count and menu-open change on the page (state). The average can be calculated from the scores.',
    },
    mistakes: [
      ['Storing values that can be calculated', 'Two copies drift apart. Calculate instead: `const average = total / subjects`.'],
      ['Believing a normal variable survives a render', 'It is recreated every time the component runs, so it cannot remember anything.'],
    ],
    check: ['Which value should be stored in state?', [
      'Whether the student has opened the notification panel',
      'The name of the school',
      'The title of the course',
      'A value never changed by the user',
    ], 0, 'State holds values that change while the page is open, usually because of a user action.'],
    summary: [
      'State is a component\'s memory — a value React keeps between renders.',
      'Props come from the parent; state is managed by the component itself.',
      'Store state only for values that change; calculate the rest.',
    ],
    quiz: [
      mcq('What is state?', ['Data a component remembers and can change', 'A read-only input from the parent', 'A CSS class', 'A file on disk'], 0, 'State is the component\'s own memory, and changing it makes React re-render.'),
      tf('A normal variable inside a component keeps its value between renders.', false, 'It is recreated on every render — that is exactly why state exists.'),
      fill('Props are set by the parent; state is set by the ______.', 'component', 'A component manages its own state, while props come from outside.'),
      mcq('Which value should NOT be state?', ['A total that is always price × quantity', 'Text typed into a search box', 'Whether a menu is open', 'The number of unread messages'], 0, 'Values that can be calculated from others should be calculated, not stored.'),
      mcq('What happens to the page when state changes?', ['React re-renders the component so the screen matches the new value', 'The browser reloads the whole site', 'Nothing at all', 'The CSS is rewritten'], 0, 'Changing state tells React to render again with the new value.'),
    ],
  }),

  lesson('R6.2 — useState', {
    duration: 15,
    intro: '`useState` is the hook that gives a component memory. It is the single most-used tool in React, and the four lines you learn here power counters, forms, menus, shopping carts and more.',
    objectives: [
      'Import and call `useState` correctly',
      'Update state with the setter function',
      'Explain why the setter must be used instead of changing the value directly',
    ],
    teach: [
      ['Calling the Hook', '```jsx\nconst [count, setCount] = useState(0);\n```\n\nRead it in three parts:\n\n- `useState(0)` asks React to remember a value, starting at 0.\n- `count` is that value for this render.\n- `setCount` is the function you call to change it.'],
      ['The Setter Causes a Re-render', 'Assigning `count = 5` would change a variable React does not watch. Calling `setCount(5)` does two things: React stores the new value **and** renders the component again so the screen matches.\n\nThat is the whole magic of interactive React: change state, and the screen follows.'],
      ['State Is Per Component Instance', 'Each `<Counter />` you render keeps its own count. Two counters on a page do not share a number unless a parent holds the state — an idea you will meet in Module 13, "Lifting State Up".'],
    ],
    code: {
      language: 'jsx',
      title: 'A Working Counter, Line by Line',
      code: `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Add one</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
      explain: '`useState(0)` gives the counter a starting value and a setter.\n\nThe first button calls `setCount(count + 1)`, so React stores the new number and re-renders — the paragraph updates immediately. The second button resets the value to 0.',
    },
    tryIt: {
      task: 'Change the counter so it counts in steps and cannot go below zero.',
      steps: [
        'Add a button that adds 5 instead of 1.',
        'Disable the "take one away" button when `count` is 0.',
        'Check that clicking quickly still behaves sensibly.',
      ],
      starter: `const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 5)}>Add five</button>
<button disabled={count === 0} onClick={() => setCount(count - 1)}>
  Take one away
</button>`,
      expected: 'The value rises by 5 with the first button, falls by 1 with the second, and the second button becomes greyed out at zero.',
    },
    mistakes: [
      ['Writing `count = count + 1`', 'Nothing re-renders. Always use the setter: `setCount(count + 1)`.'],
      ['Calling the hook inside a condition or loop', 'Hooks must be called at the top level of the component, in the same order every render.'],
      ['Expecting the new value on the same line', 'State updates are batched. `setCount(count + 1)` then `console.log(count)` still logs the old value.'],
    ],
    check: ['Which line adds 1 to a count stored in state?', [
      'setCount(count + 1)',
      'count = count + 1',
      'count.set(1)',
      'useState(count + 1)',
    ], 0, 'Only the setter function triggers a re-render; the other options change a value React does not watch.'],
    summary: [
      '`const [value, setValue] = useState(initial)` gives a component memory.',
      'Calling the setter stores the value and re-renders the component.',
      'Hooks run at the top level of a component, never inside loops or conditions.',
    ],
    quiz: [
      mcq('What does `const [count, setCount] = useState(0)` do?', ['Creates a state value starting at 0 and a setter for it', 'Creates a global variable', 'Fetches data from a server', 'Styles the component'], 0, 'useState returns the current value and the function that updates it.'),
      mcq('Which code correctly increases a counter?', ['setCount(count + 1)', 'count++', 'count = count + 1', 'set(count)'], 0, 'The setter must be called so React stores the value and re-renders.'),
      tf('Two separate `<Counter />` components share the same count automatically.', false, 'Each instance has its own state unless a parent holds it.'),
      fill('The function returned by useState that updates the value is called a ______.', 'setter', 'The setter stores the new value and triggers a re-render.'),
      mcq('Why do hooks have to run on every render, in the same order?', ['React matches stored state by call order', 'Because JavaScript forbids conditions', 'To save memory', 'To speed up CSS'], 0, 'React tracks hooks by the order they are called, so conditional hooks would shift the order.'),
    ],
  }),

  // __APPEND__
])
