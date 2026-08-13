import 'dotenv/config'
import { Pool, PoolConfig } from 'pg'

const poolConfig: PoolConfig & { family?: number } = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  family: 4, // Prefer IPv4 (important for Render + Supabase compatibility)
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err)
  process.exit(-1)
})

export const query = async <T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> => {
  const result = await pool.query(text, params)
  return { rows: result.rows as T[], rowCount: result.rowCount }
}

export const getClient = () => pool.connect()

export default pool