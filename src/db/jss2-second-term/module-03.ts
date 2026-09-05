import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 5 — Graphs (Continued) & Quantitative Reasoning',
  duration: 45,
  content: `# Week 5 — Graphs (Continued)

## Learning Objectives
- Interpret real-world graphs.
- Estimate values from graphs.

## Quantitative Reasoning
Read graphs to estimate values between plotted points.

## Class Activity
1. Meat temperature graph: estimate temp at 13min, time to reach 20C.

## Key Takeaways
- Graphs show trends and relationships.
- Estimate by interpolation between points.`,
  quiz: {
    title: 'Quiz W5 — Graphs Continued',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'True or false: Graphs can estimate values between points.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q2', questionText: 'A straight line graph shows:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'No relationship', isCorrect: false }, { id: 'b', text: 'Linear relationship', isCorrect: true }, { id: 'c', text: 'Random data', isCorrect: false }, { id: 'd', text: 'Only negative values', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'Interpolation means:', questionType: 'fill_blank', correctAnswer: 'estimating between points' },
      { id: 'q4', questionText: 'True or false: y-axis is horizontal.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q5', questionText: 'For y=2x+1, when x=3, y=', questionType: 'fill_blank', correctAnswer: '7' },
    ],
  },
  assignment: {
    title: 'Assignment W5',
    description: 'Graph interpretation.',
    dueDate: '2026-02-22T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Plot temperature data and estimate values.', marks: 10 },
      { id: 'a2', type: 'subjective', title: 'Draw graph of y=3x-6 and read values.', marks: 10 },
    ],
  },
})
lessons.push({
  title: 'Week 6 — Plane Figures/Shapes',
  duration: 45,
  content: `# Week 6 — Plane Figures/Shapes

## Learning Objectives
- Identify quadrilaterals and their properties.
- Identify triangles and their properties.

## Quadrilaterals
Square: 4 equal sides, 4 right angles, 4 lines symmetry.
Rectangle: 2 pairs equal sides, 4 right angles, 2 lines symmetry.
Parallelogram: opposite sides equal and parallel, opposite angles equal.
Rhombus: 4 equal sides, opposite angles equal, diagonals bisect at 90.
Trapezium: 1 pair parallel sides.

## Triangles
Right-angled: one 90 degree angle.
Isosceles: 2 equal sides, 2 equal angles, 1 line symmetry.
Equilateral: 3 equal sides, 3 equal angles, 3 lines symmetry.
Scalene: no equal sides, no equal angles, no symmetry.

## Class Activity
1. Properties of square, rectangle, parallelogram, rhombus.
2. Types of triangles.

## Assignment
1. Properties of trapezium, isosceles and scalene triangles.

## Key Takeaways
- Memorize properties of each shape.
- Symmetry lines help identify shapes.`,
  quiz: {
    title: 'Quiz W6 — Plane Shapes',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A square has __ lines of symmetry:', questionType: 'fill_blank', correctAnswer: '4' },
      { id: 'q2', questionText: 'True or false: A rhombus has 4 equal sides.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q3', questionText: 'An equilateral triangle has:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'No equal sides', isCorrect: false }, { id: 'b', text: '2 equal sides', isCorrect: false }, { id: 'c', text: '3 equal sides', isCorrect: true }, { id: 'd', text: '1 equal side', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q4', questionText: 'A trapezium has __ pair of parallel sides:', questionType: 'fill_blank', correctAnswer: '1' },
      { id: 'q5', questionText: 'True or false: A scalene triangle has no equal sides.', questionType: 'true_false', correctAnswer: 'true' },
    ],
  },
  assignment: {
    title: 'Assignment W6',
    description: 'Complete all questions.',
    dueDate: '2026-03-01T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'List properties of square, rectangle, parallelogram, rhombus.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'List properties of right-angled, isosceles, equilateral, scalene triangles.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'What is the area of a trapezium with parallel sides 30cm and 28cm, distance 15cm?', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Find area of square with diagonals product 66 cm^2.', marks: 5 },
    ],
  },
})
export const module03: Jss2ModuleData = { title: 'Module 3 — Weeks 5-6: Graphs (cont.) & Plane Shapes', lessons }
