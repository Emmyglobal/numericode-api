import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 3 — Algebraic Expressions II. Verified: (2x + 6)/(4) = (x+3)/2
// after cancelling 2; (x^2 + 5x)/(x) = x + 5 for x not 0; the area of a
// trapezium A = 1/2(a+b)h rearranged for h gives h = 2A/(a+b).
export const module03: Jss1ModuleData = {
  title: 'Module 3 — Week 3: Algebraic Expressions II',
  lessons: [
    {
      title: 'Week 3 — Algebraic Expressions II',
      duration: 45,
      content: `## Learning Objectives
- Simplify algebraic fractions by cancelling common factors.
- Derive a formula from a given one.
- Use a formula and change its subject.

## Simplifying Algebraic Fractions
An **algebraic fraction** is a fraction that contains unknown variables. You
simplify it in the same way as a numerical fraction: cancel any **common factor**
on the top and bottom lines.

### Worked Example 1
Simplify (2x + 6) / 4

Factor the top: 2(x + 3) / 4. Cancel the factor 2:

**(x + 3) / 2**

### Worked Example 2
Simplify (x^2 + 5x) / x

Factor the top: x(x + 5) / x. Cancel x:

**x + 5**

**Important:** you may only cancel a factor that is never zero. Cancelling x here
is only valid for x not 0, which is normally taken as given.

You cannot cancel **terms that are added** — only factors that are **multiplied**.
So (x + 1)/(x + 2) cannot be cancelled, because the top and bottom are sums.

## Deriving and Using Formulae
A **formula** shows the relationship between two or more variables. The subject
is the variable written on its own, on one side.

### Worked Example 3
Given A = pi r^2, and you want r, rearrange it. This is called **change of
subject**.

Start with A = pi r^2.
Divide both sides by pi: A/pi = r^2
Take the square root of both sides: r = sqrt(A/pi)

### Worked Example 4
The trapezium formula is A = 1/2 (a + b) h. Make h the subject.

Multiply both sides by 2: 2A = (a + b) h
Divide both sides by (a + b): **h = 2A / (a + b)**

## Common Mistakes
- Cancelling added terms instead of common factors.
- Forgetting to divide by the coefficient when changing the subject.
- Forgetting the square root step when the power is 2.

## Practice
1. Simplify (2x + 8) / 4.
2. Simplify (x^2 + 7x) / x.
3. Make r the subject of A = pi r^2.
4. Make h the subject of A = 1/2 (a + b) h.`,
      quiz: quiz(
        'Week 3 Quiz — Algebraic Expressions II',
        'Five questions on algebraic fractions and changing the subject of a formula.',
        [
          mc(
            'Simplify (2x + 8) / 4.',
            ['(x + 4) / 2', 'x + 4', '(x + 8) / 2', '2x + 4'],
            'Factor the top as 2(x + 4), then cancel the 2 against the 4, giving (x + 4) / 2.',
          ),
          mc(
            'Simplify (x^2 + 7x) / x.',
            ['x + 7', 'x(x + 7)', '(x + 7) / x', '1 + 7x'],
            'Factor the top as x(x + 7), then cancel x, giving x + 7 (for x not 0).',
          ),
          mc(
            'Which expression cannot be cancelled?',
            ['(x + 1) / (x + 2)', '(2x) / (2y)', '(x^2) / x', '(3p) / p'],
            'You can only cancel common factors that are multiplied. The top and bottom of (x + 1) / (x + 2) are sums, not factors.',
          ),
          fb(
            'Make h the subject of A = 1/2 x (a + b) x h. Give your answer in terms of A, a and b, for example: 2A/(a+b)',
            '2A/(a+b)',
            'Multiply both sides by 2 to get 2A = (a + b)h, then divide by (a + b) to give h = 2A / (a + b).',
          ),
          mc(
            'In the formula A = pi r^2, what happens when you make r the subject?',
            [
              'You divide by pi and take a square root',
              'You multiply by pi and square the result',
              'You divide by r^2 only',
              'Nothing changes',
            ],
            'A = pi r^2 gives r^2 = A/pi, and then r = sqrt(A/pi), so both a division and a square root are needed.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 3.1 — Algebraic Expressions II',
        'State which factor you cancelled, and state any condition on the variable.',
        [
          { id: 'a1', type: 'theory', title: 'Simplify each fraction by cancelling: (i) (2x + 8) / 4, (ii) (x^2 + 7x) / x, (iii) (3y + 9) / 3, (iv) (a^2 + 2a) / a.', marks: 8 },
          { id: 'a2', type: 'subjective', title: 'Explain why (x + 1) / (x + 2) cannot be cancelled, and what would have to be true for it to be cancelled.', marks: 4 },
          { id: 'a3', type: 'theory', title: 'Make the stated letter the subject of each formula: (i) A = pi r^2, make r the subject, (ii) A = 1/2 (a + b) h, make h the subject, (iii) V = l w h, make w the subject.', marks: 8 },
        ],
      ),
    },
  ],
}