import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 2 — Whole Numbers I: Indices & Standard Form',
  duration: 45,
  content: `# Week 2 — Whole Numbers I: Indices & Standard Form

## Learning Objectives
- Apply the laws of indices (multiply, divide, zero, negative powers).
- Express numbers in standard form A x 10^n where 1 <= A < 10.
- Convert between standard form and ordinary form.

## Introduction
Indices (powers) give us a compact way to write repeated multiplication. Standard form extends this to very large and very small numbers — essential for science and WAEC.

## Laws of Indices
- Multiplication: x^a * x^b = x^(a+b)
- Division: x^a / x^b = x^(a-b)
- Zero power: x^0 = 1
- Negative power: 1/x^a = x^(-a)

### Worked Example 1
Simplify: (a) x^5 * x^3 = x^8  (b) y^7 / y^3 = y^4  (c) 10^6 / 10^3 = 10^3 = 1000  (d) 4x^3 * 2x^4 = 8x^7

## Standard Form
A number is in standard form when written as A x 10^n, where 1 <= A < 10 and n is an integer.

### Worked Example 2
Large numbers: (a) 30000 = 3 x 10^4  (b) 45000 = 4.5 x 10^4  (c) 2384 = 2.384 x 10^3
Small numbers: (a) 0.0065 = 6.5 x 10^(-3)  (b) 0.034 = 3.4 x 10^(-2)  (c) 0.00007 = 7 x 10^(-5)

### Worked Example 3
Convert back: (a) 8 x 10^4 = 80000  (b) 3.8 x 10^5 = 380000

## Class Activity
1. Simplify: x^5 * x^3, y^7 * y^3, 10^6 / 10^3, 4x^3 * 2x^4, 27y^5 / 3y^3.
2. Express in standard form: 5081, 0.1067, 0.0014.
3. Convert to ordinary form: 3.05 x 10^4, 2.6 x 10^(-2).

## Assignment
1. Simplify: x^5 * x^3, y^7 / y^3, 27y^5 / 3y^3.
2. Express 30000, 45000, 2384, 0.0065, 0.034 in standard form.
3. Convert 8 x 10^4 and 3.8 x 10^5 to ordinary form.

## Key Takeaways
- Add powers when multiplying, subtract when dividing.
- Standard form: one non-zero digit before the decimal point.
- Positive n for large numbers, negative n for small numbers.`,
  quiz: {
    title: 'Quiz W2 — Indices & Standard Form',
    description: '5 questions on indices and standard form.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'x^5 * x^3 =', questionType: 'fill_blank', correctAnswer: 'x^8' },
      { id: 'q2', questionText: '10^6 / 10^3 =', questionType: 'fill_blank', correctAnswer: '1000' },
      { id: 'q3', questionText: '0.0065 in standard form is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '6.5 x 10^(-3)', isCorrect: true }, { id: 'b', text: '65 x 10^(-4)', isCorrect: false }, { id: 'c', text: '0.65 x 10^(-2)', isCorrect: false }, { id: 'd', text: '6.5 x 10^3', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q4', questionText: 'True or false: x^0 = 1 for any non-zero x.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q5', questionText: '3.8 x 10^5 in ordinary form is:', questionType: 'fill_blank', correctAnswer: '380000' },
    ],
  },
  assignment: {
    title: 'Assignment W2',
    description: 'Complete all questions. Show your working.',
    dueDate: '2026-09-21T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Simplify: x^5 * x^3, y^7 / y^3, 10^6 / 10^3, 27y^5 / 3y^3.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Express in standard form: 30000, 45000, 0.0065, 0.00007.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Convert to ordinary form: 8 x 10^4, 3.8 x 10^5, 2.6 x 10^(-2).', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'True or false: x^0 = 1. Explain your answer.', marks: 5 },
    ],
  },
})
export const module02: Jss2ModuleData = { title: 'Module 2 — Week 2: Indices & Standard Form', lessons }
