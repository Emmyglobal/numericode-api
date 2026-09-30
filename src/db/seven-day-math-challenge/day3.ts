import type { ChallengeModuleData } from './types'

// ─── Day 3 — Logarithms ────────────────────────────────────────────────────────
// Answers verified: log2(8)=3; log5(125)=3; log3(81)=4; log10(1000)=3;
// log x = 2 (base 10) -> x = 100.
const L_MEANING = `## Learning Objectives
By the end of this lesson you should be able to:
- Explain what a logarithm means.
- Write a logarithm as an index form and back again.
- Find a logarithm value using the base.

## Logarithms Undo Indices
On Day 2 you learned that indices ask a **question**:

**"2 to what power gives 8?"**  ->  2^3 = 8, so the answer is 3.

A **logarithm** asks that same question the other way round:

**"To what power must 2 be raised to get 8?"**  ->  log 8 to base 2 = 3

## The Two Forms
These two statements mean exactly the same thing:

log base 2 of 8 = 3
2^3 = 8

So:
- An index form is **base^index = answer**
- A logarithmic form is **log base of (answer) = index**

### Worked Example
Write log base 3 of 81 in index form.

**Solution**
Ask: 3 to what power gives 81?
3 x 3 = 9, 3 x 3 x 3 = 27, 3 x 3 x 3 x 3 = 81.

So 3^4 = 81, which means **log base 3 of 81 = 4**.

## Finding a Logarithm
To find log base 2 of 32, list the powers of 2 until you reach 32:
2, 4, 8, 16, 32 — that is 2^5.

So **log base 2 of 32 = 5**.

## The Common Logarithm
In school mathematics, log with no base written means **base 10**.

log 100 = 2, because 10^2 = 100.
log 1000 = 3, because 10^3 = 1000.

## Why Logarithms Matter
Logarithms let you work with very large or very small numbers, and they are used in scale (richter scale, pH, decibels), in growth and decay, and in compound interest.

## Quick Check
1. Convert log base 5 of 125 into index form.
2. Find log base 2 of 16.
3. What is log 10 (base 10)?

**Answers:** 1. 5^3 = 125. 2. 4. 3. 1, because 10^1 = 10.`

const L_LAWS = `## Learning Objectives
By the end of this lesson you should be able to:
- Use the three laws of logarithms.
- Expand and condense logarithmic expressions.

## Law 1 — Product Becomes a Sum
log base a of (M x N) = log base a of M + log base a of N

### Worked Example
Write log base 2 of 8 as a single logarithm sum.

**Solution**
8 = 2 x 2 x 2, so:

log 8 = log 2 + log 2 + log 2

That gives **log 8 = 3 log 2**.

## Law 2 — Quotient Becomes a Difference
log base a of (M / N) = log base a of M - log base a of N

### Worked Example
log base 2 of (32/8) = log 32 - log 8 = 5 - 3 = **2**

## Law 3 — Power Comes Out as a Multiplier
log base a of M^n = n x log base a of M

### Worked Example
log base 2 of 8^3 = 3 x log 8 = 3 x 3 = **9**

(You can check this: 8^3 = 512, and 2^9 = 512. Correct.)

## Going the Other Way (Condensing)
The laws work in reverse to combine several logarithms into one.

- Sum becomes product: log M + log N = log (M x N)
- Difference becomes quotient: log M - log N = log (M / N)
- Multiplier becomes power: 3 log M = log (M^3)

### Worked Example
Condense log 2 + log 4.

**Solution**
log 2 + log 4 = log (2 x 4) = **log 8**

## One Important Caution
These laws only combine logarithms that have the **same base**. Never mix bases in one calculation without converting first.

## Quick Check
1. Expand log base 2 of 32.
2. Evaluate log base 2 of (16/4).
3. Evaluate log base 3 of 27^2.

**Answers:** 1. log 32 = 5, so it is 5 log 2. 2. 4 - 2 = 2. 3. 2 x 3 = 6.`

const L_CALCULATIONS = `## Learning Objectives
By the end of this lesson you should be able to:
- Solve simple logarithmic equations.
- Find a missing number in a logarithm.
- Apply logarithms to a real word problem.

## Solving a Logarithmic Equation
The goal is always to get the logarithm alone, then convert to index form.

### Worked Example 1
Solve for x: log base 2 of x = 5.

**Solution**
Write it in index form:

2^5 = x

2^5 = 32, so **x = 32**.

**Check:** log base 2 of 32 = 5. Correct.

### Worked Example 2
Solve for x: log base 10 of x = 2.

**Solution**
10^2 = x, so **x = 100**.

**Check:** log 100 = 2. Correct.

### Worked Example 3
Solve for x: log base 3 of x = 4.

**Solution**
3^4 = 81, so **x = 81**.

## Finding a Missing Part
### Worked Example 4
Find x if log base 5 of x = 3.

**Solution**
x = 5^3 = **125**.

### Worked Example 5
Find x if log base 2 of 64 = x.

**Solution**
We need the power that turns 2 into 64.
2, 4, 8, 16, 32, 64 — that is 2^6, so **x = 6**.

## A Real Problem
The loudness of a sound is measured in decibels using
L = 10 log base 10 of (I / I0),
where I is the intensity of the sound.

If a sound is 100 times as intense as the reference (I/I0 = 100), find L.

**Solution**
L = 10 x log base 10 of 100
L = 10 x 2
**L = 20 decibels**

## Quick Check
1. Solve log base 5 of x = 2.
2. Solve log base 2 of x = 6.
3. Evaluate log base 4 of 64.

**Answers:** 1. x = 25. 2. x = 64. 3. 3.`

const L_PRACTICE = `## Practice — Work through these before taking the quiz

**Question 1.** Write log base 3 of 81 in index form, and give the answer.

**Question 2.** Find log base 5 of 125.

**Question 3.** Evaluate log base 2 of (32/8).

**Question 4.** Solve for x: log base 10 of x = 3.

**Question 5.** Expand log base 2 of 16 into a sum of logarithms.

## Worked Solutions

**Question 1.** 3^4 = 81, so **log base 3 of 81 = 4**.

**Question 2.** 5^3 = 125, so **log base 5 of 125 = 3**.

**Question 3.** Use Law 2: log 32 - log 8 = 5 - 3 = **2**.

**Question 4.** 10^3 = 1000, so **x = 1000**.

**Question 5.** 16 = 2 x 2 x 2 x 2, so **log 16 = 4 log 2** (or 5 log 2 - log 2).

## Common Mistakes This Day
- Turning a logarithm into a multiplication instead of converting it to index form.
- Using the laws when the two logarithms have different bases.
- Losing the base when converting: log base 2 of 8 = 3 means 2^3 = 8, not 8^3.
- Forgetting that the base must be greater than 1.

## Now Take the Quiz
You have 5 questions on the meaning and laws of logarithms. Aim for 4 out of 5 to pass.`

export const day3: ChallengeModuleData = {
  title: 'Day 3 — Logarithms',
  lessons: [
    { title: 'Day 3 — What Logarithms Mean', duration: 25, content: L_MEANING },
    { title: 'Day 3 — Basic Laws of Logarithms', duration: 30, content: L_LAWS },
    { title: 'Day 3 — Simple Logarithmic Calculations', duration: 30, content: L_CALCULATIONS },
    {
      title: 'Day 3 — Practice and Quiz',
      duration: 30,
      content: L_PRACTICE,
      quiz: {
        title: 'Day 3 — Logarithms Quiz',
        description: 'Five questions on the meaning and laws of logarithms.',
        timeLimit: 10,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Find log base 2 of 8.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2', isCorrect: false },
              { id: 'b', text: '3', isCorrect: true },
              { id: 'c', text: '4', isCorrect: false },
              { id: 'd', text: '16', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Ask: 2 to what power gives 8? 2 x 2 x 2 = 8, so 2^3 = 8 and log base 2 of 8 = 3.',
          },
          {
            questionText: 'Find log base 5 of 125.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2', isCorrect: false },
              { id: 'b', text: '3', isCorrect: true },
              { id: 'c', text: '5', isCorrect: false },
              { id: 'd', text: '25', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: '5 x 5 = 25 and 5 x 5 x 5 = 125, so 5^3 = 125 and log base 5 of 125 = 3.',
          },
          {
            questionText: 'Find log base 3 of 81.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '3', isCorrect: false },
              { id: 'b', text: '4', isCorrect: true },
              { id: 'c', text: '6', isCorrect: false },
              { id: 'd', text: '27', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: '3^3 = 27 and 3 x 3 x 3 x 3 = 81, so 3^4 = 81 and log base 3 of 81 = 4.',
          },
          {
            questionText: 'What is log 1000 when no base is written? (In school mathematics, log means base 10.)',
            questionType: 'fill_blank',
            correctAnswer: '3',
            points: 1,
            explanation: 'log 1000 means log base 10 of 1000. Since 10 x 10 x 10 = 1000, we have 10^3 = 1000, so the answer is 3.',
          },
          {
            questionText: 'Which statement is equivalent to 3^4 = 81?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'log base 81 of 3 = 4', isCorrect: false },
              { id: 'b', text: 'log base 3 of 81 = 4', isCorrect: true },
              { id: 'c', text: 'log base 4 of 81 = 3', isCorrect: false },
              { id: 'd', text: 'log base 3 of 4 = 81', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'The index form is base^index = answer, so 3^4 = 81. The matching logarithmic form puts the base first: log base 3 of 81 = 4.',
          },
        ],
      },
    },
  ],
}
