// Diagnostic: print exact bytes/escapes of module-01.ts content (temp, deleted after use).
const fs = require('fs')
const path = require('path')
const target = path.join(__dirname, 'src', 'db', 'ml-course', 'module-01.ts')
const s = fs.readFileSync(target, 'utf8')

// 1) Any non-ASCII codepoints andrevenues
const nonAscii = []
for (let i = 0; i < s.length; i++) {
  const code = s.charCodeAt(i)
  if (code > 127) nonAscii.push({ code: code.toString(16), pos: i, ctx: s.slice(Math.max(0, i - 12), i + 12))
}
console.log('NON_ASCII_COUNT=' + nonAscii.length)
nonAscii.slice(0, 10).forEach(n => console.log('  U+' + n.code.padStart(4, '0') + ' at ' + n.pos + ' |' + JSON.stringify(n.ctx) + '|'))

// 2) The description line with exact escapes
const lines = s.split('\n')
const idx = lines.findIndex(l => l.trim().startsWith('description:'))
console.log('DESC_LINE_IDX=' + idx)
if (idx >= 0) console.log('DESC_LINE=' + JSON.stringify(lines[idx]))

// 3) assignmentType region
const at = s.indexOf('assignmentType')
console.log('ASSIGNMENT_TYPE=' + JSON.stringify(s.slice(at, at + 40)))

// 4) title:: check
console.log('HAS_TITLE_DOUBLE_COLON=' + s.includes('title::'))