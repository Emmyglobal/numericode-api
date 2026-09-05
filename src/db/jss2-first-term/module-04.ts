import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 4 — Fractions, Decimals, Percentages & Proportion',
  duration: 45,
  content: `# Week 4 — Fractions, Decimals, Percentages, Proportion, Ratio & Profit/Loss

## Learning Objectives
- Convert between fractions, decimals and percentages.
- Solve direct and inverse proportion problems.
- Work with ratios, simple interest, discount, commission, profit and loss.

## Conversions
Fraction to decimal: divide numerator by denominator. 3/8 = 0.375.
Decimal to percentage: multiply by 100. 0.232 = 23.2%.
Fraction to percentage: multiply by 100. 2/5 = 40%.
Mixed number: 3 1/2 = 7/2 = 3.5 = 350%.

## Proportion
**Direct:** as one increases, the other increases. 7 dozen eggs = N6720, so 1 dozen = N960.
**Inverse:** as one increases, the other decreases. 6 men plow in 2 days, so 3 men plow in 4 days.

## Ratio
Ratio compares quantities of the same unit. N60:N84 = 60/84 = 5/7. Share N150 in ratio 1:2 = N50 and N100.

## Simple Interest
I = (P x R x T) / 100. N25000 at 5% for 3 years = (25000 x 5 x 3)/100 = N3750.

## Profit and Loss
Profit = SP - CP. Loss = CP - SP. %Profit = (Profit/CP) x 100.
Buy for N40000, sell for N33000: loss = N7000, %loss = 17.5%.

## Class Activity
1. Convert 3/8, 1/3, 12/23 to decimals.
2. If 6 men plow in 2 days, how long for 3 men?
3. Simple interest on N25000 for 3 years at 5%.

## Assignment
1. Convert 2/5, 0.232, 3 1/2 to percentages.
2. Share N150 in ratio 1:2. Find simple interest on N86000 for 2.5 years at 8.5%.
3. A farmer buys for N40000, sells for N33000. Find percentage loss.

## Key Takeaways
- Master the fraction-decimal-percentage conversions.
- Direct proportion: multiply; inverse proportion: think "more means less".
- Profit/loss always uses cost price as the base for percentages.`,
  quiz: {
    title: 'Quiz W4 — Fractions, Proportion, Profit/Loss',
    description: '5 questions on fractions, proportion and commercial arithmetic.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '3/8 as a decimal is:', questionType: 'fill_blank', correctAnswer: '0.375' },
      { id: 'q2', questionText: '2/5 as a percentage is:', questionType: 'fill_blank', correctAnswer: '40%' },
      { id: 'q3', questionText: 'If 6 men plow in 2 days, 3 men plow in:', questionType: 'multiple_choice', options: [{ id: 'a', text: '1 day', isCorrect: false }, { id: 'b', text: '2 days', isCorrect: false }, { id: 'c', text: '4 days', isCorrect: true }, { id: 'd', text: '6 days', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q4', questionText: 'Simple interest on N25000 at 5% for 3 years is:', questionType: 'fill_blank', correctAnswer: 'N3750' },
      { id: 'q5', questionText: 'True or false: Profit percentage uses selling price as base.', questionType: 'true_false', correctAnswer: 'false' },
    ],
  },
  assignment: {
    title: 'Assignment W4',
    description: 'Complete all questions.',
    dueDate: '2026-10-05T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Convert 3/8, 1/3, 12/23 to decimals and 2/5, 0.232 to percentages.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'If 7 dozen eggs cost N6720, find cost of 2 dozen and 10 eggs.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Find simple interest on N25000 for 3 years at 5%.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'A trader buys for N40000 and sells for N33000. Find percentage loss.', marks: 5 },
    ],
  },
})
export const module04: Jss2ModuleData = { title: 'Module 4 — Week 4: Fractions, Decimals, Proportion', lessons }
