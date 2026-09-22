import type { Ss1ModuleData } from './types'

export const module01: Ss1ModuleData = {
  title: 'Module 1 — Week 1: Revision of Factorisation',
  lessons: [
    {
      title: 'Week 1 — Revision: Factorisation of Quadratic Expressions',
      duration: 45,
      content: `# Week 1 — Revision: Factorisation of Quadratic Expressions

## Learning Objectives
By the end of this lesson you should be able to:
- Factorise quadratic expressions of the form ax^2 + bx + c.
- Factorise the difference of two squares: a^2 - b^2.
- Identify and use perfect square factorisation patterns.
- Factorise by grouping where applicable.

## Introduction
Factorisation is the reverse of expanding brackets. This week we revise factorisation of quadratic expressions, which is essential for solving quadratic equations in Weeks 2–3.

## Factorising ax^2 + bx + c (where a = 1)
We look for two numbers that multiply to c and add to b.

### Worked Example 1
Factorise: (a) x^2 + 5x + 6    (b) x^2 - 7x + 12    (c) x^2 - 2x - 15

**Solution**
(a) Need two numbers that multiply to 6 and add to 5: 2 and 3.
    x^2 + 5x + 6 = **(x + 2)(x + 3)**

(b) Need two numbers that multiply to 12 and add to -7: -3 and -4.
    x^2 - 7x + 12 = **(x - 3)(x - 4)**

(c) Need two numbers that multiply to -15 and add to -2: 3 and -5.
    x^2 - 2x - 15 = **(x + 3)(x - 5)**

## Factorising ax^2 + bx + c (where a ≠ 1)
Use the **grouping method**: find two numbers that multiply to ac and add to b.

### Worked Example 2
Factorise: (a) 2x^2 + 7x + 3    (b) 6x^2 + x - 12

**Solution**
(a) ac = 2×3 = 6. Need two numbers that multiply to 6 and add to 7: 1 and 6.
    Split middle term: 2x^2 + x + 6x + 3
    Group: x(2x+1) + 3(2x+1) = **(2x+1)(x+3)**

(b) ac = 6×(-12) = -72. Need two numbers that multiply to -72 and add to 1: 9 and -8.
    6x^2 + 9x - 8x - 12
    Group: 3x(2x+3) - 4(2x+3) = **(2x+3)(3x-4)**

## Difference of Two Squares
a^2 - b^2 = (a - b)(a + b)

### Worked Example 3
Factorise: (a) x^2 - 9    (b) 4x^2 - 25y^2    (c) 9x^2 - 25

**Solution**
(a) x^2 - 9 = x^2 - 3^2 = **(x - 3)(x + 3)**
(b) 4x^2 - 25y^2 = (2x)^2 - (5y)^2 = **(2x - 5y)(2x + 5y)**
(c) 9x^2 - 25 = (3x)^2 - 5^2 = **(3x - 5)(3x + 5)**

## Perfect Squares
a^2 + 2ab + b^2 = (a + b)^2
a^2 - 2ab + b^2 = (a - b)^2

### Worked Example 4
Factorise: (a) x^2 + 6x + 9    (b) 4x^2 - 20x + 25

**Solution**
(a) x^2 + 6x + 9 = (x + 3)^2
(b) 4x^2 - 20x + 25 = (2x - 5)^2

## Common Factors
Always factor out the HCF first!

### Worked Example 5
Factorise: 6x^2 + 18x + 12

**Solution**
HCF = 6: 6(x^2 + 3x + 2) = 6(x + 1)(x + 2)

## Class Activity
Essential Mathematics SS1, Page 160, Ex 12.2, Nos 1 & 9; Page 162, Ex 12.3, Nos 7 & 13.

## Assignment
Essential Mathematics SS1, Page 160, Ex 12.2, Nos 30 & 55; Page 162, Ex 12.3, Nos 14 & 17.

## Summary — Key Points
- **ax^2 + bx + c (a=1):** find two numbers that multiply to c and add to b.
- **ax^2 + bx + c (a≠1):** find two numbers that multiply to ac and add to b, then group.
- **Difference of squares:** a^2 - b^2 = (a-b)(a+b).
- **Perfect square:** a^2 ± 2ab + b^2 = (a ± b)^2.
- Always factor out the HCF first!`,
      quiz: {
        title: 'Quiz W1 — Factorisation',
        description: '6 questions on factorisation of quadratic expressions.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'Factorise: x^2 + 7x + 12', questionType: 'fill_blank', correctAnswer: '(x+3)(x+4)' },
          { id: 'q2', questionText: 'Factorise: x^2 - 16', questionType: 'fill_blank', correctAnswer: '(x-4)(x+4)' },
          { id: 'q3', questionText: 'True or false: x^2 + 6x + 9 = (x+3)^2', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q4', questionText: 'Factorise: 2x^2 + 7x + 3', questionType: 'fill_blank', correctAnswer: '(2x+1)(x+3)' },
          { id: 'q5', questionText: 'Factorise: 4x^2 - 25', questionType: 'multiple_choice', options: [{ id: 'a', text: '(2x-5)(2x+5)', isCorrect: true }, { id: 'b', text: '(4x-5)(4x+5)', isCorrect: false }, { id: 'c', text: '(2x-5)^2', isCorrect: false }, { id: 'd', text: '(4x-25)', isCorrect: false }], correctAnswer: 'a' },
          { id: 'q6', questionText: 'Factorise fully: 6x^2 + 18x + 12', questionType: 'fill_blank', correctAnswer: '6(x+1)(x+2)' },
        ],
      },
      assignment: {
        title: 'Assignment W1 — Factorisation',
        description: 'Show all steps clearly.',
        dueDate: '2026-10-08T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Factorise: (a) x^2 + 9x + 20, (b) x^2 - 3x - 18, (c) 3x^2 + 10x + 8.', marks: 8 },
          { id: 'a2', type: 'subjective', title: 'Factorise: (a) 9x^2 - 16, (b) 25x^2 - 49y^2, (c) x^2 - 10x + 25.', marks: 6 },
          { id: 'a3', type: 'subjective', title: 'Factorise fully: 8x^3 - 2x^2 - 10x.', marks: 6 },
        ],
      },
    },
  ],
}
