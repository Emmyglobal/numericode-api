// One-off fixer: remove the duplicated ).rows[0].id closure in ss2-mathematics/index.ts
const fs = require('fs')
const p = __dirname + '/src/db/ss2-mathematics/index.ts'
let s = fs.readFileSync(p, 'utf8')
const beforeLen = s.length
// Remove a '.rows[0].id' line (indented with 10 spaces) that immediately precedes a '    ).rows[0].id' line.
const fixed = s.replace(/\r?\n\s+\)\.rows\[0\]\.id\r?\n(\s+\)\.rows\[0\]\.id\r?\n)/, '\n$1')
console.log('changed:', fixed.length !== s.length, 'beforeLen=', beforeLen, 'afterLen=', fixed.length)
fs.writeFileSync(p, fixed)
