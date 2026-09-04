// ─── JavaScript Course — Module 5: Objects, the DOM & the Browser ───────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'J5.1 — Objects Deep Dive',
  duration: 8,
  content: `# J5.1 — Objects Deep Dive

Objects hold methods, use this, and can be destructured and spread.

## Learning Objectives
- Add methods to objects and use this.
- Destructure objects into variables.
- Copy and merge objects with the spread operator.

## Introduction
Methods are properties whose values are functions. Inside a method, this refers to the object. Destructuring pulls fields into variables in one line; spread (...) copies and merges.

## Methods and this
const account = {
  owner: "ada",
  balance: 100,
  deposit(amount) {
    this.balance += amount;   // this = account
    return this.balance;
  },
};
account.deposit(50); // 150

## Destructuring
const student = { name: "ada", score: 91, city: "lagos" };
const { name, score } = student;
console.log(name, score); // ada 91

function label({ name, score }) {
  return name + ": " + score;
}
console.log(label(student)); // ada: 91

## Spread — Copy and Merge
const base = { theme: "dark", font: 14 };
const user = { font: 16 };
const settings = { ...base, ...user };  // later keys win
console.log(settings); // { theme: 'dark', font: 16 }

## Worked Example — Immutable Update
const task = { id: 1, done: false, title: "write" };
const completed = { ...task, done: true };   // new object, original untouched
console.log(task.done, completed.done);      // false true

## Practical Exercise
Run this:
const cart = {
  items: [],
  add(item) {
    this.items.push(item);
    return this.items.length;
  },
};
cart.add("pen");
cart.add("book");
console.log(cart.items);
Tasks: (1) what prints; (2) add a total method summing item prices. Check: ['pen', 'book']; total uses this.items.reduce.
Expected scaffold lines (copy exactly):
    const cart = {
      items: [],
      add(item) {
        this.items.push(item);
        return this.items.length;
      },
    };
    cart.add("pen");
    cart.add("book");
    console.log(cart.items);

## Key Takeaways
- Method shorthand: deposit(amount) { ... } inside an object literal.
- this in a method refers to the object before the dot.
- Destructuring (const { a, b } = obj) unpacks fields cleanly.
- Spread creates shallow copies — great for immutable updates.

## Quiz Answer Key
1. (b) In account.deposit(), this is account.
2. (a) const { name } = student unpacks the name field.
3. False — spread makes a shallow copy; the original object is unchanged.
4. (c) In { ...base, ...user }, later keys overwrite earlier ones.
5. (b) completed.done is true and task.done stays false.
`,
  quiz: {
    title: 'Quiz J5.1 — Objects Deep Dive',
    description: '5 auto-gradable questions on methods, this, destructuring, and spread.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Inside account.deposit(), this refers to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The function', isCorrect: false }, { id: 'b', text: 'account', isCorrect: true }, { id: 'c', text: 'window always', isCorrect: false }, { id: 'd', text: 'undefined', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'const { name } = student does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Extracts name into a variable', isCorrect: true }, { id: 'b', text: 'Deletes name', isCorrect: false }, { id: 'c', text: 'Copies the object', isCorrect: false }, { id: 'd', text: 'Renames name', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: { ...task, done: true } mutates task.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: In merged objects, ______ keys win.', questionType: 'fill_blank', correctAnswer: 'later' },
      { id: 'q5', questionText: 'Destructuring in parameters, function label({ name }) { }, receives:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'An array', isCorrect: false }, { id: 'b', text: 'An object and unpacks name', isCorrect: true }, { id: 'c', text: 'A string', isCorrect: false }, { id: 'd', text: 'Nothing', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J5.1 — Immutable State',
    description: 'Build a state object with actions returning new objects (no mutation): addItem, removeItem, toggleDone. Good: spread-based updates, tests shown; rubric: 8 updates, 6 immutability, 6 tests = 20.',
    dueDate: '2026-08-21T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Implement three pure actions on a todo state object using spread, and show the state before and after each call.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why does immutability make debugging easier?', marks: 8 }],
  },
})

lessons.push({
  title: 'J5.2 — The Document Object Model',
  duration: 8,
  content: `# J5.2 — The Document Object Model

The DOM is the browser's tree of page elements. JavaScript selects nodes and reads or changes them.

## Learning Objectives
- Select elements with querySelector and getElementById.
- Read text and attribute values.
- Create and append new elements.

## Introduction
document is the root of the DOM. querySelector takes any CSS selector and returns the first match. Once you have a node, you can read textContent, change styles, or insert new nodes.

## Selecting Elements
const byId = document.getElementById("title");
const byClass = document.querySelector(".card");       // first match
const allCards = document.querySelectorAll(".card");   // NodeList of all

## Reading and Writing
title.textContent;              // read the text
title.textContent = "New title"; // change it
img.src;                        // read attribute

## Creating Elements
const div = document.createElement("div");
div.textContent = "hello";
div.classList.add("note");
document.body.appendChild(div);

## Worked Example — Count Paragraphs
const paras = document.querySelectorAll("p");
console.log("paragraphs:", paras.length);
paras.forEach((p) => console.log(p.textContent.slice(0, 30)));

## Practical Exercise
Open any page in the browser console and run:
const h1 = document.querySelector("h1");
console.log(h1 ? h1.textContent : "no h1 found");
Tasks: (1) what prints; (2) change the h1 text to "Hello DOM" and describe what you see. Check: the page's first heading text; the visible heading changes immediately.
Expected scaffold lines (copy exactly):
    const h1 = document.querySelector("h1");
    console.log(h1 ? h1.textContent : "no h1 found");

## Key Takeaways
- querySelector uses CSS selectors; querySelectorAll returns all matches.
- textContent reads/writes text; classList manages classes.
- createElement + appendChild add nodes to the page.
- The browser console is the fastest DOM playground.

## Quiz Answer Key
1. (b) querySelector(".card") returns the first element with class card.
2. (a) textContent reads or writes the text of a node.
3. False — querySelectorAll returns a NodeList of all matches.
4. (c) appendChild inserts the new node into the DOM.
5. (b) h1.textContent = "Hi" changes the rendered heading.
`,
  quiz: {
    title: 'Quiz J5.2 — The DOM',
    description: '5 auto-gradable questions on selecting and changing DOM nodes.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'querySelector(".card") returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'All cards', isCorrect: false }, { id: 'b', text: 'The first .card element', isCorrect: true }, { id: 'c', text: 'An array', isCorrect: false }, { id: 'd', text: 'null always', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'To read an element text, use:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'el.textContent', isCorrect: true }, { id: 'b', text: 'el.text', isCorrect: false }, { id: 'c', text: 'el.inner', isCorrect: false }, { id: 'd', text: 'el.value', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: querySelectorAll returns a single element.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: document.______("div") creates a new div node.', questionType: 'fill_blank', correctAnswer: 'createElement' },
      { id: 'q5', questionText: 'classList.add("note") does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Replaces all classes', isCorrect: false }, { id: 'b', text: 'Adds one class', isCorrect: true }, { id: 'c', text: 'Creates an element', isCorrect: false }, { id: 'd', text: 'Deletes the node', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J5.2 — DOM Inspector',
    description: 'On any web page, write a script that counts images, lists the first 5 link texts, and highlights all headings by changing their color. Good: correct selectors, visible effect; rubric: 6 count, 6 links, 8 highlight = 20.',
    dueDate: '2026-08-22T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the three-part inspector script using querySelectorAll and style changes. Describe what you observed on the page you tested.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is querySelector preferred over older DOM APIs?', marks: 8 }],
  },
})

lessons.push({
  title: 'J5.3 — Changing Content & Classes',
  duration: 8,
  content: `# J5.3 — Changing Content & Classes

Update what users see: text, styles, and classes. classList is the clean way to toggle appearance.

## Learning Objectives
- Update text safely with textContent.
- Toggle classes with classList add/remove/toggle.
- Change inline styles directly.

## Introduction
A page updates by changing nodes. Prefer textContent (safe) over innerHTML (can inject markup). Classes drive styling: define styles in CSS, then flip classes from JS.

## Text vs HTML
el.textContent = "2 < 3";   // shows the literal text — safe
el.innerHTML = "2 <b>3</b>"; // parses markup — use with care

## classList
div.classList.add("active");
div.classList.remove("hidden");
div.classList.toggle("open");     // flips on/off
div.classList.contains("active"); // boolean check

## Inline Styles
box.style.backgroundColor = "teal";
box.style.display = "none";   // hides the element

## Worked Example — Dark Mode Toggle
const button = document.querySelector("#theme");
button.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

## Practical Exercise
In the console on any page, run:
const h1 = document.querySelector("h1");
h1.textContent = "Owned by JS";
h1.style.color = "tomato";
Tasks: (1) what changed; (2) toggle a class twice and watch. Check: heading text and color changed; toggle flips the class each run.
Expected scaffold lines (copy exactly):
    const h1 = document.querySelector("h1");
    h1.textContent = "Owned by JS";
    h1.style.color = "tomato";

## Key Takeaways
- textContent is safe; innerHTML can execute markup.
- classList add/remove/toggle/contains cover class work.
- Style in CSS, flip classes in JS.
- style.* writes inline styles — highest specificity, use sparingly.

## Quiz Answer Key
1. (b) textContent writes plain text without parsing markup.
2. (a) toggle flips the class: adds if missing, removes if present.
3. False — an element can hold many classes.
4. (c) el.style.display = "none" hides it.
5. (b) Define styles in CSS, toggle classes from JS.
`,
  quiz: {
    title: 'Quiz J5.3 — Content & Classes',
    description: '5 auto-gradable questions on textContent, classList, and styles.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Safer for user-provided text:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'innerHTML', isCorrect: false }, { id: 'b', text: 'textContent', isCorrect: true }, { id: 'c', text: 'document.write', isCorrect: false }, { id: 'd', text: 'eval', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'classList.toggle("open") does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Always adds', isCorrect: false }, { id: 'b', text: 'Adds if missing, removes if present', isCorrect: true }, { id: 'c', text: 'Always removes', isCorrect: false }, { id: 'd', text: 'Renames', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: An element can have many classes.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Fill in the blank: el.style.______ = "none" hides an element.', questionType: 'fill_blank', correctAnswer: 'display' },
      { id: 'q5', questionText: 'Best practice for theming is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Inline styles in JS', isCorrect: false }, { id: 'b', text: 'Toggle a CSS class', isCorrect: true }, { id: 'c', text: 'Reload the page', isCorrect: false }, { id: 'd', text: 'Use alert', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J5.3 — Theme Switcher',
    description: 'Build a page with a button toggling a .dark class on body, styled in CSS. Good: working toggle, CSS-only styling; rubric: 8 toggle, 6 CSS, 6 explanation = 20.',
    dueDate: '2026-08-23T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the button HTML, the CSS .dark rules, and the JS toggle listener.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is inline styling discouraged for themes?', marks: 8 }],
  },
})

lessons.push({
  title: 'J5.4 — Events',
  duration: 8,
  content: `# J5.4 — Events

Events are how pages respond: clicks, typing, submits. addEventListener connects behavior to elements.

## Learning Objectives
- Attach listeners with addEventListener.
- Read event data (target, key, value).
- Understand bubbling and event delegation.

## Introduction
The browser fires events as the user interacts. addEventListener(type, handler) registers a callback. The handler receives an event object — event.target tells you what was clicked.

## Click Handling
const button = document.querySelector("#save");
button.addEventListener("click", () => {
  console.log("saved!");
});

## Reading the Event
document.addEventListener("click", (event) => {
  console.log("clicked:", event.target.tagName);
});

## Keyboard Events
const input = document.querySelector("#search");
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    console.log("search for:", input.value);
  }
});

## Worked Example — Counter Button
let count = 0;
const btn = document.querySelector("#counter");
btn.addEventListener("click", () => {
  count++;
  btn.textContent = "clicked " + count + " times";
});

## Practical Exercise
In the console on any page, run:
document.body.addEventListener("click", (e) => {
  console.log("you clicked:", e.target.tagName);
});
Tasks: (1) click around and watch the log; (2) why does clicking a child still log through body? Check: every click logs a tag name; events bubble from target up to body.
Expected scaffold lines (copy exactly):
    document.body.addEventListener("click", (e) => {
      console.log("you clicked:", e.target.tagName);
    });

## Key Takeaways
- addEventListener(type, handler) attaches; removal needs the same function reference.
- event.target is the deepest element clicked; events bubble upward.
- keydown carries e.key; inputs fire input events on change.
- One listener on a parent can serve many children (delegation).

## Quiz Answer Key
1. (b) addEventListener attaches a handler to an event type.
2. (a) e.target is the element where the event originated.
3. False — events bubble up to ancestors.
4. (c) Bubbling lets a parent handle child events.
5. (b) Event delegation: one parent listener serves many children.
`,
  quiz: {
    title: 'Quiz J5.4 — Events',
    description: '5 auto-gradable questions on listeners, targets, and bubbling.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Which method attaches an event handler?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'on()', isCorrect: false }, { id: 'b', text: 'addEventListener()', isCorrect: true }, { id: 'c', text: 'listen()', isCorrect: false }, { id: 'd', text: 'attach()', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'event.target is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The body', isCorrect: false }, { id: 'b', text: 'The element where the event originated', isCorrect: true }, { id: 'c', text: 'The handler', isCorrect: false }, { id: 'd', text: 'Always null', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: Events never propagate to parent elements.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: input.addEventListener("______", ...) fires on value changes per keystroke.', questionType: 'fill_blank', correctAnswer: 'input' },
      { id: 'q5', questionText: 'One parent listener serving many children is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Bubbling abuse', isCorrect: false }, { id: 'b', text: 'Event delegation', isCorrect: true }, { id: 'c', text: 'Hoisting', isCorrect: false }, { id: 'd', text: 'Cloning', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J5.4 — Interactive Page',
    description: 'Build a click counter button and a live character counter on an input. Good: two working listeners; rubric: 8 counter, 6 live count, 6 explanation = 20.',
    dueDate: '2026-08-24T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the HTML for a button and input plus the JS for both handlers.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why prefer one delegated listener over many child listeners?', marks: 8 }],
  },
})

lessons.push({
  title: 'J5.5 — Forms & Validation',
  duration: 8,
  content: `# J5.5 — Forms & Validation

Forms collect input. Handle the submit event, preventDefault, read fields, and validate before accepting.

## Learning Objectives
- Intercept form submits with preventDefault.
- Read field values from form controls.
- Validate input and show inline errors.

## Introduction
By default a form submit reloads the page. Calling event.preventDefault() stops that so JS can take over: read values, validate, and respond — the SPA pattern behind every modern web app.

## Intercepting Submit
const form = document.querySelector("#signup");
form.addEventListener("submit", (e) => {
  e.preventDefault();                 // stop the page reload
  const name = form.elements.name.value;
  console.log("submitting:", name);
});

## Reading Fields
form.elements.email.value;   // text input
form.elements.age.valueAsNumber; // number input as a number
form.elements.terms.checked;  // checkbox boolean

## Validation
if (name.trim() === "") {
  errorEl.textContent = "name is required";
  return;
}
if (!email.includes("@")) {
  errorEl.textContent = "email looks wrong";
  return;
}

## Worked Example — Signup Validator
const form = document.querySelector("#signup");
const errorEl = document.querySelector(".error");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = form.elements.email.value.trim();
  if (email.length < 5 || !email.includes("@")) {
    errorEl.textContent = "enter a valid email";
    return;
  }
  errorEl.textContent = "";
  console.log("welcome, " + email);
});

## Practical Exercise
Build a mini form in the console:
const f = document.createElement("form");
f.innerHTML = '<input name="city"><button>go</button>';
document.body.appendChild(f);
f.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("city:", f.elements.city.value);
});
Tasks: (1) submit empty — what logs; (2) type lagos and submit. Check: city: (empty string); then city: lagos, no page reload.
Expected scaffold lines (copy exactly):
    const f = document.createElement("form");
    f.innerHTML = '<input name="city"><button>go</button>';
    document.body.appendChild(f);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("city:", f.elements.city.value);
    });

## Key Takeaways
- preventDefault() stops the submit reload — the first line of any JS form handler.
- form.elements.NAME reads controls; .checked for checkboxes, valueAsNumber for numbers.
- Validate before accepting; show errors near the field.
- HTML attributes (required, type=email) give baseline validation; JS adds the rest.

## Quiz Answer Key
1. (b) e.preventDefault() stops the default submit navigation.
2. (a) form.elements.email.value reads the field.
3. False — trim removes whitespace so "   " fails a required check.
4. (c) .checked is the boolean for checkboxes.
5. (b) Validating in JS gives immediate, styled feedback without reloads.
`,
  quiz: {
    title: 'Quiz J5.5 — Forms & Validation',
    description: '5 auto-gradable questions on submit handling and validation.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'What does e.preventDefault() do in a submit handler?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Clears the form', isCorrect: false }, { id: 'b', text: 'Stops the default page reload', isCorrect: true }, { id: 'c', text: 'Validates the form', isCorrect: false }, { id: 'd', text: 'Submits twice', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Reading a text field value:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'form.elements.name.value', isCorrect: true }, { id: 'b', text: 'form.name.text', isCorrect: false }, { id: 'c', text: 'form.getName()', isCorrect: false }, { id: 'd', text: 'name.value()', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: "   ".trim() === "" is true.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Fill in the blank: A checkbox field is read with form.elements.terms.______.', questionType: 'fill_blank', correctAnswer: 'checked' },
      { id: 'q5', questionText: 'Why validate in JS when HTML has required?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'No reason', isCorrect: false }, { id: 'b', text: 'Immediate styled feedback and custom rules', isCorrect: true }, { id: 'c', text: 'HTML validation is illegal', isCorrect: false }, { id: 'd', text: 'It is faster', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J5.5 — Signup Form',
    description: 'Build a signup form validating name (non-empty), email (contains @), and password (8+ chars), with inline errors. Good: three validations, clear errors; rubric: 6 handler, 8 validations, 6 errors = 20.',
    dueDate: '2026-08-25T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the form HTML plus the JS submit handler with three validations and inline error messages. Show code.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why validate again on the server even if JS checks pass?', marks: 8 }],
  },
})

lessons.push({
  title: 'J5.6 — Fetch & Async',
  duration: 10,
  content: `# J5.6 — Fetch & Async

Network calls take time. Promises and async/await let JS wait without freezing the page.

## Learning Objectives
- Fetch JSON from an API with fetch and .json().
- Use async/await with try/catch for readable async code.
- Explain what a Promise represents.

## Introduction
fetch(url) starts a request and immediately returns a Promise — a value that will exist later. await pauses inside an async function until it resolves. try/catch handles failures.

## Promise Basics
const p = fetch("https://api.github.com/users/octocat");
console.log(p); // Promise { <pending> } — a future value

## Async/Await
async function getUser(name) {
  try {
    const response = await fetch("https://api.github.com/users/" + name);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("failed:", err.message);
    return null;
  }
}

## Rendering the Result
async function show() {
  const user = await getUser("octocat");
  if (user) {
    document.querySelector("#profile").textContent = user.login + " joined " + user.created_at;
  }
}

## Worked Example — Loading State
async function load() {
  const el = document.querySelector("#status");
  el.textContent = "loading...";
  const user = await getUser("octocat");
  el.textContent = user ? "loaded " + user.login : "could not load";
}

## Practical Exercise
Run this in the browser console:
async function demo() {
  const res = await fetch("https://api.github.com/users/octocat");
  const data = await res.json();
  console.log(data.login, data.public_repos);
}
demo();
Tasks: (1) why does the log appear after demo() returns; (2) add try/catch with a bad URL and see the error path. Check: fetch is async — demo returns a Promise first; the catch logs the failure instead of crashing.
Expected scaffold lines (copy exactly):
    async function demo() {
      const res = await fetch("https://api.github.com/users/octocat");
      const data = await res.json();
      console.log(data.login, data.public_repos);
    }
    demo();

## Key Takeaways
- A Promise is a placeholder for a future value: pending, then fulfilled or rejected.
- await pauses only the async function — the page stays responsive.
- response.ok guards HTTP errors; .json() is itself async.
- try/catch around await handles both network and parsing failures.

## Quiz Answer Key
1. (b) fetch returns a Promise immediately; the data arrives later.
2. (a) await pauses the async function without blocking the page.
3. False — a 404 still resolves; check response.ok to catch HTTP errors.
4. (c) response.json() parses the body and returns a Promise.
5. (b) try/catch around await catches network and parse failures.
`,
  quiz: {
    title: 'Quiz J5.6 — Fetch & Async',
    description: '5 auto-gradable questions on promises, async/await, and fetch.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'fetch(url) returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The data directly', isCorrect: false }, { id: 'b', text: 'A Promise', isCorrect: true }, { id: 'c', text: 'JSON', isCorrect: false }, { id: 'd', text: 'A string', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'await can be used:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Anywhere', isCorrect: false }, { id: 'b', text: 'Inside async functions (or top-level in modules)', isCorrect: true }, { id: 'c', text: 'Only in loops', isCorrect: false }, { id: 'd', text: 'Only with POST', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: A 404 response makes fetch throw automatically.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: The ______ property tells you if an HTTP response succeeded.', questionType: 'fill_blank', correctAnswer: 'ok' },
      { id: 'q5', questionText: 'While awaiting, the page:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Freezes', isCorrect: false }, { id: 'b', text: 'Stays responsive', isCorrect: true }, { id: 'c', text: 'Reloads', isCorrect: false }, { id: 'd', text: 'Closes', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J5.6 — API Viewer',
    description: 'Build a small page: input for a GitHub username, button that fetches and displays login and public repos, with a loading state and error handling. Good: async handler, ok check, UI states; rubric: 6 fetch, 6 states, 8 error handling = 20.',
    dueDate: '2026-08-26T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write the HTML input/button plus the async handler with loading, success, and error states. Show code.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why show a loading state instead of nothing?', marks: 8 }],
  },
})

lessons.push({
  title: 'J5.7 — Mini Project: A To-Do List App',
  duration: 15,
  content: `# J5.7 — Mini Project: A To-Do List App

Combine DOM, events, forms, and array state into one working app — the classic first project.

## Learning Objectives
- Keep app state in an array and render from it.
- Add and remove items through the DOM.
- Re-render the list after every state change.

## Introduction
The pattern: state (an array of tasks) is the source of truth. Events mutate state, then a render function redraws the list. You never edit the DOM directly to remove an item — you update state and re-render. This is exactly how React works later.

## State and Render
let todos = [];

function render() {
  const list = document.querySelector("#list");
  list.textContent = "";
  for (const todo of todos) {
    const li = document.createElement("li");
    li.textContent = todo.text + (todo.done ? " ✓" : "");
    li.addEventListener("click", () => toggle(todo.id));
    list.appendChild(li);
  }
}

## Adding
const form = document.querySelector("#add");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = form.elements.task.value.trim();
  if (text === "") return;
  todos.push({ id: Date.now(), text: text, done: false });
  form.reset();
  render();
});

## Toggling and Deleting
function toggle(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  render();
}
function remove(id) {
  todos = todos.filter((t) => t.id !== id);
  render();
}

## Practical Exercise
Assemble the pieces in a page with #add form and #list ul. Add two tasks, click one to complete it.
Tasks: (1) what shows in the list; (2) add a delete button per item wired to remove(). Check: two items render; clicking flips the check; delete removes without touching other items.
Expected scaffold lines (copy exactly):
    let todos = [];
    function render() {
      const list = document.querySelector("#list");
      list.textContent = "";
      for (const todo of todos) {
        const li = document.createElement("li");
        li.textContent = todo.text + (todo.done ? " done" : "");
        li.addEventListener("click", () => toggle(todo.id));
        list.appendChild(li);
      }
    }

## Key Takeaways
- State first, render second: the DOM is a function of state.
- Immutable updates (map/filter with spread) keep state predictable.
- form.reset() clears inputs after handling submit.
- The render-from-state pattern transfers directly to React, Vue, and Svelte.

## Quiz Answer Key
1. (b) State is the source of truth; the DOM is rendered from it.
2. (a) toggle maps over todos, flipping done on the matching id.
3. False — remove uses filter, which returns a new array without the item.
4. (c) form.reset() clears the inputs.
5. (b) Rendering from state is exactly the React model.
`,
  quiz: {
    title: 'Quiz J5.7 — To-Do Mini Project',
    description: '5 auto-gradable questions on state-driven rendering.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'In the todo app, the source of truth is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The DOM', isCorrect: false }, { id: 'b', text: 'The todos array', isCorrect: true }, { id: 'c', text: 'The form', isCorrect: false }, { id: 'd', text: 'localStorage', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'toggle(id) uses:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'map with spread to flip done', isCorrect: true }, { id: 'b', text: 'Direct DOM edit', isCorrect: false }, { id: 'c', text: 'A while loop', isCorrect: false }, { id: 'd', text: 'innerHTML', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: remove(id) mutates the todos array in place.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: After handling a submit, ______ clears the form fields.', questionType: 'fill_blank', correctAnswer: 'reset' },
      { id: 'q5', questionText: 'The render-from-state pattern is the core of:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'CSS', isCorrect: false }, { id: 'b', text: 'React and modern frameworks', isCorrect: true }, { id: 'c', text: 'HTML forms', isCorrect: false }, { id: 'd', text: 'Git', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment J5.7 — Extend the To-Do App',
    description: 'Add a delete button per item, a task counter (n left), and localStorage persistence. Good: three features working; rubric: 6 delete, 6 counter, 8 persistence = 20.',
    dueDate: '2026-08-27T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Extend the app with the three features; show the changed functions (render additions, save/load with localStorage).', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why save state instead of relying on the DOM?', marks: 8 }],
  },
})

export const module05: ModuleData = {
  title: 'Module 5 — Objects, the DOM & the Browser',
  lessons,
}
