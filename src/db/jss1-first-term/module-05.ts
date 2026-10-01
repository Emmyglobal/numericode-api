import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Week 5 — Graphing Linear Functions. Verified: hall hire C = 200n + 25;
// 4 hours costs 200(4) + 25 = 825; y = 3x + 2 has gradient 3 and intercept 2;
// gradient from (1,5) to (3,11) is (11-5)/(3-1) = 3.
export const module05: Jss1ModuleData = {
  title: 'Module 5 — Week 5: Graphing Linear Functions',
  lessons: [
    {
      title: 'Week 5 — Graphing Linear Functions',
      duration: 45,
      content: `## Learning Objectives
- Write a real-life cost situation as a linear function.
- Plot a linear graph from a table of values.
- Find the gradient and the intercept of y = mx + c.

## Functions in Real Life
Some costs have two parts: a fixed charge, plus a charge that depends on
something.

### Worked Example 1
A hall costs a booking fee of #25 plus #200 per hour.

Hiring it for 4 hours costs:

200 x 4 + 25 = 800 + 25 = **#825**

If the hall is hired for n hours and the cost is #C, then:

**C = 200n + 25**

## Plotting Graphs
To plot y = 200n + 25, make a table of values, plot each (n, C) pair, then join
them with a straight line.

Always include n = 0, because that gives the **intercept** — the value when
nothing has happened yet.

## Gradient and Intercept
A function in the form **y = mx + c** is called a **linear function**.

- **m** is the **gradient** — how much y changes for each unit change in x.
- **c** is the **intercept** — where the line cuts the y-axis, found at x = 0.

### Worked Example 2
For y = 3x + 2: the gradient is **3** and the intercept is **2**.

### Worked Example 3
Finding the gradient from a graph or table using two points, (1, 5) and (3, 11):

gradient = (11 - 5) / (3 - 1) = 6 / 2 = **3**

You can also read the gradient straight off the graph by measuring the rise
over the run.

## Interpreting Graphs
Once plotted, a graph answers questions without any arithmetic. Ask what the
gradient tells you, what the intercept means in context, and what happens at a
particular value.

## Common Mistakes
- Reading the intercept from the x-axis instead of the y-axis.
- Using (y2 - y1) / (x1 - x2) instead of (y2 - y1) / (x2 - x1).
- Forgetting that a negative gradient means the line goes down.

## Practice
1. Cost = #15 plus #30 per day. Find the cost for 10 days, and write C in terms of d.
2. State the gradient and intercept of y = 5x - 2.
3. Find the gradient of the line through (0, 1) and (4, 9).
4. Plot y = x + 3 from a table of values.`,
      quiz: quiz(
        'Week 5 Quiz — Graphing Linear Functions',
        'Five questions on linear functions, plotting, gradient and intercept.',
        [
          mc(
            'A hall costs a booking fee of #25 plus #200 per hour. What is the cost of 4 hours?',
            ['#825', '#800', '#1025', '#8250'],
            'The cost is 200 x 4 + 25 = 800 + 25 = #825. Do not forget the fixed booking fee.',
          ),
          fb(
            'For the function C = 200n + 25, what is the cost when n = 0? (Enter a number only)',
            '25',
            'At n = 0 the per-hour charge disappears, leaving only the booking fee of #25. This is the intercept.',
          ),
          mc(
            'In the linear function y = mx + c, what does m represent?',
            ['The gradient', 'The intercept', 'The x-intercept only', 'The total cost'],
            'm is the gradient — the rate at which y changes as x changes. c is the intercept.',
          ),
          mc(
            'What are the gradient and intercept of y = 3x + 2?',
            ['Gradient 3, intercept 2', 'Gradient 2, intercept 3', 'Gradient 5, intercept 2', 'Gradient 3, intercept 5'],
            'Read them straight from y = mx + c: m = 3 is the gradient and c = 2 is the intercept.',
          ),
          mc(
            'What is the gradient of the line through the points (1, 5) and (3, 11)?',
            ['3', '2', '6', '1.5'],
            'Gradient = (11 - 5) / (3 - 1) = 6 / 2 = 3.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 5.1 — Graphing Linear Functions',
        'Draw a table of values before any graph, and label your axes clearly.',
        [
          { id: 'a1', type: 'subjective', title: 'A hall costs a booking fee of #25 plus #200 per hour. (a) Find the cost of hiring it for 6 hours. (b) Write the cost as a function of n, the number of hours.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'State the gradient and the intercept of each linear function: (i) y = 5x - 2, (ii) y = 4x + 7, (iii) y = x - 9.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Find the gradient of the line through each pair of points: (i) (0, 1) and (4, 9), (ii) (2, 3) and (5, 12), (iii) (1, 6) and (7, 6).', marks: 6 },
          { id: 'a4', type: 'subjective', title: 'Plot the graph of y = x + 3 using a table of values for x = -2, -1, 0, 1, 2, 3. Describe what the intercept means on the graph.', marks: 4 },
        ],
        50,
        'mixed',
      ),
    },
  ],
}