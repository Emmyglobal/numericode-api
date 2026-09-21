// ─── React Course — Module 2: Setting Up a Modern React Project ──────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module02: ModuleData = moduleOf('Module 2 — Setting Up a Modern React Project', [
  lesson('R2.1 — Installing Node.js', {
    duration: 12,
    intro: 'React projects need a small helper program on your computer called Node.js. It runs JavaScript outside the browser and brings npm with it — the tool that installs the pieces your project needs.',
    objectives: [
      'Explain what Node.js is and why a React project needs it',
      'Install Node.js and check the version',
      'Explain what npm is and how it differs from Node.js',
    ],
    teach: [
      ['What Node.js Is', 'Inside a browser, JavaScript can paint buttons and read clicks. Outside a browser it cannot — so Node.js gives JavaScript a place to run on your computer.\n\nReact projects use Node.js for two jobs: to run the development server that shows your work while you type, and to prepare a fast production version of your site.'],
      ['Node.js and npm Travel Together', 'npm stands for *Node Package Manager*. It is installed at the same time as Node.js.\n\nnpm downloads ready-made code written by other people — a **package** — into your project. React itself arrives this way.'],
      ['Choosing the Right Version', 'Always install the **LTS** version (Long Term Support). LTS releases are tested and stable, which is exactly what you want while learning.'],
    ],
    code: {
      language: 'bash',
      title: 'Install, Then Check',
      code: `node --version    # v20.x.x or newer
npm --version     # 10.x.x or newer`,
      explain: 'These two commands print the installed versions. If you see version numbers, the installation worked and you are ready for the next lesson.\n\nIf the terminal says "command not found", close it and open a new one — it reads system settings only when it starts.',
    },
    tryIt: {
      task: 'Install Node.js and prove it works from the terminal.',
      steps: [
        'Download the LTS installer from the official Node.js website.',
        'Finish the installer, then open a **new** terminal window.',
        'Run `node --version` and `npm --version`, and write both numbers down.',
      ],
      expected: 'Two version numbers appear, for example `v20.11.1` and `10.2.4`, with no error message.',
    },
    mistakes: [
      ['Installing the "Current" version instead of LTS', 'Current releases change quickly. LTS is the stable choice while you are learning.'],
      ['Forgetting to reopen the terminal', 'A terminal that was already open does not know about the new installation.'],
    ],
    check: ['What is npm used for?', [
      'Installing packages that your project needs',
      'Styling HTML elements',
      'Running JavaScript inside the browser only',
      'Replacing Node.js',
    ], 0, 'npm is the package manager that installs and updates the packages a project depends on.'],
    summary: [
      'Node.js runs JavaScript on your computer, outside the browser.',
      'npm arrives with Node.js and installs project packages such as React.',
      'Install the LTS version and verify it with `node --version`.',
    ],
    quiz: [
      mcq('Why does a React project need Node.js?', ['To run the dev server and build the project', 'To store data in a database', 'To style components', 'To connect to Wi-Fi'], 0, 'Node.js runs the development server and the build tools; your components run in the browser.'),
      fill('The tool that installs packages is called ______.', 'npm', 'npm (Node Package Manager) installs the packages a project needs.'),
      mcq('Which Node.js version should a beginner install?', ['LTS', 'The newest experimental one', 'Any version older than two years', 'None'], 0, 'LTS is stable and supported, which is ideal for learning and real projects.'),
      tf('npm must be installed separately from Node.js.', false, 'npm is installed together with Node.js — you get both at once.'),
      mcq('`node --version` shows an error. What is the likely reason?', ['Node.js is not installed, or the terminal was not restarted', 'React is broken', 'The project has no CSS', 'npm is too old'], 0, 'A missing installation or an old terminal session are the usual causes.'),
    ],
  }),

  lesson('R2.2 — Creating a React App with Vite', {
    duration: 15,
    intro: 'You do not create a React project by hand. A tool called Vite prepares the whole folder in about a minute — folders, settings and a first page that already works.',
    objectives: [
      'Explain what Vite does for a React project',
      'Create a new project with the Vite command',
      'Start the project and open it in the browser',
    ],
    teach: [
      ['What Vite Does', 'Vite is a **build tool**. It creates the project structure, serves the project while you work, and updates the page the moment you save a file.\n\nThat instant update is called **hot reload**: change a heading, save, and the browser shows it in under a second.'],
      ['Create the Project', 'Run one command in the folder where you keep your projects. Vite asks a couple of questions; choose the **React** template and JavaScript (TypeScript works just as well if you prefer it).'],
      ['The First Run', 'Vite prints the folder it created. Move into that folder, install the packages, and start the server. It shows a local address — usually `http://localhost:5173` — which you open in your browser.'],
    ],
    code: {
      language: 'bash',
      title: 'Create and Start',
      code: `npm create vite@latest my-first-app -- --template react
cd my-first-app
npm install
npm run dev`,
      explain: 'Line 1 asks Vite to create the folder `my-first-app` using the React template.\n\nLine 2 moves the terminal into that folder, line 3 downloads the packages listed in `package.json`, and line 4 starts the development server and prints the local address.',
    },
    tryIt: {
      task: 'Create your own React project and open it in the browser.',
      steps: [
        'Run the four commands, replacing `my-first-app` with a name you like.',
        'Open the printed address in your browser.',
        'Delete the extra starter content so only "Hello React" remains.',
      ],
      expected: 'The browser first shows the Vite starter page, then your own short message. Saving a file updates the page automatically.',
    },
    mistakes: [
      ['Running the command in the wrong folder', 'Check the terminal prompt, create the project in your projects folder, and avoid running it twice in the same place.'],
      ['Skipping `npm install`', 'Without it the packages are missing and `npm run dev` fails with "cannot find module".'],
    ],
    check: ['What is hot reload?', [
      'The page updates automatically when you save a file',
      'The computer restarts itself',
      'The browser reloads from the server every 10 seconds',
      'A way to install packages faster',
    ], 0, 'Hot reload watches your files and updates the page as soon as you save.'],
    summary: [
      'Vite creates the project structure and runs it while you work.',
      'One command creates a project; `npm install` downloads the packages.',
      '`npm run dev` starts the server, and hot reload shows changes instantly.',
    ],
    quiz: [
      mcq('Which command creates a new React project with Vite?', ['npm create vite@latest my-app -- --template react', 'npm install react', 'node create react', 'npm start project'], 0, 'create-vite scaffolds the folder with the React template.'),
      mcq('What does `npm run dev` do?', ['Starts the development server', 'Builds the final site for hosting', 'Deletes the project', 'Installs React'], 0, 'It starts the development server so you can open the app on localhost.'),
      fill('The automatic page update after saving a file is called hot ______.', 'reload', 'Vite watches your files and reloads the page automatically — hot reload.'),
      tf('You must create every project file and folder by hand before using Vite.', false, 'Vite creates the whole structure for you.'),
      mcq('`npm run dev` reports a missing module. What should you try first?', ['Run `npm install` inside the project folder', 'Reinstall the operating system', 'Delete all the files', 'Change the CSS'], 0, 'Packages are installed per project, so run npm install inside the project folder.'),
    ],
  }),

  // __APPEND__
])
