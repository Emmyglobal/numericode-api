import type { Jss2ModuleData, Jss2LessonData } from './types'
const lessons: Jss2LessonData[] = []
lessons.push({
  title: 'Week 6 — Directed Numbers',
  duration: 45,
  content: `# Week 6 — Directed Numbers: Addition, Subtraction, Multiplication, Division

## Learning Objectives
- Add and subtract directed numbers using the number line.
- Multiply and divide directed numbers (sign rules).
- Simplify expressions with directed numbers.

## Introduction
Directed numbers have size AND direction (positive or negative). Think of them on a number line: right = positive, left = negative.

## Addition and Subtraction
(+5) + (+9) = +14. (+8) + (-12) = -4. (-3) + (-7) = -10.
(+6) - (+13) = -7. (-12) - (-5) = -7 (subtracting negative = adding).

## Multiplication Sign Rules
Same signs = positive. Different signs = negative.
(+9) x (+4) = +36. (+5) x (-7) = -35. (-3) x (-7) = +21.
(-6) x (-5) / (-10) = -3. (-2) x 12 / (-6) = +4.

## Division
(-36) / (+9) = -4. (-4) / (-12) = 1/3.

## Class Activity
1. (+5)+(+9), (+8)+(-12), (+9)+(-3), (-3)+(-7).
2. (+6)-(+13), (+13)-(+5), (-12)-(-5), (-6)-(-14).
3. (+9)x(+4), (+5)x(-7), (-3)x(-7).

## Assignment
1. Simplify (-6)x(-5)/(-10) and (-2)x12/(-6).
2. Divide (-36) by (+9) and (-4) by (-12).

## Key Takeaways
- Same signs multiply/divide to positive.
- Different signs multiply/divide to negative.
- Subtracting a negative = adding a positive.`,
  quiz: {
    title: 'Quiz W6 — Directed Numbers',
    description: '5 questions on directed number operations.',
    timeLimit: 600, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '(-6) x (-5) / (-10) =', questionType: 'fill_blank', correctAnswer: '-3' },
      { id: 'q2', questionText: '(-36) / (+9) =', questionType: 'fill_blank', correctAnswer: '-4' },
      { id: 'q3', questionText: '(-2) x 12 / (-6) =', questionType: 'multiple_choice', options: [{ id: 'a', text: '-4', isCorrect: false }, { id: 'b', text: '+4', isCorrect: true }, { id: 'c', text: '-24', isCorrect: false }, { id: 'd', text: '+24', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q4', questionText: 'True or false: (-3) x (-7) = -21.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q5', questionText: '(+8) + (-12) =', questionType: 'fill_blank', correctAnswer: '-4' },
    ],
  },
  assignment: {
    title: 'Assignment W6',
    description: 'Complete all questions.',
    dueDate: '2026-10-19T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [
      { id: 'a1', type: 'subjective', title: 'Work out: (+5)+(+9), (+8)+(-12), (-3)+(-7).', marks: 5 },
      { id: 'a2', type: 'subjective', title: 'Work out: (+6)-(+13), (-12)-(-5), (-6)-(-14).', marks: 5 },
      { id: 'a3', type: 'subjective', title: 'Work out: (+9)x(+4), (+5)x(-7), (-3)x(-7).', marks: 5 },
      { id: 'a4', type: 'subjective', title: 'Simplify: (-6)x(-5)/(-10) and (-2)x12/(-6).', marks: 5 },
    ],
  },
})
export const module06: Jss2ModuleData = { title: 'Module 6 — Week 6: Directed Numbers', lessons }
