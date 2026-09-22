import type { HcfModuleData } from './types'

export const module00: HcfModuleData = {
  title: 'Module 0 — Orientation & Setup',
  lessons: [
    {
      title: 'Welcome & How This Course Works',
      duration: 15,
      content: `## Key Ideas

**Course rhythm:** lesson → quiz → assignment → exercises.

**HTML vs CSS responsibilities:**
- HTML = structure (the skeleton of a web page)
- CSS = presentation (how the page looks)

**Where to get help:**
- Course forums for concept questions
- Direct messages to trainers for grading/administrative questions

## How This Course Works

"HTML & CSS Fundamentals" is a 12-week, hands-on course that takes you from a blank .html file to building fully responsive, accessible, styled web pages — ending in a capstone site build and a final exam.

Each week follows the same rhythm:

1. **Lessons** — short, focused reading with worked examples.
2. **Lesson quiz** — every lesson ends in a graded quiz. You may retake quizzes; your highest score is recorded.
3. **Module assignment** — one hands-on build per graded module.
4. **Module exercises** — short practice tasks that are completion-graded.

## Grading at a Glance

- Lesson quizzes (55 total, best-effort average): 25%
- Module assignments (10): 30%
- Module exercises (completion-graded): 10%
- Capstone project: 15%
- Final exam: 20%

You pass the course with **70% overall and at least 60% on the Final Exam**. A certificate of completion and the "Course Completer" badge are issued automatically when you meet the threshold.

## Key Takeaways

- The course rhythm is predictable: learn, check, build, practice.
- Assignments are the largest single grade component — start them early.
- Help is one forum post away.`,
      quiz: {
        title: 'Quiz 0.1 — Welcome & How This Course Works',
        description: 'Three questions on the course rhythm, HTML/CSS division, and where to get help.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 99,
        questions: [
          {
            questionText: 'What does HTML stand for?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'HyperText Markup Language', isCorrect: true },
              { id: 'b', text: 'Home Tool Markup Language', isCorrect: false },
              { id: 'c', text: 'HighText Machine Language', isCorrect: false },
              { id: 'd', text: 'Hyperlink Text Management Language', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What does CSS stand for?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Cascading Style Sheets', isCorrect: true },
              { id: 'b', text: 'Computer Style Sheets', isCorrect: false },
              { id: 'c', text: 'Creative Style System', isCorrect: false },
              { id: 'd', text: 'Colorful Style Sheets', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: HTML is responsible for how a page looks, and CSS is responsible for its structure.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Setting Up Your Toolkit',
      duration: 25,
      content: `## Key Ideas

- Installing a code editor (VS Code)
- Installing a "Live Server" style extension
- Opening and using browser DevTools (Elements & Console panels)
- Creating your first .html file

## Install a Code Editor

Download **Visual Studio Code** from code.visualstudio.com and install it.

Recommended extensions:
- **Live Server** — launches a local development server with live reload
- **Prettier** — formats your code automatically

## Browser DevTools

To open DevTools:
- **Chrome/Edge:** Right-click → "Inspect", or press F12
- **Firefox:** Right-click → "Inspect Element", or press F12

Key panels:
- **Elements/Inspector** — view and edit HTML/CSS live
- **Console** — run JavaScript, see errors and log output

> **Important:** Changes made in DevTools are NOT saved permanently to your file.

## Creating Your First HTML File

1. Create a folder called my-first-site
2. Create a file named index.html
3. Add the basic HTML5 skeleton
4. Open the file in your browser

## Key Takeaways

- A code editor is where you write code; a browser is where you view it.
- DevTools lets you inspect and experiment, but changes are temporary.
- HTML files use the .html extension.`,
      quiz: {
        title: 'Quiz 0.2 — Setting Up Your Toolkit',
        description: 'Three questions on editors, file extensions, and DevTools.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 99,
        questions: [
          {
            questionText: 'Which browser panel lets you inspect and edit HTML/CSS live?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Elements/Inspector panel', isCorrect: true },
              { id: 'b', text: 'Network panel', isCorrect: false },
              { id: 'c', text: 'Application panel', isCorrect: false },
              { id: 'd', text: 'Performance panel', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What file extension do HTML files use?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '.html', isCorrect: true },
              { id: 'b', text: '.css', isCorrect: false },
              { id: 'c', text: '.js', isCorrect: false },
              { id: 'd', text: '.txt', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: Changes made in DevTools are saved permanently to your file.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Diagnostic Quiz: Are You Ready?',
      duration: 15,
      content: `## Key Ideas

This diagnostic quiz confirms you have the basic toolkit ready before Module 1 begins.

**Required software:**
1. A text/code editor (e.g., VS Code)
2. A web browser (e.g., Chrome, Firefox, Edge)

**Not required:**
- No prior programming experience
- No prior knowledge of Python or any other language

## How to Use DevTools

1. Open any website in your browser
2. Right-click and select "Inspect" (or press F12)
3. Find the <body> tag in the Elements panel
4. Try typing console.log("Hello, Web!") in the Console tab

## Key Takeaways

- You need a code editor to write code and a browser to view it.
- No programming experience is required to start learning HTML.
- The diagnostic quiz confirms your tooling is ready.`,
      quiz: {
        title: 'Quiz 0.3 — Diagnostic: Are You Ready?',
        description: 'Five questions to confirm tooling readiness before Module 1.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 99,
        questions: [
          {
            questionText: 'What software do you need installed to write code?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A text/code editor', isCorrect: true },
              { id: 'b', text: 'A web browser only', isCorrect: false },
              { id: 'c', text: 'A database server', isCorrect: false },
              { id: 'd', text: 'A game engine', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What software do you need to view a web page?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A web browser', isCorrect: true },
              { id: 'b', text: 'A code editor', isCorrect: false },
              { id: 'c', text: 'A terminal', isCorrect: false },
              { id: 'd', text: 'An email client', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: You need to know a programming language like Python before learning HTML.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
          {
            questionText: 'Where do you open DevTools in most browsers?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Right-click → Inspect (or F12)', isCorrect: true },
              { id: 'b', text: 'File → Open DevTools', isCorrect: false },
              { id: 'c', text: 'View → Developer', isCorrect: false },
              { id: 'd', text: 'Help → Tools', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What is a "tag" in HTML?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A keyword wrapped in angle brackets that marks up content, e.g. <p>', isCorrect: true },
              { id: 'b', text: 'A metadata file for a website', isCorrect: false },
              { id: 'c', text: 'A type of CSS selector', isCorrect: false },
              { id: 'd', text: 'A JavaScript function', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 0 Assignment — "Toolkit Proof"',
    description: 'Submit a screenshot showing: (a) your editor open with a file named index.html, (b) that file opened in a browser, and (c) the browser\'s DevTools Elements panel open showing the page\'s HTML.',
    dueDate: '2026-10-12T23:59:59Z',
    totalMarks: 10,
    passingScore: 50,
    assignmentType: 'file',
    questions: [
      { id: 'a0', type: 'file', title: 'Toolkit Proof Screenshot', marks: 10 },
    ],
  },
}
