import type { HcfQuizData } from './types'

// ─── Final Exam — HTML & CSS Fundamentals ───────────────────────────────────
// 53 items: 50 questions (5 per module, Modules 1-10) + 3 practical build problems.
// Practical problems are essay-type (manually graded submissions, not auto-graded MCQ).

const FE_Q_PER_MODULE = 5
const FE_ESSAY_POINTS = 10

export const FINAL_EXAM: HcfQuizData = {
  title: 'Final Exam — HTML & CSS Fundamentals',
  description: 'Comprehensive closed-note exam covering Modules 1-10. 50 multiple-choice/short-answer questions + 3 practical build problems. 120 minutes recommended.',
  timeLimit: 120,
  passingScore: 60,
  maxAttempts: 2,
  questions: [
    // ── Module 1: HTML Basics ──────────────────────────────────────────────
    {
      questionText: 'Write the minimal valid HTML5 document skeleton.',
      questionType: 'fill_blank',
      correctAnswer: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Page Title</title>\n  </head>\n  <body>\n  </body>\n</html>`,
    },
    {
      questionText: 'What is the difference between an element and a tag?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Which tag sets the browser tab title?',
      questionType: 'fill_blank',
      correctAnswer: 'title',
    },
    {
      questionText: 'Is <img> a void element? Why does that matter for closing syntax?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What does the W3C validator check for?',
      questionType: 'essay',
      correctAnswer: null,
    },

    // ── Module 2: Structure & Text ──────────────────────────────────────────
    {
      questionText: 'Name two meta tags that belong in <head> and explain what each does.',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What is the semantic difference between <strong> and <b>?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Is <div> block or inline by default?',
      questionType: 'fill_blank',
      correctAnswer: 'block',
    },
    {
      questionText: 'Write the HTML entity for &.',
      questionType: 'fill_blank',
      correctAnswer: '&amp;',
    },
    {
      questionText: "What's wrong with skipping from <h1> to <h3> with no <h2>?",
      questionType: 'essay',
      correctAnswer: null,
    },

    // ── Module 3: Links, Images & Lists ────────────────────────────────────
    {
      questionText: 'Write a link that jumps to an element with id="pricing" on the same page.',
      questionType: 'fill_blank',
      correctAnswer: '<a href="#pricing">',
    },
    {
      questionText: "What's the difference between a relative and an absolute path?",
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Why must every meaningful <img> have alt text?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Which list type is appropriate for step-by-step instructions?',
      questionType: 'fill_blank',
      correctAnswer: 'ol',
    },
    {
      questionText: 'What does <dl>/<dt>/<dd> represent?',
      questionType: 'essay',
      correctAnswer: null,
    },

    // ── Module 4: Tables & Forms ────────────────────────────────────────────
    {
      questionText: 'Write a <label>/<input> pair correctly connected via for/id.',
      questionType: 'fill_blank',
      correctAnswer: '<label for="email"><input id="email">',
    },
    {
      questionText: 'What does colspan="2" do?',
      questionType: 'fill_blank',
      correctAnswer: 'spans 2 columns',
    },
    {
      questionText: 'Name one HTML5 input type used for restricting entry format, and how.',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Why is client-side required validation not sufficient alone?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What does <fieldset>/<legend> provide?',
      questionType: 'essay',
      correctAnswer: null,
    },

    // ── Module 5: Semantic HTML & Accessibility ────────────────────────────
    {
      questionText: 'Which tag should wrap a page\'s unique main content?',
      questionType: 'fill_blank',
      correctAnswer: 'main',
    },
    {
      questionText: 'What is the "first rule of ARIA"?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Why should you avoid a clickable <div> instead of <button>?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What minimum contrast ratio does WCAG AA require for normal text?',
      questionType: 'fill_blank',
      correctAnswer: '4.5:1',
    },
    {
      questionText: 'Name one reason semantic HTML helps SEO.',
      questionType: 'essay',
      correctAnswer: null,
    },

    // ── Module 6: Selectors & Box Model ────────────────────────────────────
    {
      questionText: 'Rank inline styles, #id, .class, and element selectors by specificity (highest to lowest).',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What are the four layers of the box model, innermost to outermost?',
      questionType: 'fill_blank',
      correctAnswer: 'content padding border margin',
    },
    {
      questionText: 'What does box-sizing: border-box change?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Write a CSS rule targeting a direct child <li> of a <ul> with class .menu.',
      questionType: 'fill_blank',
      correctAnswer: '.menu > li',
    },
    {
      questionText: 'When (if ever) should !important be used?',
      questionType: 'essay',
      correctAnswer: null,
    },

    // ── Module 7: Flexbox ───────────────────────────────────────────────────
    {
      questionText: 'What property turns a container into a flex container?',
      questionType: 'fill_blank',
      correctAnswer: 'display: flex',
    },
    {
      questionText: 'What is the difference between justify-content and align-items?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What does flex: 1 do to a flex item?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Write CSS to perfectly center a single child both horizontally and vertically using Flexbox.',
      questionType: 'fill_blank',
      correctAnswer: 'justify-content: center and align-items: center',
    },
    {
      questionText: 'What does flex-wrap: wrap do?',
      questionType: 'essay',
      correctAnswer: null,
    },

    // ── Module 8: Grid & Responsive Design ─────────────────────────────────
    {
      questionText: 'What does the fr unit represent in CSS Grid?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Write a media query that applies styles only at viewport widths of 768px and above.',
      questionType: 'fill_blank',
      correctAnswer: '@media (min-width: 768px)',
    },
    {
      questionText: 'What is "mobile-first" design?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'When would you choose Grid over Flexbox?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What CSS keeps an image from overflowing its container responsively?',
      questionType: 'fill_blank',
      correctAnswer: 'max-width: 100% and height: auto',
    },

    // ── Module 9: Typography & Color ────────────────────────────────────────
    {
      questionText: 'Why include fallback fonts in a font-family stack?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What is a comfortable line-height range for body text?',
      questionType: 'fill_blank',
      correctAnswer: '1.4-1.6',
    },
    {
      questionText: 'Name two CSS ways to express a color value besides hex.',
      questionType: 'fill_blank',
      correctAnswer: 'rgb and hsl',
    },
    {
      questionText: 'What are CSS custom properties (variables) used for in a style guide?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What tool would you use to check text/background contrast?',
      questionType: 'fill_blank',
      correctAnswer: 'a contrast checker',
    },

    // ── Module 10: Transitions & Animation ─────────────────────────────────
    {
      questionText: 'What\'s the difference between transition and @keyframes animation?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Which two CSS properties are cheapest to animate for performance?',
      questionType: 'fill_blank',
      correctAnswer: 'transform and opacity',
    },
    {
      questionText: 'Write a transition rule that animates background-color over 0.3s.',
      questionType: 'fill_blank',
      correctAnswer: 'transition: background-color 0.3s',
    },
    {
      questionText: 'Why must :focus states remain visible even when you customize them?',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'What does animation-iteration-count: infinite do?',
      questionType: 'essay',
      correctAnswer: null,
    },

    // ── Practical Build Problems (3) ────────────────────────────────────────
    {
      questionText: 'Practical Problem 1 - Build a 3-item responsive navbar using Flexbox that collapses gracefully (stacks or wraps) below 480px width.',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Practical Problem 2 - Build an accessible form with at least 4 correctly labeled inputs, one <fieldset>, and full keyboard navigability — no alt, label, or focus-state issues.',
      questionType: 'essay',
      correctAnswer: null,
    },
    {
      questionText: 'Practical Problem 3 - Build a CSS Grid layout with named grid-template-areas for header/sidebar/content/footer that reflows to a single column on narrow viewports.',
      questionType: 'essay',
      correctAnswer: null,
    },
  ],
}

// Runtime sanity check (dev/build only).
if (typeof window === 'undefined') {
  const mcCount = FINAL_EXAM.questions.filter(q => q.questionType !== 'essay').length
  const essayCount = FINAL_EXAM.questions.filter(q => q.questionType === 'essay').length
  if (mcCount !== 50 || essayCount !== 3) {
    throw new Error(
      `Final exam question bank mismatch: expected 50 MCQ/TF/fb + 3 essay, got ${mcCount} + ${essayCount}`,
    )
  }
  if (FINAL_EXAM.questions.length !== 53) {
    throw new Error(
      `Final exam total mismatch: expected 53 questions, got ${FINAL_EXAM.questions.length}`,
    )
  }
}
