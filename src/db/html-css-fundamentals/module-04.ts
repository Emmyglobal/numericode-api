import type { HcfModuleData } from './types'

export const module04: HcfModuleData = {
  title: 'Module 4 — Tables & Forms',
  lessons: [
    {
      title: 'Table Structure',
      duration: 25,
      content: "## Key Ideas\n\n**Basic table elements:**\n- <table>: table container\n- <tr>: table row\n- <th>: table header cell (bold, centered by default)\n- <td>: table data cell\n\n**Table sections:**\n- <thead>: header section\n- <tbody>: body section (main data)\n- <tfoot>: footer section\n\n**Tables are for tabular data, not layout!**\n\n```html\n<table>\n  <thead>\n    <tr><th>Name</th><th>Score</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ada</td><td>95</td></tr>\n    <tr><td>Grace</td><td>98</td></tr>\n  </tbody>\n</table>\n```\n\n## Key Takeaways\n- <th> defines header cells, <td> defines data cells.\n- Use <thead>, <tbody>, <tfoot> for semantic table structure.\n- Tables should only be used for tabular data, not page layout.",
      quiz: {
        title: 'Quiz 4.1 \u2014 Table Structure',
        description: 'Three questions on table elements and semantics.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which tag defines a table header cell?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<td>', isCorrect: false },
              { id: 'b', text: '<th>', isCorrect: true },
              { id: 'c', text: '<header>', isCorrect: false },
              { id: 'd', text: '<hcell>', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'Which tag defines a standard data cell?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<th>', isCorrect: false },
              { id: 'b', text: '<data>', isCorrect: false },
              { id: 'c', text: '<td>', isCorrect: true },
              { id: 'd', text: '<cell>', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'True/False: Tables should be used to lay out an entire page\'s visual structure.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Merging Cells: colspan & rowspan',
      duration: 25,
      content: "## Key Ideas\n\n**colspan attribute:**\n- Makes a cell span multiple columns\n- Example: colspan=\"2\" spans 2 columns\n\n**rowspan attribute:**\n- Makes a cell span multiple rows\n- Example: rowspan=\"3\" spans 3 rows\n\n**Combining both:**\ncolspan and rowspan can be used on the same cell\n\n```html\n<table>\n  <tr><th colspan=\"2\">Full Name</th></tr>\n  <tr><td>First</td><td>Last</td></tr>\n</table>\n```\n\n## Key Takeaways\n- colspan spans columns, rowspan spans rows.\n- Both can be combined on the same cell.\n- Useful for complex table headers and layouts.",
      quiz: {
        title: 'Quiz 4.2 \u2014 Merging Cells',
        description: 'Three questions on colspan and rowspan.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does colspan=\"2\" do to a cell?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Makes it span 2 rows', isCorrect: false },
              { id: 'b', text: 'Makes it span 2 columns', isCorrect: true },
              { id: 'c', text: 'Merges 2 cells vertically', isCorrect: false },
              { id: 'd', text: 'Creates 2 cells', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does rowspan=\"3\" do to a cell?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Makes it span 3 columns', isCorrect: false },
              { id: 'b', text: 'Makes it span 3 rows', isCorrect: true },
              { id: 'c', text: 'Creates 3 cells', isCorrect: false },
              { id: 'd', text: 'Merges 3 cells horizontally', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: colspan and rowspan can be combined on the same cell.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Forms & Input Types',
      duration: 30,
      content: "## Key Ideas\n\n**The <form> element:**\n- action: URL to submit form data to\n- method: HTTP method (GET or POST)\n\n**Label-input pairing:**\n- <label for=\"id\"> matches <input id=\"id\">\n- Important for accessibility and clickable target area\n\n**Common input types:**\n- text: plain text input\n- email: email format validation\n- password: masked text input\n- checkbox: single checkbox\n- radio: radio button group\n- number: numeric input\n- date: date picker\n\n```html\n<form action=\"/submit\" method=\"POST\">\n  <label for=\"email\">Email:</label>\n  <input type=\"email\" id=\"email\" name=\"email\" required />\n  <label for=\"plan\">Plan:</label>\n  <select id=\"plan\" name=\"plan\">\n    <option value=\"free\">Free</option>\n    <option value=\"pro\">Pro</option>\n  </select>\n  <button type=\"submit\">Sign Up</button>\n</form>\n```\n\n## Key Takeaways\n- Always pair <label> with <input> using for/id.\n- Choose the right input type for the data you\'re collecting.\n- type=\"email\" provides built-in email format validation.",
      quiz: {
        title: 'Quiz 4.3 \u2014 Forms & Input Types',
        description: 'Three questions on form structure and input types.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Why should every <input> have an associated <label>?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'For accessibility and to increase the clickable target area', isCorrect: true },
              { id: 'b', text: 'It is required by HTML validation', isCorrect: false },
              { id: 'c', text: 'To make the input look better', isCorrect: false },
              { id: 'd', text: 'To automatically focus the input', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What connects a <label> to its <input>?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Matching for (on label) and id (on input) attributes', isCorrect: true },
              { id: 'b', text: 'Wrapping the input inside the label', isCorrect: false },
              { id: 'c', text: 'Using the same name attribute', isCorrect: false },
              { id: 'd', text: 'The connect attribute', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What HTML5 input type restricts entry to a valid email format?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'type=\"text\"', isCorrect: false },
              { id: 'b', text: 'type=\"mail\"', isCorrect: false },
              { id: 'c', text: 'type=\"email\"', isCorrect: true },
              { id: 'd', text: 'type=\"validate\"', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
        ],
      },
    },
    {
      title: 'Form Validation & Required Fields',
      duration: 25,
      content: "## Key Ideas\n\n**Validation attributes:**\n- required: field must not be empty\n- minlength/maxlength: text length constraints\n- pattern: regex pattern for format validation\n- min/max: numeric range constraints\n\n**Built-in browser validation:**\nBrowsers provide native validation UI, but this is NOT sufficient for security\n\n```html\n<input type=\"text\" name=\"username\" required minlength=\"3\" maxlength=\"20\" />\n<input type=\"tel\" name=\"phone\" pattern=\"[0-9]{10}\" />\n```\n\n## Key Takeaways\n- required prevents empty submissions.\n- pattern uses regex to validate input format.\n- Client-side validation is NOT sufficient for security.\n- Always validate on the server as well.",
      quiz: {
        title: 'Quiz 4.4 \u2014 Form Validation',
        description: 'Three questions on validation attributes and best practices.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What attribute prevents a form from submitting with an empty required field?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'empty=\"false\"', isCorrect: false },
              { id: 'b', text: 'required', isCorrect: true },
              { id: 'c', text: 'validate', isCorrect: false },
              { id: 'd', text: 'mandatory', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: HTML required/pattern validation alone is sufficient security for a production form.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
          {
            questionText: 'What attribute restricts input to match a specific format using a regex?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'format', isCorrect: false },
              { id: 'b', text: 'regex', isCorrect: false },
              { id: 'c', text: 'pattern', isCorrect: true },
              { id: 'd', text: 'validate', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
        ],
      },
    },
    {
      title: 'Textareas, Buttons & Fieldsets',
      duration: 25,
      content: "## Key Ideas\n\n**<textarea> element:**\n- Multi-line text input\n- rows and cols attributes control size\n\n**<button> vs <input type=\"submit\">:**\n- <button> can contain HTML content (icons, styled text)\n- <input type=\"submit\"> is simpler but more limited\n\n**<fieldset> and <legend>:**\n- <fieldset>: groups related form controls\n- <legend>: provides a caption/title for the group\n\n```html\n<fieldset>\n  <legend>Feedback</legend>\n  <label for=\"msg\">Message:</label>\n  <textarea id=\"msg\" name=\"msg\" rows=\"4\"></textarea>\n  <button type=\"submit\">Send</button>\n</fieldset>\n```\n\n## Key Takeaways\n- Use <textarea> for multi-line text input.\n- <button> is more flexible than <input type=\"submit\">.\n- <fieldset>/<legend> group related fields semantically.",
      quiz: {
        title: 'Quiz 4.5 \u2014 Textareas, Buttons & Fieldsets',
        description: 'Three questions on form elements beyond basic inputs.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which tag allows multi-line text input?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<input type=\"multiline\">', isCorrect: false },
              { id: 'b', text: '<textarea>', isCorrect: true },
              { id: 'c', text: '<textbox>', isCorrect: false },
              { id: 'd', text: '<multitext>', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does <fieldset> do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Creates a clickable field', isCorrect: false },
              { id: 'b', text: 'Groups related form controls together', isCorrect: true },
              { id: 'c', text: 'Sets a form field as required', isCorrect: false },
              { id: 'd', text: 'Defines a form field\'s width', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does <legend> provide for a <fieldset>?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A border style', isCorrect: false },
              { id: 'b', text: 'A caption/title describing the group', isCorrect: true },
              { id: 'c', text: 'A required field indicator', isCorrect: false },
              { id: 'd', text: 'A color scheme', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 4 Assignment \u2014 Contact & Signup Form',
    description: 'Build a form with: a text field, an email field with required, a <select> dropdown, at least one radio group, a <textarea>, and a <fieldset>/<legend> grouping related fields. Include a small data table summarizing 3 pricing plans elsewhere on the page.',
    dueDate: '2026-10-19T23:59:59Z',
    totalMarks: 35,
    passingScore: 60,
    assignmentType: 'file',
    questions: [
      { id: 'm4a1', type: 'file', title: 'Contact/Signup Form HTML', marks: 20 },
      { id: 'm4a2', type: 'file', title: 'Form Validation Attributes', marks: 5 },
      { id: 'm4a3', type: 'file', title: 'Fieldset/Legend Grouping', marks: 5 },
      { id: 'm4a4', type: 'file', title: 'Pricing Plans Table', marks: 5 },
    ],
  },
}
