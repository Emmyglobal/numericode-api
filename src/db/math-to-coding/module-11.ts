import type { M2cModuleData } from './types'

// Module 11 — Capstone Project & Final Exam
// Module objectives: integrate everything learned into one original project and pass the final exam.

export const module11: M2cModuleData = {
  title: 'Module 11 — Capstone Project & Final Exam',
  lessons: [
    {
      title: 'Capstone Project Brief & Requirements',
      duration: 60,
      content: `## Learning Objectives\n- Choose a capstone track.\n- Understand requirements and grading.\n\n## Capstone Tracks (choose one)\n- **Track A — Algorithm Visualizer:** Visualize sorting + graph traversal step by step.\n- **Track B — Number Theory Toolkit:** Base conversion, prime checking, GCD/LCM, Big-O report.\n- **Track C — Simple Recommendation Engine:** Use set operations, vectors, dot-product similarity to recommend items.\n- **Track D — Pathfinder:** Shortest-path finder over weighted grid using BFS and Dijkstra.\n\n## Requirements\n1. Uses concepts from at least 4 different modules.\n2. Includes a written Big-O analysis of core algorithm(s).\n3. Includes at least 5 automated tests or worked example cases.\n4. Includes a short README explaining the math behind the code.\n\n## Grading Rubric (100 pts)\n- Correctness: 30 pts\n- Efficiency & Big-O analysis: 20 pts\n- Use of >=4 course concepts: 20 pts\n- Code quality, tests, documentation: 20 pts\n- Presentation & peer feedback: 10 pts\n\n## Key Takeaways\n- Capstone integrates concepts from at least 4 modules.
- Projects include tests and a math README.
- Capstone is worth 15% of the final grade.`,
      quiz: {
        title: 'Quiz 11.1 — Capstone Project Brief',
        description: 'Three questions on capstone requirements and tracks.',
        timeLimit: 20,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'The capstone project requires concepts from at least how many modules?',
            questionType: 'fill_blank',
            correctAnswer: '4',
          },
          {
            questionText: 'Which track builds a pathfinder using weighted grids?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Track A — Algorithm Visualizer', isCorrect: false },
              { id: 'b', text: 'Track B — Number Theory Toolkit', isCorrect: false },
              { id: 'c', text: 'Track C — Recommendation Engine', isCorrect: false },
              { id: 'd', text: 'Track D — Pathfinder', isCorrect: true },
            ],
            correctAnswer: 'd',
          },
          {
            questionText: 'The capstone is worth 15% of the final course grade.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Project Work Session: Design & Plan',
      duration: 90,
      content: `## Learning Objectives\n- Write a 1-page design document for the capstone.\n\n## Design Document\nYour 1-page design doc should include:\n1. **Problem statement:** what problem does your project solve?\n2. **Chosen track:** which capstone track are you pursuing?\n3. **Planned algorithms/data structures:** what will you build?\n4. **Task breakdown:** a list of key steps with estimated effort.\n\n## Key Takeaways\n- A clear plan saves time during implementation.
- Identify the mathematical concepts you will apply from each module.`,
      quiz: {
        title: 'Quiz 11.2 — Design & Plan',
        description: 'Three questions on capstone planning.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'What are the four components of a capstone design document?',
            questionType: 'fill_blank',
            correctAnswer: 'Problem statement, chosen track, planned algorithms, task breakdown',
          },
          { questionText: 'You should identify which modules concepts your code uses.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
          { questionText: 'A design document is a waste of time before coding.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Project Work Session: Build & Test',
      duration: 120,
      content: `## Learning Objectives\n- Implement the capstone with working tests.\n\n## Building Your Capstone\n1. Set up your project structure (folder, files).\n2. Implement the core algorithm(s).\n3. Write at least 5 automated tests covering edge cases.\n4. Test manually with known inputs.\n\n## Key Takeaways\n- Start with a skeleton that compiles/runs before adding features.
- Tests protect you when refactoring.
- Commit your work in small, meaningful steps.`,
      quiz: {
        title: 'Quiz 11.3 — Build & Test',
        description: 'Three questions on capstone implementation.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'How many automated tests are required for the capstone?',
            questionType: 'fill_blank',
            correctAnswer: 'At least 5',
          },
          {
            questionText: 'Start with a skeleton that compiles before adding features.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
          {
            questionText: 'Commit your work in small, meaningful steps.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Peer Review & Presentation',
      duration: 90,
      content: `## Learning Objectives\n- Present a capstone walkthrough.\n- Provide constructive feedback to peers.\n\n## Peer Review\n1. Record or present a 5-10 minute walkthrough of your project.\n2. Review 2 peers' submissions using the provided rubric.\n\n## Feedback Rubric\n- Correctness (30 pts)\n- Efficiency & Big-O (20 pts)\n- Concept usage (20 pts)\n- Documentation (20 pts)\n- Presentation (10 pts)\n\n## Key Takeaways\n- A good presentation explains the math behind the code.
- Constructive feedback helps everyone improve.`,
      quiz: {
        title: 'Quiz 11.4 — Peer Review',
        description: 'Three questions on peer review and presentations.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'How long should your capstone presentation be?',
            questionType: 'fill_blank',
            correctAnswer: '5-10 minutes',
          },
          {
            questionText: 'You must review 2 peers submissions using the rubric.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
          {
            questionText: 'Peer review is optional for passing the course.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Final Exam',
      duration: 120,
      content: `## Final Exam Overview\n**Format:** 50 multiple-choice/short-answer + 3 practical coding problems.\n**Time limit:** 120 minutes.\n**Passing score:** 60% minimum.\n**Retakes:** One allowed after 48-hour cooldown.\n\n## Topics Covered\nAll 10 core modules: numbers, logic, sets, sequences, algorithms, counting/probability, vectors/matrices, recursion/induction, complexity, graphs/trees.\n\n## Key Takeaways\n- The final exam covers all core modules.\n- You need 60% on the exam and 70% overall to pass.
- One retake is allowed after 48 hours.`,
      quiz: {
        title: 'Quiz 11.5 — Final Exam Information',
        description: 'Three questions on the final exam format.',
        timeLimit: 20,
        passingScore: 70,
        maxAttempts: 99,
        questions: [
          {
            questionText: 'How many multiple-choice/short-answer questions are on the final exam?',
            questionType: 'fill_blank',
            correctAnswer: '50',
          },
          {
            questionText: 'The final exam time limit is 120 minutes.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
          {
            questionText: 'The passing score on the final exam is 60%.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Capstone Project — Mathematics to Coding Final Project',
    description: 'Capstone: Choose one of four tracks (Algorithm Visualizer, Number Theory Toolkit, Recommendation Engine, Pathfinder). Requirements: (1) Uses concepts from at least 4 different modules. (2) Includes a written Big-O analysis. (3) Includes at least 5 automated tests. (4) Includes a short README explaining the math behind the code. Grading rubric: Correctness 30 pts, Efficiency 20 pts, Concept usage 20 pts, Documentation 20 pts, Presentation 10 pts.',
    dueDate: '2027-01-10T23:59:59Z',
    totalMarks: 100,
    passingScore: 60,
    assignmentType: 'mixed',
    questions: [
      { id: 'm11a1', type: 'theory', title: 'State your chosen capstone track and justify why.', marks: 20 },
      { id: 'm11a2', type: 'subjective', title: 'List at least 4 modules whose concepts your project uses.', marks: 20 },
      { id: 'm11a3', type: 'subjective', title: 'Provide a Big-O analysis of your core algorithm(s).', marks: 20 },
      { id: 'm11a4', type: 'file', title: 'Submit your capstone code with README, tests, and analysis.', marks: 40 },
    ],
  },
}
