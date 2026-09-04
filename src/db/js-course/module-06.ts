// ─── JavaScript Course — Module 6: Capstone & Next Steps ────────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'J6.1 — Project: Build a Weather Viewer',
  duration: 15,
  content: `# J6.1 — Project: Build a Weather Viewer

A capstone combining fetch, async, DOM updates, and error handling into one small app.

## Learning Objectives
- Fetch and render API data into the page.
- Handle loading, success, and error states in the UI.
- Structure the app with small async functions.

## Introduction
This capstone pulls everything together: select input, fetch from a public API, render the result, and handle every state — loading, found, not found, and network failure.

## The Fetch Layer
async function getWeather() {
  try {
    // Open-Meteo is free and needs no key.
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=6.5&longitude=3.4&current_weather=true");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return { temp: data.current_weather.temperature, desc: "code " + data.current_weather.weathercode };
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

## The Handler and States
const form = document.querySelector("#weather");
const out = document.querySelector("#out");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  out.textContent = "loading...";
  const weather = await getWeather();
  if (!weather) {
    out.textContent = "could not load weather";
    return;
  }
  out.textContent = "now: " + weather.temp + "C (" + weather.desc + ")";
});

## States to Handle
1. loading — show feedback immediately.
2. success — render the data.
3. not found / bad input — clear message.
4. network error — caught, friendly message.

## Practical Exercise
Build the page and run it with the Open-Meteo endpoint (free, no key).
Tasks: (1) what shows while loading; (2) break the URL and confirm the error path. Check: loading... appears first; the broken URL shows could not load weather instead of crashing.
Expected scaffold lines (copy exactly):
    async function getWeather() {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=6.5&longitude=3.4&current_weather=true");
        const data = await res.json();
        console.log(data.current_weather.temperature);
      } catch (err) {
        console.error("failed:", err.message);
      }
    }
    getWeather();

## Key Takeaways
- Show a loading state before awaiting — perceived speed matters.
- One async function fetches; one handler renders; errors return null.
- Check response.ok before trusting the body.
- Small pieces (fetch layer, render layer) are testable and reusable.

## Quiz Answer Key
1. (b) The loading state is shown before the await completes.
2. (a) getWeather returns null on failure so the handler can show an error.
3. False — response.ok must be checked; 404 resolves fine.
4. (c) Separating fetch from render keeps each part simple.
5. (b) The catch block converts failures into a friendly message.
`,
  quiz: {
    title: 'Quiz J6.1 — Weather Viewer',
    description: '5 auto-gradable questions on structuring the capstone app.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'When should the loading state appear?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'After data arrives', isCorrect: false }, { id: 'b', text: 'Before the await', isCorrect: true }, { id: 'c', text: 'Never', isCorrect: false }, { id: 'd', text: 'On error only', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'getWeather returns what on failure?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'null', isCorrect: true }, { id: 'b', text: 'An empty object', isCorrect: false }, { id: 'c', text: 'The error itself', isCorrect: false }, { id: 'd', text: 'It never fails', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: A 404 makes fetch throw on its own.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Keep fetch logic and ______ logic in separate functions.', questionType: 'fill_blank', correctAnswer: 'render' },
      { id: 'q5', questionText: 'The catch block exists to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Retry forever', isCorrect: false }, { id: 'b', text: 'Convert failures into friendly messages', isCorrect: true }, { id: 'c', text: 'Hide bugs', isCorrect: false }, { id: 'd', text: 'Reload', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J6.1 — Weather Capstone',
    description: 'Ship the weather viewer with all four states and one extra feature (recent searches or units toggle). Good: working app, all states, one feature; rubric: 8 states, 6 feature, 6 code quality = 20.',
    dueDate: '2026-08-28T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Submit the full HTML+JS for the weather viewer including your extra feature, and describe how you tested each state.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'What would you add next with more time?', marks: 8 }],
  },
})

lessons.push({
  title: 'J6.2 — Debugging in the Browser',
  duration: 10,
  content: `# J6.2 — Debugging in the Browser

DevTools is a full debugger: breakpoints, step-through, watch expressions, and a network panel.

## Learning Objectives
- Set breakpoints and step through code.
- Inspect variables in the Sources panel.
- Diagnose failed requests in the Network panel.

## Introduction
console.log is fine, but breakpoints are better: the code pauses at a line, and you can inspect every variable at that moment. The Network panel shows every request — status, timing, payload.

## Breakpoints
Open Sources, click a line number, and reload. The debugger pauses there. Step over (F10) runs one line; step into (F11) enters functions; resume (F8) continues.

## Watch and Scope
While paused: hover variables to see values, add watch expressions, and expand the Scope pane to see locals and closures.

## Network Panel
Open Network, reload, and inspect each request: status code, headers, response body, and timing. A red row means a failed request; the response tab shows what the server actually sent.

## Worked Example — Finding a Bad Fetch
async function load() {
  const res = await fetch("/api/items");
  const data = await res.json();   // breakpoint here
  render(data.items);              // if this throws, check data in the debugger
}
Pausing on the breakpoint shows the real payload — often the shape is not what you assumed.

## Practical Exercise
On any page, set a breakpoint:
console.log("before");
const x = { a: 1 };
console.log("after", x);
Tasks: (1) pause on the middle line and inspect x; (2) find one network request in the Network panel and read its status. Check: x shows {a: 1} in the debugger; the request row shows 200 (or an error status).
Expected scaffold lines (copy exactly):
    console.log("before");
    const x = { a: 1 };
    console.log("after", x);

## Key Takeaways
- Breakpoints pause execution so you can inspect real values.
- Step over/into/resume navigate through running code.
- The Network panel is the first stop for any fetch problem.
- debugger; statements in code act like temporary breakpoints.

## Quiz Answer Key
1. (b) Clicking a line number in Sources sets a breakpoint.
2. (a) Step over (F10) runs the next line without entering functions.
3. False — the Network panel shows every request with status and body.
4. (c) The debugger; statement pauses like a breakpoint.
5. (b) A red row means the request failed.
`,
  quiz: {
    title: 'Quiz J6.2 — Debugging in the Browser',
    description: '5 auto-gradable questions on DevTools debugging.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'How do you set a breakpoint in Sources?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Right-click the page', isCorrect: false }, { id: 'b', text: 'Click the line number', isCorrect: true }, { id: 'c', text: 'Type break', isCorrect: false }, { id: 'd', text: 'You cannot', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Step over does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Runs the next line without entering functions', isCorrect: true }, { id: 'b', text: 'Skips all loops', isCorrect: false }, { id: 'c', text: 'Resumes to the end', isCorrect: false }, { id: 'd', text: 'Restarts', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: The Network panel shows request status and response body.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Fill in the blank: Writing ______; in code pauses like a breakpoint.', questionType: 'fill_blank', correctAnswer: 'debugger' },
      { id: 'q5', questionText: 'First stop for a failing fetch:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Elements panel', isCorrect: false }, { id: 'b', text: 'Network panel', isCorrect: true }, { id: 'c', text: 'Console styles', isCorrect: false }, { id: 'd', text: 'Application tab', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J6.2 — Debugging Session',
    description: 'Deliberately break the weather app (wrong URL, wrong property), then document how you found each bug with DevTools. Good: clear debugging narrative; rubric: 8 findings, 6 tools used, 6 write-up = 20.',
    dueDate: '2026-08-29T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Break the app twice, then write up: symptom, tool used, evidence seen, and fix for each.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When are breakpoints better than console.log?', marks: 8 }],
  },
})

lessons.push({
  title: 'J6.3 — Beyond the Browser',
  duration: 8,
  content: `# J6.3 — Beyond the Browser

JavaScript runs on servers (Node), in build tools, and inside frameworks. The language is the same; the environment changes.

## Learning Objectives
- Explain where JavaScript runs beyond the browser.
- Name the major frameworks and what they add.
- Choose a next step for your learning path.

## Introduction
The same JS you wrote in the browser also powers servers (Node.js), desktop apps (Electron), and mobile apps (React Native). Frameworks like React, Vue, and Svelte add structure for large UIs. The fundamentals you learned transfer everywhere.

## Where JS Runs
- Browser: DOM, events, fetch — what this course covered.
- Node.js: servers, file system, build scripts — no DOM.
- Electron / Tauri: desktop apps using web tech.
- React Native / Expo: mobile apps using React.

## The Framework Landscape
- React: components + hooks; the largest ecosystem.
- Vue: approachable, single-file components.
- Svelte: compiles away the framework; tiny output.
- Next.js / Nuxt: server-side rendering and routing on top.

All of them are still JavaScript — your fundamentals are the foundation.

## Tooling You Will Meet
- npm / pnpm: package managers (like pip for JS).
- Vite / Webpack: bundlers that prepare code for production.
- ESLint / Prettier: keep code consistent.
- TypeScript: types on top of JS — optional but common.

## Worked Example — Same Logic, New Environment
// Browser
document.querySelector("#x").textContent = "hi";

// Node (no DOM) — same language, different API
console.log("hi");
const fs = require("fs");
const text = fs.readFileSync("notes.txt", "utf8");
console.log(text);

## Practical Exercise
Run Node in a terminal:
node -e "console.log('JS runs here too:', 2 + 2)"
Tasks: (1) what prints; (2) write a one-line script that reads a file and prints its length. Check: JS runs here too: 4; fs.readFileSync(path).length gives the byte length.
Expected scaffold lines (copy exactly):
    node -e "console.log('JS runs here too:', 2 + 2)"

## Key Takeaways
- JS is everywhere: browser, server, desktop, mobile.
- Frameworks add structure; they do not replace the language.
- npm is the package ecosystem; Vite is the modern dev server.
- Your next step: pick one framework and build something real.

## Quiz Answer Key
1. (b) Node.js runs JS on servers without a DOM.
2. (a) React, Vue, and Svelte are UI frameworks built on JS.
3. False — frameworks add structure; the language fundamentals stay the same.
4. (c) npm is the package manager for JS.
5. (b) Building a real project is the best next step.
`,
  quiz: {
    title: 'Quiz J6.3 — Beyond the Browser',
    description: '5 auto-gradable questions on the JS ecosystem and next steps.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Node.js is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A CSS framework', isCorrect: false }, { id: 'b', text: 'A JS runtime for servers', isCorrect: true }, { id: 'c', text: 'A database', isCorrect: false }, { id: 'd', text: 'A browser', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'React, Vue, and Svelte are:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'UI frameworks built on JavaScript', isCorrect: true }, { id: 'b', text: 'Different languages', isCorrect: false }, { id: 'c', text: 'Databases', isCorrect: false }, { id: 'd', text: 'Operating systems', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Learning a framework means relearning JavaScript.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: ______ is the package manager for JavaScript.', questionType: 'fill_blank', correctAnswer: 'npm' },
      { id: 'q5', questionText: 'Best next step after this course:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Stop coding', isCorrect: false }, { id: 'b', text: 'Pick a framework and build something real', isCorrect: true }, { id: 'c', text: 'Memorize every method', isCorrect: false }, { id: 'd', text: 'Switch to a different language', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J6.3 — Learning Roadmap',
    description: 'Write a 6-month learning plan: which framework, two projects, and one backend concept to learn. Good: specific, realistic, connected to fundamentals; rubric: 8 plan, 6 projects, 6 reflection = 20.',
    dueDate: '2026-08-30T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Submit your 6-month plan: chosen framework, two projects (with why), and one backend concept. Tie each choice back to a lesson.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Which lesson in this course was most useful for your plan — and why?', marks: 8 }],
  },
})

export const module06: ModuleData = {
  title: 'Module 6 — Capstone & Next Steps',
  lessons,
}
