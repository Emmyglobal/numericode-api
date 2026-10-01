import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 5 — Sequences and Functions. Verified: 11,15,19,23,27 is
// linear (+4); 4,5,7,10,14 is non-linear (+1,+2,+3,+4); 2,5,10,17,26 has nth
// n^2+1; 4,7,12,19,28 has nth n^2+3; -8,-5,0,7,16 has nth n^2-9; 6,8,10 has
// nth 2n+4; nth n^2-1 gives 0,3,8 and a 10th term of 99; nth 5n^2+3n gives
// 8,26,54 and a 10th term of 530.
export const module05: Jss1ModuleData = {
  title: 'Module 5 — Week 5: Sequences and Functions',
  lessons: [
    {
      title: 'Week 5 — Sequences and Functions',
      duration: 50,
      content: `## Learning Objectives
- Decide whether a sequence is linear or quadratic.
- Find the nth term rule of a sequence.
- Use a function to model a real situation.

## Linear and Quadratic Sequences
In a **linear sequence** the terms increase or decrease by the **same amount** each
time. In a **non-linear sequence** they change by a **different amount** each time.

### Worked Example 1
11, 15, 19, 23, 27, …

The differences are all +4, so this is **linear**.

### Worked Example 2
4, 5, 7, 10, 14, …

The differences are +1, +2, +3, +4, so the amounts change. This is
**non-linear**.

### The Second-Difference Test
Find the differences of the differences. If they are **all the same**, the
sequence is **quadratic**, and its nth term contains **n²**.

### Worked Example 3
2, 5, 10, 17, 26, …

Differences: 3, 5, 7, 9. Second differences: 2, 2, 2 — all the same, so it is
**quadratic**.

## nth Term Rules
### Linear Sequences
### Worked Example 4
Find the nth term of 6, 8, 10, …

The rule adds 2, so try 2n + c. At n = 1: 2(1) + c = 6, so c = 4.

The nth term is **2n + 4**

### Quadratic Sequences
### Worked Example 5
Find the nth term of 2, 5, 10, 17, 26, …

It is quadratic, so try an² + bn + c.

- n = 1: a + b + c = 2
- n = 2: 4a + 2b + c = 5
- n = 3: 9a + 3b + c = 10

Subtracting gives 3a + b = 3 and 5a + b = 5, so 2a = 2, a = 1, b = 0, c = 1.

The nth term is **n² + 1**

### Worked Example 6 — using a given nth term
If the nth term is n² - 1, the first three terms are n = 1, 2, 3:

0, 3, 8

and the 10th term is 100 - 1 = **99**

### Worked Example 7
If the nth term is 5n² + 3n, the first three terms are **8, 26, 54** and the 10th
term is 5(100) + 30 = **530**

## Functions
A **function** maps each input to exactly one output, and is usually written as
an equation.

### Worked Example 8
The cost of hiring a ladder is a fixed charge of $10 plus $3 per day. What is the
cost of one week?

Cost C = 3d + 10, with d = 7:

C = 3(7) + 10 = 21 + 10 = **$31**

## Common Mistakes
- Ignoring second differences and missing that a sequence is quadratic.
- Using n = 0 for the first term instead of n = 1.
- Forgetting that a function may be asked for the input, not the output.

## Practice
1. Decide linear or quadratic: 11, 15, 19, 23, …
2. Decide linear or quadratic: 4, 5, 7, 10, 14, …
3. Find the nth term of 4, 7, 12, 19, 28, …
4. Find the nth term of -8, -5, 0, 7, 16, …
5. A ladder costs $10 plus $3 per day. Find the cost for 7 days.`,
      quiz: quiz(
        'Week 5 Quiz — Sequences and Functions',
        'Five questions on linear and quadratic sequences, nth terms and functions.',
        [
          mc(
            'Is 11, 15, 19, 23, 27, … a linear or a quadratic sequence?',
            ['Linear', 'Quadratic', 'Neither', 'Both'],
            'The differences are all +4, the same every time, so it is linear.',
          ),
          mc(
            'Is 4, 5, 7, 10, 14, … a linear or a quadratic sequence?',
            ['Quadratic', 'Linear', 'Neither', 'Both'],
            'The differences are +1, +2, +3, +4, which change each time. The second differences are all 1, so it is quadratic.',
          ),
          mc(
            'Which is the nth term for the sequence 2, 5, 10, 17, 26, …?',
            ['n^2 + 1', '2n + 3', 'n^2 + 2', '3n + 2'],
            'The second differences are all 2, so it is quadratic. Testing n^2 + 1 gives 2, 5, 10, 17, 26 — correct.',
          ),
          fb(
            'The nth term of a sequence is n^2 - 1. Find the 10th term. (Enter a number only)',
            '99',
            'Substitute n = 10: 10^2 - 1 = 100 - 1 = 99.',
          ),
          fb(
            'A ladder costs a fixed $10 plus $3 per day. Find the cost of hiring it for one week (7 days). (Enter a number only)',
            '31',
            'Cost = 3(7) + 10 = 21 + 10 = 31.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 5.1 — Sequences and Functions',
        'Show your differences and second differences before deciding which type a sequence is.',
        [
          { id: 'a1', type: 'theory', title: 'State whether each sequence is linear, quadratic or non-linear, and justify your answer: (i) 11, 15, 19, 23, 27, (ii) 4, 5, 7, 10, 14, (iii) 20, 18, 15, 11, 6, (iv) 20, 12, 4, -4, -12.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Find the nth term rule of each sequence: (i) 4, 7, 12, 19, 28, (ii) 11, 14, 19, 26, (iii) -8, -5, 0, 7, 16.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'For each given nth term, find the first three terms and the 10th term: (i) n^2 - 1, (ii) 5n^2 + 3n.', marks: 5 },
          { id: 'a4', type: 'subjective', title: 'A ladder costs $10 plus $3 per day, and a chainsaw costs $15 plus $10 per day. Find (a) the cost of a ladder for 7 days and (b) how many days Aran hired a chainsaw if he paid $45.', marks: 3 },
        ],
      ),
    },
  ],
}