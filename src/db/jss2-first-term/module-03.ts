import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 3 — Whole Numbers II: Prime Factors, HCF & LCM',
  duration: 45,
  content: `# Week 3 — Whole Numbers II: Prime Factors, HCF, LCM, Squares & Square Roots

## Learning Objectives
- Express a number as a product of its prime factors.
- Find HCF and LCM of two or more numbers.
- Calculate squares and square roots.

## Prime Factors
Prime numbers have exactly two factors: 1 and themselves (2, 3, 5, 7, 11, ...).

### Worked Example 1
Express 36 as a product of prime factors: 36 = 2 x 2 x 3 x 3 = 2^2 x 3^2.

## HCF (Highest Common Factor)
The largest number that divides all given numbers.

### Worked Example 2
HCF of 28 and 42: factors of 28 = {1,2,4,7,14,28}, factors of 42 = {1,2,3,6,7,14,21,42}. Common: {1,2,7,14}. HCF = 14.

## LCM (Lowest Common Multiple)
The smallest number that is a multiple of all given numbers.

### Worked Example 3
LCM of 10 and 15: multiples of 10 = {10,20,30,...}, multiples of 15 = {15,30,...}. LCM = 30.

## Squares and Square Roots
Square of 5 = 25. Square root of 49 = 7. Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.

### Worked Example 4
sqrt(11025) by factors: 11025 = 3^2 x 5^2 x 7^2, so sqrt = 3 x 5 x 7 = 105.

## Class Activity
1. Prime factors of 36, HCF of 54 and 105, LCM of 10 and 15.
2. Find square root of 6400 by factors.
3. Smallest number to multiply 12 by to get a perfect square.

## Assignment
1. HCF of 28 and 42, LCM of 22, 30 and 40.
2. Square roots of 11025 and 6400 by factors.

## Key Takeaways
- Prime factorisation breaks numbers into building blocks.
- HCF uses common prime factors (lowest powers).
- LCM uses all prime factors (highest powers).`,
  quiz: {
    title: 'Quiz W3 — HCF, LCM, Squares',
    description: '5 questions on prime factors, HCF, LCM, square roots.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '36 as a product of prime factors is:', questionType: 'fill_blank', correctAnswer: '2^2 x 3^2' },
      { id: 'q2', questionText: 'HCF of 28 and 42 is:', questionType: 'fill_blank', correctAnswer: '14' },
      { id: 'q3', questionText: 'LCM of 10 and 15 is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '5', isCorrect: false }, { id: 'b', text: '30', isCorrect: true }, { id: 'c', text: '150', isCorrect: false }, { id: 'd', text: '25', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q4', questionText: 'True or false: sqrt(49) = 7.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q5', questionText: 'sqrt(6400) by factors is:', questionType: 'fill_blank', correctAnswer: '80' },
    ],
  },
  assignment: {
    title: 'Assignment W3',
    description: 'Complete all questions.',
    dueDate: '2026-09-28T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Express 36, 54 and 105 as products of prime factors.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Find HCF of 28 and 42, and LCM of 10 and 15.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Find sqrt(11025) and sqrt(6400) by factors.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Smallest number to multiply 12 by to get a perfect square?', marks: 5 },
    ],
  },
})
export const module03: Jss2ModuleData = { title: 'Module 3 — Week 3: Prime Factors, HCF, LCM, Squares', lessons }
