import type { Ss1ModuleData } from './types'

export const module05: Ss1ModuleData = {
  title: 'Module 5 — Week 8-10: Probability',
  lessons: [
    {
      title: 'Week 8-10 — Introduction to Probability',
      duration: 75,
      content: `# Week 8-10 — Introduction to Probability

## Learning Objectives
By the end of this lesson you should be able to:
- Define experimental and theoretical probability.
- Calculate probabilities of single events.
- Use the probability scale from 0 to 1.
- Apply the addition rule for mutually exclusive events.
- Apply the multiplication rule for independent events.
- Solve problems involving dice, coins, and packs of cards.

## Introduction
**Probability** measures how likely an event is to happen. It ranges from 0 (impossible) to 1 (certain). Probability is used everywhere — weather forecasts, insurance, games, and genetics.

## Basic Definition
P(event) = (number of favourable outcomes) / (total number of possible outcomes)

Probability ranges from 0 (impossible) to 1 (certain).

### Worked Example 1
A fair die is rolled once. Find the probability of getting:
(a) a 4    (b) an even number    (c) a number less than 5    (d) a 7

**Solution**
(a) P(4) = **1/6**
(b) Even numbers: {2, 4, 6} → P(even) = **3/6 = 1/2**
(c) Less than 5: {1, 2, 3, 4} → P(< 5) = **4/6 = 2/3**
(d) P(7) = **0** (impossible)

### Worked Example 2
A coin is tossed twice. What is the probability of two heads?

**Solution**
Sample space: HH, HT, TH, TT (4 outcomes)
P(HH) = **1/4**

## Experimental Probability
P(event) = (number of times event occurred) / (total number of trials)

### Worked Example 3
A die was rolled 60 times and the number 5 appeared 12 times. Find the experimental probability of rolling a 5, and compare with theory.

**Solution**
Experimental P(5) = 12/60 = **0.2**
Theoretical P(5) = 1/6 ≈ 0.167
They are close — as trials increase, experimental approaches theoretical.

## Probability Scale
- P = 0 → impossible
- 0 < P < 1/2 → unlikely
- P = 1/2 → even chance
- 1/2 < P < 1 → likely
- P = 1 → certain

## Addition Rule
For **mutually exclusive** events A and B (cannot both happen):
P(A or B) = P(A) + P(B)

### Worked Example 4
A card is drawn from a pack of 52 cards. Find the probability that it is a king or a queen.

**Solution**
P(king or queen) = P(king) + P(queen) = 4/52 + 4/52 = 8/52 = **2/13**

## Multiplication Rule
For **independent** events A and B:
P(A and B) = P(A) x P(B)

### Worked Example 5
A coin is tossed and a die is rolled. Find the probability of getting a head and a 6.

**Solution**
P(head and 6) = P(head) x P(6) = 1/2 x 1/6 = **1/12**

## Complementary Events
P(not A) = 1 - P(A)

### Worked Example 6
The probability that a student passes a test is 0.8. What is the probability that the student fails?

**Solution**
P(fail) = 1 - 0.8 = **0.2**

## Class Activity
Essential Mathematics SS1, Page 368, Ex 25.1, Nos 1 & 2; Page 372, Ex 25.2, Nos 1, 2, 3.

## Assignment
Essential Mathematics SS1, Page 368, Ex 25.1, Nos 4, 6, 8; Page 372, Ex 25.2, Nos 5, 7, 9.

## Summary — Key Points
- P(event) = favourable outcomes / total outcomes, always between 0 and 1.
- P(not A) = 1 - P(A).
- **Mutually exclusive events** → add: P(A or B) = P(A) + P(B).
- **Independent events** → multiply: P(A and B) = P(A) x P(B).
- Experimental probability approaches theoretical probability as trials increase.`,
      quiz: {
        title: 'Quiz W8-10 — Probability',
        description: '8 questions on probability of single and combined events.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'A fair die is rolled. P(prime number) =', questionType: 'fill_blank', correctAnswer: '1/2' },
          { id: 'q2', questionText: 'True or false: Probability can be greater than 1.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q3', questionText: 'A coin is tossed. P(tail) =', questionType: 'fill_blank', correctAnswer: '1/2' },
          { id: 'q4', questionText: 'P(event) = 0. What type of event is this?', questionType: 'fill_blank', correctAnswer: 'impossible' },
          { id: 'q5', questionText: 'Two coins are tossed. P(exactly one head) =', questionType: 'multiple_choice', options: [{ id: 'a', text: '1/4', isCorrect: false }, { id: 'b', text: '1/2', isCorrect: true }, { id: 'c', text: '3/4', isCorrect: false }, { id: 'd', text: '1', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q6', questionText: 'A card is drawn from 52. P(ace) =', questionType: 'fill_blank', correctAnswer: '1/13' },
          { id: 'q7', questionText: 'True or false: For independent events, P(A and B) = P(A) x P(B).', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q8', questionText: 'If P(rain) = 0.3, then P(no rain) =', questionType: 'fill_blank', correctAnswer: '0.7' },
        ],
      },
      assignment: {
        title: 'Assignment W8-10 — Probability',
        description: 'Give all probabilities as fractions in lowest terms.',
        dueDate: '2026-12-10T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'A bag contains 5 red, 4 blue and 3 green balls. One ball is drawn at random. Find P(red), P(blue), and P(not green).', marks: 7 },
          { id: 'a2', type: 'subjective', title: 'Two fair dice are thrown. Find the probability that (i) the sum is 7, (ii) both dice show the same number.', marks: 8 },
          { id: 'a3', type: 'subjective', title: 'A number is chosen from 1 to 20. Find P(multiple of 3 or 5).', marks: 5 },
        ],
      },
    },
  ],
}