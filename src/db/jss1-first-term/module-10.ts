import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Week 10 — Angles and Bearings. Verified: the exterior angle of a triangle
// equals the sum of the two opposite interior angles; interior angles of a
// triangle total 180°; bearings run clockwise from north between 000° and 360°
// and are written in three figures; a due east bearing is 090° and due south is
// 180°.
export const module10: Jss1ModuleData = {
  title: 'Module 10 — Week 10: Angles and Bearings',
  lessons: [
    {
      title: 'Week 10 — Angles and Bearings',
      duration: 45,
      content: `## Learning Objectives
- Find exterior and interior angles of a triangle.
- Use the angle sum of a triangle.
- Write and read a bearing.

## Interior and Exterior Angles of a Triangle
The **interior** angles are the three angles inside a triangle. They add up to
**180°**.

The **exterior** angle is the angle between one side and the extension of the
adjacent side. The key result is:

**Exterior angle = sum of the two interior opposite angles**

### Worked Example 1
In a triangle the interior angles are 50° and 60°.

The exterior angle opposite the third side is 50 + 60 = **110°**

**Check:** the third interior angle is 180 - 110 = 70°, and 50 + 60 + 70 = 180.

This is quicker than finding the missing interior angle first, because it needs
only one step.

### Worked Example 2
One exterior angle is 125° and the opposite interior angles are 60° and y.

60 + y = 125, so **y = 65°**

## Bearings
A **bearing** describes the direction of one object from another. It is an angle
measured **from north, in a clockwise direction**.

- The value runs from 0° to 360°.
- It is **always written with three figures**.
- North is 000°, East is 090°, South is 180°, West is 270°.

### Worked Example 3
A bearing of 090° means due east. A bearing of 180° means due south.

Because bearings are measured clockwise, they increase as you turn from north to
east. This is the opposite of anticlockwise angles on a diagram, so read the
protractor the correct way round.

### Worked Example 4
The bearing of B from A is 065°. Then the back bearing from B to A is found by
adding 180°: 065 + 180 = **245°**

## Common Mistakes
- Writing a bearing with only two figures, such as 90 instead of 090.
- Measuring anticlockwise instead of clockwise.
- Adding 180° instead of subtracting it (both give a valid back bearing only
  when you then reduce to three figures).

## Practice
1. Interior angles of a triangle are 65° and 47°. Find the third.
2. Find the exterior angle opposite the third angle above.
3. Write the bearing for due east and for due north.
4. A bearing is 045°. Find the back bearing.`,
      quiz: quiz(
        'Week 10 Quiz — Angles and Bearings',
        'Five questions on interior and exterior angles, the angle sum, and bearings.',
        [
          mc(
            'The interior angles of a triangle are 50° and 60°. Find the exterior angle opposite the third side.',
            ['110°', '70°', '180°', '130°'],
            'The exterior angle equals the sum of the two opposite interior angles: 50 + 60 = 110°.',
          ),
          fb(
            'Two interior angles of a triangle are 65° and 47°. Find the third interior angle. (Enter a number only)',
            '68',
            'Interior angles total 180°, so the third angle is 180 - 65 - 47 = 68.',
          ),
          mc(
            'How are bearings measured?',
            [
              'Clockwise from north',
              'Anticlockwise from north',
              'Clockwise from east',
              'Anticlockwise from east',
            ],
            'A bearing is measured clockwise from north, between 0° and 360°.',
          ),
          mc(
            'How is the bearing for due east written?',
            ['090°', '009°', '900°', '45°'],
            'Due east is a quarter turn clockwise from north, which is 90°, always written as three figures: 090°.',
          ),
          mc(
            'A bearing is 045°. What is the back bearing?',
            ['225°', '135°', '315°', '405°'],
            'Add 180° to the bearing: 045 + 180 = 225°.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 10.1 — Angles and Bearings',
        'Always write bearings with three figures, and check interior angles add to 180°.',
        [
          { id: 'a1', type: 'theory', title: 'Find the third interior angle of each triangle: (i) 65° and 47°, (ii) 30° and 80°, (iii) 105° and 40°.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'For each triangle in question 1, find the exterior angle opposite the third side, and check that it matches the angle you found.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Write down the three-figure bearing for each direction: north, south, east, west, north-east, south-west.', marks: 4 },
          { id: 'a4', type: 'subjective', title: 'The bearing of B from A is 038°. Find the back bearing from B to A, and explain how you found it.', marks: 4 },
        ],
        50,
        'mixed',
      ),
    },
  ],
}