const fs = require('fs')
const path = require('path')
const target = path.join(__dirname, 'src', 'db', 'ml-course', 'module-01.ts')
const s = fs.readFileSync(target, 'utf8')
const bad = []
for (let i = 0; i < s.length; i++) {
  const c = s.charCodeAt(i))
  if (c > 127) {
    bad.push(c.toString(16))
}
}
console.log('nonAscii:', bad.join(','))
const lines = s.split('\n')
lines.forEach(function (line, n) {
  if (line.indexOf('description:') >= 0) console.log('desc' + n + '=' + JSON.stringify(line))
  if (line.indexOf('title::') >= 0) console.log('title-double-colon at line ' + n)
  if (line.indexOf('assignmentType') >= 0) console.log('at' + n + '=' + JSON.stringify(line))
})