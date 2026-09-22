import type { HcfModuleData } from './types'

export const module07: HcfModuleData = {
  title: 'Module 7 — CSS Layout I: Display, Position, Flexbox',
  lessons: [
    {
      title: 'The display Property',
      duration: 25,
      content: `## Key Ideas

**The display property controls how elements are laid out:**

**Common display values:**

\`\`\`css
span { display: inline-block; width: 100px; }
.hidden { display: none; }
\`\`\`

**Block elements:**
- Start on a new line
- Take full width by default
- Examples: div, p, h1-h6, ul, li

**Inline elements:**
- Flow within text
- Only take up needed width
- Examples: span, a, strong, em

**inline-block:**
- Flows inline like inline
- But accepts width/height like block

**display: none:**
- Removes element entirely from rendered layout
- Also removed from accessibility tree

## Key Takeaways

- display: none removes element from layout completely.
- inline-block allows setting width/height on inline-like elements.
- Block elements stack vertically by default.`,
      quiz: {
        title: 'Quiz 7.1 — The display Property',
        description: 'Three questions on CSS display property values.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does display: none do to an element?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Hides it with transparency', isCorrect: false },
              { id: 'b', text: 'Removes it entirely from the rendered layout (and accessibility tree)', isCorrect: true },
              { id: 'c', text: 'Makes it invisible but preserves space', isCorrect: false },
              { id: 'd', text: 'Collapses its children', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does display: inline-block allow that plain inline does not?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Font styling', isCorrect: false },
              { id: 'b', text: 'Setting width/height on the element', isCorrect: true },
              { id: 'c', text: 'Adding margins', isCorrect: false },
              { id: 'd', text: 'Using colors', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: display: block elements sit next to each other horizontally by default.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Positioning: static, relative, absolute, fixed',
      duration: 35,
      content: `## Key Ideas

**Position values control element placement:**

**static (default):**
- Element follows normal document flow
- top, right, bottom, left have no effect

**relative:**
- Element stays in normal flow
- Can be shifted with top/right/bottom/left
- Original space is preserved
\`\`\`css
.parent { position: relative; }
.badge {
  position: absolute;
  top: 0;
  right: 0;
}
\`\`\`

**absolute:**
- Removed from normal flow
- Positioned relative to nearest positioned ancestor
- If no positioned ancestor, relative to viewport

**fixed:**
- Removed from normal flow
- Positioned relative to viewport
- Stays in place during scroll
\`\`\`css
.sticky-header { position: fixed; top: 0; width: 100%; }
\`\`\`

## Key Takeaways

- absolute positions relative to nearest positioned ancestor.
- fixed positions relative to the viewport.
- relative does NOT remove element from document flow.`,
      quiz: {
        title: 'Quiz 7.2 — Positioning: static, relative, absolute, fixed',
        description: 'Three questions on CSS positioning types.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does position: absolute position an element relative to?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'The browsers viewport always', isCorrect: false },
              { id: 'b', text: 'Its nearest ancestor with a non-static position (or the viewport if none)', isCorrect: true },
              { id: 'c', text: 'The documents root element', isCorrect: false },
              { id: 'd', text: 'The elements original position', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does position: fixed position an element relative to?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Its parent element', isCorrect: false },
              { id: 'b', text: 'The browsers viewport', isCorrect: true },
              { id: 'c', text: 'The documents body', isCorrect: false },
              { id: 'd', text: 'The nearest positioned ancestor', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'True/False: position: relative removes an element from the normal document flow.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Flexbox: Container Properties',
      duration: 35,
      content: `## Key Ideas

**Flexbox creates one-dimensional layouts:**

\`\`\`css
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

**Main axis vs Cross axis:**
- Main axis: defined by flex-direction (row = horizontal, column = vertical)
- Cross axis: perpendicular to main axis

**Container properties:**

**flex-direction:** row | row-reverse | column | column-reverse

**justify-content:** aligns items along main axis
- flex-start, flex-end, center, space-between, space-around, space-evenly

**align-items:** aligns items along cross axis
- stretch, flex-start, flex-end, center, baseline

**flex-wrap:** nowrap | wrap | wrap-reverse

**gap:** spacing between flex items

## Key Takeaways

- display: flex turns a container into a flex container.
- justify-content controls alignment along the main axis.
- align-items controls alignment along the cross axis.`,
      quiz: {
        title: 'Quiz 7.3 — Flexbox: Container Properties',
        description: 'Three questions on Flexbox container properties.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What property turns a container into a flex container?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'flex: true', isCorrect: false },
              { id: 'b', text: 'display: flex', isCorrect: true },
              { id: 'c', text: 'position: flex', isCorrect: false },
              { id: 'd', text: 'layout: flex', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'Which property controls alignment along the main axis?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'align-items', isCorrect: false },
              { id: 'b', text: 'flex-align', isCorrect: false },
              { id: 'c', text: 'justify-content', isCorrect: true },
              { id: 'd', text: 'flex-direction', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'Which property controls alignment along the cross axis?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'justify-content', isCorrect: false },
              { id: 'b', text: 'align-items', isCorrect: true },
              { id: 'c', text: 'align-content', isCorrect: false },
              { id: 'd', text: 'cross-align', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
        ],
      },
    },
    {
      title: 'Flexbox: Item Properties',
      duration: 30,
      content: `## Key Ideas

**Flex item properties control individual items:**

**flex-grow:** how much item grows relative to others (default: 0)

**flex-shrink:** how much item shrinks when space is tight (default: 1)

**flex-basis:** initial size before growing/shrinking

**flex shorthand:** flex: grow shrink basis
\`\`\`css
.sidebar { flex: 0 0 250px; }  /* dont grow, dont shrink, base width 250px */
.main-content { flex: 1; }     /* grow to fill remaining space */
\`\`\`

**align-self:** override align-items for single item

**order:** change visual order independent of source order

## Key Takeaways

- flex: 1 typically allows item to grow and fill available space.
- flex-shrink: 0 prevents item from shrinking below base size.
- order controls visual order, not source order.`,
      quiz: {
        title: 'Quiz 7.4 — Flexbox: Item Properties',
        description: 'Three questions on Flexbox item properties.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does flex: 1 typically do to an item?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Makes it take full width', isCorrect: false },
              { id: 'b', text: 'Allows it to grow and fill available remaining space', isCorrect: true },
              { id: 'c', text: 'Makes it disappear', isCorrect: false },
              { id: 'd', text: 'Fixes its size permanently', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does flex-shrink: 0 prevent?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'The item from growing', isCorrect: false },
              { id: 'b', text: 'The item from shrinking below its base size when space is tight', isCorrect: true },
              { id: 'c', text: 'The item from having any width', isCorrect: false },
              { id: 'd', text: 'The container from wrapping', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does order control on a flex item?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Its position in the HTML source', isCorrect: false },
              { id: 'b', text: 'Its visual order relative to sibling flex items, independent of source order', isCorrect: true },
              { id: 'c', text: 'Its z-index stacking', isCorrect: false },
              { id: 'd', text: 'Its animation sequence', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
        ],
      },
    },
    {
      title: 'Building Common Layouts with Flexbox',
      duration: 35,
      content: `## Key Ideas

**Centering content with Flexbox:**
\`\`\`css
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
\`\`\`

**Card row with wrapping:**
\`\`\`css
.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
\`\`\`

**Navbar pattern:**
\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

**Common patterns:**
1. **Perfect centering:** justify-content: center + align-items: center
2. **Sidebar layout:** flex: 0 0 250px for sidebar, flex: 1 for main
3. **Card grids:** flex-wrap: wrap + gap for responsive cards
4. **Space-between nav:** logo left, links right

## Key Takeaways

- justify-content: center + align-items: center perfectly centers content.
- flex-wrap: wrap allows items to move to new lines.
- gap adds consistent spacing between flex items.`,
      quiz: {
        title: 'Quiz 7.5 — Building Common Layouts with Flexbox',
        description: 'Three questions on common Flexbox layout patterns.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which two properties together perfectly center a single child both horizontally and vertically in a flex container?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'align-content: center and flex-direction: column', isCorrect: false },
              { id: 'b', text: 'justify-content: center and align-items: center', isCorrect: true },
              { id: 'c', text: 'text-align: center and vertical-align: middle', isCorrect: false },
              { id: 'd', text: 'margin: auto and position: relative', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does flex-wrap: wrap allow?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Items to have different widths', isCorrect: false },
              { id: 'b', text: 'Flex items to move to a new line when they do not fit on one row', isCorrect: true },
              { id: 'c', text: 'The container to wrap text', isCorrect: false },
              { id: 'd', text: 'Items to overlap each other', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does the gap property do in a flex container?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Adds margin to the container', isCorrect: false },
              { id: 'b', text: 'Adds consistent spacing between flex items without using margins', isCorrect: true },
              { id: 'c', text: 'Creates a gap in the middle of the container', isCorrect: false },
              { id: 'd', text: 'Removes space between items', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 7 Assignment — "Flexbox Navbar + Card Layout"',
    description: 'Build a page with: a responsive navbar built with Flexbox (logo left, links right), and a row of at least 4 "cards" using Flexbox that wraps to multiple lines on narrow viewports, using gap for spacing.',
    dueDate: '2026-11-30T23:59:59Z',
    totalMarks: 25,
    passingScore: 60,
    assignmentType: 'file',
    questions: [
      { id: 'a7-1', type: 'file', title: 'Flexbox Layout Page', marks: 25 },
    ],
  },
}
