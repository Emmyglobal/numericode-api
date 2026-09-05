import type { Ss2LessonExtras } from './types'

// ─── SS2 Mathematics — per-lesson extras (practical exercise + quiz + assignment)
// Keyed by EXACT lesson title; merged by the seeder when lessons are inserted.
// Every lesson in modules 1–12 has an entry. Math uses KaTeX ($...$ inline,
// $$...$$ display); backslashes are doubled because these are JS template
// literals (\\frac in source == \frac in the stored string).

export const LESSON_EXTRAS: Record<string, Ss2LessonExtras> = {}

function add(title: string, extras: Ss2LessonExtras) {
  LESSON_EXTRAS[title] = extras
}

// ── Module 1 — Week 1: Revision ───────────────────────────────────────────────

add('Lesson 1.1 — Revision of SS1 Third Term', {
  exercise: `## Practical Exercise
Solve in your notebook, then check against the answers.

1. $y$ varies directly as $x$, and $y = 30$ when $x = 4$. Find $y$ when $x = 10$.
2. A sector of a circle has radius 7 cm and angle 90°. Find its area. Take $\\pi = \\frac{22}{7}$.
3. $p$ varies partly as the square of $q$ and partly constant: $p = a + bq^2$. When $q = 2$, $p = 14$; when $q = 5$, $p = 89$. Find $a$ and $b$.

**Check your answers:** (1) $y = 75$. (2) $A = \\frac{90}{360} \\times \\frac{22}{7} \\times 7^2 = 38.5\\text{ cm}^2$. (3) $a = 6$, $b = 2$.`,
  quiz: {
    title: 'Quiz 1.1 — Variation & Sector Revision',
    description: 'Five quick questions on variation and sector areas.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'If $y$ varies directly as $x$, the equation connecting them is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'y = kx', isCorrect: true }, { id: 'b', text: 'y = k/x', isCorrect: false }, { id: 'c', text: 'y = kxz', isCorrect: false }, { id: 'd', text: 'y = a + bx', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'The area of a sector of a circle with angle $\\theta$ and radius $r$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'θ/360 × πr²', isCorrect: true }, { id: 'b', text: 'πr²', isCorrect: false }, { id: 'c', text: '2πr', isCorrect: false }, { id: 'd', text: '½ θr', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: in inverse variation $y = k/x$, doubling $x$ halves $y$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: '$y$ varies inversely as the square of $x$. When $x = 2$, $y = 18$. Find $y$ when $x = 6$.', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q5', questionText: 'In the relationship $t = 5V/P$, the constant of variation is ____', questionType: 'fill_blank', correctAnswer: '5' },
    ],
  },
  assignment: {
    title: 'Assignment 1.1 — Variation & Sectors',
    description: 'Show full working. What a good answer looks like: formula stated first, substitution shown, final answer with units. Rubric: formula 4, substitution 3, accuracy 3.',
    dueDate: '2026-09-18T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'The time $t$ (minutes) to fuel vehicles varies directly as the number of vehicles $V$ and inversely as the number of pumps $P$. With 10 pumps, 40 vehicles took 20 minutes. (a) Find the law connecting $t$, $V$, $P$. (b) Find $t$ when $V = 50$, $P = 5$.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'A sector has radius 10.5 cm and angle 120°. Find its area and its arc length. Take $\\pi = 22/7$.', marks: 10 },
    ],
  },
})

add('Lesson 1.2 — Logarithms of Numbers Greater Than 1', {
  exercise: `## Practical Exercise
Use four-figure logarithm tables (a calculator's log key is for checking).

1. Find $\\log 45.7$.
2. Find $\\log 807.6$.
3. Use logarithms to evaluate $45.7 \\times 3.84$, correct to 3 significant figures.

**Check your answers:** (1) $\\log 45.7 = 1.6599$ (characteristic 1, mantissa 0.6599). (2) $2.9072$. (3) $1.6599 + 0.5843 = 2.2442$; antilog of $0.2442$ is $1.755$, so the answer is $175$ (3 s.f.).`,
  quiz: {
    title: 'Quiz 1.2 — Logarithms of Numbers > 1',
    description: 'Characteristics, mantissas, and multiplying with logarithms.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The characteristic of $\\log 457$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '1', isCorrect: false }, { id: 'b', text: '2', isCorrect: true }, { id: 'c', text: '3', isCorrect: false }, { id: 'd', text: '0', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '$\\log 1000$ (base 10) equals:', questionType: 'fill_blank', correctAnswer: '3' },
      { id: 'q3', questionText: 'True or false: $\\log 45.7$ and $\\log 4.57$ have the same mantissa.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: '$\\log 2 + \\log 5$ equals:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'log 7', isCorrect: false }, { id: 'b', text: 'log 10 = 1', isCorrect: true }, { id: 'c', text: 'log 2.5', isCorrect: false }, { id: 'd', text: '10', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q5', questionText: 'The characteristic of $\\log 8076.5$ is ____', questionType: 'fill_blank', correctAnswer: '3' },
    ],
  },
  assignment: {
    title: 'Assignment 1.2 — Evaluating with Log Tables',
    description: 'Use the logarithm method (add logs, then antilog) — not direct multiplication. What a good answer looks like: log values listed, correct characteristics, 3 s.f. final answer. Rubric: correct logs 5, addition 3, antilog 2.',
    dueDate: '2026-09-18T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Use logarithms to evaluate $4.72 \\times 38.6$ to 3 significant figures, showing every step.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Explain the difference between the characteristic and the mantissa of a logarithm, with one example of each.', marks: 10 },
    ],
  },
})

add('Lesson 1.3 — Standard Form', {
  exercise: `## Practical Exercise
Express in standard form $A \\times 10^n$ where $1 \\leq A < 10$.

1. 8076.5
2. 0.00052
3. Evaluate $(3.2 \\times 10^4) \\times (2 \\times 10^3)$, giving your answer in standard form.

**Check your answers:** (1) $8.0765 \\times 10^3$. (2) $5.2 \\times 10^{-4}$. (3) $6.4 \\times 10^7$ — multiply the $A$ parts ($3.2 \\times 2 = 6.4$) and add the indices ($4 + 3 = 7$).`,
  quiz: {
    title: 'Quiz 1.3 — Standard Form',
    description: 'Writing and computing with numbers in standard form.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '8076.5 in standard form is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '8.0765 × 10^3', isCorrect: true }, { id: 'b', text: '8.0765 × 10^-3', isCorrect: false }, { id: 'c', text: '80.765 × 10^2', isCorrect: false }, { id: 'd', text: '8.0765 × 10^4', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: '0.00052 = $5.2 \\times 10^n$. Find $n$.', questionType: 'fill_blank', correctAnswer: '-4' },
      { id: 'q3', questionText: 'True or false: in standard form, $A$ must satisfy $1 \\leq A < 10$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Write $6.5 \\times 10^{-3}$ as an ordinary decimal number.', questionType: 'fill_blank', correctAnswer: '0.0065' },
      { id: 'q5', questionText: 'When multiplying two numbers in standard form, you ____ the powers of 10.', questionType: 'fill_blank', correctAnswer: 'add' },
    ],
  },
  assignment: {
    title: 'Assignment 1.3 — Standard Form in Science',
    description: 'What a good answer looks like: answers in proper standard form ($1 \\leq A < 10$), indices added/subtracted correctly, units kept. Rubric: method 4, accuracy 4, presentation 2.',
    dueDate: '2026-09-18T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Evaluate $\\dfrac{8.4 \\times 10^5}{2 \\times 10^2}$, giving your answer in standard form. Show all steps.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Explain why scientists use standard form for very large and very small numbers, with one example of each.', marks: 10 },
    ],
  },
})

// ── Module 2 — Week 2: Logarithms (contd.) ────────────────────────────────────

add('Lesson 2.1 — Logarithms of Numbers Less Than 1', {
  exercise: `## Practical Exercise
Find the logarithm of each number (use bar-notation for negative characteristics).

1. 0.0472
2. 0.0006
3. Use logarithms to evaluate $0.0472 \\times 62.4$ to 3 s.f.

**Check your answers:** (1) $\\log 0.0472 = \\bar{2}.6739$ (the number is $4.72 \\times 10^{-2}$). (2) $\\bar{4}.7782$. (3) $\\bar{2}.6739 + 1.7952 = \\bar{1}.4691$... standardising: $-2 + 0.6739 + 1 + 0.7952 = \\bar{1}.4691$; antilog $0.4691 = 2.945$, so the answer is $0.295$ (3 s.f.).`,
  quiz: {
    title: 'Quiz 2.1 — Logs of Numbers < 1',
    description: 'Negative characteristics and bar notation.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The characteristic of $\\log 0.0472$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '2', isCorrect: false }, { id: 'b', text: 'bar-2 (−2)', isCorrect: true }, { id: 'c', text: 'bar-1', isCorrect: false }, { id: 'd', text: '0', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '$\\log 0.001$ equals:', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'q3', questionText: 'True or false: the characteristic of $\\log 0.52$ is bar-1 (−1).', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The characteristic of $\\log 0.00052$ is ____ (write as a number, e.g. 3 or -3)', questionType: 'fill_blank', correctAnswer: '-4' },
      { id: 'q5', questionText: 'A number between 0 and 1 always has a characteristic that is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Positive', isCorrect: false }, { id: 'b', text: 'Zero', isCorrect: false }, { id: 'c', text: 'Negative', isCorrect: true }, { id: 'd', text: 'Undefined', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment 2.1 — Working with Bar Notation',
    description: 'What a good answer looks like: characteristics stated correctly (bar-notation explained in words too), mantissas from tables, sensible rounding. Rubric: characteristics 5, mantissas 3, antilog 2.',
    dueDate: '2026-09-25T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Find the logarithm of 0.0006 and of 0.0472, stating each characteristic and mantissa. Then add them and find the antilog of the result.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Explain why the characteristic of the log of a number between 0 and 1 is negative. Use $0.05 = 5 \\times 10^{-2}$ in your explanation.', marks: 10 },
    ],
  },
})

add('Lesson 2.2 — Operations with Logarithms', {
  exercise: `## Practical Exercise
Use logarithms throughout (add for ×, subtract for ÷).

1. Evaluate $62.5 \\times 0.0148$ to 3 s.f. using logarithms.
2. Evaluate $\\dfrac{487.3}{19.4}$ to 3 s.f. using logarithms.
3. Evaluate $\\sqrt[3]{8.52}$ using $\\frac{1}{3}\\log 8.52$.

**Check your answers:** (1) $0.925$. (2) $25.1$. (3) $\\log 8.52 = 0.9304$; $0.9304 \\div 3 = 0.3101$; antilog $= 2.043$, so $\\sqrt[3]{8.52} \\approx 2.04$.`,
  quiz: {
    title: 'Quiz 2.2 — Operations with Logarithms',
    description: 'Multiplying, dividing and finding roots with logs.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'To multiply two numbers using logarithms, you:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Add their logs', isCorrect: true }, { id: 'b', text: 'Subtract their logs', isCorrect: false }, { id: 'c', text: 'Multiply their logs', isCorrect: false }, { id: 'd', text: 'Divide their logs', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'To divide using logarithms, you ____ the log of the denominator from the log of the numerator.', questionType: 'fill_blank', correctAnswer: 'subtract' },
      { id: 'q3', questionText: 'True or false: to find $\\sqrt[3]{N}$ using logs, divide $\\log N$ by 3.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: '$\\log 8 + \\log 125$ equals (hint: $8 \\times 125 = 1000$):', questionType: 'fill_blank', correctAnswer: '3' },
      { id: 'q5', questionText: '$\\log 96 - \\log 8$ is the same as:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'log 88', isCorrect: false }, { id: 'b', text: 'log 12', isCorrect: true }, { id: 'c', text: 'log 8', isCorrect: false }, { id: 'd', text: 'log 96', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 2.2 — Log Arithmetic',
    description: 'Use logs for every calculation — no direct multiplication. What a good answer looks like: each log value written down, correct add/subtract, 3 s.f. answers. Rubric: logs 4, operations 4, answers 2.',
    dueDate: '2026-09-25T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Using logarithms, evaluate $\\dfrac{62.5 \\times 0.0148}{3.71}$ to 3 significant figures.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'State the log laws that justify: (a) adding logs to multiply, (b) subtracting logs to divide, (c) dividing a log by $n$ to find the $n$-th root.', marks: 10 },
    ],
  },
})

add('Lesson 2.3 — Operations Involving Negative Logarithms', {
  exercise: `## Practical Exercise
When a negative log must be multiplied or divided, convert to a signed decimal first, then convert back to bar-notation.

1. Evaluate $\\bar{2}.4698 \\times 3$.
2. Evaluate $\\bar{3}.8026 \\div 2$.
3. Use logs to evaluate $\\sqrt{0.0452}$ to 3 s.f.

**Check your answers:** (1) $-2 + 0.4698 = -1.5302$; $\\times 3 = -4.5906 = \\bar{5}.4094$. (2) $-3 + 0.8026 = -2.1974$; $\\div 2 = -1.0987 = \\bar{2}.9013$. (3) $\\log 0.0452 = \\bar{2}.6551 = -1.3449$; $\\div 2 = -0.67245 = \\bar{1}.3276$; antilog $0.3276 = 2.127$, so $\\sqrt{0.0452} \\approx 0.213$.`,
  quiz: {
    title: 'Quiz 2.3 — Negative Logarithms',
    description: 'Multiplying and dividing bar-notation logs.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '$\\bar{2}.3$ written as a single signed decimal is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '-2.3', isCorrect: false }, { id: 'b', text: '-1.7', isCorrect: true }, { id: 'c', text: '-2.7', isCorrect: false }, { id: 'd', text: '2.3', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '$\\bar{2}.4698 \\times 3$ equals:', questionType: 'fill_blank', correctAnswer: 'bar-5.4094 (or -4.5906)' },
      { id: 'q3', questionText: 'True or false: before multiplying a bar-log by a whole number, convert it to a single signed decimal.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: '$-1.3449$ expressed in bar-notation is bar-____.____ (mantissa 0.6551)', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q5', questionText: 'The first step when evaluating $\\sqrt{0.0452}$ with logs is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Divide by 2', isCorrect: false }, { id: 'b', text: 'Find log 0.0452', isCorrect: true }, { id: 'c', text: 'Square 0.0452', isCorrect: false }, { id: 'd', text: 'Antilog of 0.0452', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 2.3 — Converting Bar-Notation',
    description: 'What a good answer looks like: every conversion between bar-notation and signed decimal shown explicitly. Rubric: conversions 5, arithmetic 3, final answers 2.',
    dueDate: '2026-09-25T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Evaluate $\\bar{3}.8026 \\times 2$ and $\\bar{2}.9134 \\div 4$, converting to signed decimals and back. Show every step.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'A student writes $\\bar{2}.4698 \\times 3 = \\bar{6}.4094$. Explain the mistake and give the correct answer.', marks: 10 },
    ],
  },
})

add('Lesson 2.4 — Simple Logarithmic Equations', {
  exercise: `## Practical Exercise
Solve for $x$.

1. $\\log_{10} x = 3$
2. $\\log_{10} x + \\log_{10} 4 = 1$
3. $\\log_{10}(x - 3) + \\log_{10} x = 1$

**Check your answers:** (1) $x = 10^3 = 1000$. (2) $\\log 4x = 1 \\Rightarrow 4x = 10 \\Rightarrow x = 2.5$. (3) $\\log x(x-3) = 1 \\Rightarrow x^2 - 3x = 10 \\Rightarrow x^2 - 3x - 10 = 0 \\Rightarrow (x-5)(x+2) = 0$, so $x = 5$ (reject $x = -2$: logs of non-positive numbers are undefined).`,
  quiz: {
    title: 'Quiz 2.4 — Log Equations',
    description: 'Solving simple logarithmic equations.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'If $\\log_{10} x = 2$, then $x$ equals:', questionType: 'fill_blank', correctAnswer: '100' },
      { id: 'q2', questionText: '$\\log_{10} x + \\log_{10} 4 = 1$ gives $x =$:', questionType: 'fill_blank', correctAnswer: '2.5' },
      { id: 'q3', questionText: 'True or false: $x = -2$ is a valid solution of $\\log(x-3) + \\log x = 1$.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: '$\\log x(x - 3) = 1$ rearranges to the quadratic $x^2 - 3x - ____ = 0$', questionType: 'fill_blank', correctAnswer: '10' },
      { id: 'q5', questionText: 'Why must solutions of log equations be checked?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'To make the working longer', isCorrect: false }, { id: 'b', text: 'Because log arguments must be positive, so some roots are invalid', isCorrect: true }, { id: 'c', text: 'To find more roots', isCorrect: false }, { id: 'd', text: 'Because logs are approximate', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 2.4 — Solving Log Equations',
    description: 'What a good answer looks like: logs combined with the product law, converted to index/quadratic form, and invalid roots rejected with a reason. Rubric: combination 4, algebra 4, rejection 2.',
    dueDate: '2026-09-25T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve $\\log_{10}(x + 9) + \\log_{10} x = 1$. Show all steps and check your answer.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Explain why $\\log(x - 3) + \\log x = 1$ cannot have $x = -2$ as a solution even though it satisfies the quadratic.', marks: 10 },
    ],
  },
})

// ── Module 3 — Week 3: Approximation & Percentage Error ───────────────────────

add('Lesson 3.1 — Approximation', {
  exercise: `## Practical Exercise
Round each number as instructed.

1. Round 4,826 to the nearest hundred.
2. Round 27.584 to the nearest whole number.
3. A school has 1,246 students. Round this to the nearest thousand and explain when such an approximation is useful.

**Check your answers:** (1) 4,800 (since 26 < 50, round down). (2) 28 (since .584 ≥ .5, round up). (3) 1,000 — useful when quoting figures roughly, e.g. "about a thousand students", where exact counting is unnecessary.`,
  quiz: {
    title: 'Quiz 3.1 — Approximation',
    description: 'Rounding to stated places and sensible approximation.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '4,826 to the nearest hundred is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '4,900', isCorrect: false }, { id: 'b', text: '4,800', isCorrect: true }, { id: 'c', text: '4,000', isCorrect: false }, { id: 'd', text: '5,000', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '27.584 to the nearest whole number is ____', questionType: 'fill_blank', correctAnswer: '28' },
      { id: 'q3', questionText: 'True or false: to round 63 to the nearest ten, you look at the units digit.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: '1,246 to the nearest thousand is ____', questionType: 'fill_blank', correctAnswer: '1000' },
      { id: 'q5', questionText: 'A digit of 5 or more in the next place means you round:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Down', isCorrect: false }, { id: 'b', text: 'Up', isCorrect: true }, { id: 'c', text: 'Either way', isCorrect: false }, { id: 'd', text: 'To zero', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 3.1 — Rounding in Real Life',
    description: 'What a good answer looks like: the rounding rule stated, then applied, with a sentence on why the approximation suits the situation. Rubric: rule 4, application 4, explanation 2.',
    dueDate: '2026-10-02T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Round to the stated accuracy: (a) 78,549 to the nearest thousand; (b) 5.0947 to 2 decimal places; (c) 0.06139 to 3 decimal places.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Give two real situations where an approximate number is more useful than an exact one, and say why.', marks: 10 },
    ],
  },
})

add('Lesson 3.2 — Decimal Places', {
  exercise: `## Practical Exercise
Round to the number of decimal places (d.p.) shown.

1. 27.584 to 2 d.p.
2. 3.0469 to 1 d.p.
3. $\\frac{2}{7}$ to 3 d.p.

**Check your answers:** (1) 27.58 (the next digit is 4, so round down). (2) 3.0 (next digit 4, round down — keep the zero: it shows the place). (3) $2 \\div 7 = 0.2857...$, so 0.286 (next digit 7, round up).`,
  quiz: {
    title: 'Quiz 3.2 — Decimal Places',
    description: 'Rounding correctly to a number of decimal places.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '27.584 to 2 d.p. is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '27.58', isCorrect: true }, { id: 'b', text: '27.59', isCorrect: false }, { id: 'c', text: '27.5', isCorrect: false }, { id: 'd', text: '27.6', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: '3.0469 to 1 d.p. is ____', questionType: 'fill_blank', correctAnswer: '3.0' },
      { id: 'q3', questionText: 'True or false: 0.2857... to 3 d.p. is 0.286.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: '7.999 to 2 d.p. is ____', questionType: 'fill_blank', correctAnswer: '8.00' },
      { id: 'q5', questionText: 'Rounding 2.46 to 1 d.p. gives:', questionType: 'multiple_choice', options: [{ id: 'a', text: '2.4', isCorrect: false }, { id: 'b', text: '2.5', isCorrect: true }, { id: 'c', text: '2.45', isCorrect: false }, { id: 'd', text: '2.47', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 3.2 — Decimal Places Practice',
    description: 'What a good answer looks like: the deciding digit underlined in each case, then the rounded value. Rubric: correct rounding 4 each for (a) and (b), working shown 2.',
    dueDate: '2026-10-02T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Round (a) 15.0649 to 2 d.p. and (b) 0.9949 to 1 d.p., underlining the digit that decides each rounding.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Why is 8.00 (2 d.p.) a better answer than 8 when a result is required to 2 decimal places?', marks: 10 },
    ],
  },
})

add('Lesson 3.3 — Significant Figures', {
  exercise: `## Practical Exercise
Round to the number of significant figures (s.f.) shown.

1. 8076.5 to 3 s.f.
2. 0.006897 to 2 s.f.
3. 45.68 to 1 s.f.

**Check your answers:** (1) 8,080 (the 4th digit 6 rounds the 3rd digit 7 up to 8, holding place with 0). (2) 0.0069 (start counting s.f. at the first non-zero digit: 6, 8 → the next digit 9 rounds 8 up to 9). (3) 50 (4 rounds 4 up? No — the next digit is 5, so 45.68 → 5 × 10 = 50 to 1 s.f.).`,
  quiz: {
    title: 'Quiz 3.3 — Significant Figures',
    description: 'Counting and rounding to significant figures.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '8076.5 correct to 3 significant figures is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '8,070', isCorrect: false }, { id: 'b', text: '8,080', isCorrect: true }, { id: 'c', text: '8,077', isCorrect: false }, { id: 'd', text: '8,100', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '0.006897 correct to 2 s.f. is ____', questionType: 'fill_blank', correctAnswer: '0.0069' },
      { id: 'q3', questionText: 'True or false: in 0.006897, the first significant figure is 6.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: '45.68 to 1 s.f. is ____', questionType: 'fill_blank', correctAnswer: '50' },
      { id: 'q5', questionText: 'Zeros at the START of a decimal number are:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Always significant', isCorrect: false }, { id: 'b', text: 'Never significant', isCorrect: true }, { id: 'c', text: 'Significant only if odd', isCorrect: false }, { id: 'd', text: 'Counted as 2 s.f.', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 3.3 — Significant Figures',
    description: 'What a good answer looks like: s.f. counted and stated before rounding, then the rounded value. Rubric: counting 4, rounding 4, presentation 2.',
    dueDate: '2026-10-02T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Round (a) 23.045 to 3 s.f., (b) 0.0040561 to 2 s.f., (c) 199.6 to 1 s.f. State the significant figures you counted in each.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Explain the difference between rounding 0.0300 to 2 decimal places and to 2 significant figures.', marks: 10 },
    ],
  },
})

add('Lesson 3.4 — Percentage Error', {
  exercise: `## Practical Exercise
Use $\\text{\\% error} = \\dfrac{\\text{error}}{\\text{exact value}} \\times 100\\%$.

1. A length measured as 9.8 cm is exactly 10 cm. Find the percentage error.
2. 6.84 is rounded to 6.8. Find the percentage error.
3. Which is more accurate: rounding 45 to the nearest ten, or 4.5 to 1 d.p.? Use percentage error to decide.

**Check your answers:** (1) $\\frac{0.2}{10} \\times 100\\% = 2\\%$. (2) error $= 0.04$; $\\frac{0.04}{6.84} \\times 100\\% = 0.585\\%$ (3 s.f.). (3) 45→50: error 5, $\\frac{5}{45} \\times 100\\% = 11.1\\%$; 4.5→5 (1 d.p.): error 0.5? No — 4.5 to 1 d.p. is 4.5 exactly, so error 0%. Take 4.5 to nearest whole: 5, error $\\frac{0.5}{4.5} \\times 100\\% = 11.1\\%$ — same relative accuracy.`,
  quiz: {
    title: 'Quiz 3.4 — Percentage Error',
    description: 'Computing percentage error from rounded values.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The formula for percentage error is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'error ÷ exact value × 100%', isCorrect: true }, { id: 'b', text: 'exact value ÷ error × 100%', isCorrect: false }, { id: 'c', text: 'error × exact value', isCorrect: false }, { id: 'd', text: 'error − exact value', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'A value measured as 9.8 instead of exactly 10 has percentage error ____%', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q3', questionText: 'True or false: percentage error lets you compare the accuracy of approximations to numbers of very different sizes.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'If the error is 0.04 and the exact value is 6.84, the percentage error is ____% (3 s.f.)', questionType: 'fill_blank', correctAnswer: '0.585' },
      { id: 'q5', questionText: 'An error of 5 on a value of 45 gives a percentage error of about:', questionType: 'multiple_choice', options: [{ id: 'a', text: '1.1%', isCorrect: false }, { id: 'b', text: '11.1%', isCorrect: true }, { id: 'c', text: '5%', isCorrect: false }, { id: 'd', text: '45%', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 3.4 — Comparing Accuracy',
    description: 'What a good answer looks like: error and percentage error computed for each case, then an explicit comparison sentence. Rubric: errors 5, percentages 3, comparison 2.',
    dueDate: '2026-10-02T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: '(a) 3.1416 is rounded to 3.14. Find the percentage error. (b) 9,876 is rounded to 9,900. Find the percentage error. (c) Which approximation is relatively more accurate?', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Explain why a small absolute error can still be a large percentage error, with a numerical example.', marks: 10 },
    ],
  },
})

add('Lesson 3.5 — Degree of Accuracy', {
  exercise: `## Practical Exercise
Work out the limits between which a rounded value lies.

1. A rod is 12 cm to the nearest cm. Between which limits does its true length lie?
2. A mass is 3.5 kg to 1 d.p. State its limits.
3. Which measurement is more precise: 12 cm (nearest cm) or 12.0 cm (nearest 0.1 cm)? Why?

**Check your answers:** (1) $11.5 \\leq L < 12.5$ cm (half a unit either side). (2) $3.45 \\leq M < 3.55$ kg. (3) 12.0 cm — it is given to the nearest tenth, so its possible error is only $\\pm 0.05$ cm, five times smaller. More decimal places = greater degree of accuracy.`,
  quiz: {
    title: 'Quiz 3.5 — Degree of Accuracy',
    description: 'Limits of rounded values and comparing precision.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A value of 12 cm to the nearest cm lies between:', questionType: 'multiple_choice', options: [{ id: 'a', text: '11.5 and 12.5', isCorrect: true }, { id: 'b', text: '11 and 13', isCorrect: false }, { id: 'c', text: '12.4 and 12.6', isCorrect: false }, { id: 'd', text: '11.9 and 12.1', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: '3.5 kg to 1 d.p. has lower limit ____ kg', questionType: 'fill_blank', correctAnswer: '3.45' },
      { id: 'q3', questionText: 'True or false: 12.0 cm is a more precise measurement than 12 cm.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The upper limit of a value rounded to the nearest ten as 80 is ____', questionType: 'fill_blank', correctAnswer: '85' },
      { id: 'q5', questionText: 'The possible error in a value given to 1 d.p. is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '±0.5', isCorrect: false }, { id: 'b', text: '±0.05', isCorrect: true }, { id: 'c', text: '±5', isCorrect: false }, { id: 'd', text: '±0.1', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 3.5 — Limits of Accuracy',
    description: 'What a good answer looks like: limits written as inequalities, plus a comparison sentence for the precision question. Rubric: limits 5, reasoning 3, presentation 2.',
    dueDate: '2026-10-02T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'State the limits between which the true value lies: (a) 6.8 cm to 1 d.p.; (b) 250 g to the nearest 10 g; (c) 0.02 m to 2 d.p.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Two pupils report the length of the same stick as 3 m and 3.00 m. Whose measurement is more precise, and by how much do their possible errors differ?', marks: 10 },
    ],
  },
})

// ── Module 4 — Week 4: Sequence & Series ──────────────────────────────────────

add('Lesson 4.1 — Meaning of Sequence', {
  exercise: `## Practical Exercise
For each sequence, write the next two terms and state the rule.

1. 5, 9, 13, 17, ...
2. 2, 6, 18, 54, ...
3. 1, 1, 2, 3, 5, 8, ...

**Check your answers:** (1) 21, 25 — add 4 each time. (2) 162, 486 — multiply by 3 each time. (3) 13, 21 — each term is the sum of the two before it (the Fibonacci sequence).`,
  quiz: {
    title: 'Quiz 4.1 — Meaning of Sequence',
    description: 'Recognising patterns and stating sequence rules.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A sequence is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A set of unordered numbers', isCorrect: false }, { id: 'b', text: 'An ordered list of numbers following a rule', isCorrect: true }, { id: 'c', text: 'A single equation', isCorrect: false }, { id: 'd', text: 'A type of graph', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The next term of 5, 9, 13, 17, ... is ____', questionType: 'fill_blank', correctAnswer: '21' },
      { id: 'q3', questionText: 'True or false: in 2, 6, 18, 54, ... each term is multiplied by 3.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The next term of 1, 1, 2, 3, 5, 8 is ____', questionType: 'fill_blank', correctAnswer: '13' },
      { id: 'q5', questionText: 'Each number in a sequence is called a:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Factor', isCorrect: false }, { id: 'b', text: 'Term', isCorrect: true }, { id: 'c', text: 'Root', isCorrect: false }, { id: 'd', text: 'Digit', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 4.1 — Pattern Detective',
    description: 'What a good answer looks like: the rule stated in words AND in symbols, then applied. Rubric: rule 4, terms 4, symbols 2.',
    dueDate: '2026-10-09T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'For each sequence write the next two terms and the rule: (a) 64, 32, 16, 8, ... (b) 4, 9, 14, 19, ... (c) 1, 4, 9, 16, 25, ...', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Explain the difference between a sequence whose rule is "add $d$" and one whose rule is "multiply by $r$", with one example of each.', marks: 10 },
    ],
  },
})

add('Lesson 4.2 — Arithmetic Progression', {
  exercise: `## Practical Exercise
Use $T_n = a + (n-1)d$.

1. Find the 10th term of 3, 7, 11, 15, ...
2. Find the 15th term of the A.P. 20, 17, 14, ...
3. Which term of 4, 9, 14, 19, ... is 74?

**Check your answers:** (1) $a=3$, $d=4$: $T_{10} = 3 + 9(4) = 39$. (2) $a=20$, $d=-3$: $T_{15} = 20 + 14(-3) = -22$. (3) $4 + (n-1)5 = 74 \\Rightarrow 5n = 75 \\Rightarrow n = 15$th term.`,
  quiz: {
    title: 'Quiz 4.2 — Arithmetic Progression',
    description: 'Using the nth-term formula of an A.P.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The nth term of an A.P. with first term $a$ and common difference $d$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'a + nd', isCorrect: false }, { id: 'b', text: 'a + (n−1)d', isCorrect: true }, { id: 'c', text: 'a × d^(n−1)', isCorrect: false }, { id: 'd', text: 'nd − a', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The 10th term of 3, 7, 11, 15, ... is ____', questionType: 'fill_blank', correctAnswer: '39' },
      { id: 'q3', questionText: 'True or false: 20, 17, 14, ... is an A.P. with a negative common difference.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'In the A.P. 4, 9, 14, ..., the term equal to 74 is the ____th term.', questionType: 'fill_blank', correctAnswer: '15' },
      { id: 'q5', questionText: 'The common difference of the A.P. 20, 17, 14, ... is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '3', isCorrect: false }, { id: 'b', text: '−3', isCorrect: true }, { id: 'c', text: '20', isCorrect: false }, { id: 'd', text: '−17', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 4.2 — Working with A.P.s',
    description: 'What a good answer looks like: $a$ and $d$ identified first, formula written, then substitution. Rubric: identification 3, formula 3, accuracy 4.',
    dueDate: '2026-10-09T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: '(a) Find the 20th term of the A.P. 11, 15, 19, ... (b) Which term of 8, 5, 2, ... is −25?', marks: 10 },
      { id: 'a2', type: 'theory', title: 'The 4th term of an A.P. is 15 and the 9th term is 30. Show, with clear steps, how to find $a$ and $d$.', marks: 10 },
    ],
  },
})

// ── Module 5 — Week 5: Sequence & Series (contd.) ─────────────────────────────

add('Lesson 5.1 — Sum of Terms of an A.P.', {
  exercise: `## Practical Exercise
Use $S_n = \\frac{n}{2}\\big(2a + (n-1)d\\big)$ or $S_n = \\frac{n}{2}(a + l)$ when the last term $l$ is known.

1. Find the sum of the first 12 terms of 7, 11, 15, ...
2. Find the sum of all even numbers from 2 to 100.
3. The 4th term of an A.P. is 17 and the common difference is 4. Find the sum of the first 8 terms.

**Check your answers:** (1) $a=7$, $d=4$: $S_{12} = 6(14 + 44) = 6 \\times 58 = 348$. (2) $S_{50} = 25(2 + 100) = 2550$. (3) $a = 17 - 3(4) = 5$; $S_8 = 4(10 + 28) = 152$.`,
  quiz: {
    title: 'Quiz 5.1 — Sum of an A.P.',
    description: 'Summing arithmetic series with both formulas.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '$S_n = \\frac{n}{2}(a + l)$ may be used when:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The last term is known', isCorrect: true }, { id: 'b', text: 'The ratio is known', isCorrect: false }, { id: 'c', text: 'The series is infinite', isCorrect: false }, { id: 'd', text: 'Only n is known', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'The sum of the first 12 terms of 7, 11, 15, ... is ____', questionType: 'fill_blank', correctAnswer: '348' },
      { id: 'q3', questionText: 'True or false: the sum of the first 50 even numbers (2 to 100) is 2550.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'In $S_n = \\frac{n}{2}(2a + (n-1)d)$, the term $2a$ means first term ____ (fill with a word)', questionType: 'fill_blank', correctAnswer: 'doubled' },
      { id: 'q5', questionText: 'The sum of the first 10 terms of an A.P. with $a = 2$, $d = 3$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '155', isCorrect: true }, { id: 'b', text: '165', isCorrect: false }, { id: 'c', text: '145', isCorrect: false }, { id: 'd', text: '150', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 5.1 — Summing Series',
    description: 'What a good answer looks like: $a$, $d$, $n$ listed before substitution; both sum formulas used where appropriate. Rubric: values 4, formula 3, accuracy 3.',
    dueDate: '2026-10-16T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: '(a) Find the sum of the first 15 terms of the A.P. −4, −1, 2, ... (b) Find the sum of all odd numbers from 1 to 99.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'A theatre has 18 rows of seats with 3 more seats in each row than the row in front. If the front row has 12 seats, find the total number of seats, showing your method.', marks: 10 },
    ],
  },
})

add('Lesson 5.2 — Arithmetic Mean', {
  exercise: `## Practical Exercise
The arithmetic mean of an A.P. is the average of two terms around it: $m = \\frac{x + y}{2}$.

1. Insert 4 arithmetic means between 5 and 25.
2. Find the arithmetic mean of 12 and 28.
3. Three numbers in A.P. have sum 30 and product 640. Find them.

**Check your answers:** (1) The A.P. is 5, 9, 13, 17, 21, 25 — means: 9, 13, 17, 21. (2) $\\frac{12 + 28}{2} = 20$. (3) Numbers are $a-d$, $a$, $a+d$; sum $3a = 30 \\Rightarrow a = 10$; product $10(100 - d^2) = 640 \\Rightarrow d^2 = 36 \\Rightarrow d = 6$: the numbers are 4, 10, 16.`,
  quiz: {
    title: 'Quiz 5.2 — Arithmetic Mean',
    description: 'Inserting means and using symmetric A.P. properties.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The arithmetic mean of $x$ and $y$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '(x + y)/2', isCorrect: true }, { id: 'b', text: 'xy/2', isCorrect: false }, { id: 'c', text: 'x + y', isCorrect: false }, { id: 'd', text: '(x − y)/2', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'The arithmetic mean of 12 and 28 is ____', questionType: 'fill_blank', correctAnswer: '20' },
      { id: 'q3', questionText: 'True or false: writing an A.P. as $a-d, a, a+d$ makes symmetric problems easier.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The middle term of the A.P. 4, 10, 16 is ____', questionType: 'fill_blank', correctAnswer: '10' },
      { id: 'q5', questionText: 'Inserting 3 arithmetic means between 2 and 10 gives an A.P. of how many terms?', questionType: 'multiple_choice', options: [{ id: 'a', text: '3', isCorrect: false }, { id: 'b', text: '4', isCorrect: false }, { id: 'c', text: '5', isCorrect: true }, { id: 'd', text: '6', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment 5.2 — Means and Symmetry',
    description: 'What a good answer looks like: the symmetric form $a-d, a, a+d$ (or $a-d, a+d$ pairs) used where helpful, with steps shown. Rubric: setup 5, solving 5.',
    dueDate: '2026-10-16T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Insert 3 arithmetic means between 8 and 32, and state the common difference.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Three numbers in A.P. have a sum of 27 and a product of 584. Find the numbers, using the symmetric form.', marks: 10 },
    ],
  },
})

add('Lesson 5.3 — Geometric Progression', {
  exercise: `## Practical Exercise
Use $T_n = ar^{n-1}$.

1. Find the 6th term of 3, 6, 12, 24, ...
2. Find the 5th term of 80, 40, 20, ...
3. The 2nd term of a G.P. is 18 and the 5th term is 486. Find the first term and common ratio.

**Check your answers:** (1) $a=3$, $r=2$: $T_6 = 3 \\times 2^5 = 96$. (2) $r = \\frac{1}{2}$: $T_5 = 80 \\times (\\frac{1}{2})^4 = 5$. (3) $ar = 18$, $ar^4 = 486 \\Rightarrow r^3 = 27 \\Rightarrow r = 3$, $a = 6$.`,
  quiz: {
    title: 'Quiz 5.3 — Geometric Progression',
    description: 'nth term of a G.P.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The nth term of a G.P. is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'a + (n−1)r', isCorrect: false }, { id: 'b', text: 'a·r^(n−1)', isCorrect: true }, { id: 'c', text: 'a + nr', isCorrect: false }, { id: 'd', text: 'n·r', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The 6th term of 3, 6, 12, ... is ____', questionType: 'fill_blank', correctAnswer: '96' },
      { id: 'q3', questionText: 'True or false: 80, 40, 20, ... has common ratio ½.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The common ratio of 2, 10, 50, 250 is ____', questionType: 'fill_blank', correctAnswer: '5' },
      { id: 'q5', questionText: 'A G.P. differs from an A.P. because its terms change by:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Adding a constant', isCorrect: false }, { id: 'b', text: 'Multiplying by a constant', isCorrect: true }, { id: 'c', text: 'Subtracting a constant', isCorrect: false }, { id: 'd', text: 'Alternating signs only', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 5.3 — Geometric Patterns',
    description: 'What a good answer looks like: $a$ and $r$ identified first, index laws applied correctly. Rubric: identification 4, formula 3, accuracy 3.',
    dueDate: '2026-10-16T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: '(a) Find the 7th term of 5, 10, 20, ... (b) Find the 4th term of 81, 27, 9, ... (c) Which term of 2, 6, 18, ... is 1458?', marks: 10 },
      { id: 'a2', type: 'theory', title: 'The 3rd term of a G.P. is 24 and the 6th term is 192. Find $a$ and $r$, showing every step.', marks: 10 },
    ],
  },
})

add('Lesson 5.4 — Sum of Geometric Series', {
  exercise: `## Practical Exercise
Use $S_n = \\frac{a(r^n - 1)}{r - 1}$ for $r \\neq 1$, and $S_\\infty = \\frac{a}{1 - r}$ for $|r| < 1$.

1. Find the sum of the first 6 terms of 4, 8, 16, ...
2. Find the sum to infinity of 12 + 4 + 4/3 + ...
3. A ball bounces to ¾ of its previous height. If dropped from 2 m, what total distance does it travel (down-moves only, sum to infinity)?

**Check your answers:** (1) $S_6 = \\frac{4(2^6 - 1)}{1} = 252$. (2) $r = \\frac{1}{3}$: $S_\\infty = \\frac{12}{1 - 1/3} = 18$. (3) $S_\\infty = \\frac{2}{1 - 3/4} = 8$ m.`,
  quiz: {
    title: 'Quiz 5.4 — Sum of a G.S.',
    description: 'Finite and infinite geometric sums.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The sum to infinity of a G.P. exists when:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'r > 1', isCorrect: false }, { id: 'b', text: '|r| < 1', isCorrect: true }, { id: 'c', text: 'r = 1', isCorrect: false }, { id: 'd', text: 'a is small', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The sum of the first 6 terms of 4, 8, 16, ... is ____', questionType: 'fill_blank', correctAnswer: '252' },
      { id: 'q3', questionText: 'True or false: the sum to infinity of 12 + 4 + 4/3 + ... is 18.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'In $S_\\infty = \\frac{a}{1-r}$, if $a = 8$ and $r = \\frac{1}{2}$ then $S_\\infty$ = ____', questionType: 'fill_blank', correctAnswer: '16' },
      { id: 'q5', questionText: 'Why does $S_\\infty = \\frac{a}{1-r}$ fail for $r = 2$?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The terms grow without bound, so the sum diverges', isCorrect: true }, { id: 'b', text: 'The formula needs r = 2', isCorrect: false }, { id: 'c', text: 'a must be negative', isCorrect: false }, { id: 'd', text: 'It does not fail', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 5.4 — Infinite Sums',
    description: 'What a good answer looks like: $r$ tested against $|r| < 1$ before using $S_\\infty$, and finite sums set up with $n$ stated. Rubric: ratio check 4, formula 3, accuracy 3.',
    dueDate: '2026-10-16T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: '(a) Find the sum of the first 8 terms of 5, 15, 45, ... (b) Find the sum to infinity of 9 + 3 + 1 + ...', marks: 10 },
      { id: 'a2', type: 'theory', title: 'A pendulum swings 24 cm then 80% as far each swing. Find the total distance it swings (sum to infinity), justifying the use of the formula.', marks: 10 },
    ],
  },
})

add('Lesson 5.5 — Geometric Mean', {
  exercise: `## Practical Exercise
The geometric mean of two terms is $m = \\sqrt{xy}$ (positive root for positive terms).

1. Insert 2 geometric means between 3 and 24.
2. Find the geometric mean of 4 and 25.
3. Two numbers in G.P. have product 36 and sum 13. Find them (hint: use $\\frac{a}{r}, a, ar$).

**Check your answers:** (1) G.P. is 3, 6, 12, 24 — means: 6, 12 ($r = 2$). (2) $\\sqrt{100} = 10$. (3) $a^2 = 36 \\Rightarrow a = 6$; $6(r + 1/r) = 13 \\Rightarrow 6r^2 - 13r + 6 = 0 \\Rightarrow r = 3/2$ or $2/3$: the numbers are 4 and 9.`,
  quiz: {
    title: 'Quiz 5.5 — Geometric Mean',
    description: 'Inserting geometric means.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The geometric mean of $x$ and $y$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '(x + y)/2', isCorrect: false }, { id: 'b', text: '√(xy)', isCorrect: true }, { id: 'c', text: 'xy', isCorrect: false }, { id: 'd', text: 'x²y²', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The geometric mean of 4 and 25 is ____', questionType: 'fill_blank', correctAnswer: '10' },
      { id: 'q3', questionText: 'True or false: the geometric mean of 3 and 12 is 6.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'If $a = 5$ and $r = 2$, the middle term of $\\frac{a}{r}, a, ar$ is ____', questionType: 'fill_blank', correctAnswer: '5' },
      { id: 'q5', questionText: 'Inserting 2 geometric means between 3 and 24 gives a G.P. with common ratio:', questionType: 'multiple_choice', options: [{ id: 'a', text: '2', isCorrect: true }, { id: 'b', text: '3', isCorrect: false }, { id: 'c', text: '4', isCorrect: false }, { id: 'd', text: '8', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 5.5 — Means Compared',
    description: 'What a good answer looks like: geometric vs arithmetic mean computed side by side, with a note on when each is larger. Rubric: computation 5, comparison 3, structure 2.',
    dueDate: '2026-10-16T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Insert 3 geometric means between 2 and 162, stating the common ratio and each mean.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'For the pair 4 and 16, compute BOTH the arithmetic mean and the geometric mean. Which is larger, and is that always the case? Justify with one more example.', marks: 10 },
    ],
  },
})

// ── Module 6 — Week 6: Quadratic Equations ────────────────────────────────────

add('Lesson 6.1 — Introduction to Quadratic Equations', {
  exercise: `## Practical Exercise
A quadratic equation has the form $ax^2 + bx + c = 0$ with $a \\neq 0$.

1. Which of these are quadratic? (a) $3x^2 - 5x + 2 = 0$ (b) $2x + 7 = 0$ (c) $x^3 = 8$
2. Show that $x = 2$ satisfies $x^2 - 5x + 6 = 0$.
3. Rewrite $(x + 3)(x - 1) = 0$ in the form $ax^2 + bx + c = 0$, and state $a$, $b$, $c$.

**Check your answers:** (1) only (a) — (b) is linear, (c) is cubic. (2) $4 - 10 + 6 = 0$ ✓. (3) $x^2 + 2x - 3 = 0$ with $a = 1$, $b = 2$, $c = -3$.`,
  quiz: {
    title: 'Quiz 6.1 — Meet the Quadratic',
    description: 'Recognising and testing quadratic equations.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A quadratic equation in $x$ has highest power:', questionType: 'multiple_choice', options: [{ id: 'a', text: '1', isCorrect: false }, { id: 'b', text: '2', isCorrect: true }, { id: 'c', text: '3', isCorrect: false }, { id: 'd', text: '0', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'In $3x^2 - 5x + 2 = 0$, the coefficient $b$ is ____', questionType: 'fill_blank', correctAnswer: '-5' },
      { id: 'q3', questionText: 'True or false: $2x + 7 = 0$ is a quadratic equation.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Substituting $x = 2$ into $x^2 - 5x + 6$ gives ____', questionType: 'fill_blank', correctAnswer: '0' },
      { id: 'q5', questionText: 'A quadratic equation can have at most ____ distinct real roots.', questionType: 'multiple_choice', options: [{ id: 'a', text: '1', isCorrect: false }, { id: 'b', text: '2', isCorrect: true }, { id: 'c', text: '3', isCorrect: false }, { id: 'd', text: '4', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 6.1 — Quadratic or Not?',
    description: 'What a good answer looks like: each equation classified with the reason, and coefficients identified clearly. Rubric: classification 5, coefficients 3, substitution 2.',
    dueDate: '2026-10-23T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Classify each as quadratic, linear or cubic, giving reasons: (a) $x^2 = 4x$ (b) $5 - x = 2x^2$ (c) $x^3 - x = 0$. Then state $a$, $b$, $c$ for each quadratic.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Verify that both $x = 3$ and $x = -1$ satisfy $x^2 - 2x - 3 = 0$, and explain what this shows about quadratic equations.', marks: 10 },
    ],
  },
})

add('Lesson 6.2 — Factorization', {
  exercise: `## Practical Exercise
Solve by factorization: find two numbers that multiply to $ac$ and add to $b$.

1. $x^2 + 5x + 6 = 0$
2. $x^2 - 2x - 15 = 0$
3. $2x^2 + 7x + 3 = 0$

**Check your answers:** (1) $(x+2)(x+3) = 0 \\Rightarrow x = -2$ or $x = -3$. (2) $(x-5)(x+3) = 0 \\Rightarrow x = 5$ or $x = -3$. (3) $(2x + 1)(x + 3) = 0 \\Rightarrow x = -\\frac{1}{2}$ or $x = -3$.`,
  quiz: {
    title: 'Quiz 6.2 — Factorization',
    description: 'Solving quadratics by factorization.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '$x^2 + 5x + 6 = 0$ factorizes as:', questionType: 'multiple_choice', options: [{ id: 'a', text: '(x+2)(x+3)', isCorrect: true }, { id: 'b', text: '(x−2)(x−3)', isCorrect: false }, { id: 'c', text: '(x+1)(x+6)', isCorrect: false }, { id: 'd', text: '(x+5)(x+1)', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'The roots of $x^2 - 2x - 15 = 0$ are ____ and ____ (smallest first, format: a, b)', questionType: 'fill_blank', correctAnswer: '-3, 5' },
      { id: 'q3', questionText: 'True or false: if $(x - 4)(x + 1) = 0$ then $x = 4$ or $x = -1$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'For $2x^2 + 7x + 3 = 0$, $ac =$ ____ and $b =$ ____ (format: ac, b)', questionType: 'fill_blank', correctAnswer: '6, 7' },
      { id: 'q5', questionText: 'When factorizing, a product equals zero means:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Both factors are zero', isCorrect: false }, { id: 'b', text: 'At least one factor is zero', isCorrect: true }, { id: 'c', text: 'Neither factor is zero', isCorrect: false }, { id: 'd', text: 'The equation has no roots', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 6.2 — Factorization Drill',
    description: 'What a good answer looks like: the factor pair stated before writing the factors, then roots checked by substitution. Rubric: factors 5, roots 3, check 2.',
    dueDate: '2026-10-23T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve by factorization: (a) $x^2 + 9x + 20 = 0$ (b) $x^2 - 4x - 21 = 0$ (c) $3x^2 - 10x + 8 = 0$. Check one root from each by substitution.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'A student factorizes $x^2 - 2x - 15$ as $(x-5)(x-3)$ and gets wrong roots. Explain the error and correct it.', marks: 10 },
    ],
  },
})

add('Lesson 6.3 — Completing the Square', {
  exercise: `## Practical Exercise
Rewrite $x^2 + bx = c$ by adding $(b/2)^2$ to both sides.

1. Solve $x^2 + 6x - 7 = 0$ by completing the square.
2. Solve $x^2 - 4x + 1 = 0$ by completing the square (leave surds in your answer).
3. Express $x^2 + 8x + 3$ in the form $(x + p)^2 + q$.

**Check your answers:** (1) $x^2 + 6x = 7 \\Rightarrow (x+3)^2 = 16 \\Rightarrow x = 1$ or $x = -7$. (2) $(x-2)^2 = 3 \\Rightarrow x = 2 \\pm \\sqrt{3}$. (3) $(x+4)^2 - 13$.`,
  quiz: {
    title: 'Quiz 6.3 — Completing the Square',
    description: 'The completing-the-square method.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'To complete the square on $x^2 + 6x$, add:', questionType: 'multiple_choice', options: [{ id: 'a', text: '6', isCorrect: false }, { id: 'b', text: '9', isCorrect: true }, { id: 'c', text: '36', isCorrect: false }, { id: 'd', text: '3', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Completing the square on $x^2 - 4x$ gives $(x - \\_)^2$ (fill the blank number)', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q3', questionText: 'True or false: $x^2 + 8x + 3 = (x + 4)^2 - 13$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Solving $x^2 + 6x - 7 = 0$ by completing the square gives $x = 1$ and $x =$ ____', questionType: 'fill_blank', correctAnswer: '-7' },
      { id: 'q5', questionText: 'The number you add to complete the square on $x^2 + bx$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'b', isCorrect: false }, { id: 'b', text: '(b/2)²', isCorrect: true }, { id: 'c', text: 'b²', isCorrect: false }, { id: 'd', text: 'b/2', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 6.3 — Square Completion',
    description: 'What a good answer looks like: the constant added to BOTH sides shown, perfect square written, then roots (exact surds where they occur). Rubric: method 5, roots 5.',
    dueDate: '2026-10-23T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve by completing the square: (a) $x^2 + 10x + 9 = 0$ (b) $x^2 - 6x + 2 = 0$ (leave surds).', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Express $x^2 - 12x + 30$ in the form $(x + p)^2 + q$ and hence state its minimum value.', marks: 10 },
    ],
  },
})

add('Lesson 6.4 — Quadratic Formula', {
  exercise: `## Practical Exercise
Use $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.

1. Solve $2x^2 - 9x + 4 = 0$ using the formula.
2. Solve $x^2 + 3x + 1 = 0$, leaving surds.
3. Use the discriminant $b^2 - 4ac$ to say how many real roots $x^2 + 2x + 5 = 0$ has.

**Check your answers:** (1) $a=2, b=-9, c=4$: $x = \\frac{9 \\pm \\sqrt{81 - 32}}{4} = \\frac{9 \\pm 7}{4}$, so $x = 4$ or $x = \\frac{1}{2}$. (2) $x = \\frac{-3 \\pm \\sqrt{5}}{2}$. (3) $b^2 - 4ac = 4 - 20 = -16 < 0$: no real roots.`,
  quiz: {
    title: 'Quiz 6.4 — Quadratic Formula',
    description: 'Applying the quadratic formula and discriminant.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'In the quadratic formula, the expression under the square root is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'b² − 4ac', isCorrect: true }, { id: 'b', text: 'b² + 4ac', isCorrect: false }, { id: 'c', text: '4ac − b²', isCorrect: false }, { id: 'd', text: '2ab − c', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'The roots of $2x^2 - 9x + 4 = 0$ are $\\frac{1}{2}$ and ____', questionType: 'fill_blank', correctAnswer: '4' },
      { id: 'q3', questionText: 'True or false: if $b^2 - 4ac = 0$, the equation has exactly one (repeated) real root.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'For $x^2 + 2x + 5 = 0$, the discriminant is ____', questionType: 'fill_blank', correctAnswer: '-16' },
      { id: 'q5', questionText: 'A negative discriminant means the equation has:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Two real roots', isCorrect: false }, { id: 'b', text: 'One real root', isCorrect: false }, { id: 'c', text: 'No real roots', isCorrect: true }, { id: 'd', text: 'Infinite roots', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment 6.4 — Formula Practice',
    description: 'What a good answer looks like: $a$, $b$, $c$ listed, discriminant computed first, then roots exact (surds) or to 2 d.p. as asked. Rubric: coefficients 2, discriminant 3, roots 5.',
    dueDate: '2026-10-23T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve with the formula: (a) $3x^2 - 5x + 1 = 0$ (2 d.p.) (b) $x^2 - 4x - 21 = 0$. State the discriminant in each case.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Without solving fully, determine the nature of the roots of $2x^2 - 4x + 2 = 0$ and $x^2 + x + 4 = 0$. Justify with the discriminant.', marks: 10 },
    ],
  },
})

add('Lesson 6.5 — Roots of Quadratic Equations', {
  exercise: `## Practical Exercise
For $ax^2 + bx + c = 0$: sum of roots $= -\\frac{b}{a}$, product of roots $= \\frac{c}{a}$.

1. Find the sum and product of the roots of $x^2 - 7x + 12 = 0$.
2. Given roots 2 and −5, form the quadratic equation.
3. The roots of $x^2 + px + 6 = 0$ differ by 1. Find $p$ (roots positive).

**Check your answers:** (1) sum $= 7$, product $= 12$ (roots 3 and 4 — check!). (2) sum $= -3$, product $= -10$: $x^2 + 3x - 10 = 0$. (3) roots $m$ and $m+1$ with $m(m+1) = 6 \\Rightarrow m = 2$: roots 2, 3, so $p = -5$.`,
  quiz: {
    title: 'Quiz 6.5 — Sum & Product of Roots',
    description: 'Relating coefficients to roots.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'For $ax^2 + bx + c = 0$, the sum of the roots is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'b/a', isCorrect: false }, { id: 'b', text: '−b/a', isCorrect: true }, { id: 'c', text: 'c/a', isCorrect: false }, { id: 'd', text: '−c/a', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The sum and product of the roots of $x^2 - 7x + 12 = 0$ are, respectively:', questionType: 'multiple_choice', options: [{ id: 'a', text: '7 and 12', isCorrect: true }, { id: 'b', text: '−7 and 12', isCorrect: false }, { id: 'c', text: '7 and −12', isCorrect: false }, { id: 'd', text: '12 and 7', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: a quadratic with roots 2 and −5 is $x^2 + 3x - 10 = 0$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The product of the roots of $2x^2 - 6x + 4 = 0$ is ____', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q5', questionText: 'If the roots are $\\alpha$ and $\\beta$, the equation is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'x² − (α+β)x + αβ = 0', isCorrect: true }, { id: 'b', text: 'x² + (α+β)x − αβ = 0', isCorrect: false }, { id: 'c', text: 'x² + αβx − (α+β) = 0', isCorrect: false }, { id: 'd', text: 'x² − αβx + (α+β) = 0', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 6.5 — Root Relationships',
    description: 'What a good answer looks like: sum/product stated with the correct signs, then used to build or analyse the equation. Rubric: relationships 5, algebra 5.',
    dueDate: '2026-10-23T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: '(a) Find the sum and product of the roots of $3x^2 - 12x + 9 = 0$. (b) Form the quadratic equation whose roots are 4 and −2.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'The roots of $x^2 - 9x + k = 0$ are equal. Use the discriminant (or sum/product) to find $k$.', marks: 10 },
    ],
  },
})

add('Lesson 6.6 — Word Problems Leading to Quadratic Equations', {
  exercise: `## Practical Exercise
Translate each situation into a quadratic, solve, and reject impossible answers.

1. The product of two consecutive positive integers is 156. Find them.
2. A rectangle's length is 3 cm more than its width and its area is 40 cm². Find its dimensions.
3. A trader buys some pens for ₦600. If each pen had cost ₦5 less, she would have bought 2 more pens for the same money. Form an equation in $p$ (number of pens).

**Check your answers:** (1) $n(n+1) = 156 \\Rightarrow n = 12$: 12 and 13. (2) $w(w+3) = 40 \\Rightarrow w = 5$: 5 cm × 8 cm (reject $w = -8$). (3) $\\frac{600}{p} - \\frac{600}{p+2} = 5 \\Rightarrow p^2 + 2p - 240 = 0 \\Rightarrow p = 15$ pens (at ₦40 each).`,
  quiz: {
    title: 'Quiz 6.6 — Quadratic Word Problems',
    description: 'Modelling with quadratics and rejecting invalid roots.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Two consecutive positive integers have product 156. The smaller is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '11', isCorrect: false }, { id: 'b', text: '12', isCorrect: true }, { id: 'c', text: '13', isCorrect: false }, { id: 'd', text: '14', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'A rectangle has width $w$, length $w + 3$, area 40 cm². The equation is $w^2 + 3w - \\_ = 0$', questionType: 'fill_blank', correctAnswer: '40' },
      { id: 'q3', questionText: 'True or false: a negative root should be rejected when the unknown is a length or a count.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The rectangle dimensions are width ____ cm, length ____ cm (format: w, l)', questionType: 'fill_blank', correctAnswer: '5, 8' },
      { id: 'q5', questionText: 'The first step in a quadratic word problem is to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Solve by formula immediately', isCorrect: false }, { id: 'b', text: 'Define the unknown and translate conditions into an equation', isCorrect: true }, { id: 'c', text: 'Guess and check', isCorrect: false }, { id: 'd', text: 'Draw a pie chart', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 6.6 — Modelling with Quadratics',
    description: 'What a good answer looks like: the unknown defined, the equation written from the story, both roots found, and the impossible root rejected with a reason. Rubric: model 5, solving 3, rejection 2.',
    dueDate: '2026-10-23T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'The product of two consecutive even positive integers is 288. Form an equation, solve it, and state the integers.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'A square garden is enlarged by adding 2 m to each side; the new area is 144 m². Form and solve a quadratic for the original side, explaining why one root is discarded.', marks: 10 },
    ],
  },
})

// ── Module 7 — Week 7: Mid-Term Revision ─────────────────────────────────────

add('Lesson 7.1 — Comprehensive Revision', {
  exercise: `## Practical Exercise
Mixed mid-term drill — one question from each week so far.

1. Logs: use logarithms to evaluate $\\dfrac{87.3 \\times 0.0056}{2.9}$ (3 s.f.).
2. Approximation: round 0.004786 to 2 s.f.
3. Sequences: find the 9th term of the A.P. 2, 9, 16, ... and the sum to infinity of 6 + 2 + 2/3 + ...
4. Quadratics: solve $x^2 - x - 12 = 0$ by factorization.

**Check your answers:** (1) $0.169$ — combine logs: $\\log 87.3 + \\log 0.0056 - \\log 2.9 = \\bar{2}.2264$; antilog gives 0.169. (2) $0.0048$. (3) $T_9 = 2 + 8(7) = 58$; $S_\\infty = \\frac{6}{1 - 1/3} = 9$. (4) $(x-4)(x+3) = 0$: $x = 4$ or $x = -3$.`,
  quiz: {
    title: 'Quiz 7.1 — Mid-Term Mixed Review',
    description: 'One question from each topic covered so far.',
    timeLimit: 1200,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The characteristic of $\\log 0.0056$ is ____ (write as a number)', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'q2', questionText: '0.004786 to 2 s.f. is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '0.0047', isCorrect: false }, { id: 'b', text: '0.0048', isCorrect: true }, { id: 'c', text: '0.00479', isCorrect: false }, { id: 'd', text: '0.005', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: the 9th term of the A.P. 2, 9, 16, ... is 58.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The sum to infinity of 6 + 2 + 2/3 + ... is ____', questionType: 'fill_blank', correctAnswer: '9' },
      { id: 'q5', questionText: 'The roots of $x^2 - x - 12 = 0$ are:', questionType: 'multiple_choice', options: [{ id: 'a', text: '4 and −3', isCorrect: true }, { id: 'b', text: '−4 and 3', isCorrect: false }, { id: 'c', text: '6 and −2', isCorrect: false }, { id: 'd', text: '12 and −1', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 7.1 — Mid-Term Portfolio',
    description: 'Choose TWO topics (logs, approximation, sequences, quadratics) and write a half-page summary each: key formula(s), one worked example, one common mistake to avoid. What a good answer looks like: accurate formulas, correct examples, genuine mistakes. Rubric: 10 per topic (formula 3, example 5, mistake 2).',
    dueDate: '2026-10-30T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'subjective',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Topic summary 1 (half page): key formulas, one worked example, one common mistake.', marks: 10 },
      { id: 'a2', type: 'subjective', title: 'Topic summary 2 (half page): key formulas, one worked example, one common mistake.', marks: 10 },
    ],
  },
})

add('Lesson 7.2 — Revision Test', {
  exercise: `## Practical Exercise
Timed self-test: 25 minutes, closed book. Then mark yourself with the answers.

1. Evaluate $\\log 25 + \\log 4$ without tables.
2. Express 0.0000382 in standard form.
3. The 3rd term of a G.P. is 4 and the 6th term is 32. Find the 10th term.
4. Solve $2x^2 - 5x - 3 = 0$ by any method.

**Check your answers:** (1) $\\log 100 = 2$. (2) $3.82 \\times 10^{-5}$. (3) $ar^2 = 4$, $ar^5 = 32 \\Rightarrow r^3 = 8 \\Rightarrow r = 2$, $a = 1$: $T_{10} = 2^9 = 512$. (4) $(2x + 1)(x - 3) = 0$: $x = -\\frac{1}{2}$ or $x = 3$. Score: 5 marks each; 15+ means you are on track.`,
  quiz: {
    title: 'Quiz 7.2 — Revision Test',
    description: 'Timed check of weeks 1–6.',
    timeLimit: 1500,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '$\\log 25 + \\log 4$ equals:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'log 29', isCorrect: false }, { id: 'b', text: '2', isCorrect: true }, { id: 'c', text: '100', isCorrect: false }, { id: 'd', text: 'log 21', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '0.0000382 in standard form is $A \\times 10^n$. State A and n (format: A, n)', questionType: 'fill_blank', correctAnswer: '3.82, -5' },
      { id: 'q3', questionText: 'True or false: in the G.P. with $T_3 = 4$ and $T_6 = 32$, the common ratio is 2.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The 10th term of that G.P. is ____', questionType: 'fill_blank', correctAnswer: '512' },
      { id: 'q5', questionText: 'The roots of $2x^2 - 5x - 3 = 0$ are:', questionType: 'multiple_choice', options: [{ id: 'a', text: '3 and −½', isCorrect: true }, { id: 'b', text: '−3 and ½', isCorrect: false }, { id: 'c', text: '1 and −3', isCorrect: false }, { id: 'd', text: '5 and −3', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 7.2 — Error Autopsy',
    description: 'From the self-test, pick the TWO questions you found hardest. For each: re-solve correctly, then write 3–4 sentences explaining exactly where your first attempt went wrong and what rule you will remember. What a good answer looks like: correct re-solutions plus specific, honest diagnosis. Rubric: 10 per question (re-solution 6, diagnosis 4).',
    dueDate: '2026-10-30T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'subjective',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Hardest question 1: correct re-solution + diagnosis of the original error.', marks: 10 },
      { id: 'a2', type: 'subjective', title: 'Hardest question 2: correct re-solution + diagnosis of the original error.', marks: 10 },
    ],
  },
})

// ── Module 8 — Week 8: Quadratic Equations (Advanced) ─────────────────────────

add('Lesson 8.1 — Advanced Quadratic Equations', {
  exercise: `## Practical Exercise
Choose the best method (factorize first; else formula). Watch for equations that need rearranging first.

1. Solve $6x^2 - 7x - 3 = 0$.
2. Solve $(x - 2)(x + 5) = 14$ (expand first!).
3. Solve $\\dfrac{x}{x - 1} = \\dfrac{2}{x}$, and check your answer.

**Check your answers:** (1) $(3x + 1)(2x - 3) = 0$: $x = -\\frac{1}{3}$ or $\\frac{3}{2}$. (2) $x^2 + 3x - 24 = 0 \\Rightarrow x = \\frac{-3 \\pm \\sqrt{105}}{2}$ (2 d.p.: $3.62$ or $-6.62$). (3) $x^2 = 2(x - 1) \\Rightarrow x^2 - 2x + 2 = 0$: discriminant $4 - 8 = -4 < 0$, so there is no real solution — checking matters!`,
  quiz: {
    title: 'Quiz 8.1 — Advanced Quadratics',
    description: 'Rearranging and choosing the best solution method.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The roots of $6x^2 - 7x - 3 = 0$ are:', questionType: 'multiple_choice', options: [{ id: 'a', text: '−⅓ and 3/2', isCorrect: true }, { id: 'b', text: '⅓ and −3/2', isCorrect: false }, { id: 'c', text: '1 and −3', isCorrect: false }, { id: 'd', text: '−1 and 3', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'Before solving $(x - 2)(x + 5) = 14$ you must first:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Set each factor equal to 14', isCorrect: false }, { id: 'b', text: 'Expand and rearrange to = 0', isCorrect: true }, { id: 'c', text: 'Divide by 14', isCorrect: false }, { id: 'd', text: 'Square both sides', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: multiplying an equation through by denominators can introduce invalid roots, so answers must be checked.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The positive root of $x^2 + 3x - 24 = 0$ (2 d.p.) is ____', questionType: 'fill_blank', correctAnswer: '3.62' },
      { id: 'q5', questionText: 'The best FIRST method to try on any quadratic is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Quadratic formula', isCorrect: false }, { id: 'b', text: 'Factorization', isCorrect: true }, { id: 'c', text: 'Graphing', isCorrect: false }, { id: 'd', text: 'Trial and error', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 8.1 — Method Selection',
    description: 'For each equation: state the method chosen and why, then solve. What a good answer looks like: quick factorability test, correct expansion of bracket-equals-number cases, substitution checks. Rubric: method choice 4, solution 6.',
    dueDate: '2026-11-06T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve, stating your method: (a) $4x^2 + 11x + 6 = 0$ (b) $(2x - 1)(x + 3) = 9$.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Solve $\\dfrac{3}{x} + \\dfrac{4}{x + 1} = 2$, showing the clearing of denominators and checking your answer.', marks: 10 },
    ],
  },
})

add('Lesson 8.2 — Quadratic Word Problems', {
  exercise: `## Practical Exercise
Harder modelling: two unknowns reduced to one, or maximising values.

1. The sum of two numbers is 15 and their product is 56. Find them.
2. A farmer has 40 m of fence to enclose a rectangular plot against a wall (no fence needed on the wall side). If the width is $w$, show the area is $A = w(40 - 2w)$ and find $w$ giving the largest area.
3. Two pipes together fill a tank in 6 hours. Alone, one takes 5 hours longer than the other. Find each pipe's time.

**Check your answers:** (1) $x(15 - x) = 56 \\Rightarrow x = 7$ or 8: the numbers are 7 and 8. (2) $A = w(40 - 2w) = -2w^2 + 40w$; completing the square: $-2(w - 10)^2 + 200$, so $w = 10$ m gives the maximum area 200 m². (3) $\\frac{1}{t} + \\frac{1}{t+5} = \\frac{1}{6} \\Rightarrow t^2 - 7t - 30 = 0 \\Rightarrow t = 10$: 10 hours and 15 hours.`,
  quiz: {
    title: 'Quiz 8.2 — Quadratic Word Problems II',
    description: 'Sums/products, maxima and rate problems.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Two numbers add to 15 and multiply to 56. The larger is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '6', isCorrect: false }, { id: 'b', text: '7', isCorrect: false }, { id: 'c', text: '8', isCorrect: true }, { id: 'd', text: '9', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q2', questionText: 'In the fence problem, $A = -2w^2 + 40w$. The width giving maximum area is ____ m', questionType: 'fill_blank', correctAnswer: '10' },
      { id: 'q3', questionText: 'True or false: completing the square can find the maximum of a quadratic without drawing its graph.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The maximum area of the fenced plot is ____ m²', questionType: 'fill_blank', correctAnswer: '200' },
      { id: 'q5', questionText: 'In the pipe problem, $t^2 - 7t - 30 = 0$. The rejected root is negative because:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Time cannot be negative', isCorrect: true }, { id: 'b', text: 'It is too small', isCorrect: false }, { id: 'c', text: 'It is not an integer', isCorrect: false }, { id: 'd', text: 'It is odd', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 8.2 — Real-World Quadratics',
    description: 'What a good answer looks like: a clearly defined variable, a justified equation, both roots found, physical roots selected, units throughout. Rubric: model 5, solving 3, interpretation 2.',
    dueDate: '2026-11-06T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'A ball is thrown so that its height is $h = 20t - 5t^2$ metres after $t$ seconds. Find (a) when it reaches 15 m, (b) the maximum height and the time it occurs.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'A car travels 240 km. If it had gone 20 km/h faster, the trip would have taken 1 hour less. Find its speed by forming a quadratic.', marks: 10 },
    ],
  },
})

add('Lesson 8.3 — Mixed Quadratic Practice', {
  exercise: `## Practical Exercise
Four methods, one drill set — name the method you use each time.

1. $x^2 - 13x + 36 = 0$ (factorize)
2. $3x^2 - 2x - 4 = 0$ (formula, 2 d.p.)
3. $x^2 + 14x + 24 = 0$ (completing the square)
4. Given roots $\\frac{1}{2}$ and $\\frac{2}{3}$, form the equation (root relationships)

**Check your answers:** (1) $(x - 4)(x - 9) = 0$: $x = 4$ or 9. (2) $x = \\frac{2 \\pm \\sqrt{52}}{6} = \\frac{1 \\pm \\sqrt{13}}{3}$ (2 d.p.: $1.54$ or $-0.87$). (3) $(x + 7)^2 = 25 \\Rightarrow x = -2$ or $-12$. (4) sum $= \\frac{7}{6}$, product $= \\frac{1}{3}$: $6x^2 - 7x + 2 = 0$.`,
  quiz: {
    title: 'Quiz 8.3 — Mixed Quadratic Practice',
    description: 'Choosing and applying all four techniques.',
    timeLimit: 1200,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The roots of $x^2 - 13x + 36 = 0$ are:', questionType: 'multiple_choice', options: [{ id: 'a', text: '4 and 9', isCorrect: true }, { id: 'b', text: '6 and 6', isCorrect: false }, { id: 'c', text: '3 and 12', isCorrect: false }, { id: 'd', text: '−4 and −9', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'Solving $3x^2 - 2x - 4 = 0$ by formula gives the positive root (2 d.p.) ____', questionType: 'fill_blank', correctAnswer: '1.54' },
      { id: 'q3', questionText: 'True or false: completing the square on $x^2 + 14x$ gives $(x + 7)^2$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The equation with roots ½ and ⅔ is $6x^2 - 7x + \\_ = 0$', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q5', questionText: 'Which method is guaranteed to work on EVERY quadratic?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Factorization', isCorrect: false }, { id: 'b', text: 'Completing the square / formula', isCorrect: true }, { id: 'c', text: 'Guessing', isCorrect: false }, { id: 'd', text: 'Graph reading only', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 8.3 — Quadratic Toolkit',
    description: 'Solve each equation with the most efficient method and justify the choice in one line. What a good answer looks like: method named, correct roots, one-line justification. Rubric: 5 marks per equation (method 1, roots 4).',
    dueDate: '2026-11-06T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve efficiently: (a) $x^2 - 3x - 28 = 0$ (b) $5x^2 + 2x - 1 = 0$ (2 d.p.).', marks: 10 },
      { id: 'a2', type: 'theory', title: 'The roots of a quadratic are 1 more than each other and their product is 12. Form and solve the equation.', marks: 10 },
    ],
  },
})

add('Lesson 9.1 — Revision of Linear Simultaneous Equations', {
  exercise: `## Practical Exercise
Solve by elimination, then verify by substitution.

1. $2x + y = 11$ and $x - y = 1$
2. $4x + 3y = 26$ and $5x - 3y = 19$
3. Solve by substitution: $y = 2x - 3$ and $4x - 3y = 7$

**Check your answers:** (1) add the equations: $3x = 12 \\Rightarrow x = 4$, $y = 3$ (check: $8 + 3 = 11$ ✓). (2) the $y$-terms already cancel: adding gives $9x = 45 \\Rightarrow x = 5$, $y = 2$ (check: $20 + 6 = 26$ ✓, $25 - 6 = 19$ ✓). (3) $4x - 3(2x - 3) = 7 \\Rightarrow -2x + 9 = 7 \\Rightarrow x = 1$, $y = -1$.`,
  quiz: {
    title: 'Quiz 9.1 — Linear Simultaneous Equations',
    description: 'Elimination and substitution refresher.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Solving $x + y = 10$ and $x - y = 4$ gives:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'x = 7, y = 3', isCorrect: true }, { id: 'b', text: 'x = 6, y = 4', isCorrect: false }, { id: 'c', text: 'x = 3, y = 7', isCorrect: false }, { id: 'd', text: 'x = 5, y = 5', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'For $y = 2x - 3$ and $4x - 3y = 7$, the solution is $x = 1$, $y =$ ____', questionType: 'fill_blank', correctAnswer: '-1' },
      { id: 'q3', questionText: 'True or false: elimination works by making the coefficients of one variable equal or opposite.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Adding $x + y = 10$ and $x - y = 4$ eliminates the variable ____ first.', questionType: 'fill_blank', correctAnswer: 'y' },
      { id: 'q5', questionText: 'Substitution is most convenient when:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'One equation already gives a variable in terms of the other', isCorrect: true }, { id: 'b', text: 'Both equations are in standard form', isCorrect: false }, { id: 'c', text: 'The coefficients are large', isCorrect: false }, { id: 'd', text: 'There is no solution', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 9.1 — Elimination Refresher',
    description: 'Solve each pair by BOTH elimination and substitution; state which was faster and why. What a good answer looks like: matching solutions from both methods plus a one-line comparison. Rubric: 5 per pair (solutions 4, verification 1).',
    dueDate: '2026-11-13T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve by both methods: $2x + 3y = 16$ and $x - 2y = -6$.', marks: 10 },
      { id: 'a2', type: 'subjective', title: 'Solve by both methods: $5x + 2y = 30$ and $3x - 2y = 2$.', marks: 10 },
    ],
  },
})

add('Lesson 9.2 — One Linear and One Quadratic Equation', {
  exercise: `## Practical Exercise
Solve the linear equation for one variable, substitute into the quadratic, then back-substitute.

1. $y = x + 1$ and $x^2 + y^2 = 25$
2. $y = 2x$ and $x^2 + xy = 12$
3. $x + y = 7$ and $xy = 12$

**Check your answers:** (1) $x^2 + (x+1)^2 = 25 \\Rightarrow 2x^2 + 2x - 24 = 0 \\Rightarrow x^2 + x - 12 = 0 \\Rightarrow x = 3$ or $-4$: pairs $(3, 4)$ and $(-4, -3)$. (2) $x^2 + 2x^2 = 12 \\Rightarrow x = \\pm 2$: pairs $(2, 4)$ and $(-2, -4)$. (3) $y = 7 - x$: $x(7-x) = 12 \\Rightarrow x^2 - 7x + 12 = 0 \\Rightarrow x = 3$ or 4: pairs $(3, 4)$ and $(4, 3)$.`,
  quiz: {
    title: 'Quiz 9.2 — Linear + Quadratic Systems',
    description: 'Substitution into quadratics.',
    timeLimit: 1200,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A linear-quadratic system usually has how many solution pairs?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Always exactly 1', isCorrect: false }, { id: 'b', text: '0, 1 or 2', isCorrect: true }, { id: 'c', text: 'Always exactly 2', isCorrect: false }, { id: 'd', text: '4', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'For $y = x + 1$ and $x^2 + y^2 = 25$, one pair is $(3, 4)$; the other is (format: x, y) ____', questionType: 'fill_blank', correctAnswer: '-4, -3' },
      { id: 'q3', questionText: 'True or false: after substituting into the quadratic, the resulting one-variable equation is quadratic.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'For $x + y = 7$ and $xy = 12$, the two values of $x$ are ____ and ____ (format: a, b)', questionType: 'fill_blank', correctAnswer: '3, 4' },
      { id: 'q5', questionText: 'The last step in solving a linear-quadratic system is to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Stop at the x-values', isCorrect: false }, { id: 'b', text: 'Back-substitute to find the matching y-values', isCorrect: true }, { id: 'c', text: 'Delete the linear equation', isCorrect: false }, { id: 'd', text: 'Graph the parabola', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 9.2 — Mixed Systems',
    description: 'What a good answer looks like: substitution shown line by line, all solution pairs found, at least one pair verified in BOTH original equations. Rubric: substitution 5, all pairs 3, verification 2.',
    dueDate: '2026-11-13T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Solve $y = x - 2$ and $y = x^2 - 4$, giving all solution pairs and verifying one of them.', marks: 10 },
      { id: 'a2', type: 'theory', title: 'Solve $2x - y = 3$ and $x^2 - y^2 = 15$, showing every step.', marks: 10 },
    ],
  },
})

add('Lesson 9.3 — Word Problems Leading to Simultaneous Equations', {
  exercise: `## Practical Exercise
Define variables, build two equations, solve, and answer the actual question asked.

1. Two numbers add to 25 and their difference is 7. Find them.
2. 3 notebooks and 4 pens cost ₦620. 5 notebooks and 2 pens cost ₦660. Find the cost of each.
3. A father is 4 times as old as his son. In 5 years, he will be 3 times as old. Find their present ages.

**Check your answers:** (1) $x + y = 25$, $x - y = 7$: add to get $2x = 32 \\Rightarrow x = 16$, $y = 9$. (2) $3n + 4p = 620$, $5n + 2p = 660$: double eq2 to $10n + 4p = 1320$, subtract eq1: $7n = 700 \\Rightarrow n = 100$, then $p = 80$ (check: $300 + 320 = 620$ ✓, $500 + 160 = 660$ ✓). Notebook ₦100, pen ₦80. (3) $f = 4s$; $f + 5 = 3(s + 5) \\Rightarrow 4s + 5 = 3s + 15 \\Rightarrow s = 10$, $f = 40$.`,
  quiz: {
    title: 'Quiz 9.3 — Simultaneous Word Problems',
    description: 'Modelling real situations with two equations.',
    timeLimit: 1200,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Two numbers add to 25 and differ by 7. The larger is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '15', isCorrect: false }, { id: 'b', text: '16', isCorrect: true }, { id: 'c', text: '17', isCorrect: false }, { id: 'd', text: '18', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'In the notebook-pen problem, a pen costs ₦____', questionType: 'fill_blank', correctAnswer: '80' },
      { id: 'q3', questionText: 'True or false: the first step is always to define what each variable represents.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'In the age problem, the son is ____ years old now.', questionType: 'fill_blank', correctAnswer: '10' },
      { id: 'q5', questionText: 'After solving, the final step for word problems is to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Stop at the variable values', isCorrect: false }, { id: 'b', text: 'Answer the original question with units and check it makes sense', isCorrect: true }, { id: 'c', text: 'Round the numbers', isCorrect: false }, { id: 'd', text: 'Draw a graph', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 9.3 — Two-Equation Stories',
    description: 'What a good answer looks like: variables defined, two equations clearly formed, correct solution, and a final sentence answering the question with units. Rubric: variables 3, equations 5, solution 2.',
    dueDate: '2026-11-13T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'In a class of 45 students, there are 7 more girls than boys. How many girls are there? Set up and solve simultaneous equations.', marks: 10 },
      { id: 'a2', type: 'theory', title: '2 kg of rice and 3 kg of beans cost ₦3,400; 4 kg of rice and 1 kg of beans cost ₦3,200. Find the price per kg of each, showing your equations.', marks: 10 },
    ],
  },
})

// ── Module 10 — Week 10: Graphs ───────────────────────────────────────────────

add('Lesson 10.1 — Linear Graphs', {
  exercise: `## Practical Exercise
Draw each line on graph paper using a table of values (at least 3 points).

1. $y = 2x - 1$ from $x = -2$ to $x = 3$
2. $y = -x + 4$ from $x = -1$ to $x = 5$
3. From your first graph, read off the value of $y$ when $x = 2.5$, and the $x$-intercept.

**Check your answers:** (1) points: $(-2, -5)$, $(0, -1)$, $(3, 5)$; at $x = 2.5$, $y = 4$; the line crosses the $x$-axis at $x = 0.5$ (solve $2x - 1 = 0$). (2) points: $(-1, 5)$, $(0, 4)$, $(5, -1)$; gradient $-1$, intercept 4. Gradient of line 1 is 2 — steeper than line 2.`,
  quiz: {
    title: 'Quiz 10.1 — Linear Graphs',
    description: 'Gradients, intercepts and reading graphs.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'In $y = 2x - 1$, the gradient is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '2', isCorrect: true }, { id: 'b', text: '−1', isCorrect: false }, { id: 'c', text: '1', isCorrect: false }, { id: 'd', text: '−2', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'The y-intercept of $y = -x + 4$ is ____', questionType: 'fill_blank', correctAnswer: '4' },
      { id: 'q3', questionText: 'True or false: the graph of $y = 2x - 1$ crosses the x-axis at $x = 0.5$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'On $y = 2x - 1$, when $x = 2.5$ then $y =$ ____', questionType: 'fill_blank', correctAnswer: '4' },
      { id: 'q5', questionText: 'A line with gradient $-1$ slopes:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Upward left to right', isCorrect: false }, { id: 'b', text: 'Downward left to right', isCorrect: true }, { id: 'c', text: 'Horizontal', isCorrect: false }, { id: 'd', text: 'Vertical', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 10.1 — Drawing Lines',
    description: 'Submit the two graphs (photo or scan) with tables of values shown. What a good answer looks like: axes labelled, 3+ points, straight lines with ruler, intercepts marked. Rubric: table 5, accuracy 5.',
    dueDate: '2026-11-20T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'file',
    questions: [
      { id: 'a1', type: 'file', title: 'Graph 1: $y = 3x - 2$ from $x = -2$ to $x = 2$, with its table of values.', marks: 10 },
      { id: 'a2', type: 'file', title: 'Graph 2: $y = -2x + 6$ from $x = 0$ to $x = 4$, marking both intercepts.', marks: 10 },
    ],
  },
})

add('Lesson 10.2 — Quadratic Graphs', {
  exercise: `## Practical Exercise
Draw $y = x^2 - 2x - 3$ for $-2 \\leq x \\leq 4$ using a table of values, then answer:

1. Where does the curve cut the $x$-axis?
2. What are the coordinates of the minimum point?
3. State the equation of the axis of symmetry.

**Check your answers:** Table: $x = -2, -1, 0, 1, 2, 3, 4$ gives $y = 5, 0, -3, -4, -3, 0, 5$. (1) cuts at $x = -1$ and $x = 3$ (roots of $x^2 - 2x - 3 = 0$). (2) minimum at $(1, -4)$. (3) axis of symmetry: $x = 1$.`,
  quiz: {
    title: 'Quiz 10.2 — Quadratic Graphs',
    description: 'Parabolas, roots and turning points.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The x-axis crossings of $y = x^2 - 2x - 3$ are at $x =$:', questionType: 'multiple_choice', options: [{ id: 'a', text: '−1 and 3', isCorrect: true }, { id: 'b', text: '1 and −3', isCorrect: false }, { id: 'c', text: '−3 and 1', isCorrect: false }, { id: 'd', text: '3 and 1', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'The minimum point of $y = x^2 - 2x - 3$ is (format: x, y) ____', questionType: 'fill_blank', correctAnswer: '1, -4' },
      { id: 'q3', questionText: 'True or false: the axis of symmetry of that curve is $x = 1$.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'When $x = 4$, $y = x^2 - 2x - 3$ equals ____', questionType: 'fill_blank', correctAnswer: '5' },
      { id: 'q5', questionText: 'A parabola with a positive $x^2$ coefficient opens:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Downward', isCorrect: false }, { id: 'b', text: 'Upward (∪ shape)', isCorrect: true }, { id: 'c', text: 'Sideways', isCorrect: false }, { id: 'd', text: 'It cannot open upward', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 10.2 — Drawing Parabolas',
    description: 'Submit the graph with a full table of values. What a good answer looks like: smooth curve (not straight segments), roots and turning point marked and labelled. Rubric: table 4, curve 4, labels 2.',
    dueDate: '2026-11-20T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'file',
    questions: [
      { id: 'a1', type: 'file', title: 'Draw $y = x^2 - 4x + 3$ for $0 \\leq x \\leq 4$. Mark the roots and the minimum point.', marks: 10 },
      { id: 'a2', type: 'file', title: 'Draw $y = 4 - x^2$ for $-3 \\leq x \\leq 3$. Mark the maximum point — this parabola opens downward.', marks: 10 },
    ],
  },
})

add('Lesson 10.3 — Graphical Solution of Simultaneous Equations', {
  exercise: `## Practical Exercise
Draw both equations on the same axes and read the intersection.

1. Solve graphically: $y = x + 1$ and $y = 2x - 1$ (draw both for $-2 \\leq x \\leq 4$).
2. Solve graphically: $y = x^2$ and $y = 2x + 3$ (draw for $-2 \\leq x \\leq 4$).
3. Check one answer from each pair by substitution.

**Check your answers:** (1) the lines intersect where $x + 1 = 2x - 1 \\Rightarrow x = 2$: point $(2, 3)$. (2) parabola meets line where $x^2 = 2x + 3 \\Rightarrow (x-3)(x+1) = 0$: points $(3, 9)$ and $(-1, 1)$. (3) $(2, 3)$: $3 = 2 + 1$ ✓ and $3 = 4 - 1$ ✓; $(-1, 1)$: $1 = 1$ ✓ and $1 = -2 + 3$ ✓.`,
  quiz: {
    title: 'Quiz 10.3 — Graphical Solutions',
    description: 'Finding intersections of lines and curves.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The solution of a graphical simultaneous system is read from the:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'y-intercepts', isCorrect: false }, { id: 'b', text: 'Point(s) of intersection', isCorrect: true }, { id: 'c', text: 'Gradient', isCorrect: false }, { id: 'd', text: 'Origin', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '$y = x + 1$ and $y = 2x - 1$ intersect at (format: x, y) ____', questionType: 'fill_blank', correctAnswer: '2, 3' },
      { id: 'q3', questionText: 'True or false: a line and a parabola can intersect at 0, 1 or 2 points.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: '$y = x^2$ and $y = 2x + 3$ intersect at $x = 3$ and $x =$ ____', questionType: 'fill_blank', correctAnswer: '-1' },
      { id: 'q5', questionText: 'Graphical solutions may be approximate because of:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Reading precision on the graph', isCorrect: true }, { id: 'b', text: 'The type of paper', isCorrect: false }, { id: 'c', text: 'The pencil colour', isCorrect: false }, { id: 'd', text: 'They are always exact', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 10.3 — Intersections',
    description: 'Submit the graph(s) with both equations drawn and intersection points clearly circled, plus an algebraic check. What a good answer looks like: accurate curves, circled intersections, verification shown. Rubric: graphs 6, intersections 2, check 2.',
    dueDate: '2026-11-20T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'file',
    questions: [
      { id: 'a1', type: 'file', title: 'Draw $y = 2x + 1$ and $y = -x + 7$ on one axes; find their intersection graphically and verify algebraically.', marks: 10 },
      { id: 'a2', type: 'file', title: 'Draw $y = x^2 - 4$ and $y = x + 2$ for $-3 \\leq x \\leq 4$; read the intersection points and verify one by substitution.', marks: 10 },
    ],
  },
})

add('Lesson 10.4 — Applications of Quadratic Graphs', {
  exercise: `## Practical Exercise
Use graphs to solve problems that are hard by hand.

1. Draw $y = 2x^2 - 4x - 6$ for $-2 \\leq x \\leq 4$ and use it to solve $2x^2 - 4x - 6 = 0$.
2. Use the same graph to solve $2x^2 - 4x - 2 = 0$ (hint: rewrite as $2x^2 - 4x - 6 = -4$ and read where the curve has height $-4$).
3. A ball's height is $h = 20t - 5t^2$ m. Draw for $0 \\leq t \\leq 4$ and find when it lands.

**Check your answers:** (1) roots at $x = -1$ and $x = 3$. (2) $2x^2 - 4x - 2 = 0 \\Rightarrow x^2 - 2x - 1 = 0 \\Rightarrow x = 1 \\pm \\sqrt{2}$, i.e. $x \\approx 2.41$ or $-0.41$ (2 d.p.) — read where the curve has height $-4$. (3) lands when $h = 0$: $t = 4$ s (besides $t = 0$, the start).`,
  quiz: {
    title: 'Quiz 10.4 — Quadratic Graph Applications',
    description: 'Reading related equations off one graph.',
    timeLimit: 900,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Solving $2x^2 - 4x - 6 = 0$ graphically means finding where the curve:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Is highest', isCorrect: false }, { id: 'b', text: 'Cuts the x-axis (height 0)', isCorrect: true }, { id: 'c', text: 'Cuts the y-axis', isCorrect: false }, { id: 'd', text: 'Is steepest', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The roots of $2x^2 - 4x - 6 = 0$ are $x = -1$ and $x =$ ____', questionType: 'fill_blank', correctAnswer: '3' },
      { id: 'q3', questionText: 'True or false: one drawn parabola can be reused to solve several related equations by shifting the line you compare with.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'For $h = 20t - 5t^2$, the ball lands at $t =$ ____ s (besides $t = 0$)', questionType: 'fill_blank', correctAnswer: '4' },
      { id: 'q5', questionText: 'The maximum height of the ball is read from the:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'x-intercept', isCorrect: false }, { id: 'b', text: 'Peak of the curve', isCorrect: true }, { id: 'c', text: 'y-intercept only', isCorrect: false }, { id: 'd', text: 'Table only', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 10.4 — One Graph, Many Answers',
    description: 'Submit the drawn graph plus written answers read from it. What a good answer looks like: an accurate curve, dotted guide-lines showing how each answer was read off. Rubric: graph 6, readings 4.',
    dueDate: '2026-11-20T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'file',
    questions: [
      { id: 'a1', type: 'file', title: 'Draw $y = x^2 - 2x - 2$ for $-2 \\leq x \\leq 4$. Use it to solve (a) $x^2 - 2x - 2 = 0$ (2 d.p.) and (b) $x^2 - 2x - 5 = 0$ (2 d.p.).', marks: 10 },
      { id: 'a2', type: 'file', title: 'A rocket\'s height is $h = 30t - 5t^2$ m. Draw for $0 \\leq t \\leq 6$ and find (a) the maximum height, (b) when it is 40 m high.', marks: 10 },
    ],
  },
})

// ── Module 11 — Week 11: Revision of First Term Work ──────────────────────────

add('Lesson 11.1 — Comprehensive Revision', {
  exercise: `## Practical Exercise
Full-term mixed drill. Attempt all without notes, then check.

1. Evaluate $\\log 45.7 + \\log 3.84$ and find the antilog (this gives $45.7 \\times 3.84$).
2. A value 6.84 is rounded to 6.8. Find the percentage error (3 s.f.).
3. The 3rd term of an A.P. is 9 and the 8th term is 24. Find the 20th term.
4. Find the sum to infinity of 18 + 6 + 2 + ...
5. Solve $x^2 - 6x + 8 = 0$ by factorization.

**Check your answers:** (1) $1.6599 + 0.5843 = 2.2442$; antilog gives $175.5 \\approx 176$ (3 s.f.). (2) $\\frac{0.04}{6.84} \\times 100\\% = 0.585\\%$. (3) $a + 2d = 9$, $a + 7d = 24 \\Rightarrow 5d = 15$, $d = 3$, $a = 3$: $T_{20} = 3 + 19(3) = 60$. (4) $r = \\frac{1}{3}$: $S_\\infty = \\frac{18}{2/3} = 27$. (5) $(x-2)(x-4) = 0$: $x = 2$ or 4.`,
  quiz: {
    title: 'Quiz 11.1 — First Term Review',
    description: 'Mixed questions from every week of the term.',
    timeLimit: 1500,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '$\\log 45.7 + \\log 3.84$ is closest to:', questionType: 'multiple_choice', options: [{ id: 'a', text: '2.2442', isCorrect: true }, { id: 'b', text: '1.2442', isCorrect: false }, { id: 'c', text: '3.2442', isCorrect: false }, { id: 'd', text: '0.2442', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'The percentage error when 6.84 becomes 6.8 is ____% (3 s.f.)', questionType: 'fill_blank', correctAnswer: '0.585' },
      { id: 'q3', questionText: 'True or false: in the A.P. with $T_3 = 9$ and $T_8 = 24$, the common difference is 3.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The sum to infinity of 18 + 6 + 2 + ... is ____', questionType: 'fill_blank', correctAnswer: '27' },
      { id: 'q5', questionText: 'The roots of $x^2 - 6x + 8 = 0$ are:', questionType: 'multiple_choice', options: [{ id: 'a', text: '2 and 4', isCorrect: true }, { id: 'b', text: '−2 and −4', isCorrect: false }, { id: 'c', text: '1 and 8', isCorrect: false }, { id: 'd', text: '3 and 3', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 11.1 — Term Review Paper',
    description: 'Write out FIVE examination-style questions of your own (one each on logs, approximation, sequences, quadratics, graphs) WITH full model solutions. What a good answer looks like: questions at exam standard, solutions step-by-step and correct. Rubric: 4 marks per question+solution set.',
    dueDate: '2026-11-27T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'subjective',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Questions 1–3 (one topic each) with full model solutions.', marks: 12 },
      { id: 'a2', type: 'subjective', title: 'Questions 4–5 (one topic each) with full model solutions.', marks: 8 },
    ],
  },
})

add('Lesson 11.2 — Practice Examination', {
  exercise: `## Practical Exercise
Sit a full practice paper under exam conditions: 90 minutes, no notes.

Section A (objectives — 40 marks): 10 short questions covering logs, standard form, approximation, percentage error, sequences, quadratics.
Section B (theory — 60 marks): 6 structured questions with working shown.

Afterwards, mark yourself honestly and list every topic where you lost marks.

**Sample Section B question with solution:** The 2nd term of a G.P. is 6 and the 5th term is 162. Find the first term and the sum of the first 4 terms.
Solution: $ar = 6$, $ar^4 = 162 \\Rightarrow r^3 = 27 \\Rightarrow r = 3$, $a = 2$. $S_4 = \\frac{2(81 - 1)}{2} = 80$.`,
  quiz: {
    title: 'Quiz 11.2 — Practice Exam Objectives',
    description: 'Objective section of the practice examination.',
    timeLimit: 1800,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Express 0.0000471 in standard form (format: A x 10^n):', questionType: 'fill_blank', correctAnswer: '4.71 x 10^-5' },
      { id: 'q2', questionText: 'The characteristic of $\\log 0.0912$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '−2 (bar-2)', isCorrect: true }, { id: 'b', text: '−1', isCorrect: false }, { id: 'c', text: '−3', isCorrect: false }, { id: 'd', text: '0', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: the 30th term of the A.P. 5, 9, 13, ... is 121.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'In the G.P. with $ar = 6$ and $r = 3$, the first term $a$ is ____', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q5', questionText: 'The discriminant of $3x^2 - 2x - 1 = 0$ is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '16', isCorrect: true }, { id: 'b', text: '−16', isCorrect: false }, { id: 'c', text: '4', isCorrect: false }, { id: 'd', text: '8', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment 11.2 — Practice Exam Theory',
    description: 'Complete THREE theory questions from your practice paper (or the samples) with full working, as you would in the real examination. What a good answer looks like: clear method, correct arithmetic, answers to the demanded accuracy. Rubric: ~7 marks per question by the marking scheme.',
    dueDate: '2026-11-27T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'subjective',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Theory question 1 with full working.', marks: 7 },
      { id: 'a2', type: 'subjective', title: 'Theory question 2 with full working.', marks: 7 },
      { id: 'a3', type: 'subjective', title: 'Theory question 3 with full working.', marks: 6 },
    ],
  },
})

// ── Module 12 — Week 12: Examination ──────────────────────────────────────────

add('Lesson 12.1 — First Term Examination', {
  exercise: `## Practical Exercise
This is the examination week. Use this lesson as your final preparation routine:

1. Re-attempt the Practice Examination (Lesson 11.2) under timed conditions.
2. Revisit every Assignment you scored below 15/20 on and redo them.
3. Make a one-page formula sheet: log laws, $T_n$ and $S_n$ for A.P./G.P., $S_\\infty$, quadratic formula, sum/product of roots, gradient/intercept.
4. Sleep well before the paper — accuracy drops when you are tired.

**Remember the exam technique:** read every question twice, show all working (method marks are real marks), and check answers to the accuracy demanded (d.p./s.f.).`,
  quiz: {
    title: 'Quiz 12.1 — Examination Readiness',
    description: 'Final readiness check before the examination paper.',
    timeLimit: 1200,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'In an exam, method marks are earned by:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Writing only final answers', isCorrect: false }, { id: 'b', text: 'Showing clear, logical working', isCorrect: true }, { id: 'c', text: 'Using a calculator silently', isCorrect: false }, { id: 'd', text: 'Finishing fastest', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'A question asks for the answer to 2 d.p. — you must give ____ decimal places.', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'q3', questionText: 'True or false: the formula sheet listed in this lesson covers every First Term topic.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'The very first action for each exam question is to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Start calculating immediately', isCorrect: false }, { id: 'b', text: 'Read it twice and identify what is required', isCorrect: true }, { id: 'c', text: 'Copy the question', isCorrect: false }, { id: 'd', text: 'Skip hard ones permanently', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q5', questionText: 'If you finish early, you should:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Leave immediately', isCorrect: false }, { id: 'b', text: 'Check workings and accuracy of every answer', isCorrect: true }, { id: 'c', text: 'Redo the paper from scratch', isCorrect: false }, { id: 'd', text: 'Change random answers', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment 12.1 — Examination Paper',
    description: 'The First Term Examination itself is sat as the course-level quiz (SS2 Mathematics — First Term Examination, 12 questions). This assignment is your reflection: after the exam, write a one-page review — the three topics you were strongest in, the two you need to work on, and your plan for Second Term. What a good answer looks like: honest, specific, with named topics and concrete next steps. Rubric: strengths 8, weaknesses 8, plan 4.',
    dueDate: '2026-12-04T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'subjective',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Name your three strongest topics and explain (with an example) why each went well.', marks: 8 },
      { id: 'a2', type: 'subjective', title: 'Name two topics to improve, what went wrong, and your concrete plan for Second Term.', marks: 12 },
    ],
  },
})