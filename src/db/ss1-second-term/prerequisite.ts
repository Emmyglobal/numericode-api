import type { Ss1ModuleData, Ss1LessonData } from './types'

// ─── SS1 Mathematics — Second Term: compulsory pre-requisite quiz ──────────────
// Before starting Second Term, students must demonstrate they remember First Term
// work: quadratic equations, sets, circle theorems, trigonometry and basic logic.

const lessons: Ss1LessonData[] = []

lessons.push({
  title: 'Pre-requisite Quiz — First Term Review',
  duration: 30,
  content: `# Pre-requisite Quiz — First Term Review

Before starting Second Term, you must pass this compulsory quiz reviewing First Term work.

## Topics Covered
- Basic operations and number bases
- Modular arithmetic
- Standard form and approximation
- Indices and logarithms
- Linear equations and variation

## Instructions
- Duration: 30 minutes, 12 questions. 3 attempts allowed.
- Pass mark: 70% (at least 9 out of 12 correct).
- Revise your First Term notes before attempting.`,
  quiz: {
    title: 'Pre-requisite Quiz — First Term Review',
    description: 'Compulsory First Term review quiz. Score 70% to unlock the course.',
    timeLimit: 1800,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'Simplify: (-7) x (+3) =', questionType: 'fill_blank', correctAnswer: '-21' },
      { id: 'pq2', questionText: 'Express 0.0045 in standard form.', questionType: 'fill_blank', correctAnswer: '4.5 x 10^(-3)' },
      { id: 'pq3', questionText: 'Solve: 3x - 7 = 14', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'pq4', questionText: 'The characteristic of log 567.8 is:', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'pq5', questionText: 'True or false: If a ≡ b (mod 5) and 7 ≡ 2 (mod 5), then a + 7 ≡ b + 2 (mod 5).', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq6', questionText: 'Convert 25 (base 10) to base 3.', questionType: 'fill_blank', correctAnswer: '221' },
      { id: 'pq7', questionText: 'If y varies inversely as x and y = 4 when x = 6, find y when x = 8.', questionType: 'fill_blank', correctAnswer: '3' },
      { id: 'pq8', questionText: 'What is the 5th root of 32?', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'pq9', questionText: 'True or false: log 1000 (base 10) = 3.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq10', questionText: 'Simplify: (2x + 3)(x - 1) =', questionType: 'multiple_choice', options: [{ id: 'a', text: '2x^2 + x - 3', isCorrect: true }, { id: 'b', text: '2x^2 - x - 3', isCorrect: false }, { id: 'c', text: '2x^2 + 5x - 3', isCorrect: false }, { id: 'd', text: '2x^2 + x + 3', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq11', questionText: '0.006897 correct to 3 significant figures is:', questionType: 'fill_blank', correctAnswer: '0.00690' },
      { id: 'pq12', questionText: 'The multiplicative inverse of 3 mod 7 is:', questionType: 'fill_blank', correctAnswer: '5' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — First Term Review',
    description: 'Review problems from First Term. Show all working.',
    dueDate: '2026-10-01T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Simplify, leaving your answer in standard form: (4 x 10^5) x (3 x 10^(-2)).', marks: 6 },
      { id: 'a2', type: 'subjective', title: 'Convert 47 (base 10) to base 5.', marks: 6 },
      { id: 'a3', type: 'subjective', title: 'Solve the simultaneous equations: 3x + 2y = 8 and x - y = 1.', marks: 8 },
    ],
  },
})

export const prerequisiteModule: Ss1ModuleData = { title: 'Pre-requisite — First Term Review', lessons }