// app/api/agents/search/route.ts
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name')?.toLowerCase() || '';

    // Query to search agents by name and count their transactions
    const result = await pool.query(`
      WITH recent_transactions AS (
        SELECT 
          salesperson_name,
          salesperson_reg_num,
          COUNT(*) AS total_transactions
        FROM transactions
        WHERE 
          transaction_date >= NOW() - INTERVAL '2 years' AND
          LOWER(salesperson_name) LIKE $1 AND 
          LENGTH(salesperson_reg_num) > 1
        GROUP BY salesperson_name, salesperson_reg_num
      )
      SELECT 
        salesperson_name,
        salesperson_reg_num,
        total_transactions
      FROM recent_transactions
      ORDER BY total_transactions DESC;
    `, [`%${name}%`]);

    // Return the results as JSON
    return NextResponse.json({
      agents: result.rows,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}