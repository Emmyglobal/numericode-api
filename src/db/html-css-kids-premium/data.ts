// AUTO-GENERATED from content/courses/html-css-kids-premium.json. Do not edit by hand.
import type { KidsModuleData } from './types'

export const KIDS_MODULES: KidsModuleData[] = [
  {
    id: "kids-mod-1",
    title: "Module 1 - Welcome to Web World",
    position: 0,
    lessons: [
      {
        id: "kids-1-1",
        week: 1,
        title: "Welcome to Web World",
        learningObjectives: [
        "Say what HTML and CSS do",  "Tell skeleton from paint",  "Name browser and server"
    ],
        content: "# Slide 1 - Welcome, Web Builder!\n\nHello superstar! I am **Captain Code** and this is **Pixel the Puppy**. Every game page was built by someone like YOU.\n\n- **HTML** is the skeleton (bones)\n- **CSS** is the clothes and paint (style)\n\n---\n\n# Slide 2 - HTML Is the Skeleton\n\nA house needs **bones**: walls, doors, windows. HTML builds page bones: headings, words, pictures, buttons.\n\n- `HTML` = **HyperText Markup Language**\n- HyperText = pages linked like a spider web\n- Markup = labels saying what each part is\n\n---\n\n# Slide 3 - CSS Is the Paint\n\n**CSS** = **Cascading Style Sheets**. It paints the bones!\n\n- Pink headings, blue buttons = CSS\n- Same HTML + new CSS = brand-new costume\n\n---\n\n# Slide 4 - Where Do Pages Live?\n\n1. Type an address like `cool-games.com`\n2. A **server** sends back an HTML file\n3. Your **browser** draws the page\n\nYour browser is a storybook reader!\n\n---\n\n# Slide 5 - You Are a Builder Now\n\n- Every coder started with one tiny page\n- Mistakes are GOOD - they grow your brain\n- **Mission:** tell someone at home what HTML and CSS do!\n\n> Captain Code says: HTML builds it. CSS makes it beautiful. YOU command both.",
        quiz: {
          title: "Quiz - Welcome to Web World",
          description: "8 fun questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k11q1", questionType: "multiple_choice", question: "What does HTML build?", options: [
    { id: "a", text: "Skeleton of the page", isCorrect: true },    { id: "b", text: "Paint and clothes", isCorrect: false },    { id: "c", text: "Internet cables", isCorrect: false },    { id: "d", text: "A mouse", isCorrect: false }
  ], correctAnswer: "a", explanation: "HTML builds structure" },      { id: "k11q2", questionType: "multiple_choice", question: "What does CSS do?", options: [
    { id: "a", text: "Builds bones", isCorrect: false },    { id: "b", text: "Paints and styles", isCorrect: true },    { id: "c", text: "Sends files", isCorrect: false },    { id: "d", text: "Draws webs", isCorrect: false }
  ], correctAnswer: "b", explanation: "CSS is paint" },      { id: "k11q3", questionType: "true_false", question: "HTML means HyperText Markup Language.", correctAnswer: "true", explanation: "Correct!" },      { id: "k11q4", questionType: "short_answer", question: "Which program draws web pages for you?", correctAnswer: "browser", explanation: "A browser draws pages" },      { id: "k11q5", questionType: "multiple_choice", question: "Which computer sends pages to you?", options: [
    { id: "a", text: "Server", isCorrect: true },    { id: "b", text: "Printer", isCorrect: false },    { id: "c", text: "Speaker", isCorrect: false },    { id: "d", text: "Calculator", isCorrect: false }
  ], correctAnswer: "a", explanation: "Servers send files" },      { id: "k11q6", questionType: "fill_blank", question: "HTML is the ____ and CSS is the paint.", correctAnswer: "skeleton", explanation: "HTML is the skeleton" },      { id: "k11q7", questionType: "true_false", question: "Mistakes help your brain grow.", correctAnswer: "true", explanation: "Mistakes mean learning" },      { id: "k11q8", questionType: "multiple_choice", question: "HyperText means pages are...", options: [
    { id: "a", text: "Linked like a web", isCorrect: true },    { id: "b", text: "Printed on paper", isCorrect: false },    { id: "c", text: "Hidden away", isCorrect: false },    { id: "d", text: "Very large", isCorrect: false }
  ], correctAnswer: "a", explanation: "Links make a web" }
  ],
        },
        assignment: {
  title: "Assignment 1.1 - My Web World Poster",
  description: "Draw or write. Ask a grown-up to photo your work.",
  dueDate: "2026-11-07T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k11a1", type: "theory", question: "Draw your dream page skeleton: heading, picture box, button. Label each.", marks: 6 },        { id: "k11a2", type: "theory", question: "Colour it with CSS colours. Write what CSS changed.", marks: 6 },        { id: "k11a3", type: "theory", question: "Tell Pixel the Puppy what a browser does.", marks: 4 },        { id: "k11a4", type: "theory", question: "Name a site you love. Which parts are bones? Which are paint?", marks: 4 }
  ],
        },
        resources: [
      { id: "kr1", title: "MDN - What is HTML?", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML", description: "Friendly HTML intro" },      { id: "kids-1-1-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module1-lesson1.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 35
      },      {
        id: "kids-1-2",
        week: 1,
        title: "Your First Tags: Headings and Paragraphs",
        learningObjectives: [
        "Write h1, h2, p tags",  "Explain open and close tags",  "Build an About Me page"
    ],
        content: "# Slide 1 - Tags Are Magic Labels\n\nA **tag** is a magic label. `<h1>` says START a big heading. `</h1>` says STOP.\n\n- Opening tag `<h1>` = start here!\n- Closing tag `</h1>` = slash means STOP\n- Pixel remembers: slash = STOP\n\n---\n\n# Slide 2 - The Heading Family\n\n`h1` is loud grandpa. `h6` is tiny baby whisper.\n\n- `<h1>` biggest = page title\n- `<h2>` big = chapter title\n- `<h3>` medium = small topic\n- Only ONE `h1` per page!\n\n---\n\n# Slide 3 - Paragraphs Tell Stories\n\n`<p>` holds normal sentences.\n\n- `<p>I love mangoes.</p>`\n- Browsers add space around paragraphs\n\n---\n\n# Slide 4 - Build It Together\n\nType this:\n\n```html\n<h1>My name is Ada</h1>\n<h2>I love dinosaurs</h2>\n<p>They are big and stompy.</p>\n```\n\nForgot the slash? The hug never ends!\n\n---\n\n# Slide 5 - Star Challenge\n\n> Make an About Me page: one `h1`, one `h2`, two `p` tags. Read it aloud like a superstar!",
        quiz: {
          title: "Quiz - Headings and Paragraphs",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k12q1", questionType: "multiple_choice", question: "Which is an opening tag?", options: [
    { id: "a", text: "<h1>", isCorrect: true },    { id: "b", text: "</h1>", isCorrect: false },    { id: "c", text: "h1", isCorrect: false },    { id: "d", text: "<h1/>", isCorrect: false }
  ], correctAnswer: "a", explanation: "No slash = opening" },      { id: "k12q2", questionType: "multiple_choice", question: "What does the slash mean?", options: [
    { id: "a", text: "STOP / close", isCorrect: true },    { id: "b", text: "Make bigger", isCorrect: false },    { id: "c", text: "Add colour", isCorrect: false },    { id: "d", text: "New page", isCorrect: false }
  ], correctAnswer: "a", explanation: "Slash closes" },      { id: "k12q3", questionType: "multiple_choice", question: "Biggest heading?", options: [
    { id: "a", text: "<h1>", isCorrect: true },    { id: "b", text: "<h3>", isCorrect: false },    { id: "c", text: "<h6>", isCorrect: false },    { id: "d", text: "<p>", isCorrect: false }
  ], correctAnswer: "a", explanation: "h1 is biggest" },      { id: "k12q4", questionType: "true_false", question: "Use only one h1 per page.", correctAnswer: "true", explanation: "One main title" },      { id: "k12q5", questionType: "short_answer", question: "Which tag holds story sentences?", correctAnswer: "p", explanation: "The p tag" },      { id: "k12q6", questionType: "fill_blank", question: "A closing tag starts with a ____.", correctAnswer: "slash", explanation: "Slash means stop" },      { id: "k12q7", questionType: "multiple_choice", question: "<h2> is...?", options: [
    { id: "a", text: "Chapter heading", isCorrect: true },    { id: "b", text: "Tiny whisper", isCorrect: false },    { id: "c", text: "Picture", isCorrect: false },    { id: "d", text: "Button", isCorrect: false }
  ], correctAnswer: "a", explanation: "h2 = chapter" },      { id: "k12q8", questionType: "true_false", question: "<p>Hi</p> is correctly closed.", correctAnswer: "true", explanation: "Opens and closes" }
  ],
        },
        assignment: {
  title: "Assignment 1.2 - About Me Page",
  description: "Type code and show a grown-up.",
  dueDate: "2026-11-08T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k12a1", type: "code", question: "Write h1 with your name and h2 with favourite animal.", marks: 6 },        { id: "k12a2", type: "code", question: "Write two p tags: hobby + best friend.", marks: 6 },        { id: "k12a3", type: "theory", question: "Circle opening and closing tags. What is the difference?", marks: 4 },        { id: "k12a4", type: "theory", question: "What happens if you forget a closing tag?", marks: 4 }
  ],
        },
        resources: [
      { id: "kr3", title: "MDN - Headings", type: "link", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements", description: "Heading reference" },      { id: "kids-1-2-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module1-lesson2.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 40
      },      {
        id: "kids-1-3",
        week: 1,
        title: "Lists, Pictures and Links",
        learningObjectives: [
        "Build ul ol li lists",  "Add img with alt",  "Make a link"
    ],
        content: "# Slide 1 - Lists: Dots or Numbers?\n\nShopping lists use dots. Race results use numbers. HTML has both!\n\n- `<ul>` = unordered = dotty dots\n- `<ol>` = ordered = 1, 2, 3\n- `<li>` = each list item\n\n---\n\n# Slide 2 - Dotty vs Numbered\n\n```html\n<ul><li>Mango</li><li>Rice</li></ul>\n<ol><li>Wake up</li><li>Brush teeth</li></ol>\n```\n\nShopping = dots. Steps = numbers!\n\n---\n\n# Slide 3 - Pictures Need Alt Words\n\n`<img>` shows a picture. Needs `src` (where) + `alt` (words for helpers).\n\n- `<img src='puppy.png' alt='Happy puppy'>`\n- NO closing tag - one-tag wonder!\n\n---\n\n# Slide 4 - Links Are Teleporters\n\n`<a>` teleports you! `href` says WHERE.\n\n- `<a href='https://scratch.mit.edu'>Play Scratch</a>`\n- Words between tags = magic button\n\n---\n\n# Slide 5 - Favourites Page\n\n> Page with: dotty list of 3 foods, numbered morning steps, 1 picture, 1 link!",
        quiz: {
          title: "Quiz - Lists Pictures Links",
          description: "9 questions",
          timeLimit: 18,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k13q1", questionType: "multiple_choice", question: "Dotty list tag?", options: [
    { id: "a", text: "<ul>", isCorrect: true },    { id: "b", text: "<ol>", isCorrect: false },    { id: "c", text: "<img>", isCorrect: false },    { id: "d", text: "<a>", isCorrect: false }
  ], correctAnswer: "a", explanation: "ul = dots" },      { id: "k13q2", questionType: "multiple_choice", question: "Numbered list tag?", options: [
    { id: "a", text: "<ul>", isCorrect: false },    { id: "b", text: "<ol>", isCorrect: true },    { id: "c", text: "<li>", isCorrect: false },    { id: "d", text: "<list>", isCorrect: false }
  ], correctAnswer: "b", explanation: "ol = ordered" },      { id: "k13q3", questionType: "short_answer", question: "Tag for each single list item?", correctAnswer: "li", explanation: "li wraps items" },      { id: "k13q4", questionType: "multiple_choice", question: "What does src do?", options: [
    { id: "a", text: "Tells where picture lives", isCorrect: true },    { id: "b", text: "Makes bigger", isCorrect: false },    { id: "c", text: "Adds link", isCorrect: false },    { id: "d", text: "Closes tag", isCorrect: false }
  ], correctAnswer: "a", explanation: "src = source" },      { id: "k13q5", questionType: "multiple_choice", question: "Why alt text?", options: [
    { id: "a", text: "Describes picture for everyone", isCorrect: true },    { id: "b", text: "Loads slower", isCorrect: false },    { id: "c", text: "Hides it", isCorrect: false },    { id: "d", text: "Deletes it", isCorrect: false }
  ], correctAnswer: "a", explanation: "Alt helps all" },      { id: "k13q6", questionType: "true_false", question: "img needs a closing tag.", correctAnswer: "false", explanation: "No closing tag" },      { id: "k13q7", questionType: "multiple_choice", question: "href tells a link...?", options: [
    { id: "a", text: "Where to go", isCorrect: true },    { id: "b", text: "What colour", isCorrect: false },    { id: "c", text: "How big", isCorrect: false },    { id: "d", text: "When to sleep", isCorrect: false }
  ], correctAnswer: "a", explanation: "href = destination" },      { id: "k13q8", questionType: "fill_blank", question: "Links use the ____ tag.", correctAnswer: "a", explanation: "The a tag" },      { id: "k13q9", questionType: "true_false", question: "Shopping lists suit numbered ol.", correctAnswer: "false", explanation: "No order - use ul" }
  ],
        },
        assignment: {
  title: "Assignment 1.3 - My Favourites Page",
  description: "Build and show a grown-up.",
  dueDate: "2026-11-09T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k13a1", type: "code", question: "ul with 3 favourite foods.", marks: 5 },        { id: "k13a2", type: "code", question: "ol with 3 morning steps.", marks: 5 },        { id: "k13a3", type: "code", question: "One img (src+alt) plus one a link (href).", marks: 6 },        { id: "k13a4", type: "theory", question: "Why is alt text kind? Two sentences.", marks: 4 }
  ],
        },
        resources: [
      { id: "kr5", title: "MDN - Lists", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Lists", description: "List guide" },      { id: "kids-1-3-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module1-lesson3.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 45
      },
    ],
  },
  {
    id: "kids-mod-2",
    title: "Module 2 - CSS Colour Magic",
    position: 1,
    lessons: [
      {
        id: "kids-2-1",
        week: 2,
        title: "CSS Dress-Up Day",
        learningObjectives: [
        "Use a style tag",  "Explain selector property value",  "Paint text and backgrounds"
    ],
        content: "# Slide 1 - CSS Is Dress-Up Day!\n\nHTML built bones. Now CSS dresses them up! Three ways to add CSS - inline, style tag, or style file.\n\n- `Inline` = paint one tag only\n- `<style>` = paint the whole page\n- Easiest today: the `<style>` tag!\n\n---\n\n# Slide 2 - Pick a Target!\n\nA **selector** picks WHO gets painted.\n\n```html\n<style>h1 { color: purple; }</style>\n```\n\n- `h1` = selector (who?)\n- `color` = property (what?)\n- `purple` = value (which?)\n\n---\n\n# Slide 3 - Rainbow Colours\n\n- Word colours: `red`, `blue`, `hotpink`\n- Hex codes: `#FF6B6B` = coral red!\n- Try: `h1 { color: tomato; }`\n\n> Pixel tip: hex codes are secret colour passwords!\n\n---\n\n# Slide 4 - Paint the Background\n\n`background-color` paints BEHIND words.\n\n```html\n<style>body { background-color: lightyellow; }</style>\n```\n\nLight backgrounds + dark words = easy reading!\n\n---\n\n# Slide 5 - Rainbow Page Mission\n\n> Paint all h1 purple, all p blue, body lightyellow. Screenshot your rainbow!",
        quiz: {
          title: "Quiz - CSS Dress-Up Day",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k21q1", questionType: "multiple_choice", question: "What is a selector?", options: [
    { id: "a", text: "Picks who gets painted", isCorrect: true },    { id: "b", text: "A colour", isCorrect: false },    { id: "c", text: "A picture", isCorrect: false },    { id: "d", text: "A link", isCorrect: false }
  ], correctAnswer: "a", explanation: "Selector picks target" },      { id: "k21q2", questionType: "multiple_choice", question: "In h1 { color: purple; } what is purple?", options: [
    { id: "a", text: "Value", isCorrect: true },    { id: "b", text: "Selector", isCorrect: false },    { id: "c", text: "Property", isCorrect: false },    { id: "d", text: "Tag", isCorrect: false }
  ], correctAnswer: "a", explanation: "purple is the value" },      { id: "k21q3", questionType: "short_answer", question: "Which property paints behind words?", correctAnswer: "background-color", explanation: "background-color paints behind" },      { id: "k21q4", questionType: "multiple_choice", question: "#FF6B6B is...?", options: [
    { id: "a", text: "A hex colour code", isCorrect: true },    { id: "b", text: "A tag", isCorrect: false },    { id: "c", text: "A link", isCorrect: false },    { id: "d", text: "A list", isCorrect: false }
  ], correctAnswer: "a", explanation: "Hex colour password" },      { id: "k21q5", questionType: "true_false", question: "Inline CSS paints the whole page.", correctAnswer: "false", explanation: "Inline paints one tag only" },      { id: "k21q6", questionType: "fill_blank", question: "In h1 { color: red; } the word color is the ____.", correctAnswer: "property", explanation: "property = what to change" },      { id: "k21q7", questionType: "multiple_choice", question: "Best reading combo?", options: [
    { id: "a", text: "Light bg + dark words", isCorrect: true },    { id: "b", text: "Dark bg + dark words", isCorrect: false },    { id: "c", text: "Tiny words", isCorrect: false },    { id: "d", text: "No space", isCorrect: false }
  ], correctAnswer: "a", explanation: "Contrast helps reading" },      { id: "k21q8", questionType: "true_false", question: "CSS can dress up HTML bones.", correctAnswer: "true", explanation: "CSS styles everything" }
  ],
        },
        assignment: {
  title: "Assignment 2.1 - Rainbow Page",
  description: "Paint your About Me page.",
  dueDate: "2026-11-14T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k21a1", type: "code", question: "Style tag: h1 purple, p blue.", marks: 6 },        { id: "k21a2", type: "code", question: "Body background lightyellow.", marks: 5 },        { id: "k21a3", type: "theory", question: "Label selector, property, value in your code.", marks: 5 },        { id: "k21a4", type: "theory", question: "Which colour combo reads best? Why?", marks: 4 }
  ],
        },
        resources: [
      { id: "kr7", title: "MDN - CSS First Steps", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps", description: "CSS intro" },      { id: "kids-2-1-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module2-lesson1.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 40
      },      {
        id: "kids-2-2",
        week: 2,
        title: "Funky Fonts",
        learningObjectives: [
        "Set size family weight style align",  "Pick readable combos",  "Build a poster"
    ],
        content: "# Slide 1 - Words Can Shout or Whisper!\n\nBig bold words SHOUT. Tiny words whisper. CSS controls the voice!\n\n- `font-size` = how big (px = tiny dots)\n- `16px` = normal book size\n- `32px` = big shout!\n\n---\n\n# Slide 2 - Font Families Are Outfits\n\n`font-family` picks the outfit: fancy, fun, or plain.\n\n- `Arial` = plain and clear\n- `Georgia` = fancy storybook\n- `Comic Sans MS` = playful!\n- End with a backup: `Arial, sans-serif`\n\n---\n\n# Slide 3 - Bold, Italic, Centre!\n\n- `font-weight: bold;` = strong muscles\n- `font-style: italic;` = leaning slide\n- `text-align: center;` = middle march!\n\n---\n\n# Slide 4 - Magic Recipe\n\n```html\n<style>\nh1 { font-size: 40px; font-family: Georgia, serif; text-align: center; }\np { font-size: 18px; }\n</style>\n```\n\nBig + fancy + centred = party poster heading!\n\n---\n\n# Slide 5 - Party Poster Mission\n\n> Turn your page into a birthday poster: giant centred h1, fun font, one bold line, one italic line!",
        quiz: {
          title: "Quiz - Funky Fonts",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k22q1", questionType: "multiple_choice", question: "font-size controls...?", options: [
    { id: "a", text: "How big words are", isCorrect: true },    { id: "b", text: "Which font", isCorrect: false },    { id: "c", text: "Bold or not", isCorrect: false },    { id: "d", text: "Position", isCorrect: false }
  ], correctAnswer: "a", explanation: "Size = bigness" },      { id: "k22q2", questionType: "short_answer", question: "Normal book-size words are about how many px?", correctAnswer: "16px", explanation: "16px is normal" },      { id: "k22q3", questionType: "multiple_choice", question: "font-family picks...?", options: [
    { id: "a", text: "The font outfit", isCorrect: true },    { id: "b", text: "The size", isCorrect: false },    { id: "c", text: "The colour", isCorrect: false },    { id: "d", text: "The link", isCorrect: false }
  ], correctAnswer: "a", explanation: "Family = typeface" },      { id: "k22q4", questionType: "multiple_choice", question: "Which makes words strong?", options: [
    { id: "a", text: "font-weight: bold", isCorrect: true },    { id: "b", text: "font-style: italic", isCorrect: false },    { id: "c", text: "text-align: center", isCorrect: false },    { id: "d", text: "color: red", isCorrect: false }
  ], correctAnswer: "a", explanation: "weight bold = strong" },      { id: "k22q5", questionType: "multiple_choice", question: "Which leans words sideways?", options: [
    { id: "a", text: "font-style: italic", isCorrect: true },    { id: "b", text: "font-weight: bold", isCorrect: false },    { id: "c", text: "font-size: 40px", isCorrect: false },    { id: "d", text: "background: blue", isCorrect: false }
  ], correctAnswer: "a", explanation: "italic leans" },      { id: "k22q6", questionType: "fill_blank", question: "____ centres your words.", correctAnswer: "text-align", explanation: "text-align: center" },      { id: "k22q7", questionType: "true_false", question: "Comic Sans MS looks playful.", correctAnswer: "true", explanation: "Fun rounded letters" },      { id: "k22q8", questionType: "true_false", question: "Always list a backup font.", correctAnswer: "true", explanation: "Backups keep pages readable" }
  ],
        },
        assignment: {
  title: "Assignment 2.2 - Party Poster",
  description: "Style a birthday poster.",
  dueDate: "2026-11-15T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k22a1", type: "code", question: "Giant centred h1 (36px+) with fun font.", marks: 6 },        { id: "k22a2", type: "code", question: "One bold line and one italic line.", marks: 6 },        { id: "k22a3", type: "theory", question: "Why did you pick your font? Two sentences.", marks: 4 },        { id: "k22a4", type: "theory", question: "What px size reads best for paragraphs? Why?", marks: 4 }
  ],
        },
        resources: [
      { id: "kr8", title: "MDN - Fonts", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals", description: "Text styling" },      { id: "kids-2-2-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module2-lesson2.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 40
      },      {
        id: "kids-2-3",
        week: 2,
        title: "Magic Boxes: Borders and Space",
        learningObjectives: [
        "Style borders",  "Use padding and margin",  "Reuse styles with classes"
    ],
        content: "# Slide 1 - Every Word Lives in a Box!\n\nInvisible boxes wrap everything! CSS decorates boxes with borders, space inside (padding) and space outside (margin).\n\n- `border` = fence around box\n- `padding` = cushion inside\n- `margin` = playground outside\n\n---\n\n# Slide 2 - Build a Fence\n\n`border: 3px solid hotpink;` = thick pink fence!\n\n- Size: `3px`\n- Style: `solid` or `dashed`\n- Colour: `hotpink`\n- Round it: `border-radius: 15px;`\n\n---\n\n# Slide 3 - Cushions vs Playgrounds\n\n- `padding: 20px;` = cushions inside so words breathe\n- `margin: 20px;` = space OUTSIDE so boxes do not hug\n- Pixel says: padding IN, margin OUT!\n\n---\n\n# Slide 4 - Name Tags: Classes!\n\n`class` gives nicknames. `.fun` paints every box with class fun!\n\n```html\n<style>.fun { border: 3px solid teal; padding: 15px; }</style>\n<p class='fun'>I am a fun box!</p>\n```\n\nDot means class!\n\n---\n\n# Slide 5 - Box Zoo Mission\n\n> Make 3 boxes: pink solid, blue dashed rounded, teal class box. Which cushion size feels comfiest?",
        quiz: {
          title: "Quiz - Magic Boxes",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k23q1", questionType: "multiple_choice", question: "Border is like...?", options: [
    { id: "a", text: "A fence", isCorrect: true },    { id: "b", text: "A cushion", isCorrect: false },    { id: "c", text: "A playground", isCorrect: false },    { id: "d", text: "A car", isCorrect: false }
  ], correctAnswer: "a", explanation: "Border fences boxes" },      { id: "k23q2", questionType: "multiple_choice", question: "Padding is...?", options: [
    { id: "a", text: "Space INSIDE", isCorrect: true },    { id: "b", text: "Space OUTSIDE", isCorrect: false },    { id: "c", text: "A fence", isCorrect: false },    { id: "d", text: "A colour", isCorrect: false }
  ], correctAnswer: "a", explanation: "Padding cushions inside" },      { id: "k23q3", questionType: "multiple_choice", question: "Margin is...?", options: [
    { id: "a", text: "Space OUTSIDE", isCorrect: true },    { id: "b", text: "Space INSIDE", isCorrect: false },    { id: "c", text: "A fence colour", isCorrect: false },    { id: "d", text: "A font", isCorrect: false }
  ], correctAnswer: "a", explanation: "Margin is outside space" },      { id: "k23q4", questionType: "short_answer", question: "Which property rounds corners?", correctAnswer: "border-radius", explanation: "border-radius rounds" },      { id: "k23q5", questionType: "true_false", question: "Classes start with a dot in CSS.", correctAnswer: "true", explanation: ".fun = class fun" },      { id: "k23q6", questionType: "fill_blank", question: "border: 3px ____ hotpink - fence style word?", correctAnswer: "solid", explanation: "solid makes full fence" },      { id: "k23q7", questionType: "multiple_choice", question: "<p class='fun'> uses which CSS?", options: [
    { id: "a", text: ".fun", isCorrect: true },    { id: "b", text: "#fun", isCorrect: false },    { id: "c", text: "fun", isCorrect: false },    { id: "d", text: "*fun", isCorrect: false }
  ], correctAnswer: "a", explanation: "Dot = class" },      { id: "k23q8", questionType: "true_false", question: "Big padding makes words breathe.", correctAnswer: "true", explanation: "Padding adds inside air" }
  ],
        },
        assignment: {
  title: "Assignment 2.3 - Box Zoo",
  description: "Build 3 styled boxes.",
  dueDate: "2026-11-16T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k23a1", type: "code", question: "Box 1: solid pink border + padding 15px.", marks: 6 },        { id: "k23a2", type: "code", question: "Box 2: dashed blue border + radius 15px + margin.", marks: 6 },        { id: "k23a3", type: "code", question: "Box 3 using a class you invented.", marks: 4 },        { id: "k23a4", type: "theory", question: "Explain padding vs margin to Pixel in 2 sentences.", marks: 4 }
  ],
        },
        resources: [
      { id: "kr9", title: "MDN - Box Model", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model", description: "Box guide" },      { id: "kids-2-3-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module2-lesson3.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 45
      },
    ],
  },
  {
    id: "kids-mod-3",
    title: "Module 3 - Build the House",
    position: 2,
    lessons: [
      {
        id: "kids-3-1",
        week: 3,
        title: "Rooms: Divs and Sections",
        learningObjectives: [
        "Use header main footer",  "Group with div",  "Explain why structure helps"
    ],
        content: "# Slide 1 - Pages Need Rooms!\n\nBig pages need rooms: header (door), main (living room), footer (garden). `div` builds any room!\n\n- `<header>` = top door with title\n- `<main>` = middle living room\n- `<footer>` = bottom garden\n- `<div>` = any box room\n\n---\n\n# Slide 2 - Meet Div the Room Builder\n\n```html\n<div class='room'>\n<h2>My Pets</h2>\n<p>Cats rule!</p>\n</div>\n```\n\nOne div holds heading + words together like a lunchbox!\n\n---\n\n# Slide 3 - Sections Are Chapters\n\n`<section>` = a chapter. `<header>` and `<footer>` = special rooms browsers understand.\n\n- Chapters help screen readers jump around\n- Helpers for blind friends read rooms aloud!\n\n---\n\n# Slide 4 - Stack Rooms Tall\n\nRooms stack top to bottom automatically. Paint each its own colour to SEE the rooms!\n\n> Tip: give header, main, footer different background-colours.\n\n---\n\n# Slide 5 - My House Page Mission\n\n> Build: header with h1, main with 2 div rooms, footer with your name. Paint each room!",
        quiz: {
          title: "Quiz - Rooms and Divs",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k31q1", questionType: "multiple_choice", question: "Which tag is the top door?", options: [
    { id: "a", text: "<header>", isCorrect: true },    { id: "b", text: "<footer>", isCorrect: false },    { id: "c", text: "<div>", isCorrect: false },    { id: "d", text: "<img>", isCorrect: false }
  ], correctAnswer: "a", explanation: "header is top" },      { id: "k31q2", questionType: "multiple_choice", question: "Which holds the middle?", options: [
    { id: "a", text: "<main>", isCorrect: true },    { id: "b", text: "<header>", isCorrect: false },    { id: "c", text: "<a>", isCorrect: false },    { id: "d", text: "<li>", isCorrect: false }
  ], correctAnswer: "a", explanation: "main is middle" },      { id: "k31q3", questionType: "short_answer", question: "Which tag builds any box room?", correctAnswer: "div", explanation: "div builds rooms" },      { id: "k31q4", questionType: "multiple_choice", question: "Footer sits...?", options: [
    { id: "a", text: "At the bottom", isCorrect: true },    { id: "b", text: "At the top", isCorrect: false },    { id: "c", text: "Inside img", isCorrect: false },    { id: "d", text: "Nowhere", isCorrect: false }
  ], correctAnswer: "a", explanation: "footer is bottom" },      { id: "k31q5", questionType: "true_false", question: "Rooms help screen readers.", correctAnswer: "true", explanation: "Structure helps all" },      { id: "k31q6", questionType: "fill_blank", question: "A ____ groups heading plus words.", correctAnswer: "div", explanation: "div groups bits" },      { id: "k31q7", questionType: "multiple_choice", question: "section means...?", options: [
    { id: "a", text: "A chapter", isCorrect: true },    { id: "b", text: "A colour", isCorrect: false },    { id: "c", text: "A link", isCorrect: false },    { id: "d", text: "A fence", isCorrect: false }
  ], correctAnswer: "a", explanation: "section = chapter" },      { id: "k31q8", questionType: "true_false", question: "Rooms stack top to bottom.", correctAnswer: "true", explanation: "Block flow stacks" }
  ],
        },
        assignment: {
  title: "Assignment 3.1 - My House Page",
  description: "Rooms with colour.",
  dueDate: "2026-11-21T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k31a1", type: "code", question: "Header with h1 title.", marks: 5 },        { id: "k31a2", type: "code", question: "Main with 2 div rooms, each own colour.", marks: 6 },        { id: "k31a3", type: "code", question: "Footer with your name.", marks: 4 },        { id: "k31a4", type: "theory", question: "Why do rooms help visitors? 2 sentences.", marks: 5 }
  ],
        },
        resources: [
      { id: "kr10", title: "MDN - Sections", type: "link", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section", description: "Section guide" },      { id: "kids-3-1-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module3-lesson1.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 40
      },      {
        id: "kids-3-2",
        week: 3,
        title: "Side by Side: Flexbox Cards",
        learningObjectives: [
        "Line boxes with flex",  "Size cards safely",  "Wrap for phones"
    ],
        content: "# Slide 1 - March in a Row!\n\nBlocks stack tall. **Flexbox** lines them side by side like ducklings!\n\n```html\n<style>.row { display: flex; gap: 15px; }</style>\n```\n\n- `display: flex` = line up!\n- `gap` = space between ducklings\n\n---\n\n# Slide 2 - Toy Cars Need Widths\n\nGive each card a width so they share the road.\n\n- `width: 200px` = fixed car\n- `flex: 1` = share evenly!\n- Images: `max-width: 100%` so they never burst out\n\n---\n\n# Slide 3 - Wrap on Small Phones\n\n`flex-wrap: wrap;` lets cards hop to the next line on tiny screens.\n\n- No wrap = squished!\n- Wrap = comfy on phones\n\n---\n\n# Slide 4 - Card Recipe\n\n```html\n<div class='row'>\n<div class='card'>Lions</div>\n<div class='card'>Pandas</div>\n<div class='card'>Eagles</div>\n</div>\n```\n\nPaint .card with border + padding + radius!\n\n---\n\n# Slide 5 - Animal Cards Mission\n\n> 3 animal cards side by side with picture, heading, one line. Wrap on phones!",
        quiz: {
          title: "Quiz - Side by Side",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k32q1", questionType: "multiple_choice", question: "Flexbox lines boxes...?", options: [
    { id: "a", text: "Side by side", isCorrect: true },    { id: "b", text: "Taller", isCorrect: false },    { id: "c", text: "Invisible", isCorrect: false },    { id: "d", text: "Upside down", isCorrect: false }
  ], correctAnswer: "a", explanation: "flex = row line" },      { id: "k32q2", questionType: "short_answer", question: "Which property adds space between flex kids?", correctAnswer: "gap", explanation: "gap spaces kids" },      { id: "k32q3", questionType: "multiple_choice", question: "flex: 1 means...?", options: [
    { id: "a", text: "Share evenly", isCorrect: true },    { id: "b", text: "Stay tiny", isCorrect: false },    { id: "c", text: "Hide", isCorrect: false },    { id: "d", text: "Turn red", isCorrect: false }
  ], correctAnswer: "a", explanation: "flex 1 shares" },      { id: "k32q4", questionType: "multiple_choice", question: "Images should use...?", options: [
    { id: "a", text: "max-width: 100%", isCorrect: true },    { id: "b", text: "width: 2000px", isCorrect: false },    { id: "c", text: "no width", isCorrect: false },    { id: "d", text: "display: none", isCorrect: false }
  ], correctAnswer: "a", explanation: "max-width keeps inside" },      { id: "k32q5", questionType: "true_false", question: "flex-wrap lets cards hop lines.", correctAnswer: "true", explanation: "wrap is phone-friendly" },      { id: "k32q6", questionType: "fill_blank", question: "____ lines boxes side by side.", correctAnswer: "flexbox", explanation: "flexbox rows" },      { id: "k32q7", questionType: "multiple_choice", question: "Blocks normally...?", options: [
    { id: "a", text: "Stack tall", isCorrect: true },    { id: "b", text: "Line up", isCorrect: false },    { id: "c", text: "Hide", isCorrect: false },    { id: "d", text: "Float", isCorrect: false }
  ], correctAnswer: "a", explanation: "blocks stack" },      { id: "k32q8", questionType: "true_false", question: "Gap adds air between cards.", correctAnswer: "true", explanation: "gap = air" }
  ],
        },
        assignment: {
  title: "Assignment 3.2 - Animal Cards",
  description: "3-card row.",
  dueDate: "2026-11-22T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k32a1", type: "code", question: "Row div with display flex + gap.", marks: 5 },        { id: "k32a2", type: "code", question: "3 cards each with heading + picture + line.", marks: 7 },        { id: "k32a3", type: "code", question: "flex-wrap so phones stay comfy.", marks: 4 },        { id: "k32a4", type: "theory", question: "What happens without wrap on a phone?", marks: 4 }
  ],
        },
        resources: [
      { id: "kr11", title: "MDN - Flexbox", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox", description: "Flexbox guide" },      { id: "kids-3-2-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module3-lesson2.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 45
      },      {
        id: "kids-3-3",
        week: 3,
        title: "Buttons and Menus",
        learningObjectives: [
        "Style buttons",  "Add hover",  "Build flex menu"
    ],
        content: "# Slide 1 - Buttons Beg for Clicks!\n\n`<button>` = a clickable buddy. `<a>` styled = teleporter button.\n\n```html\n<button>Click me!</button>\n<a class='btn' href='pets.html'>See pets</a>\n```\n\n---\n\n# Slide 2 - Dress Your Button\n\n```html\n<style>.btn { background: hotpink; color: white; padding: 12px 20px; border-radius: 999px; }</style>\n```\n\n- Big padding = easy tap\n- Round = friendly\n- White on pink = readable!\n\n---\n\n# Slide 3 - Hover Magic!\n\n`:hover` = when mouse tickles the button!\n\n- `.btn:hover { background: purple; }`\n- Try: grow it! `transform: scale(1.05);`\n- Buttons feel ALIVE\n\n---\n\n# Slide 4 - Menus March Across\n\nNav menus = flexbox row of links!\n\n```html\n<nav class='menu'><a href='#'>Home</a><a href='#'>Pets</a><a href='#'>Games</a></nav>\n```\n\nDisplay flex + gap = tidy menu.\n\n---\n\n# Slide 5 - Menu Mission\n\n> Menu with 3 links + 1 big button with hover magic. Test every click!",
        quiz: {
          title: "Quiz - Buttons and Menus",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k33q1", questionType: "multiple_choice", question: "Clickable buddy tag?", options: [
    { id: "a", text: "<button>", isCorrect: true },    { id: "b", text: "<div>", isCorrect: false },    { id: "c", text: "<p>", isCorrect: false },    { id: "d", text: "<h1>", isCorrect: false }
  ], correctAnswer: "a", explanation: "button clicks" },      { id: "k33q2", questionType: "short_answer", question: "Hover selector for .btn?", correctAnswer: ".btn:hover", explanation: "hover magic" },      { id: "k33q3", questionType: "multiple_choice", question: "999px radius makes...?", options: [
    { id: "a", text: "Pill shape", isCorrect: true },    { id: "b", text: "Square", isCorrect: false },    { id: "c", text: "Invisible", isCorrect: false },    { id: "d", text: "Tiny", isCorrect: false }
  ], correctAnswer: "a", explanation: "Big radius = pill" },      { id: "k33q4", questionType: "true_false", question: "Big padding helps tapping.", correctAnswer: "true", explanation: "Fat buttons tap easy" },      { id: "k33q5", questionType: "fill_blank", question: "Menus march using ____.", correctAnswer: "flexbox", explanation: "flex rows menus" },      { id: "k33q6", questionType: "multiple_choice", question: "White on pink is...?", options: [
    { id: "a", text: "Readable", isCorrect: true },    { id: "b", text: "Invisible", isCorrect: false },    { id: "c", text: "Scary", isCorrect: false },    { id: "d", text: "Broken", isCorrect: false }
  ], correctAnswer: "a", explanation: "High contrast reads" },      { id: "k33q7", questionType: "multiple_choice", question: "scale(1.05) does...?", options: [
    { id: "a", text: "Grows a little", isCorrect: true },    { id: "b", text: "Shrinks lots", isCorrect: false },    { id: "c", text: "Hides", isCorrect: false },    { id: "d", text: "Spins", isCorrect: false }
  ], correctAnswer: "a", explanation: "Slight grow" },      { id: "k33q8", questionType: "true_false", question: "Links can look like buttons.", correctAnswer: "true", explanation: "Style a tags!" }
  ],
        },
        assignment: {
  title: "Assignment 3.3 - Menu and Button",
  description: "Nav + button.",
  dueDate: "2026-11-23T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k33a1", type: "code", question: "Nav with 3 flex links.", marks: 6 },        { id: "k33a2", type: "code", question: "Big rounded button + hover style.", marks: 6 },        { id: "k33a3", type: "theory", question: "Why big padding on buttons?", marks: 4 },        { id: "k33a4", type: "theory", question: "What does hover tell the user?", marks: 4 }
  ],
        },
        resources: [
      { id: "kr12", title: "MDN - Buttons", type: "link", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button", description: "Button guide" },      { id: "kids-3-3-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module3-lesson3.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 40
      },
    ],
  },
  {
    id: "kids-mod-4",
    title: "Module 4 - Show-Off Pages",
    position: 3,
    lessons: [
      {
        id: "kids-4-1",
        week: 4,
        title: "Picture Galleries",
        learningObjectives: [
        "Use figure figcaption",  "Write responsive query",  "Test two sizes"
    ],
        content: "# Slide 1 - Galleries Show Off!\n\nGalleries = flexbox rows of picture cards. Each card: picture + caption words.\n\n- `<figure>` holds picture + words!\n- `<figcaption>` = caption words\n- Screen readers love figures!\n\n---\n\n# Slide 2 - Figure Recipe\n\n```html\n<figure class='card'>\n<img src='lion.jpg' alt='Lion yawning'>\n<figcaption>Leo the yawning lion</figcaption>\n</figure>\n```\n\nAlt talks to helpers. Caption talks to eyes!\n\n---\n\n# Slide 3 - Phones vs Computers\n\nComputers = wide rows. Phones = tall stacks! **Media queries** change CSS by size.\n\n```html\n<style>@media (max-width: 600px) { .row { flex-direction: column; } }</style>\n```\n\nUnder 600px = stack tall!\n\n---\n\n# Slide 4 - Test Like a Scientist\n\n1. Wide screen: side by side?\n2. Narrow phone: stacked?\n3. Pictures inside cards?\n4. Alt on every img?\n\n---\n\n# Slide 5 - Zoo Gallery Mission\n\n> 4-animal gallery: figures + captions + media query stack. Test wide AND narrow!",
        quiz: {
          title: "Quiz - Picture Galleries",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k41q1", questionType: "multiple_choice", question: "Figure holds...?", options: [
    { id: "a", text: "Picture + caption", isCorrect: true },    { id: "b", text: "Only links", isCorrect: false },    { id: "c", text: "Only buttons", isCorrect: false },    { id: "d", text: "Nothing", isCorrect: false }
  ], correctAnswer: "a", explanation: "figure groups media" },      { id: "k41q2", questionType: "short_answer", question: "Caption tag inside figure?", correctAnswer: "figcaption", explanation: "figcaption captions" },      { id: "k41q3", questionType: "multiple_choice", question: "Media queries change CSS by...?", options: [
    { id: "a", text: "Screen size", isCorrect: true },    { id: "b", text: "Time of day", isCorrect: false },    { id: "c", text: "Battery", isCorrect: false },    { id: "d", text: "Volume", isCorrect: false }
  ], correctAnswer: "a", explanation: "size rules" },      { id: "k41q4", questionType: "multiple_choice", question: "max-width 600px means...?", options: [
    { id: "a", text: "Phones stack", isCorrect: true },    { id: "b", text: "Hide all", isCorrect: false },    { id: "c", text: "Bigger text", isCorrect: false },    { id: "d", text: "No images", isCorrect: false }
  ], correctAnswer: "a", explanation: "small screens stack" },      { id: "k41q5", questionType: "true_false", question: "Alt talks to helpers.", correctAnswer: "true", explanation: "Alt describes images" },      { id: "k41q6", questionType: "fill_blank", question: "Column direction stacks ____.", correctAnswer: "tall", explanation: "column = tall stack" },      { id: "k41q7", questionType: "multiple_choice", question: "Galleries suit...?", options: [
    { id: "a", text: "Flexbox rows", isCorrect: true },    { id: "b", text: "Tables only", isCorrect: false },    { id: "c", text: "No CSS", isCorrect: false },    { id: "d", text: "Hidden divs", isCorrect: false }
  ], correctAnswer: "a", explanation: "flex galleries" },      { id: "k41q8", questionType: "true_false", question: "Test wide AND narrow.", correctAnswer: "true", explanation: "Responsive check" }
  ],
        },
        assignment: {
  title: "Assignment 4.1 - Zoo Gallery",
  description: "4-card gallery.",
  dueDate: "2026-11-28T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k41a1", type: "code", question: "4 figures each img alt + figcaption.", marks: 8 },        { id: "k41a2", type: "code", question: "Media query stacks under 600px.", marks: 6 },        { id: "k41a3", type: "theory", question: "Wide vs narrow: what changed?", marks: 3 },        { id: "k41a4", type: "theory", question: "Why alt + caption both?", marks: 3 }
  ],
        },
        resources: [
      { id: "kr13", title: "MDN - Media Queries", type: "link", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries", description: "Responsive guide" },      { id: "kids-4-1-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module4-lesson1.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 45
      },      {
        id: "kids-4-2",
        week: 4,
        title: "Hero Banners",
        learningObjectives: [
        "Build hero header",  "Blend gradients",  "Keep words short"
    ],
        content: "# Slide 1 - Heroes Say WOW!\n\nA **hero** = giant top banner: big title + short line + button. First thing visitors see!\n\n- One giant `h1`\n- One short `p`\n- One bright button\n\n---\n\n# Slide 2 - Gradient Skies\n\n`linear-gradient` blends two colours like sunset!\n\n```html\n<style>.hero { background: linear-gradient(purple, hotpink); color: white; padding: 50px; text-align: center; }</style>\n```\n\nWhite words pop on dark skies!\n\n---\n\n# Slide 3 - Centre Everything\n\n- `text-align: center;` marches words middle\n- Big `padding` = tall sky\n- Short words = strong WOW\n\n---\n\n# Slide 4 - Hero Recipe\n\n```html\n<header class='hero'>\n<h1>Space Pets Club</h1>\n<p>We draw cosmic cats!</p>\n<a class='btn' href='#join'>Join us</a>\n</header>\n```\n\nTitle + line + button = hero!\n\n---\n\n# Slide 5 - Hero Mission\n\n> Hero banner: gradient sky, giant centred title, short line, bright button. WOW test: does a friend say WOW?",
        quiz: {
          title: "Quiz - Hero Banners",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k42q1", questionType: "multiple_choice", question: "Hero sits...?", options: [
    { id: "a", text: "At the very top", isCorrect: true },    { id: "b", text: "At bottom", isCorrect: false },    { id: "c", text: "Hidden", isCorrect: false },    { id: "d", text: "Inside img", isCorrect: false }
  ], correctAnswer: "a", explanation: "hero is top banner" },      { id: "k42q2", questionType: "multiple_choice", question: "Gradient blends...?", options: [
    { id: "a", text: "Two colours", isCorrect: true },    { id: "b", text: "Two fonts", isCorrect: false },    { id: "c", text: "Two pages", isCorrect: false },    { id: "d", text: "Two mice", isCorrect: false }
  ], correctAnswer: "a", explanation: "gradient = blend" },      { id: "k42q3", questionType: "short_answer", question: "Property that centres words?", correctAnswer: "text-align", explanation: "text-align centres" },      { id: "k42q4", questionType: "multiple_choice", question: "Hero needs...?", options: [
    { id: "a", text: "Title + line + button", isCorrect: true },    { id: "b", text: "10 paragraphs", isCorrect: false },    { id: "c", text: "No button", isCorrect: false },    { id: "d", text: "Tiny words", isCorrect: false }
  ], correctAnswer: "a", explanation: "3 hero parts" },      { id: "k42q5", questionType: "true_false", question: "White pops on dark skies.", correctAnswer: "true", explanation: "Contrast WOW" },      { id: "k42q6", questionType: "fill_blank", question: "Big ____ makes tall skies.", correctAnswer: "padding", explanation: "padding grows hero" },      { id: "k42q7", questionType: "multiple_choice", question: "Short hero words are...?", options: [
    { id: "a", text: "Strong", isCorrect: true },    { id: "b", text: "Boring", isCorrect: false },    { id: "c", text: "Hidden", isCorrect: false },    { id: "d", text: "Wrong", isCorrect: false }
  ], correctAnswer: "a", explanation: "short = strong" },      { id: "k42q8", questionType: "true_false", question: "Hero is first thing seen.", correctAnswer: "true", explanation: "top banner" }
  ],
        },
        assignment: {
  title: "Assignment 4.2 - Hero Banner",
  description: "WOW banner.",
  dueDate: "2026-11-29T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k42a1", type: "code", question: "Hero header: gradient + centred h1 + p.", marks: 7 },        { id: "k42a2", type: "code", question: "Bright button linking to #join.", marks: 5 },        { id: "k42a3", type: "theory", question: "Why short words in heroes?", marks: 4 },        { id: "k42a4", type: "theory", question: "Ask a friend: WOW or meh? Report.", marks: 4 }
  ],
        },
        resources: [
      { id: "kr14", title: "MDN - Gradients", type: "link", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient", description: "Gradient guide" },      { id: "kids-4-2-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module4-lesson2.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 40
      },      {
        id: "kids-4-3",
        week: 4,
        title: "Friendly Forms",
        learningObjectives: [
        "Label inputs",  "Use text number radio checkbox",  "Add submit"
    ],
        content: "# Slide 1 - Forms Ask Nicely!\n\nForms collect words: name boxes, choice clicks, send buttons!\n\n- `<form>` = question collector\n- `<label>` = question words\n- `<input>` = answer box\n\n---\n\n# Slide 2 - Labels Hug Inputs\n\n`for` + `id` tie label to box. Click words = jump to box!\n\n```html\n<label for='name'>Your name:</label>\n<input id='name' type='text'>\n```\n\n---\n\n# Slide 3 - Text, Numbers, Clicks!\n\n- `type='text'` = words\n- `type='number'` = numbers\n- `type='radio'` = pick ONE (circles)\n- `type='checkbox'` = pick MANY (squares)\n\n---\n\n# Slide 4 - The Send Button\n\n`<button type='submit'>Send!</button>` tries to send. Style inputs big + friendly!\n\n- Big padding = easy tap\n- Labels above boxes = tidy\n\n---\n\n# Slide 5 - Club Signup Mission\n\n> Signup form: name box, age number, 1 radio (favourite pet), 1 checkbox (snacks), send button. Labels for all!",
        quiz: {
          title: "Quiz - Friendly Forms",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k43q1", questionType: "multiple_choice", question: "Collector tag?", options: [
    { id: "a", text: "<form>", isCorrect: true },    { id: "b", text: "<img>", isCorrect: false },    { id: "c", text: "<p>", isCorrect: false },    { id: "d", text: "<h1>", isCorrect: false }
  ], correctAnswer: "a", explanation: "form collects" },      { id: "k43q2", questionType: "short_answer", question: "Tag for question words?", correctAnswer: "label", explanation: "label asks" },      { id: "k43q3", questionType: "multiple_choice", question: "Answer box tag?", options: [
    { id: "a", text: "<input>", isCorrect: true },    { id: "b", text: "<label>", isCorrect: false },    { id: "c", text: "<form>", isCorrect: false },    { id: "d", text: "<div>", isCorrect: false }
  ], correctAnswer: "a", explanation: "input answers" },      { id: "k43q4", questionType: "multiple_choice", question: "Pick ONE circle?", options: [
    { id: "a", text: "radio", isCorrect: true },    { id: "b", text: "checkbox", isCorrect: false },    { id: "c", text: "text", isCorrect: false },    { id: "d", text: "number", isCorrect: false }
  ], correctAnswer: "a", explanation: "radio = one" },      { id: "k43q5", questionType: "multiple_choice", question: "Pick MANY squares?", options: [
    { id: "a", text: "checkbox", isCorrect: true },    { id: "b", text: "radio", isCorrect: false },    { id: "c", text: "text", isCorrect: false },    { id: "d", text: "submit", isCorrect: false }
  ], correctAnswer: "a", explanation: "checkbox = many" },      { id: "k43q6", questionType: "fill_blank", question: "____ ties label to box.", correctAnswer: "for", explanation: "for + id link" },      { id: "k43q7", questionType: "true_false", question: "Clicking labels jumps to boxes.", correctAnswer: "true", explanation: "linked labels focus" },      { id: "k43q8", questionType: "true_false", question: "Send buttons submit forms.", correctAnswer: "true", explanation: "submit sends" }
  ],
        },
        assignment: {
  title: "Assignment 4.3 - Club Signup Form",
  description: "Friendly form.",
  dueDate: "2026-11-30T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k43a1", type: "code", question: "Name text + age number with labels.", marks: 6 },        { id: "k43a2", type: "code", question: "Radio group + checkbox group.", marks: 6 },        { id: "k43a3", type: "code", question: "Submit button + friendly input styling.", marks: 4 },        { id: "k43a4", type: "theory", question: "Why link label for + input id?", marks: 4 }
  ],
        },
        resources: [
      { id: "kr15", title: "MDN - Forms", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form", description: "First form" },      { id: "kids-4-3-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module4-lesson3.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 45
      },
    ],
  },
  {
    id: "kids-mod-5",
    title: "Module 5 - Party Project",
    position: 4,
    lessons: [
      {
        id: "kids-5-1",
        week: 5,
        title: "Party Planner",
        learningObjectives: [
        "Plan full page",  "Limit palette",  "Write checklist"
    ],
        content: "# Slide 1 - Party Time Plan!\n\nCombine EVERYTHING: hero + cards + gallery + form = party page! Plan first:\n\n1. Hero says WOW\n2. Cards show party zones\n3. Gallery shows snacks\n4. Form invites friends\n\n---\n\n# Slide 2 - Checklist Power\n\n- Header hero with gradient?\n- Nav menu 3 links?\n- 3 flex cards?\n- Gallery 3 figures + media query?\n- Form with labels?\n- Footer with name?\n\nTick each = star!\n\n---\n\n# Slide 3 - One Style Song\n\nPick 2 main colours + 1 pop colour. Same fonts everywhere!\n\n- Headings: one fun font\n- Words: one plain font\n- Buttons: same pill style\n\n> Pixel tip: 3 colours max = pro look!\n\n---\n\n# Slide 4 - Test Party\n\n1. Click every link + button\n2. Wide AND phone sizes\n3. Every img has alt?\n4. Read aloud - typos?\n5. Friend WOW test!\n\n---\n\n# Slide 5 - Launch Your Party!\n\n> Build + launch My Party Page. Present it like a superstar. You are a WEB BUILDER!",
        quiz: {
          title: "Quiz - Party Planner",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k51q1", questionType: "multiple_choice", question: "First plan step?", options: [
    { id: "a", text: "Hero WOW", isCorrect: true },    { id: "b", text: "Footer", isCorrect: false },    { id: "c", text: "Form", isCorrect: false },    { id: "d", text: "Gallery", isCorrect: false }
  ], correctAnswer: "a", explanation: "hero first" },      { id: "k51q2", questionType: "multiple_choice", question: "Max pro colours?", options: [
    { id: "a", text: "3", isCorrect: true },    { id: "b", text: "10", isCorrect: false },    { id: "c", text: "20", isCorrect: false },    { id: "d", text: "1", isCorrect: false }
  ], correctAnswer: "a", explanation: "3 colours max" },      { id: "k51q3", questionType: "short_answer", question: "Test which two sizes?", correctAnswer: "wide and narrow", explanation: "wide + phone" },      { id: "k51q4", questionType: "multiple_choice", question: "Every img needs...?", options: [
    { id: "a", text: "alt", isCorrect: true },    { id: "b", text: "link", isCorrect: false },    { id: "c", text: "button", isCorrect: false },    { id: "d", text: "form", isCorrect: false }
  ], correctAnswer: "a", explanation: "alt always" },      { id: "k51q5", questionType: "true_false", question: "Same button style everywhere.", correctAnswer: "true", explanation: "consistent style" },      { id: "k51q6", questionType: "fill_blank", question: "A ____ lists party checks.", correctAnswer: "checklist", explanation: "checklist power" },      { id: "k51q7", questionType: "multiple_choice", question: "Read aloud to catch...?", options: [
    { id: "a", text: "Typos", isCorrect: true },    { id: "b", text: "Colours", isCorrect: false },    { id: "c", text: "Phones", isCorrect: false },    { id: "d", text: "Servers", isCorrect: false }
  ], correctAnswer: "a", explanation: "ears catch typos" },      { id: "k51q8", questionType: "true_false", question: "Friends WOW-test pages.", correctAnswer: "true", explanation: "user testing!" }
  ],
        },
        assignment: {
  title: "Assignment 5.1 - My Party Page Plan",
  description: "Plan + checklist.",
  dueDate: "2026-12-05T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k51a1", type: "theory", question: "Draw your party page: hero, cards, gallery, form. Label each.", marks: 6 },        { id: "k51a2", type: "theory", question: "Pick 3 colours + 2 fonts. Write why.", marks: 6 },        { id: "k51a3", type: "theory", question: "Write your own 6-tick checklist.", marks: 4 },        { id: "k51a4", type: "theory", question: "Who will you invite? What will they click first?", marks: 4 }
  ],
        },
        resources: [
      { id: "kr16", title: "MDN - Planning", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure", description: "Structure plan" },      { id: "kids-5-1-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module5-lesson1.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 40
      },      {
        id: "kids-5-2",
        week: 5,
        title: "Build Day",
        learningObjectives: [
        "Order bones then paint",  "Debug step by step",  "Track with checklist"
    ],
        content: "# Slide 1 - Build the Party!\n\nTime to build! Order: bones first, paint second.\n\n1. HTML rooms: header, nav, main, footer\n2. Hero + cards + gallery + form inside\n3. THEN style tag paints all\n\nBones before paint!\n\n---\n\n# Slide 2 - Bones Order\n\n```html\n<header class='hero'>...</header>\n<nav class='menu'>...</nav>\n<main>\n<section class='row'>cards</section>\n<section>gallery</section>\n<section>form</section>\n</main>\n<footer>...</footer>\n```\n\n---\n\n# Slide 3 - Paint Order\n\n1. Body bg + fonts\n2. Hero gradient\n3. Cards border + padding\n4. Buttons pill + hover\n5. Media query stack\n\nOne layer at a time!\n\n---\n\n# Slide 4 - Stuck? Debug Dance!\n\n1. Save + refresh?\n2. Tags closed?\n3. Dots on classes?\n4. Read error slowly?\n5. Ask Pixel: what did I expect?\n\n> Bugs are puzzles, not monsters!\n\n---\n\n# Slide 5 - Build Sprint\n\n> Build full party page today! Tick checklist as you go. Screenshot each section!",
        quiz: {
          title: "Quiz - Build Day",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k52q1", questionType: "multiple_choice", question: "Build order?", options: [
    { id: "a", text: "Bones then paint", isCorrect: true },    { id: "b", text: "Paint then bones", isCorrect: false },    { id: "c", text: "Form only", isCorrect: false },    { id: "d", text: "Footer only", isCorrect: false }
  ], correctAnswer: "a", explanation: "HTML then CSS" },      { id: "k52q2", questionType: "multiple_choice", question: "Hero lives in...?", options: [
    { id: "a", text: "header", isCorrect: true },    { id: "b", text: "footer", isCorrect: false },    { id: "c", text: "img", isCorrect: false },    { id: "d", text: "input", isCorrect: false }
  ], correctAnswer: "a", explanation: "header hero" },      { id: "k52q3", questionType: "short_answer", question: "Cards sit inside which layout?", correctAnswer: "flexbox", explanation: "flex row" },      { id: "k52q4", questionType: "multiple_choice", question: "First debug step?", options: [
    { id: "a", text: "Save + refresh", isCorrect: true },    { id: "b", text: "Cry", isCorrect: false },    { id: "c", text: "Delete all", isCorrect: false },    { id: "d", text: "Sleep", isCorrect: false }
  ], correctAnswer: "a", explanation: "save + refresh" },      { id: "k52q5", questionType: "true_false", question: "Dots needed on classes.", correctAnswer: "true", explanation: ".card not card" },      { id: "k52q6", questionType: "fill_blank", question: "Bugs are _____, not monsters.", correctAnswer: "puzzles", explanation: "puzzles to solve" },      { id: "k52q7", questionType: "multiple_choice", question: "Paint body first with...?", options: [
    { id: "a", text: "bg + fonts", isCorrect: true },    { id: "b", text: "Buttons", isCorrect: false },    { id: "c", text: "Hover", isCorrect: false },    { id: "d", text: "Media", isCorrect: false }
  ], correctAnswer: "a", explanation: "base first" },      { id: "k52q8", questionType: "true_false", question: "Checklist ticks track progress.", correctAnswer: "true", explanation: "tick stars!" }
  ],
        },
        assignment: {
  title: "Assignment 5.2 - Build My Party Page",
  description: "Full page build.",
  dueDate: "2026-12-06T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k52a1", type: "code", question: "HTML bones: hero, nav, cards, gallery, form, footer.", marks: 8 },        { id: "k52a2", type: "code", question: "CSS paint: gradient, cards, buttons+hover, media query.", marks: 8 },        { id: "k52a3", type: "theory", question: "One bug you met + how you fixed it.", marks: 4 }
  ],
        },
        resources: [
      { id: "kr17", title: "MDN - Debugging", type: "link", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Debugging_HTML", description: "Debug guide" },      { id: "kids-5-2-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module5-lesson2.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 60
      },      {
        id: "kids-5-3",
        week: 5,
        title: "Showtime and Graduation",
        learningObjectives: [
        "Demo page clearly",  "Share safely",  "Plan next steps"
    ],
        content: "# Slide 1 - Showtime, Star!\n\nPresent your party page like a superstar! Great demos: show, tell, ask.\n\n- SHOW: scroll slowly top to bottom\n- TELL: one sentence per section\n- ASK: which part do you love?\n\n---\n\n# Slide 2 - Demo Script\n\nHi! I built ___ for ___. My hero says ___. My cards show ___. My gallery has ___. My form collects ___. My favourite code is ___ because ___.\n\nPractise 3 times aloud!\n\n---\n\n# Slide 3 - Safe Star Rules\n\n- First names only online\n- No home address or school name\n- Kind comments: I like ___ because ___\n- You own your work - be proud!\n\n---\n\n# Slide 4 - Keep Coding!\n\n- Scratch: drag-code games\n- Replit: type-code pages\n- MDN Kids: read + try\n- Teach a friend - teaching = superpower!\n\n---\n\n# Slide 5 - Graduation!\n\n> Demo your page, collect 2 kind comments, pin your certificate. **YOU ARE A WEB BUILDER!**",
        quiz: {
          title: "Quiz - Showtime",
          description: "8 questions",
          timeLimit: 15,
          passingScore: 70,
          maxAttempts: 3,
          questions: [
      { id: "k53q1", questionType: "multiple_choice", question: "Great demo order?", options: [
    { id: "a", text: "Show tell ask", isCorrect: true },    { id: "b", text: "Hide run cry", isCorrect: false },    { id: "c", text: "Read sleep eat", isCorrect: false },    { id: "d", text: "Delete hide run", isCorrect: false }
  ], correctAnswer: "a", explanation: "show tell ask" },      { id: "k53q2", questionType: "short_answer", question: "Practise demo how many times?", correctAnswer: "3 times", explanation: "3 times aloud" },      { id: "k53q3", questionType: "multiple_choice", question: "Share online...?", options: [
    { id: "a", text: "First names only", isCorrect: true },    { id: "b", text: "Full address", isCorrect: false },    { id: "c", text: "School name", isCorrect: false },    { id: "d", text: "Passwords", isCorrect: false }
  ], correctAnswer: "a", explanation: "first names only" },      { id: "k53q4", questionType: "multiple_choice", question: "Kind comment starts...?", options: [
    { id: "a", text: "I like _ because _", isCorrect: true },    { id: "b", text: "This is bad", isCorrect: false },    { id: "c", text: "Whatever", isCorrect: false },    { id: "d", text: "Meh", isCorrect: false }
  ], correctAnswer: "a", explanation: "kind + specific" },      { id: "k53q5", questionType: "true_false", question: "You own your work.", correctAnswer: "true", explanation: "be proud!" },      { id: "k53q6", questionType: "fill_blank", question: "Teaching a friend is a ____.", correctAnswer: "superpower", explanation: "teaching = power" },      { id: "k53q7", questionType: "multiple_choice", question: "Next step tool for games?", options: [
    { id: "a", text: "Scratch", isCorrect: true },    { id: "b", text: "Toaster", isCorrect: false },    { id: "c", text: "Fridge", isCorrect: false },    { id: "d", text: "Hammer", isCorrect: false }
  ], correctAnswer: "a", explanation: "Scratch games" },      { id: "k53q8", questionType: "true_false", question: "Demos need slow scrolling.", correctAnswer: "true", explanation: "slow shows all" }
  ],
        },
        assignment: {
  title: "Assignment 5.3 - Graduation Showcase",
  description: "Demo + reflect.",
  dueDate: "2026-12-07T23:59:59Z",
  totalMarks: 20,
  passingScore: 10,
  assignmentType: 'theory',
  questions: [
        { id: "k53a1", type: "code", question: "Final party page link or screenshot: all sections working.", marks: 8 },        { id: "k53a2", type: "theory", question: "Demo script: 6 sentences (hero, cards, gallery, form, fave code).", marks: 6 },        { id: "k53a3", type: "theory", question: "Two kind comments you got + one thing you will add next.", marks: 6 }
  ],
        },
        resources: [
      { id: "kr18", title: "Scratch", type: "link", url: "https://scratch.mit.edu", description: "Next coding steps" },      { id: "kids-5-3-slides", title: "Colourful slide show (PowerPoint style)", type: "link", url: "/content/courses/html-css-kids-slides/module5-lesson3.html", description: "Clickable colourful slides" }
  ],
        estimatedDurationMinutes: 45
      },
    ],
  },
]