import type { HcfModuleData } from './types'

export const module05: HcfModuleData = {
  title: 'Module 5 — Semantic HTML & Accessibility',
  lessons: [
    {
      title: 'Why Semantic HTML Matters',
      duration: 20,
      content: "## Key Ideas\n\n**What is semantic HTML?**\n- Tags that describe meaning, not just appearance\n- Examples: <article>, <nav>, <main> vs generic <div>\n\n**Benefits of semantic HTML:**\n1. **Accessibility:** Screen readers understand the content structure\n2. **SEO:** Search engines can better understand page content\n3. **Code readability:** Other developers can understand your code\n\n**Element examples:**\n- <article>: self-contained content like a blog post\n- <section>: thematic grouping of content\n- <aside>: tangential/sidebar content\n- <div>: generic container with no semantic meaning\n\n## Key Takeaways\n- Semantic HTML describes meaning, not just appearance.\n- Benefits include better accessibility, SEO, and code readability.\n- Choose semantic tags when they convey meaning.",
      quiz: {
        title: 'Quiz 5.1 \u2014 Why Semantic HTML Matters',
        description: 'Three questions on the benefits and use of semantic HTML.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What is the main benefit of using <article> instead of a generic <div>?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'It communicates the content\'s meaning/role to browsers, assistive tech, and search engines', isCorrect: true },
              { id: 'b', text: 'It makes the content load faster', isCorrect: false },
              { id: 'c', text: 'It allows the content to be styled differently', isCorrect: false },
              { id: 'd', text: 'It is required for HTML validation', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: Semantic HTML has no effect on accessibility.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
          {
            questionText: 'Name one benefit of semantic HTML for SEO.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Search engines can better understand page structure/content importance', isCorrect: true },
              { id: 'b', text: 'It makes the page rank higher automatically', isCorrect: false },
              { id: 'c', text: 'It increases page load speed', isCorrect: false },
              { id: 'd', text: 'It prevents competitors from copying content', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
        ],
      },
    },
    {
      title: 'Page Structure Tags',
      duration: 25,
      content: "## Key Ideas\n\n**Semantic page structure elements:**\n- <header>: introductory content or navigation\n- <nav>: navigation links\n- <main>: primary, unique content of the page\n- <section>: thematic grouping of content\n- <article>: self-contained, independent content\n- <aside>: tangentially related content (sidebar)\n- <footer>: footer information\n\n```html\n<body>\n  <header><h1>My Site</h1><nav>...</nav></header>\n  <main>\n    <article>\n      <h2>Blog Post Title</h2>\n      <p>Content...</p>\n    </article>\n    <aside>Related links</aside>\n  </main>\n  <footer>&copy; 2026 My Site</footer>\n</body>\n```\n\n## Key Takeaways\n- Use <main> for the primary, unique content.\n- <article> is for self-contained content like blog posts.\n- <aside> holds tangential/sidebar content.\n- Replace generic <div> soup with semantic tags.",
      quiz: {
        title: 'Quiz 5.2 \u2014 Page Structure Tags',
        description: 'Three questions on semantic page structure elements.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which tag should wrap the primary, unique content of a page?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<body>', isCorrect: false },
              { id: 'b', text: '<main>', isCorrect: true },
              { id: 'c', text: '<content>', isCorrect: false },
              { id: 'd', text: '<section>', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'Which tag is appropriate for a self-contained piece of content like a blog post?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<section>', isCorrect: false },
              { id: 'b', text: '<div>', isCorrect: false },
              { id: 'c', text: '<article>', isCorrect: true },
              { id: 'd', text: '<post>', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'Which tag holds tangential content like a sidebar?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<sidebar>', isCorrect: false },
              { id: 'b', text: '<aside>', isCorrect: true },
              { id: 'c', text: '<wing>', isCorrect: false },
              { id: 'd', text: '<footer>', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
        ],
      },
    },
    {
      title: 'ARIA Basics: When Semantic HTML Is Not Enough',
      duration: 25,
      content: "## Key Ideas\n\n**The first rule of ARIA:**\n\"No ARIA is better than bad ARIA\"\n\n**When to use ARIA:**\n- Only when semantic HTML cannot express the needed meaning\n- Fill gaps that native HTML doesn\'t cover\n\n**Common ARIA attributes:**\n- aria-label: provides an accessible name\n- aria-hidden: hides element from assistive technology\n- role: defines the role of an element\n\n```html\n<button aria-label=\"Close menu\">\u2715</button>\n<div role=\"alert\">Your changes have been saved.</div>\n```\n\n## Key Takeaways\n- Prefer native semantic HTML over ARIA.\n- Use ARIA only when there\'s no native equivalent.\n- aria-label provides an accessible name for screen readers.\n- role=\"alert\" announces content immediately to assistive technology.",
      quiz: {
        title: 'Quiz 5.3 \u2014 ARIA Basics',
        description: 'Three questions on ARIA usage and best practices.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What is the first rule of ARIA use?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Always use ARIA for every interactive element', isCorrect: false },
              { id: 'b', text: 'Prefer native semantic HTML; only use ARIA when there\'s no native equivalent', isCorrect: true },
              { id: 'c', text: 'ARIA should only be used for forms', isCorrect: false },
              { id: 'd', text: 'ARIA is only for mobile devices', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does aria-label provide?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A visual label shown on hover', isCorrect: false },
              { id: 'b', text: 'An accessible name for an element, read by screen readers', isCorrect: true },
              { id: 'c', text: 'A CSS class name', isCorrect: false },
              { id: 'd', text: 'A JavaScript event handler', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: role=\"alert\" tells assistive technology to announce the content immediately.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Keyboard Navigation & Focus',
      duration: 25,
      content: "## Key Ideas\n\n**Keyboard accessibility requirements:**\n- All interactive elements must be reachable via Tab key\n- Visible focus states are essential\n- Native elements (<button>, <a>) are keyboard-accessible by default\n\n**Why avoid clickable <div>s:**\n- <div> is not keyboard-focusable by default\n- <div> is not announced as interactive by screen readers\n- Use <button> or <a> instead\n\n**tabindex attribute:**\n- tabindex=\"0\": makes element focusable in natural tab order\n- tabindex=\"-1\": makes element focusable programmatically only\n- Avoid positive tabindex values\n\n**Focus states:**\n- Never remove focus outlines without providing a replacement\n- :focus-visible is preferred for styling\n\n## Key Takeaways\n- Use native <button>/<a> instead of clickable <div>s.\n- All interactive elements must be keyboard accessible.\n- Visible focus states are essential for keyboard users.\n- tabindex=\"0\" makes non-interactive elements focusable.",
      quiz: {
        title: 'Quiz 5.4 \u2014 Keyboard Navigation & Focus',
        description: 'Three questions on keyboard accessibility and focus management.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Why should you avoid making a <div> clickable instead of using <button>?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A <div> isn\'t keyboard-focusable or announced as interactive by default', isCorrect: true },
              { id: 'b', text: '<button> uses more memory', isCorrect: false },
              { id: 'c', text: '<div> cannot be styled', isCorrect: false },
              { id: 'd', text: '<button> is deprecated', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What does tabindex=\"0\" do to a non-interactive element?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Makes it focusable in the natural tab order', isCorrect: true },
              { id: 'b', text: 'Removes it from the tab order', isCorrect: false },
              { id: 'c', text: 'Makes it read by screen readers only', isCorrect: false },
              { id: 'd', text: 'Sets the tab width to 0', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: Removing focus outlines with CSS is always fine as long as the page looks cleaner.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Accessible Images, Forms & Color Contrast',
      duration: 25,
      content: "## Key Ideas\n\n**Accessible images:**\n- Use descriptive alt text that conveys purpose/content\n- Avoid generic alt text like \"image\" or \"picture\"\n- Use alt=\"\" for purely decorative images\n\n**Accessible forms:**\n- Every input needs a properly-associated label\n- Error messages should be clearly associated with inputs\n- Use aria-describedby for additional context\n\n**Color contrast (WCAG AA):**\n- Normal text: at least 4.5:1 contrast ratio\n- Large text (18px+ or 14px+ bold): at least 3:1\n- Use contrast checkers to verify your designs\n\n**Benefits for everyone:**\n- Accessible forms and contrast benefit ALL users\n- Good contrast improves readability in bright conditions\n- Clear labels help everyone complete forms faster\n\n## Key Takeaways\n- Good alt text describes the image\'s purpose in context.\n- WCAG AA requires 4.5:1 contrast for normal text.\n- Accessible design benefits all users, not just those with disabilities.",
      quiz: {
        title: 'Quiz 5.5 \u2014 Accessible Images, Forms & Color Contrast',
        description: 'Three questions on accessibility best practices.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What WCAG AA contrast ratio is generally recommended for normal-sized text?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2:1', isCorrect: false },
              { id: 'b', text: '3:1', isCorrect: false },
              { id: 'c', text: '4.5:1', isCorrect: true },
              { id: 'd', text: '7:1', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'What makes alt text \"good\"?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'It\'s concise and describes the image\'s purpose/content in context, not just \"image\"', isCorrect: true },
              { id: 'b', text: 'It is at least 50 characters long', isCorrect: false },
              { id: 'c', text: 'It includes the file name', isCorrect: false },
              { id: 'd', text: 'It describes the image dimensions', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: Accessible forms and sufficient color contrast benefit all users, not just those using assistive technology.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 5 Assignment \u2014 Accessible Page Audit & Fix',
    description: 'Take your Module 3 or 4 assignment page and: (1) replace generic <div> sections with correct semantic tags, (2) audit and fix all alt text, (3) verify/fix all label-input pairings, and (4) check color contrast of your text against its background, adjusting if it fails 4.5:1.',
    dueDate: '2026-10-26T23:59:59Z',
    totalMarks: 40,
    passingScore: 60,
    assignmentType: 'file',
    questions: [
      { id: 'm5a1', type: 'file', title: 'Semantic HTML Refactoring', marks: 15 },
      { id: 'm5a2', type: 'file', title: 'Alt Text Audit & Fix', marks: 10 },
      { id: 'm5a3', type: 'file', title: 'Label-Input Pairing Verification', marks: 5 },
      { id: 'm5a4', type: 'file', title: 'Color Contrast Check & Fix', marks: 10 },
    ],
  },
}
