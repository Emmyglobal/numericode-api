// ─── React Course — Module 3: JSX Fundamentals ───────────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module03: ModuleData = moduleOf('Module 3 — JSX Fundamentals', [
  lesson('R3.1 — What Is JSX?', {
    duration: 12,
    intro: 'JSX is the part of React that looks like HTML but lives inside JavaScript. It lets you describe a screen right next to the logic that controls it.',
    objectives: [
      'Explain what JSX is and where it is written',
      'Describe how JSX becomes real page elements',
      'Write a simple JSX block inside a component',
    ],
    teach: [
      ['HTML Feels at Home in JavaScript', 'Compare these two ways of creating a heading.\n\n```js\ndocument.createElement("h1");\n```\n\n```jsx\n<h1>Hello</h1>\n```\n\nJSX is shorter, easier to read, and shows the shape of the screen at a glance.'],
      ['A Tool Translates JSX', 'Browsers do not understand JSX directly. Vite converts it into ordinary JavaScript before the page runs.\n\nBecause of that translation you can keep markup and logic in the same file, and the browser still receives plain JavaScript.'],
      ['JSX Is Not Quite HTML', 'JSX looks like HTML but follows JavaScript rules. HTML uses `class`, while JSX uses `className`, because `class` already means something else in JavaScript.\n\nSame idea as HTML, slightly different spelling.'],
    ],
    code: {
      language: 'jsx',
      title: 'Your First JSX',
      code: `function Profile() {
  return (
    <div className="card">
      <h2>Ada Obi</h2>
      <p>Class: SS2 Science</p>
    </div>
  );
}`,
      explain: '`className` is used instead of `class`, and every element closes.\n\nReact turns this into real page elements: a container, a heading and a paragraph.',
    },
    tryIt: {
      task: 'Write a small JSX block for a book you like.',
      steps: [
        'Create a `BookCard` component.',
        'Inside, return a `<div>` containing an `<h3>` title and a `<p>` author.',
        'Give the div a `className` of `book` and check the page.',
      ],
      starter: `function BookCard() {
  return (
    <div className="book">
      {/* add a heading and a paragraph here */}
    </div>
  );
}`,
      expected: 'The page shows a book title and an author inside a container with the class `book`.',
    },
    mistakes: [
      ['Using `class` instead of `className`', 'React prints a warning in the console, and the class may not be applied.'],
      ['Returning two elements side by side', 'Siblings must share one parent element — the next lesson explains the rules.'],
    ],
    check: ['Why does JSX use `className` instead of `class`?', [
      'Because `class` is already a JavaScript keyword',
      'Because HTML removed `class`',
      'Because React dislikes CSS',
      'Because `className` is faster',
    ], 0, '`class` is reserved in JavaScript, so JSX uses `className` for the same purpose.'],
    summary: [
      'JSX describes a screen inside JavaScript and looks like HTML.',
      'A build tool such as Vite translates JSX into JavaScript the browser understands.',
      'JSX follows JavaScript rules, for example `className` instead of `class`.',
    ],
    quiz: [
      mcq('What is JSX?', ['A syntax that lets you describe UI inside JavaScript', 'A database', 'A CSS framework', 'A browser plugin'], 0, 'JSX is the HTML-like syntax used inside React components.'),
      mcq('Why can browsers not run JSX directly?', ['It is converted into JavaScript first', 'It is written in Python', 'It needs a database', 'It is an image format'], 0, 'Build tools translate JSX into plain JavaScript that browsers understand.'),
      fill('In JSX you write ________ instead of the HTML attribute class.', 'className', 'className is the JSX spelling of the HTML class attribute.'),
      tf('JSX and HTML are exactly the same, with no differences at all.', false, 'JSX follows JavaScript rules — for example className, and every tag must be closed.'),
      mcq('Where is JSX normally written?', ['Inside a component, in its return statement', 'Only in CSS files', 'Only in the browser console', 'In package.json'], 0, 'Components return JSX that describes the screen.'),
    ],
  }),

  lesson('R3.2 — JSX Rules', {
    duration: 12,
    intro: 'JSX has a short list of rules. Learn these five once and you will avoid almost every beginner error.',
    objectives: [
      'Return a single parent element from a component',
      'Close every tag, including those that stand alone',
      'Use a fragment when you need several siblings',
    ],
    teach: [
      ['Rule 1 — One Parent Element', 'A component returns **one** element. To show several things, wrap them in a parent such as `<div>`, or use an empty fragment `<>...</>`, which adds no extra element to the page.'],
      ['Rule 2 — Close Every Tag', 'HTML allows `<img src="cat.png">`, but JSX requires `<img src="cat.png" />`. The slash says the tag closes immediately.'],
      ['Rules 3 to 5', 'Write `className` instead of `class`. Use camelCase attribute names such as `onClick` and `tabIndex`. And remember: JavaScript values go inside curly braces, as in `{student.name}`.'],
    ],
    code: {
      language: 'jsx',
      title: 'Broken and Fixed',
      code: `// Wrong: two siblings with no parent
function Bad() {
  return (
    <h1>Results</h1>
    <p>Term 2</p>
  );
}

// Right: one parent wraps the siblings
function Good() {
  return (
    <>
      <h1>Results</h1>
      <p>Term 2</p>
    </>
  );
}`,
      explain: 'The first component fails to build because two elements sit at the top level.\n\nThe second uses a fragment `<>...</>` as the single parent. Fragments group elements without adding an extra box, which keeps your layout tidy.',
    },
    tryIt: {
      task: 'Fix broken JSX.',
      steps: [
        'Write a component that returns an `<h2>` and a `<p>` next to each other.',
        'Run it and read the error message carefully.',
        'Fix it with a fragment, then swap the fragment for a `<div>` and notice the difference on the page.',
      ],
      starter: `function Report() {
  return (
    <h2>Termly Report</h2>
    <p>Mathematics: 88</p>
  );
}`,
      expected: 'After the fix both lines appear. With a `<div>` the elements get an extra container; with a fragment they do not.',
    },
    mistakes: [
      ['Wrapping everything in unnecessary divs', 'Extra divs make CSS harder. Use a fragment when you only need to group elements.'],
      ['Forgetting the closing slash', '`<img>` and `<br>` must be written `<img />` and `<br />` in JSX.'],
    ],
    check: ['What does a fragment `<>...</>` do?', [
      'Groups several elements without adding an extra element to the page',
      'Adds a hidden div',
      'Removes the elements',
      'Styles the children',
    ], 0, 'A fragment is a wrapper that does not appear in the rendered page.'],
    summary: [
      'Return exactly one parent element from a component.',
      'Close every tag; self-closing tags end with `/>`.',
      'Use `<>...</>` to group siblings without extra markup.',
    ],
    quiz: [
      mcq('Which code is valid JSX?', ['return (<><h1>A</h1><p>B</p></>)', 'return (<h1>A</h1><p>B</p>)', 'return <h1>A</h1><p>B</p>', 'return [<h1>A</h1><p>B</p>]'], 0, 'The siblings must share one parent — here a fragment.'),
      fill('A self-closing image tag is written `<img ______>`.', '/>', 'JSX requires the closing slash on tags that have no separate closing tag.'),
      tf('A component may return two elements side by side without a parent.', false, 'A component returns one parent element; siblings must be wrapped.'),
      mcq('Which attribute name is correct in JSX?', ['onClick', 'onclick', 'on-click', 'ONCLICK'], 0, 'JSX uses camelCase attribute names, so onClick.'),
      mcq('How do you insert a JavaScript value into JSX?', ['Inside curly braces: {value}', 'Inside square brackets: [value]', 'Inside quotes: "value"', 'With a dollar sign: $value'], 0, 'Curly braces switch from JSX into JavaScript.'),
    ],
  }),

  // __APPEND__
])
