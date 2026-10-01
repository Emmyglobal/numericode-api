import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 8 — Interpreting and Data Presentations. Verified: a class
// interval 20-29 with inclusive bounds spans 10 values; a histogram for
// continuous data has touching bars while a bar chart for discrete data has gaps.
export const module08: Jss1ModuleData = {
  title: 'Module 8 — Week 8: Interpreting and Data Presentations',
  lessons: [
    {
      title: 'Week 8 — Interpreting and Data Presentations',
      duration: 45,
      content: `## Learning Objectives
- Explain what a frequency diagram shows.
- Use grouped data and class intervals.
- Tell discrete data and continuous data apart.

## Key Terms

**Frequency diagram** — a chart such as a bar chart or histogram showing how
often each data value or group of values occurs.

**Grouped data** — data organised into groups (classes) instead of listing every
value. Useful for large sets of data.

**Class interval** — the range used in grouped data to divide values into
sections, for example 0-10, 11-20.

**Discrete data** — data that takes specific separate values, usually whole
numbers, such as the number of students or goals scored.

**Continuous data** — data that can take any value within a range, including
decimals or fractions, such as height, weight or time.

## Discrete and Continuous Data
The distinction matters because the two need different diagrams.

### Bar Chart for Discrete Data
- The bars are **all the same width**.
- There are **gaps** between the bars.

### Histogram for Continuous Data
- The bars **touch**, because there is no gap between one value and the next.
- Bar width shows the **class interval**.

## Class Intervals
### Worked Example 1
The class interval 20-29 written with inclusive bounds covers the values 20, 21,
22 ... up to 29.

That is **10 values**, so an inclusive integer class interval has **width 10**.
Writing 20-30 instead would be ambiguous, because it is unclear whether 30 is
included.

## Choosing the Right Presentation
Ask two questions:

1. **Is the data discrete or continuous?** This decides bar chart or histogram.
2. **How many values are there?** A few values can be listed; hundreds should be
   grouped into class intervals.

## Common Mistakes
- Drawing a histogram with gaps, or a bar chart with touching bars.
- Choosing class intervals that overlap, or that leave holes.

## Practice
1. Give an example of discrete data and one of continuous data.
2. How many values are in the class interval 30-39 with inclusive bounds?
3. Say whether a bar chart or a histogram suits the number of goals scored.
4. Name two features of a correct histogram.`,
      quiz: quiz(
        'Week 8 Quiz — Interpreting and Data Presentations',
        'Five questions on frequency diagrams, grouped data and discrete versus continuous data.',
        [
          mc(
            'Which of these is an example of discrete data?',
            ['The number of goals scored by a team', 'The height of a student', 'The mass of a parcel', 'The time taken for a race'],
            'Discrete data takes separate whole-number values. Height, mass and time can take any value in a range, so they are continuous.',
          ),
          mc(
            'How many values are in the class interval 20-29 written with inclusive bounds?',
            ['10', '9', '11', '20'],
            'Inclusive bounds count 20 through 29, which is 10 whole-number values.',
          ),
          mc(
            'What is the main difference between a bar chart and a histogram?',
            [
              'A histogram has touching bars with no gaps, for continuous data',
              'A histogram always has wider bars',
              'A bar chart never uses whole numbers',
              'There is no difference between them',
            ],
            'A histogram is used for continuous data and its bars touch, because there is no gap between consecutive values.',
          ),
          mc(
            'What is a class interval used for?',
            [
              'Grouping large sets of data into sections',
              'Finding the average of a set of data',
              'Drawing the y-axis of a chart',
              'Naming the units of measurement',
            ],
            'Grouped data splits large sets into classes such as 0-10 and 11-20, so the data can be displayed and interpreted.',
          ),
          mc(
            'Why are class intervals written with inclusive bounds such as 20-29?',
            [
              'To avoid ambiguity about whether the endpoints are included',
              'To make the interval wider',
              'Because continuous data is always whole numbers',
              'To show the frequency of the interval',
            ],
            'Writing 20-30 could be read as including 30 or excluding it. Inclusive integer bounds such as 20-29 leave no doubt.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 8.1 — Interpreting and Data Presentations',
        'State whether your data is discrete or continuous, and justify the diagram you choose.',
        [
          { id: 'a1', type: 'theory', title: 'For each, state whether the data is discrete or continuous: (a) the number of books read, (b) the time spent studying, (c) the number of goals scored, (d) the mass of a bag.', marks: 4 },
          { id: 'a2', type: 'theory', title: 'How many whole-number values are in each inclusive class interval: (i) 0-9, (ii) 10-19, (iii) 20-29, (iv) 45-49?', marks: 4 },
          { id: 'a3', type: 'subjective', title: 'A teacher records the times of 100 students in a race. Explain why a histogram suits this better than a bar chart, and state two features your histogram must have.', marks: 6 },
          { id: 'a4', type: 'theory', title: 'Give a reason why class intervals in grouped data must not overlap.', marks: 6 },
        ],
      ),
    },
  ],
}