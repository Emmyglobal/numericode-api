import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 1 — Revision of First Term Work',
  duration: 45,
  content: `# Week 1 — Revision of First Term Work

## Learning Objectives
- Consolidate First Term topics.
- Solve mixed problems.

## Topics
Statistics, angles, indices, standard form, fractions, directed numbers, algebra.

## Practice
1. Mean of 4,6,8,10. HCF of 28 and 42.
2. 0.0065 in standard form. (-6)x(-5)/(-10).
3. Factorize 2y+6. 3/8 as decimal.`,
  quiz: {
    title: 'Quiz W1 — Revision',
    description: '5 mixed questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'HCF of 28 and 42:', questionType: 'fill_blank', correctAnswer: '14' },
      { id: 'q2', questionText: '0.0065 in standard form:', questionType: 'fill_blank', correctAnswer: '6.5 x 10^(-3)' },
      { id: 'q3', questionText: '(-6)x(-5)/(-10):', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'q4', questionText: 'True or false: Sum of angles in triangle = 180.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q5', questionText: 'Factorize 2y+6:', questionType: 'fill_blank', correctAnswer: '2(y+3)' },
    ],
  },
  assignment: {
    title: 'Assignment W1',
    description: 'Mixed review.',
    dueDate: '2026-01-25T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Find HCF of 28 and 42, LCM of 10 and 15.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Express 30000 and 0.0065 in standard form.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Simplify (-6)x(-5)/(-10) and factorize 2y+6.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Find mean of 4,6,8,10.', marks: 5 },
    ],
  },
})
lessons.push({
  title: 'Week 2 — Simple Equations',
  duration: 45,
  content: `# Week 2 — Simple Equations

## Learning Objectives
- Solve equations with unknown on both sides.
- Clear fractions in equations.
- Solve word problems leading to equations.

## Solving Equations
Collect unknown terms on one side, numbers on the other.
18 - 5f = 2f + 4 -> 18 - 4 = 7f -> f = 2.
2(4-x) = 3(2-x) -> 8-2x = 6-3x -> x = -2.

## Equations with Fractions
Multiply both sides by LCM of denominators to clear fractions.
5 = (2y-3)/7 -> 35 = 2y-3 -> y = 19.

## Word Problems
Let unknown be x. "Five times the smaller plus three times the greater makes 59" (consecutive: x, x+1):
5x + 3(x+1) = 59 -> x = 7. Numbers are 7 and 8.

## Class Activity
1. Solve: 4x+7 = 5x+6, 7(2e-3) = 4(4e+9).
2. Solve: 5 = (2y-3)/7.

## Assignment
1. Solve: 18-5f = 2f+4, 2(4-x) = 3(2-x).
2. Word problem: subtract from a number, multiply by 5, add 9 = 54. Find the number.

## Key Takeaways
- Get all unknowns on one side.
- Clear fractions first using LCM.
- Define variable, translate, solve, check.`,
  quiz: {
    title: 'Quiz W2 — Simple Equations',
    description: '5 questions on equations.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Solve 18-5f = 2f+4:', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q2', questionText: 'Solve 5 = (2y-3)/7:', questionType: 'fill_blank', correctAnswer: '19' },
      { id: 'q3', questionText: 'If 5x+3(x+1)=59, x=', questionType: 'multiple_choice', options: [{ id: 'a', text: '5', isCorrect: false }, { id: 'b', text: '7', isCorrect: true }, { id: 'c', text: '8', isCorrect: false }, { id: 'd', text: '59', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q4', questionText: 'True or false: To clear fractions, multiply by the LCM.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q5', questionText: 'Solve 2(4-x) = 3(2-x):', questionType: 'fill_blank', correctAnswer: '-2' },
    ],
  },
  assignment: {
    title: 'Assignment W2',
    description: 'Complete all questions.',
    dueDate: '2026-02-01T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve: 18-5f=2f+4, 2(4-x)=3(2-x).', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Solve: 5=(2y-3)/7, (4x-3)/2=(9x-6)/8+2 3/4.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Find two consecutive numbers: 5x+3(x+1)=59.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'I subtract from a number, multiply by 5, add 9=54. Find the number.', marks: 5 },
    ],
  },
})
export const module01: Jss2ModuleData = { title: 'Module 1 — Weeks 1-2: Revision & Simple Equations', lessons }
