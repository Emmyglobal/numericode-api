import type { Ss1ModuleData } from './types'

export const module01: Ss1ModuleData = {
  title: 'Module 1 — Weeks 1-2: Mensuration (3D Shapes)',
  lessons: [
    {
      title: 'Week 1-2 — Surface Area and Volume of Solid Shapes',
      duration: 75,
      content: `# Week 1-2 — Surface Area and Volume of Solid Shapes

## Learning Objectives
By the end of this lesson you should be able to:
- Identify and describe 3-dimensional shapes: cube, cuboid, cylinder, cone, prism, pyramid, sphere.
- Calculate the total surface area and volume of cubes, cuboids, and cylinders.
- Calculate the curved surface area, total surface area, and volume of cones and pyramids.
- Calculate the surface area and volume of a frustum of a cone or pyramid.
- Solve word problems involving real-world 3D shapes (tanks, tins, etc.).

## Solid Shapes and Their Formulas
| Shape | Surface Area | Volume |
|-------|-------------|--------|
| Cube (side a) | 6a² | a³ |
| Cuboid (l, w, h) | 2(lw + lh + wh) | lwh |
| Cylinder (r, h) | 2πr(r + h) | πr²h |
| Cone (r, h, l) | πr(l + r) | (1/3)πr²h |
| Sphere (r) | 4πr² | (4/3)πr³ |
| Pyramid (base B, height h) | B + (1/2)P×l | (1/3)Bh |

### Worked Example 1
A cuboid has dimensions 8 cm x 5 cm x 4 cm. Find its surface area and volume.

**Solution**
Surface Area = 2(8x5 + 8x4 + 5x4) = 2(40 + 32 + 20) = 2(92) = **184 cm²**
Volume = 8 x 5 x 4 = **160 cm³**

### Worked Example 2
A cylindrical water tank has radius 1.4 m and height 2.5 m. Find the capacity in litres. Take π = 22/7.

**Solution**
Volume = πr²h = (22/7) x 1.4² x 2.5 = (22/7) x 1.96 x 2.5 = (22/7) x 4.9 = 22 x 0.7 = **15.4 m³**
1 m³ = 1000 litres → Capacity = **15,400 litres**

### Worked Example 3
A cone has base radius 7 cm and slant height 25 cm. Find its total surface area and volume.

**Solution**
First find vertical height: h = √(l² - r²) = √(625 - 49) = √576 = 24 cm
Total Surface Area = πr(l + r) = (22/7) x 7 x (25 + 7) = 22 x 32 = **704 cm²**
Volume = (1/3)πr²h = (1/3) x (22/7) x 49 x 24 = (1/3) x 22 x 7 x 24 = **1232 cm³**

### Worked Example 4
A sphere has radius 10.5 cm. Find its surface area and volume. Take π = 22/7.

**Solution**
Surface Area = 4πr² = 4 x (22/7) x 10.5² = 4 x (22/7) x 110.25 = 4 x 22 x 15.75 = **1386 cm²**
Volume = (4/3)πr³ = (4/3) x (22/7) x 10.5³ = (4/3) x (22/7) x 1157.625 = (4/3) x 22 x 165.375 = **4851 cm³**

## The Frustum
A **frustum** is the portion of a cone or pyramid that remains after cutting off the top by a plane parallel to the base.
- Volume of frustum = (1/3)πh(R² + Rr + r²) where R, r are the two radii.

### Worked Example 5
A bucket is a frustum of a cone with radii 10 cm (top) and 6 cm (bottom) and height 21 cm. Find its capacity. Take π = 22/7.

**Solution**
V = (1/3) x (22/7) x 21 x (10² + 10x6 + 6²) = 22 x (100 + 60 + 36) = 22 x 196 = **4312 cm³**

## Class Activity
Essential Mathematics SS1, Page 296, Ex 20.1, Nos 1, 2, 3; Page 300, Ex 20.2, Nos 1 & 4.

## Assignment
Essential Mathematics SS1, Page 296, Ex 20.1, Nos 7, 9, 12; Page 300, Ex 20.2, Nos 6, 8, 10.

## Summary — Key Points
- **Cuboid:** SA = 2(lw + lh + wh), V = lwh.
- **Cylinder:** SA = 2πr(r + h), V = πr²h.
- **Cone:** slant height l = √(r² + h²); V = (1/3)πr²h.
- **Sphere:** SA = 4πr², V = (4/3)πr³.
- **Frustum:** V = (1/3)πh(R² + Rr + r²).
- 1 m³ = 1000 litres — always convert units carefully.`,
      quiz: {
        title: 'Quiz W1-2 — Mensuration of Solid Shapes',
        description: '8 questions on surface area and volume of cubes, cuboids, cylinders, cones, spheres and frustums.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'A cube has side 4 cm. Its volume is:', questionType: 'fill_blank', correctAnswer: '64 cm^3' },
          { id: 'q2', questionText: 'A cuboid measures 6 x 4 x 3 cm. Its surface area is:', questionType: 'fill_blank', correctAnswer: '108 cm^2' },
          { id: 'q3', questionText: 'True or false: Volume of a cone = (1/3) x pi x r^2 x h.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q4', questionText: 'A cylinder has r = 7 cm, h = 10 cm. Its volume is (take pi = 22/7):', questionType: 'fill_blank', correctAnswer: '1540 cm^3' },
          { id: 'q5', questionText: 'The slant height of a cone with r = 3 cm and h = 4 cm is:', questionType: 'fill_blank', correctAnswer: '5 cm' },
          { id: 'q6', questionText: 'The surface area of a sphere of radius 7 cm is (take pi = 22/7):', questionType: 'multiple_choice', options: [{ id: 'a', text: '616 cm^2', isCorrect: true }, { id: 'b', text: '308 cm^2', isCorrect: false }, { id: 'c', text: '154 cm^2', isCorrect: false }, { id: 'd', text: '88 cm^2', isCorrect: false }], correctAnswer: 'a' },
          { id: 'q7', questionText: 'True or false: 1 m^3 = 10,000 litres.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q8', questionText: 'The volume of a frustum formula uses which combination of radii?', questionType: 'fill_blank', correctAnswer: 'R^2 + Rr + r^2' },
        ],
      },
      assignment: {
        title: 'Assignment W1-2 — Mensuration of Solid Shapes',
        description: 'Show all working. Use pi = 22/7 unless stated otherwise.',
        dueDate: '2026-11-12T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'An open rectangular water tank measures 2 m x 1.5 m x 1.2 m. Find (i) its capacity in litres, (ii) the area of metal sheet used (no lid).', marks: 7 },
          { id: 'a2', type: 'subjective', title: 'A cone has base radius 9 cm and vertical height 12 cm. Find its total surface area and volume.', marks: 7 },
          { id: 'a3', type: 'subjective', title: 'A solid hemisphere bowl has radius 21 cm. Find its curved surface area and volume.', marks: 6 },
        ],
      },
    },
  ],
}