import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 1 — Ratio and Proportion. Verified: direct proportion
// x proportional to y means x = ky; inverse proportion means xy = k, so
// 6 x 4 = 10 x 2.4 gives 24 hours... using xy = k: k = 24, so 10 people take
// 24/10 = 2.4 hours = 2 hours 24 minutes. Powers: a^m x a^n = a^(m+n),
// a^m / a^n = a^(m-n), (a^m)^n = a^(mn), (ab)^n = a^n b^n, a^0 = 1, a^-n = 1/a^n.
export const module01: Jss1ModuleData = {
  title: 'Module 1 — Week 1: Ratio and Proportion',
  lessons: [
    {
      title: 'Week 1 — Ratio and Proportion',
      duration: 45,
      content: `## Learning Objectives
- Use direct and inverse proportion.
- Recognise equivalent ratios.
- Apply the laws of indices.

## Direct and Inverse Proportion
Two quantities are in **direct proportion** if as one increases, the other also
increases at the same rate. We write **x is proportional to y**, or x = k y,
where k is the constant of proportionality.

They are in **inverse proportion** if as one increases, the other decreases so
that their **product stays constant**. We write x is proportional to 1/y, which
means **x y = k**.

### Worked Example 1
It takes 6 people 4 hours to sort and pack a load of eggs. How long will 10
people take?

The work is the same, so time and people are **inversely proportional**, so
people x time is constant:

6 x 4 = 24

10 x t = 24, so t = 24/10 = 2.4

**2.4 hours = 2 hours 24 minutes**

## Ratio Equivalence
Two ratios are **equivalent** if they have the same value when simplified or
written as fractions. This matters whenever you scale a recipe or a map.

### Worked Example 2
2 : 3 is equivalent to 8 : 12, because multiplying both parts of 2 : 3 by 4
gives 8 : 12.

### Worked Example 3
To check, express both as a fraction. 2/3 and 8/12 both equal about 0.667, so the
ratios are equivalent.

## Arithmetic Laws (Integer Powers)
Integer powers involve multiplying a number by itself repeatedly. These laws let
you simplify expressions with powers:

| Law | Rule |
|---|---|
| Product | a^m x a^n = a^(m+n) |
| Quotient | a^m / a^n = a^(m-n), a is not 0 |
| Power of a power | (a^m)^n = a^(mn) |
| Power of a product | (ab)^n = a^n x b^n |
| Power of a quotient | (a/b)^n = a^n / b^n, b is not 0 |
| Zero index | a^0 = 1 |
| Negative index | a^-n = 1 / a^n, a is not 0 |

### Worked Example 4
2^3 x 2^4 = 2^(3+4) = **2^7**

### Worked Example 5
(3x)^2 = 3^2 x x^2 = **9x^2**

## Common Mistakes
- Multiplying when working out an inverse proportion (use xy = k).
- Writing a ratio like 2 : 3 x 4 as 2 : 12 instead of scaling both parts.
- Adding indices when you should be multiplying them.

## Practice
1. Five taps fill a tank in 8 hours. How long do 10 taps take?
2. Write 3 : 5 in an equivalent form using 15.
3. Simplify 4^2 x 4^3.
4. Simplify (2p)^3.`,
      quiz: quiz(
        'Week 1 Quiz — Ratio and Proportion',
        'Five questions on proportion, equivalent ratios and the laws of indices.',
        [
          mc(
            'It takes 6 people 4 hours to sort a load of eggs. How long do 10 people take, in hours?',
            ['2.4', '6.7', '40', '0.67'],
            'People and time are inversely proportional, so people x time is constant: 6 x 4 = 24. Then 10 x t = 24, giving t = 2.4 hours.',
          ),
          mc(
            'Which ratio is equivalent to 2 : 3?',
            ['8 : 12', '6 : 9', '2 : 5', '10 : 12'],
            'Multiplying both parts of 2 : 3 by 4 gives 8 : 12. (2/3 = 8/12, so both are equivalent.)',
          ),
          mc(
            'Simplify 4^2 x 4^3.',
            ['4^5', '4^6', '8^5', '4^1'],
            'Powers with the same base multiply by adding the indices: 2 + 3 = 5.',
          ),
          fb(
            'Simplify (2p)^3. Give your answer as two numbers and a letter separated by spaces, for example: 8 x^3',
            '8 x^3',
            'Use the power of a product rule: (2p)^3 = 2^3 x p^3 = 8p^3.',
          ),
          mc(
            'If x is inversely proportional to y, what must stay constant?',
            ['The product x y', 'The sum x + y', 'The difference x - y', 'The quotient x / y'],
            'Inverse proportion is written x proportional to 1/y, which means the product x y is constant.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 1.1 — Ratio and Proportion',
        'For each proportion, state whether it is direct or inverse and show the constant.',
        [
          { id: 'a1', type: 'theory', title: 'Solve each inverse proportion problem, showing the constant: (i) 6 people take 4 hours, how long do 10 take? (ii) 4 machines make 20 items in 5 hours, how long do 10 machines take?', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Write each ratio in an equivalent form: (i) 3 : 5 using 15, (ii) 2 : 7 using 21, (iii) 4 : 6 in its simplest form.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Simplify, stating the law used: (i) 5^2 x 5^3, (ii) 9^6 / 9^4, (iii) (2^3)^2, (iv) (5a)^2.', marks: 6 },
          { id: 'a4', type: 'theory', title: 'Evaluate 7^0 and 4^-2, explaining which law of indices you used in each case.', marks: 2 },
        ],
      ),
    },
  ],
}