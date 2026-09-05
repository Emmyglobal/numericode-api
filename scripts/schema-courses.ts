import { query, getPoolInstance } from '../src/db/pool';
(async () => {
  try {
    const res = await query(`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'courses' ORDER BY ordinal_position`, []);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error('SCHEMA_ERROR', e);
    process.exit(2);
  } finally {
    try { const pool = await getPoolInstance(); await pool.end(); } catch {}
  }
})();
