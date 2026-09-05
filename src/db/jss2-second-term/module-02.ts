import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 3 — Linear Inequalities',
  duration: 45,
  content: `# Week 3 — Linear Inequalities

## Learning Objectives
- Write inequalities from word statements.
- Solve and graph linear inequalities.
- Reverse inequality sign when multiplying/dividing by negative.

## Inequality Symbols
< (less than), > (greater than), <= (less than or equal), >= (greater than or equal).

## Graphing
x < 2: open circle at 2, arrow left. x >= -2: closed circle at -2, arrow right.

## Multiplying/Dividing by Negative
Reverse the sign. 3 < 5 -> (-3)/(-1) > (-5)/(-1) -> -3 > -5.

## Word Problems
"9 added to x is greater than 17" -> x > 8.
"Wage x, rent N8000, left with less than N20000" -> x < 28000.

## Class Activity
1. Sketch: x<2, x>3, x<=0, x>=-2.
2. Solve: 2x-8<=3, 20<=6+2x.

## Assignment
1. Solve: 6x-6>14 (integer values), 2r>=5r+6.
2. Word problems on inequalities.

## Key Takeaways
- Reverse sign when multiplying/dividing by negative.
- Open circle for < and >, closed for <= and >=.`,
  quiz: {
    title: 'Quiz W3 — Inequalities',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'If 9+x > 17, then x >', questionType: 'fill_blank', correctAnswer: '8' },
      { id: 'q2', questionText: 'Solve 2r>=5r+6:', questionType: 'fill_blank', correctAnswer: 'r <= -2' },
      { id: 'q3', questionText: 'True or false: When dividing by negative, keep the sign.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'If x < 2, the circle at 2 is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Open', isCorrect: true }, { id: 'b', text: 'Closed', isCorrect: false }, { id: 'c', text: 'Filled', isCorrect: false }, { id: 'd', text: 'None', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q5', questionText: 'Wage x, rent N8000, left < N20000:', questionType: 'fill_blank', correctAnswer: 'x < 28000' },
    ],
  },
  assignment: {
    title: 'Assignment W3',
    description: 'Complete all questions.',
    dueDate: '2026-02-08T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve: 6x-6>14 (integer values), 2r>=5r+6.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Sketch: x<2, x>3, x<=0, x>=-2.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Word problem: 9+x>17, find range of x.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Three times a number is not greater than 54. Find range.', marks: 5 },
    ],
  },
})
lessons.push({
  title: 'Week 4 — Graphs: Equations & Tables of Values',
  duration: 45,
  content: `# Week 4 — Graphs

## Learning Objectives
- Construct tables of values for linear equations.
- Plot graphs from tables.
- Read values from graphs.

## Table of Values
For y = 3x-6: x=-2->y=-12, x=-1->y=-9, x=0->y=-6, x=1->y=-3, x=2->y=0.

## Plotting
Cartesian plane: x-axis (horizontal), y-axis (vertical). Scale: 2cm to 1 unit.

## Class Activity
1. Table of values for y = 4x-5.
2. Draw graph of y = 4x-7 for x from -3 to +3.

## Assignment
1. Draw graph of 5x+2y-6=0 for x=-2,0,+2. Find where it cuts x-axis.

## Key Takeaways
- y is dependent, x is independent.
- Choose suitable scale for axes.`,
  quiz: {
    title: 'Quiz W4 — Graphs',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'For y=3x-6, when x=1, y=', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'q2', questionText: 'True or false: y is the independent variable.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q3', questionText: 'The Cartesian plane has:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'x-axis only', isCorrect: false }, { id: 'b', text: 'y-axis only', isCorrect: false }, { id: 'c', text: 'x and y axes', isCorrect: true }, { id: 'd', text: 'No axes', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q4', questionText: 'For y=4x-5, when x=0, y=', questionType: 'fill_blank', correctAnswer: '-5' },
      { id: 'q5', questionText: 'True or false: A graph shows relation between two variables.', questionType: 'true_false', correctAnswer: 'true' },
    ],
  },
  assignment: {
    title: 'Assignment W4',
    description: 'Complete all questions.',
    dueDate: '2026-02-15T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Table of values for y=4x-5 (x=-2 to 2).', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Draw graph of y=4x-7 for x=-3 to +3. Find y when x=2.5.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Draw graph of 5x+2y-6=0. Find where it cuts x-axis.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Plot temperature data: time 0-50min, temp -6 to 24C. Estimate temp at 13min.', marks: 5 },
    ],
  },
})
export const module02: Jss2ModuleData = { title: 'Module 2 — Weeks 3-4: Inequalities & Graphs', lessons }
