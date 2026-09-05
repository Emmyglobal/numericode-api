import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 9 — Probability II / Simple Probability',
  duration: 45,
  content: `# Week 9 — Probability II

## Learning Objectives
- Compute probabilities in dice and letter problems.
- Use probability tables.

## Dice Probability
P(6) = 1/6. P(10) = 0 (not on die). P(not 6) = 5/6. P(even) = 3/6 = 1/2. P(less than 5) = 4/6 = 2/3.

## Letter Probability
Letter from alphabet: P(N) = 1/26. P(A or B) = 2/26 = 1/13. P(letter of RANDOM) = 6/26. P(letter of CHOICE) = 6/26.

## From Table
Group of boys, marks and frequency. Total boys = sum of frequencies.
P(7 marks) = 8/total. P(not 7) = 1 - (8/total). P(at least 8) = (7+6+5)/total. P(less than median).

## Class Activity
NGM Ex 21c Q2,3.

## Key Takeaways
- Count total outcomes carefully.
- Dice outcomes: 1-6.
- Alphabet: 26 letters.`,
  quiz: {
    title: 'Quiz W9 — Probability II',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'P(6) on a die:', questionType: 'fill_blank', correctAnswer: '1/6' },
      { id: 'q2', questionText: 'P(even number) on die:', questionType: 'fill_blank', correctAnswer: '1/2' },
      { id: 'q3', questionText: 'P(letter N from alphabet):', questionType: 'fill_blank', correctAnswer: '1/26' },
      { id: 'q4', questionText: 'True or false: P(10) on a die is 1/6.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q5', questionText: 'P(less than 5) on die:', questionType: 'fill_blank', correctAnswer: '2/3' },
    ],
  },
  assignment: {
    title: 'Assignment W9',
    description: 'Complete.',
    dueDate: '2026-06-28T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Die: find P(6), P(10), P(not 6), P(not 10).', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Die: find P(3), P(4), P(9), P(1 or 2), P(even), P(<5).', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Letter from alphabet: P(N), P(A or B), P(RANDOM), P(CHOICE).', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Boys marks table: P(7), P(not 7), P(at least 8), P(less than median).', marks: 5 },
    ],
  },
})
lessons.push({
  title: 'Week 10 — End of Term Review',
  duration: 45,
  content: `# Week 10 — End of Term Review

## Topics
All Third Term: angles, polygons, elevation/depression, bearing, statistics, probability.

## Practice
Mixed questions.`,
  quiz: {
    title: 'Quiz W10 — End of Term',
    description: '8 mixed questions.',
    timeLimit: 900, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Angles in a triangle sum to:', questionType: 'fill_blank', correctAnswer: '180' },
      { id: 'q2', questionText: 'Sum of interior angles of 13-sided polygon:', questionType: 'fill_blank', correctAnswer: '1980' },
      { id: 'q3', questionText: 'True or false: P(rain) + P(no rain) = 1.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'P(6) on a die:', questionType: 'fill_blank', correctAnswer: '1/6' },
      { id: 'q5', questionText: 'Bearing measured from:', questionType: 'fill_blank', correctAnswer: 'north' },
      { id: 'q6', questionText: 'tan =', questionType: 'fill_blank', correctAnswer: 'opp/adj' },
      { id: 'q7', questionText: 'Angle for frequency 10 of 50:', questionType: 'fill_blank', correctAnswer: '72' },
      { id: 'q8', questionText: 'True or false: Exterior angles of polygon sum to 360.', questionType: 'true_false', correctAnswer: 'true' },
    ],
  },
  assignment: {
    title: 'Assignment W10 — End of Term',
    description: 'Mixed review.',
    dueDate: '2026-07-05T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'a1', type: 'subjective', title: 'Sum of interior angles of 12-sided polygon.', marks: 5 }, { id: 'a2', type: 'subjective', title: 'Die: P(3), P(not 3), P(even).', marks: 5 }, { id: 'a3', type: 'subjective', title: 'Building height, angle 30, 80m away.', marks: 5 }, { id: 'a4', type: 'subjective', title: 'Pie chart angle for frequency 10 of 50.', marks: 5 }],
  },
})
export const module04: Jss2ModuleData = { title: 'Module 4 — Weeks 9-10: Probability II & Review', lessons }
