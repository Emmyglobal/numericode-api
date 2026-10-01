import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Week 8 — Area and Volume. Verified: parallelogram 10 x 6 = 60; trapezium with
// a=6, b=8, h=5 gives 1/2 x 14 x 5 = 35; a cube has F=6, V=8, E=12 and
// 6 + 8 - 12 = 2; a triangular prism with cross-section area 1/2 x 6 x 4 = 12
// and length 10 has volume 120.
export const module08: Jss1ModuleData = {
  title: 'Module 8 — Week 8: Area and Volume',
  lessons: [
    {
      title: 'Week 8 — Area and Volume',
      duration: 50,
      content: `## Learning Objectives
- Find the area of a parallelogram and a trapezium.
- Use Euler's formula for 3D shapes.
- Find the volume of a prism from its cross-section.

## Area of a Parallelogram
**Area of a parallelogram = base x height**

The height is the **perpendicular** distance, not the slanted side.

### Worked Example 1
Base 10 cm, height 6 cm.

Area = 10 x 6 = **60 cm²**

## Area of a Trapezium
**Area of a trapezium = 1/2 x (a + b) x h**

where a and b are the two parallel sides and h is the perpendicular height.

### Worked Example 2
The parallel sides are 6 cm and 8 cm and the height is 5 cm.

Area = 1/2 x (6 + 8) x 5 = 1/2 x 14 x 5 = **35 cm²**

## Euler's Formula
Euler's formula describes the relationship between the faces, vertices and edges
of a **polyhedron** (a 3D shape with flat polygonal faces).

**F + V - E = 2**

- **F** = number of faces (flat surfaces)
- **V** = number of vertices (corners)
- **E** = number of edges (where two faces meet)

### Worked Example 3 — Cube
A cube has 6 faces, 8 vertices and 12 edges.

F + V - E = 6 + 8 - 12 = **2**

The formula holds, so the cube is a valid polyhedron. Test any shape with it.

## Volume of Prisms
A **prism** is a 3D shape with the same 2D cross-section all the way along its
length. A cuboid is a rectangular prism.

**Volume = area of the cross-section x length**

### Worked Example 4 — Triangular prism
The triangular cross-section has base 6 cm and height 4 cm.

Area of triangle = 1/2 x 6 x 4 = **12 cm²**

If the prism is 10 cm long:

Volume = 12 x 10 = **120 cm³**

Always find the area of the cross-section first — that is the step students miss.

## Common Mistakes
- Using the slanted side instead of the perpendicular height.
- Forgetting the 1/2 in the trapezium or triangle formula.
- Multiplying length by width instead of using the cross-section for a prism.
- Writing cm² for a volume.

## Practice
1. Parallelogram with base 12 cm and height 5 cm.
2. Trapezium with parallel sides 5 cm and 9 cm and height 6 cm.
3. Check Euler's formula on a cuboid (F=6, V=8, E=12).
4. Triangular prism whose cross-section has base 8 cm, height 3 cm, and length 12 cm.`,
      quiz: quiz(
        'Week 8 Quiz — Area and Volume',
        'Five questions on parallelograms, trapezia, Euler\'s formula and prism volume.',
        [
          mc(
            'Find the area of a parallelogram with base 10 cm and height 6 cm.',
            ['60 cm²', '16 cm²', '32 cm²', '120 cm²'],
            'Area = base x height = 10 x 6 = 60 cm².',
          ),
          fb(
            'A trapezium has parallel sides of 6 cm and 8 cm and a height of 5 cm. Find its area. (Give the number only)',
            '35',
            'Area = 1/2 x (a + b) x h = 1/2 x (6 + 8) x 5 = 1/2 x 14 x 5 = 35.',
          ),
          mc(
            "Euler's formula is written F + V - E = 2. What does E stand for?",
            ['The number of edges', 'The number of equal faces', 'The exterior angle', 'The edge length'],
            'E is the number of edges, where two faces meet. F is faces and V is vertices.',
          ),
          mc(
            'A cube has 6 faces, 8 vertices and 12 edges. What is F + V - E?',
            ['2', '4', '26', '0'],
            '6 + 8 - 12 = 2, which confirms the formula holds for a cube.',
          ),
          mc(
            'A prism has a cross-sectional area of 12 cm² and a length of 10 cm. Find its volume.',
            ['120 cm³', '22 cm³', '60 cm³', '1.2 cm³'],
            'Volume = cross-section area x length = 12 x 10 = 120 cm³.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 8.1 — Area and Volume',
        'Show the formula you use for every part, and give each answer with its correct unit.',
        [
          { id: 'a1', type: 'theory', title: 'Find the area of each parallelogram: (i) base 12 cm, height 5 cm, (ii) base 7.5 m, height 4 m, (iii) base 9 cm, height 11 cm.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Find the area of each trapezium: (i) parallel sides 5 cm and 9 cm, height 6 cm, (ii) parallel sides 10 m and 14 m, height 8 m.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'For a triangular prism whose cross-section has base 8 cm and height 3 cm, and whose length is 12 cm, find the area of the cross-section and then the volume of the prism.', marks: 5 },
          { id: 'a4', type: 'theory', title: 'A polyhedron has 8 faces and 12 edges. Use Euler\'s formula to find its number of vertices.', marks: 3 },
        ],
      ),
    },
  ],
}