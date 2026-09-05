import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 9 — Quantitative Aptitude on Plane Shapes & Scale',
  duration: 45,
  content: `# Week 9 — Quantitative Aptitude

## Learning Objectives
- Solve problems on plane shapes and scale drawing.
- Apply area and perimeter formulas.

## Problems
- 2% error in measuring side of square: area error %?
- Right-angled triangle inscribed in circle.

## Class Activity
1. Area of trapezium (parallel sides 30cm, 28cm, distance 15cm).
2. Area of square with diagonals product 200 cm^2.

## Key Takeaways
- Apply formulas carefully.
- Check units.`,
  quiz: {
    title: 'Quiz W9 — Quantitative Aptitude',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Area of trapezium (parallel sides a,b, height h):', questionType: 'fill_blank', correctAnswer: '1/2(a+b)h' },
      { id: 'q2', questionText: 'Area of square with diagonal d:', questionType: 'fill_blank', correctAnswer: 'd^2/2' },
      { id: 'q3', questionText: 'True or false: 2% error in side gives 4% error in area (approx).', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Area of right triangle with base 10, height 5:', questionType: 'fill_blank', correctAnswer: '25' },
      { id: 'q5', questionText: 'True or false: Scale drawing changes angles.', questionType: 'true_false', correctAnswer: 'false' },
    ],
  },
  assignment: {
    title: 'Assignment W9',
    description: 'Complete all questions.',
    dueDate: '2026-03-22T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Area of trapezium (30cm, 28cm, 15cm distance).', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Area of square with diagonals product 200 cm^2.', marks: 5 },
      { id: 'a3', type: 'subjective', title: '2% error in side of square. Find area error %.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Triangle sides 16m, 21m, 15m. Find area.', marks: 5 },
    ],
  },
})
export const module05: Jss2ModuleData = { title: 'Module 5 — Week 9: Quantitative Aptitude', lessons }
