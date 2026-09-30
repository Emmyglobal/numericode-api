import type { ChallengeLessonWork } from './types'
import { WORK_DAY1 } from './work-day1'
import { WORK_DAY2 } from './work-day2'
import { WORK_DAY3 } from './work-day3'
import { WORK_DAY4 } from './work-day4'
import { WORK_DAY5 } from './work-day5'
import { WORK_DAY6 } from './work-day6'
import { WORK_DAY7 } from './work-day7'

// ─── Per-lesson quizzes and assignments ────────────────────────────────────────
// Every one of the 25 lessons gets an assignment. The 18 topic lessons also get
// a short 3-question check; the 7 practice/assessment lessons keep their own
// larger per-day quiz (5/5/5/5/5/10/15) and only need an assignment here.
//
// Keyed by the lesson's exact title, mirroring LESSON_EXTRAS in
// src/db/ss2-mathematics/lesson-extras.ts. A typo in a key would silently skip
// the work, so the seeder asserts that every lesson resolves to an entry.
export const CHALLENGE_WORK: Record<string, ChallengeLessonWork> = {
  ...WORK_DAY1,
  ...WORK_DAY2,
  ...WORK_DAY3,
  ...WORK_DAY4,
  ...WORK_DAY5,
  ...WORK_DAY6,
  ...WORK_DAY7,
}
