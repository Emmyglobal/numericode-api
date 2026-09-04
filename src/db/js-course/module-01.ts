// ─── JavaScript Course — Module 1: JS Fundamentals ──────────────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'J1.1 — Your First Script',
  duration: 8,
  content: `# J1.1 — Your First Script

JavaScript makes web pages interactive. You store values in variables and show them with console.log.

## Learning Objectives
- Declare variables with let and const.
- Print values with console.log.
- Explain where JavaScript runs (the browser console or Node).

## Introduction
Every browser ships with a JavaScript engine. Open the DevTools console (F12) and you can run JS immediately. Variables store values; console.log prints them.

## Variables
let price = 250;        // can be reassigned
const name = "iris";    // cannot be reassigned
name = "rose";          // TypeError: Assignment to constant variable.

Rule of thumb: use const by default; use let only when the value must change.

## Output
console.log(name);       // iris
console.log(price);      // 250
console.log(name, price); // iris 250

## Semicolons and Comments
Semicolons are optional but conventional. Comments start with // (single line) or /* ... */ (block).

## Worked Example — Sales Day
const name = "iris";
const units = 12;
const price = 250;
const revenue = units * price;
console.log(name, units, price, revenue); // iris 12 250 3000

## Practical Exercise
Run this in your browser console:
const prices = [120, 45, 300, 80, 199];
for (const p of prices) {
  if (p > 100) {
    console.log(p, "is expensive");
  }
}
Tasks: (1) which prices print; (2) add a total variable that accumulates prices over 100 and log it. Check: 120, 300, 199 print; total is 619.
Expected scaffold lines (copy exactly):
    const prices = [120, 45, 300, 80, 199];
    for (const p of prices) {
      if (p > 100) {
        console.log(p, "is expensive");
      }
    }

## Key Takeaways
- const by default; let when reassignment is needed; var is legacy.
- console.log prints to the DevTools console.
- JS runs in browsers and on servers via Node.
- Curly braces delimit blocks; semicolons are conventional.

## Quiz Answer Key
1. (b) const declares a binding that cannot be reassigned.
2. (c) console.log prints to the console.
3. False — reassigning a const throws a TypeError.
4. (a) let is for variables that need reassignment.
5. (b) 12 * 250 = 3000.
`,
  quiz: {
    title: 'Quiz J1.1 — Your First Script',
    description: '5 auto-gradable questions on variables and console.log.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Which keyword declares a value that cannot be reassigned?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'let', isCorrect: false }, { id: 'b', text: 'const', isCorrect: true }, { id: 'c', text: 'var', isCorrect: false }, { id: 'd', text: 'static', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'console.log(42) prints:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Nothing', isCorrect: false }, { id: 'b', text: '42 to the console', isCorrect: true }, { id: 'c', text: 'An alert box', isCorrect: false }, { id: 'd', text: 'An error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: You can reassign a variable declared with const.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Use ______ when a variable must be reassigned later.', questionType: 'fill_blank', correctAnswer: 'let' },
      { id: 'q5', questionText: 'units = 12, price = 250. revenue = units * price is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '262', isCorrect: false }, { id: 'b', text: '3000', isCorrect: true }, { id: 'c', text: '2500', isCorrect: false }, { id: 'd', text: '120', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J1.1 — First Script',
    description: 'Store a product name, price, and units sold as constants; log each with a label; compute and log revenue. Good: const usage, labeled logs, correct revenue; rubric: 5 variables, 9 labels+output, 6 revenue = 20.',
    dueDate: '2026-08-03T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the script: declare three constants, log each with a label, compute revenue = price * units, and log it.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why prefer const over let when the value never changes?', marks: 8 }],
  },
})

lessons.push({
  title: 'J1.2 — Types & Operators',
  duration: 8,
  content: `# J1.2 — Types & Operators

JS values have types: number, string, boolean, undefined, null, object. Operators combine and compare them.

## Learning Objectives
- Distinguish the core primitive types.
- Use arithmetic, comparison, and logical operators.
- Prefer === over == to avoid coercion surprises.

## Introduction
JS is dynamically typed — values carry types, variables do not. The classic trap is ==, which coerces types before comparing; === compares both type and value.

## Numbers and Strings
const count = 3;        // number
const price = 2.5;      // number (no separate int type)
const name = "iris";    // string
7 / 2;   // 3.5   (no integer division)
Math.floor(7 / 2);  // 3

## String Operations
"hello, " + "world"  // concatenation
"abc".length         // 3
"abc".toUpperCase()  // 'ABC'

## Comparison and Logic
5 > 3;       // true
5 === 5;     // true
"5" === 5;   // false (different types)
"5" == 5;    // true  (coercion — avoid)
true && false; // false
true || false; // true
!true;         // false

## Worked Example — Type Check
const total = 10.0;
const label = "total";
console.log(typeof total);  // number
console.log(typeof label);  // string
console.log("10" === 10);   // false

## Practical Exercise
Run this:
const a = "5";
const b = 5;
console.log(a == b);
console.log(a === b);
Tasks: (1) what each prints; (2) rewrite both with Number(a) and compare again. Check: true then false; Number(a) === b is true.
Expected scaffold lines (copy exactly):
    const a = "5";
    const b = 5;
    console.log(a == b);
    console.log(a === b);

## Key Takeaways
- Core types: number, string, boolean, undefined, null, object, symbol, bigint.
- === compares type and value; == coerces and surprises. Always use ===.
- JS has one number type (IEEE 754 float); 7/2 is 3.5.
- && and || short-circuit; ! inverts.

## Quiz Answer Key
1. (c) === compares type and value without coercion.
2. (a) "5" === 5 is false — string vs number.
3. False — JS has a single number type; 7/2 is 3.5.
4. (b) Math.floor(7/2) gives 3.
5. (a) true || anything is true (short-circuit).
`,
  quiz: {
    title: 'Quiz J1.2 — Types & Operators',
    description: '5 auto-gradable questions on types, ===, and logic.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: '"5" === 5 evaluates to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'true', isCorrect: false }, { id: 'b', text: 'false', isCorrect: true }, { id: 'c', text: 'error', isCorrect: false }, { id: 'd', text: 'undefined', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '7 / 2 in JavaScript is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '3', isCorrect: false }, { id: 'b', text: '3.5', isCorrect: true }, { id: 'c', text: '4', isCorrect: false }, { id: 'd', text: 'NaN', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: JS has separate integer and float types.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: The operator that compares type and value is ______.', questionType: 'fill_blank', correctAnswer: '===' },
      { id: 'q5', questionText: 'true || false evaluates to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'true', isCorrect: true }, { id: 'b', text: 'false', isCorrect: false }, { id: 'c', text: '0', isCorrect: false }, { id: 'd', text: 'null', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment J1.2 — Type Detective',
    description: 'Given four values, log the typeof each, then show one == vs === comparison that differs. Good: correct types, clear coercion example; rubric: 8 types, 6 comparison, 6 explanation = 20.',
    dueDate: '2026-08-04T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'For values 42, "42", true, null — log typeof each, then show one case where == and === disagree and explain why.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why does == exist if it is unsafe?', marks: 8 }],
  },
})

lessons.push({
  title: 'J1.3 — Lists & Objects',
  duration: 8,
  content: `# J1.3 — Lists & Objects

Arrays are ordered lists; objects are key-value records. Together they model almost all data.

## Learning Objectives
- Create arrays; access by index; push and pop.
- Create objects; read and write properties with dot and bracket syntax.
- Combine them: an array of objects.

## Introduction
An array keeps values in order (0-indexed). An object keeps labeled values. Real records — a student with a name and scores — are objects; a class register is an array of those objects.

## Arrays
const nums = [10, 20, 30];
nums[0];       // 10
nums.length;   // 3
nums.push(40); // add at end -> [10,20,30,40]
nums.pop();    // remove last -> 40
nums[nums.length - 1];  // last item

## Objects
const student = { name: "ada", score: 82 };
student.name;        // 'ada'  (dot)
student["score"];    // 82     (bracket)
student.score = 91;  // update
student.city = "lagos"; // add

## Array of Objects
const students = [
  { name: "ada", score: 82 },
  { name: "bob", score: 91 },
];
students[1].name;   // 'bob'
students[0].score;  // 82

## Worked Example — Best Student
const students = [
  { name: "ada", score: 82 },
  { name: "bob", score: 91 },
  { name: "carol", score: 77 },
];
let best = students[0];
for (const s of students) {
  if (s.score > best.score) best = s;
}
console.log(best.name, best.score); // bob 91

## Practical Exercise
Run this:
const inventory = [
  { item: "pen", price: 12 },
  { item: "bag", price: 150 },
];
console.log(inventory[0].item);
console.log(inventory[1].price);
Tasks: (1) what prints; (2) add a laptop at 900 and log its price. Check: pen then 150; after adding, inventory[2].price is 900.
Expected scaffold lines (copy exactly):
    const inventory = [
      { item: "pen", price: 12 },
      { item: "bag", price: 150 },
    ];
    console.log(inventory[0].item);
    console.log(inventory[1].price);

## Key Takeaways
- Arrays: ordered, 0-indexed, .length, push/pop.
- Objects: labeled properties via dot or bracket syntax.
- Arrays of objects are the standard data shape (JSON, API responses).
- Iterate arrays with for...of; reach object properties with dot notation.

## Quiz Answer Key
1. (b) Array indices start at 0, so nums[0] is the first item.
2. (a) .length gives the number of elements.
3. False — push adds; pop removes the last element.
4. (c) student["score"] is bracket access; both work.
5. (b) students[1].name is 'bob'.
`,
  quiz: {
    title: 'Quiz J1.3 — Lists & Objects',
    description: '5 auto-gradable questions on arrays, objects, and nested access.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'For nums = [10, 20, 30], nums[0] is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '10', isCorrect: true }, { id: 'b', text: '20', isCorrect: false }, { id: 'c', text: '30', isCorrect: false }, { id: 'd', text: '0', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'How do you get the number of elements in an array?', questionType: 'multiple_choice', options: [{ id: 'a', text: '.length', isCorrect: true }, { id: 'b', text: '.size', isCorrect: false }, { id: 'c', text: '.count', isCorrect: false }, { id: 'd', text: 'len()', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: pop() removes the first element of an array.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: student.______ reads the score property (dot syntax).', questionType: 'fill_blank', correctAnswer: 'score' },
      { id: 'q5', questionText: 'students[1].name for [{name:"ada"},{name:"bob"}] is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'ada', isCorrect: false }, { id: 'b', text: 'bob', isCorrect: true }, { id: 'c', text: 'undefined', isCorrect: false }, { id: 'd', text: 'error', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J1.3 — Model Records',
    description: 'Build an array of 4 product objects (name, price), then loop to log each and find the most expensive. Good: correct structure, loop, and max logic; rubric: 6 structure, 5 loop, 5 max, 4 output = 20.',
    dueDate: '2026-08-05T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Create 4 product objects, loop with for...of logging name + price, and track the most expensive item. Show code and output.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why are arrays of objects the standard shape for API data?', marks: 8 }],
  },
})

lessons.push({
  title: 'J1.4 — Conditionals & Logic',
  duration: 8,
  content: `# J1.4 — Conditionals & Logic

if/else chooses a path; truthiness decides what counts as true.

## Learning Objectives
- Write if / else if / else branches.
- Use the ternary operator for compact choices.
- Predict truthy and falsy values.

## Introduction
Conditionals let a program decide. JS also has truthiness: falsy values are false, 0, "", null, undefined, and NaN — everything else is truthy.

## If / Else If / Else
const score = 82;
let grade;
if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else {
  grade = "C";
}
console.log(grade); // B

## Ternary Operator
const status = score >= 60 ? "pass" : "fail";

## Truthiness
if ("") console.log("runs");   // skipped (empty string is falsy)
if ("hi") console.log("runs"); // runs
if (0) ...   // falsy
if ([]) ...  // truthy! (empty array is an object)

## Worked Example — Shipping Cost
const weight = 3;
const zone = "international";
let base = weight < 1 ? 3 : weight < 5 ? 6 : 12;
if (zone === "international") base += 5;
console.log("cost:", base); // 11

## Practical Exercise
Run this:
const temp = 18;
if (temp > 30) {
  console.log("hot");
} else if (temp > 15) {
  console.log("mild");
} else {
  console.log("cold");
}
Tasks: (1) what prints; (2) add an and condition: temp > 15 && sunny prints 'pack shades'. Check: mild; the added branch needs both to be true.
Expected scaffold lines (copy exactly):
    const temp = 18;
    if (temp > 30) {
      console.log("hot");
    } else if (temp > 15) {
      console.log("mild");
    } else {
      console.log("cold");
    }

## Key Takeaways
- if/else if/else picks one path; order matters.
- Ternary (cond ? a : b) is an expression, usable inline.
- Falsy: false, 0, "", null, undefined, NaN. Empty arrays/objects are truthy.
- Use === for comparisons inside conditions.

## Quiz Answer Key
1. (b) else if tests another condition in the chain.
2. (a) 18 is not > 30 but is > 15, so mild prints.
3. False — an empty array is an object, and objects are truthy.
4. (c) The ternary is cond ? a : b.
5. (b) The falsy list is false, 0, "", null, undefined, NaN.
`,
  quiz: {
    title: 'Quiz J1.4 — Conditionals & Logic',
    description: '5 auto-gradable questions on if/else, ternary, and truthiness.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Which branch runs for temp = 18 in the lesson example?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'hot', isCorrect: false }, { id: 'b', text: 'mild', isCorrect: true }, { id: 'c', text: 'cold', isCorrect: false }, { id: 'd', text: 'none', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The ternary operator syntax is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'if (a) b else c', isCorrect: false }, { id: 'b', text: 'a ? b : c', isCorrect: true }, { id: 'c', text: 'a ?? b', isCorrect: false }, { id: 'd', text: 'a || b', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: An empty array [] is falsy in JavaScript.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: The falsy number value is ______.', questionType: 'fill_blank', correctAnswer: '0' },
      { id: 'q5', questionText: 'Which values are falsy?', questionType: 'multiple_choice', options: [{ id: 'a', text: '0, "", null, undefined, NaN', isCorrect: true }, { id: 'b', text: '0, [], ""', isCorrect: false }, { id: 'c', text: '{} and []', isCorrect: false }, { id: 'd', text: 'All numbers', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment J1.4 — Grade Logic',
    description: 'Write a grade calculator (A>=90, B>=80, C>=70, D>=60, F) using else-if, plus a ternary for pass/fail. Good: correct thresholds, ternary usage; rubric: 8 chain, 4 ternary, 4 edge case, 4 explanation = 20.',
    dueDate: '2026-08-06T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the grade function with else-if, show output for 85 and 59, and add a ternary that logs pass/fail for score >= 60.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Give one score where branch order changes the result.', marks: 8 }],
  },
})

lessons.push({
  title: 'J1.5 — Functions',
  duration: 8,
  content: `# J1.5 — Functions

A function packages reusable logic: inputs (parameters) go in, a result (return value) comes out.

## Learning Objectives
- Declare functions and call them.
- Use parameters, arguments, and return values.
- Understand default parameters.

## Introduction
Functions are the primary unit of reuse. function greet(name) { ... } defines one; greet("ada") calls it. return sends a value back; without it, the result is undefined.

## Declarations and Calls
function add(a, b) {
  return a + b;
}
const total = add(3, 5); // 8

## No Return = undefined
function logIt(x) {
  console.log(x);
}
const r = logIt(1); // logs 1, r is undefined

## Default Parameters
function tax(amount, rate = 0.1) {
  return amount * rate;
}
tax(100);      // 10
 tax(100, 0.2); // 20

## Worked Example — Circle Area
function circleArea(radius) {
  return Math.PI * radius ** 2;
}
console.log(circleArea(3).toFixed(2)); // 28.27

## Practical Exercise
Run this:
function tax(amount, rate = 0.1) {
  return amount * rate;
}
console.log(tax(100));
console.log(tax(100, 0.2));
Tasks: (1) what prints; (2) write totalWithTax = 100 + tax(100) and log it. Check: 10 then 20; totalWithTax is 110.
Expected scaffold lines (copy exactly):
    function tax(amount, rate = 0.1) {
      return amount * rate;
    }
    console.log(tax(100));
    console.log(tax(100, 0.2));

## Key Takeaways
- function name(params) { ... return value; } — declaration and body.
- return ends the function and hands back a value; missing return is undefined.
- Default parameters (rate = 0.1) make arguments optional.
- Small single-purpose functions are easier to test and name.

## Quiz Answer Key
1. (b) return sends a value back to the caller and ends the function.
2. (a) A function without return gives undefined.
3. False — the default is used only when the argument is omitted.
4. (c) circleArea(3) = PI * 9, about 28.27.
5. (b) tax(100, 0.2) uses the passed rate, giving 20.
`,
  quiz: {
    title: 'Quiz J1.5 — Functions',
    description: '5 auto-gradable questions on declarations, returns, and defaults.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'What does return do?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Logs a value', isCorrect: false }, { id: 'b', text: 'Ends the function and sends a value back', isCorrect: true }, { id: 'c', text: 'Declares a variable', isCorrect: false }, { id: 'd', text: 'Throws an error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'A function with no return returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'undefined', isCorrect: true }, { id: 'b', text: 'null', isCorrect: false }, { id: 'c', text: '0', isCorrect: false }, { id: 'd', text: 'NaN', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: tax(100) uses 0.2 when the function has rate = 0.1 as default.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: The values a function receives are called ______.', questionType: 'fill_blank', correctAnswer: 'parameters' },
      { id: 'q5', questionText: 'add(3, 5) with return a + b gives:', questionType: 'multiple_choice', options: [{ id: 'a', text: '35', isCorrect: false }, { id: 'b', text: '8', isCorrect: true }, { id: 'c', text: '15', isCorrect: false }, { id: 'd', text: 'undefined', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J1.5 — Function Library',
    description: 'Write three functions: celsiusToFahrenheit, isEven, and max3 (largest of three). Test each. Good: correct formulas/logic, tests shown; rubric: 6 convert, 4 isEven, 6 max3, 4 tests = 20.',
    dueDate: '2026-08-07T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Implement and test the three functions, showing outputs for celsiusToFahrenheit(100), isEven(7), max3(3, 9, 5).', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why keep functions small and single-purpose?', marks: 8 }],
  },
})

lessons.push({
  title: 'J1.6 — Errors & Debugging',
  duration: 8,
  content: `# J1.6 — Errors & Debugging

Errors are messages. The console tells you the type, the message, and the line number.

## Learning Objectives
- Recognize the common error types: SyntaxError, ReferenceError, TypeError.
- Read a stack trace to locate the failing line.
- Debug with console.log and isolate the failing line.

## Introduction
When JS hits a problem it throws an error and stops. The console shows a stack trace: the error type, a message, and the file and line where it happened. Reading it bottom-up points at the cause.

## Common Errors
// SyntaxError: missing ) — the code cannot be parsed
console.log("hi";

// ReferenceError: using an undeclared name
console.log(price); // ReferenceError: price is not defined

// TypeError: wrong operation on a type
const n = null;
n.foo; // TypeError: Cannot read properties of null

## Debugging Strategy
1. Read the error type and message.
2. Jump to the named line.
3. console.log intermediate values.
4. Comment out code to bisect the problem.

## Worked Example — Fixing a Type Error
const scores = [80, 95, 60];
console.log(scores.len);      // undefined — wrong property
console.log(scores.length);   // 3 — correct

## Practical Exercise
The code below throws. Find and fix the bug.
const numbers = [1, 2, 3];
let total = 0;
for (const n of numbers) {
  total = total + n;
}
console.log("total is " + total);
Tasks: (1) does it throw? (2) change to numbers = null and see the error type. Check: the original works (total is 6); with null, the for...of throws TypeError — not iterable.
Expected scaffold lines (copy exactly):
    const numbers = [1, 2, 3];
    let total = 0;
    for (const n of numbers) {
      total = total + n;
    }
    console.log("total is " + total);

## Key Takeaways
- SyntaxError: unparsable code. ReferenceError: unknown name. TypeError: wrong type use.
- Stack traces name the file and line — read them first.
- console.log and bisection (comment-out) find most bugs quickly.
- undefined property access is a silent bug; strict checks catch it.

## Quiz Answer Key
1. (b) ReferenceError is thrown for an undeclared name.
2. (a) SyntaxError means the code cannot be parsed.
3. False — TypeError is the type-mismatch error; undefined property access is also a TypeError on null.
4. (b) The stack trace names the file and line.
5. (c) for...of over null throws TypeError: not iterable.
`,
  quiz: {
    title: 'Quiz J1.6 — Errors & Debugging',
    description: '5 auto-gradable questions on error types and debugging.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'console.log(price) with no price declared throws:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'SyntaxError', isCorrect: false }, { id: 'b', text: 'ReferenceError', isCorrect: true }, { id: 'c', text: 'TypeError', isCorrect: false }, { id: 'd', text: 'Nothing', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'A missing closing parenthesis causes:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'SyntaxError', isCorrect: true }, { id: 'b', text: 'ReferenceError', isCorrect: false }, { id: 'c', text: 'TypeError', isCorrect: false }, { id: 'd', text: 'RangeError', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Reading a property of null throws a TypeError.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Fill in the blank: The ______ trace names the file and line of the error.', questionType: 'fill_blank', correctAnswer: 'stack' },
      { id: 'q5', questionText: 'for (const n of null) throws:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'SyntaxError', isCorrect: false }, { id: 'b', text: 'ReferenceError', isCorrect: false }, { id: 'c', text: 'TypeError', isCorrect: true }, { id: 'd', text: 'It works', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment J1.6 — Debug Three Snippets',
    description: 'Three buggy snippets: identify the error type, give the one-line fix, and state the corrected output. Good: correct types, minimal fixes; rubric: 6 types, 6 fixes, 6 outputs, 2 clarity = 20.',
    dueDate: '2026-08-08T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Snippet A: console.log(len([1,2])); Snippet B: null.foo; Snippet C: if (x = 5) {}. For each: error type, fix, corrected output.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'What is your single most useful debugging habit?', marks: 8 }],
  },
})

export const module01: ModuleData = {
  title: 'Module 1 — JS Fundamentals',
  lessons,
}
