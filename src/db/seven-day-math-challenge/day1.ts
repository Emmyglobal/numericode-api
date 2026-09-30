import type { ChallengeModuleData } from './types'

// ─── Day 1 — Algebra Basics ───────────────────────────────────────────────────
// Quiz answers verified: 2x+5=13 -> x=4; 5a-3b+7 -> 3 terms; 7p+3p -> 10p;
// 3a-2=10 -> a=4; 4x^2-9 = (2x-3)(2x+3).
const LESSON_VARIABLES = `## Learning Objectives
By the end of this lesson you should be able to:
- Tell a variable from a constant.
- Identify the terms in an algebraic expression.
- Write a simple algebraic expression in words.

## Variables and Constants
A **variable** is a letter that stands for a number whose value we do not know yet.
A **constant** is a number that does not change.

In 3x + 5, the letter x is a variable and the number 5 is a constant.

Common letters you will meet:
- x, y, z — usually a number we are looking for
- a, b, c, n — usually any number
- pi is about 3.142 — a constant, because it is the same for every circle

## What is an Expression?
An **expression** is a collection of numbers and letters joined by the usual signs.
It has **no equals sign** and no "answer" yet.

Examples of expressions: 4x + 7, 2y - 3, x^2 - 5x + 6, 3(a + b)

## Terms
A **term** is a piece of an expression joined to the next by a + or - sign.

Take 5a - 3b + 7:
- 5a is the first term
- -3b is the second term
- 7 is the third term

So this expression has **3 terms**. Count the signs, not the pieces.

### Worked Example
How many terms are in 4x^2 - 9x + 2?

**Solution**
Split it at each + or - sign:

4x^2 | -9x | +2

That is **3 terms**.

### Worked Example
Write an expression for "five more than twice a number x".

**Solution**
"Twice x" is 2x. "Five more than" means add 5.

The expression is **2x + 5**.

## Common Mistake to Avoid
Do not treat -3b as two terms. The minus sign belongs to the term 3b, so -3b is one term. Writing "- 3b" as two terms is the most common error in this topic.

## Quick Check
1. In 7y - 12, which letter is the variable and which number is the constant?
2. How many terms are in a^2 - 6a + 1?
3. Write an expression for "a number n divided by 3".

**Answers:** 1. y is the variable, 12 is the constant. 2. Three terms. 3. n / 3.`

const LESSON_LIKE_TERMS = `## Learning Objectives
By the end of this lesson you should be able to:
- Recognise like terms.
- Add and subtract like terms correctly.
- Simplify an expression by collecting like terms.

## What are Like Terms?
**Like terms** have exactly the same letter part. They differ only in their numbers (coefficients).

Like terms: 3x and 5x, 4a^2 and -a^2, 7 and 12
Not like terms: 3x and 3y, 5x and 5x^2, 2a and 3ab

Notice: 5x and 5x^2 are **not** like terms, because x and x^2 are different.

## Adding Like Terms
Add the coefficients, keep the letter part.

3x + 5x = (3 + 5)x = **8x**

### Worked Example
Simplify 7p + 3p.

**Solution**
7p and 3p are like terms, so add the coefficients:

7p + 3p = 10p

### Worked Example
Simplify 5a - 2a + a.

**Solution**
5a - 2a = 3a. Then 3a + a = 4a.

So the answer is **4a**.

## Subtracting Like Terms
Subtract the coefficients, keeping the letter part.

9x - 4x = (9 - 4)x = **5x**

### Worked Example
Simplify 7p - 2 + 3p.

**Solution**
Collect the p terms first: 7p + 3p = 10p. The -2 has no p, so it stays on its own.

The simplified expression is **10p - 2**.

## The Rule
You may only add or subtract like terms. If the expression mixes letter parts (like 3x + 2y), leave it as it is.

## Quick Check
1. Simplify 6x + 4x.
2. Simplify 10a - 3a + 2a.
3. Are 3x^2 and 3x like terms?

**Answers:** 1. 10x. 2. 9a. 3. No — x^2 and x are different letter parts.`

const LESSON_EQUATIONS = `## Learning Objectives
By the end of this lesson you should be able to:
- Solve a one-step linear equation.
- Solve a two-step linear equation.
- Check your answer by putting it back into the equation.

## What is an Equation?
An equation has an **equals sign** and states that two quantities are equal.

2x + 5 = 13

The goal is to find x. The strategy is always the same: **get the letter on its own by doing exactly the same thing to both sides.**

## Rule 1 — Add or Subtract
Whatever you do to one side, do to the other.

### Worked Example
Solve 2x + 5 = 13.

**Solution**
Subtract 5 from both sides:

2x + 5 - 5 = 13 - 5
2x = 8

Divide both sides by 2:

x = 4

**Check:** 2(4) + 5 = 8 + 5 = 13. Correct.

## Rule 2 — Multiply or Divide
### Worked Example
Solve 3a - 2 = 10.

**Solution**
Add 2 to both sides:

3a = 12

Divide both sides by 3:

a = 4

**Check:** 3(4) - 2 = 12 - 2 = 10. Correct.

## The Three Steps
1. **Undo** what was done to the letter — work backwards.
2. **Do the same** to both sides every time.
3. **Check** by substituting the answer back.

## Always Check
Substituting your answer is the fastest way to catch a mistake. If the two sides are not equal, go back and find the step where you broke the rule.

## Quick Check
1. Solve 4x = 28.
2. Solve 7p - 1 = 20.
3. Solve 5y + 3 = 18.

**Answers:** 1. x = 7. 2. p = 3. 3. y = 3.`

const LESSON_PRACTICE = `## Practice — Work through these before taking the quiz

Try each one on paper first, then check your answer.

**Question 1.** How many terms are in 4x^2 - 9x + 2?

**Question 2.** Solve for x: 2x + 5 = 13.

**Question 3.** Solve for a: 3a - 2 = 10.

**Question 4.** Two numbers add to 24 and one is twice the other. Find both numbers.

**Question 5.** Simplify 7p - 2 + 3p.

## Worked Solutions

**Question 1.** The terms are 4x^2, -9x and 2. None are like terms (x^2, x and 1 differ), so nothing combines. Answer: **3 terms**.

**Question 2.** 2x + 5 = 13, so 2x = 8, giving **x = 4**.

**Question 3.** 3a - 2 = 10, so 3a = 12, giving **a = 4**.

**Question 4.** Let the smaller number be y, so the bigger one is 2y.
Then y + 2y = 24, so 3y = 24, giving y = 8.
The bigger number is 2(8) = **16** (and the smaller is 8; 8 + 16 = 24).

**Question 5.** Collect the p terms: 7p + 3p = 10p. The -2 cannot join them.
Answer: **10p - 2**.

## Common Mistakes This Day
- Counting "-3b" as two terms — it is one term.
- Adding 5 to only one side of an equation.
- Forgetting to divide by the coefficient at the end.
- Treating 5x and 5x^2 as like terms.

## Now Take the Quiz
You have 5 questions. Aim for 4 out of 5 to pass. Read every question fully before choosing your answer, and check your work before you submit.`

export const day1: ChallengeModuleData = {
  title: 'Day 1 — Algebra Basics',
  lessons: [
    { title: 'Day 1 — Variables, Constants and Terms', duration: 25, content: LESSON_VARIABLES },
    { title: 'Day 1 — Like Terms and Simplifying Expressions', duration: 25, content: LESSON_LIKE_TERMS },
    { title: 'Day 1 — Simple Linear Equations', duration: 30, content: LESSON_EQUATIONS },
    {
      title: 'Day 1 — Practice and Quiz',
      duration: 30,
      content: LESSON_PRACTICE,
      quiz: {
        title: 'Day 1 — Algebra Basics Quiz',
        description: 'Five questions on variables, terms, simplifying and simple equations.',
        timeLimit: 10,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Solve for x: 2x + 5 = 13',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x = 4', isCorrect: true },
              { id: 'b', text: 'x = 9', isCorrect: false },
              { id: 'c', text: 'x = 3', isCorrect: false },
              { id: 'd', text: 'x = 2', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: 'Subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4. Check: 2(4) + 5 = 13.',
          },
          {
            questionText: 'How many terms are there in the expression 5a - 3b + 7?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Two', isCorrect: false },
              { id: 'b', text: 'Three', isCorrect: true },
              { id: 'c', text: 'Four', isCorrect: false },
              { id: 'd', text: 'Five', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Terms are split by + and - signs: 5a, -3b and 7. The minus sign belongs to 3b, so there are three terms.',
          },
          {
            questionText: 'Simplify: 7p + 3p',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '10p', isCorrect: true },
              { id: 'b', text: '10', isCorrect: false },
              { id: 'c', text: '21p', isCorrect: false },
              { id: 'd', text: 'p^10', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: '7p and 3p are like terms, so add the coefficients: 7 + 3 = 10, giving 10p.',
          },
          {
            questionText: 'Solve for a: 3a - 2 = 10 (Enter the value of a only, for example: 4)',
            questionType: 'fill_blank',
            correctAnswer: '4',
            points: 1,
            explanation: 'Add 2 to both sides: 3a = 12. Divide by 3: a = 4. Check: 3(4) - 2 = 10.',
          },
          {
            questionText: '4x^2 - 9 can be written as the product of two factors. Which expression is it equal to?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '(2x - 3)(2x + 3)', isCorrect: true },
              { id: 'b', text: '(2x - 3)(2x - 3)', isCorrect: false },
              { id: 'c', text: '(4x - 3)(x + 3)', isCorrect: false },
              { id: 'd', text: '(2x - 9)(x + 1)', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: '4x^2 - 9 is the difference of two squares: (2x)^2 - 3^2 = (2x - 3)(2x + 3). Check: 4x^2 + 6x - 6x - 9 = 4x^2 - 9.',
          },
        ],
      },
    },
  ],
}
