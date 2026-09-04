// ─── JavaScript Course — Module 2: Control Flow & Looping ───────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'J2.1 — Looping with for',
  duration: 8,
  content: `# J2.1 — Looping with for

The classic for loop counts: start, condition, step. Use it when you know how many times to repeat.

## Learning Objectives
- Write a for loop with init, condition, and update.
- Loop over array indices to read and transform values.
- Accumulate a total inside a loop.

## Introduction
for (let i = 0; i < 5; i++) runs the body five times: i starts at 0, continues while i < 5, and increases by one each pass. Indices make it the tool for arrays.

## Anatomy
for (let i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}

## Looping an Array by Index
const scores = [80, 95, 60];
for (let i = 0; i < scores.length; i++) {
  console.log(i, scores[i]);
}

## Accumulating
let total = 0;
for (let i = 1; i <= 5; i++) {
  total = total + i;
}
console.log(total); // 15

## Worked Example — Passing Scores
const scores = [80, 95, 60, 45];
let passed = 0;
for (let i = 0; i < scores.length; i++) {
  if (scores[i] >= 60) passed++;
}
console.log(passed); // 3

## Practical Exercise
Run this:
const nums = [2, 4, 6, 8];
let doubled = [];
for (let i = 0; i < nums.length; i++) {
  doubled.push(nums[i] * 2);
}
console.log(doubled);
Tasks: (1) what prints; (2) change to nums[i] * 3 and predict first. Check: [4, 8, 12, 16]; with *3 it is [6, 12, 18, 24].
Expected scaffold lines (copy exactly):
    const nums = [2, 4, 6, 8];
    let doubled = [];
    for (let i = 0; i < nums.length; i++) {
      doubled.push(nums[i] * 2);
    }
    console.log(doubled);

## Key Takeaways
- for (init; condition; update) — init once, test before each pass, update after.
- Array loops run i from 0 to length - 1.
- Accumulators (total, count) must be declared outside the loop.
- Off-by-one bugs come from <= with length — prefer < length.

## Quiz Answer Key
1. (b) i runs 0,1,2,3 — stops before 4.
2. (a) length - 1 is the last valid index.
3. False — the update runs after each pass.
4. (c) 1..5 sums to 15.
5. (b) With <= and length you read one index past the end.
`,
  quiz: {
    title: 'Quiz J2.1 — for Loops',
    description: '5 auto-gradable questions on for loop anatomy and accumulation.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'for (let i = 0; i < 4; i++) logs:', questionType: 'multiple_choice', options: [{ id: 'a', text: '0..4', isCorrect: false }, { id: 'b', text: '0..3', isCorrect: true }, { id: 'c', text: '1..4', isCorrect: false }, { id: 'd', text: '1..3', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The last valid index of an array with length 5 is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '4', isCorrect: true }, { id: 'b', text: '5', isCorrect: false }, { id: 'c', text: '0', isCorrect: false }, { id: 'd', text: 'undefined', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: the update expression runs before the body.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Summing 1..5 with a loop and accumulator gives ______.', questionType: 'fill_blank', correctAnswer: '15' },
      { id: 'q5', questionText: 'Using i <= arr.length in the condition risks:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Nothing', isCorrect: false }, { id: 'b', text: 'Reading past the end (undefined)', isCorrect: true }, { id: 'c', text: 'A syntax error', isCorrect: false }, { id: 'd', text: 'An infinite loop', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J2.1 — Loop Practice',
    description: 'With an array of step counts, compute total, max, and days over 10000 in one loop. Good: single pass, correct results; rubric: 6 total, 4 max, 6 count, 4 readability = 20.',
    dueDate: '2026-08-09T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'With steps = [9500, 12000, 8000, 11000, 7000], write one for loop computing total, max, and days over 10000. Show code and outputs.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why declare the accumulator before the loop?', marks: 8 }],
  },
})

lessons.push({
  title: 'J2.2 — While & Do-While',
  duration: 8,
  content: `# J2.2 — While & Do-While

while repeats as long as a condition holds — use it when the count is unknown up front.

## Learning Objectives
- Write a while loop with a correct exit condition.
- Use do...while when the body must run at least once.
- Avoid infinite loops by updating the controlling variable.

## Introduction
while (cond) { ... } tests first, then runs. do { ... } while (cond) runs first, then tests — the body always executes once. The condition must eventually become false or the loop never ends.

## While
let n = 3;
while (n > 0) {
  console.log(n);
  n--;
}
// 3, 2, 1

## Do-While
let input = "";
do {
  input = "typed";
} while (input === "");   // body ran once even though the condition was false after

## Avoiding Infinite Loops
let i = 0;
while (i < 5) {
  console.log(i);
  i++;   // forget this and the loop never ends
}

## Worked Example — Countdown
function countdown(from) {
  while (from > 0) {
    console.log(from);
    from--;
  }
  console.log("Liftoff!");
}
countdown(3); // 3, 2, 1, Liftoff!

## Practical Exercise
Run this:
let balance = 100;
let weeks = 0;
while (balance > 0) {
  balance = balance - 30;
  weeks++;
}
console.log(weeks);
Tasks: (1) what prints and what is the final balance; (2) change the withdrawal to 25 and recompute. Check: 4 weeks; balance ends at -20 (the last pass overdraws); with 25 it is 4 weeks and 0.
Expected scaffold lines (copy exactly):
    let balance = 100;
    let weeks = 0;
    while (balance > 0) {
      balance = balance - 30;
      weeks++;
    }
    console.log(weeks);

## Key Takeaways
- while tests before running; do...while runs at least once.
- Something inside the body must move the condition toward false.
- Infinite loops freeze the tab — watch your counter updates.
- Use while for unknown-length iteration (user input, queues, random draws).

## Quiz Answer Key
1. (b) do...while always executes the body once.
2. (a) Updating the counter prevents infinite loops.
3. False — the loop overdraws on the final pass (100-30*4 = -20).
4. (c) while tests the condition before the first pass.
5. (b) countdown(3) logs 3, 2, 1, then Liftoff!.
`,
  quiz: {
    title: 'Quiz J2.2 — While & Do-While',
    description: '5 auto-gradable questions on while, do-while, and termination.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Which loop always runs its body at least once?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'while', isCorrect: false }, { id: 'b', text: 'do...while', isCorrect: true }, { id: 'c', text: 'for', isCorrect: false }, { id: 'd', text: 'for...of', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Forgetting i++ inside while (i < 5) causes:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'An infinite loop', isCorrect: true }, { id: 'b', text: 'A syntax error', isCorrect: false }, { id: 'c', text: 'One pass', isCorrect: false }, { id: 'd', text: 'A TypeError', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: In the balance example with 30/week, the final balance is exactly 0.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: while tests the condition ______ the body runs.', questionType: 'fill_blank', correctAnswer: 'before' },
      { id: 'q5', questionText: 'countdown(3) logs:', questionType: 'multiple_choice', options: [{ id: 'a', text: '3, 2, 1', isCorrect: false }, { id: 'b', text: '3, 2, 1, Liftoff!', isCorrect: true }, { id: 'c', text: 'Liftoff!', isCorrect: false }, { id: 'd', text: '1, 2, 3', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J2.2 — While Simulation',
    description: 'Simulate savings: start at 500, withdraw 120/week while balance >= 120, count weeks, report leftover. Good: correct loop, correct counts; rubric: 8 loop, 6 counts, 6 leftover = 20.',
    dueDate: '2026-08-10T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the simulation and state how many full withdrawals happen and the leftover balance. Show code and output.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is while a better fit than for here?', marks: 8 }],
  },
})

lessons.push({
  title: 'J2.3 — for…of, break & continue',
  duration: 8,
  content: `# J2.3 — for…of, break & continue

for...of walks values (no index bookkeeping); break exits early; continue skips one pass.

## Learning Objectives
- Iterate values with for...of instead of index loops.
- Exit a loop early with break.
- Skip an iteration with continue.

## Introduction
When you only need values, for (const item of list) is cleaner than index loops. break stops the whole loop; continue jumps to the next pass. Together they express find-first and filter-style logic.

## for...of
const names = ["ada", "bob", "carol"];
for (const name of names) {
  console.log(name);
}

## break — Stop Early
const scores = [55, 82, 91, 40];
for (const s of scores) {
  if (s < 60) {
    console.log("first failing score:", s);
    break;
  }
}
// first failing score: 55

## continue — Skip One
for (const s of [80, 45, 95]) {
  if (s < 60) continue;   // skip failing scores
  console.log("pass:", s);
}
// pass: 80, pass: 95

## Worked Example — Find Item
const items = ["pen", "bag", "book"];
let found = null;
for (const it of items) {
  if (it === "bag") {
    found = it;
    break;
  }
}
console.log(found); // bag

## Practical Exercise
Run this:
for (const n of [1, 2, 3, 4, 5]) {
  if (n === 3) break;
  console.log(n);
}
Tasks: (1) what prints; (2) swap break for continue and compare. Check: 1, 2 (stops at 3); with continue it prints 1, 2, 4, 5 (skips 3).
Expected scaffold lines (copy exactly):
    for (const n of [1, 2, 3, 4, 5]) {
      if (n === 3) break;
      console.log(n);
    }

## Key Takeaways
- for...of gives values; a classic for gives indices. Pick by need.
- break exits the loop immediately; continue jumps to the next pass.
- Find-first patterns use break; filter patterns use continue.
- for...of works on arrays, strings, and other iterables.

## Quiz Answer Key
1. (b) continue skips to the next iteration; break exits entirely.
2. (a) for...of yields values directly, no index needed.
3. False — with continue, 3 is skipped and the loop finishes: 1,2,4,5.
4. (c) break stops at the first match — a find-first pattern.
5. (b) Strings are iterable, so for...of walks characters.
`,
  quiz: {
    title: 'Quiz J2.3 — for…of, break & continue',
    description: '5 auto-gradable questions on iteration control.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'continue does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Exits the loop', isCorrect: false }, { id: 'b', text: 'Skips to the next iteration', isCorrect: true }, { id: 'c', text: 'Restarts the loop', isCorrect: false }, { id: 'd', text: 'Throws', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'for (const x of [1,2,3]) gives x as:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The index', isCorrect: false }, { id: 'b', text: 'The value', isCorrect: true }, { id: 'c', text: 'A boolean', isCorrect: false }, { id: 'd', text: 'An object', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: break and continue behave identically.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: To stop at the first match, use ______.', questionType: 'fill_blank', correctAnswer: 'break' },
      { id: 'q5', questionText: 'for (const ch of "hi") iterates:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Words', isCorrect: false }, { id: 'b', text: 'Characters', isCorrect: true }, { id: 'c', text: 'Bytes', isCorrect: false }, { id: 'd', text: 'Nothing', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J2.3 — Search & Filter',
    description: 'Use for...of with break to find the first item over a price threshold, and continue to log only items in stock. Good: correct early exit and skip logic; rubric: 8 find-first, 6 filter, 6 explanation = 20.',
    dueDate: '2026-08-11T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'With products (name, price, inStock), find the first item over 100 with break, then log in-stock names with continue. Show code and output.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When would an index for loop beat for...of?', marks: 8 }],
  },
})

lessons.push({
  title: 'J2.4 — Nested Loops & the Modulo Clock',
  duration: 8,
  content: `# J2.4 — Nested Loops & the Modulo Clock

Nested loops walk grids and pairs; % wraps numbers around like a clock.

## Learning Objectives
- Write nested loops to visit every combination.
- Use % to wrap values and test divisibility.
- Trace how inner and outer loops interact.

## Introduction
A loop inside a loop visits every combination — rows and columns, teams and players. The modulo operator (%) gives the remainder, which is how you build repeating cycles (every 3rd, every other, clock wraps).

## Nested Loops
for (let row = 1; row <= 2; row++) {
  for (let col = 1; col <= 3; col++) {
    console.log(row, col);
  }
}
// 1,1 1,2 1,3 2,1 2,2 2,3 — 6 passes

## Modulo
7 % 3;    // 1 (remainder)
6 % 3;    // 0 (divides evenly)
10 % 2;   // 0 -> even

## Every Nth
for (let i = 1; i <= 10; i++) {
  if (i % 3 === 0) console.log(i, "is a multiple of 3");
}

## Worked Example — Pairing Teams
const teams = ["red", "blue"];
for (const a of teams) {
  for (const b of teams) {
    if (a !== b) console.log(a, "vs", b);
  }
}
// red vs blue, blue vs red

## Practical Exercise
Run this:
for (let i = 1; i <= 12; i++) {
  console.log(i % 12 || 12);
}
Tasks: (1) what pattern prints; (2) explain what i % 12 || 12 does for i = 12. Check: 1..11 then 12 — a clock wrap; when i % 12 is 0 (falsy), || returns 12.
Expected scaffold lines (copy exactly):
    for (let i = 1; i <= 12; i++) {
      console.log(i % 12 || 12);
    }

## Key Takeaways
- Nested loops multiply: outer 2 x inner 3 = 6 passes.
- % gives the remainder — the tool for cycles and even/odd tests.
- i % n === 0 means i is a multiple of n.
- Guard inner work with an if (a !== b) when self-pairing is invalid.

## Quiz Answer Key
1. (b) 2 outer x 3 inner = 6 combinations.
2. (a) 7 % 3 is 1 — the remainder.
3. False — i % 2 === 0 marks even numbers.
4. (c) i % 12 || 12 maps 12 to 12 and 1..11 to themselves.
5. (b) a !== b excludes self-pairs, leaving 2 ordered pairs.
`,
  quiz: {
    title: 'Quiz J2.4 — Nested Loops & Modulo',
    description: '5 auto-gradable questions on nesting and the modulo operator.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Outer 2 x inner 3 nested loop runs:', questionType: 'multiple_choice', options: [{ id: 'a', text: '5 passes', isCorrect: false }, { id: 'b', text: '6 passes', isCorrect: true }, { id: 'c', text: '2 passes', isCorrect: false }, { id: 'd', text: '3 passes', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '7 % 3 evaluates to:', questionType: 'multiple_choice', options: [{ id: 'a', text: '1', isCorrect: true }, { id: 'b', text: '2', isCorrect: false }, { id: 'c', text: '0', isCorrect: false }, { id: 'd', text: '2.33', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: i % 2 === 0 is true when i is odd.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: The remainder operator in JS is ______.', questionType: 'fill_blank', correctAnswer: '%' },
      { id: 'q5', questionText: 'red/blue teams excluding self-pairs produce:', questionType: 'multiple_choice', options: [{ id: 'a', text: '1 pair', isCorrect: false }, { id: 'b', text: '2 pairs', isCorrect: true }, { id: 'c', text: '4 pairs', isCorrect: false }, { id: 'd', text: '0 pairs', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J2.4 — Grid & Clock',
    description: 'Print a 3x3 multiplication table with nested loops, then log numbers 1-20 marking multiples of 4 using %. Good: correct table, correct marking; rubric: 8 table, 6 modulo, 6 explanation = 20.',
    dueDate: '2026-08-12T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the nested loop printing i*j for i,j in 1..3, then a loop marking multiples of 4 between 1 and 20. Show outputs.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why does i % 12 || 12 correctly wrap a clock?', marks: 8 }],
  },
})

export const module02: ModuleData = {
  title: 'Module 2 — Control Flow & Looping',
  lessons,
}
