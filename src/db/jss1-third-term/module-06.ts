import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 6 — Graphing and Functions. Verified: the line through
// (0, 2) and (2, 6) has gradient (6-2)/(2-0) = 2 and y-intercept 2, so y = 2x + 2;
// the line through (0, 1) and (3, 3) has gradient (3-1)/3 = 2/3, so y = 2/3 x + 1;
// y = x^2 takes values 0, 1, 4, 9, 16 at x = 0..4.
export const module06: Jss1ModuleData = {
  title: 'Module 6 — Week 6: Graphing and Functions',
  lessons: [
    {
      title: 'Week 6 — Graphing and Functions',
      duration: 50,
      content: `## Learning Objectives
- Model a real cost situation with a function.
- Plot a quadratic graph from a table of values.
- Find the equation of a straight line from its gradient and intercept.

## Functions in Real Life
Recurring costs are usually a fixed charge plus a rate.

### Worked Example 1
Hiring a chainsaw costs $15 plus $10 per day. Aran pays $45 — for how many days?

15 + 10d = 45
10d = 30
d = **3 days**

**Check:** 15 + 10(3) = 45. Correct.

## Plotting a Quadratic Graph
A **quadratic graph** comes from an equation such as y = x². It is always a
smooth curve shaped like a bowl.

### Worked Example 2
Plot y = x².

Make a table, then plot and join with a smooth curve:

| x | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| y = x² | 0 | 1 | 4 | 9 | 16 |

The curve passes through the origin and rises on both sides.

## Straight-Line Graphs with Fractional Gradients
A straight line has the equation **y = mx + c**, where m is the gradient and c
the y-intercept. The gradient does not have to be a whole number.

### Worked Example 3
Find the equation of the line through (0, 2) and (2, 6).

Gradient = (6 - 2) / (2 - 0) = 4/2 = **2**
The y-intercept is the y value at x = 0, which is **2**

So the equation is **y = 2x + 2**

### Worked Example 4 — a fractional gradient
The line passes through (0, 1) and (3, 3).

Gradient = (3 - 1) / (3 - 0) = 2/3
The y-intercept is **1**

So the equation is **y = 2/3 x + 1**

A smaller gradient means a shallower line.

## Common Mistakes
- Confusing the x-intercept with the y-intercept.
- Dividing the run by the rise instead of the rise by the run.
- Drawing a quadratic as straight line segments instead of a smooth curve.

## Practice
1. A hire charge is $20 plus $5 per day. Find the cost for 8 days.
2. Plot y = x^2 for x = -2, -1, 0, 1, 2.
3. Find the equation of the line through (0, 1) and (3, 3).
4. Find the equation of the line through (0, 4) and (2, 8).`,
      quiz: quiz(
        'Week 6 Quiz — Graphing and Functions',
        'Five questions on functions, quadratic graphs and fractional gradients.',
        [
          mc(
            'Hiring a chainsaw costs $15 plus $10 per day. Aran pays $45. For how many days did he hire it?',
            ['3 days', '4.5 days', '30 days', '2 days'],
            '15 + 10d = 45, so 10d = 30 and d = 3. Check: 15 + 10(3) = 45.',
          ),
          mc(
            'What is the equation of the line through (0, 2) and (2, 6)?',
            ['y = 2x + 2', 'y = 2x - 2', 'y = 4x + 2', 'y = 0.5x + 2'],
            'Gradient = (6 - 2)/(2 - 0) = 2 and the y-intercept is 2, so y = 2x + 2.',
          ),
          mc(
            'Find the equation of the line through (0, 1) and (3, 3).',
            ['y = 2/3 x + 1', 'y = 3/2 x + 1', 'y = 2x + 1', 'y = 1/3 x + 1'],
            'Gradient = (3 - 1)/(3 - 0) = 2/3 and the y-intercept is 1, so y = 2/3 x + 1.',
          ),
          fb(
            'Plot the line y = x^2. What is y when x = 3? (Enter a number only)',
            '9',
            'y = x^2 gives 3^2 = 9. The full table for x = 0 to 4 is 0, 1, 4, 9, 16.',
          ),
          mc(
            'What does a smaller gradient mean on a straight-line graph?',
            [
              'The line is shallower, rising less for each unit across',
              'The line is steeper',
              'The line is vertical',
              'The line does not cross the y-axis',
            ],
            'Gradient is rise over run, so a smaller value means the line climbs less steeply.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 6.1 — Graphing and Functions',
        'Always show the table of values before drawing, and label both axes.',
        [
          { id: 'a1', type: 'theory', title: 'A hire charge is $20 plus $5 per day. Find the cost of hiring for 8 days, and write the cost as a function of d.', marks: 5 },
          { id: 'a2', type: 'theory', title: 'Make a table of values and plot the graph of y = x^2 for the values of x from -3 to 3.', marks: 5 },
          { id: 'a3', type: 'theory', title: 'Find the equation of the straight line through each pair of points: (i) (0, 1) and (3, 3), (ii) (0, 4) and (2, 8), (iii) (0, 2) and (5, 12).', marks: 6 },
          { id: 'a4', type: 'subjective', title: 'Explain why a quadratic graph must be drawn with a smooth curve rather than straight line segments.', marks: 4 },
        ],
        50,
        'mixed',
      ),
    },
  ],
}