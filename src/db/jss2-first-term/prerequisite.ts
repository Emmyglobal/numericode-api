import type { Jss2ModuleData, Jss2LessonData } from './types'

const lessons: Jss2LessonData[] = []

lessons.push({
  title: 'Pre-requisite Quiz — SS1 Foundations',
  duration: 30,
  content: `# Pre-requisite Quiz — SS1 Foundations

Before starting JSS2 Mathematics, you need to show that you remember the key ideas from SS1. This quiz is **compulsory** — you must pass it (70% or higher) to unlock the rest of the course.

## What this quiz covers
- Basic arithmetic (fractions, decimals, percentages)
- Simple algebra (like terms, substitution)
- Geometry basics (angles, perimeter, area)
- Statistics (mean, median, mode)

## Instructions
- You have 30 minutes.
- 15 questions: multiple choice, true/false, and fill-in-the-blank.
- You need 70% (11 out of 15) to pass.
- If you don't pass, review your SS1 notes and try again.

## Key Takeaways
- This quiz makes sure you're ready for JSS2 work.
- Every topic here will be used again this year — master them now.
- Don't guess; if you're unsure, skip and come back.`,
  quiz: {
    title: 'Pre-requisite Quiz — SS1 Foundations',
    description: 'Compulsory SS1 foundation quiz. Score 70% to unlock the course.',
    timeLimit: 1800,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'What is 3/4 + 1/2?', questionType: 'fill_blank', correctAnswer: '5/4 or 1 1/4 or 1.25' },
      { id: 'pq2', questionText: 'Convert 0.75 to a percentage.', questionType: 'fill_blank', correctAnswer: '75%' },
      { id: 'pq3', questionText: 'Simplify: 3x + 2x', questionType: 'fill_blank', correctAnswer: '5x' },
      { id: 'pq4', questionText: 'If y = 2x + 3, find y when x = 4.', questionType: 'fill_blank', correctAnswer: '11' },
      { id: 'pq5', questionText: 'The sum of angles in a triangle is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '90 degrees', isCorrect: false }, { id: 'b', text: '180 degrees', isCorrect: true }, { id: 'c', text: '360 degrees', isCorrect: false }, { id: 'd', text: '270 degrees', isCorrect: false }], correctAnswer: 'b' },
      { id: 'pq6', questionText: 'Find the mean of 4, 6, 8, 10.', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'pq7', questionText: 'True or false: A rectangle has 4 lines of symmetry.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'pq8', questionText: 'What is the perimeter of a square with side 6 cm?', questionType: 'fill_blank', correctAnswer: '24 cm' },
      { id: 'pq9', questionText: 'Find the mode of: 3, 5, 5, 7, 5, 9', questionType: 'fill_blank', correctAnswer: '5' },
      { id: 'pq10', questionText: '10% of 250 is:', questionType: 'fill_blank', correctAnswer: '25' },
      { id: 'pq11', questionText: 'True or false: Vertically opposite angles are equal.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq12', questionText: 'The area of a triangle with base 10 cm and height 5 cm is:', questionType: 'fill_blank', correctAnswer: '25 cm2' },
      { id: 'pq13', questionText: 'Solve: 2x + 5 = 15', questionType: 'fill_blank', correctAnswer: '5' },
      { id: 'pq14', questionText: 'True or false: Pi is exactly equal to 22/7.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'pq15', questionText: 'What is the median of 2, 4, 6, 8, 10?', questionType: 'fill_blank', correctAnswer: '6' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — SS1 Review',
    description: 'Complete these SS1 review problems to prepare for JSS2. Show all working.',
    dueDate: '2026-09-14T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve: 3(x + 2) = 21. Show each step.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Find the mean, median, and mode of: 12, 15, 12, 18, 20, 15, 12.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'A rectangle is 8 cm long and 5 cm wide. Find its perimeter and area.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Convert 3/8 to a decimal and a percentage.', marks: 5 },
    ],
  },
})

export const prerequisiteModule: Jss2ModuleData = { title: 'Pre-requisite — SS1 Foundations', lessons }
