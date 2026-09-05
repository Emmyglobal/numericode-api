import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 9 — Algebraic Fractions & Word Problems',
  duration: 45,
  content: `# Week 9 — Algebraic Fractions & Word Problems

## Learning Objectives
- Simplify algebraic fractions.
- Translate word problems into equations and solve.

## Algebraic Fractions
5a/6 + 10a/6 = 15a/6 = 5a/2.
2/3e + 5/4f = (8f + 15e) / 12ef (LCM of 3e and 4f is 12ef).

## Word Problems
Let the unknown be x. Translate words to equations.
"Five times the smaller plus three times the greater makes 59" (consecutive: x, x+1):
5x + 3(x+1) = 59 -> 8x + 3 = 59 -> x = 7. Numbers are 7 and 8.

## Class Activity
1. Simplify: 5a/6 + 10a/6, 2/3e + 5/4f.
2. Find two consecutive numbers: 5x + 3(x+1) = 59.

## Assignment
1. Simplify algebraic fractions.
2. Word problem: subtract from a number, multiply by 5, add 9, result is 54. Find the number.

## Key Takeaways
- Algebraic fractions: find LCM of denominators.
- Word problems: define variable, translate, solve, check.`,
  quiz: {
    title: 'Quiz W9 — Algebraic Fractions & Word Problems',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '5a/6 + 10a/6 =', questionType: 'fill_blank', correctAnswer: '5a/2' },
      { id: 'q2', questionText: 'If 5x + 3(x+1) = 59, x =', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'q3', questionText: 'True or false: LCM of 3e and 4f is 12ef.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'A number: subtract, multiply by 5, add 9 = 54. The number is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '9', isCorrect: true }, { id: 'b', text: '12', isCorrect: false }, { id: 'c', text: '15', isCorrect: false }, { id: 'd', text: '45', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q5', questionText: 'Factorize 2x-6p+12y:', questionType: 'fill_blank', correctAnswer: '2(x-3p+6y)' },
    ],
  },
  assignment: {
    title: 'Assignment W9',
    description: 'Complete all questions.',
    dueDate: '2026-11-09T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Simplify: 5a/6 + 10a/6, 2/3e + 5/4f.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Find two consecutive numbers where 5x + 3(x+1) = 59.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'I subtract from a number, multiply by 5, add 9 = 54. Find the number.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'A shop sells x books at N500, y at N600, z at N900. How many books total? Total cost?', marks: 5 },
    ],
  },
})
export const module09: Jss2ModuleData = { title: 'Module 9 — Week 9: Algebraic Fractions & Word Problems', lessons }
