// ─── JavaScript Course — Module 3: Functions & Scope ────────────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'J3.1 — Scope & Closures',
  duration: 8,
  content: `# J3.1 — Scope & Closures

Scope is where a variable is visible. A closure is a function that remembers variables from where it was defined.

## Learning Objectives
- Distinguish block, function, and global scope.
- Explain what a closure captures.
- Write a counter factory using a closure.

## Introduction
Variables declared with let/const inside a block exist only there. When a function is defined inside another, it keeps access to the outer variables even after the outer call finishes — that is a closure.

## Block and Function Scope
function demo() {
  const inner = 1;
  if (true) {
    const alsoInner = 2;
  }
  // alsoInner is not visible here
}
// inner is not visible here

## Closure Basics
function makeGreeter(name) {
  return function () {
    return "hello, " + name;   // captures name
  };
}
const greetAda = makeGreeter("ada");
console.log(greetAda()); // hello, ada

## Counter Factory
function makeCounter() {
  let count = 0;            // private to the closure
  return function () {
    count++;
    return count;
  };
}
const next = makeCounter();
console.log(next()); // 1
console.log(next()); // 2

## Worked Example — Private State
function makeWallet(start) {
  let balance = start;
  return {
    deposit: (n) => (balance += n),
    check: () => balance,
  };
}
const w = makeWallet(100);
w.deposit(50);
console.log(w.check()); // 150 — balance is private

## Practical Exercise
Run this:
function makeAccumulator() {
  let total = 0;
  return function (n) {
    total += n;
    return total;
  };
}
const acc = makeAccumulator();
console.log(acc(5));
console.log(acc(10));
Tasks: (1) what prints; (2) make a second accumulator and show they are independent. Check: 5 then 15; a second accumulator starts at 0 again.
Expected scaffold lines (copy exactly):
    function makeAccumulator() {
      let total = 0;
      return function (n) {
        total += n;
        return total;
      };
    }
    const acc = makeAccumulator();
    console.log(acc(5));
    console.log(acc(10));

## Key Takeaways
- let/const are block-scoped; var is function-scoped (legacy).
- Closures capture the variables of their defining scope, keeping them alive.
- Closures create private state without classes.
- Each call to a factory makes a fresh, independent closure.

## Quiz Answer Key
1. (b) A closure remembers variables from its defining scope.
2. (a) count lives inside makeCounter and persists between calls.
3. False — each factory call creates a new, independent closure.
4. (c) Closures can emulate private state.
5. (b) 5 then 15 — the closure accumulates.
`,
  quiz: {
    title: 'Quiz J3.1 — Scope & Closures',
    description: '5 auto-gradable questions on scope and closure behavior.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A closure is a function that:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Forgets its outer variables', isCorrect: false }, { id: 'b', text: 'Remembers variables from its defining scope', isCorrect: true }, { id: 'c', text: 'Cannot be called twice', isCorrect: false }, { id: 'd', text: 'Is always global', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'In makeCounter, count is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Global', isCorrect: false }, { id: 'b', text: 'Private to the closure', isCorrect: true }, { id: 'c', text: 'Reset on every call', isCorrect: false }, { id: 'd', text: 'undefined', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: Two calls to makeAccumulator() share one total.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: let/const are ______-scoped.', questionType: 'fill_blank', correctAnswer: 'block' },
      { id: 'q5', questionText: 'acc(5) then acc(10) with a closure accumulator logs:', questionType: 'multiple_choice', options: [{ id: 'a', text: '5, 10', isCorrect: false }, { id: 'b', text: '5, 15', isCorrect: true }, { id: 'c', text: '10, 15', isCorrect: false }, { id: 'd', text: '15, 5', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J3.1 — Closure Factory',
    description: 'Build makeBankAccount(start) returning deposit, withdraw, and check with a private balance that cannot go negative. Good: correct closure, guard, independence; rubric: 8 closure, 6 guard, 6 explanation = 20.',
    dueDate: '2026-08-13T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write makeBankAccount(start) with three closure methods, a no-overdraft guard, and a demo showing two accounts are independent.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'How does a closure provide privacy without a class?', marks: 8 }],
  },
})

lessons.push({
  title: 'J3.2 — Arrow Functions',
  duration: 8,
  content: `# J3.2 — Arrow Functions

Arrow functions are compact function expressions: (a, b) => a + b.

## Learning Objectives
- Write arrow functions with one and multiple parameters.
- Use implicit return for single-expression bodies.
- Choose between arrow and regular functions sensibly.

## Introduction
const add = (a, b) => a + b; is equivalent to a regular function for most purposes — shorter, and the natural fit for callbacks. With no braces, the expression is returned automatically (implicit return).

## Syntax Forms
const add = (a, b) => a + b;      // implicit return
const log = (msg) => {            // block body needs return
  console.log(msg);
};
const ping = () => "pong";        // no parameters

## As Callbacks
const nums = [3, 1, 4];
nums.sort((a, b) => a - b);       // [1, 3, 4]
nums.map((n) => n * 2);           // [6, 2, 8]

## this Difference
Arrow functions do not have their own this — they inherit it from the surrounding scope. Regular functions get this from how they are called. This matters in object methods and event handlers.

## Worked Example — Formatting
const students = [
  { name: "ada", score: 82 },
  { name: "bob", score: 91 },
];
const labels = students.map((s) => s.name + ": " + s.score);
console.log(labels); // ['ada: 82', 'bob: 91']

## Practical Exercise
Run this:
const square = (n) => n * n;
const greet = (name) => "hi, " + name;
console.log(square(6));
console.log(greet("ada"));
Tasks: (1) what prints; (2) rewrite square with a block body and explicit return. Check: 36 and hi, ada; the block form returns the same value.
Expected scaffold lines (copy exactly):
    const square = (n) => n * n;
    const greet = (name) => "hi, " + name;
    console.log(square(6));
    console.log(greet("ada"));

## Key Takeaways
- (params) => expression returns the expression implicitly.
- A block body {} needs an explicit return.
- Arrows shine as short callbacks (map, filter, sort).
- Arrows have no own this — prefer regular functions for object methods.

## Quiz Answer Key
1. (b) The arrow function returns 8 implicitly.
2. (a) Implicit return only works for single-expression bodies without braces.
3. False — arrows have no own this; they inherit it.
4. (c) const ping = () => "pong"; is a valid no-arg arrow.
5. (b) map with an arrow produces a new array of labels.
`,
  quiz: {
    title: 'Quiz J3.2 — Arrow Functions',
    description: '5 auto-gradable questions on arrow syntax and implicit return.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'const add = (a, b) => a + b; add(5, 3) is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '53', isCorrect: false }, { id: 'b', text: '8', isCorrect: true }, { id: 'c', text: 'undefined', isCorrect: false }, { id: 'd', text: 'NaN', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Implicit return works when the body:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Uses braces', isCorrect: false }, { id: 'b', text: 'Is a single expression without braces', isCorrect: true }, { id: 'c', text: 'Has a return statement', isCorrect: false }, { id: 'd', text: 'Is async', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: Arrow functions have their own this binding.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: A no-parameter arrow starts with ______ =>.', questionType: 'fill_blank', correctAnswer: '()' },
      { id: 'q5', questionText: 'students.map((s) => s.name) returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The original array', isCorrect: false }, { id: 'b', text: 'A new array of names', isCorrect: true }, { id: 'c', text: 'One name', isCorrect: false }, { id: 'd', text: 'undefined', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J3.2 — Arrow Refactor',
    description: 'Rewrite three regular functions as arrow functions and use them as callbacks. Good: correct syntax, working callbacks; rubric: 6 syntax, 6 callbacks, 8 explanation = 20.',
    dueDate: '2026-08-14T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Convert double, isBig, and label to arrow functions; use them with map/filter on a sample array. Show code and outputs.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When should you avoid an arrow function?', marks: 8 }],
  },
})

lessons.push({
  title: 'J3.3 — Higher-Order Functions: map, filter, reduce',
  duration: 10,
  content: `# J3.3 — Higher-Order Functions: map, filter, reduce

Higher-order functions take functions as arguments. map transforms, filter selects, reduce collapses.

## Learning Objectives
- Transform every element with map.
- Keep matching elements with filter.
- Collapse an array to one value with reduce.

## Introduction
Instead of manual loops, arrays carry their own iteration tools that take a callback. They express intent: map says transform each, filter says keep some, reduce says combine all.

## map — Transform Each
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2); // [2, 4, 6]

## filter — Keep Some
const scores = [80, 45, 95, 60];
const passing = scores.filter((s) => s >= 60); // [80, 95, 60]

## reduce — Combine All
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0); // 10
// acc is the running total; 0 is the starting value

## Chaining
const students = [
  { name: "ada", score: 82 },
  { name: "bob", score: 91 },
  { name: "carol", score: 55 },
];
const topNames = students
  .filter((s) => s.score >= 80)
  .map((s) => s.name);
console.log(topNames); // ['ada', 'bob']

## Worked Example — Average Score
const scores = [82, 91, 77];
const average = scores.reduce((a, b) => a + b, 0) / scores.length;
console.log(average.toFixed(2)); // 83.33

## Practical Exercise
Run this:
const nums = [4, 7, 10, 13];
const evenDoubled = nums.filter((n) => n % 2 === 0).map((n) => n * 2);
const total = nums.reduce((a, b) => a + b, 0);
console.log(evenDoubled);
console.log(total);
Tasks: (1) what prints; (2) add a reduce that finds the max. Check: [8, 20] and 34; max reduce: (a, b) => Math.max(a, b).
Expected scaffold lines (copy exactly):
    const nums = [4, 7, 10, 13];
    const evenDoubled = nums.filter((n) => n % 2 === 0).map((n) => n * 2);
    const total = nums.reduce((a, b) => a + b, 0);
    console.log(evenDoubled);
    console.log(total);

## Key Takeaways
- map returns a new array of the same length, transformed.
- filter returns a shorter (or equal) array of matches.
- reduce folds the array into one value; always give an initial value.
- These return new arrays — they never mutate the original.

## Quiz Answer Key
1. (b) map transforms every element and returns a new array.
2. (a) filter keeps elements whose callback returns true.
3. False — with no initial value, reduce starts with the first element (and throws on empty arrays).
4. (c) 1+2+3+4 = 10.
5. (b) Chaining filters then maps — order matters.
`,
  quiz: {
    title: 'Quiz J3.3 — map, filter, reduce',
    description: '5 auto-gradable questions on the three core higher-order functions.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'map returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A single value', isCorrect: false }, { id: 'b', text: 'A new transformed array', isCorrect: true }, { id: 'c', text: 'The same array', isCorrect: false }, { id: 'd', text: 'undefined', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'filter keeps elements where the callback:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Returns true', isCorrect: true }, { id: 'b', text: 'Returns a number', isCorrect: false }, { id: 'c', text: 'Is short', isCorrect: false }, { id: 'd', text: 'Throws', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: reduce requires an initial value.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: [1,2,3,4].reduce((a, b) => a + b, 0) is ______.', questionType: 'fill_blank', correctAnswer: '10' },
      { id: 'q5', questionText: 'filter(score >= 80).map(name) produces:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'All names', isCorrect: false }, { id: 'b', text: 'Names of qualifying students', isCorrect: true }, { id: 'c', text: 'Scores', isCorrect: false }, { id: 'd', text: 'A number', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J3.3 — Data Pipeline',
    description: 'Given an array of order objects, build a pipeline: filter to completed, map to totals, reduce to grand total. Good: correct chain, correct total; rubric: 6 filter, 5 map, 6 reduce, 3 explanation = 20.',
    dueDate: '2026-08-15T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'With orders (id, status, amount), chain filter/map/reduce to compute the grand total of completed orders. Show code and output.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why does the chained pipeline read better than nested loops?', marks: 8 }],
  },
})

lessons.push({
  title: 'J3.4 — Project: Array Utilities',
  duration: 12,
  content: `# J3.4 — Project: Array Utilities

Build a small library of reusable helpers using the higher-order functions from J3.3.

## Learning Objectives
- Implement sum, average, unique, and chunk helpers.
- Compose helpers to answer real questions about data.
- Test each helper with normal and edge cases.

## Introduction
Utilities turn repeated loop logic into named, testable functions. Each helper is small; their combinations are powerful. This is the pattern behind libraries like lodash.

## The Helpers
function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function average(arr) {
  return arr.length === 0 ? 0 : sum(arr) / arr.length;
}

function unique(arr) {
  return [...new Set(arr)];
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

## Using Them
console.log(sum([1, 2, 3]));        // 6
console.log(average([2, 4, 6]));    // 4
console.log(unique([1, 1, 2, 2]));  // [1, 2]
console.log(chunk([1, 2, 3, 4], 2)); // [[1,2],[3,4]]

## Worked Example — Report on Records
const scores = [82, 91, 82, 77, 91];
console.log("total:", sum(scores));
console.log("average:", average(scores));
console.log("unique:", unique(scores));
console.log("pairs:", chunk(scores, 2));

## Practical Exercise
Run this:
function clamp(arr, low, high) {
  return arr.map((n) => Math.min(Math.max(n, low), high));
}
console.log(clamp([5, 50, 500], 10, 100));
Tasks: (1) what prints; (2) write maxOf(arr) using reduce and test on an empty-array case. Check: [10, 50, 100]; maxOf should handle [] by returning undefined or 0 — document your choice.
Expected scaffold lines (copy exactly):
    function clamp(arr, low, high) {
      return arr.map((n) => Math.min(Math.max(n, low), high));
    }
    console.log(clamp([5, 50, 500], 10, 100));

## Key Takeaways
- Small helpers with clear names beat repeated inline logic.
- reduce with 0 as the seed powers sum-style helpers.
- [...new Set(arr)] is the idiomatic unique.
- slice(i, i + size) is the core of chunking; watch the bounds.

## Quiz Answer Key
1. (b) [...new Set(arr)] removes duplicates and returns an array.
2. (a) average guards against division by zero on empty arrays.
3. False — chunk([[1,2],[3,4]]) from [1,2,3,4] with size 2 produces nested pairs.
4. (c) sum uses reduce with initial value 0.
5. (b) slice(i, i + size) takes size items starting at i.
`,
  quiz: {
    title: 'Quiz J3.4 — Array Utilities',
    description: '5 auto-gradable questions on building and combining helpers.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The idiomatic way to deduplicate an array is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'arr.filter()', isCorrect: false }, { id: 'b', text: '[...new Set(arr)]', isCorrect: true }, { id: 'c', text: 'arr.reduce()', isCorrect: false }, { id: 'd', text: 'arr.sort()', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'average([]) should return:', questionType: 'multiple_choice', options: [{ id: 'a', text: '0 (guarded)', isCorrect: true }, { id: 'b', text: 'NaN', isCorrect: false }, { id: 'c', text: 'It throws', isCorrect: false }, { id: 'd', text: 'Infinity', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: chunk([1,2,3,4], 2) returns [1,2,3,4].', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: sum uses ______ with an initial value of 0.', questionType: 'fill_blank', correctAnswer: 'reduce' },
      { id: 'q5', questionText: 'chunk uses ______ to take size items at a time.', questionType: 'multiple_choice', options: [{ id: 'a', text: 'splice', isCorrect: false }, { id: 'b', text: 'slice', isCorrect: true }, { id: 'c', text: 'shift', isCorrect: false }, { id: 'd', text: 'pop', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J3.4 — Utility Library',
    description: 'Implement sum, average, unique, chunk plus your own maxOf and pluck(arr, key); test all with edge cases. Good: six helpers, edge cases tested; rubric: 4 per required helper (max 20) including one edge case each.',
    dueDate: '2026-08-16T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Implement the six helpers and show test outputs including an empty array for average and maxOf.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'What makes a helper library trustworthy — one property?', marks: 8 }],
  },
})

export const module03: ModuleData = {
  title: 'Module 3 — Functions & Scope',
  lessons,
}
