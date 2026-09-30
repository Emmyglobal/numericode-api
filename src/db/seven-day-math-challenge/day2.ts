import type { ChallengeModuleData } from './types'

// ─── Day 2 — Indices ──────────────────────────────────────────────────────────
// Answers verified: 2^3=8; 2^4 x 2^3 = 2^7 = 128; (2^3)^2 = 2^6 = 64;
// 2^-3 = 1/8; 81^(1/2) = 9.
const L_MEANING = `## Learning Objectives
By the end of this lesson you should be able to:
- Read an index expression correctly.
- Name the base and the index (power).
- Evaluate simple powers.

## What is an Index?
Writing "four threes multiplied together" takes too much space, so we use a short form called an **index** (also called an **exponent** or **power**).

2 x 2 x 2 x 2  is written as  2^4

The small number raised above the base is the **index**. In 2^4:
- the **base** is 2
- the **index** (or power) is 4
- the whole thing means 2 x 2 x 2 x 2

**Reading it out loud:** "two to the power four", or "two to the fourth".

### Worked Example
Write 9 x 9 x 9 in index form.

**Solution**
There are three nines being multiplied, so the index is 3.

The answer is **9^3**.

### Worked Example
Write 5^4 in full.

**Solution**
An index of 4 means four factors of 5:

5^4 = 5 x 5 x 5 x 5

## A Note on How to Type It
NumeryCode lessons write powers with the ^ symbol, so 2^4 means two to the power four. You will sometimes see a small raised number instead; they mean the same thing.

## Rules for Reading
- A negative index (2^-3) means "divide", and we deal with it later in this day.
- A fractional index (9^(1/2)) means "root", also covered later.

## Quick Check
1. In 5^3, what is the base and what is the index?
2. Write 7 x 7 x 7 x 7 in index form.
3. What does 10^2 mean?

**Answers:** 1. Base is 5, index is 3. 2. 7^4. 3. Ten multiplied by itself twice, which is 100.`

const L_LAWS = `## Learning Objectives
By the end of this lesson you should be able to:
- Use each law of indices to simplify an expression.
- Multiply, divide and raise a power to a power.

## Law 1 — Multiplication
When we multiply powers with the **same base**, we **add** the indices.

a^m x a^n = a^(m+n)

### Worked Example
Simplify 2^4 x 2^3.

**Solution**
Same base (2), so add the indices:

2^4 x 2^3 = 2^(4+3) = 2^7

## Law 2 — Division
When we divide powers with the **same base**, we **subtract** the indices.

a^m / a^n = a^(m-n)

### Worked Example
Simplify 3^6 / 3^2.

**Solution**
3^6 / 3^2 = 3^(6-2) = **3^4**

## Law 3 — A Power of a Power
When a power is raised to another power, we **multiply** the indices.

(a^m)^n = a^(mn)

### Worked Example
Simplify (2^3)^2.

**Solution**
Multiply the indices: 3 x 2 = 6.

(2^3)^2 = 2^6

## The Zero and Unit Indexes
- Any non-zero number to the power 0 is 1: a^0 = 1, so 5^0 = 1
- Anything to the power 1 is itself: a^1 = a

### Why does 5^0 = 1?
Because 5^3 / 5^3 must equal 5^0, and anything divided by itself is 1.

## Fractional and Negative Indexes
- a^(1/n) means the nth root of a, so 9^(1/2) is the square root of 9
- a^(-n) means 1 / a^n, so 2^(-3) = 1 / 2^3 = 1/8

## Quick Check
1. Simplify 4^2 x 4^3.
2. Simplify (x^2)^4.
3. Simplify 2^-3.

**Answers:** 1. 4^5. 2. x^8. 3. 1/8.`

const L_APPLYING = `## Learning Objectives
By the end of this lesson you should be able to:
- Apply the laws to problems with numbers.
- Recognise when an expression is already in simplest index form.
- Solve simple index equations.

## Worked Example 1 — Multiply and Divide Together
Simplify (2^4 x 2^3) / 2^2.

**Solution**
Deal with the multiplication first: 2^4 x 2^3 = 2^7.
Then the division: 2^7 / 2^2 = 2^(7-2) = **2^5** (which equals 32).

## Worked Example 2 — Numbers Instead of Letters
Evaluate 3^2 x 3^2 / 3.

**Solution**
3^2 x 3^2 = 3^4, and 3^4 / 3^1 = 3^3 = **27**.

## Worked Example 3 — A Negative Index
Find the value of 2^-3.

**Solution**
A negative index means divide:

2^-3 = 1 / 2^3 = 1/8

## Worked Example 4 — Solving an Index Equation
Solve for x: 5^x = 25.

**Solution**
Write 25 in index form: 25 = 5^2.

So 5^x = 5^2, which means **x = 2**.

### Another One
Solve for x: 2^(x+1) = 16.

**Solution**
16 = 2^4, so x + 1 = 4, giving **x = 3**.

## When is an Expression Fully Simplified?
It is simplified when there is **one** power left, on **one** base, and no negative index (unless the question wants one).

5^2 x 5 x 5^3 is NOT simplified, because 5 is really 5^1 and has not been combined.
It becomes 5^(2+1+3) = 5^6.

## Quick Check
1. Simplify 2^3 x 2^4.
2. Simplify 10^2 / 10.
3. Solve 3^x = 27.

**Answers:** 1. 2^7 = 128. 2. 10. 3. x = 3.`

const L_PRACTICE = `## Practice — Work through these before taking the quiz

**Question 1.** Write 6 x 6 x 6 in index form, then name the base and the index.

**Question 2.** Simplify 2^4 x 2^3.

**Question 3.** Simplify 9^6 / 9^2.

**Question 4.** Simplify (3^2)^3.

**Question 5.** Find the value of 4^-2.

## Worked Solutions

**Question 1.** Three sixes multiplied, so **6^3**. The base is 6 and the index is 3.

**Question 2.** Same base, so add the indices: 2^(4+3) = **2^7** (which is 128).

**Question 3.** 9^(6-2) = **9^4** (which is 6561).

**Question 4.** Multiply the indices: 3 x 2 = 6, so **(3^2)^3 = 3^6**.

**Question 5.** A negative index means divide: 4^-2 = 1 / 4^2 = 1/16.

## Common Mistakes This Day
- Adding the indices when you should be multiplying them (only happens with a power of a power).
- Dividing powers with different bases — you cannot combine those.
- Forgetting that any number to the power 0 is 1.
- Treating a negative index as a negative number.

## Now Take the Quiz
You have 5 questions on the meaning and the laws of indices. Aim for 4 out of 5 to pass.`

export const day2: ChallengeModuleData = {
  title: 'Day 2 — Indices',
  lessons: [
    { title: 'Day 2 — Meaning of Indices', duration: 25, content: L_MEANING },
    { title: 'Day 2 — Laws of Indices', duration: 30, content: L_LAWS },
    { title: 'Day 2 — Applying the Laws of Indices', duration: 30, content: L_APPLYING },
    {
      title: 'Day 2 — Practice and Quiz',
      duration: 30,
      content: L_PRACTICE,
      quiz: {
        title: 'Day 2 — Indices Quiz',
        description: 'Five questions on the meaning and laws of indices.',
        timeLimit: 10,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What is the value of 2^3?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '6', isCorrect: false },
              { id: 'b', text: '8', isCorrect: true },
              { id: 'c', text: '9', isCorrect: false },
              { id: 'd', text: '5', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: '2^3 means 2 x 2 x 2 = 8. Remember: multiply the base by itself as many times as the index.',
          },
          {
            questionText: 'Simplify 2^4 x 2^3.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2^12', isCorrect: false },
              { id: 'b', text: '2^7', isCorrect: true },
              { id: 'c', text: '4^7', isCorrect: false },
              { id: 'd', text: '128', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Powers with the same base multiply by adding the indices: 2^4 x 2^3 = 2^(4+3) = 2^7. (2^7 is 128, but the simplest index form is 2^7.)',
          },
          {
            questionText: 'Simplify (2^3)^2.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2^5', isCorrect: false },
              { id: 'b', text: '2^6', isCorrect: true },
              { id: 'c', text: '4^3', isCorrect: false },
              { id: 'd', text: '2^9', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'A power raised to a power multiplies the indices: 3 x 2 = 6, so (2^3)^2 = 2^6 (which is 64).',
          },
          {
            questionText: 'Find the value of 2^-3. (Answer as a fraction, for example: 1/8)',
            questionType: 'fill_blank',
            correctAnswer: '1/8',
            points: 1,
            explanation: 'A negative index means divide by the positive power: 2^-3 = 1/2^3 = 1/8.',
          },
          {
            questionText: 'What is the value of 81^(1/2)?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '3', isCorrect: false },
              { id: 'b', text: '9', isCorrect: true },
              { id: 'c', text: '27', isCorrect: false },
              { id: 'd', text: '81', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'A fractional index of 1/2 means the square root. The square root of 81 is 9, and 9 x 9 = 81.',
          },
        ],
      },
    },
  ],
}
