import type { ChallengeLessonWork } from './types'

// Day 4 graded work. Verified: x+y=5, x-y=1 -> (3,2); 2x+y=7, x-y=2 -> (3,1);
// 2x+3y=12, x-y=1 -> (3,2); y=x-1 with 2x+y=5 -> (2,1); y=x+1 with x+y=9
// -> (4,5); sum 15 one 3 more -> 6 and 9; sum 18 one 4 more -> 7 and 11.
export const WORK_DAY4: Record<string, ChallengeLessonWork> = {
  'Day 4 — Understanding Simultaneous Equations': {
    quiz: {
      title: 'Day 4 — Check: Understanding Simultaneous Equations',
      description: 'Three quick questions on the idea of a pair of equations.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'How many equations are needed to solve for two unknowns, x and y?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'One', isCorrect: false },
            { id: 'b', text: 'Two', isCorrect: true },
            { id: 'c', text: 'Three', isCorrect: false },
            { id: 'd', text: 'Four', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'One equation cannot pin down two unknowns, so a pair is needed, both true at the same time.',
        },
        {
          questionText: 'What does "simultaneous" mean?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'The equations are added together', isCorrect: false },
            { id: 'b', text: 'Both equations are true for the same values of x and y', isCorrect: true },
            { id: 'c', text: 'The equations are written on separate lines', isCorrect: false },
            { id: 'd', text: 'One equation is longer than the other', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'The solution must satisfy both equations at once, which is why we check it in each one.',
        },
        {
          questionText: 'In the solution (4, 7), which value is x?',
          questionType: 'fill_blank',
          correctAnswer: '4',
          points: 1,
          explanation: 'A solution is always written as (x value, y value), so in (4, 7) we have x = 4 and y = 7.',
        },
      ],
    },
    assignment: {
      title: 'Day 4 Assignment — Understanding Simultaneous Equations',
      description: 'Form the pair of equations for each word problem before you solve anything.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'subjective',
      questions: [
        { id: 'a1', type: 'subjective', title: 'Two numbers add to 15 and one is 3 more than the other. Write the two equations, then find both numbers.', marks: 6 },
        { id: 'a2', type: 'subjective', title: 'Two numbers add to 18 and one is 4 more than the other. Write the two equations, then find both numbers.', marks: 6 },
        { id: 'a3', type: 'theory', title: 'The solution of a pair of equations is written as (x, y). Explain what the two numbers represent, and why the order matters.', marks: 3 },
      ],
    },
  },
  'Day 4 — Elimination Method': {
    quiz: {
      title: 'Day 4 — Check: Elimination Method',
      description: 'Three quick questions on eliminating a letter.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Solve x + y = 5 and x - y = 1. What is x?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 2', isCorrect: false },
            { id: 'b', text: 'x = 3', isCorrect: true },
            { id: 'c', text: 'x = 4', isCorrect: false },
            { id: 'd', text: 'x = 5', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Adding the equations cancels the y terms: 2x = 6, so x = 3. Then y = 2, giving the solution (3, 2).',
        },
        {
          questionText: 'When the coefficients of one letter are equal in size but opposite in sign, what should you do?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'Multiply both equations by the same number', isCorrect: false },
            { id: 'b', text: 'Add or subtract the equations to remove that letter', isCorrect: true },
            { id: 'c', text: 'Divide both equations by the letters', isCorrect: false },
            { id: 'd', text: 'Guess the values and test them', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Adding or subtracting cancels that letter, because +y and -y give 0y, leaving one equation in a single unknown.',
        },
        {
          questionText: 'Solve 2x + y = 7 and x - y = 2. Which solution is correct?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 3 and y = 1', isCorrect: true },
            { id: 'b', text: 'x = 2 and y = 3', isCorrect: false },
            { id: 'c', text: 'x = 1 and y = 5', isCorrect: false },
            { id: 'd', text: 'x = 5 and y = 3', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Adding gives 3x = 9, so x = 3. Substituting: 2(3) + y = 7, so y = 1. Check: 6 + 1 = 7 and 3 - 1 = 2.',
        },
      ],
    },
    assignment: {
      title: 'Day 4 Assignment — Elimination Method',
      description: 'Multiply an equation first whenever the coefficients do not cancel. Check both equations before you stop.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve by elimination, showing which equations you added or subtracted: (i) x + y = 9 and x - y = 1, (ii) 3x + y = 14 and x - y = 2.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Solve 2x + 3y = 12 and x - y = 1. (Hint: multiply the second equation by 3 first.)', marks: 6 },
        { id: 'a3', type: 'theory', title: 'Explain in one sentence why a single equation such as 2x + y = 10 cannot be solved for both x and y.', marks: 3 },
      ],
    },
  },
  'Day 4 — Substitution Method': {
    quiz: {
      title: 'Day 4 — Check: Substitution Method',
      description: 'Three quick questions on replacing a letter using one equation.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'From the equation x - y = 1, which expression gives y in terms of x?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'y = x - 1', isCorrect: true },
            { id: 'b', text: 'y = 1 - x', isCorrect: false },
            { id: 'c', text: 'y = x + 1', isCorrect: false },
            { id: 'd', text: 'y = -x - 1', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Rearranging x - y = 1 gives x - 1 = y, so y = x - 1.',
        },
        {
          questionText: 'Solve 3x + y = 11 and x - y = 1. What is the value of x?',
          questionType: 'fill_blank',
          correctAnswer: '3',
          points: 1,
          explanation: 'From x - y = 1 we get y = x - 1. Substituting: 3x + (x - 1) = 11, so 4x = 12 and x = 3.',
        },
        {
          questionText: 'When is substitution usually the quicker method?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'When one equation is already arranged to give a letter on its own', isCorrect: true },
            { id: 'b', text: 'When the coefficients of a letter are equal', isCorrect: false },
            { id: 'c', text: 'When both equations are identical', isCorrect: false },
            { id: 'd', text: 'When there are three unknowns', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'If a letter is already isolated you can replace it directly. Otherwise elimination is usually quicker.',
        },
      ],
    },
    assignment: {
      title: 'Day 4 Assignment — Substitution Method',
      description: 'Show the rearrangement step, then the substitution, then substitute back to find the second letter.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve by substitution: (i) y = x + 1 and x + y = 9, (ii) 2x + y = 5 and y = x - 1.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Solve 2x + 5y = 4 and x - 3y = -1. Give your answer as a pair in the form (x, y).', marks: 6 },
        { id: 'a3', type: 'theory', title: 'In one sentence, explain why you must check your solution in both equations.', marks: 3 },
      ],
    },
  },
  'Day 4 — Practice and Quiz': {
    assignment: {
      title: 'Day 4 Assignment — Simultaneous Equations Practice',
      description: 'Say whether you used elimination or substitution for each part, and check every answer.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve by elimination: x + y = 5 with x - y = 1.', marks: 4 },
        { id: 'a2', type: 'theory', title: 'Solve 2x + y = 7 with x - y = 2.', marks: 4 },
        { id: 'a3', type: 'subjective', title: 'Two numbers add to 15 and one is 3 more than the other. Find both numbers, showing the equations you formed and checking your answer.', marks: 7 },
      ],
    },
  },
}
