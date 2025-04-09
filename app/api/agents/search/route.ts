// app/api/agents/search/route.ts
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  user: 'steven',
  password: 'steven_1234',
  host: 'localhost',
  port: 5432,
  database: 'real_estate'
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      WITH agent_matches AS (
        SELECT DISTINCT 
          salesperson_name,
          salesperson_reg_num,
          COUNT(*) OVER (PARTITION BY salesperson_reg_num) as total_transactions
        FROM transactions
        WHERE 
          LOWER(salesperson_name) LIKE $1 OR 
          salesperson_reg_num = $2
      )
      SELECT *,
        COUNT(*) OVER() as total_count 
      FROM agent_matches
      ORDER BY 
        total_transactions DESC
      LIMIT $3 OFFSET $4
    `, [
      `%${name}%`,
      `${name}`,
      limit,
      offset
    ]);

    return NextResponse.json({
      agents: result.rows,
      pagination: {
        total: result.rows[0]?.total_count || 0,
        page,
        limit,
        pages: Math.ceil((result.rows[0]?.total_count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}