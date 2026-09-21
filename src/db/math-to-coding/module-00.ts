import type { M2cModuleData } from './types'

// ─── Module 0 — Orientation & Prerequisite Check (ungraded onboarding) ──────
// Module objectives: get tooling installed, understand the course rhythm, and
// confirm readiness. The Module 0 assignment ("Toolkit Proof") is seeded even
// though the module is ungraded, because the course map lists it explicitly.

export const module00: M2cModuleData = {
  title: 'Module 0 — Orientation & Prerequisite Check',
  lessons: [
    {
      title: 'Welcome & How This Course Works',
      duration: 15,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Describe the course rhythm: lesson → quiz → assignment → exercises.
- Explain how the mathematics you will learn maps directly onto code.
- Interpret the grading breakdown and know where to ask for help.

## How This Course Works
"Mathematics to Coding: Logic, Numbers & Algorithms" is a 12-week foundations track that builds the mathematical thinking every programmer needs. Each week follows the same rhythm:

1. **Lessons** — short, focused reading with worked examples you can run in a browser console or terminal.
2. **Lesson quiz** — every lesson ends in a graded quiz. You may retake quizzes; your highest score is recorded.
3. **Module assignment** — one hands-on build per graded module, graded against a rubric (Correctness, Efficiency, Clarity/Documentation).
4. **Module exercises** — short practice tasks that are completion-graded.

## How Math Maps to Code
Every mathematical idea in this course appears in real code. Truth tables become \`if\` statements, number bases become binary data, functions become program functions, sequences become loops, and proof techniques become the reasoning you use to trust your algorithms. Throughout the course, examples are given in **pseudocode first**, with runnable **JavaScript** and **Python** versions.

## Grading at a Glance
- Lesson quizzes: 25% (your best 45 quiz scores count)
- Module assignments: 30% — the single largest component of your grade
- Module exercises (completion-graded): 10%
- Capstone project: 15%
- Final exam: 20%

You pass the course with **70% overall and at least 60% on the Final Exam**. A certificate of completion and the "Course Completer" badge are issued automatically when you meet the threshold.

## Where to Get Help
Use the course forum (per-course discussion threads) for concept questions, and direct messages to trainers for grading or administrative questions. Introduce yourself in the "Cohort Intros" thread — your peers are working through the same material.

## Key Takeaways
- The course rhythm is predictable: learn, check, build, practice.
- Assignments are the largest single grade component — start them early.
- Help is one forum post away.`,
      quiz: {
        title: 'Quiz 0.1 — Welcome & How This Course Works',
        description: 'Three questions on the course rhythm, grading, and prerequisites.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 99,
        questions: [
          {
            questionText: 'What must you score on the Final Exam at minimum to pass the course?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '50%', isCorrect: false },
              { id: 'b', text: '60%', isCorrect: true },
              { id: 'c', text: '70%', isCorrect: false },
              { id: 'd', text: '80%', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'You need prior programming experience to start this course.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
          {
            questionText: 'Which single component carries the most weight in your final grade?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Lesson quizzes (25%)', isCorrect: false },
              { id: 'b', text: 'Capstone project (15%)', isCorrect: false },
              { id: 'c', text: 'Module assignments (30%)', isCorrect: true },
              { id: 'd', text: 'Final exam (20%)', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
        ],
      },
    },
    {
      title: 'Setting Up Your Toolkit',
      duration: 25,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Install a code editor (VS Code) and a JavaScript/Python runtime.
- Use the browser dev console as an instant calculator and sandbox.
- Create and run your first "Hello, Math" script.

## Install a Code Editor
Download **Visual Studio Code** from code.visualstudio.com and install it. VS Code is where you will write and run the course's code examples. Recommended: enable format-on-save so your code stays tidy (this is also one of this module's exercises).

## Install Node.js and/or Python
- **Node.js**: download the LTS version from nodejs.org. Verify the install by opening a terminal and running \`node -v\` — it should print a version number.
- **Python**: download from python.org. Verify with \`python --version\`.

You only need **one** of the two runtimes — every example in this course is provided in both JavaScript and Python, so pick whichever you prefer and switch whenever you like.

## The Browser Console — Your Instant Sandbox
Every modern browser ships a JavaScript console: press **F12** (or right-click → Inspect → Console). Type \`2 + 2\` and press Enter — the browser evaluates it immediately. No installs, no files. Throughout this course the console doubles as a quick calculator: try \`10 % 3\`, \`2 ** 10\`, or \`0.1 + 0.2\` and watch what happens.

## Your First Script — "Hello, Math"
Create a file called \`hello-math.js\` containing:

\`console.log("Hello, Math to Code!");\`
\`console.log(7 * 6);\`

Run it with \`node hello-math.js\`. The output should be:

\`Hello, Math to Code!\`
\`42\`

In Python, \`hello-math.py\` would be:

\`print("Hello, Math to Code!")\`
\`print(7 * 6)\`

## Key Takeaways
- VS Code + Node.js (or Python) is all the tooling this course requires.
- The browser console evaluates JavaScript instantly — use it to check arithmetic any time.
- Running a script that prints \`7 * 6\` proves your toolkit works.`,
      quiz: {
        title: 'Quiz 0.2 — Setting Up Your Toolkit',
        description: 'Three questions on editors, runtimes, and the browser console.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 99,
        questions: [
          {
            questionText: 'Which tool lets you run JavaScript instantly without installing anything?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'The browser console', isCorrect: true },
              { id: 'b', text: 'VS Code', isCorrect: false },
              { id: 'c', text: 'Node.js', isCorrect: false },
              { id: 'd', text: 'A Python notebook', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What command checks your installed Node.js version?',
            questionType: 'fill_blank',
            correctAnswer: 'node -v',
          },
          {
            questionText: 'You must use both JavaScript and Python throughout this course.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
// MARKER_M0C
  ],
}
// MARKER_M1