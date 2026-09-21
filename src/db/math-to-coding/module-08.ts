import type { M2cModuleData } from './types'

// Module 8 — Recursion & Mathematical Induction
// Module objectives: solve problems recursively and prove correctness using induction.

export const module08: M2cModuleData = {
  title: 'Module 8 — Recursion & Mathematical Induction',
  lessons: [
    {
      title: 'Recursive Thinking: Base Case & Recursive Case',
      duration: 30,
      content: `## Learning Objectives\n- Identify base and recursive cases.\n- Understand call stack intuition.\n\n## Recursion\nA recursive function calls itself. Every recursive function needs:\n- **Base case:** the stopping condition.\n- **Recursive case:** calls itself on a smaller subproblem.\n\n## Call Stack\nEach recursive call creates a new stack frame with its own local variables.\n\n## Key Takeaways\n- Without a base case, recursion is infinite (stack overflow).
- Every recursive function can theoretically be rewritten iteratively.`,
      quiz: {
        title: 'Quiz 8.1 — Recursive Thinking',
        description: 'Three questions on base and recursive cases.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What happens if a recursive function has no base case?', questionType: 'fill_blank', correctAnswer: 'Infinite recursion or stack overflow' },
          { questionText: 'The recursive case calls the function on a smaller subproblem.', questionType: 'true_false', correctAnswer: 'true' },
          { questionText: 'Every recursive function could theoretically be rewritten iteratively.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Recursion vs Iteration: Trade-offs',
      duration: 35,
      content: `## Learning Objectives\n- Compare recursion and iteration.\n- Understand when each is appropriate.\n\n## Recursion vs Iteration\n- **Recursion:** elegant for tree/graph/divide-and-conquer; risk of stack overflow; extra memory for call stack.\n- **Iteration:** often more memory-efficient; preferred for simple counting loops.\n\n## Key Takeaways\n- Deep recursion risks stack overflow.
- Iteration is often more memory-efficient for simple loops.`,
      quiz: {
        title: 'Quiz 8.2 — Recursion vs Iteration',
        description: 'Three questions on recursion and iteration trade-offs.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Risk of very deep recursion?', questionType: 'fill_blank', correctAnswer: 'Stack overflow' },
          { questionText: 'Which is more memory-efficient for simple counting loops?', questionType: 'fill_blank', correctAnswer: 'Iteration' },
          { questionText: 'Recursion is always slower than iteration.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
    {
      title: 'Mathematical Induction: Proving Correctness',
      duration: 40,
      content: `## Learning Objectives\n- Execute a proof by induction.\n- Apply the base case and inductive step.\n\n## Proof by Induction\n1. **Base case:** prove the statement for the smallest value (usually n=0 or n=1).
2. **Inductive step:** assume the statement holds for some value k (inductive hypothesis), then prove it holds for k+1.\n\n## Key Takeaways\n- The inductive hypothesis assumes truth for k.
- Induction can prove statements for all natural numbers from a base case.`,
      quiz: {
        title: 'Quiz 8.3 — Mathematical Induction',
        description: 'Three questions on induction proofs.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What are the two steps of a proof by induction?', questionType: 'fill_blank', correctAnswer: 'Base case and inductive step' },
          { questionText: 'What do you assume in the inductive step?', questionType: 'fill_blank', correctAnswer: 'The statement holds for some value k' },
          { questionText: 'Induction can prove a statement true for all natural numbers from a base case.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Classic Recursive Problems: Factorial, Fibonacci, Towers of Hanoi',
      duration: 40,
      content: `## Learning Objectives\n- Implement factorial and Fibonacci recursively.\n- Understand Towers of Hanoi.\n\n## Factorial
factorial(n) = n * factorial(n-1), with base case factorial(0) = 1.
\n## Fibonacci
fib(n) = fib(n-1) + fib(n-2), with base cases fib(0)=0, fib(1)=1.
Naive recursive Fibonacci is inefficient due to overlapping subproblems.
\n## Towers of Hanoi
Move n disks from source to target using an auxiliary peg. Requires moving n-1 disks twice recursively.
\n## Key Takeaways\n- Base case for factorial(0) = 1.
- Naive recursive Fibonacci recomputes subproblems.`,
      quiz: {
        title: 'Quiz 8.4 — Classic Recursive Problems',
        description: 'Three questions on classic recursive algorithms.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Base case for factorial(n)?', questionType: 'fill_blank', correctAnswer: 'factorial(0) = 1' },
          { questionText: 'Why is naive recursive Fibonacci inefficient?', questionType: 'fill_blank', correctAnswer: 'Recomputes the same subproblems' },
          { questionText: 'Towers of Hanoi with n disks requires solving two n-1 subproblems.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Recursion in Divide & Conquer Algorithms',
      duration: 35,
      content: `## Learning Objectives\n- Apply the divide, conquer, combine pattern.\n- Recognize merge sort as a divide-and-conquer algorithm.\n\n## Divide and Conquer\n1. **Divide** the problem into smaller subproblems.
2. **Conquer** the subproblems recursively.
3. **Combine** the solutions.\n\n## Merge Sort
- Divide the array into halves.
- Recursively sort each half.
- Merge the two sorted halves.\n
## Key Takeaways
- The three steps are: divide, conquer, combine.
- Merge sort is a classic divide-and-conquer algorithm.
- Binary search also follows a divide-and-conquer pattern.`,
      quiz: {
        title: 'Quiz 8.5 — Recursion in Divide & Conquer',
        description: 'Three questions on divide and conquer.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'The three steps of divide-and-conquer?', questionType: 'fill_blank', correctAnswer: 'Divide, conquer, combine' },
          { questionText: 'Which sorting algorithm is a classic divide-and-conquer example?', questionType: 'fill_blank', correctAnswer: 'Merge sort' },
          { questionText: 'Binary search follows a divide-and-conquer pattern.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 8 Assignment — Recursion & Proofs',
    description: 'Implement three recursive functions (factorial, Fibonacci, sum-of-array), and write an induction-based proof sketch for the sum-of-array function.',
    dueDate: '2026-12-13T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm8a1', type: 'theory', title: 'Trace fibonacci(5) recursion tree.', marks: 5 },
      { id: 'm8a2', type: 'theory', title: 'Convert a given recursive function to iterative.', marks: 5 },
      { id: 'm8a3', type: 'subjective', title: 'Write a short inductive proof that sum of first n odd numbers equals n^2.', marks: 5 },
      { id: 'm8a4', type: 'file', title: 'Submit three recursive function implementations.', marks: 5 },
    ],
  },
}
