import type { Ss1ModuleData } from './types'

export const module05: Ss1ModuleData = {
  title: 'Module 5 — Week 8-9: Trigonometric Ratios',
  lessons: [
    {
      title: 'Week 8-9 — Trigonometric Ratios (SOHCAHTOA)',
      duration: 75,
      content: `# Week 8-9 — Trigonometric Ratios (SOHCAHTOA)

## Learning Objectives
By the end of this lesson you should be able to:
- Define sine, cosine and tangent of an acute angle in a right-angled triangle.
- Use the SOHCAHTOA mnemonic to solve for unknown sides and angles.
- Apply Pythagoras' theorem to find missing sides.
- Use trigonometric ratios for special angles (30 degrees, 45 degrees, 60 degrees).
- Solve problems involving angle of elevation and depression.
- Solve problems involving bearings.

## Introduction
Trigonometry comes from the Greek words "trigonon" (triangle) and "metron" (measure). It deals with the relationships between the sides and angles of triangles, especially right-angled triangles. Trigonometry is used in navigation, surveying, astronomy, engineering and construction.

## SOHCAHTOA
For a right-angled triangle with angle θ:
- **SOH:** sin θ = Opposite / Hypotenuse
- **CAH:** cos θ = Adjacent / Hypotenuse
- **TOA:** tan θ = Opposite / Adjacent

### Worked Example 1
In a right-angled triangle, the hypotenuse is 13 cm and the side opposite to θ is 5 cm. Find θ, the adjacent side, and sin θ, cos θ, tan θ.

**Solution**
sin θ = 5/13 ≈ 0.3846
θ = arcsin(0.3846) ≈ **22.6 degrees**
Adjacent = √(13² - 5²) = √(169 - 25) = √144 = **12 cm**
cos θ = 12/13 ≈ 0.9231
tan θ = 5/12 ≈ 0.4167

## Complementary Angles
Two angles are complementary if they add to 90 degrees.
Key identity: **sin θ = cos(90° - θ)** and **cos θ = sin(90° - θ)**

### Worked Example 2
Find: (a) sin 60° using cos 30°, (b) tan 70° using cot 20°.

**Solution**
(a) sin 60° = cos(90° - 60°) = **cos 30° = √3/2**
(b) tan 70° = cot(90° - 70°) = **cot 20°**

## Using Trigonometric Tables and Calculators

### Worked Example 3
Use tables or calculator to find:
(a) sin 73°    (b) cos 38.64°    (c) tan 50°

**Solution**
(a) sin 73° ≈ **0.9563**
(b) cos 38.64° ≈ **0.7807**
(c) tan 50° ≈ **1.1918**

## Pythagoras' Theorem
In a right-angled triangle: a² + b² = c² (where c is the hypotenuse).

### Worked Example 4
A ladder 10 m long leans against a wall. If the foot of the ladder is 6 m from the wall, how far up the wall does the ladder reach?

**Solution**
Let height = h. Then h² + 6² = 10²
h² + 36 = 100
h² = 64
h = **8 m**

## Special Angles
| Angle | sin | cos | tan |
|-------|-----|-----|-----|
| 30°   | 1/2 | √3/2 | 1/√3 |
| 45°   | √2/2 | √2/2 | 1 |
| 60°   | √3/2 | 1/2 | √3 |
| 90°   | 1   | 0   | undefined |

### Worked Example 5
Without using tables, find: (a) sin²30° + cos²60°, (b) tan 45° + sin 30° cos 60°.

**Solution**
(a) (1/2)² + (1/2)² = 1/4 + 1/4 = **1/2**
(b) 1 + (1/2)(1/2) = 1 + 1/4 = **5/4**

## Angle of Elevation and Depression
- **Elevation:** angle of sight above horizontal.
- **Depression:** angle of sight below horizontal.

### Worked Example 6
From the top of a cliff 40 m high, the angle of depression of a boat is 30 degrees. How far is the boat from the base of the cliff?

**Solution**
The angle of depression = angle of elevation from the boat = 30°.
tan 30° = 40/distance
distance = 40 / tan 30° = 40 / (1/√3) = 40√3 ≈ **69.3 m**

## Bearings
Bearings are measured clockwise from North. They are written as three-figure angles (e.g. 045°).

### Worked Example 7
From point A, point B is 100 m due East. From B, point C is 80 m on a bearing of 060°. Find the distance and bearing from A to C.

**Solution**
From B: bearing 060° means 60° clockwise from North = 30° from the East direction.
Using the cosine rule or coordinate geometry:
A is at origin (0,0), B is at (100,0).
From B, C is at distance 80 at bearing 060°:
C_x = 100 + 80 sin(60°) = 100 + 40√3 ≈ 169.3
C_y = 80 cos(60°) = 40
Distance AC = √(169.3² + 40²) ≈ √(28662 + 1600) ≈ √30262 ≈ **174 m**
Bearing from A to C = arctan(169.3/40) measured from North ≈ **77°** (077°)

## Class Activity
Essential Mathematics SS1, Page 233, Ex 17.1, Nos 1f, 2b, 3h, 4h, 12; Page 237, Ex 17.2, Nos 1, 2, 9, 6; Page 246, Ex 17.4, Nos 1g, 1h, 1j; Page 247, Ex 17.5, Nos 13, 14.

## Assignment
Essential Mathematics SS1, Page 233, Ex 17.1, Nos 1f, 2b, 3h, 4h & 12; Page 237, Ex 17.2, Nos 9 & 11; Page 247, Ex 17.5, No 25; Page 248, Ex 17.5, No 18.

## Summary — Key Points
- **SOHCAHTOA:** sin = opp/hyp, cos = adj/hyp, tan = opp/adj.
- **Complementary angles:** sin θ = cos(90° - θ).
- **Pythagoras:** a² + b² = c² in a right-angled triangle.
- **Special angles:** 30°, 45°, 60° have exact trig values — memorise them.
- **Bearings:** always measured clockwise from North, three figures.`,
      quiz: {
        title: 'Quiz W8-9 — Trigonometric Ratios',
        description: '8 questions on SOHCAHTOA, special angles, Pythagoras, elevation/depression, and bearings.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'In a right-angled triangle, the side opposite to angle θ is 8 and the hypotenuse is 10. Find sin θ.', questionType: 'fill_blank', correctAnswer: '0.8' },
          { id: 'q2', questionText: 'True or false: sin 30° = cos 60°.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q3', questionText: 'In a right-angled triangle with legs 3 and 4, the hypotenuse is:', questionType: 'fill_blank', correctAnswer: '5' },
          { id: 'q4', questionText: 'tan 45° =', questionType: 'fill_blank', correctAnswer: '1' },
          { id: 'q5', questionText: 'cos 60° =', questionType: 'fill_blank', correctAnswer: '0.5' },
          { id: 'q6', questionText: 'From the top of a 20 m building, the angle of depression of a car is 30 degrees. How far is the car from the building?', questionType: 'multiple_choice', options: [{ id: 'a', text: '20√3 m', isCorrect: true }, { id: 'b', text: '20 m', isCorrect: false }, { id: 'c', text: '10 m', isCorrect: false }, { id: 'd', text: '40 m', isCorrect: false }], correctAnswer: 'a' },
          { id: 'q7', questionText: 'True or false: SOHCAHTOA applies to all triangles.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q8', questionText: 'A bearing of 135° means:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Northeast', isCorrect: true }, { id: 'b', text: 'Southeast', isCorrect: false }, { id: 'c', text: 'Northwest', isCorrect: false }, { id: 'd', text: 'Southwest', isCorrect: false }], correctAnswer: 'a' },
        ],
      },
      assignment: {
        title: 'Assignment W8-9 — Trigonometry',
        description: 'Show all working. Use pi = 22/7 or exact values where needed.',
        dueDate: '2026-11-05T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'In a right-angled triangle ABC with angle A = 90 degrees, AB = 5 cm and BC = 13 cm. Find (i) AC, (ii) sin B, (iii) cos C.', marks: 6 },
          { id: 'a2', type: 'subjective', title: 'A ladder leans against a wall making an angle of 75 degrees with the ground. If the ladder is 10 m long, how high up the wall does it reach?', marks: 5 },
          { id: 'a3', type: 'subjective', title: 'From a point 50 m from the foot of a tower, the angle of elevation of the top is 30 degrees. Find the height of the tower.', marks: 5 },
          { id: 'a4', type: 'subjective', title: 'Find the exact values: (a) sin 60 + cos 30, (b) cos 45 x sin 30 x tan 60.', marks: 4 },
        ],
      },
    },
  ],
}