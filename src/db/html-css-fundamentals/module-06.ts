import type { HcfModuleData } from './types'

export const module06: HcfModuleData = {
  title: 'Module 6 — CSS Fundamentals: Selectors & the Box Model',
  lessons: [
    {
      title: 'Adding CSS: Inline, Internal & External',
      duration: 25,
      content: `## Key Ideas

**Three ways to add CSS:**

**1. External stylesheet (best practice):**
```html
<link rel="stylesheet" href="styles.css" />
```

**2. Internal CSS (in <style> tag):**
```html
<style>
  p { color: navy; }
</style>
```

**3. Inline styles (avoid for maintainability):**
```html
<p style="color: navy;">Text</p>
```

**Why external stylesheets are best:**
- Separation of concerns (HTML = structure, CSS = presentation)
- Reusable across multiple pages
- Browser caching improves performance
- Easier to maintain and update

## Key Takeaways

- Use external stylesheets for real projects.
- The <link> tag connects an external CSS file.
- Inline styles have the highest specificity but hurt maintainability.`,
      quiz: {
        title: 'Quiz 6.1 — Adding CSS: Inline, Internal & External',
        description: 'Three questions on CSS methods and best practices.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which method of adding CSS is generally considered best practice for real projects?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'External stylesheet', isCorrect: true },
              { id: 'b', text: 'Inline styles', isCorrect: false },
              { id: 'c', text: 'Internal CSS', isCorrect: false },
              { id: 'd', text: 'JavaScript injection', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'Which HTML tag links an external CSS file?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<style>', isCorrect: false },
              { id: 'b', text: '<css>', isCorrect: false },
              { id: 'c', text: '<link>', isCorrect: true },
              { id: 'd', text: '<script>', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'True/False: Inline styles have the lowest specificity of the three methods.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Selectors: Element, Class & ID',
      duration: 30,
      content: `## Key Ideas

**Element selectors:**
Target all elements of a given type:
```css
p { color: black; }
h1 { font-size: 2rem; }
```

**Class selectors:**
Target elements with a specific class (reusable):
```css
.highlight { background-color: yellow; }
.card { padding: 16px; }
```

**ID selectors:**
Target a unique element (should only be used once per page):
```css
#main-title { font-size: 2rem; }
#header { position: fixed; }
```

**When to use each:**
- Element selectors: for broad, type-based styling
- Class selectors: for reusable style patterns
- ID selectors: for unique, one-off elements

## Key Takeaways

- Use `.class` selectors for reusable styles.
- Use `#id` selectors only for unique elements.
- An element can have multiple classes but only one ID.`,
      quiz: {
        title: 'Quiz 6.2 — Selectors: Element, Class & ID',
        description: 'Three questions on CSS selectors and their use.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which selector targets all elements sharing class="card"?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '#card', isCorrect: false },
              { id: 'b', text: '.card', isCorrect: true },
              { id: 'c', text: 'card', isCorrect: false },
              { id: 'd', text: '*card', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'Which selector should only ever match one element on a page?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Class selector (.class)', isCorrect: false },
              { id: 'b', text: 'Element selector', isCorrect: false },
              { id: 'c', text: 'ID selector (#id)', isCorrect: true },
              { id: 'd', text: 'Universal selector (*)', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'True/False: An element can have multiple classes but only one id.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Combinators & Grouping',
      duration: 30,
      content: `## Key Ideas

**Combinators define relationships between elements:**

**Descendant combinator (space):**
```css
nav a { color: blue; }  /* All <a> inside <nav> */
```

**Child combinator (>):**
```css
nav > ul { list-style: none; }  /* Direct <ul> children of <nav> */
```

**Adjacent sibling combinator (+):**
```css
h2 + p { margin-top: 0; }  /* <p> immediately after <h2> */
```

**General sibling combinator (~):**
```css
h2 ~ p { color: gray; }  /* All <p> siblings after <h2> */
```

**Grouping selectors (comma):**
```css
h1, h2, h3 { font-family: sans-serif; }
```

## Key Takeaways

- Use `>` for direct children only.
- Use `+` for adjacent siblings.
- Use comma to apply same rules to multiple selectors.`,
      quiz: {
        title: 'Quiz 6.3 — Combinators & Grouping',
        description: 'Three questions on CSS combinators and grouping.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does `nav > ul` select?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'All <ul> elements inside <nav>', isCorrect: false },
              { id: 'b', text: '<ul> elements that are direct children of <nav>', isCorrect: true },
              { id: 'c', text: 'The <nav> inside a <ul>', isCorrect: false },
              { id: 'd', text: 'All elements between <nav> and <ul>', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does `h2 + p` select?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'All <p> after <h2>', isCorrect: false },
              { id: 'b', text: 'A <p> immediately following a <h2> sibling', isCorrect: true },
              { id: 'c', text: 'A <p> inside an <h2>', isCorrect: false },
              { id: 'd', text: 'Both <h2> and <p>', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does a comma between selectors do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Creates a descendant relationship', isCorrect: false },
              { id: 'b', text: 'Applies the same rule to multiple, unrelated selectors', isCorrect: true },
              { id: 'c', text: 'Creates a child relationship', isCorrect: false },
              { id: 'd', text: 'Groups elements by class', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
        ],
      },
    },
    {
      title: 'The Cascade & Specificity',
      duration: 35,
      content: `## Key Ideas

**How conflicting rules are resolved:**

**Specificity hierarchy (lowest to highest):**
1. Element selectors (p, div, h1) — specificity: 0,0,0,1
2. Class selectors (.class), attribute selectors, pseudo-classes — 0,0,1,0
3. ID selectors (#id) — 0,1,0,0
4. Inline styles — 1,0,0,0

**Source order:**
When two selectors have equal specificity, the one that comes later wins.

**!important:**
A last resort that overrides normal specificity. Should be used sparingly.

```css
/* Element selector */
p { color: black; }           /* specificity: 0,0,0,1 */

/* Class selector wins over element */
.highlight { color: red; }    /* specificity: 0,0,1,0 */

/* ID selector wins over class */
#main { color: blue; }        /* specificity: 0,1,0,0 */

/* Inline style wins over everything */
<p style="color: green;">    /* specificity: 1,0,0,0 */
```

## Key Takeaways

- Class selectors beat element selectors.
- ID selectors beat class selectors.
- !important should be a rare last resort.`,
      quiz: {
        title: 'Quiz 6.4 — The Cascade & Specificity',
        description: 'Three questions on CSS cascade and specificity rules.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Between a class selector and an element selector targeting the same property, which wins?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'The element selector (simpler)', isCorrect: false },
              { id: 'b', text: 'The class selector (higher specificity)', isCorrect: true },
              { id: 'c', text: 'Whichever comes first in the file', isCorrect: false },
              { id: 'd', text: 'They always conflict and neither applies', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'When two selectors have equal specificity, which rule wins?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'The one with !important', isCorrect: false },
              { id: 'b', text: 'The one with the shorter selector', isCorrect: false },
              { id: 'c', text: 'The one that comes later in the source order', isCorrect: true },
              { id: 'd', text: 'Both rules apply equally', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'True/False: !important should be used freely to guarantee styles apply.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'The Box Model',
      duration: 35,
      content: `## Key Ideas

**The four layers of the CSS box model (innermost to outermost):**

1. **Content** — the actual content (text, images)
2. **Padding** — space inside the border, around content
3. **Border** — surrounds padding and content
4. **Margin** — space outside the border, between elements

```css
.box {
  width: 200px;           /* Content width */
  padding: 20px;          /* Space inside border */
  border: 2px solid black;
  margin: 10px;           /* Space outside border */
  box-sizing: border-box; /* Include padding+border in width */
}
```

**box-sizing: border-box vs content-box:**
- **content-box (default):** width = content only; padding and border add to total
- **border-box:** width includes content + padding + border

**Margin collapsing:**
Adjacent vertical margins can collapse into the larger of the two.

## Key Takeaways

- The box model layers: content → padding → border → margin.
- Use box-sizing: border-box for predictable sizing.
- Margin is outside the border; padding is inside.`,
      quiz: {
        title: 'Quiz 6.5 — The Box Model',
        description: 'Three questions on the CSS box model layers and box-sizing.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'List the four layers of the CSS box model from innermost to outermost.',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Margin, border, padding, content', isCorrect: false },
              { id: 'b', text: 'Content, padding, border, margin', isCorrect: true },
              { id: 'c', text: 'Content, border, padding, margin', isCorrect: false },
              { id: 'd', text: 'Padding, content, border, margin', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does box-sizing: border-box change about width calculation?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Width includes only content', isCorrect: false },
              { id: 'b', text: 'Width/height include padding and border, not just content', isCorrect: true },
              { id: 'c', text: 'Width is calculated in ems instead of pixels', isCorrect: false },
              { id: 'd', text: 'Width is not affected; it only changes height', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: Margin creates space inside an elements border.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 6 Assignment — "Styled Article Page"',
    description: 'Take your Module 2 article page and add an external stylesheet that: styles at least 3 element selectors, 2 class selectors, uses box-sizing: border-box globally, and applies consistent padding/margin using the box model.',
    dueDate: '2026-11-23T23:59:59Z',
    totalMarks: 25,
    passingScore: 60,
    assignmentType: file,
    questions: [
      { id: 'a6-1', type: file, title: 'Styled HTML Page with CSS', marks: 25 },
    ],
  },
}
