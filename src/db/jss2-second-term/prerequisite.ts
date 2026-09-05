import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Pre-requisite Quiz — First Term Review',
  duration: 30,
  content: `# Pre-requisite Quiz — First Term Review

Before starting Second Term, you must pass this compulsory quiz reviewing First Term work.

## Topics Covered
- Statistics, angles, pie charts
- Indices, standard form, prime factors, HCF/LCM
- Fractions, decimals, proportion, directed numbers
- Algebraic expressions and factorization

## Instructions
- 30 minutes, 15 questions, need 70% to pass.
- Reviews the foundations you need for Second Term.`,
  quiz: {
    title: 'Pre-requisite Quiz — First Term Review',
    description: 'Compulsory First Term review quiz.',
    timeLimit: 1800, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'HCF of 28 and 42:', questionType: 'fill_blank', correctAnswer: '14' },
      { id: 'pq2', questionText: '3/8 as a decimal:', questionType: 'fill_blank', correctAnswer: '0.375' },
      { id: 'pq3', questionText: '0.0065 in standard form:', questionType: 'fill_blank', correctAnswer: '6.5 x 10^(-3)' },
      { id: 'pq4', questionText: '(-6)x(-5)/(-10):', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'pq5', questionText: 'True or false: Sum of angles in a triangle is 180 degrees.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq6', questionText: 'Mean of 4,6,8,10:', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'pq7', questionText: 'Factorize 2y+6:', questionType: 'fill_blank', correctAnswer: '2(y+3)' },
      { id: 'pq8', questionText: '2/5 as percentage:', questionType: 'fill_blank', correctAnswer: '40%' },
      { id: 'pq9', questionText: 'LCM of 10 and 15:', questionType: 'fill_blank', correctAnswer: '30' },
      { id: 'pq10', questionText: 'True or false: x^0 = 0.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'pq11', questionText: 'Simple interest on N25000 at 5% for 3 years:', questionType: 'fill_blank', correctAnswer: 'N3750' },
      { id: 'pq12', questionText: 'x^5 * x^3:', questionType: 'fill_blank', correctAnswer: 'x^8' },
      { id: 'pq13', questionText: 'True or false: Mode is the middle value.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'pq14', questionText: '(-36)/(+9):', questionType: 'fill_blank', correctAnswer: '-4' },
      { id: 'pq15', questionText: '5a/6 + 10a/6:', questionType: 'fill_blank', correctAnswer: '5a/2' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — First Term Review',
    description: 'Review problems from First Term.',
    dueDate: '2026-01-18T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Find HCF of 28 and 42, LCM of 10 and 15.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Express 30000 and 0.0065 in standard form.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Simplify (-6)x(-5)/(-10) and factorize 2y+6.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Find mean of 4,6,8,10 and convert 3/8 to decimal.', marks: 5 },
    ],
  },
})
export const prerequisiteModule: Jss2ModuleData = { title: 'Pre-requisite — First Term Review', lessons }
