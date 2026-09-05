import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 4 — Angles of Elevation and Depression',
  duration: 45,
  content: `# Week 4 — Angles of Elevation and Depression

## Learning Objectives
- Define angle of elevation and depression.
- Solve right-angled triangle problems using SOH CAH TOA and Pythagoras.
- Find heights and distances.

## Angle of Elevation
Angle between horizontal and line of sight when looking upward.

## Angle of Depression
Angle between horizontal and line of sight when looking downward.

## Right-Angled Triangles
SOH CAH TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.
Pythagoras: hyp^2 = adj^2 + opp^2.

## Worked Example 1
Aeroplane at height 200m, angle of elevation 60. Distance from observer:
sin 60 = 200/d -> d = 200/sin 60 = 230.9m.

## Worked Example 2
From tower, angle of depression of car 30, car 40m from tower. Height of tower:
tan 30 = h/40 -> h = 40 x tan 30 = 23.1m.

## Class Activity
1. Angle of elevation 30 from 80m away. Height of building = 80 x tan 30 = 46.2m.
2. Angle of depression 45, stone 120m away. Height = 120m.

## Assignment
1. Aeroplane 200m, angle 60. Find distance.
2. Tower, angle depression 30, car 40m away. Find height.

## Key Takeaways
- Elevation = looking up; depression = looking down.
- Use SOH CAH TOA for right triangles.
- Draw a diagram first.`,
  quiz: {
    title: 'Quiz W4 — Elevation & Depression',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Angle of elevation is formed when looking:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Upward', isCorrect: true }, { id: 'b', text: 'Downward', isCorrect: false }, { id: 'c', text: 'Sideways', isCorrect: false }, { id: 'd', text: 'Backward', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'Pythagoras theorem: hyp^2 =', questionType: 'fill_blank', correctAnswer: 'adj^2 + opp^2' },
      { id: 'q3', questionText: 'tan = ', questionType: 'fill_blank', correctAnswer: 'opp/adj' },
      { id: 'q4', questionText: 'True or false: A clinometer measures angles of elevation/depression.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q5', questionText: 'Height of building: angle 30, distance 80m, tan30=0.577:', questionType: 'fill_blank', correctAnswer: '46.2' },
    ],
  },
  assignment: {
    title: 'Assignment W4',
    description: 'Complete all questions.',
    dueDate: '2026-05-24T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Aeroplane 200m, angle 60. Find distance from observer.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Tower, angle depression 30, car 40m away. Find tower height.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Building angle 30 from 80m. Find height.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Define cardinal points.', marks: 5 },
    ],
  },
})
lessons.push({
  title: 'Week 5 — Bearing and Distances',
  duration: 45,
  content: `# Week 5 — Bearing and Distances

## Learning Objectives
- Define cardinal points and compass bearings.
- State three-figure bearings.
- Find distances and bearings using scale drawing.

## Cardinal Points
North, South, East, West. Secondary: NE, SE, SW, NW. Angle between N and W is 90, NW is midway (45 from N).

## Three-Figure Bearing
Number of degrees from north, measured clockwise, using three digits. Bearing of 150 stays 150; bearing of 15 is written 015.

## Worked Example
Bearing of X from Y is 247. Bearing of Y from X = 247 - 180 = 67.

## Scale Drawing
Ibadan 116km on bearing 27 from Lagos: use scale to draw, measure north/west components.

## Class Activity
1. State final direction after turns.
2. Find angle between directions.

## Assignment
1. Bearing of X from Y is 247. Find bearing of Y from X.
2. Scale drawing problems.

## Key Takeaways
- Bearing measured clockwise from north.
- Always use three digits (add leading zeros).
- Back bearing = bearing +/- 180.`,
  quiz: {
    title: 'Quiz W5 — Bearing',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Bearing is measured from:', questionType: 'fill_blank', correctAnswer: 'north' },
      { id: 'q2', questionText: 'Bearing of 15 degrees is written:', questionType: 'fill_blank', correctAnswer: '015' },
      { id: 'q3', questionText: 'Bearing of X from Y is 247. Bearing of Y from X:', questionType: 'multiple_choice', options: [{ id: 'a', text: '67', isCorrect: true }, { id: 'b', text: '247', isCorrect: false }, { id: 'c', text: '113', isCorrect: false }, { id: 'd', text: '427', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q4', questionText: 'Angle between North and West:', questionType: 'fill_blank', correctAnswer: '90' },
      { id: 'q5', questionText: 'True or false: Bearing is measured clockwise.', questionType: 'true_false', correctAnswer: 'true' },
    ],
  },
  assignment: {
    title: 'Assignment W5',
    description: 'Complete all questions.',
    dueDate: '2026-05-31T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Bearing of X from Y 247. Find bearing of Y from X.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Find angle between NE and N.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Ibadan 116km on bearing 27 from Lagos. How far north is Ibadan?', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Student walks 3km east then 5km on bearing 152. Find distance and bearing.', marks: 5 },
    ],
  },
})
export const module02: Jss2ModuleData = { title: 'Module 2 — Weeks 4-5: Elevation & Bearing', lessons }
