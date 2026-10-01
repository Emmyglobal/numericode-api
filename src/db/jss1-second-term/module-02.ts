import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 2 — Transformations II. Verified: a 90 degree clockwise
// rotation about (0,0) sends (3,1) to (1,-3); a 180 degree rotation about
// (0,0) sends (3,1) to (-3,-1); an enlargement of scale factor 3 sends (2,1)
// to (6,3); scale factor 1/2 sends (8,4) to (4,2).
export const module02: Jss1ModuleData = {
  title: 'Module 2 — Week 2: Transformations II',
  lessons: [
    {
      title: 'Week 2 — Transformations II',
      duration: 45,
      content: `## Learning Objectives
- Rotate a shape using the angle, direction and centre.
- Enlarge a shape using a scale factor.
- Explain what an enlargement does and does not change.

## Rotations
There are **three key pieces of information** you need before you can carry out
a rotation:

1. The **angle of rotation**.
2. The **direction** — clockwise or anticlockwise.
3. The **coordinates of the centre** of rotation.

Leave out any one of these and the rotation is not fully described.

### Worked Example 1
Rotate the point (3, 1) by 90 degrees **clockwise** about the origin (0, 0).

For a 90 degree clockwise rotation about the origin, (x, y) becomes **(y, -x)**.

The point (3, 1) becomes **(1, -3)**

### Worked Example 2
Rotate the point (3, 1) by 180 degrees about the origin.

A 180 degree rotation turns the point the opposite way in both directions, so
(x, y) becomes **(-x, -y)**.

The point (3, 1) becomes **(-3, -1)**

### Worked Example 3
Rotate the point (3, 1) by 90 degrees **anticlockwise** about the origin.

(x, y) becomes **(-y, x)**, so (3, 1) becomes **(-1, 3)**

Clockwise and anticlockwise are the most commonly confused pair. If your answer
looks like a mirror image, check which direction you actually needed.

## Enlargements
An **enlargement** is a copy of a shape with its dimensions changed but its
proportions unchanged. **All angles stay the same.**

The **scale factor** says how much bigger or smaller the image is.

### Worked Example 4 — scale factor 3
Enlarge the point (2, 1) by a scale factor of 3 about the origin.

Multiply every coordinate by 3: (6, 3)

### Worked Example 5 — a fractional scale factor
Enlarge the point (8, 4) by a scale factor of 1/2.

(8 x 1/2, 4 x 1/2) = **(4, 2)**

A scale factor greater than 1 makes the shape bigger; less than 1 makes it
smaller. A scale factor of 1 leaves the shape unchanged.

## Common Mistakes
- Using a rule for clockwise when anticlockwise was asked for.
- Forgetting that an enlargement changes lengths but never angles.
- Enlarging about the wrong point — always work relative to the centre given.

## Practice
1. Rotate (4, 2) by 90 degrees clockwise about the origin.
2. Rotate (4, 2) by 90 degrees anticlockwise about the origin.
3. Rotate (4, 2) by 180 degrees about the origin.
4. Enlarge (3, 5) by a scale factor of 4.
5. Enlarge (9, 6) by a scale factor of 1/3.`,
      quiz: quiz(
        'Week 2 Quiz — Transformations II',
        'Five questions on rotations and enlargements.',
        [
          mc(
            'Which three pieces of information describe a rotation completely?',
            [
              'The angle, the direction and the centre',
              'The size, the colour and the position',
              'The angle, the area and the perimeter',
              'The centre, the length and the width',
            ],
            'A rotation is fully described by the angle of rotation, the direction (clockwise or anticlockwise) and the coordinates of the centre.',
          ),
          mc(
            'Rotate the point (3, 1) by 90 degrees clockwise about the origin. What is the image?',
            ['(1, -3)', '(-1, 3)', '(-3, -1)', '(3, -1)'],
            'A 90 degree clockwise rotation about the origin sends (x, y) to (y, -x), so (3, 1) becomes (1, -3).',
          ),
          fb(
            'Rotate the point (3, 1) by 180 degrees about the origin. Give your answer as two numbers separated by a comma, for example: -3, 1',
            '-3,-1',
            'A 180 degree rotation about the origin sends (x, y) to (-x, -y), so (3, 1) becomes (-3, -1).',
          ),
          mc(
            'Enlarge the point (2, 1) by a scale factor of 3 about the origin. What is the image?',
            ['(6, 3)', '(5, 4)', '(2, 3)', '(3, 6)'],
            'Multiply each coordinate by the scale factor: (2 x 3, 1 x 3) = (6, 3).',
          ),
          mc(
            'What does an enlargement never change?',
            ['The angles', 'The lengths', 'The coordinates', 'The size'],
            'An enlargement scales all lengths by the same factor, so proportions and every angle stay the same.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 2.1 — Transformations II',
        'State the angle, the direction and the centre before you carry out any rotation.',
        [
          { id: 'a1', type: 'theory', title: 'Rotate each point about the origin (0,0) and state the direction used: (i) (4, 2) by 90 degrees clockwise, (ii) (4, 2) by 90 degrees anticlockwise, (iii) (4, 2) by 180 degrees.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Rotate each point about the origin (0,0) by 90 degrees clockwise: (i) (1, 5), (ii) (-2, 3), (iii) (0, 6).', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Enlarge each point about the origin by the scale factor given: (i) (3, 5) by 4, (ii) (9, 6) by 1/3, (iii) (2, 7) by 5.', marks: 6 },
          { id: 'a4', type: 'theory', title: 'A shape is enlarged by a scale factor of 6 and its side becomes 24 cm. What was the original side length?', marks: 2 },
        ],
      ),
    },
  ],
}