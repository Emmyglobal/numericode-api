// ─── React Course — Module 4: Components ─────────────────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module04: ModuleData = moduleOf('Module 4 — Components', [
  lesson('R4.1 — Understanding Components', {
    duration: 12,
    intro: 'You have met components already. Now let us look closely at what they are, how they behave, and what makes one "good".',
    objectives: [
      'Describe a component as a function that returns a screen piece',
      'Explain how components behave like custom HTML tags',
      'Recognise a component that is doing too much',
    ],
    teach: [
      ['One Function, One Job', 'A component should be able to answer this question in one sentence: *what does this piece show?*\n\n`Header` shows the page title. `StudentCard` shows one student. `CartTotal` shows the money owed. If you need the word "and" to describe it, it is probably two components.'],
      ['Components Are Reused, Not Repeated', 'Because a component is a function, you can call it as many times as you like. Two `<StudentCard />` tags produce two cards from one description.\n\nThis is why a bug fixed inside the component is fixed everywhere at once.'],
      ['Components Compose', 'A component can use other components inside itself. Screens are therefore built in layers: small pieces, grouped into medium pieces, grouped into pages.\n\nThis is the same idea as a school: a class is built from students, a year group from classes, a school from year groups.'],
    ],
    code: {
      language: 'jsx',
      title: 'Layers of Components',
      code: `function Badge() {
  return <span className="badge">Beginner</span>;
}

function CourseCard() {
  return (
    <article className="course-card">
      <h3>Complete React Development</h3>
      <Badge />
    </article>
  );
}

function Catalogue() {
  return (
    <section>
      <h2>Our Courses</h2>
      <CourseCard />
      <CourseCard />
    </section>
  );
}`,
      explain: '`Badge` is the smallest piece. `CourseCard` uses it. `Catalogue` groups cards under a heading.\n\nEach layer is readable on its own, and changing the badge updates every card on the site.',
    },
    tryIt: {
      task: 'Split one large component into sensible pieces.',
      steps: [
        'Start with a `Dashboard` component that returns a heading, a price line and a button.',
        'Move the heading into `DashboardHeader` and the price line into `BalanceLine`.',
        'Keep `Dashboard` as the parent that uses both.',
      ],
      starter: `function Dashboard() {
  return (
    <div>
      <h1>My Learning</h1>
      <p>Balance: 0 points</p>
      <button>Top up</button>
    </div>
  );
}`,
      expected: 'Three small components, where `Dashboard` reads almost like a list of what appears on the page.',
    },
    mistakes: [
      ['Making a component that does five things', 'It becomes hard to reuse and hard to test. Split by purpose.'],
      ['Hiding the structure behind abbreviations', '`Comp1`, `Box2`, `Thing` tell the reader nothing. Names should describe the piece.'],
    ],
    check: ['Which description suggests the component should be split?', [
      '"It shows the header and the student list and the footer"',
      '"It shows one student card"',
      '"It shows the page title"',
      '"It shows the money owed"',
    ], 0, 'A component described with "and" several times usually contains more than one job.'],
    summary: [
      'A component is a function that returns one piece of the screen.',
      'Components are reused like tags, so one fix reaches every use.',
      'Components compose in layers to build large pages from small parts.',
    ],
    quiz: [
      mcq('Which statement best describes a well-designed component?', ['It does one job that can be described in a sentence', 'It contains every part of the page', 'It always renders a div', 'It must be at least a hundred lines'], 0, 'One clear job keeps a component readable and reusable.'),
      tf('Components can be used inside other components.', true, 'Composition is how React apps are built.'),
      mcq('Why is a component easier to test than a page?', ['It has a small, focused job', 'It runs in the database', 'It has no HTML', 'It never changes'], 0, 'A small, focused piece has fewer cases to check.'),
      fill('Combining small components to build bigger ones is called component ______.', 'composition', 'Composition means building larger screens out of smaller components.'),
      mcq('A student writes one 600-line component for a whole page. What is the main problem?', ['It is hard to read, reuse and fix', 'React will not run it', 'It needs more CSS', 'It uses too much memory'], 0, 'Very large components are difficult to understand and cannot be reused.'),
    ],
  }),

  lesson('R4.2 — Creating Components', {
    duration: 15,
    intro: 'Now let us organise components properly: one file per component, clear imports, and a habit for grouping files so a growing project stays tidy.',
    objectives: [
      'Create a component in its own file and export it',
      'Import and use a component from another file',
      'Group components into folders that match the page',
    ],
    teach: [
      ['One Component, One File', 'When a component is used in more than one place, give it its own file. The file name matches the component name, which makes it easy to find:\n\n```\nsrc/components/StudentCard.jsx\n```\n\nSmall helper components used only once may live beside their parent.'],
      ['Export and Import', 'A file exports what it wants to share; the consumer imports it. Two styles exist:\n\n```jsx\nexport function StudentCard() { ... }      // named export\n```\n\n```jsx\nimport { StudentCard } from "./StudentCard";\n```\n\nNamed exports keep the imported name visible, which most beginners find clearer.'],
      ['A Folder Structure That Scales', 'A structure that works for medium projects:\n\n```\nsrc/\n  components/   ← reusable pieces\n  pages/        ← one file per screen\n  App.jsx\n  main.jsx\n```\n\nGroup by purpose, not by file type. When a folder holds more than about ten items, it usually wants subfolders.'],
    ],
    code: {
      language: 'jsx',
      title: 'A Component in Its Own File',
      code: `// src/components/StudentCard.jsx
export function StudentCard({ name, score }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>Score: {score}</p>
    </article>
  );
}

// src/pages/ClassPage.jsx
import { StudentCard } from "../components/StudentCard";

export function ClassPage() {
  return (
    <main>
      <h1>SS2 Science</h1>
      <StudentCard name="Ada" score={92} />
      <StudentCard name="Bola" score={78} />
    </main>
  );
}`,
      explain: 'The card lives in `components/`, the screen lives in `pages/`.\n\n`ClassPage` imports the card and uses it twice. If the card is needed on another page, the import line is all that is required.',
    },
    tryIt: {
      task: 'Move a component into its own file and import it.',
      steps: [
        'Create `src/components/SchoolBadge.jsx` exporting a `SchoolBadge` component.',
        'Delete the same component from `App.jsx`.',
        'Import it in `App.jsx` from `./components/SchoolBadge` and use it.',
      ],
      expected: 'The page looks the same as before, but the component now lives in its own file and can be reused anywhere.',
    },
    mistakes: [
      ['Wrong relative path in the import', '`./` means "this folder", `../` means "the folder above". A wrong path gives a module-not-found error.'],
      ['Exporting but never importing (or the reverse)', 'Both lines must exist: one file exports, the other imports, and the names must match.'],
    ],
    check: ['Where should a reusable `CourseCard` live?', [
      'In a components folder, in its own file',
      'Inside index.html',
      'In the CSS file',
      'In package.json',
    ], 0, 'Reusable pieces belong in a components folder, one file each.'],
    summary: [
      'Give reusable components their own file, named after the component.',
      'Export a component from its file and import it where it is used.',
      'Use `components/` for reusable pieces and `pages/` for screens.',
    ],
    quiz: [
      mcq('Which import matches `export function Badge() {}` in `Badge.jsx`?', ['import { Badge } from "./Badge";', 'import Badge from "./Badge.jsx.css";', 'require("./Badge")', 'import "./Badge";'], 0, 'A named export is imported with curly braces and the same name.'),
      tf('A component can be imported into many different files.', true, 'That is the point of writing it in its own file.'),
      fill('Reusable components usually live in the ______ folder.', 'components', 'The components folder holds reusable pieces, while pages holds screens.'),
      mcq('Why does a bug fixed in `StudentCard.jsx` help every page?', ['Each page imports the same component', 'React copies the file automatically', 'The CSS is shared', 'The browser caches it'], 0, 'All pages use the same component, so one fix applies everywhere.'),
      mcq('What does `../components/Card` mean?', ['Go up one folder, then into components', 'Go down one folder', 'Look in node_modules', 'Use the browser cache'], 0, '`..` moves to the parent folder before looking for the components folder.'),
    ],
  }),

  // __APPEND__
])
