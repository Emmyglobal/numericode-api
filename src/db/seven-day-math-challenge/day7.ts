import type { ChallengeModuleData, ChallengeQuizQuestion } from './types'

// ─── Day 7 — Final Mathematics Challenge ───────────────────────────────────────
// Three questions per topic across the 15-question final assessment.
// Answers verified: 6x+2=3x+20 -> x=6; (x-2)(x+5) -> 2,-5; 2^3 x 2^4 = 2^7=128;
// 3^-2 = 1/9; log7(49)=2; log2(64)-log2(4)=6-2=4; log5(1/25)=-2;
// x+y=11, 2x-y=1 -> 3x=12, x=4, y=7; 3x+2y=16, x-y=2 -> x=4, y=2;
// 4x-y=7, x+y=8 -> 5x=15, x=3, y=5; x^2-7x+12 -> 3,4; 2x^2+x-3 -> 1,-1.5;
// x^2-2x-8 -> 4,-2; 3x^2+2x-8 -> (3x-4)(x+2) -> 4/3,-2.
const L_REVISION = `## Final Revision — Everything in One Place

Congratulations on reaching Day 7. Here is a compact summary of all five topics. Read it through, then attempt the final assessment.

## Topic 1 — Algebra Basics
- A **variable** stands for an unknown; a **constant** does not change.
- **Terms** are split by + and - signs, so 5a - 3b + 7 has three terms.
- **Like terms** share the same letter part; add or subtract the coefficients.
  7p + 3p = 10p
- **Equations**: do the same thing to both sides, then check by substitution.
  6x + 2 = 3x + 20  ->  3x = 18  ->  x = 6

## Topic 2 — Indices
- Index notation: 2^4 means 2 x 2 x 2 x 2.
- Multiply with the same base: **add** the indices. 2^3 x 2^4 = 2^7
- Divide with the same base: **subtract**. 3^6 / 3^2 = 3^4
- A power of a power: **multiply**. (2^3)^2 = 2^6
- a^0 = 1, and a^(-n) = 1 / a^n

## Topic 3 — Logarithms
- A logarithm asks "to what power?", and is the reverse of an index.
  log base 2 of 8 = 3  because  2^3 = 8
- Product becomes a sum, quotient becomes a difference, power becomes a multiplier.
  log(M x N) = log M + log N
  log(M / N) = log M - log N
  log(M^n) = n x log M
- In school mathematics, a log with no base means **base 10**.

## Topic 4 — Simultaneous Equations
- Two unknowns need **two** equations, true at the same time.
- **Elimination**: add or subtract to cancel a letter (multiply first if needed).
  x + y = 5, x - y = 1  ->  2x = 6  ->  (3, 2)
- **Substitution**: solve one equation for a letter, then replace it in the other.
- Always write the solution as **(x value, y value)** and check both equations.

## Topic 5 — Quadratic Equations
- Standard form is **ax^2 + bx + c = 0**, with a not zero.
- **Factorisation** needs two numbers that multiply to c and add to b.
  x^2 - 5x + 6 = (x - 2)(x - 3) = 0
- **The formula** always works:
  **x = (-b +/- sqrt(b^2 - 4ac)) / 2a**
- A quadratic has at most **two** roots.

## Your Exam Technique
1. Read each question twice before answering.
2. Underline what is being asked — the question may ask for one letter, not both.
3. Show your working; it helps you spot the wrong step.
4. Check your answer where the question allows it.
5. Do not spend too long on one question — come back to it at the end.

## Good Luck
You have worked through six days of focused practice. Take your time, do your honest best, and enjoy the finish.`

const L_PRACTICE = `## Before the Final Assessment

Work through these five questions — one from each topic — to warm up.

**Warm-up 1 (Algebra).** Solve 6x + 2 = 3x + 20.
**Warm-up 2 (Indices).** Simplify 2^3 x 2^4.
**Warm-up 3 (Logarithms).** Find log base 7 of 49.
**Warm-up 4 (Simultaneous equations).** Solve x + y = 11 and 2x - y = 1.
**Warm-up 5 (Quadratics).** Factorise and solve x^2 - 7x + 12 = 0.

## Warm-up Solutions

**1.** 6x - 3x = 20 - 2, so 3x = 18 and **x = 6**.

**2.** Add the indices: **2^7** (which is 128).

**3.** 7 x 7 = 49, so 7^2 = 49 and **log base 7 of 49 = 2**.

**4.** Adding the equations gives 3x = 12, so x = 4. Then x + y = 11 gives **y = 7**.
Solution **(4, 7)**.

**5.** Two numbers multiplying to 12 and adding to -7 are -3 and -4, so
**(x - 3)(x - 4) = 0**, giving **x = 3 and x = 4**.

## The Final Assessment
The assessment has **15 questions** — three on each of the five topics.

- Time limit: 25 minutes
- Passing score: 60 percent (9 out of 15)
- You may take it up to 3 times

Take a breath, read carefully, and do your best. You have already done the hard work over the past six days.`

// Fifteen questions, grouped three per topic. Kept in one array so the question
// count and the per-topic balance stay easy to verify.
const ASSESSMENT_QUESTIONS: ChallengeQuizQuestion[] = [
  // ── Algebra (3) ──
  {
    questionText: 'Solve 6x + 2 = 3x + 20. What is x?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'x = 4', isCorrect: false },
      { id: 'b', text: 'x = 6', isCorrect: true },
      { id: 'c', text: 'x = 8', isCorrect: false },
      { id: 'd', text: 'x = 18', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: 1,
    explanation: 'Collect the x terms on the left and the numbers on the right: 6x - 3x = 20 - 2, so 3x = 18 and x = 6. Check: 6(6) + 2 = 38 and 3(6) + 20 = 38.',
  },
  {
    questionText: 'Factorise x^2 + 3x - 10.',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: '(x + 5)(x - 2)', isCorrect: true },
      { id: 'b', text: '(x - 5)(x + 2)', isCorrect: false },
      { id: 'c', text: '(x + 5)(x + 2)', isCorrect: false },
      { id: 'd', text: '(x - 3)(x - 10)', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: 1,
    explanation: 'We need two numbers multiplying to -10 and adding to 3: that is 5 and -2. So x^2 + 3x - 10 = (x + 5)(x - 2).',
  },
  {
    questionText: 'How many terms are in the expression 4x^2 - 7x + 2? (Enter a number only)',
    questionType: 'fill_blank',
    correctAnswer: '3',
    points: 1,
    explanation: 'Terms are separated by + and - signs: 4x^2, -7x and 2. That is three terms.',
  },
  // ── Indices (3) ──
  {
    questionText: 'Simplify 2^3 x 2^4.',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: '2^7', isCorrect: true },
      { id: 'b', text: '2^12', isCorrect: false },
      { id: 'c', text: '4^7', isCorrect: false },
      { id: 'd', text: '16', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: 1,
    explanation: 'Powers with the same base multiply by adding the indices: 3 + 4 = 7, so the answer is 2^7 (which equals 128).',
  },
  {
    questionText: 'What is the value of 3^-2? (Answer as a fraction, for example: 1/9)',
    questionType: 'fill_blank',
    correctAnswer: '1/9',
    points: 1,
    explanation: 'A negative index means divide: 3^-2 = 1/3^2 = 1/9.',
  },
  {
    questionText: 'Simplify (3^2)^3.',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: '3^5', isCorrect: false },
      { id: 'b', text: '3^6', isCorrect: true },
      { id: 'c', text: '9^3', isCorrect: false },
      { id: 'd', text: '3^9', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: 1,
    explanation: 'A power raised to a power multiplies the indices: 2 x 3 = 6, so (3^2)^3 = 3^6.',
  },
  // ── Logarithms (3) ──
  {
    questionText: 'Find log base 7 of 49.',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: '2', isCorrect: true },
      { id: 'b', text: '7', isCorrect: false },
      { id: 'c', text: '14', isCorrect: false },
      { id: 'd', text: '49', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: 1,
    explanation: '7 x 7 = 49, so 7^2 = 49 and log base 7 of 49 = 2.',
  },
  {
    questionText: 'Evaluate log base 2 of 64 minus log base 2 of 4.',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: '2', isCorrect: false },
      { id: 'b', text: '4', isCorrect: true },
      { id: 'c', text: '16', isCorrect: false },
      { id: 'd', text: '32', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: 1,
    explanation: 'log 64 = 6 and log 4 = 2, so 6 - 2 = 4.',
  },
  {
    questionText: 'Find log base 5 of 1/25. (Enter a number only, for example: -2)',
    questionType: 'fill_blank',
    correctAnswer: '-2',
    points: 1,
    explanation: '1/25 = 5^-2 because 5 x 5 = 25, so log base 5 of (1/25) = -2.',
  },
  // ── Simultaneous equations (3) ──
  {
    questionText: 'Solve x + y = 11 and 2x - y = 1. What is the value of x?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'x = 3', isCorrect: false },
      { id: 'b', text: 'x = 4', isCorrect: true },
      { id: 'c', text: 'x = 5', isCorrect: false },
      { id: 'd', text: 'x = 6', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: 1,
    explanation: 'Adding the two equations gives 3x = 12, so x = 4. Then x + y = 11 gives y = 7.',
  },
  {
    questionText: 'Solve 3x + 2y = 16 and x - y = 2. Which solution is correct?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'x = 3 and y = 2', isCorrect: false },
      { id: 'b', text: 'x = 4 and y = 2', isCorrect: true },
      { id: 'c', text: 'x = 2 and y = 4', isCorrect: false },
      { id: 'd', text: 'x = 4 and y = 3', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: 1,
    explanation: 'Multiply the second equation by 2 to get 2x - 2y = 4, then add it to the first: 5x = 20, so x = 4. Then 4 - y = 2 gives y = 2. Check: 3(4) + 2(2) = 16 and 4 - 2 = 2.',
  },
  {
    questionText: 'Solve 4x - y = 7 and x + y = 8. What is the value of y?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'y = 3', isCorrect: false },
      { id: 'b', text: 'y = 4', isCorrect: false },
      { id: 'c', text: 'y = 5', isCorrect: true },
      { id: 'd', text: 'y = 7', isCorrect: false },
    ],
    correctAnswer: 'c',
    points: 1,
    explanation: 'Adding the equations gives 5x = 15, so x = 3. Then 3 + y = 8 gives y = 5. Check: 4(3) - 5 = 7 and 3 + 5 = 8.',
  },
  // ── Quadratic equations (3) ──
  {
    questionText: 'Factorise and solve x^2 - 7x + 12 = 0. What are the roots?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'x = 3 and x = 4', isCorrect: true },
      { id: 'b', text: 'x = -3 and x = -4', isCorrect: false },
      { id: 'c', text: 'x = 2 and x = 6', isCorrect: false },
      { id: 'd', text: 'x = 1 and x = 12', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: 1,
    explanation: 'Two numbers multiplying to 12 and adding to -7 are -3 and -4, so (x - 3)(x - 4) = 0 giving x = 3 and x = 4.',
  },
  {
    questionText: 'Factorise and solve 2x^2 + x - 3 = 0. What is the larger root?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'x = 1', isCorrect: true },
      { id: 'b', text: 'x = -3/2', isCorrect: false },
      { id: 'c', text: 'x = 3/2', isCorrect: false },
      { id: 'd', text: 'x = -1', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: 1,
    explanation: 'Two numbers multiplying to (2 x -3) = -6 and adding to 1 are 3 and -2, so (2x + 3)(x - 1) = 0. This gives x = -3/2 or x = 1, and the larger root is 1.',
  },
  {
    questionText: 'Factorise and solve x^2 - 2x - 8 = 0. What is the larger root? (Enter a number only)',
    questionType: 'fill_blank',
    correctAnswer: '4',
    points: 1,
    explanation: 'Two numbers multiplying to -8 and adding to -2 are 2 and -4, so (x - 4)(x + 2) = 0. The roots are 4 and -2, and the larger is 4.',
  },
]

export const day7: ChallengeModuleData = {
  title: 'Day 7 — Final Mathematics Challenge',
  lessons: [
    { title: 'Day 7 — Final Revision Lesson', duration: 30, content: L_REVISION },
    {
      title: 'Day 7 — Final Assessment',
      duration: 40,
      content: L_PRACTICE,
      quiz: {
        title: 'Day 7 — Final Mathematics Assessment',
        description: 'Fifteen questions: three each on algebra, indices, logarithms, simultaneous equations and quadratic equations.',
        timeLimit: 25,
        passingScore: 60,
        maxAttempts: 3,
        questions: [...ASSESSMENT_QUESTIONS],
      },
    },
  ],
}
