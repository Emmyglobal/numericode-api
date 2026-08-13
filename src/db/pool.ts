import 'dotenv/config'
import { Pool, PoolConfig } from 'pg'
import url from 'url'

// Parse connection string and ensure IPv4 only
const connectionString = process.env.DATABASE_URL || ''
const parsedUrl = url.parse(connectionString, true)

const poolConfig: PoolConfig & { family?: number } = {
  user: parsedUrl.auth?.split(':')[0],
  password: parsedUrl.auth?.split(':')[1],
  host: parsedUrl.hostname || 'localhost',
  port: parseInt(parsedUrl.port || '5432'),
  database: parsedUrl.pathname?.slice(1) || 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlives: true,
  keepalivesIdle: 30,
  family: 4, // Force IPv4 connection
} as any

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