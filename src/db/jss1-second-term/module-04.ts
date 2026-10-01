import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 4 — Statistics & Probability I. Verified: P(A') = 1 - P(A),
// so if P(A) = 0.3 then P(A') = 0.7; P(head) = 0.5 and P(4) = 1/6, so
// P(head and 4) = 0.5 x 1/6 = 1/12; from the 100 throws, P(4) = 16/100 = 0.16 and
// P(odd) = (15+19+17)/100 = 51/100 = 0.51.
export const module04: Jss1ModuleData = {
  title: 'Module 4 — Week 4: Statistics and Probability I',
  lessons: [
    {
      title: 'Week 4 — Statistics and Probability I',
      duration: 45,
      content: `## Learning Objectives
- Find the probability of a complementary event.
- Multiply probabilities of independent events.
- Work out experimental probability from results.

## Complementary Events
Two events are **complementary** when together they cover every possibility: if
one does not happen, the other must.

If A is an event and A' is its complementary event, then:

**P(A') = 1 - P(A)**

### Worked Example 1
If P(A) = 0.3, then P(A') = 1 - 0.3 = **0.7**

**Check:** the two probabilities must add to 1, and 0.3 + 0.7 = 1.

## Combined Events (Independent)
Two events are **independent** when the outcome of one does not affect the
outcome of the other. For independent events, multiply:

**P(A and B) = P(A) x P(B)**

### Worked Example 2
Toss a coin and roll a die.

P(head) = 0.5
P(rolling a 4) = 1/6

P(head and 4) = 0.5 x 1/6 = 1/12 (about 0.083)

Check the reasoning: only 1 of the 6 faces is a 4, and only 1 of the 2 coin
results is a head, so 1 out of 2 x 6 = 12 combined outcomes gives 1/12.

## Experimental Probability
Experimental probability comes from **results you actually collect**, rather
than from theory.

A spreadsheet was used to simulate throwing a die 100 times:

| Score | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Frequency | 15 | 18 | 19 | 16 | 17 | 15 |

### Worked Example 3
Experimental probability = frequency / total

P(4) = 16 / 100 = **0.16**

P(odd number) = (15 + 19 + 17) / 100 = 51 / 100 = **0.51**

Note that 51/100 is close to the theoretical 0.5 for an odd number. The more
trials you carry out, the closer experimental probability gets to theory.

## Common Mistakes
- Adding probabilities for events that can both happen.
- Using frequency instead of frequency divided by the total.
- Forgetting that independent means "does not affect", not "unlikely".

## Practice
1. If P(A) = 0.45, find P(A').
2. A fair coin and a fair die: find P(head and 5).
3. A bag of 10 counters: P(red) = 0.3. Find P(not red).
4. A spinner lands on blue 24 times out of 80. Find the experimental probability of blue.`,
      quiz: quiz(
        'Week 4 Quiz — Statistics and Probability I',
        'Five questions on complementary events, independent events and experimental probability.',
        [
          mc(
            'If P(A) = 0.3, what is P(A\') for the complementary event A\'?',
            ['0.7', '0.3', '1.3', '0.03'],
            'P(A\') = 1 - P(A) = 1 - 0.3 = 0.7. The two probabilities must add to 1.',
          ),
          mc(
            'A fair coin and a fair die are thrown. What is the probability of a head and a 4?',
            ['1/12', '1/2', '1/6', '1/24'],
            'The events are independent, so multiply: P(head) x P(4) = 0.5 x 1/6 = 1/12.',
          ),
          fb(
            'A bag of 10 counters has P(red) = 0.3. What is the probability of NOT red? (Enter a decimal number only)',
            '0.7',
            'P(not red) is the complementary event, so 1 - 0.3 = 0.7.',
          ),
          mc(
            'A die is thrown 100 times and a 4 appeared 16 times. What is the experimental probability of a 4?',
            ['0.16', '16', '0.84', '6.25'],
            'Experimental probability = frequency / total = 16 / 100 = 0.16.',
          ),
          mc(
            'Two events are independent. What does that mean?',
            [
              'The outcome of one does not affect the outcome of the other',
              'The two events are equally likely',
              'The events cannot both happen',
              'The events always happen together',
            ],
            'Independent events do not affect each other, so their probabilities multiply.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 4.1 — Statistics and Probability I',
        'State whether events are independent or complementary before choosing which rule to use.',
        [
          { id: 'a1', type: 'theory', title: 'Find the complementary probability: (i) P(A) = 0.62, (ii) P(B) = 0.25, (iii) P(C) = 0.09.', marks: 3 },
          { id: 'a2', type: 'theory', title: 'For two independent events find P(A and B) in each case: (i) P(A) = 0.5, P(B) = 0.4, (ii) P(A) = 1/2, P(B) = 1/6, (iii) P(A) = 0.8, P(B) = 0.25.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'A six-sided die is thrown 200 times. The results are: 1 appeared 30 times, 2 appeared 35 times, 3 appeared 32 times, 4 appeared 34 times, 5 appeared 36 times, 6 appeared 33 times. Find the experimental probability of throwing an even number.', marks: 5 },
          { id: 'a4', type: 'subjective', title: 'Explain, in your own words, the difference between experimental probability and theoretical probability, and say why the experimental value of an odd number came out near 0.51 rather than exactly 0.5.', marks: 6 },
        ],
      ),
    },
  ],
}