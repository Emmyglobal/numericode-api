// ─── React Course — Module 1: Welcome to React ───────────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module01: ModuleData = moduleOf('Module 1 — Welcome to React', [
  lesson('R1.1 — What Is React?', {
    duration: 12,
    intro: 'React is a tool that helps you build the parts of a website that people can see and touch. Instead of writing one giant page, you build small pieces and join them together like LEGO blocks.',
    objectives: [
      'Say what React is in your own words',
      'Explain why we build pages from small pieces called components',
      'Describe how React keeps the screen in sync with your data',
    ],
    teach: [
      ['A Tool for Building Screens', 'A website has two halves: the part people **see** (buttons, headings, cards, pictures) and the part that runs behind the scenes.\n\nReact is a favourite tool for the first half — the *user interface*. It does not care where your data is stored or which server you use. It has one job: turning your ideas into screens people can use.'],
      ['Small Pieces, Big Result', 'Think about LEGO. One block is simple. Join many blocks and you can build a castle.\n\nReact works the same way. You write a small piece called a **component**, then place components inside other components. A profile card, a menu, a button — each one is a component.\n\nA React component is like a LEGO block: each block has one job, and we combine many blocks to build a complete application.'],
      ['How React Updates the Screen', 'When something changes — a student clicks a button, or new data arrives — you do not need to hunt through the page and change things by hand.\n\nYou describe what the screen should look like for the *current* data. React compares your description with the real page and updates only the parts that changed. This is why React apps feel fast.'],
    ],
    code: {
      language: 'jsx',
      title: 'Your First Tiny Component',
      code: `function Welcome() {
  return <h1>Hello, NumeryCode!</h1>;
}`,
      explain: '`function Welcome()` creates a component called Welcome. The `return` describes what should appear on the screen — here, a heading.\n\nReact finds `<Welcome />` in your page and shows the heading. A component always returns the thing you want to see.',
    },
    callouts: [
      { type: 'tip', title: 'You already know enough', content: 'If you can write HTML and a little JavaScript, you can write React. Everything new in this module is built on things you have already seen.' },
    ],
    tryIt: {
      task: 'Recreate the Welcome component in your editor and change the message.',
      steps: [
        'Create a component named Welcome.',
        'Return an `<h1>` with the text "Hello, my name is YOUR NAME!".',
        'Change the text once more so it greets your class instead.',
      ],
      starter: `function Welcome() {
  return <h1>Hello, NumeryCode!</h1>;
}`,
      expected: 'The browser shows one heading. Every time you change the text and save, the page updates within a second.',
    },
    mistakes: [
      ['Calling it "React the language"', 'React is a JavaScript **library**, not a new language. The code you write is JavaScript with a special way of describing screens.'],
      ['Thinking React replaces HTML and CSS', 'React builds the elements; HTML still describes them and CSS still styles them. You keep using both.'],
    ],
    check: ['Which sentence best describes React?', [
      'A library for building user interfaces out of small pieces',
      'A database for storing student records',
      'A programming language that replaces JavaScript',
      'A tool for editing photos',
    ], 0, 'React is a JavaScript library for building user interfaces, and it encourages you to build them from small components.'],
    summary: [
      'React is a JavaScript library for building the part of a website people see and touch.',
      'The building blocks are called components, like LEGO blocks for screens.',
      'You describe what the screen should look like; React keeps it in sync when data changes.',
    ],
    quiz: [
      mcq('What is React mainly used for?', ['Building user interfaces', 'Storing files on a server', 'Writing SQL queries', 'Editing videos'], 0, 'React is a library for building user interfaces — the visible part of an application.'),
      mcq('A React component is best compared to:', ['A LEGO block with one job', 'A printer', 'A web browser', 'A password'], 0, 'A component is a small, reusable piece, just like a LEGO block.'),
      tf('React replaces HTML and CSS completely.', false, 'React builds elements, but HTML still describes them and CSS still styles them.'),
      fill('The small building blocks of a React app are called ________.', 'components', 'Components are the reusable pieces you combine to build a full screen.'),
      mcq('When data changes, what does React do?', ['Updates only the parts of the page that changed', 'Reloads the whole website from the server', 'Deletes the page', 'Asks the user to refresh'], 0, 'React compares the new description with the real page and updates only what changed.'),
      tf('You need to know a special new language to use React.', false, 'React code is JavaScript. You add a way of describing the screen, but the language stays JavaScript.'),
    ],
  }),
  lesson('R1.2 — Why Developers Use React', {
    duration: 12,
    intro: 'Many tools can build a website. React has stayed popular for years because it solves real problems developers meet every day — and it saves them from repeating the same work.',
    objectives: [
      'List three reasons developers choose React',
      'Explain what "reusable" means for a component',
      'Describe how React differs from changing the page by hand',
    ],
    teach: [
      ['Reason 1 — Write Once, Use Many Times', 'In a school dashboard you show student cards in many places: the class list, the search results, the profile page.\n\nWith React you write the StudentCard component **once** and use it everywhere. Fix a bug once and every place improves.'],
      ['Reason 2 — The Screen Follows the Data', 'In plain JavaScript you often read the data, decide what changed, then find the right element and change it by hand:\n\n```js\ndocument.getElementById("score").textContent = score;\n```\n\nIn React you describe the result instead — *"show the score in a paragraph"* — and React performs the update when the data changes. This style is called **declarative**, and it removes a whole family of "I forgot to update that part" bugs.'],
      ['Reason 3 — A Huge, Helpful Community', 'React is used by an enormous number of teams. That means plenty of tutorials, ready-made libraries, job openings — and someone has usually already answered your question.'],
    ],
    examples: [
      {
        title: 'One card, three students',
        content: 'The structure is written once. Only the data changes, so the code stays short and easy to keep correct. This is the same job that plain JavaScript would need three separate update steps for.',
        code: `<StudentCard name="Ada"   score={92} />
<StudentCard name="Bola"  score={78} />
<StudentCard name="Chidi" score={65} />`,
        language: 'jsx',
      },
    ],
    callouts: [
      { type: 'note', title: 'React is a choice, not a rule', content: 'A page that only shows a phone number does not need React. React earns its place when screens are interactive and share repeated pieces.' },
    ],
    tryIt: {
      task: 'Find the repetition on a web page and decide what should become a component.',
      steps: [
        'Imagine a page with three student cards that differ only by name and score.',
        'Write down what stays the same and what changes.',
        'Name the component you would build, for example `StudentCard`.',
      ],
      expected: 'You identified one repeated block of markup, and separated the values that differ (name, score) from the structure that repeats.',
    },
    mistakes: [
      ['Copying markup instead of building a component', 'Copy-and-paste looks fast, but every copy becomes another place where you must fix the same bug.'],
      ['Mixing manual DOM edits with React', 'Reaching for `getElementById` inside a React component fights the framework. Let the data drive the screen.'],
    ],
    check: ['Which task is the best fit for React?', [
      'A dashboard with filters, cards and live updates',
      'A single paragraph showing opening hours',
      'An image file with no interactivity',
      'A plain text document',
    ], 0, 'React shines when a screen is interactive and built from repeated pieces, like a dashboard.'],
    summary: [
      'Write a component once and reuse it, so one fix reaches every place it appears.',
      'Describe the screen for the current data instead of editing elements by hand.',
      'A large community means help, libraries and job opportunities.',
    ],
    quiz: [
      mcq('What is the main advantage of components?', ['They can be reused in many places', 'They make CSS unnecessary', 'They store data in a database', 'They remove the need for a server'], 0, 'Reuse is the main advantage: one component, many places, one fix.'),
      mcq('Which style of code lists the steps needed to change the page by hand?', ['Imperative code', 'Declarative code', 'Compiled code', 'Minified code'], 0, 'Imperative code gives step-by-step orders, such as find the element then overwrite its text.'),
      tf('React is a good choice for every page ever made.', false, 'For simple static pages plain HTML is often simpler. React earns its place on interactive screens with repeated pieces.'),
      fill('A component that is used in many places is described as ________.', 'reusable', 'Reusable components are written once and used wherever they are needed.'),
      mcq('Why is declarative code easier to keep correct in a large app?', ['You describe the result once and React keeps the page in sync', 'It needs fewer files', 'It removes the need for state', 'It runs without a browser'], 0, 'There are no manual update steps to forget, so the screen cannot fall behind the data.'),
      tf('A big community around a library means more tutorials and help.', true, 'Popular libraries have more tutorials, libraries and answered questions.'),
    ],
  }),

  lesson('R1.3 — Components: The Building Blocks of React', {
    duration: 15,
    intro: 'A component is a piece of the screen with a name. Naming pieces is what makes a React app easy to read, test and fix — and it is the single most important idea in this course.',
    objectives: [
      'Write a function component that returns JSX',
      'Use a component inside another component like a tag',
      'Explain why small components are easier to maintain',
    ],
    teach: [
      ['A Component Is a Function That Returns a Screen Piece', 'In modern React a component is simply a JavaScript function whose name starts with a capital letter and which returns JSX.\n\n```jsx\nfunction TeacherCard() {\n  return <div>Mr Okafor</div>;\n}\n```\n\nNotice the capital T. React treats capitalised names as components and lowercase names as ordinary HTML tags — `<teacherCard />` would be treated as unknown HTML and quietly ignored.'],
      ['Using a Component Is Just Writing a Tag', 'Once a component exists you use it like any HTML tag: `<TeacherCard />`.\n\nThe real power appears when you combine them. A `ClassPage` can contain a `Header`, three `StudentCard`s and a `Footer` — each of those written and understood separately.'],
      ['Build Small, Join Together', 'A useful habit: if a part of your JSX has its own heading, its own paragraph and its own purpose, give it a name and move it into its own component.\n\nSmall components are easy to read at a glance, easy to reuse, and easy to test. A 400-line component is not; aim for functions you can read without scrolling.'],
    ],
    code: {
      language: 'jsx',
      title: 'Three Components, One Page',
      code: `function Header() {
  return <h1>Greenfield Secondary School</h1>;
}

function StudentCard() {
  return (
    <div className="card">
      <h2>Ada Obi</h2>
      <p>Score: 92</p>
    </div>
  );
}

function ClassPage() {
  return (
    <>
      <Header />
      <StudentCard />
      <StudentCard />
    </>
  );
}`,
      explain: '`Header`, `StudentCard` and `ClassPage` are three components. `ClassPage` is built from the other two — the same way LEGO blocks stack.\n\nWe wrote the card markup once, yet two cards appear because we used the component twice.',
    },
    tryIt: {
      task: 'Build a personal introduction from three components.',
      steps: [
        'Create `IntroHeader` that returns your full name in an `<h1>`.',
        'Create `IntroDetails` that returns a `<p>` with your class and favourite subject.',
        'Create `MyProfile` that returns both components together, and render `MyProfile`.',
      ],
      starter: `function IntroHeader() {
  return <h1>{/* your name */}</h1>;
}

function IntroDetails() {
  return <p>{/* class and favourite subject */}</p>;
}

function MyProfile() {
  return (
    <>
      {/* use both components */}
    </>
  );
}`,
      expected: 'The page shows your name as a heading and one line of details underneath, built from three separate components.',
    },
    mistakes: [
      ['Starting a component name with a lowercase letter', 'React then treats it as an unknown HTML element and renders nothing useful.'],
      ['Writing everything in one giant component', 'Big components are hard to read and impossible to reuse. Split by purpose, not by size.'],
    ],
    check: ['Which name makes React treat the piece as a component?', ['StudentCard', 'studentCard', 'student-card', 'student_card'], 0, 'React treats capitalised names as components. Lowercase names are treated as HTML tags.'],
    summary: [
      'A component is a function with a capitalised name that returns JSX.',
      'Use your own components like tags: `<StudentCard />`.',
      'Small components that each do one job are easier to read, reuse and fix.',
    ],
    quiz: [
      mcq('Which component name is correct in React?', ['CourseCard', 'courseCard', 'course-card', 'course card'], 0, 'Component names must start with a capital letter.'),
      tf('A component can be used inside another component.', true, 'Combining components is the normal way to build a page.'),
      mcq('Why does React ignore `<studentCard />`?', ['Lowercase names are treated as HTML tags', 'It needs a closing tag', 'It must be styled first', 'It is too long'], 0, 'Only capitalised names are treated as React components.'),
      fill('A component returns ______, which describes what appears on the screen.', 'jsx', 'The returned JSX describes the screen for the current data.'),
      mcq('Which is a sign that a piece of JSX should become its own component?', ['It has its own heading and purpose', 'It contains a div', 'It uses className', 'It is inside a return statement'], 0, 'A piece with its own purpose and structure deserves its own named component.'),
    ],
  }),

  lesson('R1.4 — Your First React App', {
    duration: 15,
    intro: 'Time to see React work. In this lesson you will look at the four lines that start a React app and change them to show your own component.',
    objectives: [
      'Identify the file where a React app starts',
      'Explain what a root element and rendering mean',
      'Replace the starter page with your own component',
    ],
    teach: [
      ['The Page Has One Empty Mount', 'A React app begins with a single empty element in `index.html`, usually `<div id="root"></div>`.\n\nEverything you build is placed inside that one element. This is why React can power a small widget on an existing page or a whole application.'],
      ['The Entry File Starts React', 'The file `main.jsx` finds the root element and tells React to render your top component into it:\n\n```jsx\ncreateRoot(document.getElementById("root")).render(<App />);\n```\n\nRead it as: *take the root element, and render `App` inside it.*'],
      ['Your Component Tree', '`App` is the top of your tree. It renders other components, which render others. When you change a file and save, Vite re-renders the tree and the browser updates.\n\nLater in this course you will build much larger trees — but the idea never changes: one root, one top component, many pieces below.'],
    ],
    code: {
      language: 'jsx',
      title: 'A Complete Little App',
      code: `// App.jsx
function SchoolBanner() {
  return (
    <header>
      <h1>Greenfield Secondary School</h1>
      <p>Learning together, every day.</p>
    </header>
  );
}

export default function App() {
  return (
    <main>
      <SchoolBanner />
    </main>
  );
}`,
      explain: '`SchoolBanner` is a small component. `App` is the top component and uses it.\n\nThe `export default` makes `App` available to `main.jsx`, which renders it into the root element.',
    },
    tryIt: {
      task: 'Replace the Vite starter page with your own banner.',
      steps: [
        'Open the project you created in Module 2.',
        'Rewrite `App.jsx` so it returns your own component and message.',
        'Save, then check the browser; open `main.jsx` and find the `render` line.',
      ],
      expected: 'The starter page is gone and your own banner appears. You can point to the exact line that renders your app.',
    },
    mistakes: [
      ['Editing index.html instead of the component', 'The root element stays empty on purpose. Your content belongs in components.'],
      ['Forgetting to export the component that main.jsx imports', 'The page then fails with an import error. Check that the names match.'],
    ],
    check: ['What does `render(<App />)` do?', [
      'Places the App component inside the root element on the page',
      'Downloads React from the internet',
      'Creates a new HTML file',
      'Styles the page',
    ], 0, 'render() tells React to show the given component inside the element you selected.'],
    summary: [
      'A React app mounts into one root element in `index.html`.',
      '`main.jsx` starts React and renders the top component.',
      'Everything else is a tree of components below the top component.',
    ],
    quiz: [
      mcq('Which file usually starts a Vite React app?', ['main.jsx', 'index.css', 'package.json', 'vite.config.js'], 0, 'main.jsx selects the root element and renders the top component.'),
      fill('React renders your application into an element with the id ______.', 'root', 'The starter project provides <div id="root"></div> as the mount point.'),
      tf('A React app can only fill an entire page.', false, 'React can render into any element, including a small widget on an existing page.'),
      mcq('What is App in a typical React project?', ['The top-level component that contains the rest', 'A CSS file', 'A package', 'A browser setting'], 0, 'App is the top component; everything else sits below it.'),
      mcq('You changed App.jsx but the page looks the same. What should you check first?', ['Whether the file was saved and the dev server is still running', 'The database connection', 'The screen resolution', 'The CSS colour scheme'], 0, 'Unsaved files or a stopped dev server are the usual causes.'),
    ],
  }),

  lesson('R1.5 — Understanding the React Project Structure', {
    duration: 15,
    intro: 'A React project has a handful of files that each do one thing. Knowing what lives where means you always know which file to open.',
    objectives: [
      'Name the files that make up a Vite React project',
      'Explain what index.html, main.jsx and App.jsx each do',
      'Add your own component file in the right place',
    ],
    teach: [
      ['The Files You Will Meet', '```\nmy-app/\n  index.html      ← the single page; holds <div id="root">\n  package.json    ← name, scripts, dependencies\n  vite.config.js  ← build tool settings\n  src/\n    main.jsx      ← starts React, renders <App />\n    App.jsx       ← your top component\n    components/   ← reusable pieces\n    pages/        ← one file per screen\n```\n\nOnly one HTML file exists. Everything the student sees is created by your components inside it.'],
      ['Which File Do I Open?', '- Change the **page title or favicon** → `index.html`\n- Add a **reusable piece** → a new file in `src/components/`\n- Build a **whole screen** → a new file in `src/pages/`, used by `App.jsx`\n- Add a **package** → install it with npm so `package.json` records it'],
      ['Import Paths Are Relative to the File', '`./` means "this folder" and `../` means "the folder above". From `src/pages/HomePage.jsx`, the component in `src/components/Card.jsx` is `../components/Card`.\n\nSome projects add an `@` alias for `src/`, so `@/components/Card` works from anywhere — check `vite.config.js` to see whether yours has it.'],
    ],
    code: {
      language: 'jsx',
      title: 'Adding Your Own Component File',
      code: `// src/components/ProfileCard.jsx
export function ProfileCard() {
  return (
    <article className="profile-card">
      <h3>Ada Obi</h3>
      <p>SS2 Science · Favourite subject: Mathematics</p>
    </article>
  );
}

// src/App.jsx
import { ProfileCard } from "./components/ProfileCard";

export default function App() {
  return (
    <main>
      <h1>My React Profile</h1>
      <ProfileCard />
    </main>
  );
}`,
      explain: 'The new file exports the component; `App.jsx` imports it with the path `./components/ProfileCard`.\n\nAdding a second card means adding one more `<ProfileCard />` line — no markup is duplicated.',
    },
    tryIt: {
      task: 'Add a component in the correct folder and use it.',
      steps: [
        'Create `src/components/ProfileCard.jsx` as shown.',
        'Import it in `App.jsx` and render it twice.',
        'Change the name inside the component and watch hot reload update both cards.',
      ],
      expected: 'Two identical cards appear and both change together when you edit the component — proof that the file is shared.',
    },
    mistakes: [
      ['Creating files in the project root', 'Source files belong in `src/`. Root files are configuration only.'],
      ['Using the wrong relative import path', '`./components/Card` will not resolve from a file inside `pages/`. Count the folders carefully.'],
      ['Editing index.html to add content', 'Its body holds only the root element on purpose. Content belongs in components.'],
    ],
    check: ['Which file holds `<div id="root">`?', ['index.html', 'main.jsx', 'App.jsx', 'package.json'], 0, 'The single HTML file provides the mount element that React renders into.'],
    summary: [
      'index.html holds the one page; main.jsx starts React into the root element.',
      'App.jsx is the top component; components/ and pages/ hold the rest.',
      'Import paths are relative to the file that imports them.',
    ],
    quiz: [
      mcq('Which file starts React and renders the top component?', ['main.jsx', 'index.html', 'vite.config.js', 'package.json'], 0, 'main.jsx selects the root element and renders <App />.'),
      mcq('Where should a reusable ProfileCard live?', ['src/components/ProfileCard.jsx', 'index.html', 'package.json', 'src/assets/'], 0, 'Reusable pieces belong in the components folder, one file each.'),
      fill('From src/pages/HomePage.jsx, a component in src/components is imported with the path ______/components/...', '..', 'Two dots move up one folder, from pages back into src.'),
      tf('A React project contains one HTML file that all components render into.', true, 'Components are created inside the single page at the root element.'),
      mcq('You need to add a package. What do you do?', ['Install it with npm so package.json records it', 'Paste the code into App.jsx', 'Add a script tag to index.html only', 'Create a new HTML file'], 0, 'npm installs the package and records the dependency, so everyone gets the same version.'),
    ],
    assignment: {
      goal: 'Create a small profile card built from React components that shows what you learned in Module 1.',
      requirements: [
        'At least two components: a ProfileCard and a second reusable piece such as a Badge.',
        'ProfileCard shows a name, a class and one extra detail such as a favourite subject.',
        'Each component lives in src/components/ and is imported into App.jsx.',
        'Render at least two cards with different information.',
        'Semantic HTML: use a heading, paragraph text and an article or section element.',
      ],
      starter: 'Start from ProfileCard in the lesson. Passing simple values directly is fine for now — Module 5 covers props in full.',
      expected: 'The page shows two profile cards with different details, built from reusable components, with no copied markup.',
      submission: 'Submit your repository link and a screenshot of the page, plus one sentence naming which part you could reuse on another screen.',
      criteria: [['Two or more components created and imported correctly', 6], ['Two cards rendered with different data', 6], ['Files organised in src/components with semantic HTML', 4]],
      difficulty: 'Beginner',
      time: '45–60 minutes',
    },
  }),

  // __APPEND__
])
