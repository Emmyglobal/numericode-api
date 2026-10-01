import { JSS1_DUE_DATE } from './types'
import type { Jss1ModuleData } from './types'

// Week 1 — Decimal Operations. Answers verified: 0.4 x 0.3 = 0.12;
// 5.96 x 0.35 = 2.086; 0.6/0.2 = 3; 3.468/0.8 = 4.335; 2 pencils for $1 ->
// 4 pencils for $2.
export const module01: Jss1ModuleData = {
  title: 'Module 1 — Week 1: Decimal Operations',
  lessons: [
    {
      title: 'Week 1 — Decimal Operations',
      duration: 45,
      content: `## Learning Objectives
By the end of this week you should be able to:
- Multiply decimals by decimals.
- Divide decimals by decimals.
- Compare quantities using ratios and direct proportion.

## Multiplying Decimals by Decimals
**Concept:** multiply as if the numbers were whole numbers, then count the total number of decimal places in the two original numbers and place the decimal point in the product accordingly.

### Worked Example 1
0.4 x 0.3

Multiply as whole numbers: 4 x 3 = 12. The first number has 1 decimal place and the second has 1, so there are 2 decimal places in total.

0.4 x 0.3 = **0.12**

### Worked Example 2
5.96 x 0.35

Multiply as whole numbers: 596 x 35 = 20860.
5.96 has 2 decimal places and 0.35 has 2, so 4 in total.

20860 with 4 decimal places = **2.0860**, and trailing zeros do not change the value, so the answer is **2.086**

## Dividing Decimals by Decimals
**Concept:** multiply both the dividend and the divisor by the same power of 10 to make the divisor a whole number. Then divide as usual.

### Worked Example 3
0.6 / 0.2

Multiply both by 10: 6 / 2 = **3**

### Worked Example 4
3.468 / 0.8

Multiply both by 10: 34.68 / 8 = **4.335**

A useful habit: if your answer is much bigger than the divisor, check that you moved the decimal point the right way.

## Ratio and Direct Proportion
A **ratio** compares two quantities. **Direct proportion** means that as one quantity increases, the other increases at the same rate.

### Worked Example 5
If 2 pencils cost $1, then 4 pencils cost $2.

The number of pencils doubled, so the cost doubled. That is direct proportion.

## Common Mistakes
- Forgetting to count decimal places when multiplying.
- Dividing without turning the divisor into a whole number.
- Confusing direct proportion with inverse proportion, where one goes up while the other goes down.

## Practice
1. Evaluate 0.2 x 0.5.
2. Evaluate 5.96 x 0.35.
3. Evaluate 0.6 / 0.2.
4. Evaluate 3.468 / 0.8.
5. If 5 pens cost $2, how much do 15 pens cost?`,
      quiz: {
        title: 'Week 1 Quiz — Decimal Operations',
        description: 'Five questions on multiplying and dividing decimals, and direct proportion.',
        timeLimit: 12,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Evaluate 0.4 x 0.3.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '0.12', isCorrect: true },
              { id: 'b', text: '1.2', isCorrect: false },
              { id: 'c', text: '0.07', isCorrect: false },
              { id: 'd', text: '0.012', isCorrect: false },
            ],
            correctAnswer: 'a',
            explanation: 'Multiply as whole numbers: 4 x 3 = 12. One decimal place in each number gives 2 in total, so 0.12.',
          },
          {
            questionText: 'Evaluate 5.96 x 0.35. Give your answer to three decimal places.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2.086', isCorrect: true },
              { id: 'b', text: '20.86', isCorrect: false },
              { id: 'c', text: '2.86', isCorrect: false },
              { id: 'd', text: '0.2086', isCorrect: false },
            ],
            correctAnswer: 'a',
            explanation: '596 x 35 = 20860. There are 2 decimal places in each number, so 4 in total: 2.0860 = 2.086.',
          },
          {
            questionText: 'Evaluate 0.6 / 0.2.',
            questionType: 'fill_blank',
            correctAnswer: '3',
            explanation: 'Multiply both the dividend and the divisor by 10 to get 6 / 2 = 3.',
          },
          {
            questionText: 'Evaluate 3.468 / 0.8. Give your answer to three decimal places.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '4.335', isCorrect: true },
              { id: 'b', text: '2.774', isCorrect: false },
              { id: 'c', text: '43.35', isCorrect: false },
              { id: 'd', text: '0.4335', isCorrect: false },
            ],
            correctAnswer: 'a',
            explanation: 'Multiply both by 10 to get 34.68 / 8, which is 4.335.',
          },
          {
            questionText: 'If 2 pencils cost $1, how much do 4 pencils cost? (Enter a number only, without the $ sign)',
            questionType: 'fill_blank',
            correctAnswer: '2',
            explanation: 'This is direct proportion: doubling the number of pencils doubles the cost, so 4 pencils cost $2.',
          },
        ],
      },
      assignment: {
        title: 'Assignment 1.1 — Decimal Operations',
        description: 'Show every step. State how many decimal places you used in each multiplication.',
        dueDate: JSS1_DUE_DATE,
        totalMarks: 15,
        passingScore: 7,
        assignmentType: 'theory',
        questions: [
          { id: 'a1', type: 'theory', title: 'Evaluate: 0.2 x 0.5, 0.3 x 0.4 and 1.5 x 0.02.', marks: 5 },
          { id: 'a2', type: 'theory', title: 'Evaluate 5.96 x 0.35 and 0.75 x 2.4.', marks: 5 },
          { id: 'a3', type: 'theory', title: 'Evaluate: 0.6 / 0.2, 3.468 / 0.8 and 7.2 / 0.06.', marks: 5 },
        ],
      },
    },
  ],
}