import type { ChallengeModuleData } from './types'

// ─── Day 5 — Quadratic Equations ──────────────────────────────────────────────
// Answers verified: x^2-5x+6=0 -> (x-2)(x-3) -> x=2,3; 2x^2-9x+4 -> (2x-1)(x-4)
// -> x=0.5,4; x^2+7x+12 -> (x+3)(x+4) -> x=-3,-4; 2x^2+7x+3=0 -> (2x+1)(x+3)
// -> x=-0.5,-3; formula on x^2-4x-5=0 -> (4+-sqrt(16+20))/2 = (4+-6)/2 = 5,-1.
const L_UNDERSTANDING = `## Learning Objectives
By the end of this lesson you should be able to:
- Recognise a quadratic equation.
- State the standard form and identify a, b and c.
- Know that a quadratic has at most two roots.

## What Makes an Equation Quadratic?
A **quadratic equation** is an equation in which the highest power of the unknown is **squared** (that is 2).

Standard form is:

**ax^2 + bx + c = 0**, where a is not zero.

### Worked Example
Put 2x^2 - 5x - 3 = 0 into standard form and identify a, b and c.

**Solution**
It is already in standard form, so read straight off:
- a = 2
- b = -5
- c = -3

## Linear or Quadratic?
| Equation | Highest power | Type |
|---|---|---|
| 3x + 7 = 0 | x (power 1) | Linear |
| x^2 + 4x + 1 = 0 | x^2 (power 2) | **Quadratic** |
| x^3 - 8 = 0 | x^3 (power 3) | Cubic (not quadratic) |

## Roots
A **root** (or solution) is a value of x that makes the equation true — that is, it makes the left side equal zero.

A quadratic equation has **at most two roots**. It can have:
- **two** roots (most common), such as x^2 - 5x + 6 = 0 which has x = 2 and x = 3
- **one** repeated root, such as x^2 - 6x + 9 = 0 which is (x - 3)^2 = 0, so x = 3 twice
- **no real** roots, such as x^2 + 2x + 5 = 0

## Always Check by Substitution
### Worked Example
Check that x = 2 is a root of x^2 - 5x + 6 = 0.

**Solution**
Substitute x = 2:

2^2 - 5(2) + 6 = 4 - 10 + 6 = 0

The result is zero, so **x = 2 is a root**.

## Setting Up Your Own Example
Once you can spot a, b and c, you are ready for the two methods on the next lessons: factorisation, and the formula.

## Quick Check
1. Is 4x + 9 = 0 a quadratic equation?
2. Identify a, b and c in x^2 - 7x + 10 = 0.
3. How many roots can a quadratic equation have?

**Answers:** 1. No, it is linear (power 1). 2. a = 1, b = -7, c = 10. 3. At most two.`

const L_FACTORISATION = `## Learning Objectives
By the end of this lesson you should be able to:
- Factorise a quadratic expression.
- Solve a quadratic equation by factorisation.
- Use two numbers that multiply and add to zero.

## Factoring Means Splitting
To **factorise** is to rewrite a sum as a product. For example:

x^2 + 5x + 6 = (x + 2)(x + 3)

This is the key to solving quadratics, because **a product is zero only if one of its parts is zero**.

## The Two-Number Method
To factor x^2 + bx + c you need two numbers that:
- **multiply** to give c, and
- **add** to give b.

### Worked Example 1
Factorise x^2 + 5x + 6.

**Solution**
We need two numbers that multiply to 6 and add to 5.
Those are **2 and 3** (2 x 3 = 6, and 2 + 3 = 5).

So x^2 + 5x + 6 = **(x + 2)(x + 3)**.

**Check by expanding:** (x + 2)(x + 3) = x^2 + 3x + 2x + 6 = x^2 + 5x + 6. Correct.

### Worked Example 2 — Minus Signs
Factorise x^2 + 7x + 12.

**Solution**
Two numbers multiplying to 12 and adding to 7: **3 and 4**.

So x^2 + 7x + 12 = **(x + 3)(x + 4)**.

### Worked Example 3 — a Negative Middle Term
Factorise x^2 - 9x + 20.

**Solution**
Two numbers multiplying to 20 and adding to **-9**: they must both be negative.
Those are **-4 and -5** (-4 x -5 = 20, and -4 + -5 = -9).

So x^2 - 9x + 20 = **(x - 4)(x - 5)**.

### Worked Example 4 — When a is Not 1
Factorise 2x^2 - 9x + 4.

**Solution**
We need two numbers multiplying to (2 x 4) = 8 and adding to -9.
Those are **-1 and -8**.

Split the middle term using those numbers:

2x^2 - x - 8x + 4
Factor in groups: x(2x - 1) - 4(2x - 1)
= **(2x - 1)(x - 4)**

## Solving by Factorisation
Once the equation is a product equal to zero, set each factor to zero.

### Worked Example 5
Solve x^2 - 5x + 6 = 0.

**Solution**
Factorise: (x - 2)(x - 3) = 0.

So either x - 2 = 0, giving **x = 2**,
or x - 3 = 0, giving **x = 3**.

### Worked Example 6
Solve 2x^2 - 9x + 4 = 0.

**Solution**
(2x - 1)(x - 4) = 0

Either 2x - 1 = 0, giving **x = 1/2**,
or x - 4 = 0, giving **x = 4**.

## If You Cannot Find the Numbers
Try more than one pair. If no pair works, the equation cannot be solved neatly by factorisation — use the formula on the next lesson.

## Quick Check
1. Factorise x^2 + 9x + 20.
2. Factorise x^2 - 5x + 6.
3. Solve x^2 + 5x + 6 = 0.

**Answers:** 1. (x + 4)(x + 5). 2. (x - 2)(x - 3). 3. x = -2 and x = -3.`

const L_SOLVING = `## Learning Objectives
By the end of this lesson you should be able to:
- Solve any quadratic equation using the quadratic formula.
- Decide when to factorise and when to use the formula.
- Solve real-life problems set up as quadratics.

## The Quadratic Formula
When factorisation does not work, the **quadratic formula** always will:

**x = (-b +/- sqrt(b^2 - 4ac)) / 2a**

The +/- means you work it out **twice** — once with + and once with minus — which is why a quadratic has up to two roots.

### Worked Example 1
Solve 2x^2 + 7x + 3 = 0.

**Step 1 — Identify a, b and c.**
a = 2, b = 7, c = 3.

**Step 2 — Work out b^2 - 4ac.**
7^2 - 4(2)(3) = 49 - 24 = 25

**Step 3 — Take the square root.**
sqrt(25) = 5

**Step 4 — Substitute.**
x = (-7 + 5) / 4  or  x = (-7 - 5) / 4
x = -2/4 = -1/2  or  x = -12/4 = -3

So **x = -1/2 or x = -3**.

**Check by factorising instead:** 2x^2 + 7x + 3 = (2x + 1)(x + 3), so x = -1/2 and x = -3. The same answers.

### Worked Example 2
Solve x^2 - 4x - 5 = 0.

**Step 1.** a = 1, b = -4, c = -5.
**Step 2.** b^2 - 4ac = (-4)^2 - 4(1)(-5) = 16 + 20 = 36
**Step 3.** sqrt(36) = 6
**Step 4.**
x = (4 + 6)/2 = 10/2 = 5
x = (4 - 6)/2 = -2/2 = -1

So **x = 5 or x = -1**.

**Check by factorising:** x^2 - 4x - 5 = (x - 5)(x + 1), so x = 5 and x = -1. Correct.

## When the Answer Is Not Neat
### Worked Example 3
Solve x^2 - 3x - 1 = 0.

**Step 1.** a = 1, b = -3, c = -1
**Step 2.** b^2 - 4ac = 9 - 4(1)(-1) = 9 + 4 = 13
**Step 3.** sqrt(13) is not a whole number, so leave it as sqrt(13)
**Step 4.** x = (3 + sqrt(13))/2  or  x = (3 - sqrt(13))/2

Approximating, sqrt(13) is about 3.606, so x is about 3.30 or about -0.30.

This is normal. Not every quadratic has tidy roots.

## Which Method Should You Use?
- Try **factorisation first** if the numbers look friendly — it is faster.
- Use the **formula** when factorisation fails, or when you are not sure.

## Word Problems
### Worked Example 4
The product of two consecutive numbers is 156. Find the numbers.

**Solution**
Let the smaller number be x, so the larger is x + 1.
x(x + 1) = 156
x^2 + x - 156 = 0

Look for two numbers multiplying to -156 and adding to 1: they are 13 and -12.
Factorise: (x + 13)(x - 12) = 0

So x = -13 or x = 12.
Since a "smaller number" should be positive, x = 12, and the larger is 13.

**Check:** 12 x 13 = 156. Correct.

## Quick Check
1. Solve 2x^2 - 7x + 3 = 0.
2. Solve x^2 + 5x + 6 = 0.
3. Solve x^2 - 6x + 9 = 0.

**Answers:**
1. (2x - 1)(x - 3) = 0, so x = 1/2 and x = 3.
2. (x + 2)(x + 3) = 0, so x = -2 and x = -3.
3. (x - 3)^2 = 0, so x = 3 (a repeated root).`

const L_PRACTICE = `## Practice — Work through these before taking the quiz

**Question 1.** Identify a, b and c in 2x^2 - 9x + 4 = 0.

**Question 2.** Factorise and solve: x^2 - 5x + 6 = 0.

**Question 3.** Factorise and solve: 2x^2 - 9x + 4 = 0.

**Question 4.** Solve using the formula: 2x^2 + 7x + 3 = 0.

**Question 5.** The product of two consecutive numbers is 156. Find the numbers.

## Worked Solutions

**Question 1.** a = 2, b = -9, c = 4.

**Question 2.** (x - 2)(x - 3) = 0, so **x = 2 and x = 3**.

**Question 3.** (2x - 1)(x - 4) = 0, so **x = 1/2 and x = 4**.

**Question 4.** b^2 - 4ac = 49 - 24 = 25, sqrt = 5.
x = (-7 + 5)/4 = -1/2 and x = (-7 - 5)/4 = -3. So **x = -1/2 and x = -3**.

**Question 5.** x(x + 1) = 156, so x^2 + x - 156 = 0 = (x + 13)(x - 12).
Taking the positive pair, the numbers are **12 and 13**. Check: 12 x 13 = 156.

## Common Mistakes This Day
- Forgetting the -4ac part when using the formula.
- Dropping the negative sign on b, for example using 7 instead of -7.
- Forgetting the 2a in the denominator.
- Only writing one root when the +/- gives you two different values.

## Now Take the Quiz
You have 5 questions on quadratic equations. Aim for 4 out of 5 to pass.`

export const day5: ChallengeModuleData = {
  title: 'Day 5 — Quadratic Equations',
  lessons: [
    { title: 'Day 5 — Understanding Quadratic Equations', duration: 25, content: L_UNDERSTANDING },
    { title: 'Day 5 — Factorisation', duration: 30, content: L_FACTORISATION },
    { title: 'Day 5 — Solving Quadratic Equations', duration: 30, content: L_SOLVING },
    {
      title: 'Day 5 — Practice and Quiz',
      duration: 30,
      content: L_PRACTICE,
      quiz: {
        title: 'Day 5 — Quadratic Equations Quiz',
        description: 'Five questions on factorising and solving quadratic equations.',
        timeLimit: 12,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'How many roots can a quadratic equation have?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Exactly one', isCorrect: false },
              { id: 'b', text: 'At most two', isCorrect: true },
              { id: 'c', text: 'Exactly three', isCorrect: false },
              { id: 'd', text: 'Any number', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'A quadratic equation has at most two roots. It may have two different roots, one repeated root, or no real roots.',
          },
          {
            questionText: 'Factorise x^2 - 5x + 6. Which factorisation is correct?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '(x - 2)(x - 3)', isCorrect: true },
              { id: 'b', text: '(x + 2)(x + 3)', isCorrect: false },
              { id: 'c', text: '(x - 1)(x - 6)', isCorrect: false },
              { id: 'd', text: '(x - 2)(x + 3)', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: 'We need two numbers multiplying to 6 and adding to -5: that is -2 and -3. So x^2 - 5x + 6 = (x - 2)(x - 3).',
          },
          {
            questionText: 'Solve x^2 - 5x + 6 = 0. What are the roots?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x = 2 and x = 3', isCorrect: true },
              { id: 'b', text: 'x = -2 and x = -3', isCorrect: false },
              { id: 'c', text: 'x = 1 and x = 6', isCorrect: false },
              { id: 'd', text: 'x = 2 and x = -3', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: '(x - 2)(x - 3) = 0, so x - 2 = 0 giving x = 2, or x - 3 = 0 giving x = 3.',
          },
          {
            questionText: 'Solve 2x^2 - 9x + 4 = 0. What is the larger root? (Enter a number only)',
            questionType: 'fill_blank',
            correctAnswer: '4',
            points: 1,
            explanation: 'Factorise: (2x - 1)(x - 4) = 0, so x = 1/2 or x = 4. The larger root is 4.',
          },
          {
            questionText: 'Solve x^2 + 7x + 12 = 0. Which pair of roots is correct?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x = 3 and x = 4', isCorrect: false },
              { id: 'b', text: 'x = -3 and x = -4', isCorrect: true },
              { id: 'c', text: 'x = -1 and x = -12', isCorrect: false },
              { id: 'd', text: 'x = 1 and x = 12', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Two numbers multiplying to 12 and adding to 7 are 3 and 4, so x^2 + 7x + 12 = (x + 3)(x + 4). Setting each factor to zero gives x = -3 and x = -4.',
          },
        ],
      },
    },
  ],
}
