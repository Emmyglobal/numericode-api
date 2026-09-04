// ─── JavaScript Course — Module 4: Collections & Algorithms ─────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'J4.1 — Searching & Sorting',
  duration: 10,
  content: `# J4.1 — Searching & Sorting

Finding and ordering data are the two most common algorithmic tasks. JS gives you find and sort; you supply the logic.

## Learning Objectives
- Find elements with find/findIndex and includes.
- Sort numbers correctly with a comparator.
- Sort objects by a field.

## Introduction
Array.prototype.sort sorts strings by default — even numbers get stringified, so [10, 2, 1] sorts to [1, 10, 2]. The fix is a comparator: (a, b) => a - b.

## Searching
const nums = [5, 12, 8];
nums.includes(12);              // true
nums.find((n) => n > 6);        // 12 (first match)
nums.findIndex((n) => n > 6);   // 1 (its index)
nums.indexOf(8);                // 2

## Sorting Numbers
const nums = [10, 2, 1];
nums.sort();                    // ['1', '10', '2'] order — WRONG for numbers
nums.sort((a, b) => a - b);     // [1, 2, 10]  ascending
nums.sort((a, b) => b - a);     // [10, 2, 1]  descending

## Sorting Objects
const students = [
  { name: "carol", score: 77 },
  { name: "ada", score: 82 },
];
students.sort((a, b) => b.score - a.score); // by score, high first
console.log(students[0].name);              // ada

## Worked Example — Top Three
const scores = [82, 91, 77, 95, 60];
const top3 = [...scores].sort((a, b) => b - a).slice(0, 3);
console.log(top3); // [95, 91, 82]
// note: [...scores] copies first so the original is untouched

## Practical Exercise
Run this:
const items = [
  { name: "pen", price: 12 },
  { name: "bag", price: 150 },
  { name: "book", price: 45 },
];
const cheapest = items.find((i) => i.price === Math.min(...items.map((i) => i.price)));
console.log(cheapest.name);
Tasks: (1) what prints; (2) sort items by price ascending and log the order. Check: pen; then pen, book, bag.
Expected scaffold lines (copy exactly):
    const items = [
      { name: "pen", price: 12 },
      { name: "bag", price: 150 },
      { name: "book", price: 45 },
    ];
    const cheapest = items.find((i) => i.price === Math.min(...items.map((i) => i.price)));
    console.log(cheapest.name);

## Key Takeaways
- find/findIndex take a predicate; includes/indexOf test membership.
- sort mutates the original — copy with [...arr] first when needed.
- Numeric sort needs (a, b) => a - b; string default sort is by Unicode.
- Comparators on object fields enable leaderboards and rankings.

## Quiz Answer Key
1. (b) sort without a comparator stringifies numbers, so 10 comes after 2.
2. (a) (a, b) => a - b sorts ascending for numbers.
3. False — sort mutates in place; copy first to preserve the original.
4. (c) find returns the first matching element (or undefined).
5. (b) b.score - a.score sorts scores descending.
`,
  quiz: {
    title: 'Quiz J4.1 — Searching & Sorting',
    description: '5 auto-gradable questions on find and sort with comparators.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '[10, 2, 1].sort() produces:', questionType: 'multiple_choice', options: [{ id: 'a', text: '[1, 2, 10]', isCorrect: false }, { id: 'b', text: '[1, 10, 2]', isCorrect: true }, { id: 'c', text: '[10, 2, 1]', isCorrect: false }, { id: 'd', text: 'An error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The correct numeric ascending comparator is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '(a, b) => a - b', isCorrect: true }, { id: 'b', text: '(a, b) => b - a', isCorrect: false }, { id: 'c', text: '(a, b) => a < b', isCorrect: false }, { id: 'd', text: 'None needed', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: sort() returns a new array and leaves the original unchanged.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: ______ returns the first element matching a predicate.', questionType: 'fill_blank', correctAnswer: 'find' },
      { id: 'q5', questionText: 'Sorting students by b.score - a.score orders by:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Name', isCorrect: false }, { id: 'b', text: 'Score, highest first', isCorrect: true }, { id: 'c', text: 'Score, lowest first', isCorrect: false }, { id: 'd', text: 'Nothing', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J4.1 — Leaderboard',
    description: 'Given an array of player objects (name, points), produce the top 3 by points without mutating the original, and find a player by name. Good: correct sort/copy/find; rubric: 8 sort+copy, 6 top3, 6 find = 20.',
    dueDate: '2026-08-17T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the code for the top-3 leaderboard and a find-by-name lookup. Show code and outputs.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why copy before sorting?', marks: 8 }],
  },
})

lessons.push({
  title: 'J4.2 — Strings Deep Dive',
  duration: 8,
  content: `# J4.2 — Strings Deep Dive

Strings are immutable sequences with powerful methods: slice, split, join, trim, includes, template literals.

## Learning Objectives
- Slice and search strings.
- Split into arrays and join them back.
- Format with template literals.

## Introduction
Strings in JS are immutable — methods return new strings. split turns a string into an array; join does the reverse. Template literals (backticks) interpolate expressions cleanly.

## Slicing and Searching
const s = "javascript";
s.slice(0, 4);      // 'java'
s.slice(-6);        // 'script'
s.includes("script"); // true
s.indexOf("a");     // 1
s.toUpperCase();    // 'JAVASCRIPT'

## Split and Join
const csv = "ada,91,82";
const parts = csv.split(",");     // ['ada', '91', '82']
const line = parts.join(" | ");   // 'ada | 91 | 82'

## Template Literals
const name = "ada";
const score = 91;
const msg = name + " scored " + score;      // concatenation
const msg2 = \`\${name} scored \${score}\`;  // template literal — cleaner

## Worked Example — Initials
function initials(full) {
  return full
    .trim()
    .split(/\\s+/)
    .map((w) => w[0].toUpperCase())
    .join("");
}
console.log(initials("  ada  byron  lovelace ")); // ABL

## Practical Exercise
Run this:
const raw = "  hello, world  ";
const clean = raw.trim();
const words = clean.split(", ");
console.log(words);
console.log(words.join(" - ").toUpperCase());
Tasks: (1) what prints; (2) write initials-style output for "mary jane watson". Check: ['hello', 'world'] then 'HELLO - WORLD'; MJW.
Expected scaffold lines (copy exactly):
    const raw = "  hello, world  ";
    const clean = raw.trim();
    const words = clean.split(", ");
    console.log(words);
    console.log(words.join(" - ").toUpperCase());

## Key Takeaways
- Strings are immutable; every method returns a new string.
- split/join convert between strings and arrays.
- Template literals interpolate with backticks and \${}.
- trim, toUpperCase/toLowerCase, includes cover most daily needs.

## Quiz Answer Key
1. (b) 'javascript'.slice(0, 4) is 'java'.
2. (a) split(',') produces an array of the parts.
3. False — s.toUpperCase() returns a new string; s is unchanged.
4. (c) Template literals use backticks with \${} interpolation.
5. (b) join(" - ") glues elements with the separator.
`,
  quiz: {
    title: 'Quiz J4.2 — Strings Deep Dive',
    description: '5 auto-gradable questions on string methods and template literals.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '"javascript".slice(0, 4) is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'java', isCorrect: true }, { id: 'b', text: 'javas', isCorrect: false }, { id: 'c', text: 'script', isCorrect: false }, { id: 'd', text: 'j', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: '"a,b,c".split(",") produces:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'An array of 3 strings', isCorrect: true }, { id: 'b', text: 'One string', isCorrect: false }, { id: 'c', text: 'A number', isCorrect: false }, { id: 'd', text: 'An object', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: toUpperCase() modifies the original string.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Template literals interpolate with backticks and ______.', questionType: 'fill_blank', correctAnswer: '${}' },
      { id: 'q5', questionText: '["a","b"].join(" - ") gives:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'a-b', isCorrect: false }, { id: 'b', text: 'a - b', isCorrect: true }, { id: 'c', text: 'ab', isCorrect: false }, { id: 'd', text: 'a,b', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J4.2 — Text Processor',
    description: 'Write functions: slugify(title) (lowercase, hyphens) and initials(full) as shown. Test on messy input. Good: correct chain methods, tested; rubric: 8 slugify, 6 initials, 6 tests = 20.',
    dueDate: '2026-08-18T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Implement slugify("  Hello World  ") -> hello-world and initials("ada byron lovelace") -> ABL. Show code and outputs.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why are template literals preferred over + concatenation?', marks: 8 }],
  },
})

lessons.push({
  title: 'J4.3 — Math & Randomness',
  duration: 8,
  content: `# J4.3 — Math & Randomness

The Math object covers rounding, powers, and random numbers; Math.random drives games and simulation.

## Learning Objectives
- Round, floor, and clamp numbers with Math methods.
- Generate random integers in a range.
- Simulate a dice roll and a coin flip.

## Introduction
Math.floor rounds down; Math.round rounds to nearest; Math.min/max clamp. Math.random() returns a float in [0, 1) — multiply, shift, and floor to get integers in any range.

## Math Methods
Math.floor(3.7);   // 3
Math.ceil(3.2);    // 4
Math.round(3.5);   // 4
Math.abs(-5);      // 5
Math.max(3, 9, 1); // 9
Math.pow(2, 10);   // 1024

## Random Integers in [min, max]
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
randomInt(1, 6); // a dice roll: 1..6

## Coin Flip and Shuffle
const flip = () => (Math.random() < 0.5 ? "heads" : "tails");

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

## Worked Example — Dice Statistics
const rolls = Array.from({ length: 6 }, () => randomInt(1, 6));
console.log(rolls);
console.log("average:", rolls.reduce((a, b) => a + b, 0) / rolls.length);

## Practical Exercise
Run this:
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const rolls = [randomInt(1, 6), randomInt(1, 6), randomInt(1, 6)];
console.log(rolls);
console.log(rolls.every((r) => r >= 1 && r <= 6));
Tasks: (1) why is the range check always true; (2) roll 100 times and count sixes. Check: the formula bounds results to [min, max]; roughly 1/6 of 100 rolls are sixes.
Expected scaffold lines (copy exactly):
    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const rolls = [randomInt(1, 6), randomInt(1, 6), randomInt(1, 6)];
    console.log(rolls);
    console.log(rolls.every((r) => r >= 1 && r <= 6));

## Key Takeaways
- Math.random() is [0, 1); floor after scaling gives integers.
- randomInt(min, max) needs the +1 to include max.
- The Fisher-Yates swap loop shuffles fairly.
- Math.min/max compose into clamp logic.

## Quiz Answer Key
1. (b) Math.random() returns a float in [0, 1).
2. (a) The +1 makes max inclusive.
3. False — Math.floor always rounds down (toward negative infinity).
4. (c) The swap loop is Fisher-Yates.
5. (b) roughly 100/6 = 17 sixes, give or take.
`,
  quiz: {
    title: 'Quiz J4.3 — Math & Randomness',
    description: '5 auto-gradable questions on Math methods and random integers.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Math.random() returns a float in:', questionType: 'multiple_choice', options: [{ id: 'a', text: '[0, 1)', isCorrect: true }, { id: 'b', text: '[1, 10]', isCorrect: false }, { id: 'c', text: '(0, 100]', isCorrect: false }, { id: 'd', text: 'Any range', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'Math.floor(3.7) is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '3', isCorrect: true }, { id: 'b', text: '4', isCorrect: false }, { id: 'c', text: '3.7', isCorrect: false }, { id: 'd', text: '0', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Math.ceil rounds toward negative infinity.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: To include max in a random range, add ______ inside the formula.', questionType: 'fill_blank', correctAnswer: '1' },
      { id: 'q5', questionText: 'About how many sixes appear in 100 dice rolls?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'About 6', isCorrect: false }, { id: 'b', text: 'About 17', isCorrect: true }, { id: 'c', text: 'About 50', isCorrect: false }, { id: 'd', text: 'Exactly 16', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J4.3 — Dice Simulator',
    description: 'Simulate 600 dice rolls, count each face, and report the distribution. Good: correct counting, sensible distribution; rubric: 8 loop+count, 6 distribution, 6 explanation = 20.',
    dueDate: '2026-08-19T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Roll a die 600 times, tally faces 1-6 into an object, and print the counts. Explain why they are roughly equal.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is Math.random not cryptographically secure?', marks: 8 }],
  },
})

lessons.push({
  title: 'J4.4 — Complexity: Counting Steps',
  duration: 8,
  content: `# J4.4 — Complexity: Counting Steps

Big-O describes how work grows with input size. Counting steps reveals why some approaches scale and others do not.

## Learning Objectives
- Count loop passes as a function of input size n.
- Recognize O(1), O(n), O(n^2), and O(log n) patterns.
- Choose data structures to avoid quadratic blowups.

## Introduction
An O(1) operation takes the same time regardless of size. O(n) grows in step with the input. O(n^2) — a loop inside a loop — explodes at scale. Recognizing the shape tells you what will still work at 10x the data.

## O(n) — One Pass
function total(arr) {
  let t = 0;
  for (const x of arr) t += x;   // n steps
  return t;
}

## O(n^2) — Loop in a Loop
function allPairs(arr) {
  const pairs = [];
  for (const a of arr) {
    for (const b of arr) {
      pairs.push([a, b]);        // n * n steps
    }
  }
  return pairs;
}
// 1000 items -> 1,000,000 pairs

## O(1) — Constant Time
arr[0];              // direct index
obj.key;             // hash lookup
set.has(value);      // Set membership

## Worked Example — Two Ways to Find Duplicates
// O(n^2): compare every pair
function dupSlow(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(n): remember what we have seen
function dupFast(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

## Practical Exercise
Run this:
function dupFast(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
console.log(dupFast([1, 2, 3, 1]));
console.log(dupFast([1, 2, 3]));
Tasks: (1) what prints; (2) how many has() calls happen at most for n items? Check: true then false; at most n calls — one pass.
Expected scaffold lines (copy exactly):
    function dupFast(arr) {
      const seen = new Set();
      for (const x of arr) {
        if (seen.has(x)) return true;
        seen.add(x);
      }
      return false;
    }
    console.log(dupFast([1, 2, 3, 1]));
    console.log(dupFast([1, 2, 3]));

## Key Takeaways
- Nested loops over the same data are O(n^2) — fine at 10 items, deadly at 10,000.
- Sets and objects give O(1) average lookups — trade memory for speed.
- Counting steps (not timing) is how you reason about growth.
- Premature optimization is real; optimize the O(n^2) parts first.

## Quiz Answer Key
1. (b) A loop inside a loop over the same n items is O(n^2).
2. (a) Set.has is average O(1).
3. False — dupFast does at most n steps, O(n).
4. (c) Direct indexing is O(1).
5. (b) The Set version avoids pairwise comparison entirely.
`,
  quiz: {
    title: 'Quiz J4.4 — Complexity',
    description: '5 auto-gradable questions on Big-O patterns.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A loop inside a loop over n items is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'O(n)', isCorrect: false }, { id: 'b', text: 'O(n^2)', isCorrect: true }, { id: 'c', text: 'O(1)', isCorrect: false }, { id: 'd', text: 'O(log n)', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'set.has(x) is on average:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'O(1)', isCorrect: true }, { id: 'b', text: 'O(n)', isCorrect: false }, { id: 'c', text: 'O(n^2)', isCorrect: false }, { id: 'd', text: 'O(log n)', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: dupFast with a Set runs in O(n^2).', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Accessing arr[0] is ______ time.', questionType: 'fill_blank', correctAnswer: 'constant' },
      { id: 'q5', questionText: 'At 1000 items, allPairs creates:', questionType: 'multiple_choice', options: [{ id: 'a', text: '1000 pairs', isCorrect: false }, { id: 'b', text: '1,000,000 pairs', isCorrect: true }, { id: 'c', text: '999 pairs', isCorrect: false }, { id: 'd', text: '2000 pairs', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J4.4 — Optimize It',
    description: 'Given a slow O(n^2) duplicate finder, rewrite it with a Set and explain the improvement. Good: working fast version, clear reasoning; rubric: 8 rewrite, 6 explanation, 6 test = 20.',
    dueDate: '2026-08-20T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Rewrite dupSlow with a Set, test both on [1,2,3,1] and a 1000-item array, and explain the complexity change.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When is the O(n^2) version still acceptable?', marks: 8 }],
  },
})

export const module04: ModuleData = {
  title: 'Module 4 — Collections & Algorithms',
  lessons,
}
