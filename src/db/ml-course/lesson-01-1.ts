import type { MlLessonData } from './types'

// ─── Lesson 1.1 — Python refresher (variables, lists, loops, conditionals, functions) ──
export const lesson01_1: MlLessonData = {
  title: 'Getting Started with Python for ML',
  duration: 25,
  content: `## Learning Objectives
By the end of this lesson you should be able to:
- Run Python code and read the errors when things go wrong.
- Use variables, lists, loops, conditionals, and functions on a small task.
- Explain why Python, not a spreadsheet, is the tool for machine learning.

## Introduction
Machine learning runs in Python, so you write code from day one. You don't need to be a programmer yet — just four ideas: a variable that stores a value, a list that holds many, a loop that repeats, a condition that chooses, and a function you can reuse.

## Variables and Types
\`price = 250\`    # a number
\`name = "iris"\`  # text
Python infers the type; you never declare it.

## Lists and Loops
\`prices = [120, 45, 300, 80, 199]\`
\`for p in prices:\`
\`    print(p)\`

## Conditionals
\`if price > 100:\`
\`    print("expensive")\`
\`else:\`
\`    print("cheap")\`

## Functions
\`def average(numbers):\`
\`    return sum(numbers) / len(numbers)\`
\`print(average(prices))\`   # 148.8
Indentation is syntax here: four spaces mean "inside this block".

## Worked Example — Store Prices
\`prices = [120, 45, 300, 80, 199]\`      # a list (Python list)
\`total = sum(prices)\`                   # add them
\`count = len(prices)\`                   # how many
\`average_price = total / count\`          # divide
\`print(average_price)\`                  # 148.8

## Practical Exercise — First Steps
Run this and observe:
\`prices = [120, 45, 300, 80, 199]\`
\`for p in prices:\`
\`    if p > 100:\`
\`        print(p, "is expensive")\`
Tasks: (1) which prices print; (2) add \`expensive_total = 0\` before the loop and run; (3) add \`expensive_total = expensive_total + p\` inside the if, then \`print(expensive_total)\`.
Check your work: it prints 120, 300, 199, then 619.
Expected scaffold (copy exactly):
\`    prices = [120, 45, 300, 80, 199]\`
\`    for p in prices:\`
\`        if p > 100:\`
\`            print(p, "is expensive")\`

## Key Takeaways
- A variable, list, loop, condition, and function are all you need right now.
- Indentation, not braces, marks a block — get it wrong and Python errors.
- \`sum\` and \`len\` do a lot of work for you.

## Quiz Answer Key (attempt the quiz first)
1. (b) Python is the language most libraries are built with.
2. (b) Lists keep order and you index by position (\`prices[0] == 120\`).
3. False — you assign by name, not by type.
4. \`def\` — the keyword that creates a function.
5. (a) \`sum(prices) / len(prices)\` is exactly the average.
`,
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
          { id: 'd', text: '"1, 2, 3"', isCorrect: false },
        ],
        correctAnswer: 'b',
      },
      {
        questionText: 'In Python, the body of a loop or conditional is marked by:',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'curly braces', isCorrect: false },
          { id: 'b', text: 'indentation', isCorrect: true },
          { id: 'c', text: 'semicolons', isCorrect: false },
          { id: 'd', text: 'parentheses', isCorrect: false },
        ],
        correctAnswer: 'b',
      },
      {
        questionText: 'In Python you must declare a variable\'s type when you create it.',
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
          { id: 'a', text: 'sum(scores) / len(scores)', isCorrect: true },
          { id: 'b', text: 'len(scores) / sum(scores)', isCorrect: false },
          { id: 'c', text: 'sum(scores) * len(scores)', isCorrect: false },
          { id: 'd', text: 'max(scores) - min(scores)', isCorrect: false },
        ],
        correctAnswer: 'a',
      },
    ],
  },
  assignment: {
    title: 'Assignment 1.1 — Your First Python Script',
    description: 'Write a small script that works on a list of seven daily sales figures: 340, 210, 465, 178, 390, 250, 301. The script must print the total sales, the average daily sale, and how many days sold more than 300. Deliverable: your script and its printed output, pasted into the answer box. What a good answer looks like: the program uses a for loop and an if condition (no hand-counting), prints exactly three clear lines, and gives total = 2134, average = 304.86, and 4 days above 300. Rubric: 6 marks for a correct total, 6 marks for the matched count of days above 300, 8 marks for clean indented code that runs without errors.',
    dueDate: '2026-07-08T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'theory',
    questions: [
      { id: 'q1', type: 'subjective', title: 'Write the sales script described in the brief and paste your code plus its printed output.', marks: 14 },
      { id: 'q2', type: 'theory', title: 'In one sentence, explain why storing the sales figures in a single list made the loop possible — what would you have had to write if each day were a separate variable?', marks: 6 },
    ],
  },
}
