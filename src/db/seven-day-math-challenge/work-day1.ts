import type { ChallengeLessonWork } from './types'

// Day 1 graded work. Answers verified: 3x+5 variable is x; 4x^2-9x+2 has 3
// terms; "five more than twice n" = 2n + 5; 7p+3p = 10p; 10a-3a+2a = 9a;
// 2x+5=13 -> 4; 3a-2=10 -> 4; 4x=28 -> 7. Assignment arithmetic re-checked:
// 5x+3=23 -> x=4; 7y-6=22 -> y=4; 3x+4=19 -> x=5; 2(3x+4)-(2x+1) = 4x+7.
export const WORK_DAY1: Record<string, ChallengeLessonWork> = {
  'Day 1 — Variables, Constants and Terms': {
    quiz: {
      title: 'Day 1 — Check: Variables, Constants and Terms',
      description: 'Three quick questions on variables, constants and terms.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'In the expression 3x + 5, which part is the variable?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '3', isCorrect: false },
            { id: 'b', text: 'x', isCorrect: true },
            { id: 'c', text: '5', isCorrect: false },
            { id: 'd', text: 'Both 3 and 5', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'A variable is a letter standing for a number we do not know yet. The numbers 3 and 5 are constants.',
        },
        {
          questionText: 'How many terms are in 4x^2 - 9x + 2?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'Two', isCorrect: false },
            { id: 'b', text: 'Three', isCorrect: true },
            { id: 'c', text: 'Four', isCorrect: false },
            { id: 'd', text: 'Five', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Split at the + and - signs: 4x^2, -9x and 2. That is three terms.',
        },
        {
          questionText: 'Write the expression for "five more than twice a number n". (For example: 2n + 5)',
          questionType: 'fill_blank',
          correctAnswer: '2n + 5',
          points: 1,
          explanation: '"Twice n" is 2n, and "five more than" means add 5, giving 2n + 5.',
        },
      ],
    },
    assignment: {
      title: 'Day 1 Assignment — Variables, Constants and Terms',
      description: 'Show your working. A good answer names each part clearly and splits expressions at the + and - signs.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'In 8a^2 - 3b + 12, state which parts are variables and which are constants, then state how many terms there are.', marks: 5 },
        { id: 'a2', type: 'theory', title: 'Write an algebraic expression for each of these: (i) the sum of a number n and 7, (ii) three times a number m, (iii) half of a number p.', marks: 5 },
        { id: 'a3', type: 'theory', title: 'A student scores x, y and z in three subjects. Write an expression for the total of the three scores.', marks: 5 },
      ],
    },
  },
  'Day 1 — Like Terms and Simplifying Expressions': {
    quiz: {
      title: 'Day 1 — Check: Like Terms and Simplifying',
      description: 'Three quick questions on like terms and collecting them.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Simplify 7p + 3p.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '10p', isCorrect: true },
            { id: 'b', text: '21p', isCorrect: false },
            { id: 'c', text: '10', isCorrect: false },
            { id: 'd', text: 'p^10', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: '7p and 3p are like terms, so add the coefficients: 7 + 3 = 10, giving 10p.',
        },
        {
          questionText: 'Simplify 10a - 3a + 2a.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '9a', isCorrect: true },
            { id: 'b', text: '5a', isCorrect: false },
            { id: 'c', text: '15a', isCorrect: false },
            { id: 'd', text: '9', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'All three are like terms: 10 - 3 + 2 = 9, so the answer is 9a.',
        },
        {
          questionText: 'Are 3x^2 and 3x like terms?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'Yes, because the numbers are both 3', isCorrect: false },
            { id: 'b', text: 'No, because x^2 and x are different letter parts', isCorrect: true },
            { id: 'c', text: 'Yes, because they both contain x', isCorrect: false },
            { id: 'd', text: 'No, because the numbers are equal', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Like terms must have exactly the same letter part. x^2 and x are different, so 3x^2 and 3x are not like terms.',
        },
      ],
    },
    assignment: {
      title: 'Day 1 Assignment — Like Terms and Simplifying Expressions',
      description: 'Show each step. Remember that only like terms can be combined.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Simplify each expression: (i) 6x + 4x, (ii) 9y - 2y, (iii) 4a + 7 - 3a.', marks: 5 },
        { id: 'a2', type: 'theory', title: 'State whether each pair is like terms or not, giving a reason: (i) 3x and 5x, (ii) 4a^2 and 2a, (iii) 7 and 12, (iv) 2ab and 5b.', marks: 4 },
        { id: 'a3', type: 'theory', title: 'Expand 2(3x + 4), then simplify 2(3x + 4) - (2x + 1).', marks: 6 },
      ],
    },
  },
  'Day 1 — Simple Linear Equations': {
    quiz: {
      title: 'Day 1 — Check: Simple Linear Equations',
      description: 'Three quick questions on solving linear equations.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Solve 2x + 5 = 13. What is x?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 4', isCorrect: true },
            { id: 'b', text: 'x = 9', isCorrect: false },
            { id: 'c', text: 'x = 3', isCorrect: false },
            { id: 'd', text: 'x = 2', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4. Check: 2(4) + 5 = 13.',
        },
        {
          questionText: 'Solve 3a - 2 = 10. Enter the value of a only.',
          questionType: 'fill_blank',
          correctAnswer: '4',
          points: 1,
          explanation: 'Add 2 to both sides: 3a = 12. Divide by 3: a = 4. Check: 3(4) - 2 = 10.',
        },
        {
          questionText: 'Solve 4x = 28. What is x?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 7', isCorrect: true },
            { id: 'b', text: 'x = 14', isCorrect: false },
            { id: 'c', text: 'x = 4', isCorrect: false },
            { id: 'd', text: 'x = 24', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Divide both sides by 4: x = 28/4 = 7. Check: 4(7) = 28.',
        },
      ],
    },
    assignment: {
      title: 'Day 1 Assignment — Simple Linear Equations',
      description: 'Solve each equation and check your answer by substituting it back into the original equation.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve 5x + 3 = 23, and check your answer.', marks: 5 },
        { id: 'a2', type: 'theory', title: 'Solve 7y - 6 = 22, and check your answer.', marks: 5 },
        { id: 'a3', type: 'theory', title: 'Three times a number plus 4 equals 19. Write the equation, then solve for the number.', marks: 5 },
      ],
    },
  },
  // The practice lesson keeps its own larger 5-question day quiz; it only needs
  // an assignment here.
  'Day 1 — Practice and Quiz': {
    assignment: {
      title: 'Day 1 Assignment — Algebra Basics Practice',
      description: 'Bring your Day 1 quiz corrections with you. Show the method you used for every part.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'State how many terms there are in 4x^2 - 9x + 2, and say why they cannot be combined further.', marks: 4 },
        { id: 'a2', type: 'theory', title: 'Solve both equations: (i) 2x + 5 = 13, (ii) 3a - 2 = 10.', marks: 6 },
        { id: 'a3', type: 'subjective', title: 'Two numbers add to 24 and one is twice the other. Find both numbers, showing the equation you formed and checking your answer.', marks: 5 },
      ],
    },
  },
}
