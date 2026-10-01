import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 6 — Percentage Increases and Decreases. Verified: multiplier
// for +5% is 1.05 and for +95% is 1.95; for -14% it is 0.86 and for -67% it is
// 0.33; #2000 with 5% added is #2000 x 1.05 = #2100; a population of 45000
// rising by 85% becomes 45000 x 1.85 = 83250.
export const module06: Jss1ModuleData = {
  title: 'Module 6 — Week 6: Percentage Increases and Decreases',
  lessons: [
    {
      title: 'Week 6 — Percentage Increases and Decreases',
      duration: 45,
      content: `## Learning Objectives
- Calculate a percentage increase or decrease.
- Use the multiplier method.
- Apply percentages to real situations.

## Percentage Increase and Decrease
**Percentage increase = (increase / original value) x 100**

**Percentage decrease = (decrease / original value) x 100**

The original value is always the starting amount.

### Worked Example 1
The population of a town is 45000. It is expected to rise by 85% in ten years.
Estimate the population in ten years.

Increase = 45% of 45000 = 0.85 x 45000 = 38250

New population = 45000 + 38250 = **83250**

## Using the Multiplier
The **multiplier** is a single number you multiply by:

**Multiplier = new value / original value**

### Finding the Multiplier
For an **increase**, add the percentage to 1:

- 5% increase -> 1 + 0.05 = **1.05**
- 95% increase -> 1 + 0.95 = **1.95**

For a **decrease**, subtract it from 1:

- 14% decrease -> 1 - 0.14 = **0.86**
- 67% decrease -> 1 - 0.67 = **0.33**

### Worked Example 2
The price of bread is #2000. Using the multiplier, find the new price after a
5% increase.

Multiplier = 1.05
New price = 2000 x 1.05 = **#2100**

**Check:** 5% of 2000 is 100, and 2000 + 100 = 2100. Correct.

The multiplier method is much faster for repeated changes, because you simply
multiply the multipliers together.

## Common Mistakes
- Using the new value instead of the original when finding the percentage.
- Forgetting that a decrease multiplier is less than 1.
- Adding a decrease multiplier to 1 instead of subtracting it.

## Practice
1. Find the multiplier for an increase of 20%.
2. Find the multiplier for a decrease of 45%.
3. A jacket costs #8000 and rises by 10%. Find the new price.
4. A phone costs #45000 and falls by 20%. Find the new price.`,
      quiz: quiz(
        'Week 6 Quiz — Percentage Increases and Decreases',
        'Five questions on percentage change and the multiplier method.',
        [
          mc(
            'What is the multiplier for an increase of 5%?',
            ['1.05', '0.95', '5', '0.05'],
            'For an increase add the percentage to 1: 1 + 0.05 = 1.05.',
          ),
          mc(
            'What is the multiplier for a decrease of 14%?',
            ['0.86', '1.14', '0.14', '14'],
            'For a decrease subtract it from 1: 1 - 0.14 = 0.86.',
          ),
          mc(
            'The price of bread is #2000 and there is a 5% increase. What is the new price?',
            ['#2100', '#100', '#1900', '#2400'],
            'Use the multiplier: 2000 x 1.05 = #2100. Check: 5% of 2000 is 100, and 2000 + 100 = 2100.',
          ),
          fb(
            'A population of 45000 is expected to rise by 85% in ten years. Estimate the population in ten years. (Enter a number only)',
            '83250',
            'The multiplier is 1.85, so 45000 x 1.85 = 83250.',
          ),
          mc(
            'Which statement about a decrease multiplier is correct?',
            [
              'It is always less than 1',
              'It is always greater than 1',
              'It is always 1',
              'It is the same as the original value',
            ],
            'A decrease makes a value smaller, so its multiplier must be less than 1. It is found by subtracting the percentage from 1.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 6.1 — Percentage Increases and Decreases',
        'Use the multiplier method throughout, and check one answer by working the percentage out directly.',
        [
          { id: 'a1', type: 'theory', title: 'Find the multiplier for each change: (i) an increase of 20%, (ii) a decrease of 45%, (iii) an increase of 150%, (iv) a decrease of 8%.', marks: 4 },
          { id: 'a2', type: 'theory', title: 'Find the new price of each item after the stated change: (i) #8000 with a 10% increase, (ii) #45000 with a 20% decrease, (iii) #2500 with a 5% decrease.', marks: 9 },
          { id: 'a3', type: 'subjective', title: 'A town has a population of 45000 and it is expected to rise by 85% in ten years. Estimate the population in ten years, showing the multiplier method and then checking by finding 85% of 45000 directly.', marks: 7 },
        ],
      ),
    },
  ],
}