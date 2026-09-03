import { query, getPoolInstance } from '../src/db/pool';
(async ()=> {
  try {
    const res = await query("SELECT id,title,created_at FROM courses ORDER BY created_at DESC LIMIT 50", []);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error('QUERY_ERROR', e);
    process.exit(2);
  } finally {
    try { const pool = await getPoolInstance(); await pool.end(); } catch {};
  }
})();
