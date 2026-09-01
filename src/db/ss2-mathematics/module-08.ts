import type { Ss2ModuleData } from './types'

export const module08: Ss2ModuleData = {
  title: 'Module 8 — Week 8: Quadratic Equations',
  lessons: [
    {
      title: 'Lesson 8.1 — Advanced Quadratic Equations',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Solve quadratics that must first be rearranged, including equations with brackets and fractions.
- Choose the most efficient method (factorization, completing the square, formula).

## Introduction
Week 6 revised the basics. This week we go further: quadratics that do not look quadratic at first sight. The secret is always the same — rearrange carefully into ax² + bx + c = 0 before solving.

## Worked Examples
**Example 1: Solve (x − 2)(x + 5) = 10**

Expand: x² + 3x − 10 = 10 → x² + 3x − 20 = 0

(x + 20 is not a nice factor pair, so use the formula.)

a = 1, b = 3, c = −20; b² − 4ac = 9 + 80 = 89

x = (−3 ± √89) ÷ 2 = (−3 ± 9.434) ÷ 2

**x ≈ 3.22 or x ≈ −6.22**

**Example 2: Solve (2x + 1)/3 + 3/(x − 1) = 2**

Multiply every term by 3(x − 1):

(2x + 1)(x − 1) + 9 = 6(x − 1)

2x² − x − 1 + 9 = 6x − 6

2x² − 7x + 14 = 0

Discriminant: b² − 4ac = 49 − 112 = −63 < 0 → **no real roots**.

This is a legitimate answer! Not every equation has a real solution.

**Example 3: Solve x⁴ − 13x² + 36 = 0**

This is quadratic **in x²**. Let y = x²:

y² − 13y + 36 = 0 → (y − 4)(y − 9) = 0 → y = 4 or y = 9

x² = 4 → x = ±2; x² = 9 → x = ±3

**x = 2, −2, 3 or −3**

## Choosing a Method
1. Factorizes nicely? → factorize (fastest).
2. a = 1 and small numbers? → completing the square is quick and exact.
3. Anything else, or decimals required? → quadratic formula.

## Class Activity
1. Solve (x + 3)(x − 4) = 8.
2. Solve 1/(x + 1) + 1/(x + 3) = 1/3.
3. Solve x⁴ − 5x² + 4 = 0.

## Assignment
1. Solve (2x − 1)(x + 2) = 4, correct to 2 d.p.
2. Solve 3/(x − 2) − 2/(x + 1) = 1.

## Summary — Key Points
- Expand brackets and clear fractions first; the equation must become ax² + bx + c = 0.
- A negative discriminant means "no real roots" — it is an acceptable conclusion.
- Equations in x² are solved by substituting y = x², then returning to x.`,
    },
    {
      title: 'Lesson 8.2 — Quadratic Word Problems',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Set up quadratic equations from age, number and area problems.
- Interpret both roots where both are meaningful.

## Introduction
Building on Lesson 6.6, we now tackle harder word problems — including ones where **both roots are valid answers**, and problems where extra conditions select the right root.

## Worked Examples
**Example 1: A father is 3 times as old as his son. In 12 years, the father will be twice as old as the son. Find their present ages.**

Let the son's age be x; the father's age is 3x.

In 12 years: 3x + 12 = 2(x + 12)

3x + 12 = 2x + 24 → x = 12

Son is **12**, father is **36**. (Check: in 12 years — 24 and 48. Correct.)

Note: this gave a linear equation — but suppose instead the father is "6 times as old": 6x + 12 = 2(x + 12) → 4x = 12 → x = 3, still linear. Word problems can also lead to quadratics, as the next example shows.

**Example 2: The sum of two numbers is 15 and their product is 56. Find the numbers.**

Let one number be x; the other is 15 − x.

x(15 − x) = 56 → 15x − x² = 56 → x² − 15x + 56 = 0

(x − 7)(x − 8) = 0 → x = 7 or x = 8

The numbers are **7 and 8** (both roots are valid and give the same pair).

**Example 3: A motorist travels 240 km. If she had travelled 20 km/h faster, the journey would have taken 1 hour less. Find her speed.**

Let the speed be x km/h. Time = distance/speed.

240/x − 240/(x + 20) = 1

Multiply by x(x + 20):

240(x + 20) − 240x = x(x + 20)

4 800 = x² + 20x → x² + 20x − 4 800 = 0

(x + 80)(x − 60) = 0 → x = −80 or x = 60

Speed must be positive: **60 km/h**.

## Class Activity
1. Two numbers differ by 4 and their product is 96. Form an equation and find the numbers.
2. A rectangle's length is twice its width. If its area is 162 cm², find its dimensions.
3. A trader buys some pens for ₦600. If each pen had cost ₦5 less, she would have bought 10 more pens. Form an equation and find the number of pens.

## Assignment
1. The product of a number and the number 6 more than it is 135. Find both possible numbers.
2. A car covers a distance of 360 km at an average speed x km/h. On the return journey it travels 10 km/h faster and takes 48 minutes less. Form an equation in x and solve it.

## Summary — Key Points
- Define the unknown, translate the condition, solve, interpret.
- When both roots are positive and sensible, both may answer the question.
- Speed–time problems use Time = Distance ÷ Speed and produce quadratics after clearing fractions.`,
    },
    {
      title: 'Lesson 8.3 — Mixed Quadratic Practice',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Select and apply the right quadratic technique for a mixed set of problems.
- Work to a required degree of accuracy.

## Introduction
Before Week 9 begins, consolidate everything about quadratics with this mixed exercise. Attempt the questions before looking at the hints.

## Practice Set
**Question 1: Solve x² − 8x + 12 = 0.**

Factorization: (x − 2)(x − 6) = 0 → x = 2 or 6.

**Question 2: Solve 3x² + 2x − 7 = 0, correct to 2 d.p.**

Formula: b² − 4ac = 4 + 84 = 88; √88 = 9.381.

x = (−2 ± 9.381) ÷ 6 → x ≈ 1.23 or x ≈ −1.90.

**Question 3: By completing the square, find the minimum value of y = 2x² − 12x + 23.**

Divide by 2: y = 2[(x − 3)² − 9] + 23 = 2(x − 3)² + 5.

Minimum value is **5**, when x = 3.

**Question 4: The roots of 5x² − kx + 45 = 0 are equal. Find k.**

Equal roots → b² − 4ac = 0 → k² − 900 = 0 → k = ±30.

**Question 5: Form a quadratic equation with roots 1/3 and −2.**

Sum = 1/3 − 2 = −5/3; product = −2/3.

x² + (5/3)x − 2/3 = 0 → multiply by 3: **3x² + 5x − 6 = 0**

**Question 6: Solve (x + 2)² = 3x + 10.**

x² + 4x + 4 = 3x + 10 → x² + x − 6 = 0 → (x + 3)(x − 2) = 0 → x = −3 or x = 2.

## Class Activity
1. Solve 4x² − 25 = 0 and x² + 3x − 28 = 0 without the formula.
2. Solve 2x² − x − 4 = 0, correct to 3 s.f.
3. Form the quadratic equation whose roots are the reciprocals of the roots of 2x² − 7x + 3 = 0. (Hint: use α + β and αβ; the new product is (αβ)⁻¹.)

## Assignment
1. Solve 5x² − 2x − 1 = 0 by completing the square, giving surd answers as well as decimals.
2. The length of a swimming pool is 5 m more than its width, and its area is 84 m². Form and solve a quadratic equation for the width.

## Summary — Key Points
- Survey the equation first: factorable, needs the formula, needs completing the square, or quadratic in disguise?
- Discriminant conditions (b² − 4ac = 0, < 0) are quick examination marks.
- Always present answers in the requested form (surd, d.p. or s.f.).`,
    },
  ],
}
// __END__
