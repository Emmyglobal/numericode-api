// ─── Lesson P1.1 — Variables & Output ─────────────────────────────────────────
import type { LessonData } from './types'

export const lessonP1_1: LessonData = {
  title: "P1.1 — Your First Program: Variables & Output",
  duration: 8,
  content: `# P1.1 — Your First Program: Variables & Output

A variable is a named box that holds a value. \`print\` shows it.

## Learning Objectives
- Store text and numbers in variables and print them.
- Use \`str\` (strings) and numbers together.
- Read the difference between a value and its name.

## Introduction
Python powers machine learning, so we start by talking to Python. The two moves you need are: store something in a name, then show it.

## Variables and Types
price = 250          # a number (int)
name = "iris"        # text (str)
Python picks the type; you do not declare it. Reassigning changes the value in place.

## Output with print
print(name)          # iris
print(price)         # 250
To print more than one thing, separate with commas; print joins them with spaces.
print(name, price)   # iris 250

## Worked Example — Sales Day
name = "iris"
units = 12
price = 250
revenue = units * price
print(name, units, price, revenue)   # iris 12 250 3000

## Practical Exercise — Store Prices
Run this and observe:
prices = [120, 45, 300, 80, 199]
for p in prices:
    if p > 100:
        print(p, "is expensive")

Tasks: (1) which prices print; (2) add expensive_total = 0 before the loop, then expensive_total = expensive_total + p inside the if, then print(expensive_total). Check your work: it prints 120, 300, 199, then 619.
Expected scaffold lines (copy exactly):
    prices = [120, 45, 300, 80, 199]
    for p in prices:
        if p > 100:
            print(p, "is expensive")

## Key Takeaways
- A variable is a name bound to a value; \`print\` writes to the screen.
- Numbers and strings combine with +, but never mix directly — use str().
- Read every error fully: traceback line numbers point at the real problem.

## Quiz Answer Key
1. (b) The Practical Exercise key is ## Practical Exercise.
2. (c) _score1 is valid; names can start with _ then digits.
3. (d) A variable is a named storage location for a value.
4. True — print is Python's standard output function.
5. (b) print(price) outputs 250.
`,
  quiz: {
    title: "Quiz P1.1 — Variables & Output",
    description: "5 auto-gradable questions on running Python, variables, and printing.",
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: "q1",
        questionText: "Which key do you look for in the lesson body's 'Run this code' Practical Exercise to copy the starter lines for Python P1.1?",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "## Worked Example", isCorrect: false },
          { id: "b", text: "## Practical Exercise", isCorrect: true },
          { id: "c", text: "## Key Takeaways", isCorrect: false },
          { id: "d", text: "## Quiz Answer Key", isCorrect: false },
        ],
        correctAnswer: "b",
      },
      {
        id: "q2",
        questionText: "In Python, which of the following is a valid variable name?",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "2nd_place", isCorrect: false },
          { id: "b", text: "user-name", isCorrect: false },
          { id: "c", text: "_score1", isCorrect: true },
          { id: "d", text: "class", isCorrect: false },
        ],
        correctAnswer: "c",
      },
      {
        id: "q3",
        questionText: "Fill in the blank: A named location that stores a value is called a ______.",
        questionType: "fill_blank",
        options: [
          { id: "a", text: "function", isCorrect: false },
          { id: "b", text: "module", isCorrect: false },
          { id: "c", text: "operator", isCorrect: false },
          { id: "d", text: "variable", isCorrect: true },
        ],
        correctAnswer: "d",
      },
      {
        id: "q4",
        questionText: "True or false: `print` is the standard way to show output in Python.",
        questionType: "true_false",
        correctAnswer: "true",
      },
      {
        id: "q5",
        questionText: "What does this line print? `price = 250` then `print(price)`",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "price", isCorrect: false },
          { id: "b", text: "250", isCorrect: true },
          { id: "c", text: "'250'", isCorrect: false },
          { id: "d", text: "name 'price' is not defined", isCorrect: false },
        ],
        correctAnswer: "b",
      },
    ],
  },
  assignment: {
    title: "Assignment P1.1 — First Python Script",
    description: "Write a program that stores a product name (string), its price (number), and how many were sold (an integer), then prints them with labels and computes revenue = price * sold. Good: clear variable names, three print statements with labels, correct revenue value; rubric: 5 correct variables, 9 labels+output, 6 revenue calculation = 20.",
    dueDate: "2026-07-06T23:59:59Z",
    totalMarks: 20,
    passingScore: 10,
    assignmentType: "mixed",
    questions: [
      { id: "q1", type: "theory", title: "Write the complete program, showing the three variable declarations and the three labeled prints plus the revenue print.", marks: 12 },
      { id: "q2", type: "subjective", title: "Why is Python, not a spreadsheet, the tool for machine learning — one sentence?", marks: 8 },
    ],
  },
}

export {}
