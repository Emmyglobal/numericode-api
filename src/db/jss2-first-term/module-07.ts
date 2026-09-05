import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 7 — Review of First Half-Term',
  duration: 45,
  content: `# Week 7 — Review of First Half-Term's Work

## Learning Objectives
- Consolidate Weeks 1-6 topics.
- Identify and correct common mistakes.
- Apply multiple concepts to mixed problems.

## Topics Covered
Statistics, angles, pie charts, indices, standard form, prime factors, HCF/LCM, fractions, decimals, proportion, directed numbers.

## Mixed Practice
1. Find mean of 4,6,8,10. Convert 0.0065 to standard form.
2. HCF of 28 and 42. Simplify (-6)x(-5)/(-10).
3. 3/8 as decimal. Simple interest on N25000 at 5% for 3 years.

## Key Takeaways
- Review regularly — don't wait until exams.
- Mixed problems test if you can choose the right method.`,
  quiz: {
    title: 'Quiz W7 — Half-Term Review',
    description: '8 mixed questions on Weeks 1-6.',
    timeLimit: 900, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Mean of 4,6,8,10:', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'q2', questionText: '0.0065 in standard form:', questionType: 'fill_blank', correctAnswer: '6.5 x 10^(-3)' },
      { id: 'q3', questionText: 'HCF of 28 and 42:', questionType: 'fill_blank', correctAnswer: '14' },
      { id: 'q4', questionText: '(-6)x(-5)/(-10):', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'q5', questionText: '3/8 as decimal:', questionType: 'fill_blank', correctAnswer: '0.375' },
      { id: 'q6', questionText: 'Simple interest on N25000 at 5% for 3 years:', questionType: 'fill_blank', correctAnswer: 'N3750' },
      { id: 'q7', questionText: 'True or false: (-3)x(-7) = -21.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q8', questionText: '2/5 as percentage:', questionType: 'fill_blank', correctAnswer: '40%' },
    ],
  },
  assignment: {
    title: 'Assignment W7 — Review',
    description: 'Mixed review questions.',
    dueDate: '2026-10-26T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Find mean, median, mode of 12,15,12,18,20,15,12.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Express 30000 and 0.0065 in standard form.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'HCF of 28 and 42, LCM of 10 and 15.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Simplify (-6)x(-5)/(-10) and (-2)x12/(-6).', marks: 5 },
    ],
  },
})
export const module07: Jss2ModuleData = { title: 'Module 7 — Week 7: Half-Term Review', lessons }
