// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'steven',
  password: 'steven_1234',
  host: 'localhost',
  port: 5432,
  database: 'real_estate'
});

export const closePool = async () => {
  await pool.end();
};

export default pool;