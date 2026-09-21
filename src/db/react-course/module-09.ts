// ─── React Course — Module 9: React Hooks ────────────────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module09: ModuleData = moduleOf('Module 9 — React Hooks', [
  lesson('R9.1 — useEffect and Dependency Arrays', {
    duration: 16,
    intro: 'Components build the screen. Some work happens *outside* the screen: reading the document title, saving a setting, loading data. `useEffect` is the hook that runs that work at the right moment.',
    objectives: [
      'Explain what an effect is for',
      'Control when an effect runs with the dependency array',
      'Recognise the three common dependency array shapes',
    ],
    teach: [
      ['Rendering Must Stay Pure', 'Rendering a component should only calculate what appears on the screen. Fetching data or writing to the browser are **side effects** — they must not happen during render, or a re-render would repeat them.\n\n`useEffect` gives side effects their own place to live, after React has finished painting.'],
      ['The Dependency Array', '```jsx\nuseEffect(() => {\n  document.title = "You clicked " + count + " times";\n}, [count]);\n```\n\nThe second argument decides when the effect runs:\n\n- `[count]` → runs after render, and again whenever `count` changes\n- `[]` → runs once, after the first render\n- omitted → runs after *every* render (rarely what you want)'],
      ['An Effect Follows State', 'Think of an effect as a reaction: *when this value changes, do that*.\n\nIf your effect reads a value from the component, that value belongs in the dependency list. React warns you in the console when you forget one.'],
    ],
    code: {
      language: 'jsx',
      title: 'Keeping the Tab Title in Sync',
      code: `import { useEffect, useState } from "react";

function LessonTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    document.title = \`Lesson time: \${seconds}s\`;
  }, [seconds]);

  return <p>You have been studying for {seconds} seconds</p>;
}`,
      explain: 'The effect runs once after the first render, and again whenever `seconds` changes.\n\nBecause the title update is not part of rendering, the component stays predictable: render describes the screen, the effect talks to the browser.',
    },
    tryIt: {
      task: 'Store a note in localStorage every time it changes.',
      steps: [
        'Create state `note` with the value "".',
        'Add an effect with `[note]` that stores the note using `localStorage.setItem`.',
        'Type in the input, reload the page, and read the value back with `localStorage.getItem`.',
      ],
      starter: `useEffect(() => {
  localStorage.setItem("draft", note);
}, [note]);`,
      expected: 'The saved value appears in the browser\'s Application → Local Storage panel, and it survives a page reload.',
    },
    mistakes: [
      ['Fetching during render', 'It repeats on every re-render and can cause infinite loops. Put it in an effect.'],
      ['Leaving the dependency array empty while reading state', 'The effect captures the first value forever. List every value the effect reads.'],
      ['Writing an effect that sets the state it depends on', 'That loops. Recalculate the value during render instead.'],
    ],
    check: ['What does an empty dependency array `[]` mean?', [
      'Run the effect once, after the first render',
      'Never run the effect',
      'Run after every render',
      'Run before rendering',
    ], 0, 'An empty array tells React the effect has no dependencies, so it runs a single time.'],
    summary: [
      'Effects hold work that must happen outside rendering.',
      'The dependency array decides when the effect re-runs.',
      'Every value the effect reads belongs in the dependency list.',
    ],
    quiz: [
      mcq('What is useEffect for?', ['Running side effects such as fetching or updating the document', 'Storing values that change', 'Styling components', 'Creating routes'], 0, 'useEffect is the hook for work that happens outside rendering.'),
      mcq('`useEffect(fn, [])` runs:', ['Once after the first render', 'After every render', 'Only when the component unmounts', 'Never'], 0, 'An empty dependency array means "no dependencies", so it runs once.'),
      fill('Values the effect reads must be listed in the dependency ______.', 'array', 'The dependency array tells React when the effect must run again.'),
      tf('An effect with no dependency array runs after every render.', true, 'Omitting the array makes the effect run after each render, which is rarely what you want.'),
      mcq('An effect sets a state value that it also depends on. What happens?', ['The component can re-render endlessly', 'Nothing at all', 'React throws an error immediately', 'The effect is disabled'], 0, 'Each run changes the dependency, which schedules another run — an infinite loop.'),
    ],
  }),

  lesson('R9.2 — Cleanup, useRef and Custom Hooks', {
    duration: 18,
    intro: 'Effects can leave work behind: a timer, a subscription, a pending request. Learn how to clean up safely, how to reach an element with useRef, and how to package repeated logic into your own hook.',
    objectives: [
      'Write a cleanup function that runs before the next effect and on unmount',
      'Use useRef for a DOM element or a value that needs no re-render',
      'Extract repeated logic into a custom hook',
    ],
    teach: [
      ['Cleanup Functions', '```jsx\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);   // cleanup\n}, []);\n```\n\nReact runs the returned function before the effect runs again, and once more when the component leaves the screen.\n\nWithout it a timer keeps ticking after the screen is gone — the classic memory leak and warning.'],
      ['useRef: A Box That Survives Renders', '`useRef` returns an object with a stable `.current` value:\n\n```jsx\nconst inputRef = useRef(null);   // point at a DOM element\n<input ref={inputRef} />\ninputRef.current.focus();\n\nconst renders = useRef(0);\nrenders.current += 1;            // changing it never re-renders\n```\n\nIt is the right tool for values that are useful but invisible — and the wrong tool for anything the student sees.'],
      ['Custom Hooks: Package the Pattern', 'A custom hook is a function whose name starts with `use` and which calls other hooks:\n\n```jsx\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const onResize = () => setWidth(window.innerWidth);\n    window.addEventListener("resize", onResize);\n    return () => window.removeEventListener("resize", onResize);\n  }, []);\n  return width;\n}\n```\n\nIt shares **logic**, not state: every component that calls it gets its own value and its own listener.'],
    ],
    code: {
      language: 'jsx',
      title: 'A Digital Clock With Cleanup',
      code: `function useClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);       // stops the timer on unmount
  }, []);

  return time;
}

function StudyTimer() {
  const time = useClock();
  return <p>Current time: {time.toLocaleTimeString()}</p>;
}`,
      explain: '`useClock` owns the timer and cleans it up, so any component can show the time in one line.\n\nBecause the hook is a plain function, you could use it in three different screens without repeating the effect.',
    },
    tryIt: {
      task: 'Write a reusable `useWindowWidth` hook.',
      steps: [
        'Create the hook exactly as shown, then call it from a component.',
        'Show a message that changes at 768px: "Wide layout" or "Compact layout".',
        'Resize the window and confirm the message follows.',
      ],
      starter: `function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  // add the listener and its cleanup here
  return width;
}`,
      expected: 'One reusable hook with a listener that is properly removed when the component unmounts.',
    },
    mistakes: [
      ['Forgetting to remove an interval or listener', 'It keeps running after the component is gone, wasting memory and logging warnings.'],
      ['Storing visible values in a ref', 'Refs do not trigger a re-render, so the screen will not update. Use state.'],
      ['Calling a hook conditionally', 'Hooks must run in the same order on every render, so keep them at the top level.'],
    ],
    check: ['When does an effect\'s cleanup function run?', [
      'Before the effect runs again, and when the component unmounts',
      'Only when the page is closed',
      'Never, unless you call it yourself',
      'After every render, including the first',
    ], 0, 'Cleanup runs before the next execution of the effect and once when the component leaves the screen.'],
    summary: [
      'Return a cleanup function to release timers, listeners and subscriptions.',
      'useRef holds a stable value or DOM reference without causing renders.',
      'Custom hooks package repeated logic and keep components short.',
    ],
    quiz: [
      mcq('What is a cleanup function for?', ['Releasing timers, listeners or subscriptions created by the effect', 'Clearing the component\'s state', 'Deleting the component', 'Resetting the CSS'], 0, 'Cleanup stops work that is no longer needed.'),
      mcq('What happens when you change `ref.current`?', ['The component does not re-render', 'The component re-renders once', 'React throws an error', 'The DOM is cleared'], 0, 'Refs are deliberately invisible to rendering.'),
      fill('A custom hook is a function whose name starts with ______.', 'use', 'React relies on the use prefix to apply the rules of hooks.'),
      tf('A custom hook shares state between every component that uses it.', false, 'It shares logic; each call gets its own state.'),
      mcq('Which value belongs in a ref rather than state?', ['The id from the last setInterval call', 'The text a student typed', 'Whether a menu is open', 'The number of items in a cart'], 0, 'Values that are useful internally but never displayed belong in a ref.'),
    ],
    assignment: {
      goal: 'Build a small dashboard that loads remote data through a custom hook, with loading, error and success states.',
      requirements: [
        'Write a useFetch(url) custom hook returning { data, loading, error, retry }.',
        'Use the hook in a dashboard that lists the fetched items.',
        'Show a loading message, an error message with a working Try again button, and an empty state.',
        'Clean up: ignore the result if the component unmounts before the response arrives.',
        'Document the hook in a short comment block: what it returns and when it re-fetches.',
      ],
      starter: 'Start from the fetch pattern in Module 10, then move the state and the effect into the hook. The hook must not know which screen uses it.',
      expected: 'The dashboard works with a real URL, recovers when the URL is broken, and the same hook could be reused unchanged on a second screen.',
      submission: 'Submit your repository link, the hook file, and a short note explaining what would happen without the cleanup logic.',
      criteria: [['useFetch hook is reusable and clearly documented', 8], ['Loading, error (with retry) and empty states all work', 7], ['Cleanup prevents updates after unmount', 5]],
      difficulty: 'Challenging',
      time: '90–120 minutes',
    },
  }),

  // __APPEND__
])
