import type { Ss1ModuleData } from './types'

export const module02: Ss1ModuleData = {
  title: 'Module 2 — Weeks 3-4: Geometrical Construction',
  lessons: [
    {
      title: 'Week 3-4 — Construction of Lines, Angles, Triangles & Circles',
      duration: 75,
      content: `# Week 3-4 — Geometrical Construction

## Learning Objectives
By the end of this lesson you should be able to:
- Construct lines, bisect lines, construct and bisect angles using ruler and compass.
- Construct special angles (30 degrees, 45 degrees, 60 degrees, 90 degrees).
- Construct parallel and perpendicular lines.
- Construct triangles given: 3 sides, 2 angles + 1 side, 2 sides + included angle, 3 angles.
- Construct the circumcircle and incircle of a triangle.

## Introduction
**Geometrical construction** uses only a pair of compasses and a straightedge (ruler) to create exact drawings. These tools let us build precise angles and shapes — essential in engineering, architecture, and technical drawing.

## Basic Constructions
1. **Bisecting a line segment AB:** With centre A and radius > half AB, draw arcs above and below; repeat from B. The line through the two crossings bisects AB.
2. **Bisecting an angle:** With the vertex as centre, cut the arms at X and Y. With X and Y as centres and the same radius, draw arcs that cross. Join the vertex to the crossing.
3. **Perpendicular from a point to a line:** arcs from the point cut the line at two points; bisect the segment between them.
4. **Constructing 60°:** with centre O draw an arc; from the crossing point P, with the same radius, cut the first arc at Q. Angle POQ = 60°.
5. **Constructing 30°:** bisect 60°.
6. **Constructing 45°:** bisect 90°.
7. **Constructing 90°:** erect a perpendicular at a point on the line.
8. **Constructing 75°:** 60° + 15° (bisect the 30° to get 15° and add).
9. **Constructing 120°:** two 60° arcs side by side.

## Constructing Triangles

### Case 1: Three sides (SSS)
### Worked Example 1
Construct triangle ABC with AB = 6 cm, BC = 5 cm, AC = 4 cm.

**Solution**
1. Draw AB = 6 cm.
2. With centre A, radius 4 cm, draw an arc.
3. With centre B, radius 5 cm, draw another arc cutting the first at C.
4. Join AC and BC. ABC is the required triangle.

### Case 2: Two sides and the included angle (SAS)
### Worked Example 2
Construct triangle PQR with PQ = 7 cm, angle Q = 60°, QR = 5 cm.

**Solution**
1. Draw PQ = 7 cm.
2. At Q, construct angle 60°.
3. Along the new ray, mark QR = 5 cm.
4. Join PR.

### Case 3: Two angles and one side (ASA/AAS)
### Worked Example 3
Construct triangle XYZ with XY = 5 cm, angle X = 45°, angle Y = 60°.

**Solution**
1. Draw XY = 5 cm.
2. At X construct 45°, at Y construct 60°.
3. The two rays meet at Z.

## Circumcircle of a Triangle
The circle that passes through all three vertices. Its centre is the point where the **perpendicular bisectors** of the sides meet (the circumcentre).

### Worked Example 4
Construct the circumcircle of triangle ABC (AB = 6 cm, BC = 5 cm, AC = 4 cm).

**Solution**
1. Construct triangle ABC.
2. Bisect AB and BC — the bisectors meet at O.
3. With centre O and radius OA, draw the circle. It passes through A, B and C.

## Incircle of a Triangle
The circle that touches all three sides. Its centre is where the **angle bisectors** meet (the incentre); the radius is the perpendicular distance to any side.

## Loci
A **locus** is the set of all points that satisfy a given condition:
- Locus of points at distance r from point P → a circle.
- Locus of points equidistant from two points → the perpendicular bisector.
- Locus of points equidistant from two lines → the angle bisector.

## Class Activity
Essential Mathematics SS1, Page 312, Ex 21.2, Nos 1 & 2; Page 316, Ex 21.3, No 1 (a, b, c).

## Assignment
Essential Mathematics SS1, Page 312, Ex 21.2, Nos 3 & 5; Page 316, Ex 21.3, Nos 2, 4, 5; Page 320, Ex 21.4, No 1.

## Summary — Key Points
- Only a **compass and straightedge** are allowed — no measuring with a protractor.
- Bisect a segment → perpendicular bisector; bisect an angle → angle bisector.
- **60°, 30°, 45°, 90°** are the basic constructible angles; bisect to get more.
- Triangle cases: **SSS, SAS, ASA**.
- **Circumcircle:** perpendicular bisectors meet at the circumcentre.
- **Incircle:** angle bisectors meet at the incentre.`,
      quiz: {
        title: 'Quiz W3-4 — Geometrical Construction',
        description: '8 questions on constructions, special angles, triangles, and circles.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'To construct 30 degrees, you bisect which angle?', questionType: 'fill_blank', correctAnswer: '60 degrees' },
          { id: 'q2', questionText: 'True or false: You may use a protractor in geometrical construction.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q3', questionText: 'Constructing triangle ABC given AB = 5, BC = 6, AC = 7 cm is which case?', questionType: 'fill_blank', correctAnswer: 'SSS' },
          { id: 'q4', questionText: 'The circumcentre is the meeting point of the:', questionType: 'fill_blank', correctAnswer: 'perpendicular bisectors' },
          { id: 'q5', questionText: 'The incentre is the meeting point of the:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Medians', isCorrect: false }, { id: 'b', text: 'Angle bisectors', isCorrect: true }, { id: 'c', text: 'Altitudes', isCorrect: false }, { id: 'd', text: 'Perpendicular bisectors', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q6', questionText: 'The locus of points equidistant from two fixed points A and B is:', questionType: 'fill_blank', correctAnswer: 'perpendicular bisector of AB' },
          { id: 'q7', questionText: 'True or false: 90 degrees is constructed by erecting a perpendicular.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q8', questionText: 'Which construction case uses two sides and the included angle?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'SSS', isCorrect: false }, { id: 'b', text: 'SAS', isCorrect: true }, { id: 'c', text: 'ASA', isCorrect: false }, { id: 'd', text: 'AAA', isCorrect: false }], correctAnswer: 'b' },
        ],
      },
      assignment: {
        title: 'Assignment W3-4 — Geometrical Construction',
        description: 'Use only compass and ruler. Leave all construction arcs visible.',
        dueDate: '2026-11-19T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'subjective',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Construct triangle PQR with PQ = 7 cm, QR = 5 cm and RP = 6 cm. Construct the circumcircle and measure its radius.', marks: 8 },
          { id: 'a2', type: 'subjective', title: 'Using ruler and compass only, construct angles of 60 degrees, 30 degrees and 45 degrees on the same baseline.', marks: 6 },
          { id: 'a3', type: 'subjective', title: 'Construct triangle ABC with angle A = 45 degrees, angle B = 60 degrees and AB = 6 cm. Construct the incircle.', marks: 6 },
        ],
      },
    },
  ],
}