import type { Ss2ModuleData } from './types'

export const module02: Ss2ModuleData = {
  title: 'Module 2 — Week 2: Logarithms of Numbers Less Than 1',
  lessons: [
    {
      title: 'Lesson 2.1 — Logarithms of Numbers Less Than 1',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Find the characteristic of the logarithm of any number between 0 and 1.
- Write the logarithm of a number less than 1 in bar notation.
- Find such logarithms using tables.

## Introduction
Last week we worked with logarithms of numbers greater than 1. This week we handle numbers **less than 1**, whose characteristics are negative. This idea is tested every year in WAEC.

## Negative Characteristics
Write the number in standard form N = A × 10ⁿ where 1 ≤ A < 10. If N is between 0 and 1, then n is **negative**. A negative characteristic is written with a **bar** on top of the number.

- 0.0112 = 1.12 × 10⁻², so log 0.0112 has characteristic bar-two (2̄).
- 0.00354 = 3.54 × 10⁻³, characteristic bar-three (3̄).
- 0.000779 = 7.79 × 10⁻⁴, characteristic bar-four (4̄).

The **rule**: for a number 0.0…0A…, count the number of zeros between the decimal point and the first significant digit. That count (with a bar) is the characteristic.

## Worked Examples (from the scheme)
Find the logarithm of each number.

**Example 1: 0.0112**

0.0112 = 1.12 × 10⁻², so the characteristic is 2̄.

From tables, log 1.12 = 0.0492 (the mantissa).

**log 0.0112 = 2̄.0492**

**Example 2: 0.00354**

0.00354 = 3.54 × 10⁻³, characteristic 3̄.

From tables, log 3.54 = 0.5490.

**log 0.00354 = 3̄.5490**

**Example 3: 0.000779**

0.000779 = 7.79 × 10⁻⁴, characteristic 4̄.

From tables, log 7.79 = 0.8915.

**log 0.000779 = 4̄.8915**

## Understanding the Bar Notation
2̄.0492 means −2 + 0.0492 = −1.9508. Only the characteristic is negative; the mantissa is always positive. This is why we use bars instead of writing −2.0492, which would incorrectly make the mantissa negative too.

## Finding Antilogs with Bar Characteristics
To find the number whose log is 3̄.5490: antilog 0.5490 = 3.54, and the characteristic bar-three places the point three zeros in front: 0.00354.

## Class Activity
1. Write the characteristics of: log 0.4, log 0.096, log 0.00607.
2. Find from tables: log 0.284, log 0.0396, log 0.000913.
3. Find the numbers whose logarithms are 2̄.7188 and 3̄.3222.

## Assignment
1. Find the logarithms of 0.618, 0.0707 and 0.000405.
2. A bacterium has a mass of 0.0000021 g. Express its mass in standard form and write down the characteristic of its logarithm.

## Summary — Key Points
- For numbers between 0 and 1, the characteristic is negative and is written as a bar.
- Count the zeros after the point before the first significant digit to get the bar characteristic.
- The mantissa is always positive and is read from tables in the usual way.`,
    },
    {
      title: 'Lesson 2.2 — Operations with Logarithms',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Add and subtract logarithms correctly, including bar characteristics.
- Handle carries and borrows between the characteristic and the mantissa.
- Apply these skills to multiplication and division problems.

## Introduction
Adding and subtracting logarithms is the engine behind multiplication and division by logs. With bar characteristics, carries and borrows must be handled with care — this lesson teaches you exactly how.

## Key Ideas
- When **adding** logs: add the mantissas. If they sum to 1 or more, **carry 1** into the characteristics.
- When **subtracting** logs: if the first mantissa is smaller than the second, **borrow 1** from the characteristic.
- Remember: a bar characteristic is a negative whole number.

## Worked Examples (from the scheme)
Add or subtract, giving your answer in bar notation where necessary.

**Example 1: 5.2671 + 4.9061**

Mantissas: 0.2671 + 0.9061 = 1.1732. Write 0.1732 and carry 1.

Characteristics: 5 + 4 + 1 = 10.

**Answer: 10.1732**

**Example 2: 2.2576 − 3.9265**

0.2576 − 0.9265 is impossible without borrowing. Borrow 1: mantissa becomes 1.2576 − 0.9265 = 0.3311.

Characteristics: (2 − 1) − 3 = 1 − 3 = −2, i.e. a bar-two.

**Answer: 2̄.3311**

**Example 3: 2.8234 + 3.8456**

Mantissas: 0.8234 + 0.8456 = 1.6690. Write 0.6690, carry 1.

Characteristics: 2 + 3 + 1 = 6.

**Answer: 6.6690**

**Example 4: 2.5606 − 1.4307**

Mantissas: 0.5606 − 0.4307 = 0.1299 (no borrow needed).

Characteristics: 2 − 1 = 1.

**Answer: 1.1299**

## Using These Skills
Since log (MN) = log M + log N and log (M/N) = log M − log N, these four additions and subtractions are exactly the calculations inside a multiplication or division:

- To compute 3.2 × 0.85, you find log 3.2 + log 0.85 and take the antilog.
- To compute 0.684 ÷ 9.3, you find log 0.684 − log 9.3 (a borrow appears here) and take the antilog.

## Class Activity
Essential Mathematics Book 2, Page 7, Exercise 1.5, Questions 8 and 14; Page 9, Exercise 1.7, Questions 7 and 9.

## Assignment
Essential Mathematics Book 2, Page 7, Exercise 1.5, Questions 4, 8, 10 and 16.

## Summary — Key Points
- Add mantissas and carry; subtract mantissas and borrow when needed.
- A carry of 1 from the mantissa is added to the characteristics (including bars).
- Every multiplication is an addition of logs; every division is a subtraction of logs.`,
    },
    {
      title: 'Lesson 2.3 — Operations Involving Negative Logarithms',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Multiply, divide, find powers and roots of numbers less than 1 using logarithms.
- Multiply and divide logarithms that have bar characteristics correctly.

## Introduction
When a calculation involves numbers less than 1, the logarithms involved carry bar characteristics. Multiplying or dividing such logs (for powers and roots) needs a clear head — this lesson gives you the recipes and worked examples.

## Key Rules for Bar Logarithms
**Multiplying a bar log by a positive whole number (powers):**

Write the log as (bar n + mantissa) and multiply both parts separately:

- 2̄.7664 × 3 = (−2 + 0.7664) × 3 = −6 + 2.2992 = −3.7008 = 4̄.2992

Convert the whole-number part back into bar notation at the end.

**Dividing a bar log (roots):**

Rewrite the characteristic so that it divides exactly by the root:

- 3̄.9945 ÷ 5: write 3̄.9945 as (bar-five + 2.9945), then ÷ 5 = −1 + 0.5989 = 1̄.5989

## Worked Example 1 (from the scheme)
Evaluate (0.0584 × 0.115 × 2.985)⁴ using logarithm tables.

**Solution**

Let x = (0.0584 × 0.115 × 2.985)⁴. Then:

log x = 4(log 0.0584 + log 0.115 + log 2.985)

From tables: log 0.0584 = 2̄.7664, log 0.115 = 1̄.0607, log 2.985 = 0.4750.

Adding: 2̄.7664 + 1̄.0607 = 3̄.8271; then 3̄.8271 + 0.4750 = 2̄.3021.

log x = 4 × 2̄.3021 = (−2 + 0.3021) × 4 = −8 + 1.2084 = −6.7916 = 7̄.2084

Antilog 0.2084 = 1.616, so x = 1.616 × 10⁻⁷

**x ≈ 0.000000162**

## Worked Example 2 (from the scheme)
Evaluate [(0.000675)³ × ⁵√0.009875] ÷ [0.000831 × ⁹√9.654] using logarithm tables.

**Solution**

Let y be the expression. Then:

log y = 3 log 0.000675 + ⅕ log 0.009875 − (log 0.000831 + ⅑ log 9.654)

From tables:

- log 0.000675 = 4̄.8293, so 3 × 4̄.8293 = −9.5121 = 10̄.4879
- log 0.009875 = 3̄.9945, so (−3 + 0.9945) ÷ 5 = −0.4011 = 1̄.5989
- Numerator: 10̄.4879 + 1̄.5989 = −9.5121 − 0.4011 = −9.9132 = 10̄.0868
- log 0.000831 = 4̄.9196 = −3.0804
- log 9.654 = 0.9847, so ⅑ × 0.9847 = 0.1094
- Denominator: −3.0804 + 0.1094 = −2.9710 = 3̄.0290

log y = −9.9132 − (−2.9710) = −6.9422 = 7̄.0578

Antilog 0.0578 = 1.142, so y = 1.142 × 10⁻⁷

**y ≈ 0.000000114**

## Class Activity
Essential Mathematics Book 2, Page 12, Exercise 1.10, Questions 4(a) and 4(e).

## Assignment
Essential Mathematics Book 2, Page 12, Exercise 1.10, Questions 5(a)–5(c).

## Summary — Key Points
- Treat a bar log as (negative characteristic + positive mantissa) before multiplying or dividing.
- For roots, rewrite the bar characteristic so it divides exactly.
- Convert back to bar notation before reading the antilog.`,
    },
    {
      title: 'Lesson 2.4 — Simple Logarithmic Equations',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- State the relationship between indices and logarithms.
- Solve simple logarithmic equations such as log_x 81 = 4 and log₅ 0.04 = x.
- Check solutions by converting back to index form.

## Introduction
A logarithm is just an index in disguise. The equation log_a N = x says exactly the same thing as aˣ = N. Once you can switch between the two forms, simple logarithmic equations become easy.

## The Fundamental Relationship

**N = aˣ  ⟺  log_a N = x**

- a is called the **base**.
- N must be positive.
- Read log_a N as: "the power to which a must be raised to give N".

## Worked Example 1 (from the scheme)
Solve log_x 81 = 4.

**Solution**

Convert to index form: x⁴ = 81.

81 = 3⁴, so x⁴ = 3⁴.

**x = 3** (the base of a logarithm must be positive and not equal to 1).

## Worked Example 2 (from the scheme)
Solve log₅ 0.04 = x.

**Solution**

Convert to index form: 5ˣ = 0.04.

Write 0.04 as a fraction with base 5: 0.04 = 4/100 = 1/25 = 1/5² = 5⁻².

So 5ˣ = 5⁻².

**x = −2**

## Worked Example 3
Solve log₂ (3y − 1) = 4.

**Solution**

Index form: 2⁴ = 3y − 1, so 16 = 3y − 1.

3y = 17, y = 17/3.

Check: 3(17/3) − 1 = 16 = 2⁴. Correct.

## More Practice Patterns
1. log₃ 27 = x → 3ˣ = 27 = 3³ → x = 3.
2. log_x 16 = 2 → x² = 16 → x = 4 (reject −4; a base cannot be negative).
3. log₁₀ x = −3 → x = 10⁻³ = 0.001.

## Class Activity
Essential Mathematics Book 2, Page 11, Exercise 1.9, Questions 1(a), 1(c) and 1(g).

## Assignment
Essential Mathematics Book 2, Page 11, Exercise 1.9, Question 2(b)–2(d).

## Summary — Key Points
- log_a N = x ⟺ aˣ = N. Every logarithm is an index.
- Rewrite both sides with the same base to compare powers.
- A logarithm base must be positive and different from 1, so reject negative or unit roots.`,
    },
  ],
}
// __END__
