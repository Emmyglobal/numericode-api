import type { Ss1ModuleData } from './types'

export const module02: Ss1ModuleData = {
  title: 'Module 2 — Week 2-3: Quadratic Equations',
  lessons: [
    {
      title: 'Week 2-3 — Solving Quadratic Equations',
      duration: 75,
      content: `# Week 2-3 — Solving Quadratic Equations

## Learning Objectives
By the end of this lesson you should be able to:
- Solve quadratic equations by factorisation.
- Solve quadratic equations by completing the square.
- Solve quadratic equations using the quadratic formula.
- Find the roots, sum and product of roots of a quadratic equation.
- Form a quadratic equation given its roots.
- Solve word problems leading to quadratic equations.

## Introduction
A **quadratic equation** has the form ax^2 + bx + c = 0 (where a ≠ 0).
There are three main methods: factorisation, completing the square, and the quadratic formula.

## Method 1: Factorisation
If the product of two factors is zero, at least one factor must be zero.

### Worked Example 1
Solve: (a) x^2 + 5x + 6 = 0    (b) x^2 - 2x - 15 = 0    (c) 2x^2 + 7x + 3 = 0

**Solution**
(a) (x + 2)(x + 3) = 0 → x = -2 or x = -3
(b) (x + 3)(x - 5) = 0 → x = -3 or x = 5
(c) (2x + 1)(x + 3) = 0 → x = -1/2 or x = -3

## Method 2: Completing the Square
### Steps:
1. Move c to the right side: ax^2 + bx = -c
2. Divide by a: x^2 + (b/a)x = -c/a
3. Add (b/2a)^2 to both sides: x^2 + (b/a)x + (b/2a)^2 = -c/a + (b/2a)^2
4. Take square root of both sides
5. Solve for x

### Worked Example 2
Solve by completing the square:
(a) x^2 + 6x + 5 = 0    (b) x^2 - 4x - 3 = 0

**Solution**
(a) x^2 + 6x = -5
    x^2 + 6x + 9 = -5 + 9 = 4
    (x + 3)^2 = 4
    x + 3 = ±2 → **x = -1 or x = -5**

(b) x^2 - 4x = 3
    x^2 - 4x + 4 = 3 + 4 = 7
    (x - 2)^2 = 7
    x - 2 = ±√7 → **x = 2 + √7 or x = 2 - √7**

## Method 3: Quadratic Formula
For ax^2 + bx + c = 0: **x = (-b ± √(b² - 4ac)) / (2a)**

### Worked Example 3
Solve using the formula:
(a) 2x^2 - 9x + 4 = 0    (b) 3x^2 + 5x - 2 = 0

**Solution**
(a) x = (9 ± √(81 - 32)) / 4 = (9 ± √49) / 4 = (9 ± 7) / 4
    x = 16/4 = 4  or  x = 2/4 = 1/2
    **x = 4 or x = 1/2**

(b) x = (-5 ± √(25 + 24)) / 6 = (-5 ± √49) / 6 = (-5 ± 7) / 6
    x = 2/6 = 1/3  or  x = -12/6 = -2
    **x = 1/3 or x = -2**

## Sum and Product of Roots
If the roots of x^2 + px + q = 0 are α and β, then:
- Sum of roots: α + β = -p
- Product of roots: α × β = q

For ax^2 + bx + c = 0:
- Sum = -b/a
- Product = c/a

### Worked Example 4
If the roots of x^2 - 5x + 6 = 0 are α and β, find:
(a) α + β    (b) αβ    (c) α² + β²

**Solution**
(a) α + β = -(-5)/1 = **5**
(b) αβ = 6/1 = **6**
(c) α² + β² = (α + β)² - 2αβ = 25 - 12 = **13**

## Forming Equations from Roots
If the roots are α and β, the equation is: x² - (α+β)x + αβ = 0

### Worked Example 5
Find the quadratic equation whose roots are: (a) 3 and -5  (b) 2 ± √3

**Solution**
(a) Sum = 3 + (-5) = -2, Product = 3 × (-5) = -15
    Equation: x² - (-2)x + (-15) = 0 → **x² + 2x - 15 = 0**

(b) Sum = (2+√3) + (2-√3) = 4, Product = (2+√3)(2-√3) = 4 - 3 = 1
    Equation: **x² - 4x + 1 = 0**

## Word Problems
### Worked Example 6
A rectangular garden is 3 m longer than it is wide. If the area is 108 m², find the dimensions.

**Solution**
Let width = x, then length = x + 3.
Area = x(x + 3) = 108
x² + 3x - 108 = 0
(x + 12)(x - 9) = 0
x = -12 (rejected) or x = **9**
Width = 9 m, Length = 12 m.

## Class Activity
Essential Mathematics SS1, Page 166, Ex 12.6, Nos 2, 6, 10, 4, 9; Page 169, Ex 12.7, Nos 2d, 3a, 3b, 1g, 7.

## Assignment
Essential Mathematics SS1, Page 166, Ex 12.6, Nos 26, 37; Page 169, Ex 12.7, Nos 2f, 6, 7.

## Summary — Key Points
- **Factorisation** is fastest when the quadratic factors nicely.
- **Completing the square** always works and leads to the formula.
- **Quadratic formula** x = (-b ± √(b²-4ac)) / (2a) — remember the discriminant b²-4ac tells you the nature of the roots.
- Sum of roots = -b/a; Product = c/a.
- To form an equation from roots: x² - (sum)x + (product) = 0.`,
      quiz: {
        title: 'Quiz W2-3 — Quadratic Equations',
        description: '8 questions on factorisation, completing the square, formula, and roots.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'Solve by factorisation: x^2 - 5x + 6 = 0', questionType: 'fill_blank', correctAnswer: 'x = 2 or x = 3' },
          { id: 'q2', questionText: 'Solve using the formula: 2x^2 - 9x + 4 = 0', questionType: 'fill_blank', correctAnswer: 'x = 1/2 or x = 4' },
          { id: 'q3', questionText: 'True or false: If the roots are 2 and -5, the equation is x^2 + 3x - 10 = 0.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q4', questionText: 'The sum of roots of x^2 - 7x + 10 = 0 is:', questionType: 'fill_blank', correctAnswer: '7' },
          { id: 'q5', questionText: 'The product of roots of 3x^2 + 5x - 2 = 0 is:', questionType: 'fill_blank', correctAnswer: '-2/3' },
          { id: 'q6', questionText: 'Complete the square: x^2 + 6x + (missing) = (x + 3)^2', questionType: 'fill_blank', correctAnswer: '9' },
          { id: 'q7', questionText: 'Which is the quadratic formula?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'x = -b/(2a)', isCorrect: false }, { id: 'b', text: 'x = (-b ± √(b²-4ac)) / (2a)', isCorrect: true }, { id: 'c', text: 'x = b ± √(b²-4ac)', isCorrect: false }, { id: 'd', text: 'x = (-b ± √(4ac-b²)) / (2a)', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q8', questionText: 'The discriminant of x^2 + 4x + 5 = 0 is:', questionType: 'fill_blank', correctAnswer: '-4' },
        ],
      },
      assignment: {
        title: 'Assignment W2-3 — Quadratic Equations',
        description: 'Show full working. Use the specified method where indicated.',
        dueDate: '2026-10-15T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Solve by factorisation: 6x^2 - 17x + 5 = 0.', marks: 5 },
          { id: 'a2', type: 'subjective', title: 'Solve by completing the square: x^2 + 4x - 3 = 0. Give answers to 3 s.f.', marks: 6 },
          { id: 'a3', type: 'subjective', title: 'Solve using the formula: 5x^2 - 3x - 2 = 0.', marks: 4 },
          { id: 'a4', type: 'subjective', title: 'Find the quadratic equation whose roots are (3 + √5)/2 and (3 - √5)/2.', marks: 5 },
        ],
      },
    },
  ],
}