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
    const resolvedParams = await params;

    const result = await pool.query(`
      WITH recent_trans AS (
        SELECT * FROM transactions 
        WHERE salesperson_reg_num = $1
        AND transaction_date >= NOW() - INTERVAL '2 years'
      ),
      rental_stats AS (
        SELECT COUNT(*) AS rental_count
        FROM transactions
        WHERE LOWER(transaction_type) LIKE '%rental%' AND transaction_date >= NOW() - INTERVAL '2 years'
        GROUP BY salesperson_reg_num
      ),
      sale_stats AS (
        SELECT COUNT(*) AS sale_count
        FROM transactions
        WHERE LOWER(transaction_type) LIKE '%sale%' AND transaction_date >= NOW() - INTERVAL '2 years'
        GROUP BY salesperson_reg_num
      ),
      thresholds AS (
        SELECT 
          (SELECT PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY rental_count) FROM rental_stats) AS rental_top_10,
          (SELECT PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY rental_count) FROM rental_stats) AS rental_top_20,
          (SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY rental_count) FROM rental_stats) AS rental_top_50,
          (SELECT PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY sale_count) FROM sale_stats) AS sale_top_10,
          (SELECT PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY sale_count) FROM sale_stats) AS sale_top_20,
          (SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sale_count) FROM sale_stats) AS sale_top_50
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
          ),
          'badges', (
            SELECT json_agg(badge)
            FROM (
              SELECT 
                CASE 
                  WHEN (SELECT COUNT(*) FROM recent_trans WHERE LOWER(transaction_type) LIKE '%rental%') >= (SELECT rental_top_10 FROM thresholds) THEN 'Top 10% (Rental)'
                  WHEN (SELECT COUNT(*) FROM recent_trans WHERE LOWER(transaction_type) LIKE '%rental%') >= (SELECT rental_top_20 FROM thresholds) THEN 'Top 20% (Rental)'
                  WHEN (SELECT COUNT(*) FROM recent_trans WHERE LOWER(transaction_type) LIKE '%rental%') >= (SELECT rental_top_50 FROM thresholds) THEN 'Top 50% (Rental)'
                  ELSE NULL
                END AS badge
              UNION ALL
              SELECT 
                CASE 
                  WHEN (SELECT COUNT(*) FROM recent_trans WHERE LOWER(transaction_type) LIKE '%sale%') >= (SELECT sale_top_10 FROM thresholds) THEN 'Top 10% (Sale)'
                  WHEN (SELECT COUNT(*) FROM recent_trans WHERE LOWER(transaction_type) LIKE '%sale%') >= (SELECT sale_top_20 FROM thresholds) THEN 'Top 20% (Sale)'
                  WHEN (SELECT COUNT(*) FROM recent_trans WHERE LOWER(transaction_type) LIKE '%sale%') >= (SELECT sale_top_50 FROM thresholds) THEN 'Top 50% (Sale)'
                  ELSE NULL
                END AS badge
              UNION ALL
              SELECT 
                CASE 
                  WHEN (SELECT COUNT(*) FROM recent_trans WHERE LOWER(property_type) = 'hdb') > 10 THEN 'HDB Expert'
                  ELSE NULL
                END AS badge
              UNION ALL
              SELECT 
                CASE 
                  WHEN (SELECT COUNT(*) FROM recent_trans WHERE LOWER(property_type) like '%condo%') > 10 THEN 'Private Property Expert'
                  ELSE NULL
                END AS badge
            ) AS badges WHERE badge IS NOT NULL
          )
        ) as agent_data
      FROM recent_trans
      GROUP BY salesperson_reg_num
      LIMIT 1;
    `, [resolvedParams.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0].agent_data);
  } catch (error) {
    console.error('Error fetching agent data:', error);
    return NextResponse.json({ error: 'Failed to fetch agent data' }, { status: 500 });
  }
}