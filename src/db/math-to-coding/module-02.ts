import type { M2cModuleData } from './types'

// Module 2 — Logic & Boolean Algebra
// Module objectives: reason with true/false logic and translate it directly into code conditionals.

export const module02: M2cModuleData = {
  title: 'Module 2 — Logic & Boolean Algebra',
  lessons: [
    {
      title: 'Propositions, Truth Values & Truth Tables',
      duration: 30,
      content: `## Learning Objectives\n- Identify propositions and their truth values.\n- Construct truth tables for basic operators.\n\n## Propositions\nA **proposition** is a statement that is either true or false.\n\n## Truth Tables\nA truth table lists every possible truth value. For n variables, there are 2^n rows.\n\n## Key Takeaways\n- Propositions have definite truth values: True or False.`,
      quiz: {
        title: 'Quiz 2.1 — Propositions, Truth Values & Truth Tables',
        description: 'Three questions on propositions and truth values.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What are the only two truth values in classical logic?', questionType: 'fill_blank', correctAnswer: 'True and False' },
          { questionText: 'How many rows does a truth table need for 3 variables?', questionType: 'fill_blank', correctAnswer: '8' },
          { questionText: '"Is today Monday?" is a proposition.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Logical Operators: AND, OR, NOT, XOR',
      duration: 35,
      content: `## Learning Objectives\n- Apply AND, OR, NOT, XOR operators.\n\n## The Four Basic Operators\n- **AND (&&):** true only when BOTH operands are true.\n- **OR (||):** true when AT LEAST ONE operand is true.\n- **NOT (!):** flips the truth value.\n- **XOR (^):** true when EXACTLY ONE operand is true.\n\n## Key Takeaways\n- XOR returns false when both inputs are the same.`,
      quiz: {
        title: 'Quiz 2.2 — Logical Operators',
        description: 'Three questions on AND, OR, NOT, XOR.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'True AND False evaluates to', questionType: 'fill_blank', correctAnswer: 'false' },
          { questionText: 'True OR False evaluates to', questionType: 'fill_blank', correctAnswer: 'true' },
          { questionText: 'What does XOR return when both inputs are the same?', questionType: 'fill_blank', correctAnswer: 'false' },
        ],
      },
    },
    {
      title: "De Morgan's Laws & Simplifying Expressions",
      duration: 40,
      content: `## Learning Objectives\n- Apply De Morgan's Laws.\n\n## De Morgan\'s Laws\n1. NOT(A AND B) = NOT A OR NOT B\n2. NOT(A OR B) = NOT A AND NOT B\n\n## Key Takeaways\nThese laws simplify complex conditional logic in code.`,
      quiz: {
        title: "Quiz 2.3 — De Morgan's Laws",
        description: 'Three questions on De Morgan Laws.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Simplify: !(a && b)', questionType: 'fill_blank', correctAnswer: '!a || !b' },
          { questionText: 'Simplify: !(x || y)', questionType: 'fill_blank', correctAnswer: '!x && !y' },
          { questionText: "De Morgan's Laws help simplify nested conditional logic.", questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Conditional Statements (if/else)',
      duration: 40,
      content: `## Learning Objectives\n- Translate boolean logic into if/else chains.\n- Use guard clauses for early returns.\n\n## Decision Trees\nAn if statement evaluates a boolean expression.\n\n## Guard Clauses\nA guard clause is an early return handling edge cases at the top of a function.\n\n## Key Takeaways\n- else if chains stop at the first true condition.`,
      quiz: {
        title: 'Quiz 2.4 — Conditional Statements',
        description: 'Three questions on if/else and guard clauses.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What runs if an if condition is false and there is an else?', questionType: 'fill_blank', correctAnswer: 'The else block' },
          { questionText: 'What is a "guard clause"?', questionType: 'fill_blank', correctAnswer: 'An early return for edge-case conditions' },
          { questionText: 'else if chains stop at the first true condition.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Logical Equivalence & Short-Circuit Evaluation',
      duration: 35,
      content: `## Learning Objectives\n- Recognize logically equivalent expressions.\n- Use short-circuit evaluation.\n\n## Short-Circuit Evaluation\n- In A && B: if A is false, B is never evaluated.\n- In A || B: if A is true, B is never evaluated.\n\n## Key Takeaways\nShort-circuit can prevent errors (e.g., accessing a null object).`,
      quiz: {
        title: 'Quiz 2.5 — Logical Equivalence & Short-Circuit',
        description: 'Three questions on equivalence and short-circuiting.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'In (a && b), if a is false, is b evaluated?', questionType: 'fill_blank', correctAnswer: 'No' },
          { questionText: 'In (a || b), if a is true, is b evaluated?', questionType: 'fill_blank', correctAnswer: 'No' },
          { questionText: 'Short-circuit can prevent evaluating code that would fail.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 2 Assignment — Decision Engine',
    description: 'Build a rules engine driven by boolean logic, with at least 4 combined conditions, a truth table, and a De Morgan simplified expression.',
    dueDate: '2026-11-01T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm2a1', type: 'theory', title: 'Write the truth table for p AND q.', marks: 5 },
      { id: 'm2a2', type: 'theory', title: 'Simplify !(isAdmin || isEditor) using De Morgan Law.', marks: 5 },
      { id: 'm2a3', type: 'subjective', title: 'Convert access rule into boolean expression.', marks: 5 },
      { id: 'm2a4', type: 'file', title: 'Submit your Decision Engine implementation.', marks: 5 },
    ],
  },
}
