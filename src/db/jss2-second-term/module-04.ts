import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 7 — Review of First Half-Term',
  duration: 45,
  content: `# Week 7 — Review of First Half-Term

## Topics
Simple equations, inequalities, graphs, plane shapes.

## Practice
1. Solve equations and inequalities.
2. Identify plane shapes and properties.`,
  quiz: {
    title: 'Quiz W7 — Half-Term Review',
    description: '8 mixed questions.',
    timeLimit: 900, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Solve 18-5f=2f+4:', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q2', questionText: 'If 9+x>17, x>', questionType: 'fill_blank', correctAnswer: '8' },
      { id: 'q3', questionText: 'For y=3x-6, x=1, y=', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'q4', questionText: 'Square lines of symmetry:', questionType: 'fill_blank', correctAnswer: '4' },
      { id: 'q5', questionText: 'True or false: Rhombus has 4 equal sides.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q6', questionText: 'Equilateral triangle has __ equal sides:', questionType: 'fill_blank', correctAnswer: '3' },
      { id: 'q7', questionText: 'True or false: Reverse inequality sign when dividing by negative.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q8', questionText: 'Parallelogram opposite sides are:', questionType: 'fill_blank', correctAnswer: 'equal and parallel' },
    ],
  },
  assignment: {
    title: 'Assignment W7',
    description: 'Mixed review.',
    dueDate: '2026-03-08T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve: 18-5f=2f+4, 2r>=5r+6.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Sketch inequalities: x<2, x>3, x<=0.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Properties of square, rectangle, rhombus.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Types of triangles and their properties.', marks: 5 },
    ],
  },
})
lessons.push({
  title: 'Week 8 — Scale Drawing of Length and Distances',
  duration: 45,
  content: `# Week 8 — Scale Drawing

## Learning Objectives
- Understand scale as a ratio.
- Convert between actual and scale lengths.
- Apply scale drawing to solve problems.

## Scale
Scale = length on drawing / corresponding actual length.
1cm to 500m: 6000m runway = 6000/500 = 12cm on drawing.

## Applications
Engineers, architects, surveyors use scale drawings.

## Class Activity
1. Runway 6000m at 1cm:500m. Length on drawing?
2. Object 450m at 1cm:100m. Length on drawing?

## Assignment
1. Scale problems from NGM.

## Key Takeaways
- Scale is a ratio (drawing:actual).
- All lengths in proportion, all angles equal.`,
  quiz: {
    title: 'Quiz W8 — Scale Drawing',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '6000m at 1cm:500m = __ cm on drawing:', questionType: 'fill_blank', correctAnswer: '12' },
      { id: 'q2', questionText: 'True or false: Scale is a ratio.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q3', questionText: '450m at 1cm:100m = __ cm:', questionType: 'multiple_choice', options: [{ id: 'a', text: '4.5', isCorrect: true }, { id: 'b', text: '45', isCorrect: false }, { id: 'c', text: '450', isCorrect: false }, { id: 'd', text: '0.45', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q4', questionText: 'Scale drawing preserves:', questionType: 'fill_blank', correctAnswer: 'angles' },
      { id: 'q5', questionText: 'True or false: Architects use scale drawings.', questionType: 'true_false', correctAnswer: 'true' },
    ],
  },
  assignment: {
    title: 'Assignment W8',
    description: 'Complete all questions.',
    dueDate: '2026-03-15T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Runway 6000m at 1cm:500m. Find drawing length.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Object 450m at 1cm:100m. Find drawing length.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'State 3 uses of scale drawing.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Scale 1cm:10m. Actual 75m = ? cm on drawing.', marks: 5 },
    ],
  },
})
export const module04: Jss2ModuleData = { title: 'Module 4 — Weeks 7-8: Review & Scale Drawing', lessons }
