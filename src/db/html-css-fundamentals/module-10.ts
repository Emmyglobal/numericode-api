import type { HcfModuleData } from './types'

export const module10: HcfModuleData = {
  title: 'Module 10 — Transitions, Transforms & Animations',
  lessons: [
    {
      title: 'CSS Transitions',
      duration: 25,
      content: `## Key Ideas

**Transitions:** Smoothly animate between states.

\`\`\`css
.button {
  background: #2e75b6;
  transition: background 0.2s ease-in-out;
}
.button:hover { background: #1e3a5f; }
\`\`\`

**Transition properties:**
- transition-property: which property to animate
- transition-duration: how long it takes
- transition-timing-function: the speed curve

**Common trigger pseudo-classes:**
- :hover - when mouse is over
- :focus - when element has keyboard focus
- :active - while being clicked

**What can be transitioned?**
Many properties are animatable: color, background-color, opacity, transform, width, height, margin, padding, and more.

## Key Takeaways

- Use transition-duration to specify how long a transition takes.
- :hover is commonly used for interactive feedback (also :focus, :active).
- Transitions can animate many properties, not just colors.`,
      quiz: {
        title: 'Quiz 10.1 - CSS Transitions',
        description: 'Three questions on CSS transitions.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What CSS property specifies how long a transition takes?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'transition-duration', isCorrect: true },
              { id: 'b', text: 'transition-speed', isCorrect: false },
              { id: 'c', text: 'animation-time', isCorrect: false },
              { id: 'd', text: 'duration', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'On which pseudo-class is a transition commonly triggered for interactive feedback?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: ':hover (also :focus, :active)', isCorrect: true },
              { id: 'b', text: ':visited', isCorrect: false },
              { id: 'c', text: ':first-child', isCorrect: false },
              { id: 'd', text: ':nth-child', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: Transitions can only animate color properties.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'CSS Transforms',
      duration: 25,
      content: `## Key Ideas

**Transform functions:**

\`\`\`css
/* Scale */
.card:hover { transform: scale(1.05); }

/* Translate */
.card:hover { transform: translate(10px, 0); }

/* Rotate */
.card:hover { transform: rotate(-1deg); }

/* Combined */
.card:hover {
  transform: scale(1.05) rotate(-1deg);
}
\`\`\`

**Key characteristics:**
- Transforms don't affect document flow
- Other elements don't reflow around transformed elements
- Transform is GPU-accelerated (good for performance)

**Available transforms:**
- translate(x, y) - move
- scale(x, y) - resize
- rotate(angle) - rotate
- skew(x-angle, y-angle) - skew/slant

## Key Takeaways

- scale(1.05) enlarges to 105% of original size.
- translate(10px, 0) shifts 10px right without affecting layout.
- Transform doesn't change space in normal document flow.`,
      quiz: {
        title: 'Quiz 10.2 - CSS Transforms',
        description: 'Three questions on CSS transforms.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What does transform: scale(1.05) do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Enlarges the element to 105% of its original size', isCorrect: true },
              { id: 'b', text: 'Moves the element 1.05px', isCorrect: false },
              { id: 'c', text: 'Rotates the element by 1.05 degrees', isCorrect: false },
              { id: 'd', text: 'Changes the element opacity', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What does transform: translate(10px, 0) do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Shifts the element 10px to the right without affecting layout flow', isCorrect: true },
              { id: 'b', text: 'Moves the element 10px down', isCorrect: false },
              { id: 'c', text: 'Scales the element by 10px', isCorrect: false },
              { id: 'd', text: 'Rotates the element 10 degrees', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: Applying a transform changes the space an element occupies in the normal document flow.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Keyframe Animations',
      duration: 30,
      content: `## Key Ideas

**@keyframes defines animation stages:**

\`\`\`css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-text {
  animation: fadeIn 0.6s ease-out forwards;
}
\`\`\`

**Animation properties:**
- animation-name: which @keyframes to use
- animation-duration: how long one cycle takes
- animation-iteration-count: how many times (or infinite)
- animation-timing-function: speed curve
- animation-fill-mode: what happens before/after (forwards keeps final state)

**Browser support:** Keyframe animations are well-supported in all modern browsers.

## Key Takeaways

- @keyframes defines the stages of a CSS animation.
- animation-iteration-count: infinite repeats forever.
- forwards fill-mode keeps the element in its final keyframe state.`,
      quiz: {
        title: 'Quiz 10.3 - Keyframe Animations',
        description: 'Three questions on keyframe animations.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What rule defines the stages of a CSS animation?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '@keyframes', isCorrect: true },
              { id: 'b', text: '@animation', isCorrect: false },
              { id: 'c', text: '@transition', isCorrect: false },
              { id: 'd', text: '@media', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What does animation-iteration-count: infinite do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Repeats the animation forever', isCorrect: true },
              { id: 'b', text: 'Runs the animation once', isCorrect: false },
              { id: 'c', text: 'Makes the animation faster', isCorrect: false },
              { id: 'd', text: 'Pauses the animation', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What does forwards do when used in the animation shorthand fill-mode?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Keeps the element in its final keyframe state after the animation ends', isCorrect: true },
              { id: 'b', text: 'Plays the animation forwards in time', isCorrect: false },
              { id: 'c', text: 'Reverses the animation direction', isCorrect: false },
              { id: 'd', text: 'Makes the animation play only on the first cycle', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
        ],
      },
    },
    {
      title: 'Interactive States: :hover, :focus, :active',
      duration: 25,
      content: `## Key Ideas

**Style all interactive states:**

\`\`\`css
.button:hover,
.button:focus {
  background: #1e3a5f;
  outline: 2px solid #2e75b6;
  outline-offset: 2px;
}
.button:active { transform: scale(0.98); }
\`\`\`

**Why :focus matters:**
- :focus provides visible feedback for keyboard users
- Never remove focus outlines without providing a replacement
- outline: none without replacement harms accessibility

**Touch devices:**
- :hover doesn't provide useful persistent feedback on touch-only devices
- Always ensure :focus styles are present

## Key Takeaways

- :focus styles should never simply be removed with outline: none.
- :active is applied while the element is being clicked/pressed.
- :hover doesn't provide useful feedback on touch-only devices.`,
      quiz: {
        title: 'Quiz 10.4 - Interactive States',
        description: 'Three questions on interactive pseudo-classes.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Why should :focus styles never simply be removed with outline: none and nothing else?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'It removes visible feedback for keyboard users, harming accessibility', isCorrect: true },
              { id: 'b', text: 'It makes the page load slower', isCorrect: false },
              { id: 'c', text: 'It breaks mobile layouts', isCorrect: false },
              { id: 'd', text: 'It is not allowed in CSS', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'When is :active typically applied?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'While the element is being clicked/pressed', isCorrect: true },
              { id: 'b', text: 'When the mouse moves over the element', isCorrect: false },
              { id: 'c', text: 'After the element is clicked', isCorrect: false },
              { id: 'd', text: 'Only on mobile devices', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: :hover provides useful feedback on touch-only devices.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Performance-Conscious Animation',
      duration: 30,
      content: `## Key Ideas

**Cheap to animate (GPU-accelerated):**
- transform - doesn't trigger layout
- opacity - doesn't trigger layout

**Expensive to animate:**
- width/height - triggers layout recalculation
- top/left - triggers layout recalculation
- margin/padding changes - triggers layout

**Best practices:**

\`\`\`css
/* GOOD: GPU-accelerated */
.card:hover {
  transform: translateY(-5px);
  opacity: 0.9;
}

/* AVOID: triggers layout */
.element:hover {
  width: 200px;  /* triggers layout on every frame */
  top: 50px;     /* triggers layout on every frame */
}
\`\`\`

**will-change:**
- Use sparingly, only on elements that actually animate
- Overuse can hurt performance
- Tells the browser to optimize for certain properties

## Key Takeaways

- transform and opacity are the cheapest properties to animate smoothly.
- Animating width/height directly is less performant (triggers layout).
- will-change should be used sparingly, not on every element.`,
      quiz: {
        title: 'Quiz 10.5 - Performance-Conscious Animation',
        description: 'Three questions on animation performance.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which two CSS properties are generally the cheapest to animate smoothly?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'transform and opacity', isCorrect: true },
              { id: 'b', text: 'width and height', isCorrect: false },
              { id: 'c', text: 'margin and padding', isCorrect: false },
              { id: 'd', text: 'top and left', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'Why is animating width/height directly often less performant?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'It can trigger layout recalculation on every frame', isCorrect: true },
              { id: 'b', text: 'It requires JavaScript', isCorrect: false },
              { id: 'c', text: 'It is not supported in modern browsers', isCorrect: false },
              { id: 'd', text: 'It uses too much memory', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: will-change should be applied to every element "just in case".',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 10 Assignment — "Animated Interactive Component"',
    description: 'Build one interactive component (e.g., an accordion, a modal, or an animated card) that uses at least: one transition, one transform, and one @keyframes animation — with clearly visible, accessible :hover/:focus states.',
    dueDate: '2026-12-21T23:59:59Z',
    totalMarks: 25,
    passingScore: 60,
    assignmentType: 'file',
    questions: [
      { id: 'a10-1', type: 'file', title: 'Animated Interactive Component', marks: 25 },
    ],
  },
}
