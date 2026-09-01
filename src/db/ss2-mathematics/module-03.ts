import type { Ss2ModuleData } from './types'

export const module03: Ss2ModuleData = {
  title: 'Module 3 — Week 3: Approximation & Percentage Error',
  lessons: [
    {
      title: 'Lesson 3.1 — Approximation',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Explain what approximation means and why it is necessary.
- Round numbers up or down to a stated degree of accuracy: nearest whole number, nearest ten, nearest tenth, nearest hundredth.
- Distinguish between rounding up and rounding down.

## Introduction
Measured quantities are never exact. A trader does not need ₦4 781.63 — "about ₦4 800" is enough. Approximation means stating a number to a sensible degree of accuracy. This week we study the main methods: decimal places, significant figures and percentage error.

## Key Definitions
**Approximation** is the process of giving a number that is close to, but not exactly, the true value.

- **Rounding down** means the approximated number is less than the original (e.g. 47.3 ≈ 47).
- **Rounding up** means the approximated number is greater than the original (e.g. 47.6 ≈ 48).

## The Rounding Rule
Look at the digit immediately after the place you are rounding to:

1. If it is **5 or more**, round **up** (add 1 to the last kept digit).
2. If it is **4 or less**, round **down** (leave the last kept digit unchanged).

## Worked Examples
**Example 1: Round 4 782 to the nearest hundred**

The hundreds digit is 7; the next digit is 8 (≥ 5), so round up.

4 782 ≈ **4 800**

**Example 2: Round 6 349 to the nearest ten**

The tens digit is 4; the next digit is 9 (≥ 5), so round up.

6 349 ≈ **6 350**

**Example 3: Round 8.47 to the nearest whole number**

The next digit after the point is 4 (< 5), so round down.

8.47 ≈ **8**

**Example 4: Round 12.864 to the nearest tenth**

The tenths digit is 8; the next digit is 6 (≥ 5), so round up.

12.864 ≈ **12.9**

**Example 5: Round 3.14159 to the nearest hundredth**

The hundredths digit is 4; the next digit is 1 (< 5), so round down.

3.14159 ≈ **3.14**

## Everyday Uses
- Money: the nearest naira or kobo.
- Population figures: the nearest million.
- Measurements: to the nearest cm, kg or litre, depending on the instrument.

## Class Activity
1. Round 6 254 to the nearest ten, hundred and thousand.
2. Round 19.87 to the nearest whole number and to the nearest tenth.
3. Write down two numbers that both round to 40 (nearest ten).

## Assignment
1. Round 906.585 to the nearest whole number, tenth and hundredth.
2. The distance from Lagos to Abuja is 748.6 km. Approximate this to the nearest 10 km and explain whether you rounded up or down.

## Summary — Key Points
- 5 or more → round up; 4 or less → round down.
- State the degree of accuracy whenever you approximate.
- Approximation always introduces a small error — next lessons quantify it.`,
    },
    {
      title: 'Lesson 3.2 — Decimal Places',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Round any number correct to 1, 2 or 3 decimal places (d.p.).

## Introduction
A **decimal place** is one position after the decimal point. Giving a value "correct to 2 d.p." means keeping exactly two digits after the point and rounding the rest away using the standard rule.

## The Method
1. Count the required number of digits after the point.
2. Look at the **next** digit.
3. If it is 5 or more, add 1 to the last kept digit; otherwise leave it.
4. Keep trailing zeros — they show the degree of accuracy (398.20 is correct to 2 d.p.).

## Worked Examples (from the scheme)
Round each number to 1, 2 and 3 decimal places.

**Example 1: 0.2736**

- 1 d.p.: next digit is 7 (≥ 5) → **0.3**
- 2 d.p.: next digit is 3 (< 5) → **0.27**
- 3 d.p.: next digit is 6 (≥ 5) → **0.274**

**Example 2: 398.1959**

- 1 d.p.: next digit is 9 (≥ 5) → **398.2**
- 2 d.p.: next digit is 5 (≥ 5) → **398.20** (the zero is kept)
- 3 d.p.: next digit is 9 (≥ 5) → **398.196**

## Common Errors to Avoid
- Writing 398.2 instead of 398.20 for 2 d.p. — the trailing zero matters.
- Rounding twice (e.g. 0.2736 → 0.274 → 0.27). Always round from the **original** number.
- Forgetting to carry: 2.999 to 2 d.p. is 3.00, not 2.99.

## Class Activity
1. Round 5.0649 to 1, 2 and 3 decimal places.
2. Round 19.998 to 2 decimal places.
3. A metre rule reads 0.8462 m. Express this correct to 2 d.p.

## Assignment
1. Round 72.4564 to 1, 2 and 3 decimal places.
2. Express 0.0955 correct to 2 d.p., showing your working from the original figure.

## Summary — Key Points
- d.p. counts digits after the point only.
- Round from the original number, once.
- Keep trailing zeros to display the degree of accuracy.`,
    },
    {
      title: 'Lesson 3.3 — Significant Figures',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Identify significant figures in any number.
- Round numbers correct to 1, 2 or 3 significant figures (s.f.).

## Introduction
**Significant figures** start from the first non-zero digit of a number. Unlike decimal places, they measure the accuracy of the whole number, not just the fractional part. WAEC usually instructs "give your answer correct to 3 significant figures".

## The Rules
1. The **first significant figure** is the first non-zero digit, counting from the left.
2. Zeros between non-zero digits are significant (2005 has 4 s.f.).
3. Leading zeros are never significant (0.006 has 1 s.f.).
4. Trailing zeros after the point are significant (2.300 has 4 s.f.).
5. Round using the usual rule: 5 or more rounds up, 4 or less rounds down.

## Worked Examples (from the scheme)
Round each number to 1, 2 and 3 significant figures.

**Example 1: 0.9567**

The first significant figure is 9.

- 1 s.f.: next digit is 5 (≥ 5), so 9 rounds up to 10 → the number becomes **1**
- 2 s.f.: next digit is 6 → **0.96**
- 3 s.f.: next digit is 7 → **0.957**

**Example 2: 158.999**

The first significant figure is 1.

- 1 s.f.: next digit is 5 (≥ 5) → **200**
- 2 s.f.: next digit is 8 → **160**
- 3 s.f.: next digit is 9 → **159**

## Comparing d.p. and s.f.
- 0.0274 to 2 d.p. is 0.03, but to 2 s.f. it is 0.027.
- 3 842 to 2 d.p. is 3 842.00 (unchanged), but to 2 s.f. it is 3 800.

Decimal places fix the *size of the step*; significant figures fix the *number of reliable digits*.

## Class Activity
1. Write down the number of significant figures in: 4005, 0.0302, 12.90.
2. Round 82.549 to 1, 2 and 3 significant figures.
3. Round 0.006 485 to 2 significant figures.

## Assignment
1. Round 0.000 472 9 to 1, 2 and 3 significant figures.
2. The mass of a bag of cement is 50.485 kg. State this correct to 3 significant figures.

## Summary — Key Points
- Count significant figures starting from the first non-zero digit.
- Leading zeros never count; trailing zeros after the point do count.
- Round once, from the original number, using the standard rule.`,
    },
    {
      title: 'Lesson 3.4 — Percentage Error',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Define absolute error, relative error and percentage error.
- Calculate the percentage error in measured quantities.
- Solve word problems involving percentage error, including in circumference and area of a circle.

## Introduction
Every measurement carries some error. Percentage error tells us how large that error is compared with the true (or claimed) value, as a percentage. It is a favourite WAEC question.

## Key Formulas

**Absolute Error = |Measured Value − Actual Value|**

**Relative Error = Absolute Error ÷ Actual Value**

**Percentage Error = (Absolute Error ÷ Actual Value) × 100%**

## Worked Example 1 (from the scheme)
A student measures the mass of a book as 1.1 kg but the actual mass is 1.24 kg. Find the percentage error.

**Solution**

Absolute error = |1.1 − 1.24| = 0.14 kg

Relative error = 0.14 ÷ 1.24 = 0.1129

Percentage error = 0.1129 × 100% ≈ **11.3%**

## Worked Example 2 (from the scheme)
The height of a pole is measured as 5.98 m. This measurement is 5% smaller than the exact height. Find the exact height of the pole.

**Solution**

The measurement is 5% smaller, so: measured = 95% of exact.

5.98 = 0.95 × exact

Exact = 5.98 ÷ 0.95 = 6.2947 m

**Exact height ≈ 6.29 m**

(As a check: the absolute error is 6.2947 − 5.98 = 0.3147 m, and 0.3147 ÷ 6.2947 × 100% = 5%. Consistent.)

## Worked Example 3 (from the scheme)
The exact diameter of a circle is 8 cm but a student measures it as 8.2 cm. Find the percentage error in (a) the circumference, (b) the area.

**Solution**

(a) Circumference C = πd, so the error in C comes only from the error in d.

Absolute error in d = |8.2 − 8| = 0.2 cm

Percentage error in C = (0.2 ÷ 8) × 100% = **2.5%**

(b) Area A = πd²/4. Differentiating (or comparing): error in A relative to A is 2 × (error in d relative to d).

Percentage error in A = 2 × 2.5% = **5%**

Exact area = π × 8²/4 = 16π; measured area = π × 8.2²/4 = 16.81π.

Error = 0.81π; percentage error = 0.81π ÷ 16π × 100% = 5.06% ≈ 5%.

## Class Activity
Essential Mathematics Book 2, Page 22, Exercise 2.4, Questions 2, 3 and 7.

## Assignment
Essential Mathematics Book 2, Page 22, Exercise 2.4, Questions 10–12.

## Summary — Key Points
- Percentage error = absolute error ÷ actual value × 100%.
- "5% smaller" means the measurement is 95% of the exact value.
- For a circle, the percentage error in the area is twice that in the diameter (or radius).`,
    },
    {
      title: 'Lesson 3.5 — Degree of Accuracy',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Explain the degree of accuracy of a measured value.
- Use a formula with values of different degrees of accuracy and state the result sensibly.
- Find the range (bounds) of possible true values of a rounded result.

## Introduction
When a formula uses measured values, the answer can be no more accurate than the least accurate measurement. This lesson teaches you how to choose and justify a sensible degree of accuracy for calculated results.

## Key Idea
A value quoted as 12.8 cm is correct to the nearest 0.1 cm, so the true circumference lies between **12.75 cm and 12.85 cm**. Every rounded value hides a small interval of possible true values.

## Worked Example (from the scheme)
The circumference of a circle is C = 12.8 cm and π = 3.142. Find the radius r, using r = C ÷ 2π, and give your answer to a suitable degree of accuracy.

**Solution**

r = C/(2π)

r = 12.8 ÷ (2 × 3.142) = 12.8 ÷ 6.284 = 2.0369… cm

The inputs (12.8, 3.142) are given to 3 significant figures, so the answer is sensible to 3 s.f.:

**r ≈ 2.04 cm**

## Finding the Bounds
Since C = 12.8 is correct to 1 d.p.: 12.75 ≤ C < 12.85.

Since π = 3.142 is correct to 3 d.p.: 3.1415 ≤ π < 3.1425.

- Largest possible r = 12.85 ÷ (2 × 3.1415) = 12.85 ÷ 6.283 = 2.0452 cm
- Smallest possible r = 12.75 ÷ (2 × 3.1425) = 12.75 ÷ 6.285 = 2.0287 cm

So the true radius lies between about **2.03 cm and 2.05 cm**, which confirms that quoting r ≈ 2.04 cm is honest.

## Choosing a Degree of Accuracy — Guidelines
1. Match the accuracy of your answer to the least accurate input (usually 3 s.f. is safe).
2. Never add imaginary precision: 12.8 ÷ 6.284 on a calculator may show 2.036919..., but the extra digits are not reliable.
3. In examination answers, always include the unit and the stated degree of accuracy.

## Class Activity
Essential Mathematics Book 2, Page 23, Exercise 2.5, Questions 1(a)–1(d).

## Assignment
Essential Mathematics Book 2, Page 23, Exercise 2.5, Questions 5 and 9.

## Summary — Key Points
- Every rounded value represents a range of possible true values.
- A calculated result should not be more accurate than its least accurate input.
- r = C ÷ 2π; with C = 12.8 cm and π = 3.142, r ≈ 2.04 cm.`,
    },
  ],
}
// __END__
