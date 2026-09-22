import type { Ss1ModuleData } from './types'

export const module04: Ss1ModuleData = {
  title: 'Module 4 — Week 5: Standard Form & Approximation',
  lessons: [
    {
      title: 'Week 5 — Standard Form & Approximation',
      duration: 45,
      content: `# Week 5 — Standard Form & Approximation

## Learning Objectives
By the end of this lesson you should be able to:
- Express numbers in standard form A x 10^n where 1 <= A < 10.
- Multiply and divide numbers given in standard form.
- Add and subtract numbers in standard form.
- Approximate numbers to a given degree of accuracy (decimal places, significant figures).
- Apply approximation to everyday problems.

## Introduction
Standard form lets us write very large or very small numbers compactly. Approximation helps us check answers quickly and is essential in real-world measurements where exact precision is impossible.

## Standard Form
A number is in standard form when written as **A x 10^n**, where 1 <= A < 10 and n is an integer.

### Worked Example 1
Express in standard form:
(a) 5081    (b) 0.1067    (c) 0.00000925    (d) 3279.1

**Solution**
(a) 5081 = **5.081 x 10^3**  (move point 3 places left)
(b) 0.1067 = **1.067 x 10^{-1}**  (move point 1 place right)
(c) 0.00000925 = **9.25 x 10^{-6}**  (move point 6 places right)
(d) 3279.1 = **3.2791 x 10^3**  (move point 3 places left)

### Worked Example 2 — Converting Back
Change to ordinary form:
(a) 3.05 x 10^4    (b) 2.6 x 10^{-2}

**Solution**
(a) 3.05 x 10^4 = 30500
(b) 2.6 x 10^{-2} = 0.026

## Multiplication and Division in Standard Form
Multiply/divide the coefficients, then add/subtract the exponents.

### Worked Example 3
Evaluate, giving your answer in standard form:
(a) (2 x 10^5) x (3 x 10^4)    (b) (8 x 10^6) / (2 x 10^3)    (c) (6 x 10^8) / (2 x 10^{-3})

**Solution**
(a) (2 x 3) x 10^{5+4} = **6 x 10^9**
(b) (8/2) x 10^{6-3} = 4 x 10^3 = **4000**
(c) (6/3) x 10^{8-(-3)} = 2 x 10^{11} = **2 x 10^{11}**

## Addition and Subtraction in Standard Form
Make the exponents the same, then add/subtract the coefficients.

### Worked Example 4
Evaluate: (a) (4.2 x 10^5) + (1.8 x 10^4)    (b) (9 x 10^5) - (3 x 10^4)

**Solution**
(a) 4.2 x 10^5 + 0.18 x 10^5 = **4.38 x 10^5**
(b) 9 x 10^5 - 0.3 x 10^5 = **8.7 x 10^5**

## Approximation
### Decimal Places
Round to a given number of decimal places by looking at the next digit.

### Significant Figures
The digits that carry meaning in a number. Zeroes are not always significant.
- 4306 has 4 s.f.
- 0.0045 has 2 s.f. (leading zeroes are not significant)
- 300 has 1 s.f. (trailing zeroes in a whole number without a decimal are not significant)

### Worked Example 5
Round to 3 significant figures:
(a) 0.006897    (b) 45678    (c) 2.0804

**Solution**
(a) 0.006897 -> 3rd s.f. is 6, next digit is 8 (round up) -> **0.00690**
(b) 45678 -> 3rd s.f. is 5, next digit is 6 (round up) -> **45700**
(c) 2.0804 -> 3rd s.f. is 0, next digit is 4 (round down) -> **2.08**

### Worked Example 6 — Approximation in Calculations
Estimate (425 x 0.398) / 19.2

**Solution**
Round to 1 s.f.: (400 x 0.4) / 20 = 160 / 20 = **8**
(The exact answer is approximately 8.81, so our estimate is reasonable.)

## Class Activity
Essential Mathematics SS1, Page 49, Ex 4.1, Nos 1a, b, c, 2c, d; Page 50, Ex 4.1, No. 3a & c; Page 50, Ex 4.1, No 4b.

## Assignment
Essential Mathematics SS1, Page 50, Ex 4.1, No. 5b & a; Page 55, Ex 4.4, No 3b, 4b & 5a.

## Summary — Key Points
- **Standard form:** A x 10^n where 1 <= A < 10 and n is an integer.
- **Multiplication:** multiply coefficients, add exponents.
- **Addition:** make exponents equal first.
- **Significant figures:** leading zeroes are not significant; trailing zeroes in whole numbers without decimals are not significant.
- **Use approximation to check your calculator work.**`,
      quiz: {
        title: 'Quiz W5 — Standard Form & Approximation',
        description: '8 questions on standard form, operations, and approximation.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'Express 0.00092 in standard form.', questionType: 'fill_blank', correctAnswer: '9.2 x 10^(-4)' },
          { id: 'q2', questionText: '3.8 x 10^5 in ordinary form is:', questionType: 'fill_blank', correctAnswer: '380000' },
          { id: 'q3', questionText: 'True or false: (2 x 10^3) x (3 x 10^4) = 6 x 10^7.', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q4', questionText: 'Round 45678 to 3 significant figures.', questionType: 'fill_blank', correctAnswer: '45700' },
          { id: 'q5', questionText: '0.006897 to 3 s.f. is:', questionType: 'fill_blank', correctAnswer: '0.00690' },
          { id: 'q6', questionText: 'Estimate (325 x 0.41) / 18 to 1 s.f.', questionType: 'multiple_choice', options: [{ id: 'a', text: '7', isCorrect: true }, { id: 'b', text: '10', isCorrect: false }, { id: 'c', text: '5', isCorrect: false }, { id: 'd', text: '12', isCorrect: false }], correctAnswer: 'a' },
          { id: 'q7', questionText: 'True or false: Leading zeroes in a decimal are significant figures.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q8', questionText: 'Add: (4.2 x 10^5) + (1.8 x 10^4) =', questionType: 'fill_blank', correctAnswer: '4.38 x 10^5' },
        ],
      },
      assignment: {
        title: 'Assignment W5 — Standard Form & Approximation',
        description: 'Show all working. Round final answers correctly.',
        dueDate: '2026-09-21T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Express in standard form: (a) 73400000, (b) 0.0000468, (c) 2070.1.', marks: 6 },
          { id: 'a2', type: 'subjective', title: 'Calculate, giving your answer in standard form: (8 x 10^7) / (2 x 10^{-3}).', marks: 5 },
          { id: 'a3', type: 'subjective', title: 'Round to the stated number of significant figures: (a) 3.14159 (2 s.f.), (b) 0.0045678 (3 s.f.), (c) 456789 (4 s.f.).', marks: 5 },
          { id: 'a4', type: 'subjective', title: 'Estimate (424 x 0.51) / 19.5 by rounding each number to 1 significant figure.', marks: 4 },
        ],
      },
    },
  ],
}