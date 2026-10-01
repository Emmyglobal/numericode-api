import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 1 — Transformations I. Verified: the midpoint of a segment
// with end points (1,5) and (7,1) is the average of each coordinate:
// ((1+7)/2, (5+1)/2) = (4,3); reflecting A(2,5) in the line y = 1 gives (2,-3);
// reflecting A(2,5) in the line x = 3 gives (4,5).
export const module01: Jss1ModuleData = {
  title: 'Module 1 — Week 1: Transformations I',
  lessons: [
    {
      title: 'Week 1 — Transformations I',
      duration: 45,
      content: `## Learning Objectives
- Find the midpoint of a line segment.
- Translate a shape using a vector.
- Reflect a shape in a mirror line on a coordinate grid.

## Midpoint of a Line Segment
The **midpoint** of a line segment is the point exactly halfway between its two
end points.

To find it, **average each coordinate separately**.

### Worked Example 1
The end points of AB are A(1, 5) and B(7, 1).

Midpoint = ((1 + 7) / 2, (5 + 1) / 2) = (8/2, 6/2) = **(4, 3)**

**Check:** the distances from (4, 3) to each end point are equal, which is exactly
what makes it the midpoint.

## Translation with Vectors
A **translation** moves every point of a shape the same distance in the same
direction. Nothing turns and nothing changes size.

A translation vector is written like a bracket pair, for example **(3, -2)**,
which means: move 3 to the right and 2 down.

### Worked Example 2
Translate A(2, 5) by the vector (4, -1).

New x = 2 + 4 = 6
New y = 5 + (-1) = 4

The image is **(6, 4)**

## Reflecting in a Mirror Line
We already know how to reflect in the x-axis or the y-axis. Now the mirror line
can be **any line** on the grid, so you need its equation.

Two cases you must recognise instantly:

- Every **vertical** line is parallel to the y-axis and has the equation
  **x = a constant**.
- Every **horizontal** line is parallel to the x-axis and has the equation
  **y = a constant**.

### Worked Example 3 — Reflecting in x = 3
Take A(2, 5) and reflect it in the line x = 3.

The line x = 3 is a vertical mirror, so x changes and y stays the same.
The x value moves the same distance the other side of the line: 2 is 1 left of 3,
so the image is 1 right of 3, which is 4.

The image is **(4, 5)**

### Worked Example 4 — Reflecting in y = 1
Take A(2, 5) and reflect it in the line y = 1.

This is a horizontal mirror, so y changes and x stays the same.
5 is 4 above 1, so the image is 4 below 1, which is -3.

The image is **(2, -3)**

## Common Mistakes
- Swapping the coordinates when averaging for a midpoint.
- Adding the vector to only one point.
- Changing both coordinates when the mirror line is only vertical or only
  horizontal.

## Practice
1. Find the midpoint of the segment joining (2, 1) and (8, 5).
2. Translate (3, 2) by the vector (-1, 5).
3. Reflect (6, 4) in the line x = 2.
4. Reflect (6, 4) in the line y = 3.`,
      quiz: quiz(
        'Week 1 Quiz — Transformations I',
        'Five questions on midpoints, translations and reflection in a mirror line.',
        [
          mc(
            'Find the midpoint of the segment joining (1, 5) and (7, 1).',
            ['(4, 3)', '(8, 6)', '(3.5, 2.5)', '(6, 2)'],
            'Average each coordinate: ((1+7)/2, (5+1)/2) = (4, 3).',
          ),
          mc(
            'Translate the point (2, 5) by the vector (4, -1).',
            ['(6, 4)', '(6, 6)', '(2, 4)', '(-2, 6)'],
            'Add the vector to each coordinate: x = 2 + 4 = 6 and y = 5 - 1 = 4, giving (6, 4).',
          ),
          mc(
            'Reflect the point (6, 4) in the line x = 2.',
            ['(-2, 4)', '(2, 4)', '(6, 0)', '(4, 2)'],
            'x = 2 is a vertical mirror, so only x changes. 6 is 4 right of 2, so the image is 4 left of 2, which is -2. The image is (-2, 4).',
          ),
          fb(
            'Reflect the point (6, 4) in the line y = 3. Give your answer as two numbers separated by a comma, for example: 6, 2',
            '6, 2',
            'y = 3 is a horizontal mirror, so only y changes. 4 is 1 below 3, so the image is 1 above 3, which is 2. The image is (6, 2).',
          ),
          mc(
            'Which equation describes a vertical mirror line?',
            ['x = a constant', 'y = a constant', 'y = 2x', 'x + y = 5'],
            'A vertical line runs parallel to the y-axis, so its equation has the form x = a constant.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 1.1 — Transformations I',
        'Show the midpoint calculation in full, and state whether each mirror line is vertical or horizontal.',
        [
          { id: 'a1', type: 'theory', title: 'Find the midpoint of each segment: (i) (2, 1) and (8, 5), (ii) (0, 4) and (6, 10), (iii) (-3, 2) and (5, 2).', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Translate each point by the vector (3, -2): (i) (2, 5), (ii) (-1, 4), (iii) (6, 0).', marks: 5 },
          { id: 'a3', type: 'theory', title: 'Reflect each point in the given mirror line: (i) (6, 4) in x = 2, (ii) (6, 4) in y = 3, (iii) (1, 8) in x = 5.', marks: 6 },
          { id: 'a4', type: 'theory', title: 'The midpoint of a line segment is P(4, 5) and one end point is A(1, 3). Find the other end point.', marks: 3 },
        ],
      ),
    },
  ],
}