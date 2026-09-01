import type { Ss2ModuleData } from './types'

export const module04: Ss2ModuleData = {
  title: 'Module 4 — Week 4: Sequence & Series',
  lessons: [
    {
      title: 'Lesson 4.1 — Meaning of Sequence',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Define a sequence, its terms and its nth term.
- Identify the rule generating a given sequence.
- Find any term of a sequence from its rule.

## Introduction
Look at these arrangements: 2, 4, 6, 8, 10, … A list of numbers that follows a definite rule is called a **sequence**. Sequences appear in savings patterns, seat arrangements, population growth and examination questions every year.

## Key Definitions
- A **sequence** is an ordered list of numbers formed according to a rule.
- Each number in the list is a **term**: first term (T₁), second term (T₂), and generally the **nth term** Tₙ.
- A **series** is the sum of the terms of a sequence.
- A sequence whose terms increase by adding the same number each time is an **arithmetic progression (A.P.)**. One whose terms increase by multiplying the same number is a **geometric progression (G.P.)**.

## Worked Examples
**Example 1: Find the next two terms of 5, 9, 13, 17, …**

Each term increases by 4, so the next two terms are 21 and 25.

**Example 2: The nth term of a sequence is Tₙ = 3n − 1. Find the first four terms and the 20th term.**

- T₁ = 3(1) − 1 = 2
- T₂ = 3(2) − 1 = 5
- T₃ = 3(3) − 1 = 8
- T₄ = 3(4) − 1 = 11
- T₂₀ = 3(20) − 1 = 59

**Example 3: Which term of the sequence 4, 7, 10, 13, … is 43?**

The rule is Tₙ = 4 + (n − 1) × 3 = 3n + 1.

Set 3n + 1 = 43 → 3n = 42 → **n = 14**. So 43 is the 14th term.

## Describing a Sequence from Its Terms
Given 2, 5, 10, 17, 26, …, notice the differences: 3, 5, 7, 9 (odd numbers). The rule is Tₙ = n² + 1. Always test your rule against at least two given terms.

## Class Activity
1. Write down the next three terms of: 64, 32, 16, …
2. The nth term of a sequence is n² − 1. Write down the first five terms.
3. Which term of the sequence 6, 11, 16, 21, … is 96?

## Assignment
1. A sequence is given by Tₙ = 2n + 5. Find T₁, T₅ and T₃₀.
2. The terms of a sequence are 1, 4, 9, 16, … Write down the rule for Tₙ and find the 12th term.

## Summary — Key Points
- A sequence is a rule-ordered list; a series is its sum.
- Tₙ is the formula for any term — substitute n to find a term, solve for n to locate a term.
- Look at differences between terms to discover the rule.`,
    },
    {
      title: 'Lesson 4.2 — Arithmetic Progression',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Define an arithmetic progression and identify a (first term) and d (common difference).
- Use the nth-term formula Tₙ = a + (n − 1)d to find any term.
- Find a or d when two terms of the A.P. are known.

## Introduction
An **arithmetic progression** is a sequence in which each term is obtained by adding a fixed number, the **common difference d**, to the previous term. Examples: 3, 7, 11, 15, … (d = 4); 20, 15, 10, … (d = −5).

## Key Formula

**Tₙ = a + (n − 1)d**

where a = first term, d = common difference, n = term number.

## Worked Examples
**Example 1: Find the 10th term of the A.P. 3, 7, 11, 15, …**

a = 3, d = 7 − 3 = 4, n = 10.

T₁₀ = 3 + (10 − 1) × 4 = 3 + 36 = **39**

**Example 2: The 5th term of an A.P. is 17 and the 9th term is 33. Find the A.P.**

T₅ = a + 4d = 17 and T₉ = a + 8d = 33.

Subtract: 4d = 16 → d = 4; then a = 17 − 16 = 1.

The A.P. is **1, 5, 9, 13, …**

**Example 3: Which term of the A.P. 8, 11, 14, … is 98?**

a = 8, d = 3.

98 = 8 + (n − 1) × 3 → 90 = 3(n − 1) → n − 1 = 30 → **n = 31**

## Real-Life Connection
A worker saves ₦500 in January and increases the saving by ₦150 each month. The savings form an A.P. with a = 500, d = 150; the December saving is T₁₂ = 500 + 11 × 150 = ₦2 150.

## Class Activity
1. Write down the first term and common difference of: 25, 21, 17, 13, …
2. Find the 15th term of the A.P. 6, 10, 14, …
3. The 4th term of an A.P. is 13 and the 10th term is 31. Find the first term and the common difference.

## Assignment
1. Find the 30th term of the A.P. 12, 9, 6, …
2. Which term of the A.P. 5, 9, 13, … is 105? 
3. The 7th term of an A.P. is 24 and the 12th term is 44. Find the A.P. and its 20th term.

## Summary — Key Points
- A.P.: constant difference d between consecutive terms.
- Tₙ = a + (n − 1)d is the master formula — most A.P. questions reduce to it.
- Two simultaneous equations in a and d are solved when two terms are given.`,
    },
  ],
}
// __END__
