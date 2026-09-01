import type { Ss2ModuleData } from './types'

export const module06: Ss2ModuleData = {
  title: 'Module 6 — Week 6: Revision of Quadratic Equations',
  lessons: [
    {
      title: 'Lesson 6.1 — Introduction to Quadratic Equations',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Define a quadratic equation and identify its general form.
- Distinguish quadratic equations from linear equations.
- Substitute values into a quadratic expression and test possible roots.

## Introduction
This week we revise **quadratic equations** — equations in which the highest power of the unknown is 2. They model projectiles, areas and many examination questions.

## Definition and General Form
A **quadratic equation** is an equation of the form:

**ax² + bx + c = 0**

where a, b and c are constants, and **a ≠ 0** (otherwise the x² term vanishes and the equation is linear).

- a is the coefficient of x², b of x, and c is the constant term.
- Examples: x² − 5x + 6 = 0 (a = 1, b = −5, c = 6); 2x² + x − 3 = 0 (a = 2, b = 1, c = −3).
- Not quadratic: 3x + 1 = 0 (linear); x³ − x = 0 (cubic).

## A Root Is a Solution
A **root** of ax² + bx + c = 0 is a value of x that makes the equation true. A quadratic equation has **at most two roots**.

**Example: show that x = 2 is a root of x² − 5x + 6 = 0**

Substitute x = 2: (2)² − 5(2) + 6 = 4 − 10 + 6 = 0. True, so x = 2 is a root. (The other root is x = 3.)

## Rearranging into General Form
Always rearrange before solving: 2x² = 3x + 5 → 2x² − 3x − 5 = 0.

**Example: write (x − 1)(x + 4) = 6 in general form**

Expand: x² + 3x − 4 = 6 → **x² + 3x − 10 = 0**

## Class Activity
1. State a, b and c for: 4x² − 9 = 0; x − 3x² = 1; 7 = 2x².
2. Show that x = −1 is a root of 2x² + 3x + 1 = 0 and find the other root by trial.
3. Write 3x(x + 2) = 10 in general form.

## Assignment
1. Explain why ax² + bx + c = 0 with a = 0 is not a quadratic equation.
2. Write (2x + 1)(x − 3) = 4 in general form and state a, b and c.

## Summary — Key Points
- Quadratic: ax² + bx + c = 0 with a ≠ 0.
- A root satisfies the equation when substituted; a quadratic has at most two roots.
- Always rearrange to general form first.`,
    },
    {
      title: 'Lesson 6.2 — Factorization',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Solve quadratic equations by factorization.
- Factorize expressions of the form x² + bx + c and ax² + bx + c.
- Use the zero-product property.

## Introduction
The fastest way to solve a quadratic equation is to factorize it. The method rests on one fact: if two things multiply to give zero, one of them must be zero.

## The Zero-Product Property
If PQ = 0, then P = 0 or Q = 0.

So if (x − 2)(x + 3) = 0, then x − 2 = 0 or x + 3 = 0, giving **x = 2 or x = −3**.

## Factorizing x² + bx + c
Find two numbers whose **product is c** and whose **sum is b**.

**Example 1: Solve x² + 7x + 12 = 0**

Two numbers with product 12 and sum 7: 3 and 4.

(x + 3)(x + 4) = 0 → **x = −3 or x = −4**

**Example 2: Solve x² − 2x − 15 = 0**

Product −15, sum −2: −5 and 3.

(x − 5)(x + 3) = 0 → **x = 5 or x = −3**

## Factorizing ax² + bx + c (a ≠ 1)
Use factor pairs of a × c, or split the middle term.

**Example 3: Solve 2x² + 5x − 3 = 0**

a × c = 2 × (−3) = −6; find a pair with sum 5: 6 and −1.

2x² + 6x − x − 3 = 0

2x(x + 3) − 1(x + 3) = 0

(2x − 1)(x + 3) = 0 → **x = 1/2 or x = −3**

## Equations Without a c Term
**Example 4: Solve 3x² − 9x = 0**

Factor out x: 3x(x − 3) = 0 → **x = 0 or x = 3**

Never divide both sides by x — you would lose the root x = 0.

## Class Activity
1. Solve: x² + 9x + 20 = 0; x² − 4x − 21 = 0.
2. Solve: 3x² + 10x + 8 = 0.
3. Solve: 5x² = 10x.

## Assignment
1. Solve: x² − 11x + 24 = 0; 4x² − 9 = 0 (hint: difference of two squares).
2. Solve: 6x² − 7x − 3 = 0.

## Summary — Key Points
- PQ = 0 means P = 0 or Q = 0 — the heart of the factorization method.
- For x² + bx + c: two numbers with product c, sum b.
- For ax² + bx + c: split the middle term, then factor by grouping.`,
    },
    {
      title: 'Lesson 6.3 — Completing the Square',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Write x² + bx in the form (x + p)² + q.
- Solve quadratic equations by completing the square.
- Recognise perfect squares.

## Introduction
Some quadratic equations do not factorize nicely (for example x² + 6x − 4 = 0). **Completing the square** rewrites any quadratic so it can be solved by taking square roots — and it is the bridge to the quadratic formula in the next lesson.

## Perfect Squares
A perfect square is an expression like (x + 5)² = x² + 10x + 25. Notice the constant 25 is exactly half of 10, squared.

## The Method for x² + bx + c = 0
1. Move the constant: x² + bx = −c.
2. Add (b/2)² to both sides — the number that completes the square.
3. Write the left side as (x + b/2)².
4. Take square roots and solve.

## Worked Examples
**Example 1: Solve x² + 6x − 4 = 0 by completing the square**

x² + 6x = 4

Add (6/2)² = 9: x² + 6x + 9 = 13

(x + 3)² = 13

x + 3 = ±√13 ≈ ±3.606

**x ≈ 0.61 or x ≈ −6.61**

**Example 2: Solve 2x² − 8x + 1 = 0**

Divide through by 2 first: x² − 4x + 1/2 = 0

x² − 4x = −1/2

Add (−4/2)² = 4: (x − 2)² = 7/2

x − 2 = ±√3.5 ≈ ±1.871

**x ≈ 3.87 or x ≈ 0.13**

## Finding the Turning Point
For y = x² + 6x − 4 = (x + 3)² − 13, the least value of y occurs when (x + 3)² = 0, i.e. x = −3, and the least value is −13. Completing the square reveals the minimum point of a quadratic graph — remember this for Week 10.

## Class Activity
1. Write x² + 8x in the form (x + p)² + q.
2. Solve by completing the square: x² + 4x − 5 = 0 (check your answer by factorization).
3. Solve x² − 2x − 2 = 0, giving your answer in surd form and to 2 d.p.

## Assignment
1. Solve 3x² − 6x − 1 = 0 by completing the square, correct to 2 d.p.
2. By completing the square, find the minimum value of y = x² − 10x + 27.

## Summary — Key Points
- Add (b/2)² to complete the square of x² + bx.
- Divide through by a first when a ≠ 1.
- (x + p)² + q immediately gives the minimum point (−p, q) when a > 0.`,
    },
    {
      title: 'Lesson 6.4 — Quadratic Formula',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Derive the quadratic formula by completing the square.
- Apply the formula x = (−b ± √(b² − 4ac)) ÷ 2a accurately.
- Interpret the discriminant b² − 4ac.

## Introduction
The **quadratic formula** solves every quadratic equation ax² + bx + c = 0, whether it factorizes or not. It is obtained by completing the square on the general equation, so it is a formula you can even re-derive in an exam.

## Derivation (outline)
Start with ax² + bx + c = 0. Divide by a, move c, and complete the square:

x² + (b/a)x = −c/a

x² + (b/a)x + (b/2a)² = (b/2a)² − c/a

(x + b/2a)² = (b² − 4ac)/(4a²)

x + b/2a = ±√(b² − 4ac)/(2a)

## The Formula

**x = [−b ± √(b² − 4ac)] ÷ 2a**

The expression **b² − 4ac** is the **discriminant**:

- b² − 4ac > 0 → two different real roots.
- b² − 4ac = 0 → two equal (repeated) roots.
- b² − 4ac < 0 → no real roots.

## Worked Examples
**Example 1: Solve 2x² + 3x − 4 = 0, correct to 2 d.p.**

a = 2, b = 3, c = −4.

b² − 4ac = 9 + 32 = 41

x = (−3 ± √41) ÷ 4 = (−3 ± 6.403) ÷ 4

**x ≈ 0.85 or x ≈ −2.35**

**Example 2: Solve x² − 6x + 9 = 0**

b² − 4ac = 36 − 36 = 0, so there are two equal roots.

x = 6 ÷ 2 = **3 (twice)** — indeed (x − 3)² = 0.

**Example 3: Show that x² + x + 5 = 0 has no real roots**

b² − 4ac = 1 − 20 = −19 < 0 → no real roots.

## Class Activity
1. Use the formula to solve x² + 5x + 2 = 0, correct to 2 d.p.
2. Use the formula to solve 3x² − 2x − 6 = 0.
3. Without solving, state the nature of the roots of: 4x² − 12x + 9 = 0; 2x² − 3x + 4 = 0.

## Assignment
1. Solve 5x² − 7x − 1 = 0 using the quadratic formula, correct to 3 s.f.
2. For what value of k does x² + kx + 16 = 0 have equal roots?

## Summary — Key Points
- x = [−b ± √(b² − 4ac)] ÷ 2a solves any quadratic.
- Compute b² − 4ac first — it tells you what kind of roots to expect.
- Quote answers to the degree of accuracy requested.`,
    },
    {
      title: 'Lesson 6.5 — Roots of Quadratic Equations',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Use the sum and product of roots formulas α + β = −b/a and αβ = c/a.
- Form a quadratic equation from its roots without solving.

## Introduction
The two roots of ax² + bx + c = 0 are usually called α (alpha) and β (beta). Remarkably, their **sum** and **product** can be read straight off the coefficients — no solving required.

## Key Formulas
If α and β are the roots of ax² + bx + c = 0, then:

**α + β = −b/a**

**αβ = c/a**

**Forming the equation from the roots:** x² − (sum of roots)x + (product of roots) = 0

## Worked Examples
**Example 1: Find the sum and product of the roots of 2x² − 8x + 5 = 0**

a = 2, b = −8, c = 5.

Sum = −b/a = 8/2 = **4**

Product = c/a = 5/2 = **2.5**

(Check by solving: x = (8 ± √24)/4 = 2 ± √6/2. Sum = 4 ✓, product = 4 − 6/4 = 2.5 ✓.)

**Example 2: One root of x² − 5x + k = 0 is 2. Find the other root and k.**

Sum of roots = 5, so the other root is 5 − 2 = **3**.

Product = k = 2 × 3 = **6**.

**Example 3: Form a quadratic equation whose roots are 3 and −1/2**

Sum = 3 + (−1/2) = 5/2; product = 3 × (−1/2) = −3/2.

x² − (5/2)x − 3/2 = 0

Multiply by 2: **2x² − 5x − 3 = 0**

## Class Activity
1. Find the sum and product of the roots of: x² − 7x + 10 = 0; 3x² + 9x − 2 = 0.
2. One root of x² − 7x + 12 = 0 is 3. Find the other root without solving.
3. Form a quadratic equation with roots −4 and 5.

## Assignment
1. The roots of x² + px + 8 = 0 differ by 2. Find p. (Hint: let the roots be m and m + 2.)
2. Form the quadratic equation whose roots are 2 + √3 and 2 − √3.

## Summary — Key Points
- α + β = −b/a and αβ = c/a — read directly from the coefficients.
- Equation from roots: x² − (sum)x + (product) = 0.
- These formulas also let you find unknown coefficients quickly.`,
    },
    {
      title: 'Lesson 6.6 — Word Problems Leading to Quadratic Equations',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Translate word problems into quadratic equations.
- Solve the equations and select the root that fits the problem.

## Introduction
Many examination questions hide a quadratic equation inside a story about numbers, areas or ages. The skill is to define the unknown, build the equation, solve it — and then **reject any root that makes no sense** (a length cannot be negative).

## The Strategy
1. Read the problem twice; define the unknown clearly (let x = …).
2. Form the equation.
3. Rearrange to ax² + bx + c = 0.
4. Solve by factorization, completing the square or the formula.
5. Choose the root that satisfies the conditions of the problem.

## Worked Examples
**Example 1: The product of two consecutive positive integers is 156. Find the integers.**

Let the integers be n and n + 1.

n(n + 1) = 156 → n² + n − 156 = 0 → (n + 13)(n − 12) = 0

n = −13 or n = 12. Reject n = −13 (must be positive).

The integers are **12 and 13**.

**Example 2: A rectangular garden is 3 m longer than it is wide, and its area is 130 m². Find its dimensions.**

Let the width be x m; the length is (x + 3) m.

x(x + 3) = 130 → x² + 3x − 130 = 0 → (x + 13)(x − 10) = 0

x = −13 or x = 10. Reject the negative root.

**Width = 10 m, length = 13 m.**

**Example 3: A number is increased by 8 and the result is squared. The answer is 144. Find the number.**

(x + 8)² = 144 → x + 8 = ±12 → x = 4 or x = −20.

Both roots are mathematically valid; whether both are acceptable depends on the context of the problem.

## Common Pitfalls
- Forgetting to reject impossible roots (negative lengths, ages).
- Defining the unknown vaguely — always write "let x = …".
- Not answering the actual question (e.g. giving x when the length x + 3 was asked).

## Class Activity
1. The product of two consecutive positive even numbers is 288. Find the numbers.
2. The area of a square is increased by adding 4 m to its length and 2 m to its width; the new area is 120 m². Form an equation in x and hence find the original side.
3. The square of a number is 30 more than the number. Find the number.

## Assignment
1. The sum of a number and its reciprocal is 17/4. Find the number.
2. A farmer wants a rectangular pen of area 96 m² with a length 4 m greater than the width. Find the dimensions of the pen.

## Summary — Key Points
- Define the unknown, form the quadratic, solve, then select the sensible root.
- Area and consecutive-number problems are the classic patterns.
- Marks are earned for the equation, the solution AND the interpretation.`,
    },
  ],
}
// __END__
