require('dotenv').config()
const http = require('http')

const BASE = (process.env.BASE_URL || 'http://localhost:3099').replace(/\/$/, '')

function req(path, opts = {}) {
  const url = BASE + path
  const headers = Object.assign({}, opts.headers || {})
  return new Promise((resolve, reject) => {
    const body = opts.body ? JSON.stringify(opts.body) : null
    if (body) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json'
      headers['Content-Length'] = Buffer.byteLength(body)
    }
    const r = http.request(url, Object.assign({ method: opts.method || 'GET', headers }, {}), (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => {
        let json
        try { json = JSON.parse(data) } catch { json = { raw: data } }
        resolve({ status: res.statusCode, body: json })
      })
    })
    r.on('error', reject)
    if (opts.body) r.write(JSON.stringify(opts.body))
    r.end()
  })
}

;(async () => {
  try {
    // Student login
    const login = await req('/api/auth/login', { method: 'POST', body: { email: 'kolade@gmail.com', password: 'password123' } })
    const token = login.body.data?.token || login.body.data?.accessToken
    console.log('1. STUDENT LOGIN:', login.status, `tokenLen=${token?.length || 0}`)
    const H = { Authorization: `Bearer ${token}` }

    // Catalogue
    const cat = await req('/api/courses?subject=mathematics&limit=50')
    const found = (cat.body.data || []).find((x) => x.title === 'SS2 Mathematics — First Term')
    console.log('2. CATALOGUE:', cat.status, 'total=', cat.body.data?.length, 'FOUND=', !!found, found ? { id: found.id, lessonCount: found.lessonCount, level: found.level } : '')

    // Course detail (student dashboard)
    const detail = await req('/api/dashboard/courses/88d1f761-970a-48b0-b0e6-e3cb23794cbd', { headers: H })
    const c = detail.body.data || {}
    const lessons0 = c.modules?.[0]?.lessons || []
    console.log('3. STUDENT COURSE:', detail.status, 'modules=', c.modules?.length, 'm1Lessons=', lessons0.length,
      'snippet=', (lessons0[0]?.content || '').slice(0, 70))

    // Module detail
    const mods = await req('/api/dashboard/modules/' + (c.modules?.[0]?.id || ''), { headers: H })
    console.log('4. MODULE DETAIL:', mods.status, 'lessons=', mods.body.data?.lessons?.length)

    // Lesson detail
    const lesson = await req('/api/dashboard/lessons/' + (lessons0[0]?.id || ''), { headers: H })
    console.log('5. LESSON:', lesson.status, 'title=', lesson.body.data?.title, 'dur=', lesson.body.data?.duration)

    // Trainer login + courses
    const tlogin = await req('/api/auth/login', { method: 'POST', body: { email: 'trainer@numerycode.com', password: 'password123' } })
    const ttoken = tlogin.body.data?.token || tlogin.body.data?.accessToken
    const tcourses = await req('/api/trainer/courses', { headers: { Authorization: `Bearer ${ttoken}` } })
    const arr = tcourses.body.data || []
    console.log('6. TRAINER:', tcourses.status, 'totalCourses=', arr.length, 'hasSS2=', !!arr.find((x) => x.title === 'SS2 Mathematics — First Term'))

    // Admin login + course list
    const alogin = await req('/api/auth/login', { method: 'POST', body: { email: 'emmanuel@numerycode.com', password: 'password123' } })
    const atoken = alogin.body.data?.token || alogin.body.data?.accessToken
    const acourses = await req('/api/admin/courses', { headers: { Authorization: `Bearer ${atoken}` } })
    const aarr = acourses.body.data || []
    console.log('7. ADMIN:', acourses.status, 'totalCourses=', aarr.length, 'hasSS2=', !!aarr.find((x) => x.title === 'SS2 Mathematics — First Term'))

    console.log('\nALL E2E CHECKS DONE')
  } catch (e) {
    console.error('E2E FAIL:', e.message)
  }
})()
