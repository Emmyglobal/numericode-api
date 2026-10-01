import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 4 — Equations and Inequalities. Verified: substitution of
// y = 5x - 3 and y = 2x + 15 gives 5x - 3 = 2x + 15 -> 3x = 18 -> x = 6, y = 27;
// elimination of x + 4y = 41 and x + 2y = 23 subtracts to give 2y = 18, y = 9,
// x = 5; elimination of 3x + 2y = 38 and 3x - y = 26 gives 3y = 12, y = 4, x = 10.
export const module04: Jss1ModuleData = {
  title: 'Module 4 — Week 4: Equations and Inequalities',
  lessons: [
    {
      title: 'Week 4 — Equations and Inequalities',
      duration: 50,
      content: `## Learning Objectives
- Construct and solve equations from word problems.
- Solve simultaneous equations by substitution and elimination.
- Solve linear inequalities and show them on a number line.

## Constructing and Solving Equations
When a problem asks you to solve something, write an equation to model it.

### Worked Example 1
A rectangle has a perimeter of 18 cm and its length is 2 cm more than its width.
Let the width be x, so the length is x + 2.

Perimeter = 2(length + width), so:

2(x + 2) + 2x = 18
2x + 4 + 2x = 18
4x = 14
x = 3.5

So the width is 3.5 cm and the length is 5.5 cm.

## Simultaneous Equations
**Simultaneous equations** are a set of two or more equations sharing the same
variables and solved together for a common solution.

Three methods exist: **substitution**, **elimination** and **graphical**.

### Substitution Method
Solve one equation for one variable, then substitute that expression into the
other.

### Worked Example 2
Solve y = 5x - 3 and y = 2x + 15.

The left sides are both y, so set the right sides equal:

5x - 3 = 2x + 15
3x = 18
x = 6

Then y = 2(6) + 15 = **27**

Solution: **(6, 27)**

**Check:** 5(6) - 3 = 27 and 2(6) + 15 = 27. Both correct.

### Elimination Method
Add or subtract the equations to remove one variable.

### Worked Example 3
Solve x + 4y = 41 and x + 2y = 23.

Subtract the second equation from the first:

(x + 4y) - (x + 2y) = 41 - 23
2y = 18
y = 9

Substitute into x + 2y = 23: x + 18 = 23, so x = 5.

Solution: **(5, 9)**

### Worked Example 4
Solve 3x + 2y = 38 and 3x - y = 26.

Subtract the second from the first: 3y = 12, so y = 4.
Substitute: 3x + 8 = 38, so 3x = 30 and x = 10.

Solution: **(10, 4)**

## Linear Inequalities
A **linear inequality** compares two expressions using <, >, <= or >= instead of
an equals sign.

### Worked Example 5
Solve -1 < x + 5 <= 4

Subtract 5 throughout: -6 < x <= -1

This is a **compound inequality**, so draw a line with an open circle at -6, a
closed circle at -1, and shade between them.

## Common Mistakes
- Not checking the solution in **both** equations.
- Sign errors when expanding brackets.
- Forgetting to reverse the inequality sign when dividing by a negative.

## Practice
1. Solve by substitution: y = 5x - 3 and y = 2x + 15.
2. Solve by elimination: x + 4y = 41 and x + 2y = 23.
3. Solve by elimination: 3x + 2y = 38 and 3x - y = 26.
4. Solve and show on a number line: 4 < x + 2 <= 7.`,
      quiz: quiz(
        'Week 4 Quiz — Equations and Inequalities',
        'Five questions on simultaneous equations and inequalities.',
        [
          mc(
            'Solve the pair y = 5x - 3 and y = 2x + 15. What is x?',
            ['6', '3', '9', '18'],
            'Both sides equal y, so 5x - 3 = 2x + 15. That gives 3x = 18 and x = 6. Then y = 27, so the solution is (6, 27).',
          ),
          mc(
            'Solve x + 4y = 41 and x + 2y = 23. Which solution is correct?',
            ['x = 5 and y = 9', 'x = 9 and y = 5', 'x = 23 and y = 2', 'x = 2 and y = 9'],
            'Subtracting gives 2y = 18, so y = 9. Substituting gives x + 18 = 23, so x = 5.',
          ),
          mc(
            'Solve 3x + 2y = 38 and 3x - y = 26. What is x?',
            ['10', '4', '12', '6'],
            'Subtracting gives 3y = 12, so y = 4. Substituting gives 3x + 8 = 38, so 3x = 30 and x = 10.',
          ),
          fb(
            'Solve the inequality 4 < x + 2 <= 7. Give the smaller bound only, as a number.',
            '2',
            'Subtract 2 throughout: 2 < x <= 5, so the smaller bound is 2. Note that subtracting a positive number does not reverse the signs.',
          ),
          mc(
            'In solving simultaneous equations, why must you check the solution in both equations?',
            [
              'Because the calculation can give a value that satisfies only one of them',
              'Because each equation has a different method',
              'Because the graphs must meet',
              'Because the answer must be positive',
            ],
            'Solving can go wrong at any step, so substituting back into both equations proves whether the pair is correct.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 4.1 — Equations and Inequalities',
        'State which method you used, and always check simultaneous solutions in both equations.',
        [
          { id: 'a1', type: 'theory', title: 'Solve by substitution, showing each step: (i) y = 5x - 3 and y = 2x + 15, (ii) x + 2y = 17 and 3x = 4y + 11.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Solve by elimination: (i) x + 4y = 41 and x + 2y = 23, (ii) 3x + 2y = 38 and 3x - y = 26.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Solve each inequality and show your answer on a number line: (i) 4 < x + 2 <= 7, (ii) -1 <= y - 6 <= 14, (iii) -15 < 5m < 30.', marks: 6 },
          { id: 'a4', type: 'subjective', title: 'A rectangle has a perimeter of 18 cm and its length is 2 cm more than its width. Form an equation and solve it to find both dimensions.', marks: 2 },
        ],
      ),
    },
  ],
}