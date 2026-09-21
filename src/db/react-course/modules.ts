// ─── React Course — curriculum registry ──────────────────────────────────────
// Single ordered list of the course modules. Keeping it here (rather than inside
// index.ts) lets the seed and the test suite share one source of truth without
// importing the database pool.
import { prerequisiteModule } from './prerequisite'
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
import { module12 } from './module-12'
import { module13 } from './module-13'
import { module14 } from './module-14'
import { module15 } from './module-15'
import type { ModuleData } from './types'

/** Modules in curriculum order — the readiness check always comes first. */
export const REACT_MODULES: ModuleData[] = [
  prerequisiteModule,
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
  module12,
  module13,
  module14,
  module15,
]

/** Total lessons across every module (used for `courses.lesson_count`). */
export const REACT_LESSON_COUNT = REACT_MODULES.reduce((total, m) => total + m.lessons.length, 0)
