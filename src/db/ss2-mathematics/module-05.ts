import type { Ss2ModuleData } from './types'

export const module05: Ss2ModuleData = {
  title: 'Module 5 — Week 5: Sequence & Series',
  lessons: [
    {
      title: 'Lesson 5.1 — Sum of Terms of an A.P.',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Use Sₙ = n/2 [2a + (n − 1)d] to find the sum of n terms of an A.P.
- Use the alternative formula Sₙ = n/2 (a + l) when the last term l is known.
- Solve combined term-and-sum problems.

## Introduction
Adding the terms of a sequence gives a **series**. Instead of adding 100 terms one by one, the sum formulas of an A.P. give the answer in one line.

## Key Formulas

**Sₙ = n/2 [2a + (n − 1)d]**

**Sₙ = n/2 (a + l)**  where l = Tₙ is the last term.

## Worked Examples
**Example 1: Find the sum of the first 20 terms of the A.P. 5, 8, 11, 14, …**

a = 5, d = 3, n = 20.

S₂₀ = 20/2 [2(5) + (20 − 1)(3)] = 10 [10 + 57] = 10 × 67 = **670**

**Example 2: Find the sum of all the terms of the A.P. 4, 9, 14, …, 94.**

a = 4, l = 94. Find n first: 94 = 4 + (n − 1)5 → 90 = 5(n − 1) → n = 19.

S₁₉ = 19/2 (4 + 94) = 19/2 × 98 = **931**

**Example 3: The sum of the first 10 terms of an A.P. is 145 and the first term is 1. Find d and the 10th term.**

S₁₀ = 10/2 [2(1) + 9d] = 5[2 + 9d] = 145

2 + 9d = 29 → 9d = 27 → d = 3

T₁₀ = 1 + 9(3) = 28.

## Class Activity
1. Find the sum of the first 15 terms of the A.P. 7, 10, 13, …
2. Find the sum of the A.P. 2, 5, 8, …, 62.
3. The sum of the first n terms of a sequence is Sₙ = 3n² + n. Show that the sequence is an A.P. and find its common difference. (Hint: Tₙ = Sₙ − Sₙ₋₁.)

## Assignment
1. Find the sum of the first 25 terms of the A.P. 9, 13, 17, …
2. The 3rd term of an A.P. is 10 and the sum of the first 6 terms is 45. Find the first term, the common difference and the sum of the first 10 terms.

## Summary — Key Points
- Sₙ = n/2 [2a + (n − 1)d]; when the last term is known, Sₙ = n/2 (a + l).
- Find n from the last-term formula before using the second sum formula.
- Tₙ = Sₙ − Sₙ₋₁ links sums back to single terms.`,
    },
    {
      title: 'Lesson 5.2 — Arithmetic Mean',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Define the arithmetic mean (A.M.) of two numbers.
- Insert any number of arithmetic means between two given numbers.

## Introduction
The **arithmetic mean** of two numbers is the value halfway between them. Inserting arithmetic means builds an A.P. between two extremes — a common WAEC style of question.

## Key Formula
For three consecutive terms a, b, c of an A.P.:

**b = (a + c)/2**

Equivalently: 2b = a + c.

## Worked Examples
**Example 1: Find the arithmetic mean of 8 and 24.**

b = (8 + 24)/2 = 32/2 = **16**

Check: 8, 16, 24 has common difference 8. Correct.

**Example 2: Insert three arithmetic means between 4 and 20.**

We need the A.P. 4, m₁, m₂, m₃, 20 — five terms, so 20 is T₅.

20 = 4 + (5 − 1)d → 16 = 4d → d = 4

The means are: **8, 12, 16**.

**Example 3: The arithmetic mean of x and 18 is 15. Find x.**

(x + 18)/2 = 15 → x + 18 = 30 → **x = 12**

## Connection to the Sum Formula
For an A.P. with an odd number of terms, the middle term is the arithmetic mean of the first and last terms — which is why Sₙ = n/2 (a + l) works: the sum is (number of terms) × (mean of extremes).

## Class Activity
1. Find the arithmetic mean of −7 and 19.
2. Insert four arithmetic means between 3 and 23.
3. The arithmetic mean of 2p and 14 is 3p. Find p.

## Assignment
1. Insert two arithmetic means between 10 and 46.
2. Three numbers are in A.P. Their sum is 27 and their product is 585. Find them. (Hint: let the numbers be b − d, b, b + d.)

## Summary — Key Points
- Arithmetic mean: b = (a + c)/2.
- Inserting k means between a and l creates an A.P. of k + 2 terms — find d from Tₖ₊₂ = l.
- The middle term of an odd-length A.P. is the mean of the extremes.`,
    },
    {
      title: 'Lesson 5.3 — Geometric Progression',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Define a geometric progression and identify the common ratio r.
- Use Tₙ = arⁿ⁻¹ to find any term.
- Solve problems where a and r must be found from two given terms.

## Introduction
In a **geometric progression (G.P.)** each term is obtained by multiplying the previous term by a fixed number r, the **common ratio**: 2, 6, 18, 54, … (r = 3); 81, 27, 9, … (r = 1/3). Geometric progressions model population growth, radioactive decay and compound interest.

## Key Formula

**Tₙ = arⁿ⁻¹**

where a = first term, r = common ratio (r ≠ 0), n = term number.

r is found by dividing any term by the term before it: r = T₂/T₁.

## Worked Examples
**Example 1: Find the 8th term of the G.P. 2, 6, 18, 54, …**

a = 2, r = 3.

T₈ = 2 × 3⁷ = 2 × 2 187 = **4 374**

**Example 2: The 3rd term of a G.P. is 18 and the 6th term is 486. Find the G.P.**

T₃ = ar² = 18 and T₆ = ar⁵ = 486.

Divide: r³ = 486 ÷ 18 = 27 → r = 3.

Then a(9) = 18 → a = 2.

The G.P. is **2, 6, 18, 54, 162, 486, …**

**Example 3: Find the number of terms in the G.P. 1/3, 1, 3, …, 729.**

a = 1/3, r = 3.

729 = (1/3) × 3ⁿ⁻¹ → 3ⁿ⁻¹ = 2 187 = 3⁷ → n − 1 = 7 → **n = 8**

## Class Activity
1. Find the common ratio of the G.P. 5, 15, 45, 135, …
2. Find the 6th term of the G.P. 4, 12, 36, …
3. The 2nd term of a G.P. is 6 and the 5th term is 162. Find the first term and the common ratio.

## Assignment
1. Find the 7th term of the G.P. 8, 4, 2, …
2. The 4th term of a G.P. is 54 and the 7th term is 1 458. Find the G.P.

## Summary — Key Points
- G.P.: constant ratio r = Tₙ₊₁/Tₙ.
- Tₙ = arⁿ⁻¹; divide two given terms to eliminate a and find r.
- r can be fractional or negative — check the sign against the given terms.`,
    },
    {
      title: 'Lesson 5.4 — Sum of Geometric Series',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Use Sₙ = a(1 − rⁿ)/(1 − r) (or the equivalent form) to sum a G.P.
- Use the sum-to-infinity formula S∞ = a/(1 − r) when |r| < 1.
- Apply these formulas to practical problems.

## Introduction
Adding the terms of a G.P. gives a **geometric series**. When r is a fraction (|r| < 1), the terms shrink so quickly that the sum of infinitely many terms is a finite number — a beautiful and very useful result.

## Key Formulas

**Sₙ = a(1 − rⁿ)/(1 − r)**  (equivalently Sₙ = a(rⁿ − 1)/(r − 1))

**S∞ = a/(1 − r)**  provided |r| < 1

## Worked Examples
**Example 1: Find the sum of the first 6 terms of the G.P. 3, 6, 12, 24, …**

a = 3, r = 2, n = 6.

S₆ = 3(2⁶ − 1)/(2 − 1) = 3(64 − 1) = **189**

**Example 2: Find the sum to infinity of the G.P. 8 + 4 + 2 + 1 + …**

a = 8, r = 1/2, and |r| < 1, so the sum converges.

S∞ = 8/(1 − 1/2) = 8 ÷ 1/2 = **16**

**Example 3: A ball is dropped from a height of 10 m and rebounds to 0.6 of its previous height each time. Find the total vertical distance travelled before coming to rest.**

Downward distances: 10 + 6 + 3.6 + … = sum to infinity of a G.P. with a = 10, r = 0.6 → 10/0.4 = 25 m.

Upward distances: 6 + 3.6 + … = 6/0.4 = 15 m.

Total distance = 25 + 15 = **40 m**

## Class Activity
1. Find the sum of the first 5 terms of the G.P. 4, 12, 36, …
2. Find the sum to infinity of 9 + 3 + 1 + 1/3 + …
3. Explain why the sum to infinity of 2 + 6 + 18 + … does not exist.

## Assignment
1. Find the sum of the first 8 terms of the G.P. 16, −8, 4, −2, …
2. The sum to infinity of a G.P. is 45 and the common ratio is 2/5. Find the first term.

## Summary — Key Points
- Finite sum: Sₙ = a(1 − rⁿ)/(1 − r).
- Infinite sum exists only when |r| < 1: S∞ = a/(1 − r).
- Watch negative ratios — keep the signs in rⁿ.`,
    },
    {
      title: 'Lesson 5.5 — Geometric Mean',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Define the geometric mean (G.M.) of two numbers.
- Insert any number of geometric means between two given numbers.

## Introduction
While the arithmetic mean sits halfway in *addition*, the geometric mean sits halfway in *multiplication*. Inserting geometric means between two numbers builds a G.P. — the mirror image of Lesson 5.2.

## Key Formulas
For three consecutive terms a, b, c of a G.P.:

**b² = ac**, so **b = ±√(ac)**

The ± sign appears because a square has two roots; choose the sign that fits the common ratio of the given terms.

## Worked Examples
**Example 1: Find the geometric mean of 4 and 25.**

b = ±√(4 × 25) = ±√100 = ±10

If the G.P. must be positive: **b = 10**, giving 4, 10, 25 with r = 5/2.

**Example 2: Insert two geometric means between 3 and 24.**

We need the G.P. 3, g₁, g₂, 24 — four terms, so 24 = T₄ = 3r³.

r³ = 8 → r = 2

The means are **6 and 12**.

**Example 3: Two numbers have geometric mean 12 and arithmetic mean 13. Find the numbers.**

Let the numbers be x and y.

xy = 12² = 144 and (x + y)/2 = 13 → x + y = 26.

x and y are the roots of t² − 26t + 144 = 0 = (t − 8)(t − 18).

The numbers are **8 and 18**.

## Class Activity
1. Find the positive geometric mean of 9 and 16.
2. Insert three geometric means between 2 and 162.
3. The geometric mean of p and 36 is 24. Find p.

## Assignment
1. Insert one geometric mean between 5 and 45, giving both possible answers.
2. Two positive numbers have arithmetic mean 10 and geometric mean 8. Find the numbers.

## Summary — Key Points
- Geometric mean: b² = ac, b = ±√(ac).
- Inserting k means between a and l creates a G.P. of k + 2 terms — find r from l = arᵏ⁺¹.
- Combining A.M. and G.M. conditions often produces a quadratic equation — connect the ideas of this whole module.`,
    },
  ],
}
// __END__
