import type { Ss1ModuleData } from './types'

export const module06: Ss1ModuleData = {
  title: 'Module 6 — Week 8–9: Logarithms',
  lessons: [
    {
      title: 'Week 8-9 — Logarithms of Numbers',
      duration: 75,
      content: `# Week 8–9 — Logarithms of Numbers

## Learning Objectives
By the end of this lesson you should be able to:
- Define the logarithm of a number and identify its characteristic and mantissa.
- Use four-figure logarithm tables to find the logarithm of numbers greater than 1.
- Use antilogarithms to convert a logarithm back to the original number.
- Multiply and divide numbers using logarithms.
- Evaluate expressions involving powers and roots using logarithms.

## Introduction
The logarithm of a number N to a base b is the power to which b must be raised to get N. In everyday work we use base 10 (common logarithms, written log).

If log N = x, then 10^x = N.

## Parts of a Logarithm
A logarithm has two parts:
- **Characteristic** — the integer part (before the decimal point).
- **Mantissa** — the decimal fraction part (after the decimal point), always positive.

Example: log 567.8 = 2.7542
- Characteristic = 2
- Mantissa = 0.7542

### Worked Example 1
Use tables to find log 579.28

**Solution**
Characteristic: 579.28 has 3 digits before the decimal → characteristic = 3 - 1 = **2**
Mantissa: look up 5792 in the log table → 0.7628; then interpolate for the '8' → **0.7628**
log 579.28 ≈ **2.7628**

## Logarithm of Numbers Less Than 1
Numbers between 0 and 1 have negative characteristics, written with a bar: 0.00354 = 3.54 x 10^{-3}, so the characteristic is 3 (written as 3̄).

### Worked Example 2
Find log 0.00354

**Solution**
0.00354 = 3.54 x 10^{-3}
Characteristic = 3̄ (negative 3)
Mantissa (from tables) for 354 = 0.5490
log 0.00354 = **3̄.5490**

## Antilogarithm
Antilog is the reverse of log: given a logarithm, find the original number.

### Worked Example 3
Find the antilog of:
(a) 2.7380    (b) 0.6359

**Solution**
(a) Characteristic = 2 → number is between 100 and 999.
    Mantissa 0.7380 → look up in antilog table → 5470...
    Wait — characteristic 2 means the number is between 100 and 999.
    Actually, antilog of 0.7380 ≈ 5.47, and with characteristic 2: 5.47 x 10^2 = **547**

(b) Characteristic = 0 → number is between 1 and 9.
    Mantissa 0.6359 → antilog ≈ 4.325
    Answer: **4.325**

## Multiplication Using Logarithms
log(a x b) = log a + log b

### Worked Example 4
Use logarithms to evaluate: (54.7 x 66.5)^2 / 16.1

**Solution**
Let y = (54.7 x 66.5)^2 / 16.1
log y = 2(log 54.7 + log 66.5) - log 16.1
From tables: log 54.7 = 1.7380, log 66.5 = 1.8228, log 16.1 = 1.2068
log y = 2(1.7380 + 1.8228) - 1.2068 = 2(3.5608) - 1.2068 = 7.1216 - 1.2068 = 5.9148
Antilog of 0.9148 ≈ 8.218
y = 8.218 x 10^5 = **821800** (3 s.f.)

## Logarithm Involving Powers and Roots
log(a^n) = n log a. log(nth root of a) = (1/n) log a.

### Worked Example 5
Use logarithms to evaluate ³√(4.56 x 10^5)

**Solution**
Let y = (4.56 x 10^5)^{1/3}
log y = (1/3) log(4.56 x 10^5) = (1/3)(log 4.56 + 5) = (1/3)(0.6590 + 5) = (1/3)(5.6590) = 1.8863
Antilog of 0.8863 ≈ 7.676
y = 7.676 x 10^1 = **76.8** (3 s.f.)

## Class Activity
Essential Mathematics SS1, Page 58, Ex 5.1, Nos 3a & 3d; Page 60, Ex 5.2, Nos 6a & 6e; Page 61, Ex 5.3, Nos 2a & 2g; Page 65, Ex 5.6, Nos 1 & 5; Page 65, Ex 5.5 & 5.6, Nos 5, 9, 10, 19.

## Assignment
Essential Mathematics SS1, Page 58, Ex 5.1, Nos 3e & 4f; Page 60, Ex 5.2, Nos 6f & 6i; Page 65, Ex 5.6, Nos 2, 6, 15, 17, 20, 21, 23, 24, 25, 26.

## Summary — Key Points
- The **characteristic** tells you the size (power of 10); the **mantissa** tells you the significant digits.
- For numbers < 1, use bar notation for the characteristic.
- Multiplication → add logs; Division → subtract logs; Powers → multiply the log; Roots → divide the log.
- Always use the **antilog** table at the end to convert back to the original number.

## Class Activity
Essential Mathematics SS1, Page 58, Ex 5.1, Nos 3a & 3d; Page 60, Ex 5.2, Nos 6a & 6e; Page 61, Ex 5.3, Nos 2a & 2g; Page 65, Ex 5.6, Nos 1 & 5; Page 65, Ex 5.5 & 5.6, Nos 5, 9, 10, 19.

## Assignment
Essential Mathematics SS1, Page 58, Ex 5.1, Nos 3e & 4f; Page 60, Ex 5.2, Nos 6f & 6i; Page 65, Ex 5.6, Nos 2, 6, 15, 17, 20, 21, 23, 24, 25, 26.

## Summary — Key Points
- The **characteristic** tells you the size (power of 10); the **mantissa** tells you the significant digits.
- For numbers < 1, use bar notation for the characteristic.
- Multiplication → add logs; Division → subtract logs; Powers → multiply the log; Roots → divide the log.
- Always use the **antilog** table at the end to convert back to the original number.`,
      quiz: {
        title: 'Quiz W8-9 — Logarithms',
        description: '8 questions on logarithms, characteristics, antilogarithms, and calculations.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'log 1000 (base 10) =', questionType: 'fill_blank', correctAnswer: '3' },
          { id: 'q2', questionText: 'True or false: The mantissa of a logarithm is always positive.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q3', questionText: 'log 567.8 = 2.7542. The characteristic is:', questionType: 'fill_blank', correctAnswer: '2' },
          { id: 'q4', questionText: 'If log a = 2.3010 and log b = 1.4771, find log(ab).', questionType: 'fill_blank', correctAnswer: '3.7781' },
          { id: 'q5', questionText: 'log 100 + log 1000 =', questionType: 'fill_blank', correctAnswer: '5' },
          { id: 'q6', questionText: 'Simplify using logs: log 56 + log 25 =', questionType: 'multiple_choice', options: [{ id: 'a', text: 'log 81', isCorrect: false }, { id: 'b', text: 'log 1400', isCorrect: true }, { id: 'c', text: 'log 31104', isCorrect: false }, { id: 'd', text: 'log 2.24', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q7', questionText: 'True or false: log(a/b) = log a - log b.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q8', questionText: 'If log 2 = 0.3010, find log 200.', questionType: 'fill_blank', correctAnswer: '2.3010' },
        ],
      },
      assignment: {
        title: 'Assignment W8-9 — Logarithms',
        description: 'Use four-figure tables or calculator where instructed. Show all steps.',
        dueDate: '2026-10-05T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Use log tables to find: (a) log 4567, (b) log 0.0456, (c) antilog 1.9375.', marks: 6 },
          { id: 'a2', type: 'subjective', title: 'Use logarithms to evaluate: (24.5 x 0.0342) / (0.0147). Give your answer to 3 s.f.', marks: 8 },
          { id: 'a3', type: 'subjective', title: 'If log 3 = 0.4771 and log 7 = 0.8451, evaluate log(3^2 x 7^3) without using tables.', marks: 6 },
        ],
      },
    },
  ],
}