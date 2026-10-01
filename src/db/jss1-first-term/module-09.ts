import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Week 9 — 3D Geometry: Surface Area and Symmetry. Verified: a regular pentagon
// has 5 equal sides, 5 lines of symmetry and rotational symmetry of order 5; a
// cube has 9 planes of symmetry; the surface area of a cube of side 3 cm is
// 6 x 3^2 = 54 cm².
export const module09: Jss1ModuleData = {
  title: 'Module 9 — Week 9: 3D Geometry: Surface Area and Symmetry',
  lessons: [
    {
      title: 'Week 9 — 3D Geometry: Surface Area and Symmetry',
      duration: 45,
      content: `## Learning Objectives
- Find the surface area of common 3D shapes.
- Describe the symmetry of a regular polygon.
- Explain the difference between a line and a plane of symmetry.

## Surface Area of Prisms and Pyramids
**Surface area** is the total area of the outside faces. Add the areas of every
face, including the base and the sloping faces.

### Worked Example 1 — Cube
A cube has 6 equal square faces, so surface area = 6 x side².

For side 3 cm: 6 x 3² = 6 x 9 = **54 cm²**

### Worked Example 2 — Triangular prism
Surface area = 2 x (area of triangular cross-section) + (perimeter of
cross-section) x length.

### Worked Example 3 — Cylinder
Surface area = 2 x (pi x r²) + 2 x pi x r x h

Always check you have included **every** face. Students often forget the two
circular ends of a cylinder, or the back face of a prism.

## Symmetry in Polygons
A **regular polygon** has all sides equal and all angles equal.

- An equilateral triangle: 3 lines of symmetry, rotational symmetry of order 3
- A square: 4 lines of symmetry, order 4
- A regular pentagon: **5 lines of symmetry**, **rotational symmetry of order 5**
- A regular hexagon: 6 lines of symmetry, order 6

### Worked Example 4
A regular pentagon has 5 equal sides, 5 lines of symmetry and rotational
symmetry of order 5.

Copy a table for the triangle, square, pentagon and hexagon and complete it.

## Symmetry in 3D Shapes
Instead of a **line** of symmetry, a 3D shape has a **plane** of symmetry, which
divides the solid into two congruent (identical) parts.

- A cube has **9** planes of symmetry
- A cuboid has 3
- A sphere has infinitely many

## Common Mistakes
- Using the perimeter instead of the area of a face.
- Forgetting the base or the ends.
- Saying a shape has "9 lines of symmetry" for a 3D shape when it has planes.

## Practice
1. Surface area of a cube of side 4 cm.
2. Surface area of a cube of side 2.5 cm.
3. Lines of symmetry of a regular hexagon.
4. Planes of symmetry of a cube.`,
      quiz: quiz(
        'Week 9 Quiz — Surface Area and Symmetry',
        'Five questions on surface area and the symmetry of polygons and solids.',
        [
          mc(
            'What is the surface area of a cube with side 3 cm?',
            ['54 cm²', '27 cm²', '18 cm²', '9 cm²'],
            'A cube has 6 square faces: 6 x 3² = 6 x 9 = 54 cm².',
          ),
          fb(
            'How many planes of symmetry does a cube have? (Enter a number only)',
            '9',
            'A cube has 9 planes of symmetry: 3 through the centres of opposite faces and 6 through opposite edges.',
          ),
          mc(
            'How many lines of symmetry does a regular pentagon have?',
            ['5', '10', '4', '6'],
            'A regular pentagon has 5 equal sides and 5 lines of symmetry, and rotational symmetry of order 5.',
          ),
          mc(
            'In a cube, what is the rotational symmetry of order?',
            ['4', '5', '6', '8'],
            'It is order 4: rotating by 90°, 180°, 270° or 360° maps the cube onto itself.',
          ),
          mc(
            'Surface area = 6 x side². Find the surface area of a cube of side 2.5 cm.',
            ['37.5 cm²', '15 cm²', '6.25 cm²', '25 cm²'],
            '2.5² = 6.25, and 6 x 6.25 = 37.5 cm².',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 9.1 — Surface Area and Symmetry',
        'List every face you have included, so you can be sure none has been missed.',
        [
          { id: 'a1', type: 'theory', title: 'Find the surface area of each cube: (i) side 4 cm, (ii) side 2.5 cm, (iii) side 0.8 m.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'A prism has a triangular cross-section with base 6 cm, height 4 cm and perimeter 18 cm, and the prism is 10 cm long. Find its surface area.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Copy a table for the equilateral triangle, square, regular pentagon and regular hexagon. Give the number of equal sides, the number of lines of symmetry, and the order of rotational symmetry for each.', marks: 5 },
          { id: 'a4', type: 'theory', title: 'State the number of planes of symmetry for each solid: (i) cube, (ii) cuboid, (iii) triangular prism, (iv) sphere.', marks: 3 },
        ],
      ),
    },
  ],
}