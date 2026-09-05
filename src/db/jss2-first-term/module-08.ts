import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 8 — Algebraic Expressions I',
  duration: 45,
  content: `# Week 8 — Algebraic Expressions I: Directed Terms, Brackets, Factorization

## Learning Objectives
- Simplify directed algebraic terms.
- Remove brackets and simplify.
- Factorize simple algebraic expressions.

## Directed Terms
6 x a = 6a. -5 x 2x = -10x. -3x x -2y = +6xy. (-1/8) of (-48t) = 6t.

## Removing Brackets
3(x+y) = 3x+3y. (5-3d)3a = 15a-9ad. -5a(-5x-7y) = 25ax+35ay.

## Factorization
Find the HCF of terms and factor it out.
2y+6 = 2(y+3). 3y^2+12y = 3y(y+4).

## Class Activity
1. Simplify: 6xa, -5x2x, -3x x -2y.
2. Remove brackets: 3(x+y), (5-3d)3a.
3. Factorize: 2y+6, 3y^2+12y.

## Assignment
1. Remove brackets and simplify: 3(x+y), z(z-1)-10(z-1).
2. Factorize: 4y-20, 2x^2+10x.

## Key Takeaways
- Multiply signs carefully: same = positive, different = negative.
- Factorization is the reverse of removing brackets.
- Always look for the HCF first.`,
  quiz: {
    title: 'Quiz W8 — Algebraic Expressions',
    description: '5 questions on algebraic expressions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '-3x x -2y =', questionType: 'fill_blank', correctAnswer: '6xy' },
      { id: 'q2', questionText: '3(x+y) removes to:', questionType: 'fill_blank', correctAnswer: '3x+3y' },
      { id: 'q3', questionText: 'Factorize 2y+6:', questionType: 'multiple_choice', options: [{ id: 'a', text: '2(y+3)', isCorrect: true }, { id: 'b', text: 'y(2+6)', isCorrect: false }, { id: 'c', text: '2y+6', isCorrect: false }, { id: 'd', text: '2(y+6)', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q4', questionText: 'True or false: (-1/8) of (-48t) = 6t.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q5', questionText: 'Factorize 3y^2+12y:', questionType: 'fill_blank', correctAnswer: '3y(y+4)' },
    ],
  },
  assignment: {
    title: 'Assignment W8',
    description: 'Complete all questions.',
    dueDate: '2026-11-02T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Simplify: 6xa, -5x2x, -3x x -2y, (-1/8) of (-48t).', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Remove brackets: 3(x+y), (5-3d)3a, -5a(-5x-7y).', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Factorize: 2y+6, 3y^2+12y, 4y-20.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Find HCF of 2xy and 7xz, and LCM of 2x and 3.', marks: 5 },
    ],
  },
})
export const module08: Jss2ModuleData = { title: 'Module 8 — Week 8: Algebraic Expressions I', lessons }
