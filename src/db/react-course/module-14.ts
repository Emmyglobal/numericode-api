// ─── React Course — Module 14: Professional React Development ────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module14: ModuleData = moduleOf('Module 14 — Professional React Development', [
  lesson('R14.1 — Maintainable Code, Git Workflow and Debugging', {
    duration: 16,
    intro: 'Professional work is not only code that runs — it is code that a teammate can read, a change you can undo, and a bug you can find in minutes.',
    objectives: [
      'Apply naming and structure habits that make code readable',
      'Use a simple Git and GitHub workflow for real projects',
      'Debug a React app systematically instead of guessing',
    ],
    teach: [
      ['Code Is Read More Often Than Written', 'Three habits carry most of the weight:\n\n- **Names describe purpose**: `enrolledCourses` beats `data2`\n- **One job per function**: if you need "and" to describe it, split it\n- **No dead code**: delete what you replaced, or Git will keep it for you in history'],
      ['A Workflow That Saves You', '```bash\ngit switch -c feature/course-filter\ngit add .\ngit commit -m "feat: filter courses by level"\ngit push -u origin feature/course-filter\n```\n\nWork on a short-lived branch, commit in small steps with a message that explains *why*, push, then open a pull request to merge after review.\n\nThe habit that matters most: commit something working before you start a big change.'],
      ['Debugging: Find the First Wrong Thing', 'Guessing wastes hours. Work like a scientist:\n\n1. **Reproduce** — can you make the bug happen every time?\n2. **Read the error** — the console names the file, line and component.\n3. **Inspect the state** — log or use React DevTools to see the actual values at render.\n4. **Isolate** — comment out until it works, then add back.\n5. **Fix the cause, not the symptom**.\n\nA useful rule: if a value is wrong on screen, print it just before it is rendered — nothing up to that point is your problem anymore.'],
    ],
    code: {
      language: 'jsx',
      title: 'Instrumenting Instead of Guessing',
      code: `function CourseGrid({ courses }) {
  // 1. What did we actually receive?
  console.log("CourseGrid received:", courses);

  const published = courses.filter(c => c.status === "published");
  console.log("After filter:", published.length, "of", courses.length);

  // 2. Guard the empty case so the UI explains itself.
  if (published.length === 0) {
    return <p>No published courses yet.</p>;
  }

  return (
    <ul>
      {published.map(c => <li key={c.id}>{c.title}</li>)}
    </ul>
  );
}`,
      explain: 'Two log statements answer the two questions that matter: did the data arrive, and did the filter remove everything?\n\nThe guard then turns an invisible bug into an honest message — and the message often reveals the real problem immediately.',
    },
    tryIt: {
      task: 'Debug a broken component scientifically.',
      steps: [
        'Introduce a bug on purpose: render `course.title` as `course.titel`.',
        'Read the console error and write down the file and line it names.',
        'Fix it, then add a `console.log` that prints the props before the failing line.',
      ],
      expected: 'You can name the file, the line and the wrong prop — and the app renders again after the fix.',
    },
    mistakes: [
      ['Committing everything in one giant commit', 'You cannot undo one idea, and review becomes impossible.'],
      ['Fixing symptoms with random changes', 'If you cannot explain why a fix worked, the bug is still there.'],
      ['Leaving console.log statements in a finished feature', 'They confuse the next reader and can leak data. Remove them when the bug is fixed.'],
    ],
    check: ['What is the first step when a React app breaks?', [
      'Reproduce the bug and read the console error',
      'Rewrite the component',
      'Switch libraries',
      'Delete node_modules',
    ], 0, 'Reproducing and reading the error tells you where to look instead of guessing.'],
    summary: [
      'Names, small functions and no dead code make code maintainable.',
      'Use short branches, small commits and pull requests for every change.',
      'Debug by reproducing, reading the error and inspecting state.',
    ],
    quiz: [
      mcq('Which commit message is most useful?', ['feat: filter courses by level', 'update', 'changes', 'final2'], 0, 'A good message states what changed and why.'),
      mcq('What is the value of working on a branch?', ['Your unfinished or experimental work cannot break the main branch', 'It runs the app faster', 'It removes the need for tests', 'It changes the CSS'], 0, 'Branches isolate work until it is reviewed and merged.'),
      fill('Before a big change, commit something ______.', 'working', 'A working checkpoint lets you return to safety if the change goes wrong.'),
      tf('Adding console.log statements is a slower way of finding a bug than guessing.', false, 'Inspecting the real values is usually the fastest route to the cause.'),
      mcq('A list renders empty and the console has no error. What should you check first?', ['Whether the data that reached the component is what you expected', 'The colour contrast', 'The Git history', 'The browser version'], 0, 'Log the incoming data first — often the list is empty because the data never arrived as expected.'),
    ],
  }),

  // __APPEND__
])
