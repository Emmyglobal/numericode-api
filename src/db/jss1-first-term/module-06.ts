import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Week 6 — Geometry: Quadrilaterals and Circles. Verified: pi = circumference /
// diameter; 1 km is about 5/8 of a mile so km->miles uses 5/8 and miles->km uses
// 8/5; a circle of diameter 7 cm has circumference 3.14 x 7 = 21.98 cm; a
// rectangle with unequal opposite sides is a general quadrilateral, not a
// parallelogram.
export const module06: Jss1ModuleData = {
  title: 'Module 6 — Week 6: Geometry: Quadrilaterals and Circles',
  lessons: [
    {
      title: 'Week 6 — Geometry: Quadrilaterals and Circles',
      duration: 45,
      content: `## Learning Objectives
- Place a quadrilateral correctly in the hierarchy of quadrilaterals.
- Work out the circumference of a circle.
- Convert between kilometres and miles.

## Hierarchy of Quadrilaterals
A **quadrilateral** is any four-sided polygon. Quadrilaterals have different
properties — equal sides, equal angles, or pairs of parallel sides — so they are
arranged in a **hierarchy** from general to specific:

Quadrilateral
→ Trapezium (one pair of parallel sides)
→ Parallelogram (two pairs of parallel sides)
→ Rhombus (all sides equal)
→ Rectangle (four right angles)
→ Square (all sides equal and all angles right)

Each step adds one extra property. A square satisfies every condition, so it
belongs at the bottom.

**Watch out:** the trapezium of the UK is the "trapezoid" of the USA — exactly
one pair of parallel sides. Always check the note's wording.

## The Circumference of a Circle
Complete a table of diameter and circumference for several circles and you will
find the answers keep giving the same ratio: circumference to diameter is always
about **3.14**.

So **pi = circumference / diameter**, and therefore:

**circumference = 3.14 x diameter**

### Worked Example 1
A circle has diameter 7 cm.

Circumference = 3.14 x 7 = **21.98 cm**

Perimeter is the total distance around the outside, so for a circle the
perimeter and the circumference are the same thing. For a compound shape, add
every outer edge.

## Miles and Kilometres
One kilometre is about **5/8** of a mile.

- kilometres to miles: multiply by **5/8**
- miles to kilometres: multiply by **8/5** (or divide by 5/8)

### Worked Example 2
Convert 40 km to miles: 40 x 5/8 = **25 miles**

## Common Mistakes
- Using the diameter where the radius is needed.
- Adding the areas of the holes of a compound shape instead of subtracting them.
- Converting in the wrong direction — check whether the unit you are multiplying
  by is bigger or smaller than the unit you started with.

## Practice
1. Which properties must a rhombus have?
2. Find the circumference of a circle with diameter 10 cm.
3. Convert 64 km to miles.
4. Convert 40 miles to km.`,
      quiz: quiz(
        'Week 6 Quiz — Quadrilaterals and Circles',
        'Five questions on the quadrilateral hierarchy, circumference, and miles and kilometres.',
        [
          mc(
            'Which statement about the hierarchy of quadrilaterals is correct?',
            [
              'A square is also a rectangle and a rhombus',
              'A square is only a square',
              'A rectangle always has four equal sides',
              'A rhombus has one pair of parallel sides',
            ],
            'A square has four equal sides and four right angles, so it satisfies every condition of a rhombus and of a rectangle too.',
          ),
          fb(
            'Find the circumference of a circle with diameter 10 cm, using 3.14 for pi. (Give the number only)',
            '31.4',
            'Circumference = 3.14 x diameter = 3.14 x 10 = 31.4 cm.',
          ),
          mc(
            'What is pi, written as a ratio?',
            [
              'pi = circumference / diameter',
              'pi = diameter / circumference',
              'pi = area / radius',
              'pi = radius / circumference',
            ],
            'pi compares the circumference to the diameter: pi = circumference / diameter, which is always about 3.14.',
          ),
          mc(
            'One kilometre is about 5/8 of a mile. How do you convert 40 km into miles?',
            [
              'Multiply by 5/8, giving 25 miles',
              'Multiply by 8/5, giving 64 miles',
              'Multiply by 5/8, giving 64 miles',
              'Divide by 5/8, giving 25 miles',
            ],
            'To go from km to miles you multiply by 5/8: 40 x 5/8 = 200/8 = 25 miles.',
          ),
          mc(
            'Convert 40 miles to kilometres.',
            ['64 km', '25 km', '160 km', '32 km'],
            'To go from miles to km you multiply by 8/5: 40 x 8/5 = 320/5 = 64 km.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 6.1 — Quadrilaterals and Circles',
        'Use 3.14 for pi throughout, and state the radius or diameter you used in every circle question.',
        [
          { id: 'a1', type: 'theory', title: 'Copy the hierarchy of quadrilaterals and write down the extra property added at each step from quadrilateral to square.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Find the circumference of each circle, giving answers to two decimal places: (i) diameter 4 cm, (ii) diameter 15 cm, (iii) radius 6 cm.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Convert each distance to miles: (i) 24 km, (ii) 80 km, (iii) 12.8 km.', marks: 4 },
          { id: 'a4', type: 'theory', title: 'Convert each distance to kilometres: (i) 15 miles, (ii) 50 miles, (iii) 8 miles.', marks: 4 },
        ],
      ),
    },
  ],
}