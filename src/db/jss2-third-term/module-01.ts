import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 2 — Angles',
  duration: 45,
  content: `# Week 2 — Angles

## Learning Objectives
- Construct angles using compass and ruler.
- Apply angle facts: straight line, vertically opposite, triangle, quadrilateral.

## Constructing Angles
60 and 120: draw line AB, semi-circle, cut arc with compass from A, join to middle of diameter.
90 and 45: draw line AB, semi-circle, extend compass past radius, draw arcs from A and B, join intersections.
22.5: construct 90, bisect to 45, bisect to 22.5.
75: construct 60 and 15 side by side.
105: construct 60 and 45, or 90 and 15.

## Angle Facts
- Angles on a straight line sum to 180.
- Vertically opposite angles are equal.
- Angles in a quadrilateral sum to 360.
- Angles in a triangle sum to 180.

## Class Activity
1. Construct angles 60 and 120.
2. Construct angles 90 and 45.

## Assignment
1. Construct angles 45 and 90.
2. Construct angle 22.5.

## Key Takeaways
- Construction uses compass and ruler only.
- Bisection divides an angle into two equal parts.
- Memorize the angle facts.`,
  quiz: {
    title: 'Quiz W2 — Angles',
    description: '5 questions on angle facts and construction.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Angles on a straight line sum to:', questionType: 'fill_blank', correctAnswer: '180' },
      { id: 'q2', questionText: 'True or false: Vertically opposite angles are equal.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q3', questionText: 'Angles in a quadrilateral sum to:', questionType: 'fill_blank', correctAnswer: '360' },
      { id: 'q4', questionText: 'To construct 22.5, bisect 45 once. True or false?', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q5', questionText: 'Angles in a triangle sum to:', questionType: 'fill_blank', correctAnswer: '180' },
    ],
  },
  assignment: {
    title: 'Assignment W2',
    description: 'Complete all questions.',
    dueDate: '2026-05-10T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Construct angles 45 and 90 with compass and ruler.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Construct angle 22.5.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Two angles on a straight line are 3x and 2x. Find x and each angle.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'In a triangle, angle A=50, angle B=70. Find angle C.', marks: 5 },
    ],
  },
})
lessons.push({
  title: 'Week 3 — Polygons',
  duration: 45,
  content: `# Week 3 — Polygons

## Learning Objectives
- Define a polygon and regular polygon.
- Use formulas for interior and exterior angles.
- Solve problems on polygon angles.

## Polygon
A closed plane figure bounded by straight lines. Smallest is triangle (3 sides). Regular polygon has equal sides and angles.

## Formulas
- Sum of interior angles: S = (n - 2) x 180, where n = number of sides.
- Each interior angle of regular polygon = (n - 2) x 180 / n.
- Sum of exterior angles = 360.
- Each exterior angle of regular polygon = 360 / n.

## Worked Examples
1. Sum of interior angles of 12-sided polygon = (12-2) x 180 = 1800.
2. Sum of angles = 1440: (n-2) x 180 = 1440 -> n - 2 = 8 -> n = 10 sides.
3. Each interior angle 150: (n-2) x 180/n = 150 -> 180n - 360 = 150n -> 30n = 360 -> n = 12.
4. Sum of angles of polygon = 1980: n - 2 = 11 -> n = 13 sides.

## Quadrilateral Angles
Pentagon interior angles (y+25),(y+15),(y+20),(y+30),(y+40). Sum = 540.
5y + 130 = 540 -> y = 82. Angles: 107, 97, 102, 112, 122.

## Class Activity
1. Sum of interior angles of 13-sided polygon.
2. Each interior angle 160. Find sides.
3. Interior angles of pentagon (y+25)...(y+40). Find y.

## Assignment
1. Sum of angles = 2340. Find sides.
2. Irregular pentagon angles in ratio 3:5:6:7:9. Find all angles.

## Key Takeaways
- S = (n-2) x 180 for interior angles.
- Exterior angles always sum to 360.
- Regular polygon: all interior angles equal.`,
  quiz: {
    title: 'Quiz W3 — Polygons',
    description: '5 questions on polygon angles.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Sum of interior angles of 12-sided polygon:', questionType: 'fill_blank', correctAnswer: '1800' },
      { id: 'q2', questionText: 'Sum of exterior angles of any polygon:', questionType: 'fill_blank', correctAnswer: '360' },
      { id: 'q3', questionText: 'Sum of angles = 1440. Number of sides:', questionType: 'multiple_choice', options: [{ id: 'a', text: '8', isCorrect: false }, { id: 'b', text: '10', isCorrect: true }, { id: 'c', text: '12', isCorrect: false }, { id: 'd', text: '6', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q4', questionText: 'Each interior angle 150. Number of sides:', questionType: 'fill_blank', correctAnswer: '12' },
      { id: 'q5', questionText: 'True or false: A regular polygon has equal sides and angles.', questionType: 'true_false', correctAnswer: 'true' },
    ],
  },
  assignment: {
    title: 'Assignment W3',
    description: 'Complete all questions.',
    dueDate: '2026-05-17T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Sum of interior angles of 13-sided polygon.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Sum of angles = 2340. Find sides.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Pentagon angles (y+25)...(y+40). Find y and each angle.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Irregular pentagon angles in ratio 3:5:6:7:9. Find angles.', marks: 5 },
    ],
  },
})
export const module01: Jss2ModuleData = { title: 'Module 1 — Weeks 2-3: Angles & Polygons', lessons }
