import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 10 — Transformations, Bearings and Scale Drawing. Verified:
// the midpoint of (2, 3) and (8, 11) is ((2+8)/2, (3+11)/2) = (5, 7); a scale of
// 1:50 000 means 1 cm on the map is 50000 cm = 500 m on the ground; enlarging
// (2, 1) by scale factor 4 gives (8, 4); a bearing of 062 degrees has a back
// bearing of 062 + 180 = 242 degrees.
export const module10: Jss1ModuleData = {
  title: 'Module 10 — Week 10: Transformation',
  lessons: [
    {
      title: 'Week 10 — Transformation, Bearings and Scale Drawing',
      duration: 45,
      content: `## Learning Objectives
- Find the midpoint of a line segment.
- Read bearings and find back bearings.
- Use a scale to convert between map distance and real distance.
- Enlarge shapes using a scale factor.

## Points on a Line Segment
### Worked Example 1
Find the midpoint of the segment joining (2, 3) and (8, 11).

Midpoint = ((2 + 8) / 2, (3 + 11) / 2) = (10/2, 14/2) = **(5, 7)**

## Bearing and Scale Drawing
A **bearing** describes the direction of one object from another, measured
**clockwise from north**, always in **three figures**.

- The back bearing is found by **adding 180°**.

### Worked Example 2
The bearing of B from A is 062°. The back bearing from B to A is 062 + 180 =
**242°**

## Scale Drawing
A **scale** compares a distance on a map to the real distance on the ground. It
is written **1 : 50 000**, which means 1 unit on the map represents 50 000 of the
same units on the ground.

### Worked Example 3
A scale of 1 : 50 000.

1 cm on the map = 50 000 cm on the ground.
50 000 cm = 500 m

So **1 cm on the map represents 500 m on the ground**

A larger second number means the map is **more detailed** and shows less real
area per centimetre.

## Enlarging Shapes
An **enlargement** scales all lengths by the same **scale factor**. Angles and
proportions are unchanged.

### Worked Example 4
Enlarge the point (2, 1) by a scale factor of 4 about the origin.

(2 x 4, 1 x 4) = **(8, 4)**

## Common Mistakes
- Forgetting to change units when using a scale, for example leaving 50 000 cm
  instead of converting to metres.
- Subtracting 180° instead of adding it for a back bearing.
- Scaling only one dimension, which breaks the proportions.

## Practice
1. Find the midpoint of the segment joining (2, 3) and (8, 11).
2. A bearing is 062°. Find the back bearing.
3. On a map of scale 1 : 50 000, what real distance does 4 cm represent?
4. Enlarge (3, 2) by a scale factor of 5.`,
      quiz: quiz(
        'Week 10 Quiz — Transformation, Bearings and Scale Drawing',
        'Five questions on midpoints, bearings, scale drawing and enlargements.',
        [
          mc(
            'Find the midpoint of the segment joining (2, 3) and (8, 11).',
            ['(5, 7)', '(10, 14)', '(4, 5)', '(6, 9)'],
            'Average each coordinate: ((2+8)/2, (3+11)/2) = (5, 7).',
          ),
          fb(
            'The bearing of B from A is 062 degrees. Find the back bearing from B to A. (Enter a number only)',
            '242',
            'Add 180 degrees to the bearing: 062 + 180 = 242.',
          ),
          mc(
            'A map has a scale of 1 : 50 000. What real distance does 4 cm on the map represent?',
            ['4 km', '20 km', '2 km', '500 m'],
            '1 cm represents 50 000 cm, which is 500 m. So 4 cm represents 4 x 500 = 2000 m = 2 km.',
          ),
          mc(
            'Enlarge the point (3, 2) by a scale factor of 5 about the origin. What is the image?',
            ['(15, 10)', '(8, 7)', '(15, 7)', '(6, 10)'],
            'Multiply each coordinate by 5: (3 x 5, 2 x 5) = (15, 10).',
          ),
          mc(
            'A map scale is written 1 : 100 000. How does this compare with 1 : 50 000?',
            [
              'It is less detailed, because each centimetre covers more ground',
              'It is more detailed, because each centimetre covers less ground',
              'They cover exactly the same distance',
              'It cannot be compared',
            ],
            'A bigger second number means each centimetre represents more real distance, so the map shows a larger area with less detail.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 10.1 — Transformation, Bearings and Scale Drawing',
        'Always convert the scale to a sensible unit such as metres before you calculate.',
        [
          { id: 'a1', type: 'theory', title: 'Find the midpoint of each segment: (i) (2, 3) and (8, 11), (ii) (0, 2) and (6, 10), (iii) (-4, 1) and (4, 9).', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Find the back bearing for each bearing: (i) 062°, (ii) 135°, (iii) 210°.', marks: 4 },
          { id: 'a3', type: 'subjective', title: 'On a map of scale 1 : 50 000, a road measures 7 cm. Find the real distance in metres and then in kilometres.', marks: 4 },
          { id: 'a4', type: 'theory', title: 'Enlarge each point about the origin by the scale factor given: (i) (3, 2) by 5, (ii) (1, 4) by 3, (iii) (10, 6) by 0.5.', marks: 6 },
        ],
        50,
        'mixed',
      ),
    },
  ],
}