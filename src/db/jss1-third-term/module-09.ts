import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 9 — Volume, Surface Area and Symmetry. Verified: a prism
// with cross-section area 10 cm^2 and length 5 cm has volume 50 cm^3; a
// triangular prism with base 4 cm, height 3 cm and length 6 cm has cross-section
// area 6 cm^2, volume 36 cm^3, and surface area 2(6) + (13)(6) = 12 + 78 = 90
// cm^2; a cube has 9 planes of symmetry.
export const module09: Jss1ModuleData = {
  title: 'Module 9 — Week 9: Volume, Surface Area and Symmetry',
  lessons: [
    {
      title: 'Week 9 — Volume, Surface Area and Symmetry',
      duration: 45,
      content: `## Learning Objectives
- Find the volume of a prism from its cross-section.
- Find the surface area of prisms, pyramids and cylinders.
- Describe the planes of symmetry of 3D shapes.

## Volume of Prisms
A **prism** is a 3D shape with the **same cross-section along its length**.

**Volume = area of the cross-section x length**

### Worked Example 1
A prism has a cross-sectional area of 10 cm² and is 5 cm long.

Volume = 10 x 5 = **50 cm³**

For a **triangular prism**, the cross-section is a triangle, so find its area
first.

### Worked Example 2
A triangular prism has a triangular base of 4 cm and height 3 cm, and a length of
6 cm.

Area of the triangle = 1/2 x 4 x 3 = **6 cm²**
Volume = 6 x 6 = **36 cm³**

## Surface Area
Surface area is the total area of every outside face, **including the ends**.

### Triangular Prism
Surface area = 2 x (area of the triangle) + (perimeter of the triangle) x length

### Worked Example 3
Using the prism above, the triangle has sides 4 cm, 3 cm and 5 cm (a 3-4-5 right
triangle), so its perimeter is 12 cm.

Surface area = 2(6) + 12 x 6 = 12 + 72 = **84 cm²**

### Cylinder
Surface area = 2 x pi x r² + 2 x pi x r x h

The two curved and two flat ends are all included.

### Pyramid
A pyramid has one **apex**, so its surface area is the base plus the **sloping**
faces. Students often forget the base.

## Symmetry in Three-Dimensional Shapes
Instead of a **line** of symmetry, a 3D shape has a **plane** of symmetry, which
divides the solid into two **congruent** (identical) parts.

A chair is symmetrical because a plane divides it into two matching halves.

- A **cube** has **9** planes of symmetry
- A **cuboid** has 3
- A **triangular prism** has 2
- A **sphere** has infinitely many

## Common Mistakes
- Forgetting that volume needs the area of the cross-section, not the length.
- Omitting the ends when calculating a surface area.
- Saying "lines" of symmetry for a 3D shape.

## Practice
1. Find the volume of a prism with cross-sectional area 12 cm² and length 7 cm.
2. Find the volume of a triangular prism with base 6 cm, height 4 cm and length 9 cm.
3. How many planes of symmetry does a cuboid have?
4. Why must a surface area calculation include the ends of a prism?`,
      quiz: quiz(
        'Week 9 Quiz — Volume, Surface Area and Symmetry',
        'Five questions on prism volumes, surface areas and planes of symmetry.',
        [
          mc(
            'A prism has a cross-sectional area of 12 cm^2 and a length of 7 cm. Find its volume.',
            ['84 cm³', '19 cm³', '7 cm³', '12 cm³'],
            'Volume = cross-section area x length = 12 x 7 = 84 cm³.',
          ),
          mc(
            'A triangular prism has base 6 cm, height 4 cm and length 9 cm. Find its volume.',
            ['108 cm³', '12 cm³', '216 cm³', '54 cm³'],
            'The cross-section is a triangle of area 1/2 x 6 x 4 = 12 cm², so the volume is 12 x 9 = 108 cm³.',
          ),
          fb(
            'How many planes of symmetry does a cube have? (Enter a number only)',
            '9',
            'A cube has 9 planes of symmetry: 3 through the centres of opposite faces and 6 through opposite edges.',
          ),
          mc(
            'Why must the ends of a prism be included in its surface area?',
            [
              'They are part of the outside surface of the solid',
              'They make the calculation easier',
              'They are not part of the solid',
              'They are only needed for the volume',
            ],
            'Surface area covers the entire outside of the shape, so every face, including the two ends, must be included.',
          ),
          mc(
            'What is a plane of symmetry?',
            [
              'A flat surface of a solid',
              'A surface that divides a solid into two congruent parts',
              'The diagram of a net',
              'The base of a prism',
            ],
            'A plane of symmetry splits a 3D shape into two identical, matching halves — the 3D equivalent of a line of symmetry.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 9.1 — Volume, Surface Area and Symmetry',
        'Find the cross-sectional area before any volume, and list every face you include in a surface area.',
        [
          { id: 'a1', type: 'theory', title: 'Find the volume of each prism from its cross-section: (i) area 12 cm^2, length 7 cm, (ii) area 30 m^2, length 5 m, (iii) area 8.5 cm^2, length 4 cm.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'A triangular prism has a triangular cross-section with base 6 cm and height 4 cm, and the prism is 9 cm long. Find (a) the area of the cross-section and (b) the volume.', marks: 5 },
          { id: 'a3', type: 'theory', title: 'State the number of planes of symmetry for each solid: (i) cube, (ii) cuboid, (iii) triangular prism, (iv) sphere.', marks: 6 },
          { id: 'a4', type: 'subjective', title: 'Explain the difference between a line of symmetry and a plane of symmetry, giving one example of each.', marks: 3 },
        ],
      ),
    },
  ],
}