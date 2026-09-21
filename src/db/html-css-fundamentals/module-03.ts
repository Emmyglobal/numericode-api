import type { HcfModuleData } from './types'

export const module03: HcfModuleData = {
  title: 'Module 3 — Links, Images & Lists',
  lessons: [
    {
      title: 'Anchor Tags & Links',
      duration: 25,
      content: "## Key Ideas\n\n**Creating links with <a>:**\n- href attribute holds the destination URL\n- Absolute URLs: https://example.com\n- Relative URLs: /about.html, ../page.html\n- Fragment links: #contact (jumps to element with id=\"contact\")\n\n**Opening in new tab:**\n<a href=\"https://example.com\" target=\"_blank\">External link</a>\n\n**Linking to page sections:**\n<a href=\"#contact\">Jump to Contact section</a>\n...\n<h2 id=\"contact\">Contact</h2>\n\n```html\n<a href=\"https://example.com\">External link</a>\n<a href=\"/about.html\">Relative link</a>\n<a href=\"#contact\">Jump to Contact section</a>\n```\n\n## Key Takeaways\n- href holds the destination URL.\n- target=\"_blank\" opens links in a new tab.\n- Use #fragment to link to elements with matching id on the same page.",
      quiz: {
        title: 'Quiz 3.1 \u2014 Anchor Tags & Links',
        description: 'Three questions on link attributes and URL types.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What attribute holds the destination URL of a link?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'src', isCorrect: false },
              { id: 'b', text: 'href', isCorrect: true },
              { id: 'c', text: 'link', isCorrect: false },
              { id: 'd', text: 'url', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does target=\"_blank\" do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Opens the link in a new tab/window', isCorrect: true },
              { id: 'b', text: 'Makes the link bold', isCorrect: false },
              { id: 'c', text: 'Removes the link underline', isCorrect: false },
              { id: 'd', text: 'Opens the link in the same tab', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'How do you link to an element with id=\"contact\" on the same page?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<a href=\"contact\">', isCorrect: false },
              { id: 'b', text: '<a href=\"#contact\">', isCorrect: true },
              { id: 'c', text: '<a href=\"\/contact\">', isCorrect: false },
              { id: 'd', text: '<a link=\"contact\">', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
        ],
      },
    },
    {
      title: 'Absolute vs Relative Paths',
      duration: 25,
      content: "## Key Ideas\n\n**Absolute URLs:**\n- Include the full protocol and domain\n- Example: https://example.com/images/logo.png\n- Used for external resources\n\n**Root-relative paths:**\n- Start from the site's root with /\n- Example: /images/logo.png\n- Resolved from the domain root\n\n**Relative paths:**\n- Resolved based on the current file's location\n- ./image.png (same directory)\n- ../image.png (parent directory)\n- images/photo.jpg (subdirectory)\n\n## Key Takeaways\n- Absolute URLs include full protocol and domain.\n- Root-relative paths start from the site's root (/path).\n- Relative paths are resolved from the current file's location.",
      quiz: {
        title: 'Quiz 3.2 \u2014 Absolute vs Relative Paths',
        description: 'Three questions on path types and resolution.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which path type always starts from the site\'s root?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Absolute URL', isCorrect: false },
              { id: 'b', text: 'Relative path', isCorrect: false },
              { id: 'c', text: 'Root-relative path (/path)', isCorrect: true },
              { id: 'd', text: 'Network path', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'Which path type includes the full protocol and domain?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Relative path', isCorrect: false },
              { id: 'b', text: 'Root-relative path', isCorrect: false },
              { id: 'c', text: 'Absolute URL', isCorrect: true },
              { id: 'd', text: 'Local path', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'True/False: Relative paths are resolved based on the current file\'s location.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Images',
      duration: 30,
      content: "## Key Ideas\n\n**The <img> element:**\n- src: source URL of the image\n- alt: alternative text (mandatory for accessibility)\n- width/height: dimensions in pixels\n\n**Why alt text matters:**\n- Read by screen readers for visually impaired users\n- Displayed when image fails to load\n- Helps search engines understand image content\n\n**Common image formats:**\n- JPEG: photos, complex images with many colors\n- PNG: images requiring transparency, simple graphics\n- SVG: logos, icons, scalable vector graphics\n- WebP: modern format with better compression\n\n```html\n<img src=\"photo.jpg\" alt=\"Sunset over the mountains\" width=\"600\" height=\"400\" />\n```\n\n## Key Takeaways\n- alt text is mandatory for accessibility and SEO.\n- Choose the right format for your image type.\n- SVG is best for logos and icons with sharp edges.",
      quiz: {
        title: 'Quiz 3.3 \u2014 Images',
        description: 'Three questions on image elements and formats.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Why is the alt attribute important?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'It provides alternative text for screen readers and when the image fails to load', isCorrect: true },
              { id: 'b', text: 'It determines the image file size', isCorrect: false },
              { id: 'c', text: 'It is required for the image to display', isCorrect: false },
              { id: 'd', text: 'It makes the image load faster', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'Which image format is best for logos/icons with sharp edges and scalability?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'JPEG', isCorrect: false },
              { id: 'b', text: 'PNG', isCorrect: false },
              { id: 'c', text: 'SVG', isCorrect: true },
              { id: 'd', text: 'GIF', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'True/False: alt=\"\" (empty) is always wrong.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Unordered & Ordered Lists',
      duration: 25,
      content: "## Key Ideas\n\n**Unordered lists (<ul>):**\n- Bullet points\n- Use for items without specific order\n- Shopping lists, feature lists\n\n**Ordered lists (<ol>):**\n- Numbered items\n- Use for step-by-step instructions\n- Rankings, procedures\n\n**List items (<li>):**\n- Wrap each item in both list types\n- Can be nested for hierarchical content\n\n```html\n<ul>\n  <li>Milk</li>\n  <li>Eggs</li>\n</ul>\n<ol>\n  <li>Preheat oven</li>\n  <li>Mix ingredients</li>\n</ol>\n```\n\n## Key Takeaways\n- Use <ul> for unordered/bulleted lists.\n- Use <ol> for ordered/numbered lists.\n- Use <li> for each list item.\n- Lists can be nested inside <li> elements.",
      quiz: {
        title: 'Quiz 3.4 \u2014 Unordered & Ordered Lists',
        description: 'Three questions on list types and usage.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which tag creates a numbered list?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<ul>', isCorrect: false },
              { id: 'b', text: '<ol>', isCorrect: true },
              { id: 'c', text: '<li>', isCorrect: false },
              { id: 'd', text: '<list>', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'Which tag wraps each list item, regardless of list type?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<item>', isCorrect: false },
              { id: 'b', text: '<li>', isCorrect: true },
              { id: 'c', text: '<value>', isCorrect: false },
              { id: 'd', text: '<point>', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: You can nest a <ul> inside an <li>.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Description Lists & Navigation Menus',
      duration: 25,
      content: "## Key Ideas\n\n**Description lists (<dl>, <dt>, <dd>):**\n- <dl>: description list container\n- <dt>: term being defined\n- <dd>: description/definition of the term\n\n**Navigation menus:**\n- Use <nav> to contain navigation\n- Inside: <ul> of <li><a> links\n- This is the conventional HTML pattern\n\n```html\n<nav>\n  <ul>\n    <li><a href=\"/\">Home</a></li>\n    <li><a href=\"/about.html\">About</a></li>\n  </ul>\n</nav>\n\n<dl>\n  <dt>HTML</dt>\n  <dd>HyperText Markup Language</dd>\n</dl>\n```\n\n## Key Takeaways\n- <dl> contains term/definition pairs.\n- <dt> is the term, <dd> is the description.\n- Navigation uses <nav> with <ul> of <li><a> links.",
      quiz: {
        title: 'Quiz 3.5 \u2014 Description Lists & Navigation',
        description: 'Three questions on description lists and nav patterns.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does <dt> represent inside a <dl>?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A description', isCorrect: false },
              { id: 'b', text: 'A term being defined', isCorrect: true },
              { id: 'c', text: 'A data table', isCorrect: false },
              { id: 'd', text: 'A document type', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What is the conventional HTML pattern for a navigation menu?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A <nav> containing a <ul> of <li><a> links', isCorrect: true },
              { id: 'b', text: 'A <div> with anchor tags', isCorrect: false },
              { id: 'c', text: 'A <table> of links', isCorrect: false },
              { id: 'd', text: 'A <menu> element with <option> tags', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: <dl> stands for \"data list.\"',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 3 Assignment \u2014 Personal Portfolio Landing Page',
    description: 'Build a landing page with: a navigation menu linking to at least 3 in-page sections via #fragment links, at least one image with meaningful alt text, an unordered list of skills, and an ordered list describing your learning path.',
    dueDate: '2026-10-12T23:59:59Z',
    totalMarks: 30,
    passingScore: 60,
    assignmentType: 'file',
    questions: [
      { id: 'm3a1', type: 'file', title: 'Portfolio Landing Page HTML', marks: 15 },
      { id: 'm3a2', type: 'file', title: 'Navigation Menu', marks: 5 },
      { id: 'm3a3', type: 'file', title: 'Lists (Skills + Learning Path)', marks: 5 },
      { id: 'm3a4', type: 'file', title: 'Image with Alt Text', marks: 5 },
    ],
  },
}
