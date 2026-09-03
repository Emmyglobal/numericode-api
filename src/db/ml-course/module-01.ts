import type { MlLessonData, MlModuleData } from './types'

// ─── Module 1 — Python & ML Foundations ──────────────────────────────────────

const lessons: MlLessonData[] = []

// Lesson 1.1 — Getting Started with Python for ML
lessons.push({
  title: 'Lesson 1.1 — Getting Started with Python for ML',
  duration: 35,
  content: `## Learning Objectives
By the end of this lesson you should be able to:
- Run Python code and read the errors when things go wrong.
- Use variables, lists, loops, conditionals, and functions to solve a small task.
- Explain why Python, rather than a spreadsheet, is the right tool for machine learning.

## Introduction
Machine learning is built in Python, so you will write code from the very first lesson. The good news: you do not need to be a programmer yet. You need a small, solid core — variables, lists, loops, conditionals, and functions — and this lesson gives it to you. Everything else in this course builds on these five pieces.

## Running Python
You can run Python two ways:
- A script file: python my_file.py runs the whole file top to bottom.
- A notebook: each cell runs on its own and shows its result immediately underneath.

For this course, a notebook (Jupyter, VS Code, or Google Colab) is the friendliest choice because you will explore data interactively.

## Variables and Types
A variable stores a value under a name:

\`price = 250\`
\`name = "iris"\`

Python remembers the type for you. \`type(price)\` prints \`int\`, and \`type(name)\` prints \`str\`. You never declare a type by hand.

## Lists and Loops
A list holds many values in order:

\`scores = [70, 85, 90, 66, 88]\`

A for loop repeats work for every item in the list:

\`for s in scores:\`
\`    print(s)\`

## Conditionals
An if statement runs code only when a condition is true:

\`if price > 100:\`
\`    print("expensive")\`
\`else:\`
\`    print("cheap")\`

## Functions
A function packages steps under a name you can reuse. Define it once, call it anywhere:

\`def average(numbers):\`
\`    return sum(numbers) / len(numbers)\`

\`print(average(scores))\`   # output: 79.8

Notice the indentation. Python uses four spaces to show which lines belong inside the for, if, or def block. Get the indentation wrong and Python stops with an error — the error message tells you the exact line and what it expected.

## Worked Example
Compute the average price from a store's price list:

\`prices = [120, 45, 300, 80, 199]\`
\`total = sum(prices)\`
\`count = len(prices)\`
\`average_price = total / count\`
\`print(average_price)\`

Output:

\`148.8\`

Now imagine doing this in a spreadsheet: you click, drag, and hope the formula copied correctly. In Python the steps are written down once and they run identically every time. That reproducibility is exactly what machine-learning projects demand.

## Practical Exercise — First Steps
In a new notebook, run this program:

\`prices = [120, 45, 300, 80, 199]\`
\`for p in prices:\`
\`    if p > 100:\`
\`        print(p, "is expensive")\`

Tasks:
1. Run it and note which prices print.
2. Before the loop add: \`expensive_total = 0\`.
3. Inside the if block add: \`expensive_total = expensive_total + p\`.
4. After the loop add: \`print(expensive_total)\`.
5. Run it again — the total should be 619 (120 + 300 + 199).

Check your work: the program prints 120 is expensive, 300 is expensive, and 199 is expensive, then 619.

## Key Takeaways
- Variables, lists, loops, conditionals, and functions are the whole core you need for now.
- Indentation (four spaces) is how Python marks a block — it is not optional.
- \`sum\`, \`len\`, \`type\`, and \`print\` are handy built-in helpers.
- Code in a notebook runs step by step, making mistakes easy to inspect.

## Quiz Answer Key
Attempt the quiz below before reading this.
1. (b) Square brackets create a list: \`[1, 2, 3]\`.
2. (b) Indentation marks the body of a loop or conditional.
3. False — Python infers the type from the value automatically.
4. def — the keyword that defines a function.
5. (a) Total divided by count: \`sum(scores) / len(scores)\`.`,
  quiz: {
    title: 'Quiz — Getting Started with Python',
    description: 'Five quick questions on variables, lists, loops, conditionals, and functions.',
    timeLimit: 10,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        questionText: 'Which of the following creates a list in Python?',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: '(1, 2, 3)', isCorrect: false },
          { id: 'b', text: '[1, 2, 3]', isCorrect: true },
          { id: 'c', text: '{1, 2, 3}', isCorrect: false },
          { id: 'd', text: '"1, 2, 3"',isCorrect: false },
        ],
        correctAnswer: 'b',
      },
      {
        questionText: 'In Python, the body of a loop or conditional is marked by:',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'curly braces',isCorrect: false },
          { id: 'b', text: 'indentation',isCorrect: true },
          { id: 'c', text: 'the end keyword',isCorrect: false },
          { id: 'd', text: 'semicolons',isCorrect: false },
        ],
        correctAnswer: 'b',
      },
      {
        questionText: 'When you write price = 250, you must declare the type of price first.',
        questionType: 'true_false',
        correctAnswer: 'false',
      },
      {
        questionText: 'A reusable block of code is created with the ______ keyword.',
        questionType: 'fill_blank',
        correctAnswer: 'def',
      },
      {
        questionText: 'Which expression computes the average of the list scores?',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'sum(scores) / len(scores)',isCorrect: true },
          { id: 'b', text: 'len(scores) / sum(scores)',isCorrect: false },
          { id: 'c', text: 'sum(scores) * len(scores)',isCorrect: false },
          { id: 'd', text: 'max(scores) / min(scores)',isCorrect: false },
        ],
        correctAnswer: 'a',
      },
    ],
  },
  assignment: {
    title: 'Assignment 1.1 — Your First Python Script',
    description: 'Write a small script that works on a list of seven daily sales figures: 340, 210, 465,  178,,  390,,250,,301. The script must print the total sales, the average daily sale, and how many days sold more than 300. Deliverable: your script and its printed output, pasted into the answer box. What a good answer looks like: the program uses a for loop and an if condition (no hand-counting), prints exactly three clear lines, and gives total = 2134, average = 304.86, and 4 days above 300. Rubric: 6 marks for a correct total, 6 marks for the matched count of days above 300, 8 marks for clean indented code that runs without errors.',
    dueDate: '2026-07-08T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: theory',
    questions: [
      { id: 'q1', type: 'subjective', title: 'Write the sales script described in the brief and paste your code plus its printed output.', marks: 14 },
      { id: 'q2', type: 'theory', title: 'In one sentence, explain why storing the sales figures in a single list made the loop possible — what would you have had to write if each day were a separate variable?', marks: 6 },
    ],
  },
})

export const module01: MlModuleData = {
  title: 'Module 1 — Python & ML Foundations',
  lessons,
}