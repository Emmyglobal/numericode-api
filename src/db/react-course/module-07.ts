// ─── React Course — Module 7: Events and Forms ───────────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module07: ModuleData = moduleOf('Module 7 — Events and Forms', [
  lesson('R7.1 — React Events and Click Handlers', {
    duration: 14,
    intro: 'Every interactive app answers the student: a click, a keystroke, a form submission. React listens for those events with properties you already know from HTML, plus a couple of small differences.',
    objectives: [
      'Attach an event handler with onClick',
      'Pass a function instead of calling it',
      'Read the event object when you need extra detail',
    ],
    teach: [
      ['An Event Is "Something Happened"', 'The browser reports everything that happens: a click, a key press, a form being sent. React lets you subscribe to those reports with props whose names start with `on`.\n\n```jsx\n<button onClick={handleClick}>Save</button>\n```\n\nRead it as: *when this button is clicked, run this function.*'],
      ['Two Spellings That Trip Everyone Up', 'In HTML you write `onclick`, in JSX you write `onClick` — camelCase, and the value is a **function**, not a string.\n\n```jsx\n<button onClick={handleClick}>Save</button>      // correct\n<button onClick={handleClick()}>Save</button>   // wrong: runs immediately\n<button onClick="handleClick()">Save</button>   // wrong: a string, not a function\n```\n\nThe second line calls the function while rendering, which is one of the most common beginner bugs.'],
      ['Reading Details From the Event', 'The handler receives an event object with useful details, such as which key was pressed or which form field changed:\n\n```jsx\nfunction onKey(event) {\n  if (event.key === "Enter") search();\n}\n```'],
    ],
    code: {
      language: 'jsx',
      title: 'A Button That Answers the Click',
      code: `function LikeButton() {
  const [likes, setLikes] = useState(0);

  function addLike() {
    setLikes(likes + 1);
  }

  return (
    <div>
      <p>{likes} students liked this lesson</p>
      <button onClick={addLike}>Like</button>
    </div>
  );
}`,
      explain: '`addLike` is passed to `onClick`, not called. React stores the function and runs it when the click happens.\n\nInside, the setter updates state, React re-renders and the paragraph shows the new number — the click never touches the DOM directly.',
    },
    tryIt: {
      task: 'Build a button that counts how many times it was pressed.',
      steps: [
        'Create `PressCounter` with state `count` starting at 0.',
        'Add a button whose `onClick` increases the count by one.',
        'Add a second button that resets the count to 0.',
      ],
      starter: `function PressCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Pressed {count} times</p>
      {/* two buttons: add one, and reset */}
    </div>
  );
}`,
      expected: 'Each press of the first button increases the number; the second button returns it to zero.',
    },
    mistakes: [
      ['Writing `onClick={handleClick()}`', 'The parentheses call the function immediately — on every render — instead of waiting for the click.'],
      ['Using the string form `onClick="..."`', 'JSX expects a function or arrow function, not a string. Use `onClick={() => doSomething()}`.'],
    ],
    check: ['Which line attaches a click handler correctly?', [
      '<button onClick={save}>Save</button>',
      '<button onClick={save()}>Save</button>',
      '<button onclick="save">Save</button>',
      '<button click={save}>Save</button>',
    ], 0, 'JSX uses camelCase `onClick` and receives the function itself (no parentheses).'],
    summary: [
      'React events use camelCase props such as `onClick` and `onChange`.',
      'Pass the function itself; adding `()` runs it during render.',
      'The handler receives an event object with extra details.',
    ],
    quiz: [
      mcq('Which prop name is correct in JSX?', ['onClick', 'onclick', 'click', 'on-click'], 0, 'React event props are camelCase, so onClick.'),
      mcq('What is wrong with `onClick={handleClick()}`?', ['It runs the function immediately, on every render', 'Nothing — it is correct', 'It needs a string instead', 'It stops the event'], 0, 'The parentheses call the function while rendering instead of on the click.'),
      fill('A function passed to an event prop is called an event ______.', 'handler', 'The handler is the function React runs when the event happens.'),
      tf('You can attach the same handler function to several buttons.', true, 'Handlers are ordinary functions and can be reused by any element.'),
      mcq('Which code stops the whole page from reloading when a button is inside a form?', ['event.preventDefault() inside the handler', 'event.stop()', 'window.reload(false)', 'return true'], 0, 'preventDefault() cancels the browser\'s default action, such as sending the form.'),
    ],
  }),

  lesson('R7.2 — Forms, Controlled Inputs and Validation', {
    duration: 18,
    intro: 'A form is where the student talks back to your app. React keeps the input value in state, so you always know what was typed — which makes validation and helpful feedback straightforward.',
    objectives: [
      'Build a controlled input with value and onChange',
      'Handle several fields in one state object',
      'Validate input and give useful feedback',
    ],
    teach: [
      ['Controlled Inputs', 'An input is **controlled** when React owns its value:\n\n```jsx\n<input value={name} onChange={e => setName(e.target.value)} />\n```\n\nThe value always comes from state and every keystroke updates it, so validation is always in step with what the student sees.'],
      ['One State Object for Many Fields', '```jsx\nconst [form, setForm] = useState({ name: "", email: "" });\n\nfunction change(event) {\n  const { name, value } = event.target;\n  setForm(previous => ({ ...previous, [name]: value }));\n}\n```\n\nThe spread copies the other fields and `[name]: value` updates only the changed one — so each input needs a matching `name` attribute.'],
      ['Submitting and Validating', 'On submit, call `event.preventDefault()` first: without it the browser reloads the page and wipes your state.\n\nThen check the rules, collect the messages and show each one next to its field. Only when every rule passes do you send the data — and only after success do you clear the form and confirm what happened.'],
    ],
    code: {
      language: 'jsx',
      title: 'A Small Registration Form',
      code: `function submit(event) {
  event.preventDefault();
  const next = {};
  if (form.name.trim().length < 2) next.name = "Please enter your full name.";
  if (!form.email.includes("@")) next.email = "Please enter a valid email address.";
  setErrors(next);
  if (Object.keys(next).length > 0) return;

  setSaved(true);
  setForm({ name: "", email: "" });
}

<input id="email" name="email" value={form.email} onChange={change}
       aria-invalid={Boolean(errors.email)} />
{errors.email && <p role="alert">{errors.email}</p>}
{saved && <p role="status">Account created. Welcome!</p>}`,
      explain: 'Validation runs on submit, builds a messages object and stops early when anything failed.\n\n`role="alert"` announces the error and `role="status"` confirms success politely — accessible feedback with no extra library.',
    },
    tryIt: {
      task: 'Add a class field with its own rule.',
      steps: [
        'Add `class` to the state object and an input with `name="class"`.',
        'Require at least 3 characters with the message "Choose your class, e.g. SS2".',
        'Disable the submit button whenever any error is showing.',
      ],
      starter: `const [form, setForm] = useState({ name: "", email: "", class: "" });
<button type="submit" disabled={Object.keys(errors).length > 0}>Create account</button>`,
      expected: 'The new field validates like the others and the button stays disabled until every rule passes.',
    },
    mistakes: [
      ['Forgetting `value` on an input', 'The input becomes uncontrolled and state disagrees with the box.'],
      ['Leaving out `preventDefault()`', 'The page reloads on submit and the student loses everything they typed.'],
      ['One generic error message for all fields', 'Tell the student which field is wrong and what a valid value looks like.'],
    ],
    check: ['What makes an input controlled?', [
      'Its value comes from React state and updates through onChange',
      'It has a placeholder',
      'It uses a label element',
      'It is inside a form',
    ], 0, 'A controlled input reads its value from state and reports every change back.'],
    summary: [
      'Controlled inputs read their value from state and update it on change.',
      'Keep many fields in one state object with a `name` attribute per input.',
      'On submit: prevent the default, validate, then act — with clear feedback either way.',
    ],
    quiz: [
      mcq('Which props make an input controlled?', ['value and onChange', 'placeholder and type', 'defaultValue and name', 'required and name'], 0, 'value supplies the text and onChange reports changes back into state.'),
      mcq('Why call `event.preventDefault()` in a submit handler?', ['To stop the browser reloading the page', 'To clear the form', 'To validate the fields', 'To focus the first input'], 0, 'Without it the browser performs a full page load and your state is lost.'),
      fill('Updating one field of a state object needs the ______ operator to copy the rest.', 'spread', 'The spread operator copies the other fields, keeping them unchanged.'),
      tf('Each input in a multi-field form should have a matching name attribute.', true, 'The name attribute lets one change handler update the right field.'),
      mcq('A student types a bad email and presses submit. What is the best behaviour?', ['Show a specific message next to the email field and keep their input', 'Reload the page', 'Silently ignore the submit', 'Clear the whole form'], 0, 'Specific feedback plus preserved input lets the student correct it quickly.'),
    ],
    assignment: {
      goal: 'Build a validated student registration form that gives clear feedback and keeps the student\'s input.',
      requirements: [
        'Four controlled fields: full name, email, class and password.',
        'Validate on submit: name at least 2 characters, email contains @ and a dot, class at least 3 characters, password at least 8 characters.',
        'Show each error next to its field and set aria-invalid on invalid inputs.',
        'On success show a confirmation message and reset the form.',
        'Style the form consistently with the rest of your project.',
      ],
      starter: 'Start from the form in the lesson and move each rule into its own small function (validateName, validateEmail) so the rules are easy to read and test.',
      expected: 'Submitting an empty form shows four specific messages and sends nothing. Completing every field correctly shows a confirmation, clears the inputs and leaves the page loaded.',
      submission: 'Submit your repository link plus a screenshot of the form showing the error messages.',
      criteria: [['Four controlled fields rendered correctly', 6], ['Validation rules correct for all four fields', 8], ['Specific messages next to the right fields', 6]],
      difficulty: 'Intermediate',
      time: '60–75 minutes',
    },
  }),

  // __APPEND__
])
