import type { M2cModuleData } from './types'

// Module 1 — Numbers & Computational Thinking
// Module objectives: understand how computers represent numbers and use
// different number bases confidently.

export const module01: M2cModuleData = {
  title: 'Module 1 — Numbers & Computational Thinking',
  lessons: [
    {
      title: 'What Computers Actually Do With Numbers',
      duration: 30,
      content: `## Learning Objectives\nBy the end of this lesson you should be able to:\n- Explain the relationship between bits, bytes, and data.\n- Describe how characters are stored as numbers in a computer.\n\n## Everything Is Bits\nA computer's memory is built from billions of tiny switches called **transistors**, each of which can be in one of two states: ON (**1**) or OFF (**0**). The smallest unit of data is a single switch state — a **bit**. Eight bits make a byte, which can represent 256 distinct values.\n\n## ASCII — Text as Numbers\nASCII assigns a unique number to each character: **'A'** is **65**, **'a'** is **97**.\n\n## Key Takeaways\n- A computer stores only 1s and 0s (bits).\n- A byte (8 bits) can represent 256 different values.`,
      quiz: {
        title: 'Quiz 1.1 — What Computers Actually Do With Numbers',
        description: 'Three questions on bits, bytes, and character encodings.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What is the smallest unit of data a computer stores?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A byte', isCorrect: false },
              { id: 'b', text: 'A bit', isCorrect: true },
              { id: 'c', text: 'A word', isCorrect: false },
              { id: 'd', text: 'A pixel', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'How many values can 8 bits (1 byte) represent?',
            questionType: 'fill_blank',
            correctAnswer: '256',
          },
          {
            questionText: 'Text characters are stored internally as numbers.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Place Value & Number Bases (Binary, Decimal, Hex, Octal)',
      duration: 35,
      content: `## Learning Objectives\nBy the end of this lesson you should be able to:\n- Explain how place value works in any number base.\n- Identify valid digits in binary, octal, decimal, and hexadecimal.\n\n## Positional Notation\nEach digit's position determines its value: rightmost is the "ones" place (base^0). The number 347 = 3x100 + 4x10 + 7x1.\n\n## Number Bases\n- **Binary (base-2)**: digits 0, 1\n- **Octal (base-8)**: digits 0-7\n- **Decimal (base-10)**: digits 0-9\n- **Hexadecimal (base-16)**: digits 0-9 and A-F\n\n## Why Hex Matters\nColour codes like FF0000 (bright red), memory addresses, and UUIDs commonly use hexadecimal.`,
      quiz: {
        title: 'Quiz 1.2 — Place Value & Number Bases',
        description: 'Three questions on positional notation and base digits.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'In decimal, what does the digit "3" in "347" represent?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '3 ones', isCorrect: false },
              { id: 'b', text: '3 tens', isCorrect: false },
              { id: 'c', text: '3 hundreds', isCorrect: true },
              { id: 'd', text: '3 thousands', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'What base is hexadecimal?',
            questionType: 'fill_blank',
            correctAnswer: '16',
          },
          {
            questionText: 'What are the valid digits in binary?',
            questionType: 'fill_blank',
            correctAnswer: '0 and 1',
          },
        ],
      },
    },
    {
      title: 'Converting Between Bases',
      duration: 40,
      content: `## Learning Objectives\nBy the end of this lesson you should be able to:\n- Convert binary numbers to decimal and vice versa.\n- Convert between binary, octal, and hexadecimal.\n\n## Converting Binary to Decimal\nEach bit position corresponds to a power of 2. Binary 1011 -> 1x2^3 + 0x2^2 + 1x2^1 + 1x2^0 = 8+0+2+1 = **11**.\n\n## Converting Decimal to Binary\nRepeated division by 2: 25/2 = 12 r1, 12/2 = 6 r0, 6/2 = 3 r0, 3/2 = 1 r1, 1/2 = 0 r1. Read remainders upward: **11001**.\n\n## Fast Conversions\nGroup binary into chunks of 3 (octal) or 4 (hex) from the right to speed up conversions.`,
      quiz: {
        title: 'Quiz 1.3 — Converting Between Bases',
        description: 'Three questions on base conversions.',
        timeLimit: 15,
        passingScore: 65,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Convert binary 1011 to decimal.',
            questionType: 'fill_blank',
            correctAnswer: '11',
          },
          {
            questionText: 'Convert decimal 25 to binary.',
            questionType: 'fill_blank',
            correctAnswer: '11001',
          },
          {
            questionText: 'Convert hex 1F to decimal.',
            questionType: 'fill_blank',
            correctAnswer: '31',
          },
        ],
      },
    },
    {
      title: 'Integers, Floats & Precision in Code',
      duration: 35,
      content: `## Learning Objectives\n- Distinguish between integer and floating-point numbers.\n- Recognize why 0.1 + 0.2 != 0.3 exactly.\n- Explain overflow and precision limits.\n\n## Integer vs Floating-Point\n**Integers** are whole numbers (e.g., 1, 42, -7). **Floats** have a fractional part (e.g., 3.14).\n\n## Why 0.1 + 0.2 != 0.3\nTry 0.1 + 0.2 in JavaScript -> 0.30000000000000004. This is IEEE 754: just as 1/3 can't be finite in decimal, 0.1 can't be exact in binary.\n\n## Overflow and Limits\nWhen a number exceeds its type's maximum, **overflow** occurs. Number.MAX_SAFE_INTEGER = 9007199254740991; beyond it, integers start skipping.`,
      quiz: {
        title: 'Quiz 1.4 — Integers, Floats & Precision',
        description: 'Three questions on numeric types and floating-point representation.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Why does 0.1 + 0.2 not print exactly 0.3 in many languages?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'It is a bug in the compiler.', isCorrect: false },
              { id: 'b', text: 'Floating-point representation cannot store all decimals exactly.', isCorrect: true },
              { id: 'c', text: 'Addition is broken in those languages.', isCorrect: false },
              { id: 'd', text: '0.1 and 0.2 are too large to compute.', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'Which data type would you use to store a person\'s exact age in years?',
            questionType: 'fill_blank',
            correctAnswer: 'integer',
          },
          {
            questionText: 'All programming languages handle very large integers identically.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Arithmetic Operators & Order of Operations in Programming',
      duration: 40,
      content: `## Learning Objectives\n- Use +, -, *, /, %, and ** in code.\n- Apply operator precedence in expressions.\n- Recognize how integer division and modulo behave.\n\n## Core Arithmetic Operators\n- + addition, - subtraction\n- * multiplication, / division\n- % modulo - returns the remainder. 10 % 3 = 1.\n- ** exponentiation (JS: 2 ** 3 = 8; Python: pow(2,3) = 8).\n\n## Operator Precedence\nParentheses first, then exponentiation, then * / %, then + -. So 3 + 4 * 2 = **11**, not 14.\n\n## Integer Division vs Modulo\nPython / returns float, // is floor division. The modulo % is invaluable for cycling through a fixed range (e.g., alternating row colours).`,
      quiz: {
        title: 'Quiz 1.5 — Arithmetic Operators & Order of Operations',
        description: 'Three questions on operators, precedence, and division.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does the % (modulo) operator return?',
            questionType: 'fill_blank',
            correctAnswer: 'The remainder of division',
          },
          {
            questionText: 'Evaluate: 10 % 3',
            questionType: 'fill_blank',
            correctAnswer: '1',
          },
          {
            questionText: 'In most languages, does * or + execute first without parentheses?',
            questionType: 'fill_blank',
            correctAnswer: '*',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 1 Assignment — Base Converter',
    description: 'Build a tool that: (1) Takes a decimal number and outputs its binary, octal, and hexadecimal equivalents. (2) Takes a binary number and outputs its decimal equivalent. (3) Handles invalid input gracefully.',
    dueDate: '2026-10-25T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm1a1', type: 'theory', title: 'Describe the difference between a bit and a byte in one sentence each.', marks: 5 },
      { id: 'm1a2', type: 'theory', title: 'Explain, in one sentence, why 0.1 + 0.2 is not exactly 0.3 in floating-point arithmetic.', marks: 5 },
      { id: 'm1a3', type: 'subjective', title: 'Convert binary 11011 to decimal by hand, showing each power-of-2 step.', marks: 5 },
      { id: 'm1a4', type: 'file', title: 'Submit your Base Converter program with test cases.', marks: 5 },
    ],
  },
}
// MARKER_M1
