import type { Ss1ModuleData, Ss1LessonData } from './types'

// ─── SS1 Mathematics — Third Term: compulsory pre-requisite quiz ──────────────
// Before starting Third Term, students must demonstrate they remember Second Term
// work: quadratic equations, sets, circles, trigonometry and logic.

const lessons: Ss1LessonData[] = []

lessons.push({
  title: 'Pre-requisite Quiz — Second Term Review',
  duration: 30,
  content: `# Pre-requisite Quiz — Second Term Review

Before starting Third Term, you must pass this compulsory quiz reviewing Second Term work.

## Topics Covered
- Quadratic equations (factorisation, formula, completing the square)
- Sets and set notation
- Circle theorems and trigonometry ratios
- Logic: propositions, truth tables, conditional statements

## Instructions
- Duration: 30 minutes, 12 questions. 3 attempts allowed.
- Pass mark: 70% (at least 9 out of 12 correct).
- Revise your Second Term notes before attempting.`,
  quiz: {
    title: 'Pre-requisite Quiz — Second Term Review',
    description: 'Compulsory Second Term review quiz. Score 70% to unlock the course.',
    timeLimit: 1800,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'Solve by factorization: x^2 - 5x + 6 = 0', questionType: 'fill_blank', correctAnswer: 'x = 2 or x = 3' },
      { id: 'pq2', questionText: 'Solve using the quadratic formula: 2x^2 - 9x + 4 = 0', questionType: 'fill_blank', correctAnswer: 'x = 1/2 or x = 4' },
      { id: 'pq3', questionText: 'True or false: The universal set contains all elements under discussion.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq4', questionText: 'If A = {1,2,3} and B = {2,3,4}, find A ∩ B.', questionType: 'fill_blank', correctAnswer: '{2, 3}' },
      { id: 'pq5', questionText: 'In a right-angled triangle, sin θ = opposite/hypotenuse. What is cos θ?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'opposite/hypotenuse', isCorrect: false }, { id: 'b', text: 'adjacent/hypotenuse', isCorrect: true }, { id: 'c', text: 'opposite/adjacent', isCorrect: false }, { id: 'd', text: 'adjacent/opposite', isCorrect: false }], correctAnswer: 'b' },
      { id: 'pq6', questionText: 'If sin 30° = 0.5, what is cos 60°?', questionType: 'fill_blank', correctAnswer: '0.5' },
      { id: 'pq7', questionText: 'True or false: The angle in a semicircle is a right angle.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq8', questionText: 'If P is true and Q is false, what is P ∧ Q (P and Q)?', questionType: 'fill_blank', correctAnswer: 'false' },
      { id: 'pq9', questionText: 'The nth term of an A.P. is given by T_n = a + (n-1)d. What does d represent?', questionType: 'fill_blank', correctAnswer: 'common difference' },
      { id: 'pq10', questionText: 'If -5 is a root of x^2 + px - 10 = 0, find p.', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'pq11', questionText: 'True or false: The negation of (P and Q) is (not P) or (not Q).', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq12', questionText: 'In a right-angled triangle with legs 3 cm and 4 cm, the hypotenuse is:', questionType: 'fill_blank', correctAnswer: '5 cm' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — Second Term Review',
    description: 'Review problems from Second Term. Show all working.',
    dueDate: '2026-10-15T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve: 3x^2 - 7x - 6 = 0 using the quadratic formula.', marks: 8 },
      { id: 'a2', type: 'subjective', title: 'If U = {1,2,3,4,5,6,7,8,9,10}, A = {2,4,6,8,10} and B = {1,3,5,7,9}, find (A ∪ B) and A ∩ B.', marks: 6 },
      { id: 'a3', type: 'subjective', title: 'In a right-angled triangle ABC with angle A = 90°, AB = 5 cm and BC = 13 cm. Find (i) AC, (ii) sin B, (iii) cos C.', marks: 6 },
    ],
  },
})

export const prerequisiteModule: Ss1ModuleData = { title: 'Pre-requisite — Second Term Review', lessons }