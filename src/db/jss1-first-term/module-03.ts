import { JSS1_DUE_DATE } from './types'
import type { Jss1ModuleData } from './types'

// Week 3 — Equations and Inequalities. Answers verified: A = lw with l=5, w=3
// gives 15; 3(x+2) = 3x+6; x^2+5x = x(x+5); 2x+3=11 gives x=4; -3x < 9 gives
// x > -3; -2x > 14 gives x < -7; -5 <= 5m gives m >= -1.
export const module03: Jss1ModuleData = {
  title: 'Module 3 — Week 3: Equations and Inequalities',
  lessons: [
    {
      title: 'Week 3 — Equations and Inequalities',
      duration: 50,
      content: `## Learning Objectives
By the end of this week you should be able to:
- Build an expression from words.
- Substitute values into expressions and formulae.
- Expand brackets and factorise expressions.
- Solve an equation built from a word problem.
- Solve a simple linear inequality.

## Constructing Expressions
Translate the words in a problem into an algebraic expression.

### Worked Example 1
"Three more than twice a number"

"Twice a number" is 2x. "Three more than" means add 3.

The expression is **2x + 3**

## Substituting into Expressions and Formulae
### Worked Example 2
If A = lw, find A when l = 5 and w = 3

A = 5 x 3
A = **15**

## Expanding Brackets
Multiply **every** term inside the bracket by the term outside.

### Worked Example 3
3(x + 2) = 3x + 6

Two terms go in, so two terms must come out.

## Factorising
Factorising is the reverse of expanding: write the expression as a product.

### Worked Example 4
x² + 5x = x(x + 5)

### Worked Example 5
4a + 8ab

The common factor is 4a, so 4a(1 + 2b).

## Constructing and Solving Equations
### Worked Example 6
If twice a number plus 3 is 11, find the number.

2x + 3 = 11
2x = 11 - 3
2x = 8
x = **4**

**Check:** 2(4) + 3 = 11. Correct.

## Solving Inequalities
Solve like an equation, but **reverse the inequality sign** when you multiply or divide by a negative number.

### Worked Example 7
-3x < 9

Divide both sides by -3. Because we divide by a negative, the sign reverses:

x **>** -3

## Common Mistakes
- Forgetting that multiplying or dividing by a negative reverses the sign.
- Only multiplying the first term when expanding brackets.
- Not checking a solution by substituting it back.

## Practice
1. Find A when A = lw, l = 7 and w = 4.
2. Expand 5(y + 3).
3. Factorise 3p + 9.
4. Solve 5x + 2 = 17.
5. Solve -4x > 20.`,
      quiz: {
        title: 'Week 3 Quiz — Equations and Inequalities',
        description: 'Five questions on expressions, expanding, factorising, equations and inequalities.',
        timeLimit: 15,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'If A = lw, what is A when l = 5 and w = 3?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '15', isCorrect: true },
              { id: 'b', text: '8', isCorrect: false },
              { id: 'c', text: '2', isCorrect: false },
              { id: 'd', text: '18', isCorrect: false },
            ],
            correctAnswer: 'a',
            explanation: 'Substitute both values: A = 5 x 3 = 15.',
          },
          {
            questionText: 'Expand 3(x + 2).',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '3x + 6', isCorrect: true },
              { id: 'b', text: '3x + 2', isCorrect: false },
              { id: 'c', text: 'x + 6', isCorrect: false },
              { id: 'd', text: '5x', isCorrect: false },
            ],
            correctAnswer: 'a',
            explanation: 'Multiply each term in the bracket by 3: 3x + 6. Two terms in means two terms out.',
          },
          {
            questionText: 'Factorise x^2 + 5x.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x(x + 5)', isCorrect: true },
              { id: 'b', text: '5(x + 1)', isCorrect: false },
              { id: 'c', text: '2x(x + 5)', isCorrect: false },
              { id: 'd', text: 'x(x + 5x)', isCorrect: false },
            ],
            correctAnswer: 'a',
            explanation: 'The common factor is x, so x^2 + 5x = x(x + 5). Check: x x + 5x = x^2 + 5x.',
          },
          {
            questionText: 'Solve 2x + 3 = 11. Enter the value of x only.',
            questionType: 'fill_blank',
            correctAnswer: '4',
            explanation: 'Subtract 3 from both sides: 2x = 8. Divide by 2: x = 4. Check: 2(4) + 3 = 11.',
          },
          {
            questionText: 'Solve -3x < 9.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'x < -3', isCorrect: false },
              { id: 'b', text: 'x > -3', isCorrect: true },
              { id: 'c', text: 'x < 3', isCorrect: false },
              { id: 'd', text: 'x > 3', isCorrect: false },
            ],
            correctAnswer: 'b',
            explanation: 'Divide both sides by -3. Because we divide by a negative number, the inequality sign reverses: x > -3.',
          },
        ],
      },
      assignment: {
        title: 'Assignment 3.1 — Equations and Inequalities',
        description: 'Show the step that justifies each action, and check your solutions by substitution.',
        dueDate: JSS1_DUE_DATE,
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'theory', title: 'Write an expression for each: (i) five more than three times a number n, (ii) the sum of a number p and 12, (iii) twice a number m divided by 5.', marks: 5 },
          { id: 'a2', type: 'theory', title: 'Expand: (i) 3(x + 2), (ii) 4(y - 5), (iii) 2(3p + 1). Then factorise x^2 + 5x and 4a + 8ab.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Solve for the letter: (i) 5x + 2 = 17, (ii) 4y - 3 = 9, (iii) 2x + 7 = 1.', marks: 5 },
          { id: 'a4', type: 'subjective', title: 'Solve each inequality, reversing the sign when dividing by a negative: (i) -3x < 9, (ii) -2x > 14, (iii) -5 <= 5m.', marks: 4 },
        ],
      },
    },
  ],
}