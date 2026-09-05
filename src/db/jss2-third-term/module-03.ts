import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 6 — Statistics: Data Presentation',
  duration: 45,
  content: `# Week 6 — Statistics: Data Presentation

## Learning Objectives
- Present data in rank order and frequency tables.
- Draw bar charts and pie charts.
- Interpret pie charts.

## Data Presentation
Rank order: arrange from highest to lowest.
Frequency table: shows how many times each value occurs.
Bar chart: data shown with rectangular bars.
Pie chart: circular chart divided into sectors; angle = (frequency/total) x 360.

## Worked Example
Grades: C, B, D, A, C, C, E, B, D, A, B, B, E, B, A, D, E, A, A, C. Total 20.
Frequency: A=5, B=5, C=4, D=3, E=3.
Pie angles: A=90, B=90, C=72, D=54, E=54.

## Class Activity
Present data in rank order and frequency table. Draw bar and pie charts.

## Assignment
Pie chart of 180 students. Maths=?, Geography=?, Science angle=?.
Number of students with B and D from 120-student pie chart.

## Key Takeaways
- Frequency table organizes raw data.
- Pie chart angles proportional to frequencies.`,
  quiz: {
    title: 'Quiz W6 — Statistics',
    description: '5 questions on data presentation.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Rank order means:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Highest to lowest', isCorrect: true }, { id: 'b', text: 'Random order', isCorrect: false }, { id: 'c', text: 'Alphabetical', isCorrect: false }, { id: 'd', text: 'Lowest to highest only', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'Angle for frequency 10 of total 50:', questionType: 'fill_blank', correctAnswer: '72' },
      { id: 'q3', questionText: 'Frequency table shows:', questionType: 'fill_blank', correctAnswer: 'how many times a value appears' },
      { id: 'q4', questionText: 'True or false: Pie chart uses rectangular bars.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q5', questionText: 'Mode of 3,5,5,7,5,9:', questionType: 'fill_blank', correctAnswer: '5' },
    ],
  },
  assignment: {
    title: 'Assignment W6',
    description: 'Complete all.',
    dueDate: '2026-06-07T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Present NGM Ex 5a data in rank order and frequency table.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Draw bar chart and pie chart for the data.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Pie chart 180 students: maths, geography, science angle.', marks: 5 },
      { id: 'a4', type: 'subjective', title: '120-student pie chart: students with B and D.', marks: 5 },
    ],
  },
})
lessons.push({
  title: 'Week 7 — Review & Periodic Test I',
  duration: 45,
  content: `# Week 7 — Review of First Half-Term and Periodic Test

## Topics
Angles, polygons, elevation/depression, bearing, statistics.

## Practice
Mixed questions on all first-half topics.`,
  quiz: {
    title: 'Quiz W7 — Half-Term Review',
    description: '8 mixed questions.',
    timeLimit: 900, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Angles on a straight line sum to:', questionType: 'fill_blank', correctAnswer: '180' },
      { id: 'q2', questionText: 'Sum of interior angles of 12-sided polygon:', questionType: 'fill_blank', correctAnswer: '1800' },
      { id: 'q3', questionText: 'True or false: Bearing is measured clockwise from north.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'tan = ', questionType: 'fill_blank', correctAnswer: 'opp/adj' },
      { id: 'q5', questionText: 'Bearing 15 written as:', questionType: 'fill_blank', correctAnswer: '015' },
      { id: 'q6', questionText: 'Vertically opposite angles are:', questionType: 'fill_blank', correctAnswer: 'equal' },
      { id: 'q7', questionText: 'Sum of exterior angles of polygon:', questionType: 'fill_blank', correctAnswer: '360' },
      { id: 'q8', questionText: 'True or false: Interior angles of regular pentagon are equal.', questionType: 'true_false', correctAnswer: 'true' },
    ],
  },
  assignment: {
    title: 'Assignment W7 — Review',
    description: 'Mixed review.',
    dueDate: '2026-06-14T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'a1', type: 'subjective', title: 'Construct 60 and 120 angles.', marks: 5 }, { id: 'a2', type: 'subjective', title: 'Sum of interior angles of 13-sided polygon.', marks: 5 }, { id: 'a3', type: 'subjective', title: 'Bearing: X from Y 247, find Y from X.', marks: 5 }, { id: 'a4', type: 'subjective', title: 'Building height angle 30 from 80m.', marks: 5 }],
  },
})
lessons.push({
  title: 'Week 8 — Probability I',
  duration: 45,
  content: `# Week 8 — Probability

## Learning Objectives
- Define probability of an event.
- Compute probability = required / possible outcomes.
- Use the complement rule.

Probability = number of required outcomes / number of possible outcomes.
Probability of certainty = 1; of impossibility = 0.
P(happens) + P(not happens) = 1.

## Worked Example
Box has 7 red, 8 white, 5 blue balls. Total 20.
P(white) = 8/20 = 2/5. P(red) = 7/20. P(blue or red) = 12/20 = 3/5. P(green) = 0.

## Class Activity
NGM Ex 21a Q1.

## Key

## Takeaways
- Probability from 0 to 1.
- Complement adds to 1.`,
  quiz: {
    title: 'Quiz W8 — Probability I',
    description: '5 questions.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'P(white) from 7 red, 8 white, 5 blue:', questionType: 'fill_blank', correctAnswer: '8/20 or 2/5' },
      { id: 'q2', questionText: 'P(impossible) =', questionType: 'fill_blank', correctAnswer: '0' },
      { id: 'q3', questionText: 'P(certain) =', questionType: 'fill_blank', correctAnswer: '1' },
      { id: 'q4', questionText: 'True or false: P(rain) + P(no rain) = 1.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q5', questionText: 'P(red or blue) from above:', questionType: 'fill_blank', correctAnswer: '12/20 or 3/5' },
    ],
  },
  assignment: {
    title: 'Assignment W8',
    description: 'Complete.',
    dueDate: '2026-06-21T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'a1', type: 'subjective', title: '7 red, 8 white, 5 blue. Find P(white), P(red), P(blue or red), P(green).', marks: 10 }, { id: 'a2', type: 'subjective', title: 'If P(rain tomorrow) = 9/12, find P(no rain).', marks: 10 }],
  },
})
export const module03: Jss2ModuleData = { title: 'Module 3 — Weeks 6-8: Statistics, Review & Probability', lessons }
