// app/api/agents/[id]/route.ts
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  user: 'steven',
  password: 'steven_1234',
  host: 'localhost',
  port: 5432,
  database: 'real_estate'
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(`
      WITH agent_transactions AS (
        SELECT * FROM transactions 
        WHERE salesperson_reg_num = $1
        AND transaction_date >= NOW() - INTERVAL '2 years'
      )
      SELECT 
        salesperson_name,
        COUNT(*) as total_transactions,
        json_agg(DISTINCT jsonb_build_object(
          'type', property_type,
          'count', (
            SELECT COUNT(*) FROM agent_transactions t2 
            WHERE t2.property_type = t1.property_type
          )
        )) as by_property_type,
        json_agg(DISTINCT jsonb_build_object(
          'type', transaction_type,
          'count', (
            SELECT COUNT(*) FROM agent_transactions t2 
            WHERE t2.transaction_type = t1.transaction_type
          )
        )) as by_transaction_type
      FROM agent_transactions t1
      GROUP BY salesperson_name
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}