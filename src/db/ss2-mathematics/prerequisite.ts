import type { Ss2ModuleData, Ss2LessonData } from './types'

// ─── SS2 Mathematics — compulsory pre-requisite (SS1 foundations) ─────────────
// Placed as the first module so students must pass the foundations quiz
// (70%+) before starting First Term work. Same auto-gradable quiz types as
// every other course.

const lessons: Ss2LessonData[] = []

lessons.push({
  title: 'Pre-requisite Quiz — SS1 Mathematics Foundations',
  duration: 30,
  content: `# Pre-requisite Quiz — SS1 Mathematics Foundations

This quiz is **compulsory**. You must score 70% or higher before starting the SS2 First Term modules.

## Topics Covered
- Variation (direct, inverse, joint, partial)
- Area of a sector and length of an arc
- Indices and standard form
- Basic logarithms and percentages
- Simple algebraic fractions

## Instructions
- 30 minutes, 12 questions. 3 attempts allowed.
- Pass mark: 70%.
- Revise your SS1 notes before attempting — every SS2 topic builds on these.`,
  quiz: {
    title: 'Pre-requisite Quiz — SS1 Mathematics Foundations',
    description: 'Compulsory foundations quiz. Score 70% to unlock the SS2 First Term course.',
    timeLimit: 1800,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'If $y$ varies directly as $x$, then:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'y = kx', isCorrect: true }, { id: 'b', text: 'y = k/x', isCorrect: false }, { id: 'c', text: 'y = kxz', isCorrect: false }, { id: 'd', text: 'y = a + bx', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq2', questionText: 'The area of a sector with angle $\\theta$ and radius $r$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'θ/360 × πr²', isCorrect: true }, { id: 'b', text: 'πr²', isCorrect: false }, { id: 'c', text: '2πr', isCorrect: false }, { id: 'd', text: 'θr²', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq3', questionText: '$2^3 \\times 2^4$ equals:', questionType: 'fill_blank', correctAnswer: '128' },
      { id: 'pq4', questionText: 'True or false: $y$ varies inversely as $x$ means $y = k/x$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq5', questionText: 'Write 4500 in standard form: $4.5 \\times 10^n$. What is $n$?', questionType: 'fill_blank', correctAnswer: '3' },
      { id: 'pq6', questionText: 'log 100 (to base 10) equals:', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'pq7', questionText: 'True or false: the value of $\\pi$ used in four-figure tables is 22/7 or 3.142.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq8', questionText: 'Simplify $\\frac{3x}{4} + \\frac{x}{2}$:', questionType: 'multiple_choice', options: [{ id: 'a', text: '4x/6', isCorrect: false }, { id: 'b', text: '5x/4', isCorrect: true }, { id: 'c', text: 'x/4', isCorrect: false }, { id: 'd', text: '3x/4', isCorrect: false }], correctAnswer: 'b' },
      { id: 'pq9', questionText: '15% of ₦8,000 is ₦____', questionType: 'fill_blank', correctAnswer: '1200' },
      { id: 'pq10', questionText: 'True or false: $x^0 = 1$ for any non-zero $x$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq11', questionText: 'If $y \\propto x$ and $y = 12$ when $x = 3$, find $y$ when $x = 7$.', questionType: 'fill_blank', correctAnswer: '28' },
      { id: 'pq12', questionText: 'The perimeter of a circle of radius $r$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'πr²', isCorrect: false }, { id: 'b', text: '2πr', isCorrect: true }, { id: 'c', text: 'πr', isCorrect: false }, { id: 'd', text: 'πd²', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — Foundations Check',
    description: 'Show full working for each question. What a good answer looks like: clear statements of formulas, step-by-step substitution, and final answers with units. Rubric: 5 marks per question (method 3, accuracy 2).',
    dueDate: '2026-09-11T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: '$t$ varies directly as $V$ and inversely as $P$. When $V = 40$ and $P = 10$, $t = 20$. Find the relationship between $t$, $V$ and $P$, then find $t$ when $V = 50$ and $P = 5$.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'A sector of a circle has radius 7 cm and angle 90°. Find (a) its area, (b) the length of its arc. Take $\\pi = 22/7$.', marks: 10 },
    ],
  },
})

export const prerequisiteModule: Ss2ModuleData = { title: 'Pre-requisite — SS1 Foundations', lessons }