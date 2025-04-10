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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await pool.query(`
      WITH recent_trans AS (
        SELECT * FROM transactions 
        WHERE salesperson_reg_num = $1
        AND transaction_date >= NOW() - INTERVAL '2 years'
      )
      SELECT 
        json_build_object(
          'summary', (
            SELECT json_build_object(
              'salesperson_name', MIN(salesperson_name),
              'salesperson_reg_num', MIN(salesperson_reg_num),
              'total_transactions', COUNT(*),
              'by_property_type', json_agg(DISTINCT jsonb_build_object(
                'type', property_type,
                'count', (SELECT COUNT(*) FROM recent_trans t2 WHERE t2.property_type = t1.property_type)
              )),
              'by_transaction_type', json_agg(DISTINCT jsonb_build_object(
                'type', transaction_type,
                'count', (SELECT COUNT(*) FROM recent_trans t2 WHERE t2.transaction_type = t1.transaction_type)
              ))
            )
            FROM recent_trans t1
          ),
          'rental_transactions', (
            SELECT coalesce(json_agg(t ORDER BY transaction_date DESC), '[]'::json)
            FROM recent_trans t
            WHERE LOWER(transaction_type) LIKE '%rental%'
          ),
          'sale_transactions', (
            SELECT coalesce(json_agg(t ORDER BY transaction_date DESC), '[]'::json)
            FROM recent_trans t
            WHERE LOWER(transaction_type) LIKE '%sale%'
          )
        ) as agent_data
      FROM recent_trans
      GROUP BY salesperson_reg_num
      LIMIT 1;
    `, [params.id]);

    console.log('Query result:', result.rows[0]?.agent_data); // Debug log

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0].agent_data);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}