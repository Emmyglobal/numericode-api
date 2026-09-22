import type { Ss1ModuleData } from './types'

export const module04: Ss1ModuleData = {
  title: 'Module 4 — Week 6-7: Statistics II — Measures of Average',
  lessons: [
    {
      title: 'Week 6-7 — Mean, Median, Mode & Range',
      duration: 75,
      content: `# Week 6-7 — Mean, Median, Mode & Range

## Learning Objectives
By the end of this lesson you should be able to:
- Calculate the mean, median, and mode of ungrouped data.
- Calculate the mean from a frequency table.
- Estimate the mean of grouped data using class midmarks.
- Find the median from an even number of observations.
- Identify the modal class of grouped data.
- Calculate the range of a data set.

## Introduction
A **measure of average** is a single value that represents the "centre" of a data set. The three main averages are the **mean**, **median**, and **mode**. The **range** measures how spread out the data is.

## The Mean
Mean = (sum of all values) / (number of values)

### Worked Example 1
Find the mean of: 4, 7, 9, 3, 6, 7, 8

**Solution**
Mean = (4 + 7 + 9 + 3 + 6 + 7 + 8) / 7 = 44 / 7 ≈ **6.3**

## The Median
Arrange the data in order; the median is the middle value.
- If n is odd: median is the ((n+1)/2)th value.
- If n is even: median is the average of the two middle values.

### Worked Example 2
Find the median of: (a) 3, 7, 2, 9, 5  (b) 4, 8, 2, 6, 10, 12

**Solution**
(a) Ordered: 2, 3, 5, 7, 9. n = 5, middle = 3rd value → **median = 5**
(b) Ordered: 2, 4, 6, 8, 10, 12. n = 6, middle two = 6 and 8 → median = (6+8)/2 = **7**

## The Mode
The value that occurs most often. There may be one mode, more than one, or none.

### Worked Example 3
Find the mode of: 2, 3, 3, 5, 7, 3, 8, 5

**Solution**
3 occurs three times, more than any other value → **mode = 3**

## Mean from a Frequency Table
Mean = sum(f x) / sum(f)

### Worked Example 4
| Score (x) | Frequency (f) |
|-----------|---------------|
| 2 | 3 |
| 3 | 5 |
| 4 | 6 |
| 5 | 2 |
Find the mean.

**Solution**
sum(f x) = 2x3 + 3x5 + 4x6 + 5x2 = 6 + 15 + 24 + 10 = 55
sum(f) = 3 + 5 + 6 + 2 = 16
Mean = 55/16 ≈ **3.4**

## Mean of Grouped Data
Use the class mid-mark (midpoint) x. Mean = sum(f x) / sum(f)

### Worked Example 5
| Class | Frequency | Mid-mark x |
|-------|-----------|------------|
| 1-10  | 4  | 5.5  |
| 11-20 | 8  | 15.5 |
| 21-30 | 12 | 25.5 |
| 31-40 | 6  | 35.5 |
Estimate the mean.

**Solution**
sum(f x) = 4(5.5) + 8(15.5) + 12(25.5) + 6(35.5) = 22 + 124 + 306 + 213 = 665
sum(f) = 4 + 8 + 12 + 6 = 30
Mean = 665/30 ≈ **22.2**

## The Range
Range = highest value - lowest value.

### Worked Example 6
Find the range of: 12, 5, 19, 8, 15

**Solution**
Range = 19 - 5 = **14**

## Class Activity
Essential Mathematics SS1, Page 346, Ex 23.1, Nos 1 & 2; Page 350, Ex 23.2, Nos 1 & 3; Page 354, Ex 23.3, No 1.

## Assignment
Essential Mathematics SS1, Page 346, Ex 23.1, Nos 5 & 7; Page 350, Ex 23.2, Nos 4 & 6; Page 354, Ex 23.3, Nos 2, 4, 5.

## Summary — Key Points
- **Mean** = sum of values / number of values; affected by extreme values.
- **Median** is the middle value when data is ordered; unaffected by extremes.
- **Mode** is the most frequent value; there may be several or none.
- From a frequency table: mean = sum(f x) / sum(f).
- For grouped data, use the **class mid-mark**.
- **Range** = highest - lowest — a simple measure of spread.`,
      quiz: {
        title: 'Quiz W6-7 — Measures of Average',
        description: '8 questions on mean, median, mode, and range.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'Find the mean of 5, 8, 10, 12, 15.', questionType: 'fill_blank', correctAnswer: '10' },
          { id: 'q2', questionText: 'Find the median of 3, 9, 1, 7, 5.', questionType: 'fill_blank', correctAnswer: '5' },
          { id: 'q3', questionText: 'True or false: The mode is always unique.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q4', questionText: 'Find the range of 22, 5, 18, 9, 31.', questionType: 'fill_blank', correctAnswer: '26' },
          { id: 'q5', questionText: 'Find the median of 2, 4, 6, 8.', questionType: 'fill_blank', correctAnswer: '5' },
          { id: 'q6', questionText: 'For classes 0-10 (f=5), 11-20 (f=15), the mid-mark of 11-20 is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '15', isCorrect: false }, { id: 'b', text: '15.5', isCorrect: true }, { id: 'c', text: '16', isCorrect: false }, { id: 'd', text: '20', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q7', questionText: 'True or false: The mean is affected by extreme values.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q8', questionText: 'The mean of scores 2, 3, 4, 5 with frequencies 3, 5, 6, 2 is (to 1 d.p.):', questionType: 'fill_blank', correctAnswer: '3.4' },
        ],
      },
      assignment: {
        title: 'Assignment W6-7 — Measures of Average',
        description: 'Show all working. Give answers to an appropriate degree of accuracy.',
        dueDate: '2026-12-03T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Find the mean, median and mode of: 12, 15, 12, 18, 20, 15, 12, 14, 18, 15.', marks: 8 },
          { id: 'a2', type: 'subjective', title: 'Scores 1-5 have frequencies 4, 7, 9, 6, 4. Calculate the mean using sum(fx)/sum(f).', marks: 6 },
          { id: 'a3', type: 'subjective', title: 'Estimate the mean of grouped data: 0-10 (f=3), 11-20 (f=7), 21-30 (f=10), 31-40 (f=5).', marks: 6 },
        ],
      },
    },
  ],
}