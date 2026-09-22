import type { HcfModuleData } from './types'

export const module01: HcfModuleData = {
  title: 'Module 1 — Intro to the Web & HTML Basics',
  lessons: [
    {
      title: 'How the Web Works',
      duration: 20,
      content: '## Key Ideas\n\n**Client/server model:**\n- **Client (web browser):** requests and displays web pages\n- **Server:** stores and sends back web pages\n\n**What happens when you type a URL and press Enter:**\n1. Browser sends an HTTP request to the server\n2. Server processes the request and finds the resource\n3. Server sends back an HTTP response (HTML, CSS, JS, images)\n4. Browser renders the page\n\n**Browsers as interpreters:**\nBrowsers interpret HTML, CSS, and JavaScript to display web pages.\n\n## Key Takeaways\n\n- The web works on a client-server model.\n- Your browser is the client that requests and displays pages.\n- URLs point to resources, not necessarily physical files.',
      quiz: {
        title: 'Quiz 1.1 — How the Web Works',
        description: 'Three questions on client/server model and URLs.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
                    {
            questionText: 'What is the program that requests and displays web pages called?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A web browser (client)', isCorrect: true },
              { id: 'b', text: 'A web server', isCorrect: false },
              { id: 'c', text: 'A database', isCorrect: false },
              { id: 'd', text: 'An ISP', isCorrect: false }
            ],
            correctAnswer: 'a',
          },                    {
            questionText: 'What is the program that stores and sends back web pages called?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A web browser', isCorrect: false },
              { id: 'b', text: 'A web server', isCorrect: true },
              { id: 'c', text: 'A search engine', isCorrect: false },
              { id: 'd', text: 'A router', isCorrect: false }
            ],
            correctAnswer: 'b',
          },                    {
            questionText: 'A URL always points to a file physically named exactly as shown in the address bar.',
            questionType: 'true_false',
            correctAnswer: 'false',
          }
        ],
      },
    },
    {
      title: 'Your First HTML Document',
      duration: 25,
      content: '## Key Ideas\n\n**Minimal valid HTML5 skeleton:**\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello, Web!</h1>\n  </body>\n</html>\n```\n\n**The components:**\n- `<!DOCTYPE html>` {EM} tells the browser to use HTML5 standard\n- `<html>` {EM} root element wrapping the entire page\n- `<head>` {EM} metadata (not visible on page)\n- `<body>` {EM} visible content\n\n## Key Takeaways\n\n- Every HTML document starts with `<!DOCTYPE html>`.\n- The `<head>` holds metadata; the `<body>` holds visible content.\n- The `<title>` sets the browser tab text.',
      quiz: {
        title: 'Quiz 1.2 — Your First HTML Document',
        description: 'Three questions on HTML5 skeleton and basic tags.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
                    {
            questionText: 'What does `<!DOCTYPE html>` tell the browser?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'To render the page using the HTML5 standard', isCorrect: true },
              { id: 'b', text: 'The page is in Dutch', isCorrect: false },
              { id: 'c', text: 'To use CSS for styling', isCorrect: false },
              { id: 'd', text: 'To validate the HTML', isCorrect: false }
            ],
            correctAnswer: 'a',
          },                    {
            questionText: 'Which tag holds content visible on the page?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<head>', isCorrect: false },
              { id: 'b', text: '<html>', isCorrect: false },
              { id: 'c', text: '<body>', isCorrect: true },
              { id: 'd', text: '<title>', isCorrect: false }
            ],
            correctAnswer: 'c',
          },                    {
            questionText: 'Which tag sets the browsers tab title text?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<head>', isCorrect: false },
              { id: 'b', text: '<title>', isCorrect: true },
              { id: 'c', text: '<meta>', isCorrect: false },
              { id: 'd', text: '<h1>', isCorrect: false }
            ],
            correctAnswer: 'b',
          }
        ],
      },
    },
    {
      title: 'Elements, Tags & Attributes',
      duration: 30,
      content: '## Key Ideas\n\n**Opening and closing tags:**\n- Most elements have an opening tag `<p>` and closing tag `</p>`\n- Content goes between the tags\n\n**Self-closing (void) elements:**\nSome elements do not have content and do not need closing tags:\n- `<img>`, `<br>`, `<hr>`, `<input>`\n\n**Attributes:**\nAttributes provide additional information in `name="value"` format:\n\n```html\n<img src="cat.jpg" alt="A sleeping cat" width="300" />\n<a href="https://example.com" target="_blank">Visit Example</a>\n```\n\n## Key Takeaways\n\n- Elements are marked up with tags in angle brackets.\n- Void elements like `<img>` do not need closing tags.\n- Attributes provide extra info like source URLs and alternative text.',
      quiz: {
        title: 'Quiz 1.3 — Elements, Tags & Attributes',
        description: 'Three questions on tags, void elements, and attributes.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
                    {
            questionText: 'In `<img src="cat.jpg" alt="cat">`, what is `src` called?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'An element', isCorrect: false },
              { id: 'b', text: 'A tag', isCorrect: false },
              { id: 'c', text: 'An attribute', isCorrect: true },
              { id: 'd', text: 'A property', isCorrect: false }
            ],
            correctAnswer: 'c',
          },                    {
            questionText: 'Which of these is a void (self-closing) element?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<p>', isCorrect: false },
              { id: 'b', text: '<div>', isCorrect: false },
              { id: 'c', text: '<img>', isCorrect: true },
              { id: 'd', text: '<span>', isCorrect: false }
            ],
            correctAnswer: 'c',
          },                    {
            questionText: 'Every HTML element requires a closing tag.',
            questionType: 'true_false',
            correctAnswer: 'false',
          }
        ],
      },
    },
    {
      title: 'Headings & Paragraphs',
      duration: 20,
      content: '## Key Ideas\n\n**Heading hierarchy:**\n- `<h1>` {EM} most important (usually one per page)\n- `<h2>` {EM} section headings\n- `<h3>`{chr(8211)}`<h6>` {EM} subsections\n\n**Best practice:** Do not skip heading levels for visual effect.\n\n```html\n<h1>Page Title</h1>\n<h2>Section Title</h2>\n<p>This is a paragraph of text.</p>\n```\n\n**Why heading order matters:**\n- Accessibility: screen readers use headings to navigate\n- SEO: search engines use headings to understand page structure\n\n## Key Takeaways\n\n- Use `<h1>` for the main page title (one per page).\n- Use `<h2>`{chr(8211)}`<h6>` for subsections in order.\n- Use `<p>` for paragraphs of body text.',
      quiz: {
        title: 'Quiz 1.4 — Headings & Paragraphs',
        description: 'Three questions on heading hierarchy and paragraphs.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
                    {
            questionText: 'Which heading tag represents the most important heading on a page?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<h2>', isCorrect: false },
              { id: 'b', text: '<h1>', isCorrect: true },
              { id: 'c', text: '<h3>', isCorrect: false },
              { id: 'd', text: '<h6>', isCorrect: false }
            ],
            correctAnswer: 'b',
          },                    {
            questionText: 'You should skip from `<h1>` directly to `<h4>` if it looks better visually.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },                    {
            questionText: 'What tag wraps a block of body text?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<h1>', isCorrect: false },
              { id: 'b', text: '<div>', isCorrect: false },
              { id: 'c', text: '<p>', isCorrect: true },
              { id: 'd', text: '<span>', isCorrect: false }
            ],
            correctAnswer: 'c',
          }
        ],
      },
    },
    {
      title: 'Comments, Whitespace & Validating Your HTML',
      duration: 20,
      content: '## Key Ideas\n\n**HTML comments:**\n```html\n<!-- This is a comment; it is not shown on the page -->\n```\n\n**Whitespace handling:**\nBrowsers collapse multiple spaces into one:\n```html\n<p>Text   with     extra spaces displays as one space.</p>\n```\n\n**Validating HTML:**\nUse the W3C Markup Validator at validator.w3.org to check for errors.\n\n## Key Takeaways\n\n- Comments use `<!-- -->` syntax and are not displayed.\n- Extra whitespace in HTML source collapses to one space in the browser.\n- The W3C validator helps catch structural errors.',
      quiz: {
        title: 'Quiz 1.5 — Comments, Whitespace & Validation',
        description: 'Three questions on comments, whitespace, and validation.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
                    {
            questionText: 'What is the correct HTML comment syntax?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '// comment', isCorrect: false },
              { id: 'b', text: '<!-- comment -->', isCorrect: true },
              { id: 'c', text: '/* comment */', isCorrect: false },
              { id: 'd', text: '# comment', isCorrect: false }
            ],
            correctAnswer: 'b',
          },                    {
            questionText: 'Multiple spaces in HTML source always render as multiple spaces in the browser.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },                    {
            questionText: 'What tool can check your HTML for structural errors?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'The browser console', isCorrect: false },
              { id: 'b', text: 'The W3C Markup Validator', isCorrect: true },
              { id: 'c', text: 'A text editor', isCorrect: false },
              { id: 'd', text: 'DevTools', isCorrect: false }
            ],
            correctAnswer: 'b',
          }
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 1 Assignment — "First HTML Page"',
    description: 'Build a single index.html page about a topic of your choice with: a <title>, one <h1>, at least two <h2> sections, three <p> paragraphs, and at least one HTML comment explaining a section.',
    dueDate: '2026-10-19T23:59:59Z',
    totalMarks: 20,
    passingScore: 60,
    assignmentType: 'file',
    questions: [
      { id: 'a1-1', type: 'file', title: 'HTML Page Submission', marks: 20 },
    ],
  },
}
