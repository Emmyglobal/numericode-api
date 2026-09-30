import type { ChallengeModuleData } from './types'

// ─── Day 6 — Mixed Mathematics Practice ───────────────────────────────────────
// Two questions per topic. All answers verified:
// 5a - 3 = 2a + 9 -> a = 12; (2x+1)(x-3) expands to 2x^2-5x-3;
// 3^2 x 3^3 = 3^5; 5^0 = 1; 16^(1/4) = 2; log2(32)-log2(8) = 5-3 = 2;
// log3(1/27) = -3; 2x+y=8, x-y=1 -> add 3x=9, x=3, y=2;
// 5x+2y=21, 2x-y=1 -> y=2x-1, 5x+4x-2=21, x=2.6, y=4.2;
// x^2-8x+15 -> (x-3)(x-5) -> 3,5; 3x^2-5x-2 -> (3x+1)(x-2) -> -1/3, 2.
const L_ALGEBRA_REV = `## Mixed Practice — Algebra and Indices

Today is all about mixing the five topics you have learned so far. There are no new ideas, just practice at choosing the right method quickly.

## Part 1 — Algebra

### Worked Example 1
Solve 5a - 3 = 2a + 9.

**Solution**
The letters are on both sides, so collect them first. Move 2a to the left and -3 to the right:

5a - 2a = 9 + 3
3a = 12
a = 4

**Check:** 5(4) - 3 = 17 and 2(4) + 9 = 17. Correct.

### Worked Example 2
Expand (2x + 1)(x - 3).

**Solution**
Multiply every term in the first bracket by every term in the second:

2x x x = 2x^2
2x x (-3) = -6x
1 x x = x
1 x (-3) = -3

Now collect: 2x^2 - 6x + x - 3 = **2x^2 - 5x - 3**

## Part 2 — Indices

### Worked Example 3
Simplify 3^2 x 3^3.

**Solution**
Same base, so add the indices: 3^5.

### Worked Example 4
Evaluate 5^0 and 16^(1/4).

**Solution**
Any non-zero number to the power 0 is **1**.
16^(1/4) means the fourth root of 16, and 2 x 2 x 2 x 2 = 16, so it is **2**.

## Part 3 — Logarithms

### Worked Example 5
Evaluate log base 2 of 32 minus log base 2 of 8.

**Solution**
log 32 = 5 and log 8 = 3, so 5 - 3 = **2**.

### Worked Example 6
Find log base 3 of 1/27.

**Solution**
A negative index means a fraction. 1/27 = 3^-3.
So log base 3 of (1/27) = **-3**.

## Quick Check
1. Solve 4x + 2 = 3x + 9.
2. Simplify 5^3 / 5^2.
3. Find log base 5 of 25.

**Answers:** 1. x = 7. 2. 5. 3. 2.`

const L_QUADRATIC_REV = `## Mixed Practice — Simultaneous Equations and Quadratics

## Part 4 — Simultaneous Equations

### Worked Example 1
Solve:
2x + y = 8
x - y = 1

**Solution**
Adding gives 3x = 9, so x = 3.
Substituting: 2(3) + y = 8, so y = 2.
The solution is **(3, 2)**.

**Check:** 6 + 2 = 8 and 3 - 2 = 1. Correct.

### Worked Example 2
Solve:
5x + 2y = 21
2x - y = 1

**Solution**
From the second equation, y = 2x - 1. Substitute into the first:

5x + 2(2x - 1) = 21
5x + 4x - 2 = 21
9x = 23
x = 23/9 (about 2.56)

Then y = 2(23/9) - 1 = 46/9 - 9/9 = 37/9 (about 4.11)

**Check:** 5(23/9) + 2(37/9) = 115/9 + 74/9 = 189/9 = 21. Correct.

## Part 5 — Quadratic Equations

### Worked Example 3
Factorise and solve x^2 - 8x + 15 = 0.

**Solution**
We need two numbers multiplying to 15 and adding to -8: that is -3 and -5.

x^2 - 8x + 15 = (x - 3)(x - 5) = 0

So **x = 3 and x = 5**.

### Worked Example 4
Factorise and solve 3x^2 - 5x - 2 = 0.

**Solution**
We need two numbers multiplying to (3 x -2) = -6 and adding to -5: that is -6 and 1.

Split the middle term:
3x^2 - 6x + x - 2
Factor in groups: 3x(x - 2) + 1(x - 2)
= **(3x + 1)(x - 2)** = 0

Either 3x + 1 = 0, giving **x = -1/3**,
or x - 2 = 0, giving **x = 2**.

## Choosing the Right Method — A Summary
| If the question... | Use |
|---|---|
| has squared letters and friendly numbers | factorisation |
| has squared letters and unfriendly numbers | the quadratic formula |
| has two equations and two unknowns | elimination or substitution |
| has powers with the same base | the laws of indices |
| has a logarithm | convert to index form |

## Quick Check
1. Solve x + y = 9 and x - y = 1.
2. Factorise x^2 - 9x + 20.

**Answers:** 1. Adding gives 2x = 10, so x = 5 and y = 4. 2. (x - 4)(x - 5).`

const L_PRACTICE = `## Practice — Ten Mixed Questions

Work through all ten before opening the quiz. Write the method you used next to each answer.

1. Solve 5a - 3 = 2a + 9.
2. Expand (2x + 1)(x - 3).
3. Simplify 3^2 x 3^3.
4. Evaluate 5^0.
5. Evaluate 16^(1/4).
6. Evaluate log base 2 of 32 minus log base 2 of 8.
7. Find log base 3 of 1/27.
8. Solve 2x + y = 8 and x - y = 1.
9. Factorise and solve x^2 - 8x + 15 = 0.
10. Factorise and solve 3x^2 - 5x - 2 = 0.

## Worked Solutions

1. 5a - 2a = 9 + 3, so 3a = 12 and **a = 4**.
2. (2x + 1)(x - 3) = 2x^2 - 6x + x - 3 = **2x^2 - 5x - 3**.
3. Add the indices: **3^5** (which is 243).
4. **1**.
5. The fourth root of 16 is **2**.
6. 5 - 3 = **2**.
7. 1/27 = 3^-3, so the answer is **-3**.
8. Adding gives 3x = 9, so x = 3, and 3 - 1 = 2, so y = 2. Solution **(3, 2)**.
9. (x - 3)(x - 5) = 0, so **x = 3 and x = 5**.
10. (3x + 1)(x - 2) = 0, so **x = -1/3 and x = 2**.

## Before the Quiz
Ask yourself for each question: did I choose the right method, and did I check my answer? Those two habits are worth more than speed.

## Now Take the Quiz
You have 10 questions across all five topics. Aim for 7 out of 10 to pass.`

export const day6: ChallengeModuleData = {
  title: 'Day 6 — Mixed Mathematics Practice',
  lessons: [
    { title: 'Day 6 — Mixed Revision: Algebra and Indices', duration: 30, content: L_ALGEBRA_REV },
    { title: 'Day 6 — Mixed Revision: Logarithms and Equations', duration: 30, content: L_QUADRATIC_REV },
    {
      title: 'Day 6 — Mixed Practice and Quiz',
      duration: 40,
      content: L_PRACTICE,
      quiz: {
        title: 'Day 6 — Mixed Mathematics Quiz',
        description: 'Ten questions covering algebra, indices, logarithms, simultaneous equations and quadratics.',
        timeLimit: 20,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Solve 5a - 3 = 2a + 9. What is a?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'a = 3', isCorrect: false },
              { id: 'b', text: 'a = 4', isCorrect: true },
              { id: 'c', text: 'a = 6', isCorrect: false },
              { id: 'd', text: 'a = 12', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Collect the letters on one side and the numbers on the other: 5a - 2a = 9 + 3, so 3a = 12 and a = 4.',
          },
          {
            questionText: 'Expand (2x + 1)(x - 3).',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2x^2 - 7x - 3', isCorrect: false },
              { id: 'b', text: '2x^2 - 5x - 3', isCorrect: true },
              { id: 'c', text: '2x^2 - 5x + 3', isCorrect: false },
              { id: 'd', text: '2x^2 + 5x - 3', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Multiply every term by every term: 2x^2 - 6x + x - 3. Collecting the x terms gives 2x^2 - 5x - 3.',
          },
          {
            questionText: 'Simplify 3^2 x 3^3.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '3^6', isCorrect: false },
              { id: 'b', text: '3^5', isCorrect: true },
              { id: 'c', text: '9^5', isCorrect: false },
              { id: 'd', text: '3^1', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Powers with the same base multiply by adding the indices: 2 + 3 = 5, so 3^2 x 3^3 = 3^5.',
          },
          {
            questionText: 'What is the value of 5^0? (Enter a number only)',
            questionType: 'fill_blank',
            correctAnswer: '1',
            points: 1,
            explanation: 'Any non-zero number to the power 0 equals 1, so 5^0 = 1.',
          },
          {
            questionText: 'What is the value of 16^(1/4)?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2', isCorrect: true },
              { id: 'b', text: '4', isCorrect: false },
              { id: 'c', text: '8', isCorrect: false },
              { id: 'd', text: '16', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: 'An index of 1/4 means the fourth root. Since 2 x 2 x 2 x 2 = 16, the fourth root of 16 is 2.',
          },
          {
            questionText: 'Evaluate log base 2 of 32 minus log base 2 of 8.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2', isCorrect: true },
              { id: 'b', text: '8', isCorrect: false },
              { id: 'c', text: '160', isCorrect: false },
              { id: 'd', text: '3', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: 'log 32 = 5 and log 8 = 3, so 5 - 3 = 2.',
          },
          {
            questionText: 'Find log base 3 of 1/27. (Enter a number only, for example: -3)',
            questionType: 'fill_blank',
            correctAnswer: '-3',
            points: 1,
            explanation: '1/27 = 3^-3 because 3 x 3 x 3 = 27, so log base 3 of (1/27) = -3.',
          },
          {
            questionText: 'Solve 2x + y = 8 and x - y = 1. What is the value of x?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x = 2', isCorrect: false },
              { id: 'b', text: 'x = 3', isCorrect: true },
              { id: 'c', text: 'x = 4', isCorrect: false },
              { id: 'd', text: 'x = 5', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Adding the two equations gives 3x = 9, so x = 3. Then x - y = 1 gives y = 2.',
          },
          {
            questionText: 'Factorise and solve x^2 - 8x + 15 = 0. What are the roots?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x = 3 and x = 5', isCorrect: true },
              { id: 'b', text: 'x = -3 and x = -5', isCorrect: false },
              { id: 'c', text: 'x = 1 and x = 15', isCorrect: false },
              { id: 'd', text: 'x = 4 and x = 4', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: 'Two numbers multiplying to 15 and adding to -8 are -3 and -5, so (x - 3)(x - 5) = 0 giving x = 3 and x = 5.',
          },
          {
            questionText: 'Factorise and solve 3x^2 - 5x - 2 = 0. What is the larger root?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x = 2', isCorrect: true },
              { id: 'b', text: 'x = -1/3', isCorrect: false },
              { id: 'c', text: 'x = 1', isCorrect: false },
              { id: 'd', text: 'x = -2', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: 'Splitting the middle term gives 3x^2 - 6x + x - 2 = (3x + 1)(x - 2) = 0, so x = -1/3 or x = 2. The larger root is 2.',
          },
        ],
      },
    },
  ],
}
