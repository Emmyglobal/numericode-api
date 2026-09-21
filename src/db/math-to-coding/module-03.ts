import type { M2cModuleData } from './types'

// Module 3 — Sets, Functions & Relations
// Module objectives: model collections of data with sets and reason about mappings with functions.

export const module03: M2cModuleData = {
  title: 'Module 3 — Sets, Functions & Relations',
  lessons: [
    {
      title: 'Set Notation & Operations',
      duration: 30,
      content: `## Learning Objectives\n- Use set-builder notation.\n- Perform union, intersection, and difference.\n\n## Set Operations\n- **Union (A ∪ B):** all elements in A or B.\n- **Intersection (A ∩ B):** elements in both A and B.\n- **Difference (A − B):** elements in A but not in B.\n\n## Key Takeaways\n- A={1,2}, B={2,3}: A ∪ B = {1,2,3}; A ∩ B = {2}.\n- Sets contain no duplicate elements.`,
      quiz: {
        title: 'Quiz 3.1 — Set Notation & Operations',
        description: 'Three questions on sets and operations.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'A ∪ B for A={1,2}, B={2,3}?', questionType: 'fill_blank', correctAnswer: '{1,2,3}' },
          { questionText: 'A ∩ B for A={1,2}, B={2,3}?', questionType: 'fill_blank', correctAnswer: '{2}' },
          { questionText: 'A set can contain duplicate elements.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
    {
      title: 'Sets in Code: Arrays vs Sets vs Maps',
      duration: 35,
      content: `## Learning Objectives\n- Choose the right data structure for unique/unordered data.\n\n## Array vs Set vs Map\n- **Array:** ordered, allows duplicates.\n- **Set:** unique elements, unordered.\n- **Map/Dictionary:** key-value pairs.\n\n## Key Takeaways\n- Use Set to remove duplicates.\n- Use Map to associate keys with values.\n- Arrays preserve insertion order.`,
      quiz: {
        title: 'Quiz 3.2 — Sets in Code',
        description: 'Three questions on arrays, sets, and maps.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Which structure automatically removes duplicates?', questionType: 'fill_blank', correctAnswer: 'Set' },
          { questionText: 'Which structure maps keys to values?', questionType: 'fill_blank', correctAnswer: 'Map' },
          { questionText: 'Arrays preserve insertion order.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Functions: Domain, Range & Mapping',
      duration: 40,
      content: `## Learning Objectives\n- Identify domain and range of a function.\n- Distinguish pure functions from impure ones.\n\n## Functions\nA **function** maps every input (domain) to exactly one output (range).\n\n## Pure Functions\nA pure function: (1) output depends only on input, (2) no side effects.\n\n## Key Takeaways\n- One input cannot map to two different outputs in a true function.\n- The domain is the set of valid inputs.`,
      quiz: {
        title: 'Quiz 3.3 — Functions: Domain, Range & Mapping',
        description: 'Three questions on functions.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Can one input map to two different outputs in a true function?', questionType: 'true_false', correctAnswer: 'false' },
          { questionText: 'What is the domain of a function?', questionType: 'fill_blank', correctAnswer: 'The set of valid inputs' },
          { questionText: 'A pure function has no side effects and depends only on input.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Relations & Equivalence',
      duration: 35,
      content: `## Learning Objectives\n- Identify reflexive, symmetric, and transitive properties.\n- Recognize equivalence relations and classes.\n\n## Relation Properties\n- **Reflexive:** every element relates to itself.\n- **Symmetric:** if a relates to b, then b relates to a.\n- **Transitive:** if a→b and b→c, then a→c.\n\n## Equivalence Relations\nA relation is an **equivalence relation** if it is reflexive, symmetric, and transitive.\n\n## Key Takeaways\n- "is equal to" (=) is an equivalence relation.\n- Not every relation is a function.`,
      quiz: {
        title: 'Quiz 3.4 — Relations & Equivalence',
        description: 'Three questions on relations and equivalence.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What are the three properties of an equivalence relation?', questionType: 'fill_blank', correctAnswer: 'Reflexive, symmetric, transitive' },
          { questionText: 'Is "is equal to" an equivalence relation?', questionType: 'fill_blank', correctAnswer: 'Yes' },
          { questionText: 'Every relation is a function.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
    {
      title: 'Functions as First-Class Citizens in Code',
      duration: 40,
      content: `## Learning Objectives\n- Pass functions as arguments.\n- Return functions from other functions.\n- Apply map/filter/reduce as function composition.\n\n## First-Class Functions\nIn JavaScript and Python, functions can be stored in variables, passed as arguments, and returned from other functions.\n\n## map/filter/reduce\n- **map(fn, list):** applies fn to every element.\n- **filter(fn, list):** keeps elements where fn returns true.\n- **reduce(fn, acc, list):** accumulates a single value.\n\n## Key Takeaways\n- map transforms every element.\n- Function composition combines two functions: f(g(x)).`,
      quiz: {
        title: 'Quiz 3.5 — Functions as First-Class Citizens',
        description: 'Three questions on map/filter/reduce and composition.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What does map() do to a collection?', questionType: 'fill_blank', correctAnswer: 'Applies a function to every element' },
          { questionText: 'What is function composition?', questionType: 'fill_blank', correctAnswer: 'Combining functions so output of one becomes input of the next' },
          { questionText: 'In JavaScript/Python, functions can be stored in variables.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 3 Assignment — Set-Ops Utility Library',
    description: 'Build a utility library implementing union, intersection, difference, and a compose() helper for chaining two functions.',
    dueDate: '2026-11-08T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm3a1', type: 'theory', title: 'Find A ∪ B and A ∩ B for A={2,4,6}, B={4,6,8}.', marks: 5 },
      { id: 'm3a2', type: 'theory', title: 'Is "is taller than" reflexive?', marks: 5 },
      { id: 'm3a3', type: 'subjective', title: 'For f(x)=x², what is the range when domain is {-2,-1,0,1,2}?', marks: 5 },
      { id: 'm3a4', type: 'file', title: 'Submit your Set-Ops library with union/intersection/difference/compose.', marks: 5 },
    ],
  },
}
