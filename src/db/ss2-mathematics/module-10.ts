import type { Ss2ModuleData } from './types'

export const module10: Ss2ModuleData = {
  title: 'Module 10 — Week 10: Graphs',
  lessons: [
    {
      title: 'Lesson 10.1 — Linear Graphs',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Draw the graph of a linear equation using a table of values.
- Choose sensible scales and plot points accurately.
- Read the gradient and intercept from a graph.

## Introduction
A **graph** is a picture of an equation. Every point (x, y) on the line satisfies the equation. This week we draw linear and quadratic graphs and use them to solve equations.

## Worked Example 1 (from the scheme)
Draw the graph of y = 2x − 1 for x from −2 to 3.

**Table of values** — substitute each x into the equation:

- x = −2 → y = 2(−2) − 1 = −5
- x = −1 → y = −3
- x = 0 → y = −1
- x = 1 → y = 1
- x = 2 → y = 3
- x = 3 → y = 5

Plot the points (−2, −5), (−1, −3), (0, −1), (1, 1), (2, 3), (3, 5) and join them with a straight line and ruler. The line crosses the y-axis at (0, −1) — this is the **intercept**.

## Choosing Scales
1. Look at the largest and smallest x and y values.
2. Choose scales that use most of the graph paper — commonly 2 cm to 1 unit (or 2 units) on each axis.
3. Both axes need NOT have the same scale, but label both clearly.

## Worked Example 2 (from the scheme)
Draw the graph of 3y − 2x = 3.

Rearrange first into the form y = …: 3y = 2x + 3 → y = (2x + 3)/3 = ⅔x + 1.

Table for x = −3, 0, 3:

- x = −3 → y = −1
- x = 0 → y = 1
- x = 3 → y = 3

Always rearrange a linear equation into y = mx + c before making a table.

## Class Activity
1. Copy and complete the table of values for y = 3x − 2 for x = −2, −1, 0, 1, 2 and draw the graph.
2. Draw the graph of x + y = 5 for −1 ≤ x ≤ 6.
3. From your graph of y = 3x − 2, read the value of y when x = 1.5.

## Assignment
1. Draw the graph of 2y − x = 4 for −2 ≤ x ≤ 4, using 2 cm to represent 1 unit on both axes.
2. Use your graph to find the coordinates of the point where the line crosses the x-axis.

## Summary — Key Points
- Build a table of values by substitution; three points minimum for a straight line.
- Rearrange to y = mx + c first.
- Choose scales that spread the graph over the page and label the axes.`,
    },
    {
      title: 'Lesson 10.2 — Quadratic Graphs',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Draw quadratic graphs from a table of values.
- Identify the shape (parabola), the roots and the turning point.

## Introduction
The graph of y = ax² + bx + c is a smooth U-shaped curve called a **parabola**. It opens upward when a > 0 (minimum point) and downward when a < 0 (maximum point).

## Worked Example 1 (from the scheme)
Draw the graph of y = 2x² − x − 6 for −3 ≤ x ≤ 3.

**Table of values:**

- x = −3 → y = 18 + 3 − 6 = 15
- x = −2 → y = 8 + 2 − 6 = 4
- x = −1 → y = 2 + 1 − 6 = −3
- x = 0 → y = −6
- x = 1 → y = 2 − 1 − 6 = −5
- x = 2 → y = 8 − 2 − 6 = 0
- x = 3 → y = 18 − 3 − 6 = 9

Plot the points and join them with a smooth curve (never a series of straight segments).

**Reading the graph:**

- The curve cuts the x-axis at x = −1.5 and x = 2 — these are the **roots** of 2x² − x − 6 = 0. (Check by factorization: (2x + 3)(x − 2) = 0 ✓)
- The **minimum point** is at about (0.25, −6.13).

## Worked Example 2 (from the scheme)
Draw the graph of y = 3x² − 8x + 5 for 0 ≤ x ≤ 2.5 and use it to solve 3x² − 8x + 5 = 0.

Table of values: x = 0 → 5; x = 0.5 → 1.75; x = 1 → 0; x = 1.5 → −0.25; x = 2 → 1; x = 2.5 → 4.75.

The curve cuts the x-axis at **x = 1 and x = 5/3 (≈1.67)** — the solutions of the equation. (Check: (3x − 5)(x − 1) = 0 ✓)

## Accuracy Tips
1. Compute every table value carefully — one wrong point ruins the curve.
2. Use a sharp pencil; join points with a smooth curve.
3. Label the graph with its equation.

## Class Activity
1. Draw the graph of y = x² − 4 for −3 ≤ x ≤ 3 and state the roots of x² − 4 = 0 from your graph.
2. Draw the graph of y = 5x² + x − 4 for −2 ≤ x ≤ 1 and read the roots of 5x² + x − 4 = 0. (Answer: x = −1 and x = 0.8.)
3. State whether each graph above has a maximum or minimum point and give its coordinates approximately.

## Assignment
1. Draw the graph of y = 3x² − 5x − 8 for −2 ≤ x ≤ 3, using 2 cm to 1 unit on the x-axis and 2 cm to 5 units on the y-axis.
2. From your graph, find the roots of 3x² − 5x − 8 = 0 and estimate the coordinates of the minimum point.

## Summary — Key Points
- Parabolas need many plotted points joined smoothly.
- Roots of ax² + bx + c = 0 are where the curve cuts the x-axis.
- Minimum/maximum occurs where the curve turns; completing the square confirms its coordinates.`,
    },
    {
      title: 'Lesson 10.3 — Graphical Solution of Simultaneous Equations',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Solve a pair of simultaneous equations by drawing both graphs.
- Read the solution from the point of intersection.

## Introduction
Two lines (or curves) drawn on the same axes cross at the point that satisfies BOTH equations. That **point of intersection** is the graphical solution of the simultaneous equations.

## Worked Example 1
Solve graphically: y = 2x − 1 and x + y = 5.

**Table for y = 2x − 1:** x = 0 → −1; x = 1 → 1; x = 3 → 5.

**Table for x + y = 5 (i.e. y = 5 − x):** x = 0 → 5; x = 2 → 3; x = 5 → 0.

Draw both lines on the same axes. They intersect at **(2, 3)**.

Check: 3 = 2(2) − 1 ✓ and 2 + 3 = 5 ✓ — so x = 2, y = 3.

## Worked Example 2 — Line and parabola
Solve graphically: y = x² − 4 and y = x + 2, for −3 ≤ x ≤ 4.

**Table for y = x² − 4:** x = −3 → 5; x = −2 → 0; x = −1 → −3; x = 0 → −4; x = 1 → −3; x = 2 → 0; x = 3 → 5.

**Table for y = x + 2:** x = −3 → −1; x = 0 → 2; x = 4 → 6.

The line cuts the curve at **(−2, 0)** and **(3, 5)**.

Check algebraically: x² − 4 = x + 2 → x² − x − 6 = 0 → (x − 3)(x + 2) = 0 → x = 3 or −2 ✓ (y = 5 or 0 ✓)

## Why Graphs Matter
- The graph shows **how many** solutions exist: two intersections → two solutions; no intersection → none; touching → one repeated solution.
- It also solves equations you cannot easily factorize — read the x-coordinates of the intersection points.

## Class Activity
1. Solve graphically: y = 3x − 2 and y = x + 4.
2. Solve graphically for −3 ≤ x ≤ 3: y = x² and y = 2x + 3. Confirm your readings by solving algebraically.
3. Draw y = x − 1 and y = x² + 1 on the same axes. What do you notice about their intersections, and what does it mean algebraically?

## Assignment
1. Solve graphically: 2x + y = 8 and y = x² − 3x − 4, for −3 ≤ x ≤ 5.
2. Shade or mark clearly on your graph the point(s) where x + y = 4 meets y = 2x² − 8, and state the solution(s).

## Summary — Key Points
- The intersection point(s) of the two graphs solve the simultaneous equations.
- Line–line → one point; line–parabola → up to two points.
- Always check each reading by substitution.`,
    },
    {
      title: 'Lesson 10.4 — Applications of Quadratic Graphs',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Use a quadratic graph to solve related equations (e.g. 2x² = 3x + 5) by drawing a suitable straight line.
- Find maximum and minimum values from a graph.
- Apply quadratic graphs to practical problems.

## Introduction
A single well-drawn parabola can answer many questions at once. WAEC loves questions of the form "use your graph to solve 2x² = 3x + 5" — the trick is to rearrange so that one side is your already-drawn quadratic.

## Worked Example 1 — Solving a related equation
Using the graph of y = 2x² − x − 6 (drawn in Lesson 10.2 for −3 ≤ x ≤ 3), solve 2x² − x = 14.

Rearrange so the left side matches the graph:

2x² − x − 14 = 0 → 2x² − x − 6 = 8

So draw the line y = 8 on the same axes and read the x-values where it cuts the curve.

These give the solutions of 2x² − x − 14 = 0. Check with the formula: b² − 4ac = 1 + 112 = 113, √113 ≈ 10.63, so x = (1 ± 10.63)/4, i.e. **x ≈ 2.91 or x ≈ −2.41**. Readings from a hand-drawn graph are estimates — refine the curve or use finer scales to get closer to these values.

**Worked Example 2 — from the scheme: using y = 3x² − 5x − 8**

Draw y = 3x² − 5x − 8 for −2 ≤ x ≤ 3 (table: x = −2 → 14; x = −1 → 0; x = 0 → −8; x = 1 → −10; x = 2 → −6; x = 3 → 4).

- Roots of 3x² − 5x − 8 = 0: the curve cuts the x-axis at **x = −1 and x = 8/3 ≈ 2.67**.
- To solve 3x² − 5x = 10 with the same curve, rearrange: 3x² − 5x − 8 = 18, so draw the line y = 18 and read the x-values of intersection (approximately x ≈ −1.4 and x ≈ 3.1 — extend your table to x = 4, y = 24, to cover this reading).

Check: 3x² − 5x − 18 = 0 does not factorize neatly; by the formula x = (5 ± √(25 + 216))/6 = (5 ± √241)/6 = (5 ± 15.52)/6, so **x ≈ 3.42 or x ≈ −1.75**. Trust the formula for verification, and extend the curve to cover the positive reading.

## Worked Example 3 — Minimum values
The cost C (in thousands of naira) of producing x hundred units is C = x² − 6x + 16. Using the graph for 0 ≤ x ≤ 6 (values: 16, 11, 8, 7, 8, 11, 16), find the minimum cost.

The curve turns at **(3, 7)**: minimum cost = ₦7 000 when 300 units are produced.

This is why businesses plot cost/profit curves — the turning point is the best operating level.

## Class Activity
1. Using the graph of y = x² − 2x − 3 for −2 ≤ x ≤ 4, solve x² − 2x − 3 = 5 by drawing a suitable line.
2. From the same graph, state the minimum value of y and where it occurs.
3. The height h (m) of a ball after t seconds is h = 20t − 5t². Draw its graph for 0 ≤ t ≤ 4 and find the maximum height and when it occurs.

## Assignment
1. Using the graph of y = 3x² − 8x + 5 for 0 ≤ x ≤ 2.5 (drawn in Lesson 10.2), solve 3x² − 8x = −3 by drawing a suitable line.
2. A rectangle has sides (x + 2) cm and (x − 1) cm and area 30 cm². Form the quadratic, then use a graph to solve it.

## Summary — Key Points
- To solve a related equation, rearrange it so one side is exactly your drawn expression; the other side becomes a horizontal (or straight) line.
- Turning points give maximum/minimum values — vital for real applications.
- Graphical answers are estimates; quote them to the accuracy your graph allows.`,
    },
  ],
}
// __END__
