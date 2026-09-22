import type { Ss1ModuleData } from './types'

export const module07: Ss1ModuleData = {
  title: 'Module 7 — Week 10: Equations & Variation',
  lessons: [
    {
      title: 'Week 10 — Linear Equations, Change of Subject & Variation',
      duration: 45,
      content: `# Week 10 — Linear Equations, Change of Subject & Variation

## Learning Objectives
By the end of this lesson you should be able to:
- Solve problems that lead to linear equations.
- Change the subject of a formula.
- Solve problems involving direct, inverse, joint and partial variation.

## Introduction
This week we bring together algebraic skills: turning word problems into equations, rearranging formulas, and understanding how quantities vary together. These are some of the most useful skills in mathematics and science.

## Solving Problems Leading to Linear Equations

### Worked Example 1
A man is 3 times as old as his son. In 4 years, he will be twice as old. Find their present ages.

**Solution**
Let son's age = x. Then man's age = 3x.
In 4 years: son = x+4, man = 3x+4.
3x + 4 = 2(x + 4)
3x + 4 = 2x + 8
x = **4**
Son is **4 years**, man is **12 years**.

### Worked Example 2
If 11 is subtracted from 3/5 of a number, the result is 4 more than 1/5 of the number. Find the number.

**Solution**
Let the number = x.
(3/5)x - 11 = (1/5)x + 4
(3/5)x - (1/5)x = 4 + 11
(2/5)x = 15
x = 15 x (5/2) = **37.5**

## Change of Subject of a Formula

### Worked Example 3
Make x the subject of: (a) y = mx + c  (b) s = (u + v)t/2  (c) 1/f = 1/u + 1/v

**Solution**
(a) y = mx + c → mx = y - c → **x = (y - c)/m**
(b) s = (u + v)t/2 → 2s = (u + v)t → **t = 2s/(u + v)**
(c) 1/f = 1/u + 1/v → 1/u = 1/f - 1/v = (v - f)/(fv) → **u = fv/(v - f)**

## Variation

### Direct Variation
y varies directly as x: y = kx (or y ∝ x)

### Worked Example 4
If y ∝ x and y = 12 when x = 3, find y when x = 7.

**Solution**
y = kx. 12 = k x 3 → k = 4.
When x = 7: y = 4 x 7 = **28**

### Inverse Variation
y varies inversely as x: y = k/x (or y ∝ 1/x)

### Worked Example 5
If y ∝ 1/x and y = 4 when x = 6, find y when x = 8.

**Solution**
y = k/x. 4 = k/6 → k = 24.
When x = 8: y = 24/8 = **3**

### Joint Variation
y varies jointly as x and z: y = kxz

### Worked Example 6
R ∝ h and R ∝ 1/r^2. When h = 0.5 and r = 0.1, R = 0.3. Find R when h = 0.6 and r = 0.2.

**Solution**
R = k x h / r^2
0.3 = k x 0.5 / 0.01 → 0.3 = 50k → k = 0.006
When h = 0.6, r = 0.2: R = 0.006 x 0.6 / 0.04 = 0.009 = **0.009**

### Partial Variation
y = a + bx (partly constant, partly varying)

### Worked Example 7
m is partly constant and partly varies as n^2. When n = 2, m = 17; when n = 4, m = 53. Find the equation connecting m and n, then find n when m = 32.

**Solution**
m = a + bn^2
When n = 2: 17 = a + 4b
When n = 4: 53 = a + 16b
Subtract: 36 = 12b → b = 3. Then a = 17 - 4(3) = 5.
So: **m = 5 + 3n^2**
When m = 32: 32 = 5 + 3n^2 → 27 = 3n^2 → n^2 = 9 → **n = 3**

## Class Activity
Essential Mathematics SS1, Page 135, Ex 10.2, Nos 3 & 17; Page 136, Ex 10.3, Nos 9 & 10; Page 145, Ex 10.7, Nos 15 & 18; Page 152, Ex 11.1, Nos 5 & 9; Page 156, Ex 11.2, Nos 2 & 5; Page 156, Ex 11.2, No 7.

## Assignment
Essential Mathematics SS1, Page 136, Ex 10.3, Nos 13 & 15; Page 139, Ex 10.4, Nos 3 & 6; Page 145, Ex 10.7, No 41; Page 152, Ex 11.1, Nos 4 & 6; Page 156, Ex 11.2, Nos 6 & 10; Page 156, Ex 11.2, Nos 8 & 12.

## Summary — Key Points
- **Linear equations from word problems:** define the unknown, set up the equation, solve, and check against the problem.
- **Change of subject:** apply inverse operations step by step, keeping both sides balanced.
- **Direct variation:** y = kx; **Inverse:** y = k/x; **Joint:** y = kxz; **Partial:** y = a + bx.
- Always find the constant k (or a and b) before solving for unknowns.

## Class Activity
Essential Mathematics SS1, Page 135, Ex 10.2, Nos 3 & 17; Page 136, Ex 10.3, Nos 9 & 10; Page 145, Ex 10.7, Nos 15 & 18; Page 152, Ex 11.1, Nos 5 & 9; Page 156, Ex 11.2, Nos 2 & 5; Page 156, Ex 11.2, No 7.

## Assignment
Essential Mathematics SS1, Page 136, Ex 10.3, Nos 13 & 15; Page 139, Ex 10.4, Nos 3 & 6; Page 145, Ex 10.7, No 41; Page 152, Ex 11.1, Nos 4 & 6; Page 156, Ex 11.2, Nos 6 & 10; Page 156, Ex 11.2, Nos 8 & 12.

## Summary — Key Points
- **Linear equations from word problems:** define the unknown, set up the equation, solve, and check against the problem.
- **Change of subject:** apply inverse operations step by step, keeping both sides balanced.
- **Direct variation:** y = kx; **Inverse:** y = k/x; **Joint:** y = kxz; **Partial:** y = a + bx.
- Always find the constant k (or a and b) before solving for unknowns.`,
      quiz: {
        title: 'Quiz W10 — Equations & Variation',
        description: '8 questions on linear equations, change of subject, and variation.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'If y varies directly as x and y = 12 when x = 3, find y when x = 7.', questionType: 'fill_blank', correctAnswer: '28' },
          { id: 'q2', questionText: 'Solve: 3x + 7 = 2x + 15', questionType: 'fill_blank', correctAnswer: 'x = 8' },
          { id: 'q3', questionText: 'True or false: If y varies inversely as x, then y = k/x.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q4', questionText: 'Make x the subject of: y = mx + c', questionType: 'fill_blank', correctAnswer: 'x = (y - c)/m' },
          { id: 'q5', questionText: 'If y = k/x and y = 4 when x = 6, find y when x = 8.', questionType: 'fill_blank', correctAnswer: '3' },
          { id: 'q6', questionText: 'm is partly constant and partly varies as n^2. When n=2, m=17; when n=4, m=53. Find m when n=3.', questionType: 'multiple_choice', options: [{ id: 'a', text: '17', isCorrect: false }, { id: 'b', text: '32', isCorrect: true }, { id: 'c', text: '53', isCorrect: false }, { id: 'd', text: '25', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q7', questionText: 'The time t to travel a distance varies directly as the distance and inversely as the speed. If t = 2 when d = 100 and s = 50, find t when d = 200 and s = 80.', questionType: 'fill_blank', correctAnswer: '4' },
          { id: 'q8', questionText: 'True or false: In joint variation, y = kxz represents y varying jointly as x and z.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
      assignment: {
        title: 'Assignment W10 — Equations & Variation',
        description: 'Show full working. Define variables clearly.',
        dueDate: '2026-10-12T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'A man is 4 times as old as his son. In 5 years, he will be 3 times as old. Find their present ages.', marks: 6 },
          { id: 'a2', type: 'subjective', title: 'Make r the subject of A = pi*r^2 + 2*pi*r*h (surface area of a cylinder).', marks: 5 },
          { id: 'a3', type: 'subjective', title: 'R varies jointly as h and 1/r^2. When h = 2, r = 3, R = 1/9. Find the formula connecting them and the value of R when h = 4 and r = 6.', marks: 9 },
        ],
      },
    },
  ],
}