import { JSS1_DUE_DATE } from './types'
import type { Jss1ModuleData } from './types'

// Week 2 — Ratios & Proportions. Answers verified: 3 m : 200 cm = 3 : 2;
// 3:4:5 of 168 gives 42, 56, 70; A = bh -> h = A/b.
export const module02: Jss1ModuleData = {
  title: 'Module 2 — Week 2: Ratios & Proportions',
  lessons: [
    {
      title: 'Week 2 — Ratios & Proportions',
      duration: 45,
      content: `## Learning Objectives
By the end of this week you should be able to:
- Simplify a ratio when the quantities use different units.
- Share an amount in a given ratio of more than two parts.
- Rearrange a formula to change the subject.

## Simplifying Ratios in Different Units
**Concept:** convert all quantities to the same unit before simplifying the ratio.

### Worked Example 1
3 metres : 200 centimetres

Convert 3 metres to centimetres: 1 m = 100 cm, so 3 m = 300 cm.

The ratio becomes 300 : 200.

Simplify by dividing both parts by 100: **3 : 2**

Always check that both parts are in the same unit before you simplify.

## Sharing an Amount in a Ratio
**Concept:** add the parts of the ratio to find the total number of parts, then divide the total amount accordingly.

### Worked Example 2
Dave, Ella and Jia share a bill of $168 in the ratio 3 : 4 : 5. How much does each pay?

Total parts = 3 + 4 + 5 = **12**

One part = 168 / 12 = **14**

- Dave pays 3 parts = 3 x 14 = **$42**
- Ella pays 4 parts = 4 x 14 = **$56**
- Jia pays 5 parts = 5 x 14 = **$70**

**Check:** 42 + 56 + 70 = 168. Correct.

## Rearranging Formulae
**Concept:** change the subject of a formula by performing the inverse operation.

### Worked Example 3
Given A = bh, make h the subject.

Start with A = b x h. To make h alone, undo the multiplication by b, which means divide by b.

h = **A / b**

The rule is simple: whatever the subject is doing at the end, undo it.

## Common Mistakes
- Simplifying a ratio before converting the units.
- Forgetting that ratio parts have no units once they are found.
- Dividing by the coefficient instead of multiplying when making it the subject.

## Practice
1. Simplify 5 km : 2500 m.
2. Divide $96 in the ratio 2 : 3 : 5.
3. If P = 2 L, find P when L = 7.`,
      quiz: {
        title: 'Week 2 Quiz — Ratios & Proportions',
        description: 'Five questions on simplifying ratios, sharing amounts, and changing the subject of a formula.',
        timeLimit: 12,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Simplify the ratio 3 metres : 200 centimetres.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '3 : 2', isCorrect: true },
              { id: 'b', text: '15 : 100', isCorrect: false },
              { id: 'c', text: '3 : 200', isCorrect: false },
              { id: 'd', text: '12 : 8', isCorrect: false },
            ],
            correctAnswer: 'a',
            explanation: 'Convert to centimetres: 3 m = 300 cm, so the ratio is 300 : 200. Dividing both by 100 gives 3 : 2.',
          },
          {
            questionText: 'Three friends share $168 in the ratio 3 : 4 : 5. How much does the person with the 5 parts pay?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '$56', isCorrect: false },
              { id: 'b', text: '$70', isCorrect: true },
              { id: 'c', text: '$42', isCorrect: false },
              { id: 'd', text: '$168', isCorrect: false },
            ],
            correctAnswer: 'b',
            explanation: 'Total parts = 3 + 4 + 5 = 12, so one part = 168 / 12 = 14. Five parts = 5 x 14 = $70.',
          },
          {
            questionText: 'What is the total of the ratio parts 3 + 4 + 5? (Enter a number only)',
            questionType: 'fill_blank',
            correctAnswer: '12',
            explanation: 'Adding the parts gives 12, which is how many equal parts the total amount is split into.',
          },
          {
            questionText: 'Given A = bh, which expression gives h in terms of A and b?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'h = A / b', isCorrect: true },
              { id: 'b', text: 'h = A x b', isCorrect: false },
              { id: 'c', text: 'h = b / A', isCorrect: false },
              { id: 'd', text: 'h = A - b', isCorrect: false },
            ],
            correctAnswer: 'a',
            explanation: 'A = b x h, so to make h the subject you undo the multiplication by b and divide: h = A / b.',
          },
          {
            questionText: 'If $96 is shared in the ratio 2 : 3 : 5, how much is one part worth? (Enter a number only)',
            questionType: 'fill_blank',
            correctAnswer: '9.6',
            explanation: 'Total parts = 2 + 3 + 5 = 10, so one part = 96 / 10 = 9.6. The answer is not a whole number, which shows that $96 cannot be shared exactly in this ratio.',
          },
        ],
      },
      assignment: {
        title: 'Assignment 2.1 — Ratios & Proportions',
        description: 'Show the total number of parts and check that your answers add back to the original amount.',
        dueDate: JSS1_DUE_DATE,
        totalMarks: 15,
        passingScore: 7,
        assignmentType: 'theory',
        questions: [
          { id: 'a1', type: 'theory', title: 'Simplify each ratio, converting units first: (i) 3 m : 200 cm, (ii) 5 km : 2500 m, (iii) 45 minutes : 2 hours.', marks: 5 },
          { id: 'a2', type: 'subjective', title: 'Dave, Ella and Jia share an electricity bill of $168 in the ratio 3 : 4 : 5. Work out how much each of them pays.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Make the letter in bold the subject of each formula: (i) A = **b** x h, (ii) **V** = l x w x h, (iii) **y** = m x c.', marks: 4 },
        ],
      },
    },
  ],
}