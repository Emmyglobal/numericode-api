import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 1 — Revision: Statistics, Angles & Pie Charts',
  duration: 45,
  content: `# Week 1 — Revision: Statistics, Angles & Pie Charts

## Learning Objectives
- Calculate mean, median, mode and range from a frequency table.
- Identify types of angles and use angle facts (straight line, triangle, quadrilateral).
- Convert data into a pie chart using (frequency / total) x 360.

## Introduction
This week revises three SS1 topics you will use all year: statistics, angles and pie charts. Master these now — they appear in WAEC and NECO every year.

## Statistics
**Mean** = sum of (value x frequency) / total frequency.
**Median** = middle value when data is ordered.
**Mode** = most frequent value.
**Range** = highest - lowest.

### Worked Example 1
Ages of children in an orphanage:
| Age (years) | 5 | 6 | 7 | 8 | 9 |
| Frequency   | 2 | 3 | 5 | 3 | 1 |

Total children = 2 + 3 + 5 + 3 + 1 = 14.
Mean = (5x2 + 6x3 + 7x5 + 8x3 + 9x1) / 14 = (10 + 18 + 35 + 24 + 9) / 14 = 96 / 14 = 6.9 years.
Median: the 7th and 8th values (ordered) are both 7, so median = 7.
Mode = 7 (appears 5 times, most frequent).
Range = 9 - 5 = 4.

## Types of Angles
- Acute: less than 90 degrees
- Right: exactly 90 degrees
- Obtuse: between 90 and 180 degrees
- Straight: exactly 180 degrees
- Reflex: greater than 180 degrees

### Angle Facts
- Angles on a straight line sum to 180 degrees.
- Angles at a point sum to 360 degrees.
- Angles in a triangle sum to 180 degrees.
- Angles in a quadrilateral sum to 360 degrees.
- Vertically opposite angles are equal.
- Corresponding angles are equal (parallel lines).
- Alternate angles are equal (parallel lines).

## Pie Chart
Angle for each category = (frequency / total frequency) x 360 degrees.

### Worked Example 2
Student grades: A=15, B=12, C=20, D=10, E=3. Total = 60.
Angle A = (15/60) x 360 = 90 degrees.
Angle B = (12/60) x 360 = 72 degrees.
Angle C = (20/60) x 360 = 120 degrees.
Angle D = (10/60) x 360 = 60 degrees.
Angle E = (3/60) x 360 = 18 degrees.
Check: 90 + 72 + 120 + 60 + 18 = 360 degrees.

## Class Activity
1. Ten students walk to school. Distances (km): 1,1,1,1,2,2,3,4,5,5. Find mean, median, mode, range.
2. Find the lettered angles in a diagram where one angle is 65 degrees on a straight line.
3. Draw a pie chart for: Comedy=20, Action=30, Romance=10, Drama=20, Sci-Fi=40.

## Assignment
1. Marks: 11(2), 12(1), 13(3), 14(6), 15(5), 16(3). Find (a) number of students, (b) mode, (c) median, (d) mean.
2. A pie chart shows 5 colours. Frequencies: Blue=3, Red=4, Green=5, Yellow=1, Black=2. Find each angle.

## Key Takeaways
- Mean uses all data; median uses position; mode uses frequency.
- Always check pie chart angles sum to 360.
- Angle facts are your tools — memorize the 5 key rules.`,
  quiz: {
    title: 'Quiz W1 — Revision',
    description: '5 questions on statistics, angles and pie charts.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The mean of 4, 6, 8, 10 is:', questionType: 'fill_blank', correctAnswer: '7' },
      { id: 'q2', questionText: 'True or false: The sum of angles in a quadrilateral is 360 degrees.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q3', questionText: 'In a pie chart, the angle for a category with frequency 10 out of 50 total is:', questionType: 'fill_blank', correctAnswer: '72 degrees' },
      { id: 'q4', questionText: 'The mode of 3,5,5,7,5,9 is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '3', isCorrect: false }, { id: 'b', text: '5', isCorrect: true }, { id: 'c', text: '7', isCorrect: false }, { id: 'd', text: '9', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q5', questionText: 'An angle of 120 degrees is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Acute', isCorrect: false }, { id: 'b', text: 'Right', isCorrect: false }, { id: 'c', text: 'Obtuse', isCorrect: true }, { id: 'd', text: 'Reflex', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment W1 — Revision',
    description: 'Complete all questions. Show your working.',
    dueDate: '2026-09-14T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Find the mean, median, mode and range of: 12, 15, 12, 18, 20, 15, 12.', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'A pie chart shows favourite subjects. Maths=12 students, English=8, Science=10, Arts=6. Total=36. Find the angle for each subject.', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Two angles on a straight line are 3x and 2x. Find x and each angle.', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'In triangle ABC, angle A=50, angle B=70. Find angle C.', marks: 5 },
    ],
  },
})
export const module01: Jss2ModuleData = { title: 'Module 1 — Week 1: Revision (Statistics, Angles, Pie Charts)', lessons }
