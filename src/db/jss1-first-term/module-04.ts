import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Week 4 — Sequences and Functions. Verified: 5, 5¼, 5⅛ multiplies by 1/4;
// 17, 16.2, 15.4, 14.6 subtracts 0.8; nth 2n-1 -> 10th term 19; 7,10,13 has
// nth 3n+4; 18,15,12 has nth 21-3n; y=2x-4 at x=7 gives 10.
export const module04: Jss1ModuleData = {
  title: 'Module 4 — Week 4: Sequences and Functions',
  lessons: [
    {
      title: 'Week 4 — Sequences and Functions',
      duration: 45,
      content: `## Learning Objectives
- Find the term-to-term rule of a sequence and the next terms.
- Use an nth term to find any term of a sequence.
- Write a simple function as an equation and table.

## Generating Sequences
A **sequence** is a list of numbers written in order.

### Worked Example 1
Find the term-to-term rule and the next two terms of 5, 5¼, 5⅛, …

Each term is the previous term multiplied by 1/4, so the rule is
**multiply by 1/4**. The 5th term is 5⅛ x 1/4 = **1 5/32**.

### Worked Example 2
17, 16.2, 15.4, 14.6, …

Each term is 0.8 smaller, so the rule is **subtract 0.8**.
The next terms are **13.8** and then **13**.

Always test your rule on the last known term. If it fails, the rule is wrong.

## Using the nth Term
The **nth term** gives any term directly. The 1st term is n = 1.

### Worked Example 3
The nth term is 2n - 1. Find the first three terms and the 10th term.

- n = 1: 2(1) - 1 = **1**
- n = 2: 2(2) - 1 = **3**
- n = 3: 2(3) - 1 = **5**
- n = 10: 2(10) - 1 = **19**

### Worked Example 4
Find the nth term of 7, 10, 13, 16, …

The rule adds 3, so try 3n + c. At n = 1: 3 + c = 7, so c = 4.
The nth term is **3n + 4**

### Worked Example 5
Find the nth term of 18, 15, 12, 9, …

The rule subtracts 3, so try -3n + c. At n = 1: -3 + c = 18, so c = 21.
The nth term is **21 - 3n**

## Representing a Simple Function
A **function** relates two sets of numbers: each input gives exactly one output.

### Worked Example 6
For y = 3x + 1: x = 0 gives y = 1, x = 1 gives y = 4, x = 2 gives y = 7.

Make a table of values before you plot anything.

## Common Mistakes
- Using n = 0 for the first term instead of n = 1.
- Confusing a geometric sequence with an arithmetic one.
- Not testing your nth term on a term you already know.

## Practice
1. Rule and next term of 3, 6, 12, 24, …
2. Next two terms of 25, 20, 15, 10, …
3. nth term of 5, 8, 11, 14, …
4. 20th term of the sequence with nth term n² + 1.
5. y when x = 0, 3, 7 for y = 2x - 4.`,
      quiz: quiz(
        'Week 4 Quiz — Sequences and Functions',
        'Five questions on term-to-term rules, nth terms and simple functions.',
        [
          mc(
            'What is the term-to-term rule for 25, 20, 15, 10, …?',
            ['Subtract 5 each time', 'Multiply by 5 each time', 'Divide by 5 each time', 'Subtract 10 each time'],
            'Each term is 5 smaller: 25 -> 20 -> 15 -> 10.',
          ),
          mc(
            'What is the 6th term of 3, 6, 12, 24, …?',
            ['48', '30', '36', '24'],
            'The rule is multiply by 2, so 24 x 2 = 48.',
          ),
          fb(
            'A sequence has nth term 2n - 1. What is the 10th term? (Enter a number only)',
            '19',
            'Substitute n = 10: 2(10) - 1 = 20 - 1 = 19.',
          ),
          mc(
            'Which is the nth term for 7, 10, 13, 16, …?',
            ['3n + 4', '4n + 3', '3n - 4', 'n + 7'],
            'The difference is +3, so try 3n + c. At n = 1: 3 + c = 7, so c = 4, giving 3n + 4. Check n = 2: 6 + 4 = 10.',
          ),
          mc(
            'If y = 2x - 4, what is y when x = 7?',
            ['10', '18', '14', '8'],
            'Substitute x = 7: y = 2(7) - 4 = 14 - 4 = 10.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 4.1 — Sequences and Functions',
        'Show how you found each rule, and test every nth term on a term you already know.',
        [
          { id: 'a1', type: 'theory', title: 'Find the term-to-term rule and the next two terms: (i) 3, 6, 12, 24, … (ii) 50, 45, 40, 35, …', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Find the nth term of each sequence: (i) 7, 10, 13, 16, … (ii) 18, 15, 12, 9, …', marks: 6 },
          { id: 'a3', type: 'theory', title: 'The nth term of a sequence is 2n - 1. Find the first three terms and the 10th term.', marks: 4 },
          { id: 'a4', type: 'subjective', title: 'Copy and complete a table of values for y = 3x + 1 for x = 0, 1, 2, 3, 4, then describe the pattern you can see.', marks: 4 },
        ],
        50,
        'mixed',
      ),
    },
  ],
}