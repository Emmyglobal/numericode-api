import type { Ss1ModuleData, Ss1LessonData } from './types'

// ─── SS1 Mathematics — First Term: compulsory pre-requisite quiz ───────────────
// SS1 students should know how to add, subtract, multiply and divide integers,
// work with fractions, decimals and percentages, and solve simple linear equations.
// This quiz is placed as the very first module so students must pass it (70%+)
// before starting First Term work.

const lessons: Ss1LessonData[] = []

lessons.push({
  title: 'Pre-requisite Quiz — SS1 Mathematics Foundations',
  duration: 30,
  content: `# Pre-requisite Quiz — SS1 Mathematics Foundations

This quiz is **compulsory**. You must score **70% or higher** before starting the SS1 First Term modules.

## Topics Covered
- Whole numbers and basic operations
- Fractions, decimals and percentages
- Simple algebraic equations
- Geometry basics (perimeter, area, angles)
- Word problems

## Instructions
- Duration: 30 minutes, 12 questions. 3 attempts allowed.
- Pass mark: 70% (at least 9 out of 12 questions correct).
- This quiz checks the basic maths skills you need for First Term.
- If you do not pass, review your SS1 notes and try again.`,
  quiz: {
    title: 'Pre-requisite Quiz — SS1 Mathematics Foundations',
    description: 'Compulsory foundations quiz. Score 70% to unlock the SS1 First Term course.',
    timeLimit: 1800,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'What is 15 + (-8)?', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'pq2', questionText: 'Simplify: 3/4 + 1/2', questionType: 'fill_blank', correctAnswer: '5/4 or 1 1/4 or 1.25' },
      { id: 'pq3', questionText: 'Convert 0.375 to a fraction in simplest form.', questionType: 'fill_blank', correctAnswer: '3/8' },
      { id: 'pq4', questionText: 'What is 20% of 150?', questionType: 'fill_blank', correctAnswer: '30' },
      { id: 'pq5', questionText: 'If 3x + 5 = 20, what is x?', questionType: 'fill_blank', correctAnswer: '5' },
      { id: 'pq6', questionText: 'The sum of angles in a triangle is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '90 degrees', isCorrect: false }, { id: 'b', text: '180 degrees', isCorrect: true }, { id: 'c', text: '360 degrees', isCorrect: false }, { id: 'd', text: '270 degrees', isCorrect: false }], correctAnswer: 'b' },
      { id: 'pq7', questionText: 'True or false: (-5) x (-3) = 15.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq8', questionText: 'What is the perimeter of a square with side 7 cm?', questionType: 'fill_blank', correctAnswer: '28 cm' },
      { id: 'pq9', questionText: 'The area of a rectangle with length 12 cm and width 5 cm is:', questionType: 'fill_blank', correctAnswer: '60 cm2' },
      { id: 'pq10', questionText: 'True or false: 2/3 is greater than 3/4.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'pq11', questionText: 'If x varies directly as y and x=10 when y=5, find x when y=15.', questionType: 'fill_blank', correctAnswer: '30' },
      { id: 'pq12', questionText: 'Simplify: 2x^2 × 3x^3', questionType: 'multiple_choice', options: [{ id: 'a', text: '5x^5', isCorrect: false }, { id: 'b', text: '6x^5', isCorrect: true }, { id: 'c', text: '6x^6', isCorrect: false }, { id: 'd', text: '5x^6', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — SS1 Foundations',
    description: 'Show full working for each question. Rubric: 5 marks per question (method 3, accuracy 2).',
    dueDate: '2026-09-11T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'A rectangle has length (2x + 3) cm and width (x - 1) cm. If its perimeter is 34 cm, find x and hence the area.', marks: 10 },
      { id: 'a2', type: 'subjective', title: 'A student scored 72 out of 80 in a test. What percentage did the student score? If the pass mark is 50%, did the student pass?', marks: 10 },
    ],
  },
})

export const prerequisiteModule: Ss1ModuleData = { title: 'Pre-requisite — SS1 Foundations', lessons }