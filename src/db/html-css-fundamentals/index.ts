// ─── HTML & CSS Fundamentals — Course Seed Data ─────────────────────────────
// Single source of truth for the "HTML & CSS Fundamentals" course content.
// Imported by seed.ts via bulk import pattern (see seed.ts: HCF_SEED_DATA).

import type { HcfModuleData } from './types'
import { module00 } from './module-00'
import { module01 } from './module-01'
import { module02 } from './module-02'
import { module03 } from './module-03'
import { module04 } from './module-04'
import { module05 } from './module-05'
import { module06 } from './module-06'
import { module07 } from './module-07'
import { module08 } from './module-08'
import { module09 } from './module-09'
import { module10 } from './module-10'
import { module11 } from './module-11'
import { FINAL_EXAM } from './final-exam'

/** All 12 modules (Module 0 = onboarding, Modules 1-10 = core, Module 11 = capstone). */
export const HCF_MODULES: HcfModuleData[] = [
  module00,
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
  module11,
]

/** The final exam question bank (53 items: 50 Q&A + 3 practical). */
export { FINAL_EXAM }

// ─── Runtime invariant checks ─────────────────────────────────────────────────
// These run only at build/type-check time (no window object).

if (typeof (globalThis as Record<string, unknown>).window === 'undefined') {
  // --- Module/lesson count invariants ---
  const totalLessons = HCF_MODULES.reduce((acc, m) => acc + m.lessons.length, 0)
  const totalQuizzes = HCF_MODULES.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + (l.quiz ? 1 : 0), 0),
    0,
  )
  const totalAssignments = HCF_MODULES.filter((m) => m.assignment).length

  console.log(
    `[HCF] Modules: ${HCF_MODULES.length} | Lessons: ${totalLessons} | ` +
      `Quizzes: ${totalQuizzes} | Assignments: ${totalAssignments}`,
  )

  // --- Expected counts ---
  const EXPECTED_MODULES = 12
  const EXPECTED_LESSONS = 55
  const EXPECTED_QUIZZES = 55
  const EXPECTED_ASSIGNMENTS = 11 // Modules 0-10 each have one assignment (Module 0 is ungraded but still has a "Toolkit Proof" assignment row)

  if (HCF_MODULES.length !== EXPECTED_MODULES) {
    throw new Error(
      `HCF module count mismatch: expected ${EXPECTED_MODULES}, got ${HCF_MODULES.length}`,
    )
  }
  if (totalLessons !== EXPECTED_LESSONS) {
    throw new Error(
      `HCF lesson count mismatch: expected ${EXPECTED_LESSONS}, got ${totalLessons}`,
    )
  }
  if (totalQuizzes !== EXPECTED_QUIZZES) {
    throw new Error(
      `HCF quiz count mismatch: expected ${EXPECTED_QUIZZES}, got ${totalQuizzes}`,
    )
  }
  // Module 0 assignment is a "Toolkit Proof" screenshot — still counts as a row.
  if (totalAssignments !== EXPECTED_ASSIGNMENTS) {
    throw new Error(
      `HCF assignment count mismatch: expected ${EXPECTED_ASSIGNMENTS}, got ${totalAssignments}`,
    )
  }

  // --- Final exam validation (delegates to final-exam.ts runtime check) ---
  const feQ = FINAL_EXAM.questions
  const feMcCount = feQ.filter((q) => q.questionType !== 'essay').length
  const feEssayCount = feQ.filter((q) => q.questionType === 'essay').length
  if (feMcCount !== 50) {
    throw new Error(
      `HCF final exam MCQ/TF/fb count mismatch: expected 50, got ${feMcCount}`,
    )
  }
  if (feEssayCount !== 3) {
    throw new Error(
      `HCF final exam practical count mismatch: expected 3, got ${feEssayCount}`,
    )
  }
  if (feQ.length !== 53) {
    throw new Error(
      `HCF final exam total mismatch: expected 53, got ${feQ.length}`,
    )
  }
}
