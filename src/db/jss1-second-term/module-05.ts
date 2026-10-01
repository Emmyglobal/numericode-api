import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 5 — Statistics & Probability II. Verified: a bag of 3 red,
// 2 blue and 5 green holds 10 counters, so P(red or blue) = (3+2)/10 = 0.5;
// P(red and blue from separate bags, 1/3 and 1/4) = 1/12; P(6 or 3 on a die) =
// 1/6 + 1/6 = 1/3.
export const module05: Jss1ModuleData = {
  title: 'Module 5 — Week 5: Statistics and Probability II',
  lessons: [
    {
      title: 'Week 5 — Statistics and Probability II',
      duration: 45,
      content: `## Learning Objectives
- Decide whether to add or multiply probabilities.
- Use AND and OR correctly for combined events.
- Recognise mutually exclusive events.

## Combined Events
A **combined event** asks for the probability of two or more things happening
together. Which rule you use depends on **AND or OR**, and on whether the events
are independent or mutually exclusive.

## AND — Both Events Happen
For **independent** events, **multiply**:

**P(A and B) = P(A) x P(B)**

### Worked Example 1
A red counter is picked from a bag of 3 red out of 12, then a blue counter from
another bag with 1 blue out of 4.

P(red and blue) = 1/3 x 1/4 = **1/12**

## OR — Either Event Happens
For **mutually exclusive** events — which cannot both happen — **add**:

**P(A or B) = P(A) + P(B)**

### Worked Example 2
A bag has 3 red, 2 blue and 5 green counters. Find the probability of picking a
red or a blue counter.

There are 10 counters altogether, and 3 + 2 = 5 are red or blue:

P(red or blue) = (3 + 2) / 10 = **0.5**

The events are mutually exclusive, so you add rather than multiply.

### Worked Example 3
A die is rolled once. Find P(6 or 3).

P(6) = 1/6 and P(3) = 1/6, and a single throw cannot be both, so:

P(6 or 3) = 1/6 + 1/6 = **2/6 = 1/3**

## Choosing the Rule
- Word **"and"**, or both needed -> **multiply** (independent).
- Word **"or"**, or either is enough -> **add** (mutually exclusive).
- If the events *can* both happen and you want either, add and then subtract the
  overlap, otherwise you count the overlap twice.

## Common Mistakes
- Multiplying when the question says "or".
- Adding when the events could both occur, which double-counts the overlap.
- Forgetting to divide by the total when working with actual counters.

## Practice
1. A bag has 4 red, 6 blue and 10 green. Find P(red or green).
2. Two independent events have P(A) = 0.6 and P(B) = 0.5. Find P(A and B).
3. A die is rolled once. Find P(2 or 5).
4. A bag has 5 white and 15 black counters. Find P(black).`,
      quiz: quiz(
        'Week 5 Quiz — Statistics and Probability II',
        'Five questions on AND and OR for combined events.',
        [
          mc(
            'A bag has 3 red, 2 blue and 5 green counters. What is the probability of picking a red or a blue counter?',
            ['0.5', '0.3', '0.2', '1.0'],
            'There are 10 counters and 3 + 2 = 5 are red or blue. The events are mutually exclusive, so P(red or blue) = 5/10 = 0.5.',
          ),
          mc(
            'Two independent events have P(A) = 0.6 and P(B) = 0.5. What is P(A and B)?',
            ['0.3', '1.1', '0.11', '0.3'],
            'Independent events multiply: 0.6 x 0.5 = 0.3.',
          ),
          mc(
            'A die is rolled once. What is the probability of rolling a 2 or a 5?',
            ['1/3', '1/6', '1/12', '2/12'],
            'A single throw cannot be both, so the events are mutually exclusive and you add: 1/6 + 1/6 = 2/6 = 1/3.',
          ),
          fb(
            'A bag has 5 white and 15 black counters. What is the probability of picking a black counter? (Enter a decimal number only)',
            '0.75',
            'There are 20 counters and 15 are black, so P(black) = 15/20 = 0.75.',
          ),
          mc(
            'When do you ADD two probabilities?',
            [
              'When the events are mutually exclusive (either can happen, but not both)',
              'When the events are independent',
              'When both events must happen',
              'When the events are equally likely',
            ],
            'Mutually exclusive events cannot both happen, so their probabilities add. Independent events that both happen are multiplied.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 5.1 — Statistics and Probability II',
        'State which rule you are using — multiply or add — and why, before you calculate.',
        [
          { id: 'a1', type: 'theory', title: 'A bag holds 4 red, 6 blue and 10 green counters. Find the probability of picking: (i) a red counter, (ii) a green counter, (iii) a red or green counter.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Two independent events have P(A) = 0.25 and P(B) = 0.8. Find the probability of A and B happening together.', marks: 4 },
          { id: 'a3', type: 'theory', title: 'A die is rolled once. Find the probability of rolling: (i) a 3, (ii) a 2 or a 5, (iii) an even number.', marks: 6 },
          { id: 'a4', type: 'subjective', title: 'Explain in your own words why you add probabilities for "or" but multiply them for "and". Give one example of each.', marks: 4 },
        ],
      ),
    },
  ],
}