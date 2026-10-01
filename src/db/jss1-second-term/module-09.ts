import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 9 — Indices and Standard Form. Verified: 2^3 x 2^4 = 2^7;
// (2^3)^2 = 2^6; 3^5 / 3^2 = 3^3; a^-2 = 1/9; standard form for 4.7 x 10^3 is
// 4.7 x 10^3 (coefficient between 1 and 10).
export const module09: Jss1ModuleData = {
  title: 'Module 9 — Week 9: Indices and Standard Form',
  lessons: [
    {
      title: 'Week 9 — Indices and Standard Form',
      duration: 45,
      content: `## Learning Objectives
- Apply the laws of indices to simplify expressions.
- Write numbers in standard form.
- Convert between standard form and ordinary form.

## The Laws of Indices

| Law | Rule |
|---|---|
| Product | a^m x a^n = a^(m+n) |
| Quotient | a^m / a^n = a^(m-n), where a is not 0 |
| Power of a power | (a^m)^n = a^(mn) |
| Power of a product | (ab)^n = a^n x b^n |
| Zero index | a^0 = 1 |
| Negative index | a^-n = 1 / a^n, where a is not 0 |

### Worked Example 1 — Product
2^3 x 2^4 = 2^(3+4) = **2^7**

### Worked Example 2 — Power of a power
(2^3)^2 = 2^(3x2) = **2^6**

### Worked Example 3 — Quotient
3^5 / 3^2 = 3^(5-2) = **3^3**

### Worked Example 4 — Negative index
3^-2 = 1 / 3^2 = **1/9**

## Standard Form
A number is written in **standard form** as:

**a x 10^n**, where 1 is less than or equal to a, and a is less than 10.

The coefficient a must be **between 1 and 10**. That is the single most common
mistake.

### Worked Example 5
47 000 is written as **4.7 x 10^4**, because moving the decimal after 4.7 gives
10^4.

### Worked Example 6
0.0032 is written as **3.2 x 10^-3**. A number less than 1 has a **negative**
power.

### Worked Example 7
Check: 0.006897 written in standard form is **6.897 x 10^-3**.

## Converting Between Forms
### To standard form
1. Put the decimal point after the first non-zero digit.
2. Count how many places you moved.
3. That count is n. Moving left makes it negative.

### From standard form
Multiply the coefficient by 10^n. Moving the decimal point **right** makes the
number bigger, moving it **left** makes it smaller.

## Common Mistakes
- Writing 47 000 as 47 x 10^3 — the coefficient must be below 10.
- Forgetting the negative sign when the number is less than 1.
- Adding the indices when you should be multiplying them.

## Practice
1. Simplify 5^2 x 5^3.
2. Simplify (3^2)^4.
3. Simplify 7^6 / 7^4.
4. Write 32000 in standard form.
5. Write 0.00045 in standard form.`,
      quiz: quiz(
        'Week 9 Quiz — Indices and Standard Form',
        'Five questions on the laws of indices and standard form.',
        [
          mc(
            'Simplify 2^3 x 2^4.',
            ['2^7', '2^12', '4^7', '2^1'],
            'Powers with the same base multiply by adding the indices: 3 + 4 = 7.',
          ),
          mc(
            'Simplify (2^3)^2.',
            ['2^6', '2^5', '4^3', '2^9'],
            'A power raised to a power multiplies the indices: 3 x 2 = 6.',
          ),
          fb(
            'Write 32000 in standard form. Give your answer as two numbers separated by a comma, for example: 3.2, 4',
            '3.2, 4',
            'Move the decimal point after 3.2, which is four places to the left, so 32000 = 3.2 x 10^4.',
          ),
          mc(
            'Which of these is written in standard form?',
            ['4.7 x 10^3', '47 x 10^3', '0.47 x 10^3', '4.7 x 10^4'],
            'In standard form the coefficient must be at least 1 and less than 10. Only 4.7 x 10^3 satisfies that.',
          ),
          mc(
            'What is the value of 3^-2?',
            ['1/9', '-9', '9', '-1/9'],
            'A negative index means divide: 3^-2 = 1/3^2 = 1/9.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 9.1 — Indices and Standard Form',
        'Show which law of indices you used for every simplification.',
        [
          { id: 'a1', type: 'theory', title: 'Simplify, stating the law used: (i) 5^2 x 5^3, (ii) 3^4 / 3^2, (iii) (2^3)^4, (iv) (3x)^2.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Write each number in standard form: (i) 32000, (ii) 4500000, (iii) 0.006897, (iv) 0.00045.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Write each answer in ordinary form: (i) 6.897 x 10^-3, (ii) 2.5 x 10^5, (iii) 1.8 x 10^2.', marks: 5 },
          { id: 'a4', type: 'subjective', title: 'Evaluate 4^-2 and 8^0. Explain in each case which law of indices you used.', marks: 3 },
        ],
      ),
    },
  ],
}