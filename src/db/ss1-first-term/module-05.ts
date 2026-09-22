import type { Ss1ModuleData } from './types'

export const module05: Ss1ModuleData = {
  title: 'Module 5 — Week 6: Indices',
  lessons: [
    {
      title: 'Week 6 — Laws of Indices & Simple Exponential Equations',
      duration: 45,
      content: `# Week 6 — Laws of Indices & Simple Exponential Equations

## Learning Objectives
By the end of this lesson you should be able to:
- State and apply the seven laws of indices.
- Simplify expressions using the laws of indices.
- Solve simple exponential equations where the unknown is in the index.

## Introduction
Indices (or exponents) give a compact way to write repeated multiplication: x^n means x multiplied by itself n times. The **laws of indices** let us manipulate these expressions quickly.

## The Seven Laws of Indices

1. **Multiplication:** x^a x x^b = x^{a+b}
2. **Division:** x^a / x^b = x^{a-b}
3. **Power of a power:** (x^a)^b = x^{ab}
4. **Power of a product:** (xy)^a = x^a y^a
5. **Power of a quotient:** (x/y)^a = x^a / y^a
6. **Zero power:** x^0 = 1 (x ≠ 0)
7. **Negative power:** x^{-a} = 1/x^a
8. **Fractional power:** x^{1/n} = nth root of x

### Worked Example 1
Simplify:
(a) x^5 x x^3    (b) y^7 / y^3    (c) (x^2)^3    (d) 4x^3 x 2x^4

**Solution**
(a) x^5 x x^3 = x^{5+3} = **x^8**
(b) y^7 / y^3 = y^{7-3} = **y^4**
(c) (x^2)^3 = x^{2x3} = **x^6**
(d) 4x^3 x 2x^4 = (4x2) x x^{3+4} = **8x^7**

### Worked Example 2 — Negative and Zero Powers
Simplify:
(a) x^5 / x^5    (b) 3^{-2}    (c) (2^{-3})^2

**Solution**
(a) x^5 / x^5 = x^{5-5} = x^0 = **1**
(b) 3^{-2} = 1/3^2 = **1/9**
(c) (2^{-3})^2 = 2^{-6} = 1/2^6 = **1/64**

### Worked Example 3 — Fractional Powers
Simplify:
(a) 16^{1/2}    (b) 8^{2/3}    (c) 25^{-1/2}

**Solution**
(a) 16^{1/2} = sqrt(16) = **4**
(b) 8^{2/3} = (cbrt(8))^2 = 2^2 = **4**
(c) 25^{-1/2} = 1/sqrt(25) = 1/5 = **0.2**

## Simple Exponential Equations
An exponential equation has the unknown in the index. We solve by making the bases equal.

### Worked Example 4
Solve:
(a) 2^x = 32    (b) 3^{x+1} = 27    (c) 5^{2x-1} = 1/25

**Solution**
(a) 32 = 2^5, so 2^x = 2^5 → **x = 5**
(b) 27 = 3^3, so 3^{x+1} = 3^3 → x+1 = 3 → **x = 2**
(c) 1/25 = 5^{-2}, so 5^{2x-1} = 5^{-2} → 2x-1 = -2 → 2x = -1 → **x = -1/2**

### Worked Example 5 — Quadratic-type Exponential
Solve: 4^x - 10 x 2^x + 16 = 0 (note: 10 x 2^x means 10 times 2 to the power x — this should be 10·2^x)

**Solution**
Let y = 2^x. Then 4^x = (2^2)^x = (2^x)^2 = y^2.
The equation becomes: y^2 - 10y + 16 = 0
(y - 8)(y - 2) = 0 → y = 8 or y = 2
If y = 8: 2^x = 8 → 2^x = 2^3 → **x = 3**
If y = 2: 2^x = 2 → **x = 1**

## Class Activity
Essential Mathematics SS1, Page 51, Ex 4.2, Nos 1j, 2j; Page 54-55, Ex 4.4, Nos 21, 22, 23, 27.

## Assignment
Essential Mathematics SS1, Page 55, Ex 4.4, Nos 53, 58, 61 & 62; Page 56, Ex 4.5, Nos 1, 10, 19, 23.

## Summary — Key Points
- **x^a x x^b = x^{a+b}** and **x^a / x^b = x^{a-b}** — the two most-used laws.
- **x^0 = 1** (nifty for cancelling).
- **x^{-a} = 1/x^a** — negative index means reciprocal.
- To solve exponential equations, **make the bases equal** then equate the powers.
- For quadratic-type exponentials, use a substitution like y = 2^x.

## Class Activity
Essential Mathematics SS1, Page 51, Ex 4.2, Nos 1j, 2j; Page 54-55, Ex 4.4, Nos 21, 22, 23, 27.

## Assignment
Essential Mathematics SS1, Page 55, Ex 4.4, Nos 53, 58, 61 & 62; Page 56, Ex 4.5, Nos 1, 10, 19, 23.

## Summary — Key Points
- **x^a x x^b = x^{a+b}** and **x^a / x^b = x^{a-b}** — the two most-used laws.
- **x^0 = 1** (useful for cancelling).
- **x^{-a} = 1/x^a** — negative index means reciprocal.
- To solve exponential equations, **make the bases equal** then equate the powers.
- For quadratic-type exponentials, use a substitution like y = 2^x.`,
      quiz: {
        title: 'Quiz W6 — Indices',
        description: '8 questions on laws of indices and exponential equations.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'x^5 x x^3 =', questionType: 'fill_blank', correctAnswer: 'x^8' },
          { id: 'q2', questionText: 'y^7 / y^3 =', questionType: 'fill_blank', correctAnswer: 'y^4' },
          { id: 'q3', questionText: 'True or false: (x^2)^3 = x^5.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q4', questionText: 'If 2^x = 32, find x.', questionType: 'fill_blank', correctAnswer: '5' },
          { id: 'q5', questionText: '3^{-2} =', questionType: 'fill_blank', correctAnswer: '1/9' },
          { id: 'q6', questionText: '16^(1/2) =', questionType: 'multiple_choice', options: [{ id: 'a', text: '4', isCorrect: true }, { id: 'b', text: '8', isCorrect: false }, { id: 'c', text: '2', isCorrect: false }, { id: 'd', text: '16', isCorrect: false }], correctAnswer: 'a' },
          { id: 'q7', questionText: 'Solve: 2x^2 - 9x + 4 = 0.', questionType: 'fill_blank', correctAnswer: 'x = 1/2 or x = 4' },
          { id: 'q8', questionText: 'True or false: x^{-a} = 1/x^a.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
      assignment: {
        title: 'Assignment W6 — Indices',
        description: 'Show all working. Give exact answers where possible.',
        dueDate: '2026-09-28T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Simplify: (a) x^3 * x^5, (b) (y^4)^2 / y^3, (c) 4x^2 * 3x^5, (d) (2a^3b^2)^4.', marks: 8 },
          { id: 'a2', type: 'subjective', title: 'Solve: (a) 5^{x+1} = 125, (b) 4^{2x-1} = 1/32, (c) 3^{2x} - 10*3^x + 9 = 0.', marks: 12 },
        ],
      },
    },
  ],
}