import type { Ss2ModuleData } from './types'

export const module01: Ss2ModuleData = {
  title: 'Module 1 — Week 1: Revision',
  lessons: [
    {
      title: 'Lesson 1.1 — Revision of SS1 Third Term',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Solve problems on direct, inverse, joint and partial variation.
- Apply the formula for the area of a sector of a circle.
- Rearrange a variation statement to find the constant of variation.

## Introduction
Before we begin new work this term, we revise two important SS1 topics: **variation** and the **sector of a circle**. These topics appear frequently in WAEC and NECO examinations, so make sure you master the methods shown here.

## Variation
Variation describes how one quantity changes with another.

- **Direct variation:** y varies directly as x, written y ∝ x, so y = kx.
- **Inverse variation:** y varies inversely as x, written y ∝ 1/x, so y = k/x.
- **Joint variation:** y varies jointly as x and z, so y = kxz.
- **Partial variation:** y = a + bx (partly constant, partly varying).

k is called the **constant of variation**.

### Worked Example 1 (from the scheme)
The time t taken to buy fuel at a filling station varies directly as the number of vehicles V in a queue and inversely as the number of pumps P. In a station with 10 pumps, it took 20 minutes to fuel 40 vehicles. Find the relationship between t, V and P.

**Solution**

Step 1 — write the variation statement:

t ∝ V/P

Step 2 — introduce the constant:

t = kV/P

Step 3 — substitute t = 20, V = 40, P = 10 to find k:

20 = k × 40/10 = 4k

k = 20 ÷ 4 = 5

Step 4 — state the relationship:

**t = 5V/P**

Check: if V = 40 and P = 10, t = 5 × 40 ÷ 10 = 20 minutes. Correct.

### Worked Example 2
y varies inversely as the square of x. When x = 2, y = 18. Find y when x = 6.

**Solution**

y = k/x². Substituting: 18 = k/4, so k = 72.

When x = 6: y = 72/36 = **2**.

## Sector of a Circle
For a circle of radius r with a sector of angle θ at the centre:

**Area of sector = (θ/360) × πr²**

### Worked Example 3 (from the scheme)
A sector of a circle with radius 21 cm has an area of 280 cm². Taking π = 22/7, calculate the angle subtended by the sector at the centre of the circle.

**Solution**

Area = (θ/360) × πr²

280 = (θ/360) × (22/7) × 21 × 21

(22/7) × 441 = 22 × 63 = 1386

280 = 1386θ/360

θ = 280 × 360 ÷ 1386 = 100800 ÷ 1386

**θ = 72 8/11° ≈ 72.7°**

## Class Activity
1. If x varies directly as y and x = 8 when y = 12, find x when y = 30.
2. The cost C of feeding some students varies jointly as the number of students n and the number of days d. If ₦4 800 feeds 8 students for 3 days, find the formula connecting C, n and d.
3. A sector of a circle of radius 14 cm subtends an angle of 90° at the centre. Taking π = 22/7, find the area of the sector.

## Assignment
1. w varies inversely as the square root of p. When p = 9, w = 10. Find w when p = 25.
2. A sector of a circle has an area of 154 cm² and an angle of 45° at the centre. Taking π = 22/7, find the radius of the circle.

## Summary — Key Points
- Translate every variation statement into an equation with a constant k before substituting values.
- Area of a sector = (θ/360) × πr²; keep π as 22/7 when the radius is a multiple of 7.
- Always check your constant of variation by substituting the original data.`,
    },
    {
      title: 'Lesson 1.2 — Logarithms of Numbers Greater Than 1',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Find the characteristic and mantissa of the logarithm of any number greater than 1 using logarithm tables.
- Use logarithms to multiply, divide, and find powers and roots of numbers greater than 1.
- Use antilogarithm tables to return to ordinary numbers.

## Introduction
Logarithms turn multiplication into addition, division into subtraction, powers into multiplication and roots into division. This makes hard calculations (such as √127.5 ÷ 76.3) manageable without a calculator.

## Key Definitions
Every positive number N can be written as N = A × 10ⁿ, where 1 ≤ A < 10.

**log N = n + log A**

- The whole number n is the **characteristic**.
- The decimal part log A (read from tables) is the **mantissa**.

Examples of characteristics: log 76.3 has characteristic 1 (76.3 = 7.63 × 10¹); log 127.5 has characteristic 2; log 8.2 has characteristic 0.

## Rules of Logarithms
1. log (MN) = log M + log N — multiplication becomes addition.
2. log (M/N) = log M − log N — division becomes subtraction.
3. log Mᵖ = p log M — powers and roots become multiplication.

## Worked Example 1 (from the scheme)
Evaluate √127.5 ÷ 76.3 using logarithm tables.

**Solution**

Let x = √127.5 ÷ 76.3. Then:

log x = ½ log 127.5 − log 76.3

From tables: log 127.5 = 2.1055 and log 76.3 = 1.8825.

log x = ½ × 2.1055 − 1.8825 = 1.0528 − 1.8825

Borrow 1 from the characteristic: 1.0528 − 1.8825 = bar-one 1.1703 (written 1̄.1703).

Antilog of 1̄.1703: antilog 0.1703 = 1.479, and characteristic bar-one moves the point one place to the left.

**x ≈ 0.1479**

## Worked Example 2 (from the scheme)
Evaluate (54.7 × 66.5)² ÷ 16.1 using logarithm tables.

**Solution**

Let y = (54.7 × 66.5)² ÷ 16.1.

log y = 2(log 54.7 + log 66.5) − log 16.1

From tables: log 54.7 = 1.7380, log 66.5 = 1.8228, log 16.1 = 1.2068.

log 54.7 + log 66.5 = 3.5608

2 × 3.5608 = 7.1216

log y = 7.1216 − 1.2068 = 5.9148

Antilog of 0.9148 = 8.218, so y = 8.218 × 10⁵

**y ≈ 822 000 (3 s.f.)**

## Method Checklist
1. Write the expression, then take logs of the whole equation.
2. Collect characteristics and mantissas carefully (watch borrows and carries).
3. Use the antilog table at the end — never forget the characteristic.

## Class Activity
Essential Mathematics Book 2, Page 4, Exercise 1.3, Questions 10–13.

## Assignment
Essential Mathematics Book 2, Page 4, Exercise 1.3, Questions 22–25.

## Summary — Key Points
- Characteristic = power of 10; mantissa comes from the log table.
- Multiplication → add logs; division → subtract logs; powers/roots → multiply the log.
- The final answer is obtained from antilog tables, keeping the characteristic in mind.`,
    },
    {
      title: 'Lesson 1.3 — Standard Form',
      duration: 45,
      content: `## Learning Objectives
By the end of this lesson you should be able to:
- Express any number in standard form A × 10ⁿ where 1 ≤ A < 10 and n is an integer.
- Convert numbers from standard form back to ordinary form.
- Use standard form to compare very large and very small numbers.

## Introduction
Scientists and engineers constantly work with very large numbers (like the distance to the sun) and very small numbers (like the mass of a grain of sand). **Standard form** gives one compact, convenient way of writing them.

## Definition
A number is in standard form when it is written as:

**N = A × 10ⁿ**

where **1 ≤ A < 10** and **n is an integer**.

- Large numbers have positive powers of ten.
- Small numbers (less than 1) have negative powers of ten.

## Worked Examples (from the scheme)
Express each number in standard form.

**Example 1: 5081**

Move the point 3 places left so that only one non-zero digit remains in front: 5081 = **5.081 × 10³**

**Example 2: 0.1067**

Move the point 1 place right: 0.1067 = **1.067 × 10⁻¹**

**Example 3: 0.0014**

Move the point 3 places right: 0.0014 = **1.4 × 10⁻³**

**Example 4: 3279.1**

Move the point 3 places left: 3279.1 = **3.2791 × 10³**

**Example 5: 2070.1**

Move the point 3 places left: 2070.1 = **2.0701 × 10³**

## Converting Back to Ordinary Form
Multiply out the power of ten.

- 3.05 × 10⁴ = 30 500
- 2.6 × 10⁻² = 0.026

Positive n → move the point n places right. Negative n → move the point n places left.

## Why Standard Form Matters
- It makes multiplication and division by hand easy: (2 × 10³) × (3 × 10⁴) = 6 × 10⁷.
- It shows the size of a number at a glance: 6.1 × 10⁸ is clearly bigger than 6.1 × 10⁵.
- It is used to link logarithms to numbers: the characteristic of log N is exactly the n in N = A × 10ⁿ.

## Class Activity
Essential Mathematics Book 2, Page 1, Exercise 1.1, Questions 1(g)–1(k).

## Assignment
Essential Mathematics Book 2, Page 1, Exercise 1.1, Questions 1(r)–1(v).

## Summary — Key Points
- Standard form: N = A × 10ⁿ with 1 ≤ A < 10 and n an integer.
- Positive powers for large numbers, negative powers for numbers between 0 and 1.
- The power of ten in standard form equals the characteristic of the logarithm of the number.`,
    },
  ],
}
// __END__
