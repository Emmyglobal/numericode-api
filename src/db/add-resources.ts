/**
 * Script to add resources to all courses after initial seeding.
 * Run with: npx ts-node src/db/add-resources.ts
 */

import { query } from './pool'

interface ResourceData {
  lesson_title_contains: string
  title: string
  type: 'pdf' | 'video' | 'link'
  url: string
  description: string
}

/**
 * Resources for JSS2 First Term - Week 1: Statistics, Angles & Pie Charts
 */
const jss2FirstTermResources: ResourceData[] = [
  // Week 1 - Statistics, Angles & Pie Charts
  { lesson_title_contains: 'Week 1', title: 'Statistics Formula Sheet', type: 'pdf', url: 'https://example.com/resources/jss2/w1-statistics-formulas.pdf', description: 'Quick reference for mean, median, mode, range calculations.' },
  { lesson_title_contains: 'Week 1', title: 'Angle Types Explained', type: 'video', url: 'https://example.com/resources/jss2/w1-angles-video.mp4', description: 'Visual guide to acute, right, obtuse, straight and reflex angles.' },
  { lesson_title_contains: 'Week 1', title: 'Pie Chart Practice', type: 'link', url: 'https://example.com/resources/jss2/w1-pie-chart-practice', description: 'Interactive exercises on converting frequency data to angles.' },
  
  // Week 2 - Indices & Standard Form
  { lesson_title_contains: 'Week 2', title: 'Indices Laws Reference', type: 'pdf', url: 'https://example.com/resources/jss2/w2-indices-laws.pdf', description: 'Summary of multiplication, division, zero and negative power rules.' },
  { lesson_title_contains: 'Week 2', title: 'Standard Form Examples', type: 'video', url: 'https://example.com/resources/jss2/w2-standard-form.mp4', description: 'Worked examples converting between standard and ordinary form.' },
  { lesson_title_contains: 'Week 2', title: 'Indices Practice Quiz', type: 'link', url: 'https://example.com/resources/jss2/w2-indices-practice', description: 'Online practice questions on indices laws.' },
  
  // Week 3 - Prime Factors, HCF & LCM
  { lesson_title_contains: 'Week 3', title: 'Prime Factorisation Guide', type: 'pdf', url: 'https://example.com/resources/jss2/w3-prime-factors.pdf', description: 'Step-by-step guide to finding prime factors using factor trees.' },
  { lesson_title_contains: 'Week 3', title: 'HCF and LCM Methods', type: 'video', url: 'https://example.com/resources/jss2/w3-hcf-lcm.mp4', description: 'Video explaining prime factorisation and division methods for HCF/LCM.' },
  { lesson_title_contains: 'Week 3', title: 'Squares and Roots Chart', type: 'pdf', url: 'https://example.com/resources/jss2/w3-squares-roots.pdf', description: 'Reference chart of perfect squares and their square roots.' },
  
  // Week 4 - Fractions, Decimals & Proportion
  { lesson_title_contains: 'Week 4', title: 'Fraction-Decimal-Percentage Conversions', type: 'pdf', url: 'https://example.com/resources/jss2/w4-conversions.pdf', description: 'Conversion tables and practice exercises.' },
  { lesson_title_contains: 'Week 4', title: 'Proportion Word Problems', type: 'video', url: 'https://example.com/resources/jss2/w4-proportion.mp4', description: 'Solving direct and inverse proportion word problems.' },
  { lesson_title_contains: 'Week 4', title: 'Profit and Loss Tutorial', type: 'link', url: 'https://example.com/resources/jss2/w4-profit-loss', description: 'Commercial arithmetic: calculating profit, loss and percentages.' },
]

async function addResourcesForCourse(courseTitleContains: string, resources: ResourceData[]): Promise<void> {
  console.log(`\nAdding resources for course containing: "${courseTitleContains}"...`)
  
  for (const resource of resources) {
    try {
      // Find the lesson ID
      const { rows: lessonRows } = await query<{ id: string }>(
        `SELECT l.id FROM lessons l
         JOIN modules m ON m.id = l.module_id
         JOIN courses c ON c.id = m.course_id
         WHERE c.title LIKE $1 AND l.title ILIKE $2
         LIMIT 1`,
        [`%${courseTitleContains}%`, `%${resource.lesson_title_contains}%`]
      )
      
      if (!lessonRows[0]) {
        console.log(`  ⚠️  No lesson found containing "${resource.lesson_title_contains}" - skipping resource: ${resource.title}`)
        continue
      }
      
      const lessonId = lessonRows[0].id
      
      // Check if resource already exists
      const { rows: existing } = await query<{ id: string }>(
        `SELECT id FROM resources WHERE lesson_id = $1 AND title = $2 LIMIT 1`,
        [lessonId, resource.title]
      )
      
      if (existing[0]) {
        console.log(`  ✓ Resource already exists: ${resource.title}`)
        continue
      }
      
      // Insert resource
      await query(
        `INSERT INTO resources (lesson_id, title, type, url) VALUES ($1, $2, $3, $4)`,
        [lessonId, resource.title, resource.type, resource.url]
      )
      console.log(`  ✓ Added: ${resource.title} (${resource.type})`)
    } catch (error) {
      console.error(`  ✗ Error adding ${resource.title}:`, error)
    }
  }
}

async function updateQuizTimeLimits(): Promise<void> {
  console.log('\nUpdating quiz time limits to maximum 30 minutes (1800 seconds)...')
  
  // Update all quizzes with time_limit > 1800 to 1800
  const { rows: updated } = await query(
    `UPDATE quizzes SET time_limit = 1800 WHERE time_limit > 1800 RETURNING id, title, time_limit`
  )
  
  if (updated.length > 0) {
    console.log(`  ✓ Updated ${updated.length} quizzes with time_limit > 30min to 30min:`)
    for (const q of updated) {
      console.log(`    - ${q.title}: ${q.time_limit}s → 1800s`)
    }
  } else {
    console.log('  ✓ No quizzes needed time limit updates (all ≤ 30min)')
  }
  
  // Also update any 900s (15min) to 1500s (25min) for better usability
  const { rows: updated2 } = await query(
    `UPDATE quizzes SET time_limit = 1500 WHERE time_limit = 900 RETURNING id, title`
  )
  
  if (updated2.length > 0) {
    console.log(`  ✓ Updated ${updated2.length} quizzes from 15min to 25min:`)
    for (const q of updated2) {
      console.log(`    - ${q.title}`)
    }
  }
}

async function main() {
  console.log('=== Adding Resources to Courses ===\n')
  
  // Add resources for JSS2 First Term
  await addResourcesForCourse('JSS2 Mathematics — First Term', jss2FirstTermResources)
  
  // Update quiz timing
  await updateQuizTimeLimits()
  
  console.log('\n=== Done ===')
}

main().catch(console.error)
