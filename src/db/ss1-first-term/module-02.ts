import type { Ss1ModuleData } from './types'

export const module02: Ss1ModuleData = {
  title: 'Module 2 — Week 2–3: Number Base System',
  lessons: [
    {
      title: 'Week 2-3 — Number Base System',
      duration: 75,
      content: `# Week 2–3 — Number Base System

## Learning Objectives
By the end of this lesson you should be able to:
- Convert numbers from any base to base 10 using expansion or repeated multiplication.
- Convert numbers from base 10 to any other base.
- Add, subtract, multiply and divide numbers in different bases.
- Solve simple equations in number bases.

## Introduction
We normally count in base 10 (denary or decimal). But computers use base 2 (binary), and mathematicians sometimes work in base 2, 5, 8, 12 or 16. In this lesson we learn to move between bases and do arithmetic in any base.

The digits used in base 10 are 0,1,2,…,9. The **greatest digit** in any base is always **one less than the base**:
- Base 2: digits 0,1
- Base 5: digits 0,1,2,3,4
- Base 8: digits 0,1,2,…,7
- Base 16: digits 0,1,…,9,A,B,C,D,E,F

## Converting Other Bases to Base 10
### Method atis — Power Expansion
Write the number with each digit multiplied by the base raised to the power of its position (from right, starting at 0).

### Worked Example 1
Convert 49 to base 10 (where is shorthand for the number in base 5).

**Solution**
49₅ = 4 × 5¹ + 9 × 5⁰
But wait — 9 is not a valid digit in base 5 (max digit is 4). Let me use valid examples.

(a) Convert 11011₂ to base 10.
11011₂ = 1×2⁴ + 1×2³ + 0×2² + 1×2¹ + 1×2⁰
     = 16 + 8 + 0 + 2 + 1 = **27**

(b) Convert 453₆ to base 10.
453₆ = 4×6² + 5×6¹ + 3×6⁰
     = 4×36 + 5×6 + 3×1 = 144 + 30 + 3 = **177**

### Worked Example 2 — Repeated Multiplication
Convert 3212₅ to base 10 by building up:
3 → 3×5 + 2 = 17 → 17×5 + 1 = 86 → 86×5 + 2 = **432**

## Converting Base 10 to Other Bases
Repeatedly divide by the new base and collect remainders (from bottom to top).

### Worked Example 3
(a) Express 68 in base 2.
68 ÷ 2 = 34 r 0
34 ÷ 2 = 17 r 0
17 ÷ 2 = 8 r 1
8 ÷ 2 = 4 r 0
4 ÷ 2 = 2 r 0
2 ÷ 2 = 1 r 0
1 ÷ 2 = 0 r 1
Reading remainders bottom to top: **1000100₂**

(b) Express 58 in base 3.
58 ÷ 3 = 19 r 1
19 ÷ 3 = 6 r 1
6 ÷ 3 = 2 r 0
2 ÷ 3 = 0 r 2
**2011₃**

## Addition and Subtraction in Other Bases
Works exactly like base 10, but carry over when you reach the base value.

### Worked Example 4
Add in base 4: 321₄ + 132₄

**Solution**
   321
 + 132
 -----
Start from right: 1+2=3, 2+3=5 → carry 1 (since 5 = 1×4+1, write 1 carry 1), 3+1+1=5 → carry 1 (5 = 1×4+1, write 1 carry 1), 0+0+1=1
Answer: **1113₄**

### Worked Example 5 — Subtraction
Subtract in base 5: 423₅ - 141₅

**Solution**
Borrowing works the same way. 3-1=2, 2-4 needs borrowing: 2+5=7, 7-4=3, then 3-1=2.
Answer: **232₅**

## Multiplication and Division in Other Bases
Same algorithm as base 10.

### Worked Example 6
Multiply in base 8: 25₈ × 3₈

**Solution**
5×3=15 → 15÷8=1 r 7, write 7 carry 1
2×3=6, +1=7
Answer: **77₈**

## Solving Equations in Bases
### Worked Example 7
If 14ₓ = 10₁₀, find x.

**Solution**
14ₓ = 1×x + 4 = x + 4
Given: x + 4 = 10 → x = **6**

## Class Activity
Essential Mathematics SS1, Page 26, Ex 2.1, No 1a, 1d, 1g; Page 27, Ex 2.2, No 1a and 3d; Page 27/28, Ex 2.3, No 1e, 1c, 7b.

## Assignment
Essential Mathematics SS1, Page 26, Ex 2.1, No 1f; Page 27, Ex 2.2, No 4d; Page 65, Ex 5.6, No 2 & 6.

## Summary — Key Points
- **Base 10 → other base:** divide repeatedly by the target base, collect remainders.
- **Other base → base 10:** expand in powers of the base.
- **Addition/subtraction:** carry/borrow at the base value, not 10.
- **Valid digits:** in base n, digits run from 0 to n-1.`,
      quiz: {
        title: 'Quiz W2-3 — Number Base System',
        description: '8 questions on base conversion and arithmetic.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'Convert 1011₂ to base 10.', questionType: 'fill_blank', correctAnswer: '11' },
          { id: 'q2', questionText: 'Convert 58 (base 10) to base 3.', questionType: 'fill_blank', correctAnswer: '2011' },
          { id: 'q3', questionText: 'True or false: In base 8, the valid digits are 0,1,2,3,4,5,6,7.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q4', questionText: 'Add in base 5: 32₅ + 41₅ =', questionType: 'fill_blank', correctAnswer: '123' },
          { id: 'q5', questionText: 'If 23ₓ = 11 (base 10), find x.', questionType: 'fill_blank', correctAnswer: '5' },
          { id: 'q6', questionText: 'Convert 0.625 to binary.', questionType: 'multiple_choice', options: [{ id: 'a', text: '0.101', isCorrect: true }, { id: 'b', text: '0.110', isCorrect: false }, { id: 'c', text: '0.111', isCorrect: false }, { id: 'd', text: '0.011', isCorrect: false }], correctAnswer: 'a' },
          { id: 'q7', questionText: 'Multiply in base 8: 12₈ × 5₈ =', questionType: 'fill_blank', correctAnswer: '54' },
          { id: 'q8', questionText: 'True or false: In base 2, the digit 3 is valid.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
      assignment: {
        title: 'Assignment W2-3 — Number Base System',
        description: 'Show all working. Convert answers between bases clearly.',
        dueDate: '2026-09-14T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Convert 110101₂ to base 10, then to base 8.', marks: 6 },
          { id: 'a2', type: 'subjective', title: 'Add in base 6: 453₆ + 345₆.', marks: 5 },
          { id: 'a3', type: 'subjective', title: 'If 123ₓ = 38 (base 10), find x.', marks: 5 },
          { id: 'a4', type: 'subjective', title: 'Subtract in base 7: 605₇ - 246₇.', marks: 4 },
        ],
      },
    },
  ],
}
