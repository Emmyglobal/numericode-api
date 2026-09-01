import type { Ss2ModuleData } from './types'

export const module09: Ss2ModuleData = {
  title: 'Module 9 — Week 9: Simultaneous Equations',
  lessons: [
    {
      title: 'Lesson 9.1 — Revision of Linear Simultaneous Equations',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Solve linear simultaneous equations by substitution and by elimination.
- Check solutions in both original equations.

## Introduction
Two (or more) equations that must be true at the same time are **simultaneous equations**. Their solution is the pair (x, y) satisfying every equation. This lesson revises the two algebraic methods before we add quadratics next lesson.

## Method 1 — Elimination
Add or subtract the equations (after equalising coefficients) to remove one variable.

**Worked Example 1 (from the scheme): solve m − 7n = 17 and 4n − m = 16**

Write both in standard order:

m − 7n = 17 … (1)

−m + 4n = 16 … (2)

Add (1) and (2): −3n = 33 → n = −11

Substitute into (1): m − 7(−11) = 17 → m + 77 = 17 → m = −60

**m = −60, n = −11**

Check in (2): 4(−11) − (−60) = −44 + 60 = 16 ✓

## Method 2 — Substitution
Make one variable the subject of one equation and substitute into the other.

**Worked Example 2 (from the scheme): solve p + q = 1/4 and 5p + 2q = 2**

From the first equation: p = 1/4 − q.

Substitute: 5(1/4 − q) + 2q = 2

5/4 − 5q + 2q = 2 → −3q = 2 − 5/4 = 3/4 → q = −1/4

Then p = 1/4 − (−1/4) = 1/2

**p = 1/2, q = −1/4**

Check: 5(1/2) + 2(−1/4) = 5/2 − 1/2 = 2 ✓

## Which Method?
- Coefficients already matching (or easily matched)? → elimination.
- One equation already gives x = … or y = …? → substitution.
- The graphical method (Week 10) shows the solution as the point where the two lines cross.

## Class Activity
1. Solve by elimination: 2x + 3y = 13 and x − y = 1.
2. Solve by substitution: y = 3x − 1 and 2x + y = 9.
3. Solve: 3a + 2b = 5 and 2a − b = 8.

## Assignment
1. Solve: 5x − 4y = 17 and 3x + 2y = 3.
2. The sum of two numbers is 34 and their difference is 8. Form simultaneous equations and find the numbers.

## Summary — Key Points
- Align like terms before eliminating.
- Always check your pair in BOTH original equations.
- Fractions are handled exactly the same way — clear them early.`,
    },
    {
      title: 'Lesson 9.2 — One Linear and One Quadratic Equation',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Solve a pair consisting of one linear and one quadratic equation.
- Present both solution pairs (these systems usually have two answers).

## Introduction
When one equation is quadratic, substitution turns the pair into a single quadratic equation in one unknown — which you already know how to solve. Expect **up to two solution pairs**.

## The Strategy
1. Use the LINEAR equation to express one variable in terms of the other.
2. Substitute into the quadratic equation.
3. Solve the resulting quadratic.
4. Find the matching value of the other variable for each root.

## Worked Example 1 (from the scheme)
Solve xy − 4 = 0 and 2x − 5y − 3 = 0.

From the linear equation: 2x − 5y = 3 → x = (5y + 3)/2.

Substitute into xy = 4:

y(5y + 3)/2 = 4 → 5y² + 3y = 8 → 5y² + 3y − 8 = 0

(5y + 8)(y − 1) = 0 → y = 1 or y = −8/5

- If y = 1: x = (5 + 3)/2 = 4 → **(4, 1)**
- If y = −8/5: x = (−8 + 3)/2 = −5/2 → **(−5/2, −8/5)**

Check (4, 1): 4 × 1 = 4 ✓ and 2(4) − 5(1) = 3 ✓

## Worked Example 2 (from the scheme)
Solve 4x + 2y = 8 and 2x² − 3y² = 6.

From the linear equation: y = 4 − 2x.

Substitute: 2x² − 3(4 − 2x)² = 6

2x² − 3(16 − 16x + 4x²) = 6

2x² − 48 + 48x − 12x² = 6

−10x² + 48x − 54 = 0 → divide by −2: 5x² − 24x + 27 = 0

(5x − 9)(x − 3) = 0 → x = 9/5 or x = 3

- If x = 9/5: y = 4 − 18/5 = 2/5 → **(9/5, 2/5)**
- If x = 3: y = 4 − 6 = −2 → **(3, −2)**

Check (3, −2): 2(9) − 3(4) = 18 − 12 = 6 ✓

## Class Activity
1. Solve: y = x + 1 and x² + y² = 25.
2. Solve: xy = 6 and x + y = 5.
3. Solve: y = 2x − 3 and y² − x² = 3.

## Assignment
1. Solve: x + y = 7 and x² + y² = 29.
2. Solve: 3x − y = 2 and x² − xy + y² = 7.

## Summary — Key Points
- Always substitute from the LINEAR equation into the quadratic one.
- Bracket the whole substituted expression before squaring.
- Write every solution as a pair, and check each pair in both equations.`,
    },
    {
      title: 'Lesson 9.3 — Word Problems Leading to Simultaneous Equations',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Translate word problems into pairs of simultaneous equations.
- Solve and interpret the solution in the context of the problem.

## Introduction
Many examination word problems contain two unknowns and two conditions — exactly a pair of simultaneous equations. Define both unknowns clearly, then convert each sentence into an equation.

## The Strategy
1. Let x = … and y = … (name the two unknowns).
2. Turn each condition into an equation — you need two.
3. Solve by elimination or substitution.
4. Answer the question asked, with units.

## Worked Example 1 — The two-digit number problem
The sum of the digits of a two-digit number is 9. The number formed by reversing the digits is 27 less than the original number. Find the original number.

Let the tens digit be x and the units digit be y.

Condition 1: x + y = 9

The original number is 10x + y; the reversed number is 10y + x.

Condition 2: 10x + y − (10y + x) = 27 → 9x − 9y = 27 → x − y = 3

Adding the two simplified equations: 2x = 12 → x = 6, so y = 3.

**The number is 63.** (Check: 63 − 36 = 27 ✓)

## Worked Example 2 — Cost problem (from the scheme style)
Two notebooks and three pens cost ₦1 550. Three notebooks and two pens cost ₦1 800. Find the cost of each.

Let a notebook cost ₦n and a pen cost ₦p.

2n + 3p = 1 550 … (1)

3n + 2p = 1 800 … (2)

Multiply (1) by 2 and (2) by 3: 4n + 6p = 3 100; 9n + 6p = 5 400.

Subtract: 5n = 2 300 → n = 460. Then 2(460) + 3p = 1 550 → 3p = 630 → p = 210.

**Notebook = ₦460, pen = ₦210.**

## Worked Example 3 — Ages
A mother is 26 years older than her daughter. In 5 years, her age will be 3 times her daughter's. Find their present ages.

x = mother's age, y = daughter's age: x − y = 26 and x + 5 = 3(y + 5).

x + 5 = 3y + 15 → x = 3y + 10. Substitute: 3y + 10 − y = 26 → y = 8, x = 34.

**Mother 34, daughter 8.** (Check in 5 years: 39 = 3 × 13 ✓)

## Class Activity
1. The sum of two numbers is 21 and their difference is 5. Find the numbers.
2. The perimeter of a rectangle is 38 cm and its length is 3 cm more than its width. Form simultaneous equations and find the dimensions.
3. A two-digit number is 4 times the sum of its digits. Reversing the digits increases the number by 27. Find the number.

## Assignment
1. Six kola nuts and five oranges cost ₦1 260 while four kola nuts and eight oranges cost ₦1 320. Find the cost of each item.
2. A father is 4 times as old as his daughter. In 15 years, he will be twice as old as she will be then. Form simultaneous equations and find their present ages.

## Summary — Key Points
- Two unknowns need two independent equations.
- Digit problems: a two-digit number is 10x + y, not xy.
- Always answer in context, with the units and the actual question.`,
    },
  ],
}
// __END__
