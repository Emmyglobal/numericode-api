import type { HcfModuleData } from './types'

export const module09: HcfModuleData = {
  title: 'Module 9 — Typography, Color & Accessibility',
  lessons: [
    {
      title: 'Type Scale, Line Height & Readability',
      duration: 30,
      content: `## Key Ideas

**Consistent type scale:**
Use a consistent ratio (e.g., 1.25) for heading sizes:

\`\`\`css
body { font-size: 16px; line-height: 1.5; }
h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
\`\`\`

**Line height for readability:**
- Body text: roughly 1.4-1.6
- Headings: tighter, around 1.1-1.3

**Max line length:**
Limit paragraphs to a comfortable reading width:

\`\`\`css
p { max-width: 65ch; }
\`\`\`

The ch unit represents the width of the "0" character.

## Key Takeaways

- A consistent type scale creates visual harmony.
- Use line-height of 1.4-1.6 for readable body text.
- The ch unit helps limit line length for readability.`,
      quiz: {
        title: 'Quiz 9.2 - Type Scale, Line Height & Readability',
        description: 'Three questions on type scale and readability.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What is a commonly recommended line-height range for readable body text?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Roughly 1.4-1.6', isCorrect: true },
              { id: 'b', text: 'Exactly 1.0', isCorrect: false },
              { id: 'c', text: '2.5-3.0', isCorrect: false },
              { id: 'd', text: '0.8-1.0', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What unit is useful for limiting paragraph width to a comfortable reading length?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'ch (character width unit)', isCorrect: true },
              { id: 'b', text: 'px (pixel)', isCorrect: false },
              { id: 'c', text: 'vh (viewport height)', isCorrect: false },
              { id: 'd', text: 'deg (degree)', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: Using a wildly different font size for every heading level creates good visual hierarchy.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Color Theory Basics & CSS Color Values',
      duration: 30,
      content: `## Key Ideas

**Three ways to specify colors in CSS:**

\`\`\`css
/* Hex */
color: #2e75b6;

/* RGB */
color: rgb(46, 117, 182);

/* HSL */
color: hsl(207, 62%, 45%);
\`\`\`

**CSS Custom Properties (variables):**
Define reusable values in :root:

\`\`\`css
:root {
  --color-primary: #2e75b6;
  --color-text: #1a1a1a;
  --color-bg: #ffffff;
}
body { color: var(--color-text); background: var(--color-bg); }
a { color: var(--color-primary); }
\`\`\`

**Color theory basics:**
- Primary colors: Red, blue, yellow (in traditional theory)
- Complementary colors: Opposite on the color wheel
- Use a limited, consistent palette for visual coherence

**HSL advantages:**
- Hue (0-360): the color itself
- Saturation (0-100%): intensity
- Lightness (0-100%): brightness

## Key Takeaways

- You can specify colors using hex, rgb(), or hsl().
- CSS custom properties make your palette reusable.
- HSL lets you adjust lightness independently.`,
      quiz: {
        title: 'Quiz 9.3 - Color Theory Basics & CSS Color Values',
        description: 'Three questions on color values and CSS variables.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Name three ways to specify a color in CSS.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Hex (#rrggbb), rgb(), and hsl()', isCorrect: true },
              { id: 'b', text: 'px, em, rem', isCorrect: false },
              { id: 'c', text: 'Red, green, blue', isCorrect: false },
              { id: 'd', text: 'CSS, SVG, Canvas', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What CSS feature is being used with --color-primary and var(--color-primary)?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'CSS Custom Properties (CSS variables)', isCorrect: true },
              { id: 'b', text: 'CSS animations', isCorrect: false },
              { id: 'c', text: 'CSS grid', isCorrect: false },
              { id: 'd', text: 'CSS transitions', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: hsl() lets you adjust lightness independently of hue and saturation.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Color Contrast & Accessible Palettes',
      duration: 25,
      content: `## Key Ideas

**WCAG contrast requirements:**
- Normal text: Minimum 4.5:1 contrast ratio (WCAG AA)
- Large text (18px+ or 14px+ bold): Minimum 3:1

**Checking contrast:**
Use online contrast checkers before shipping a design.

**Designing for accessibility:**
- Don't rely solely on color to convey information
- Ensure text is readable against its background
- Consider both light and dark mode contexts

## Key Takeaways

- WCAG AA requires 4.5:1 for normal text.
- Always verify contrast with a checker.
- Accessible design benefits everyone.`,
      quiz: {
        title: 'Quiz 9.4 - Color Contrast & Accessible Palettes',
        description: 'Three questions on contrast ratios and accessible design.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What minimum contrast ratio does WCAG AA require for normal text?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '4.5:1', isCorrect: true },
              { id: 'b', text: '2:1', isCorrect: false },
              { id: 'c', text: '7:1', isCorrect: false },
              { id: 'd', text: '1.5:1', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What tool category helps verify color contrast before shipping a design?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A contrast checker (many free online tools exist)', isCorrect: true },
              { id: 'b', text: 'A CSS validator', isCorrect: false },
              { id: 'c', text: 'A browser debugger', isCorrect: false },
              { id: 'd', text: 'A code linter', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: A design that looks fine to the designer is automatically accessible to all users.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Building a Simple Style Guide',
      duration: 30,
      content: `## Key Ideas

**Document your design tokens as CSS variables:**

\`\`\`css
:root {
  /* Colors */
  --color-primary: #2e75b6;
  --color-secondary: #6b7b8c;
  --color-text: #1a1a1a;
  --color-bg: #ffffff;

  /* Typography */
  --font-body: "Inter", "Helvetica Neue", Arial, sans-serif;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;

  /* Spacing */
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;

  /* Borders */
  --radius: 8px;
}
\`\`\`

**What a style guide provides:**
- Consistent color palette across the site
- Coordinated type scale
- Uniform spacing
- Easy maintenance and updates

## Key Takeaways

- Define spacing as CSS variables for consistency.
- A style guide documents reusable design tokens.
- A style guide covers colors, typography, AND spacing.`,
      quiz: {
        title: 'Quiz 9.5 - Building a Simple Style Guide',
        description: 'Three questions on style guides and design tokens.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Why define spacing values as CSS variables like --space-md?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'To keep spacing consistent and easy to update site-wide', isCorrect: true },
              { id: 'b', text: 'To make the CSS file smaller', isCorrect: false },
              { id: 'c', text: 'To enable animations', isCorrect: false },
              { id: 'd', text: 'It is required by the CSS specification', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What is a "style guide" in a front-end project?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A documented set of reusable design tokens for consistency', isCorrect: true },
              { id: 'b', text: 'A list of all HTML tags', isCorrect: false },
              { id: 'c', text: 'A testing checklist', isCorrect: false },
              { id: 'd', text: 'A deployment guide', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: A style guide only needs to cover colors, not spacing or typography.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 9 Assignment — "Style Guide + Redesign"',
    description: 'Create a one-page style guide (style-guide.html) documenting your chosen color palette (with contrast-checked text/background pairs), type scale, and spacing scale as CSS variables — then apply that style guide to redesign one earlier assignment page.',
    dueDate: '2026-12-14T23:59:59Z',
    totalMarks: 25,
    passingScore: 60,
    assignmentType: 'file',
    questions: [
      { id: 'a9-1', type: 'file', title: 'Style Guide + Redesigned Page', marks: 25 },
    ],
  },
}
