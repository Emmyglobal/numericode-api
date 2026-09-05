import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 10 — End of Term Review',
  duration: 45,
  content: `# Week 10 — End of Term Review

## Learning Objectives
- Consolidate all First Term topics.
- Practice mixed problems under exam conditions.

## Topics
All Weeks 1-9: statistics, angles, pie charts, indices, standard form, fractions, proportion, directed numbers, algebra.

## Practice
1. Mean of 4,6,8,10. Standard form of 0.0065.
2. HCF of 28 and 42. Simplify (-6)x(-5)/(-10).
3. 3/8 as decimal. Factorize 2y+6.
4. Word problem: 5x + 3(x+1) = 59.

## Key Takeaways
- Review all worked examples from the term.
- Focus on topics you find hardest.`,
  quiz: {
    title: 'Quiz W10 — End of Term',
    description: '8 mixed questions.',
    timeLimit: 900, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Mean of 4,6,8,10:', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'q2', questionText: '0.0065 in standard form:', questionType: 'fill_blank', correctAnswer: '6.5 x 10^(-3)' },
      { id: 'q3', questionText: 'HCF of 28 and 42:', questionType: 'fill_blank', correctAnswer: '14' },
      { id: 'q4', questionText: '(-6)x(-5)/(-10):', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'q5', questionText: '3/8 as decimal:', questionType: 'fill_blank', correctAnswer: '0.375' },
      { id: 'q6', questionText: 'Factorize 2y+6:', questionType: 'fill_blank', correctAnswer: '2(y+3)' },
      { id: 'q7', questionText: 'If 5x+3(x+1)=59, x=', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'q8', questionText: 'True or false: (-3)x(-7) = -21.', questionType: 'true_false', correctAnswer: 'false' },
    ],
  },
  assignment: {
    title: 'Assignment W10 — End of Term',
    description: 'Mixed review.',
    dueDate: '2026-11-16T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Find mean of 12,15,12,18,20,15,12.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Express 30000 and 0.0065 in standard form.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'HCF of 28 and 42, simplify (-6)x(-5)/(-10).', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Factorize 2y+6 and 3y^2+12y.', marks: 5 },
    ],
  },
})
export const module10: Jss2ModuleData = { title: 'Module 10 — Week 10: End of Term Review', lessons }
