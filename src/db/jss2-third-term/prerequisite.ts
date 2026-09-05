import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Pre-requisite Quiz — Second Term Review',
  duration: 30,
  content: `# Pre-requisite Quiz — Second Term Review

Before starting Third Term, you must pass this compulsory quiz reviewing Second Term work.

## Topics Covered
- Simple equations, linear inequalities
- Graphs
- Plane figures/shapes, scale drawing

## Instructions
- 30 minutes, 15 questions, need 70% to pass.`,
  quiz: {
    title: 'Pre-requisite Quiz — Second Term Review',
    description: 'Compulsory Second Term review quiz.',
    timeLimit: 1800, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'Solve 18-5f=2f+4:', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'pq2', questionText: 'If 9+x>17, x>', questionType: 'fill_blank', correctAnswer: '8' },
      { id: 'pq3', questionText: 'For y=3x-6, x=1, y=', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'pq4', questionText: 'Square lines of symmetry:', questionType: 'fill_blank', correctAnswer: '4' },
      { id: 'pq5', questionText: 'True or false: Rhombus has 4 equal sides.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq6', questionText: '6000m at 1cm:500m = __ cm:', questionType: 'fill_blank', correctAnswer: '12' },
      { id: 'pq7', questionText: 'Equilateral triangle has __ equal sides:', questionType: 'fill_blank', correctAnswer: '3' },
      { id: 'pq8', questionText: 'True or false: Reverse sign when dividing inequality by negative.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq9', questionText: 'Solve 2r>=5r+6:', questionType: 'fill_blank', correctAnswer: 'r <= -2' },
      { id: 'pq10', questionText: 'True or false: Scale drawing preserves angles.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq11', questionText: 'Area of trapezium (30cm,28cm,15cm):', questionType: 'fill_blank', correctAnswer: '435 cm2' },
      { id: 'pq12', questionText: 'A trapezium has __ pair of parallel sides:', questionType: 'fill_blank', correctAnswer: '1' },
      { id: 'pq13', questionText: 'True or false: y is the independent variable in linear graphs.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'pq14', questionText: '12x9 x 3x4 =', questionType: 'fill_blank', correctAnswer: '36x13' },
      { id: 'pq15', questionText: 'True or false: Scalene triangle has 2 equal sides.', questionType: 'true_false', correctAnswer: 'false' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — Second Term Review',
    description: 'Review problems from Second Term.',
    dueDate: '2026-05-05T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve: 18-5f=2f+4, 2r>=5r+6.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Properties of square, rectangle, rhombus.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Scale: 6000m at 1cm:500m.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Area of trapezium (30cm, 28cm, 15cm).', marks: 5 },
    ],
  },
})
export const prerequisiteModule: Jss2ModuleData = { title: 'Pre-requisite — Second Term Review', lessons }
