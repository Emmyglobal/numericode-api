import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 5 — Approximation',
  duration: 45,
  content: `# Week 5 — Approximation: Rounding, Significant Figures, Estimation

## Learning Objectives
- Round numbers to the nearest ten, hundred, thousand.
- Round to a given number of decimal places and significant figures.
- Estimate quantities by rounding.

## Rounding
18 624 to nearest ten = 18 620, hundred = 18 600, thousand = 19 000.
4.2675 to 1 d.p = 4.3, 2 d.p = 4.27, 3 d.p = 4.268.

## Significant Figures (s.f.)
1 s.f: 18 624 = 20 000, 24.675 = 20.
2 s.f: 18 624 = 19 000, 24.675 = 25.
3 s.f: 0.006542 = 0.00654.

## Estimation
A school has 25 classes of ~31 students each: estimate = 25 x 30 = 750 students.

## Class Activity
1. Approximate 13 453 to nearest hundred, thousand, ten thousand.
2. Round 34.6733 to 1 d.p, 2 d.p, thousandth.
3. Estimate: 47 words in 5 lines, book has 28 lines/page. Words per page?

## Assignment
1. Round 18 624 to 1/2/3 s.f and 84.2675 to 1/2/3 s.f.
2. Round 0.006542 to 1/2/3 s.f.
3. Estimate students in 25 classes of ~31 each.

## Key Takeaways
- Rounding: look at the next digit (5 or more rounds up).
- Significant figures count from the first non-zero digit.
- Estimation gives quick, reasonable answers.`,
  quiz: {
    title: 'Quiz W5 — Approximation',
    description: '5 questions on rounding and significant figures.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '18 624 to nearest thousand is:', questionType: 'fill_blank', correctAnswer: '19000' },
      { id: 'q2', questionText: '4.2675 to 2 d.p is:', questionType: 'fill_blank', correctAnswer: '4.27' },
      { id: 'q3', questionText: '24.675 to 2 s.f is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '24', isCorrect: false }, { id: 'b', text: '25', isCorrect: true }, { id: 'c', text: '24.7', isCorrect: false }, { id: 'd', text: '24.68', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q4', questionText: '0.006542 to 1 s.f is:', questionType: 'fill_blank', correctAnswer: '0.007' },
      { id: 'q5', questionText: 'True or false: Estimation always gives the exact answer.', questionType: 'true_false', correctAnswer: 'false' },
    ],
  },
  assignment: {
    title: 'Assignment W5',
    description: 'Complete all questions.',
    dueDate: '2026-10-12T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Round 18 624 to nearest ten, hundred, thousand.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Round 84.2675 to 1/2/3 d.p.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Round 18 624 and 0.006542 to 1/2/3 s.f.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Estimate: 47 words in 5 lines, 28 lines per page. Words per page?', marks: 5 },
    ],
  },
})
export const module05: Jss2ModuleData = { title: 'Module 5 — Week 5: Approximation', lessons }
