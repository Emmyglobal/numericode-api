import type { Ss1ModuleData } from './types'

export const module03: Ss1ModuleData = {
  title: 'Module 3 — Week 4: Modular Arithmetic',
  lessons: [
    {
      title: 'Week 4 — Modular Arithmetic',
      duration: 45,
      content: `# Week 4 — Modular Arithmetic

## Learning Objectives
By the end of this lesson you should be able to:
- Define modular arithmetic and identify residues for a given modulus.
- Add and subtract numbers in modular arithmetic using cyclic addition/subtraction tables.
- Multiply and divide numbers in modular arithmetic.
- Find the multiplicative inverse and additive inverse in a given modulus.
- Solve simple linear equations in modular arithmetic.

## Introduction
Modular arithmetic (sometimes called **clock arithmetic**) is a system in which numbers "wrap around" after reaching a certain value — the **modulus**. It is used in computer science, cryptography, and many real-life cyclic situations (clocks, calendars, etc.).

## Definition and Residues
When an integer is divided by n (the modulus), the possible remainders are 0, 1, 2, ..., n-1. These are called the **residues of modulo n**.

For example, modulo 5 gives residues {0, 1, 2, 3, 4}.
Modulo 7 gives residues {0, 1, 2, 3, 4, 5, 6}.

We write: a ≡ b (mod n)  meaning "a is congruent to b modulo n".

### Worked Example 1
Simplify: (a) 17 (mod 5)  (b) 23 (mod 7)  (c) 40 (mod 6)

**Solution**
(a) 17 ÷ 5 = 3 r 2 → **17 ≡ 2 (mod 5)**
(b) 23 ÷ 7 = 3 r 2 → **23 ≡ 2 (mod 7)**
(c) 40 ÷ 6 = 6 r 4 → **40 ≡ 4 (mod 6)**

## Addition and Subtraction in Modular Arithmetic
The table for addition in modulo 3:

| + | 0 | 1 | 2 |
|---|---|---|---|
| 0 | 0 | 1 | 2 |
| 1 | 1 | 2 | 0 |
| 2 | 2 | 0 | 1 |

### Worked Example 2
Evaluate in the given moduli:
(a) 13 + 28 (mod 5)  (b) 3 - 12 (mod 5)  (c) 8 - 25 (mod 7)

**Solution**
(a) 13 ≡ 3, 28 ≡ 3 (mod 5). 3 + 3 = 6 ≡ **1 (mod 5)**
(b) 3 - 12 ≡ 3 - 2 = 1 (mod 5). 1 ≡ **1 (mod 5)**
(c) 8 ≡ 1, 25 ≡ 4 (mod 7). 1 - 4 = -3 ≡ **4 (mod 7)**

### Worked Example 3 — Simplifying
Find the simplest form of: (i) -45 (mod 7)

**Solution**
-45 ÷ 7 = -7 r 2 (or -45 + 7×7 = -45 + 49 = 4). 
-45 ≡ **-45 + 49 = 4 (mod 7)**, so **-45 ≡ 4 (mod 7)**

## Multiplication in Modular Arithmetic
### Worked Example 4
Calculate: (a) 11 × 13 (mod 7)  (b) 5 × 4 (mod 6)

**Solution**
(a) 11 ≡ 4, 13 ≡ 6 (mod 7). 4 × 6 = 24 ≡ 24 - 21 = **3 (mod 7)**
(b) 5 × 4 = 20 ≡ 20 - 18 = **2 (mod 6)**

## Division in Modular Arithmetic
Division in modular arithmetic is done via the **multiplicative inverse**.

### Multiplicative Inverse
The multiplicative inverse of a (mod n) is a number b such that a × b ≡ 1 (mod n).

### Worked Example 5
Find the multiplicative inverse of:
(a) 3 (mod 7)  (b) 2 (mod 5)  (c) 4 (mod 9)

**Solution**
(a) We need 3b ≡ 1 (mod 7). Try values: 3×5 = 15 ≡ 1 (mod 7). **Inverse = 5**
(b) We need 2b ≡ 1 (mod 5). 2×3 = 6 ≡ 1 (mod 5). **Inverse = 3**
(c) We need 4b ≡ 1 (mod 9). 4×7 = 28 ≡ 1 (mod 9). **Inverse = 7**

### Additive Inverse
The additive inverse of a (mod n) is the number b such that a + b ≡ 0 (mod n).
The additive inverse of a is always (n - a) when a ≠ 0.

### Worked Example 6
Find the additive inverse of:
(a) 3 (mod 8)  (b) 5 (mod 2)

**Solution**
(a) 3 + 5 = 8 ≡ 0 (mod 8). **Additive inverse = 5**
(b) 5 ≡ 1 (mod 2). 1 + 1 = 2 ≡ 0 (mod 2). **Additive inverse = 1**

## Solving Equations in Modular Arithmetic
### Worked Example 7
Solve: (a) 3x ≡ 1 (mod 7)  (b) 5x ≡ 3 (mod 7)

**Solution**
(a) Multiply both sides by the inverse of 3 (mod 7), which is 5:
        x ≡ 5 × 1 = **5 (mod 7)**
(b) Multiply both sides by 3: x ≡ 3 × 3 = 9 ≡ **2 (mod 7)**

## Class Activity
Essential Mathematics SS1, Page 39, Ex 3.3, No 2d, 2f, 2g, 2h; Page 40, Ex 3.4, Nos. 3a, b, 6b & 6e; Page 43, Ex 3.5, No 2h & 2j; Page 43, Ex 3.5, No 4e & 6f.

## Assignment
Essential Mathematics SS1, Page 40, Ex 3.4, No 3f, g, 6g & 6d; Page 43, Ex 3.5, No 2f, g, 3b & 5a; Page 48, Assessment Test 3, Nos. 2, 3, 4 & Page 46, Ex 3.7, Nos. 9 & 10.

## Summary — Key Points
- **Residues:** for modulus n, the residues are 0, 1, 2, ..., n-1.
- **Multiplicative inverse** of a (mod n) = b such that a×b ≡ 1 (mod n).
- **Additive inverse** of a (mod n) = (n - a) mod n.
- **Solving equations:** multiply both sides by the inverse of the coefficient.
- Use modular arithmetic for cyclic problems (clocks, calendars, schedules).`,
      quiz: {
        title: 'Quiz W4 — Modular Arithmetic',
        description: '8 questions on residues, operations, inverses, and equations in modular arithmetic.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: '17 mod 5 =', questionType: 'fill_blank', correctAnswer: '2' },
          { id: 'q2', questionText: 'True or false: In mod 6, the residues are 0,1,2,3,4,5.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q3', questionText: '13 + 28 (mod 5) =', questionType: 'fill_blank', correctAnswer: '1' },
          { id: 'q4', questionText: 'The multiplicative inverse of 3 (mod 7) is:', questionType: 'fill_blank', correctAnswer: '5' },
          { id: 'q5', questionText: 'The additive inverse of 3 (mod 8) is:', questionType: 'fill_blank', correctAnswer: '5' },
          { id: 'q6', questionText: 'Solve: 3x ≡ 1 (mod 7)', questionType: 'fill_blank', correctAnswer: 'x = 5' },
          { id: 'q7', questionText: 'True or false: The multiplicative inverse of 2 (mod 6) exists.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q8', questionText: '5 x 4 (mod 6) =', questionType: 'multiple_choice', options: [{ id: 'a', text: '2', isCorrect: true }, { id: 'b', text: '20', isCorrect: false }, { id: 'c', text: '5', isCorrect: false }, { id: 'd', text: '4', isCorrect: false }], correctAnswer: 'a' },
        ],
      },
      assignment: {
        title: 'Assignment W4 — Modular Arithmetic',
        description: 'Show all working clearly.',
        dueDate: '2026-09-14T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Simplify: (a) -45 (mod 7), (b) 3 - 12 (mod 5), (c) 8 - 25 (mod 7).', marks: 5 },
          { id: 'a2', type: 'subjective', title: 'Find the multiplicative and additive inverse of: (a) 4 (mod 9), (b) 2 (mod 5), (c) 6 (mod 11).', marks: 7 },
          { id: 'a3', type: 'subjective', title: 'Solve: (a) 7x ≡ 2 (mod 9), (b) 2x ≡ 3 (mod 7).', marks: 8 },
        ],
      },
    },
  ],
}
