import type { Ss1ModuleData } from './types'

export const module01: Ss1ModuleData = {
  title: 'Module 1 — Week 1: Revision of SS1 Foundations',
  lessons: [
    {
      title: 'Week 1 — Revision: Basic Operations, Factorization & Linear Equations',
      duration: 45,
      content: `# Week 1 — Revision: Basic Operations, Factorization & Linear Equations

## Learning Objectives
By the end of this lesson you should be able to:
- Perform operations on directed numbers (positive and negative integers).
- Factorize linear expressions and simplify algebraic expressions.
- Solve linear equations in one unknown.
- Solve simultaneous equations using substitution and elimination methods.

## Introduction
This week we revise four essential skills: working with positive and negative numbers, factorising algebraic expressions, solving linear equations, and solving pairs of simultaneous equations. These are the building blocks for most of the rest of the course — make sure you are confident with them.

## Basic Operations on Directed Numbers

### Addition and Subtraction
- Same signs: add the numbers and keep the sign.  (-3) + (-5) = -8
- Different signs: subtract the smaller from the larger and take the sign of the larger.  (-8) + (+3) = -5

### Multiplication and Division
- Same signs: result is positive.  (-4) × (-3) = +12
- Different signs: result is negative.  (-4) × (+3) = -12

### Worked Example 1
Evaluate:
(a) (-4x) × (+5x)    (b) (-8mn) × (-7m)    (c) (-4) - (+7)    (d) (-6) × (-5) ÷ (+3)

**Solution**
(a) (-4x) × (+5x) = -20x²
(b) (-8mn) × (-7m) = +56m²n
(c) (-4) - (+7) = -4 - 7 = -11
(d) (-6) × (-5) ÷ (+3) = +30 ÷ 3 = +10

## Factorization of Linear Expressions
To factorize, find the **highest common factor (HCF)** of all terms and write it outside a bracket.

### Worked Example 2
Factorize:
(i) -8mn - 12n    (ii) (4x + 3)² - (3x - 2)²

**Solution**
(i) HCF of 8mn and 12n is 4n.  -8mn - 12n = **4n(-2m - 3)**
(ii) This is a difference of two squares: a² - b² = (a-b)(a+b).
     Here a = (4x+3) and b = (3x-2).
     = [(4x+3) - (3x-2)] × [(4x+3) + (3x-2)]
     = (x + 5)(7x + 1)


## Linear Equations
An equation is a statement showing that two expressions are equal. A **linear equation** has the highest power of the variable equal to 1.

### Worked Example 4
Solve:  (i) 7x + 5 = 33    (ii) 4x - 9 = 11

**Solution**
(i) 7x + 5 = 33 → 7x = 33 - 5 → 7x = 28 → **x = 4**
(ii) 4x - 9 = 11 → 4x = 11 + 9 → 4x = 20 → **x = 5**

## Simultaneous Equations
Two equations with two unknowns, solved together.

### Methods
1. **Substitution** — solve one equation for one variable and substitute.
2. **Elimination** — add or subtract equations to eliminate one variable.
3. **Graphical** — find the intersection point of two lines.

### Worked Example 5 — Substitution Method
Solve: y - x = -1  and  2y - x + 5 = 0

**Solution**
From the first equation: y = x - 1
Substitute into the second: 2(x - 1) - x + 5 = 0
→ 2x - 2 - x + 5 = 0 → x + 3 = 0 → **x = -3**
Then y = -3 - 1 = **-4**
Check: (-4) - (-3) = -1 ✓  and  2(-4) - (-3) + 5 = -8 + 3 + 5 = 0 ✓

### Worked Example 6 — Elimination Method
Solve: a - b = 3  and  a + b = 11

**Solution**
Add the equations: 2a = 14 → **a = 7**
Substitute: 7 - b = 3 → **b = 4**

## Class Activity
Essential Mathematics SS1, Page xvi, Nos 17k, 18f, 20f, 21e & 22h.

## Assignment
Essential Mathematics SS1, Page xvi, Nos 17l, 19e, 21f & 22a.

## Summary — Key Points
- **Directed numbers:** same signs → positive result when multiplying/dividing; different signs → negative.
- **Factorisation:** always look for the HCF first; use difference of squares for a² - b².
- **Linear equations:** keep the variable on one side, constants on the other.
- **Simultaneous equations:** substitution works when one variable is already isolated; elimination works when coefficients line up.`,
      quiz: {
        title: 'Quiz W1 — Revision: Operations, Factorisation & Linear Equations',
        description: '8 questions on directed numbers, factorisation, and linear/simultaneous equations.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'Evaluate: (-9) x (-4) / 3', questionType: 'fill_blank', correctAnswer: '12' },
          { id: 'q2', questionText: 'True or false: (-5) + (-7) = +12', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q3', questionText: 'Factorize: 6x - 15y', questionType: 'fill_blank', correctAnswer: '3(2x - 5y)' },
          { id: 'q4', questionText: 'Solve: 5x - 3 = 2x + 9', questionType: 'fill_blank', correctAnswer: 'x = 4' },
          { id: 'q5', questionText: 'If a + b = 7 and a - b = 3, find a and b.', questionType: 'fill_blank', correctAnswer: 'a = 5, b = 2' },
          { id: 'q6', questionText: 'Factorize: (x+2)^2 - (x-3)^2', questionType: 'multiple_choice', options: [{ id: 'a', text: '(2x+5)(5)', isCorrect: true }, { id: 'b', text: '(x+2)(x-3)', isCorrect: false }, { id: 'c', text: '(2x-1)(5)', isCorrect: false }, { id: 'd', text: 'x^2 + 5x - 6', isCorrect: false }], correctAnswer: 'a' },
          { id: 'q7', questionText: 'True or false: The elimination method is best used when one variable is already isolated.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q8', questionText: 'Solve simultaneously: 2x + 3y = 12 and 3x - y = 1 (solve for x).', questionType: 'fill_blank', correctAnswer: 'x = 3' },
        ],
      },
      assignment: {
        title: 'Assignment W1 — Revision',
        description: 'Show all working. Each question carries equal marks.',
        dueDate: '2026-09-07T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Evaluate: (-12) / (+4) x (-2) + 5', marks: 5 },
          { id: 'a2', type: 'subjective', title: 'Factorise completely: 12a^2b - 18ab^2 + 6ab', marks: 5 },
          { id: 'a3', type: 'subjective', title: 'Solve: (3x - 7)/4 = (2x + 1)/3', marks: 5 },
          { id: 'a4', type: 'subjective', title: 'Solve by elimination: 4x + 3y = 24 and 2x - 5y = -11', marks: 5 },
        ],
      },
    },
  ],
}
