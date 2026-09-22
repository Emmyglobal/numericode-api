import type { Ss1ModuleData } from './types'

export const module03: Ss1ModuleData = {
  title: 'Module 3 — Week 5: Statistics I — Data Presentation',
  lessons: [
    {
      title: 'Week 5 — Data Collection & Presentation',
      duration: 45,
      content: `# Week 5 — Data Collection & Presentation

## Learning Objectives
By the end of this lesson you should be able to:
- Define statistics and distinguish between discrete and continuous data.
- Collect and organise data into frequency tables.
- Draw and interpret pictograms, bar charts, pie charts, and line graphs.
- Calculate angles for a pie chart.

## Introduction
**Statistics** is the science of collecting, organising, presenting, analysing and interpreting data. Data is raw facts and figures — statistics turns it into information.

## Types of Data
- **Qualitative:** non-numerical (e.g. colours, names).
- **Quantitative:** numerical — **discrete** (countable, e.g. number of students) or **continuous** (measurable, e.g. height, weight).

## Frequency Table
Shows each value with the number of times it occurs (its **frequency**).

### Worked Example 1
30 students scored the following marks in a test:
4, 5, 3, 2, 4, 5, 3, 4, 5, 2, 3, 4, 5, 4, 3, 2, 5, 4, 3, 4, 5, 4, 3, 2, 4, 5, 3, 4, 5, 4

Make a frequency table.

**Solution**
| Marks | Tally | Frequency |
|-------|-------|-----------|
| 2     | ||||  | 4         |
| 3     | ||||  | 7         |
| 4     | |||| ||| | 11    |
| 5     | |||| ||| | 8     |
| Total |       | 30        |

## Bar Charts
Bars of equal width separated by gaps; height shows frequency.

## Pie Charts
A circle divided into sectors. Angle of sector = (frequency / total) x 360°.

### Worked Example 2
150 students chose their favourite sport: Football 60, Basketball 40, Tennis 30, Others 20.
Draw a pie chart.

**Solution**
- Football: (60/150) x 360° = 144°
- Basketball: (40/150) x 360° = 96°
- Tennis: (30/150) x 360° = 72°
- Others: (20/150) x 360° = 48°
Total: 144 + 96 + 72 + 48 = 360° ✓

## Line Graphs and Histograms
- **Line graph:** points joined by straight lines; good for trends over time.
- **Histogram:** bars touch each other; used for continuous data grouped in classes.

## Class Activity
Essential Mathematics SS1, Page 334, Ex 22.1, Nos 1 & 2; Page 340, Ex 22.2, Nos 1 & 3.

## Assignment
Essential Mathematics SS1, Page 334, Ex 22.1, Nos 4 & 6; Page 340, Ex 22.2, Nos 5, 7, 9.

## Summary — Key Points
- **Discrete data** is counted; **continuous data** is measured.
- A **frequency table** organises raw data efficiently.
- **Pie chart angle** = (frequency / total) x 360°.
- **Bar charts** have gaps; **histograms** do not.`,
      quiz: {
        title: 'Quiz W5 — Data Presentation',
        description: '8 questions on data types, frequency tables, and charts.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'Height of students is an example of which type of data?', questionType: 'fill_blank', correctAnswer: 'continuous' },
          { id: 'q2', questionText: 'True or false: A histogram has gaps between bars.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q3', questionText: 'In a pie chart, a category with 50 out of 200 items has an angle of:', questionType: 'fill_blank', correctAnswer: '90 degrees' },
          { id: 'q4', questionText: 'The total of all angles in a pie chart is:', questionType: 'fill_blank', correctAnswer: '360 degrees' },
          { id: 'q5', questionText: 'Which chart is best for showing a trend over time?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Pie chart', isCorrect: false }, { id: 'b', text: 'Line graph', isCorrect: true }, { id: 'c', text: 'Pictogram', isCorrect: false }, { id: 'd', text: 'Bar chart', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q6', questionText: 'The number of students in a class is which type of data?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Continuous', isCorrect: false }, { id: 'b', text: 'Discrete', isCorrect: true }, { id: 'c', text: 'Qualitative', isCorrect: false }, { id: 'd', text: 'Sampled', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q7', questionText: 'True or false: A pictogram uses symbols to represent quantities.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q8', questionText: '12 out of 60 items is what fraction and what pie-chart angle?', questionType: 'fill_blank', correctAnswer: '1/5 and 72 degrees' },
        ],
      },
      assignment: {
        title: 'Assignment W5 — Data Presentation',
        description: 'Show all calculations. Draw charts neatly with a ruler.',
        dueDate: '2026-11-26T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'The ages of 20 students are: 15, 16, 15, 17, 16, 15, 16, 17, 15, 16, 16, 17, 15, 16, 17, 16, 15, 16, 17, 16. Make a frequency table and draw a bar chart.', marks: 8 },
          { id: 'a2', type: 'subjective', title: 'A survey of 120 people: 48 walk, 30 drive, 24 cycle, 18 take the bus. Calculate the pie chart angles for each.', marks: 7 },
          { id: 'a3', type: 'subjective', title: 'Explain the difference between discrete and continuous data with one example each.', marks: 5 },
        ],
      },
    },
  ],
}