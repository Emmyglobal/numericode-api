import type { ChallengeModuleData } from './types'

// ─── Day 4 — Simultaneous Equations ───────────────────────────────────────────
// All pairs verified: x+y=5, x-y=1 -> (3,2); 2x+y=7, x-y=2 -> (3,1);
// 3x+y=11, x-y=1 -> (3,2); sum 15 with one 3 more -> 6 and 9.
const L_UNDERSTANDING = `## Learning Objectives
By the end of this lesson you should be able to:
- Explain what a pair of simultaneous equations is.
- Know what a solution of the pair looks like.
- Order a pair as (x value, y value).

## Two Equations, Two Unknowns
A **single** equation like 2x + 3 = 11 has one unknown, so we can solve it with one step. But when we have two different unknowns, x and y, one equation is not enough — we always need **two** equations, and they must hold at the same time.

That is what **simultaneous** means: both equations are true **simultaneously**, for the same values of x and y.

x + y = 5
x - y = 1

## What a Solution Looks Like
A **solution** is the pair of values that satisfies *both* equations at once.

Here, x = 3 and y = 2:

Check the first equation: 3 + 2 = 5. Correct.
Check the second equation: 3 - 2 = 1. Correct.

So we write the solution as **(3, 2)** — the x value always comes first.

## Always Check Both
Testing only one equation is the most common mistake. A pair that works in the first equation may fail in the second, and you will not know unless you check.

## Methods
There are two standard ways to solve the pair. You will use both:

- **Elimination** — get rid of (eliminate) one letter so the two equations merge into one.
- **Substitution** — use one equation to replace a letter in the other.

Elimulation is often quicker when the coefficients line up. Substitution is often easier when one equation is already arranged to give you a letter.

## Word Problems
A word problem gives you a story with two unknowns. The method is always the same:

1. Write down what you know.
2. Build **two** equations.
3. Solve the pair.
4. Check that your answers make sense in the story.

### Quick Example
Two numbers add to 15 and one is 3 more than the other.
Let the smaller number be x, so the larger is x + 3.
x + (x + 3) = 15, so 2x = 12, giving x = 6.
The larger number is 6 + 3 = 9. Answer: **6 and 9**.

## Quick Check
1. How many equations do we need to solve for two unknowns?
2. What does "simultaneous" mean?
3. In the solution (4, 7), which value is x?

**Answers:** 1. Two. 2. Both equations are true for the same values of x and y. 3. x = 4.`

const L_ELIMINATION = `## Learning Objectives
By the end of this lesson you should be able to:
- Solve a pair by adding or subtracting the equations.
- Solve a pair where the coefficients must be made equal first.
- Check your answer in both equations.

## Step 1 — Add or Subtract Straight Away
If the coefficients of one letter are the same, add or subtract the equations to remove it.

### Worked Example 1
Solve:
x + y = 5
x - y = 1

**Solution**
Add the equations, because the +y and -y cancel:

(x + y) + (x - y) = 5 + 1
2x = 6
x = 3

Substitute x = 3 into the first equation:
3 + y = 5, so y = 2.

The solution is **(3, 2)**.

**Check:** 3 + 2 = 5 ✓ and 3 - 2 = 1 ✓

## Step 2 — Make the Coefficients Equal First
When the coefficients do not match, multiply one (or both) equations so they do.

### Worked Example 2
Solve:
2x + y = 7
x - y = 2

**Solution**
Adding these directly gives 3x = 9, because the y terms cancel straight away.

3x = 9, so x = 3.

Substitute into the first equation: 2(3) + y = 7, so y = 1.

The solution is **(3, 1)**.

**Check:** 2(3) + 1 = 7 ✓ and 3 - 1 = 2 ✓

### Worked Example 3 — When You Must Multiply
Solve:
2x + 3y = 12
x - y = 1

**Solution**
The y coefficients are 3 and -1, so they do not cancel. Multiply the second equation by 3 to get:

2x + 3y = 12
3x - 3y = 3

Now **add** the equations:

5x = 15
x = 3

Substitute into the second equation: 3 - y = 1, so y = 2.

The solution is **(3, 2)**.

**Check:** 2(3) + 3(2) = 6 + 6 = 12 ✓ and 3 - 2 = 1 ✓

## How to Choose
- Signs already cancel (same size, opposite sign) -> add or subtract directly.
- One coefficient is a multiple of the other -> multiply the simpler equation.
- No quick match -> multiply both equations to line the coefficients up.

## Quick Check
1. Solve x + y = 9 and x - y = 1.
2. Solve 3x + y = 14 and x - y = 2.

**Answers:** 1. Adding gives 2x = 10, so x = 5 and y = 4. 2. Adding gives 4x = 16, so x = 4 and y = 2.`

const L_SUBSTITUTION = `## Learning Objectives
By the end of this lesson you should be able to:
- Solve a pair by substituting one equation into the other.
- Recognise when substitution is the quicker method.
- Check your answer in both equations.

## The Idea
Instead of cancelling a letter, you **replace** one letter using the other equation.

The best equation to start from is usually the one where a letter already stands alone, like x - y = 1.

## Step by Step
### Worked Example 1
Solve:
3x + y = 11
x - y = 1

**Step 1 — Rearrange the second equation to get y alone.**
From x - y = 1 we get y = x - 1.

**Step 2 — Put that into the first equation.**

3x + (x - 1) = 11

**Step 3 — Simplify and solve.**

4x - 1 = 11
4x = 12
x = 3

**Step 4 — Find y using y = x - 1.**

y = 3 - 1 = 2

The solution is **(3, 2)**.

**Check:** 3(3) + 2 = 9 + 2 = 11 and 3 - 2 = 1. Both correct.

### Worked Example 2
Solve:
2x + 5y = 4
x - 3y = -1

**Step 1 — Get x alone from the second equation.**
x = 3y - 1

**Step 2 — Substitute into the first equation.**

2(3y - 1) + 5y = 4
6y - 2 + 5y = 4
11y - 2 = 4
11y = 6
y = 6/11

**Step 3 — Find x.**

x = 3(6/11) - 1 = 18/11 - 11/11 = 7/11

The solution is **(7/11, 6/11)**.

**Check:** 2(7/11) + 5(6/11) = 14/11 + 30/11 = 44/11 = 4, and 7/11 - 18/11 = -1. Both correct.

## Which Method Should I Use?
Use **elimination** when the coefficients of a letter are equal or easily made equal.
Use **substitution** when one equation is already arranged to give you a letter on its own.

Both methods always give the same answer, so use whichever feels easier.

## Quick Check
1. Solve y = x + 1 and x + y = 9.
2. Solve 2x + y = 5 and y = x - 1.

**Answers:**
1. Substituting gives x + (x + 1) = 9, so 2x = 8, x = 4 and y = 5.
2. Substituting gives 2x + (x - 1) = 5, so 3x = 6, x = 2 and y = 1.`

const L_PRACTICE = `## Practice — Work through these before taking the quiz

**Question 1.** Solve by elimination: x + y = 5 and x - y = 1.

**Question 2.** Solve by elimination: 2x + y = 7 and x - y = 2.

**Question 3.** Solve by substitution: 3x + y = 11 and x - y = 1.

**Question 4.** Solve: 2x + 3y = 12 and x - y = 1. (Hint: multiply the second equation by 3 first.)

**Question 5.** Two numbers add to 15 and one is 3 more than the other. Find both numbers.

## Worked Solutions

**Question 1.** Adding gives 2x = 6, so x = 3. Then 3 + y = 5, so y = 2.
Solution: **(3, 2)**.

**Question 2.** Adding gives 3x = 9, so x = 3. Then 2(3) + y = 7, so y = 1.
Solution: **(3, 1)**.

**Question 3.** From the second equation, y = x - 1. Substituting: 3x + (x - 1) = 11, so 4x = 12, giving x = 3 and y = 2.
Solution: **(3, 2)**.

**Question 4.** Multiply the second equation by 3 to get 3x - 3y = 3. Adding: 5x = 15, so x = 3, and 3 - y = 1 gives y = 2.
Solution: **(3, 2)**.

**Question 5.** Let the smaller number be x, so the larger is x + 3.
x + (x + 3) = 15, so 2x = 12, giving x = 6. The larger number is 9.
Solution: **6 and 9**.

## Common Mistakes This Day
- Checking only one equation before accepting the answer.
- Writing the solution as (y, x) instead of (x, y).
- Forgetting to multiply an equation before adding it.
- Losing track of a sign when you move a term across the equals sign.

## Now Take the Quiz
You have 5 questions on solving simultaneous equations. Aim for 4 out of 5 to pass.`

export const day4: ChallengeModuleData = {
  title: 'Day 4 — Simultaneous Equations',
  lessons: [
    { title: 'Day 4 — Understanding Simultaneous Equations', duration: 25, content: L_UNDERSTANDING },
    { title: 'Day 4 — Elimination Method', duration: 30, content: L_ELIMINATION },
    { title: 'Day 4 — Substitution Method', duration: 30, content: L_SUBSTITUTION },
    {
      title: 'Day 4 — Practice and Quiz',
      duration: 30,
      content: L_PRACTICE,
      quiz: {
        title: 'Day 4 — Simultaneous Equations Quiz',
        description: 'Five questions on solving pairs of simultaneous equations.',
        timeLimit: 12,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Solve the pair: x + y = 5 and x - y = 1. What is x?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x = 2', isCorrect: false },
              { id: 'b', text: 'x = 3', isCorrect: true },
              { id: 'c', text: 'x = 4', isCorrect: false },
              { id: 'd', text: 'x = 5', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Add the two equations: (x + y) + (x - y) = 5 + 1, so 2x = 6 and x = 3. Then y = 2, so the solution is (3, 2).',
          },
          {
            questionText: 'Solve the pair: 2x + y = 7 and x - y = 2. Which solution is correct?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x = 3 and y = 1', isCorrect: true },
              { id: 'b', text: 'x = 2 and y = 3', isCorrect: false },
              { id: 'c', text: 'x = 1 and y = 5', isCorrect: false },
              { id: 'd', text: 'x = 5 and y = 3', isCorrect: false },
            ],
            correctAnswer: 'a',
            points: 1,
            explanation: 'Adding gives 3x = 9, so x = 3. Substituting: 2(3) + y = 7, so y = 1. Check: 6 + 1 = 7 and 3 - 1 = 2.',
          },
          {
            questionText: 'When the coefficients of one letter are equal in size but opposite in sign, what should you do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Multiply both equations by the same number', isCorrect: false },
              { id: 'b', text: 'Add or subtract the equations to remove that letter', isCorrect: true },
              { id: 'c', text: 'Divide both equations by the letters', isCorrect: false },
              { id: 'd', text: 'Guess the values and test them', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Adding or subtracting cancels that letter, because +y and -y give 0y. This leaves one equation in a single unknown.',
          },
          {
            questionText: 'Solve 3x + y = 11 and x - y = 1. What is the value of x? (Enter a number only)',
            questionType: 'fill_blank',
            correctAnswer: '3',
            points: 1,
            explanation: 'From x - y = 1 we get y = x - 1. Substituting: 3x + (x - 1) = 11, so 4x = 12 and x = 3. Then y = 2.',
          },
          {
            questionText: 'Two numbers add to 15 and one is 3 more than the other. What are the two numbers?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '5 and 10', isCorrect: false },
              { id: 'b', text: '6 and 9', isCorrect: true },
              { id: 'c', text: '7 and 8', isCorrect: false },
              { id: 'd', text: '4 and 11', isCorrect: false },
            ],
            correctAnswer: 'b',
            points: 1,
            explanation: 'Let the smaller number be x, so the larger is x + 3. Then x + (x + 3) = 15, giving 2x = 12, so x = 6 and the larger is 9. Check: 6 + 9 = 15, and 9 is 3 more than 6.',
          },
        ],
      },
    },
  ],
}
