import type { HcfModuleData } from './types'

export const module08: HcfModuleData = {
  title: 'Module 8 — CSS Layout II: Grid & Responsive Design',
  lessons: [
    {
      title: 'CSS Grid: Container Basics',
      duration: 30,
      content: `## Key Ideas

**CSS Grid creates two-dimensional layouts (rows AND columns):**

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
\`\`\`

**Basic Grid properties:**

**grid-template-columns:** defines columns
- repeat(3, 1fr) = three equal columns
- repeat(2, 200px) = two 200px columns
- 1fr 2fr = one column half the size of the other

**grid-template-rows:** defines rows (similar syntax)

**gap:** spacing between rows and columns

**The fr unit:**
- Represents a fraction of available free space
- 1fr = one share of remaining space
- 2fr = two shares (twice as big as 1fr)

## Key Takeaways

- display: grid turns a container into a grid container.
- The fr unit represents a fraction of available free space.
- repeat(3, 1fr) produces three equal-width columns.`,
      quiz: {
        title: 'Quiz 8.1 — CSS Grid: Container Basics',
        description: 'Three questions on CSS Grid container basics.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What property turns a container into a grid container?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'display: grid', isCorrect: true },
              { id: 'b', text: 'layout: grid', isCorrect: false },
              { id: 'c', text: 'grid: on', isCorrect: false },
              { id: 'd', text: 'position: grid', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What does the fr unit represent?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A fixed pixel fraction', isCorrect: false },
              { id: 'b', text: 'A fraction of the available free space in the grid', isCorrect: true },
              { id: 'c', text: 'A percentage of the viewport', isCorrect: false },
              { id: 'd', text: 'The full width of the container', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does repeat(3, 1fr) produce?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Three columns of 1 pixel each', isCorrect: false },
              { id: 'b', text: 'Three equal-width columns', isCorrect: true },
              { id: 'c', text: 'One column with 3px gap', isCorrect: false },
              { id: 'd', text: 'Three rows of equal height', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
        ],
      },
    },
    {
      title: 'Placing Items on the Grid',
      duration: 35,
      content: `## Key Ideas

**Grid item placement properties:**

**grid-column:** which columns an item spans
\`\`\`css
.hero { grid-column: 1 / 3; }  /* Span from line 1 to line 3 (2 columns) */
\`\`\`

**grid-row:** which rows an item spans

**Spanning multiple tracks:**
\`\`\`css
.item {
  grid-column: 2 / 4;  /* Span 2 columns */
  grid-row: 1 / 3;     /* Span 2 rows */
}
\`\`\`

**Named grid areas:**
\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
\`\`\`

## Key Takeaways

- grid-column: 1 / 3 makes item span 2 columns.
- grid-template-areas lets you name regions for readable layouts.
- Items can span multiple rows and columns simultaneously.`,
      quiz: {
        title: 'Quiz 8.2 — Placing Items on the Grid',
        description: 'Three questions on placing items on a CSS Grid.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does grid-column: 1 / 3 do to an item?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Makes it 1 pixel wide and start at column 3', isCorrect: false },
              { id: 'b', text: 'Makes it span from grid line 1 to grid line 3 (2 columns wide)', isCorrect: true },
              { id: 'c', text: 'Makes it the first of 3 items', isCorrect: false },
              { id: 'd', text: 'Deletes columns 1 and 3', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does grid-template-areas let you do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Create empty grid cells', isCorrect: false },
              { id: 'b', text: 'Name regions of the grid and place items by name for readable layouts', isCorrect: true },
              { id: 'c', text: 'Define alternative grid styles', isCorrect: false },
              { id: 'd', text: 'Create responsive breakpoints', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: An item can span both multiple rows and multiple columns at once.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Flexbox vs Grid: When to Use Which',
      duration: 25,
      content: `## Key Ideas

**Flexbox = one-dimensional layout (row OR column):**
- Best for: navbars, card rows, centering, alignment in one direction
- Items flow in a single direction

**Grid = two-dimensional layout (rows AND columns):**
- Best for: page layouts, image galleries, complex arrangements
- Can place items in both rows and columns simultaneously

**They work well together:**
- Use Grid for overall page structure
- Use Flexbox inside grid items for component-level layout

\`\`\`css
/* Grid for page layout */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

/* Flexbox for navbar inside header */
.header {
  display: flex;
  justify-content: space-between;
  grid-area: header;
}
\`\`\`

## Key Takeaways

- Flexbox is one-dimensional (row OR column).
- Grid is best for full page layouts with header/sidebar/content/footer.
- Flexbox and Grid can be used together in the same page.`,
      quiz: {
        title: 'Quiz 8.3 — Flexbox vs Grid: When to Use Which',
        description: 'Three questions on choosing between Flexbox and Grid.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which layout system is best described as one-dimensional?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'CSS Grid', isCorrect: false },
              { id: 'b', text: 'Flexbox', isCorrect: true },
              { id: 'c', text: 'Both are equally one-dimensional', isCorrect: false },
              { id: 'd', text: 'Neither is one-dimensional', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'Which layout system is best for a full page layout with header/sidebar/content/footer regions?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Flexbox', isCorrect: false },
              { id: 'b', text: 'CSS Grid', isCorrect: true },
              { id: 'c', text: 'Floats', isCorrect: false },
              { id: 'd', text: 'Inline-block', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: Flexbox and Grid can be used together in the same page.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Media Queries & Mobile-First Design',
      duration: 35,
      content: `## Key Ideas

**Media queries apply styles based on conditions:**

\`\`\`css
/* Mobile-first base styles (small screens first) */
.gallery { grid-template-columns: 1fr; }

/* Tablet: 2 columns at 600px+ */
@media (min-width: 600px) {
  .gallery { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 3 columns at 900px+ */
@media (min-width: 900px) {
  .gallery { grid-template-columns: repeat(3, 1fr); }
}
\`\`\`

**Mobile-first approach:**
1. Write base styles for small screens (mobile)
2. Add complexity for larger screens via min-width media queries
3. Progressive enhancement: more layout at larger sizes

**Common breakpoints:**
- 480px: small mobile
- 600px: large mobile / small tablet
- 768px: tablet
- 900px: desktop
- 1200px: large desktop

**Media query features beyond width:**
- height, orientation (portrait/landscape), resolution, prefers-color-scheme

## Key Takeaways

- Mobile-first means writing base styles for small screens first.
- @media (min-width: 600px) applies when viewport is at least 600px wide.
- Media queries can target height, orientation, and other features.`,
      quiz: {
        title: 'Quiz 8.4 — Media Queries & Mobile-First Design',
        description: 'Three questions on media queries and mobile-first design.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does mobile-first mean in CSS design?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Designing for mobile devices only', isCorrect: false },
              { id: 'b', text: 'Writing base styles for small screens first, then adding rules for larger screens via media queries', isCorrect: true },
              { id: 'c', text: 'Using mobile units like px', isCorrect: false },
              { id: 'd', text: 'Testing on mobile before desktop', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does @media (min-width: 600px) mean?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Styles apply only on mobile devices', isCorrect: false },
              { id: 'b', text: 'The enclosed styles apply when the viewport is at least 600px wide', isCorrect: true },
              { id: 'c', text: 'Styles apply only when viewport is exactly 600px', isCorrect: false },
              { id: 'd', text: 'Styles apply only in portrait mode', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: Media queries can only target screen width, not height or orientation.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Responsive Images & Units',
      duration: 30,
      content: `## Key Ideas

**Responsive images:**
\`\`\`css
img { max-width: 100%; height: auto; }
\`\`\`
- max-width: 100% prevents image from overflowing container
- height: auto maintains aspect ratio

**Relative units (scale better for responsive design):**
- %: percentage of parent
- rem: relative to root (html) font size
- em: relative to parent font size
- vw/vh: percentage of viewport width/height

**Absolute units:**
- px: fixed pixels (not recommended for all sizing)

**Container pattern:**
\`\`\`css
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}
\`\`\`

**srcset overview:**
- Allows browser to choose appropriate image size
- <img srcset="small.jpg 480w, large.jpg 1024w" sizes="(max-width: 600px) 480px, 1024px">

## Key Takeaways

- max-width: 100%; height: auto; keeps images from overflowing.
- 1rem refers to the root elements font size.
- Using px for all sizing is NOT recommended for responsive design.`,
      quiz: {
        title: 'Quiz 8.5 — Responsive Images & Units',
        description: 'Three questions on responsive images and CSS units.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What CSS rule keeps an image from overflowing its container on small screens?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'width: 100%', isCorrect: false },
              { id: 'b', text: 'max-width: 100%; height: auto;', isCorrect: true },
              { id: 'c', text: 'overflow: hidden', isCorrect: false },
              { id: 'd', text: 'object-fit: contain', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does 1rem refer to?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'The parents font size', isCorrect: false },
              { id: 'b', text: 'The root elements (<html>) font size', isCorrect: true },
              { id: 'c', text: '1 pixel', isCorrect: false },
              { id: 'd', text: '100% of viewport width', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: Using px for all sizing is the recommended approach for responsive design.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 8 Assignment — "Responsive Grid Gallery"',
    description: 'Build an image/card gallery using CSS Grid that shows 1 column on mobile, 2 columns on tablet (>=600px), and 3+ columns on desktop (>=900px), using mobile-first media queries and relative units throughout.',
    dueDate: '2026-12-07T23:59:59Z',
    totalMarks: 25,
    passingScore: 60,
    assignmentType: 'file',
    questions: [
      { id: 'a8-1', type: 'file', title: 'Responsive Grid Gallery', marks: 25 },
    ],
  },
}
