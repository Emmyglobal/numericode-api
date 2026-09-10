/**
 * JSS2 First Term - Educational Resources
 * PDFs, videos, and links for each lesson
 */

export interface CourseResource {
  lessonTitleContains: string
  resources: {
    title: string
    type: 'pdf' | 'video' | 'link'
    url: string
    description: string
  }[]
}

export const jss2FirstTermResources: CourseResource[] = [
  // Module 1 - Week 1: Statistics, Angles & Pie Charts
  {
    lessonTitleContains: 'Week 1',
    resources: [
      {
        title: 'Statistics Cheat Sheet',
        type: 'pdf',
        url: '/resources/jss2/w1-statistics-cheatsheet.pdf',
        description: 'Quick reference: mean, median, mode, range formulas and examples'
      },
      {
        title: 'Types of Angles Visual Guide',
        type: 'video',
        url: '/resources/jss2/w1-angles-visual-guide.mp4',
        description: 'Animated video explaining acute, right, obtuse, straight and reflex angles'
      },
      {
        title: 'Pie Chart Construction Tutorial',
        type: 'link',
        url: 'https://example.com/maths/pie-chart-construction',
        description: 'Step-by-step interactive tutorial on drawing pie charts from frequency data'
      },
      {
        title: 'Practice Worksheet: Statistics',
        type: 'pdf',
        url: '/resources/jss2/w1-statistics-worksheet.pdf',
        description: '10 practice questions on calculating mean, median, mode and range'
      }
    ]
  },
  // Module 2 - Week 2: Indices & Standard Form
  {
    lessonTitleContains: 'Week 2',
    resources: [
      {
        title: 'Laws of Indices Reference Card',
        type: 'pdf',
        url: '/resources/jss2/w2-indices-laws.pdf',
        description: 'Summary of all 7 laws of indices with worked examples'
      },
      {
        title: 'Standard Form Explained',
        type: 'video',
        url: 'https://example.com/maths/standard-form-explained',
        description: 'Video tutorial: converting between standard form and ordinary numbers'
      },
      {
        title: 'Standard Form Practice Generator',
        type: 'link',
        url: 'https://example.com/maths/standard-form-practice',
        description: 'Generate unlimited practice questions on standard form conversions'
      },
      {
        title: 'Indices Quiz Prep',
        type: 'pdf',
        url: '/resources/jss2/w2-indices-quiz-prep.pdf',
        description: '50 practice questions preparing for the Week 2 quiz'
      }
    ]
  },
  // Module 3 - Week 3: Prime Factors, HCF & LCM
  {
    lessonTitleContains: 'Week 3',
    resources: [
      {
        title: 'Prime Factorisation Guide',
        type: 'pdf',
        url: '/resources/jss2/w3-prime-factors.pdf',
        description: 'Factor tree method and division method for finding prime factors'
      },
      {
        title: 'HCF and LCM Word Problems',
        type: 'video',
        url: 'https://example.com/maths/hcf-lcm-word-problems',
        description: 'Real-world applications of HCF and LCM in word problems'
      },
      {
        title: 'Square Roots by Factor Method',
        type: 'pdf',
        url: '/resources/jss2/w3-square-roots.pdf',
        description: 'Step-by-step examples of finding square roots using prime factorisation'
      },
      {
        title: 'Prime Numbers 1-100 Chart',
        type: 'pdf',
        url: '/resources/jss2/w3-prime-numbers-chart.pdf',
        description: 'Reference chart of all prime numbers from 1 to 100'
      }
    ]
  },
  // Module 4 - Week 4: Fractions, Decimals & Proportion
  {
    lessonTitleContains: 'Week 4',
    resources: [
      {
        title: 'Fraction-Decimal-Percentage Conversions',
        type: 'pdf',
        url: '/resources/jss2/w4-conversions.pdf',
        description: 'Conversion tables, methods and 30 practice exercises'
      },
      {
        title: 'Direct and Inverse Proportion Guide',
        type: 'video',
        url: 'https://example.com/maths/direct-inverse-proportion',
        description: 'Clear explanation with worked examples of both types of proportion'
      },
      {
        title: 'Ratio and Proportion Worksheet',
        type: 'pdf',
        url: '/resources/jss2/w4-ratio-worksheet.pdf',
        description: 'Practice problems on ratios, sharing, and proportion'
      },
      {
        title: 'Commercial Arithmetic: Profit & Loss',
        type: 'link',
        url: 'https://example.com/maths/profit-loss-commission',
        description: 'Guide to profit, loss, discount, commission and simple interest calculations'
      }
    ]
  },
  // Module 5 - Week 5: Approximation
  {
    lessonTitleContains: 'Week 5',
    resources: [
      {
        title: 'Rounding and Approximation Guide',
        type: 'pdf',
        url: '/resources/jss2/w5-approximation-guide.pdf',
        description: 'Rules for rounding to decimal places, significant figures and estimation'
      },
      {
        title: 'Estimation Techniques Video',
        type: 'video',
        url: 'https://example.com/maths/estimation-techniques',
        description: 'Mental math strategies for quick estimation in real-world contexts'
      },
      {
        title: 'Approximation Practice Questions',
        type: 'pdf',
        url: '/resources/jss2/w5-approximation-practice.pdf',
        description: '40 practice questions on rounding and estimation'
      }
    ]
  },
  // Module 6 - Week 6: Directed Numbers
  {
    lessonTitleContains: 'Week 6',
    resources: [
      {
        title: 'Directed Numbers Number Line',
        type: 'pdf',
        url: '/resources/jss2/w6-number-line.pdf',
        description: 'Visual number line showing positive and negative numbers with operations'
      },
      {
        title: 'Adding and Subtracting Negatives',
        type: 'video',
        url: 'https://example.com/maths/negative-numbers-operations',
        description: 'Clear video tutorial on operations with directed numbers'
      },
      {
        title: 'Directed Numbers Practice Sheet',
        type: 'pdf',
        url: '/resources/jss2/w6-directed-numbers-worksheet.pdf',
        description: 'Practice exercises on all operations with directed numbers'
      }
    ]
  },
  // Module 7 - Week 7: Half-Term Review
  {
    lessonTitleContains: 'Week 7',
    resources: [
      {
        title: 'First Half Revision Summary',
        type: 'pdf',
        url: '/resources/jss2/w7-revision-summary.pdf',
        description: 'One-page summary of all topics covered in Weeks 1-6'
      },
      {
        title: 'Revision Quiz Practice',
        type: 'link',
        url: 'https://example.com/maths/jss2-revision-practice',
        description: 'Interactive revision quiz covering all first-term topics'
      },
      {
        title: 'Past Questions: Statistics & Number Work',
        type: 'pdf',
        url: '/resources/jss2/w7-past-questions.pdf',
        description: 'WAEC/NECO past questions on statistics and number work topics'
      }
    ]
  },
  // Module 8 - Week 8: Algebraic Expressions I
  {
    lessonTitleContains: 'Week 8',
    resources: [
      {
        title: 'Algebraic Expressions Basics',
        type: 'pdf',
        url: '/resources/jss2/w8-algebra-basics.pdf',
        description: 'Introduction to variables, coefficients, like and unlike terms'
      },
      {
        title: 'Simplifying Expressions Video',
        type: 'video',
        url: 'https://example.com/maths/simplifying-algebraic-expressions',
        description: 'Video tutorial on collecting like terms and simplifying expressions'
      },
      {
        title: 'Algebra Substitution Practice',
        type: 'pdf',
        url: '/resources/jss2/w8-substitution-worksheet.pdf',
        description: 'Practice substituting values into algebraic expressions'
      }
    ]
  },
  // Module 9 - Week 9: Algebraic Fractions & Word Problems
  {
    lessonTitleContains: 'Week 9',
    resources: [
      {
        title: 'Algebraic Fractions Guide',
        type: 'pdf',
        url: '/resources/jss2/w9-algebraic-fractions.pdf',
        description: 'Simplifying, adding, subtracting algebraic fractions with worked examples'
      },
      {
        title: 'Word Problems to Algebra',
        type: 'video',
        url: 'https://example.com/maths/word-problems-algebra',
        description: 'How to translate word problems into algebraic equations and solve them'
      },
      {
        title: 'Algebraic Fractions Practice',
        type: 'pdf',
        url: '/resources/jss2/w9-algebraic-fractions-worksheet.pdf',
        description: '30 practice questions on algebraic fractions and word problems'
      }
    ]
  },
  // Module 10 - Week 10: End of Term Review
  {
    lessonTitleContains: 'Week 10',
    resources: [
      {
        title: 'End of Term Revision Notes',
        type: 'pdf',
        url: '/resources/jss2/w10-revision-notes.pdf',
        description: 'Comprehensive revision notes covering all 10 weeks of the term'
      },
      {
        title: 'Term Final Quiz Prep',
        type: 'link',
        url: 'https://example.com/maths/jss2-term-final-prep',
        description: 'Full practice test simulating the end-of-term examination'
      },
      {
        title: 'Exam Techniques Guide',
        type: 'pdf',
        url: '/resources/jss2/w10-exam-techniques.pdf',
        description: 'Tips for tackling mathematics examinations effectively'
      },
      {
        title: 'Formula Sheet: All Topics',
        type: 'pdf',
        url: '/resources/jss2/w10-formula-sheet.pdf',
        description: 'Complete formula reference for all topics in JSS2 First Term'
      }
    ]
  }
]
