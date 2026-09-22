import type { Ss1ModuleData } from './types'

export const module04: Ss1ModuleData = {
  title: 'Module 4 — Week 6: Circle Theorems',
  lessons: [
    {
      title: 'Week 6 — Circle and Its Properties',
      duration: 45,
      content: `# Week 6 — Circle and Its Properties

## Learning Objectives
By the end of this lesson you should be able to:
- Identify and define the parts of a circle: centre, radius, diameter, chord, arc, sector.
- State and apply circle theorems: angle at centre, angle at circumference, angles in the same segment, angle in a semicircle.
- Calculate the length of an arc and the area of a sector of a circle.
- Calculate the perimeter and area of a segment of a circle.

## Introduction
A circle is the set of all points at a fixed distance (the **radius**) from a fixed point (the **centre**). Circles appear everywhere in nature and engineering — wheels, gears, orbits, and many geometric designs.

## Parts of a Circle
- **Centre:** the fixed point.
- **Radius (r):** distance from centre to any point on the circle.
- **Diameter (d = 2r):** chord through the centre; longest chord.
- **Chord:** line segment joining any two points on the circle.
- **Arc:** part of the circumference.
- **Sector:** region bounded by two radii and an arc ("pizza slice").
- **Segment:** region between a chord and an arc.
- **Circumference:** perimeter of the circle = 2πr = πd.

## Circle Theorems

### Theorem 1: Angle at Centre = 2 × Angle at Circumference
The angle subtended at the centre is twice the angle subtended at the circumference by the same arc.

### Worked Example 1
In a circle with centre O, the angle at the centre ∠AOB = 100°. Find the angle at the circumference ∠ACB.

**Solution**
∠ACB = ∠AOB / 2 = 100° / 2 = **50°**

### Theorem 2: Angle in a Semircle is 90°
Any angle inscribed in a semicircle is a right angle.

### Theorem 3: Angles in the Same Segment are Equal
Angles subtended by the same arc at the circumference are equal.

### Theorem 4: Opposite Angles of a Cyclic Quadrilateral are Supplementary
If ABCD is a cyclic quadrilateral, then ∠A + ∠C = 180° and ∠B + ∠D = 180°.

## Arc Length and Area of a Sector
For a circle of radius r with sector angle θ (in degrees):
- **Arc length = (θ/360) × 2πr**
- **Area of sector = (θ/360) × πr²**

### Worked Example 2
A sector has radius 21 cm and angle 60°. Find (a) the arc length, (b) the area. Take π = 22/7.

**Solution**
(a) Arc length = (60/360) × 2 × (22/7) × 21 = (1/6) × 2 × 22 × 3 = (1/6) × 132 = **22 cm**
(b) Area = (60/360) × (22/7) × 21² = (1/6) × (22/7) × 441 = (1/6) × 22 × 63 = (1/6) × 1386 = **231 cm²**

### Worked Example 3
A sector of a circle has area 280 cm² and radius 21 cm. Find the angle θ. Take π = 22/7.

**Solution**
Area = (θ/360) × πr²
280 = (θ/360) × (22/7) × 21 × 21 = (θ/360) × (22 × 63) = (θ/360) × 1386
280 = 1386θ/360
θ = 280 × 360 / 1386 = 100800 / 1386 = **72.7°** (72 8/11°)

## Perimeter of a Sector
Perimeter = 2r + arc length

## Segment of a Circle
A segment is the region between a chord and the arc.
- **Area of segment** = Area of sector - Area of triangle
- **Length of chord** = 2r sin(θ/2)

### Worked Example 4
A chord of a circle of radius 10 cm subtends an angle of 120° at the centre. Find: (a) the length of the chord, (b) the area of the segment.

**Solution**
(a) Chord = 2r sin(θ/2) = 2(10) sin(60°) = 20 × (√3/2) = **10√3 ≈ 17.32 cm**
(b) Area of sector = (120/360) × π × 10² = (1/3) × π × 100 = 100π/3
    Area of triangle = (1/2) × r² × sin θ = (1/2) × 100 × sin 120° = (1/2) × 100 × (√3/2) = 25√3
    Area of segment = 100π/3 - 25√3 ≈ 104.72 - 43.30 = **61.42 cm²**

## Class Activity
Essential Mathematics SS1, Page 284, Ex 19.3, No 1c & 3; Page 288, Ex 19.4, No 1c & 3.

## Assignment
Essential Mathematics SS1, Page 284, Ex 19.3, Nos 8 & 16; Page 288, Ex 19.4, Nos 1d & 4; Page 292, Ex 19.5, Nos 8 & 9.

## Summary — Key Points
- **Angle at centre = 2 × angle at circumference** standing on the same arc.
- **Angle in a semicircle = 90°**.
- **Angles in the same segment are equal.**
- **Opposite angles in a cyclic quadrilateral = 180°**.
- Arc length = (θ/360) × 2πr; Area of sector = (θ/360) × πr².
- Area of segment = Area of sector − Area of triangle.`,
      quiz: {
        title: 'Quiz W6 — Circle Theorems',
        description: '8 questions on circle theorems, arc length, sector area, and segments.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'The angle at the centre is 80 degrees. The angle at the circumference is:', questionType: 'fill_blank', correctAnswer: '40 degrees' },
          { id: 'q2', questionText: 'True or false: The angle in a semicircle is always 90 degrees.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q3', questionText: 'A sector has radius 14 cm and angle 45 degrees. Its arc length is (take pi = 22/7):', questionType: 'fill_blank', correctAnswer: '11 cm' },
          { id: 'q4', questionText: 'The area of a sector with radius 7 cm and angle 90 degrees (take pi = 22/7):', questionType: 'fill_blank', correctAnswer: '38.5', explanation: '(90/360) x (22/7) x 49 = 38.5' },
          { id: 'q5', questionText: 'True or false: Opposite angles of a cyclic quadrilateral are equal.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q6', questionText: 'A chord subtends 60 degrees at the centre of a circle of radius 10 cm. The chord length is:', questionType: 'fill_blank', correctAnswer: '10 cm' },
          { id: 'q7', questionText: 'Which circle theorem states: angle at centre = 2 x angle at circumference?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Angle in a semicircle', isCorrect: false }, { id: 'b', text: 'Angle at the centre', isCorrect: true }, { id: 'c', text: 'Angles in same segment', isCorrect: false }, { id: 'd', text: 'Cyclic quadrilateral theorem', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q8', questionText: 'Area of sector = (theta/360) x pi x r^2. Find the area of a sector with r = 6 and theta = 120.', questionType: 'fill_blank', correctAnswer: '12pi' },
        ],
      },
      assignment: {
        title: 'Assignment W6 — Circle Theorems',
        description: 'Show all working. Use pi = 22/7 where not otherwise stated.',
        dueDate: '2026-10-29T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'In a circle of radius 21 cm, an arc subtends an angle of 30 degrees at the centre. Find the arc length and the area of the sector.', marks: 7 },
          { id: 'a2', type: 'subjective', title: 'A chord of a circle of radius 10 cm subtends an angle of 120 degrees at the centre. Find the area of the minor segment.', marks: 8 },
          { id: 'a3', type: 'subjective', title: 'Prove that the angle in a semicircle is a right angle.', marks: 5 },
        ],
      },
    },
  ],
}
