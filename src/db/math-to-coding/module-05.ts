import type { M2cModuleData } from './types'

// Module 5 — Algorithms & Pseudocode
// Module objectives: read, write, and implement algorithms starting from plain-language descriptions.

export const module05: M2cModuleData = {
  title: 'Module 5 — Algorithms & Pseudocode',
  lessons: [
    {
      title: 'What Is an Algorithm? Properties of Good Algorithms',
      duration: 30,
      content: `## Learning Objectives\n- Define an algorithm and list its required properties.\n- Distinguish good algorithms from poor ones.\n\n## What Is an Algorithm?\nAn algorithm is a finite, step-by-step procedure that takes input(s) and produces output(s) to solve a task.\n\n## Required Properties\n- **Finiteness:** terminates after a finite number of steps.\n- **Definiteness:** each step is precisely defined.\n- **Effectiveness:** each step is doable.\n- **Input/Output:** accepts zero or more inputs, produces at least one output.\n\n## Key Takeaways\n- An algorithm must terminate.\n- It must have at least one output.\n- A non-terminating procedure is not a valid algorithm.`,
      quiz: {
        title: 'Quiz 5.1 — What Is an Algorithm?',
        description: 'Three questions on algorithm properties.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Name one required property of a valid algorithm.', questionType: 'fill_blank', correctAnswer: 'Finiteness' },
          { questionText: 'An algorithm that runs forever is valid.', questionType: 'true_false', correctAnswer: 'false' },
          { questionText: 'Every algorithm has at least one output.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Writing & Reading Pseudocode / Flowcharts',
      duration: 35,
      content: `## Learning Objectives\n- Write pseudocode using standard conventions.\n- Read and produce flowcharts.\n\n## Pseudocode Conventions\n- INPUT/OUTPUT for I/O.\n- IF/ELSE IF/ELSE for decisions.\n- WHILE/FOR for loops.\n- Comments start with //\n\n## Flowchart Symbols\n- Oval: start/end.\n- Parallelogram: input/output.\n- Rectangle: process/assignment.\n- Diamond: decision/branch.\n\n## Key Takeaways\n- Pseudocode focuses on logic, not syntax.\n- Diamond shape represents a decision in flowcharts.`,
      quiz: {
        title: 'Quiz 5.2 — Pseudocode & Flowcharts',
        description: 'Three questions on pseudocode conventions.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What flowchart shape represents a decision?', questionType: 'fill_blank', correctAnswer: 'Diamond' },
          { questionText: 'Why use pseudocode instead of jumping to real code?', questionType: 'fill_blank', correctAnswer: 'It lets you focus on logic without syntax distractions' },
          { questionText: 'Pseudocode must follow a specific programming language exact syntax.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
    {
      title: 'Searching Algorithms: Linear & Binary Search',
      duration: 40,
      content: `## Learning Objectives\n- Implement linear and binary search.\n- Know when each is appropriate.\n\n## Linear Search\nCheck each element in order. Works on any array. O(n) worst case.\n\n## Binary Search\nRepeatedly halve the search space. Requires **sorted** data. O(log n) worst case.\n\n## Key Takeaways\n- Data must be sorted before binary search.\n- Linear search worst case = n comparisons.\n- Binary search eliminates half of remaining elements each step.`,
      quiz: {
        title: 'Quiz 5.3 — Searching Algorithms',
        description: 'Three questions on linear and binary search.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What must be true of a list before binary search can be used?', questionType: 'fill_blank', correctAnswer: 'It must be sorted' },
          { questionText: 'Worst-case comparisons for linear search on n items?', questionType: 'fill_blank', correctAnswer: 'n' },
          { questionText: 'Binary search eliminates half of remaining elements each step.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Sorting Algorithms I: Bubble, Selection, Insertion',
      duration: 40,
      content: `## Learning Objectives\n- Describe bubble, selection, and insertion sort.\n- Trace each algorithm step by step.\n\n## Bubble Sort\nRepeatedly swap adjacent out-of-order elements.\n\n## Selection Sort\nRepeatedly select the minimum remaining element.\n\n## Insertion Sort\nBuild a sorted section one element at a time.\n\n## Key Takeaways\n- Bubble sort swaps adjacent elements.\n- Insertion sort builds the sorted array one item at a time.`,
      quiz: {
        title: 'Quiz 5.4 — Sorting Algorithms',
        description: 'Three questions on basic sorting algorithms.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Which sort repeatedly swaps adjacent out-of-order elements?', questionType: 'fill_blank', correctAnswer: 'Bubble sort' },
          { questionText: 'Which sort builds the sorted portion of the array one element at a time?', questionType: 'fill_blank', correctAnswer: 'Insertion sort' },
          { questionText: 'Selection sort finds the minimum remaining element on each pass.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Translating Pseudocode to Real Code',
      duration: 35,
      content: `## Learning Objectives\n- Map pseudocode constructs to JavaScript/Python syntax.\n- Handle common translation pitfalls.\n\n## Translation Pitfalls\n- **0-indexing:** most languages start arrays at index 0, but pseudocode descriptions often say "1st."\n- **Variable declaration:** pseudocode omits type declarations; real code requires \`let\`/\`const\` (JS) or just assignment (Python).\n\n## Key Takeaways\n- Arrays in most modern languages use 0-based indexing.\n- Pseudocode-to-code must preserve the original algorithm logic exactly.`,
      quiz: {
        title: 'Quiz 5.5 — Translating Pseudocode',
        description: 'Three questions on pseudocode-to-code translation.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Most modern languages use what indexing convention?', questionType: 'fill_blank', correctAnswer: '0-based' },
          { questionText: 'Pseudocode may not translate 1:1 due to different syntax.', questionType: 'fill_blank', correctAnswer: 'true' },
          { questionText: 'Pseudocode-to-code translation should preserve the original algorithm logic exactly.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 5 Assignment — Search Showdown',
    description: 'Implement both linear search and binary search on the same sorted dataset. Measure and report comparisons for at least 3 target values (including a not-found case).',
    dueDate: '2026-11-22T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm5a1', type: 'theory', title: 'Trace binary search for target=7 in [1,3,5,7,9,11].', marks: 5 },
      { id: 'm5a2', type: 'theory', title: 'Worst-case comparisons for linear search on n items?', marks: 5 },
      { id: 'm5a3', type: 'theory', title: 'Why must data be sorted before binary search?', marks: 5 },
      { id: 'm5a4', type: 'file', title: 'Submit your search implementations with test cases.', marks: 5 },
    ],
  },
}
