// Temporary one-shot cleanup for module-01.ts seed content (deleted after use).
const fs = require('fs')
const path = require('path')

const target = path.join(__dirname, 'src', 'db', 'ml-course', 'module-01.ts')
let s = fs.readFileSync(target, 'utf8')

// Strip any accidental Thai/Tibetan-range bytes (stray corruption from generation).
const before = s.length
s = s.replace(/[\u0e00-\u0fff]/g, '')
console.log('stripped chars:', before - s.length)

// Fix known syntax/style slipsts
s = s.replace(/title::/g, 'title:')
s = s.replace(/assignmentType:'/g, 'assignmentType: ')
s = s.replace(/250,\/301/g, '250, 301')
s = s.replace(/,290,\/301/g, ',290, 301') // no-op safety

fs.writeFileSync(target, s)
console.log('cleaned module-01.ts')