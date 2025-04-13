// app/api/agents/rankings/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE
  });

export async function GET() {
  try {
    const rentalQuery = `
      SELECT salesperson_name, salesperson_reg_num, COUNT(*) AS transaction_count
      FROM transactions
      WHERE LOWER(transaction_type) LIKE '%rental%' AND transaction_date >= NOW() - INTERVAL '2 years'
      AND length(salesperson_reg_num) > 1
      GROUP BY salesperson_name, salesperson_reg_num
      ORDER BY transaction_count DESC
      LIMIT 30;
    `;

    const saleQuery = `
      SELECT salesperson_name, salesperson_reg_num, COUNT(*) AS transaction_count
      FROM transactions
      WHERE LOWER(transaction_type) LIKE '%sale%' AND transaction_date >= NOW() - INTERVAL '2 years'
      AND length(salesperson_reg_num) > 1
      GROUP BY salesperson_name, salesperson_reg_num
      ORDER BY transaction_count DESC
      LIMIT 30;
    `;

    const newsaleQuery = `
      WITH agent_transactions AS (
        SELECT 
          salesperson_name,
          salesperson_reg_num,
          COUNT(*) AS total_transactions,
          SUM(CASE WHEN LOWER(transaction_type) = 'new sale' THEN 1 ELSE 0 END) AS new_sale_count,
          SUM(CASE WHEN LOWER(transaction_type) = 'resale' THEN 1 ELSE 0 END) AS resale_count
        FROM transactions
        WHERE transaction_date >= NOW() - INTERVAL '2 years'
        AND LOWER(transaction_type) like '%sale%'
        GROUP BY salesperson_name, salesperson_reg_num
      )
      SELECT 
        salesperson_name,
        salesperson_reg_num,
        new_sale_count,
        resale_count,
        total_transactions,
        COALESCE(ROUND(CAST(new_sale_count AS NUMERIC) / NULLIF((new_sale_count + resale_count), 0), 2), 0) AS new_sale_ratio
      FROM agent_transactions
      WHERE total_transactions >= 15
      ORDER BY new_sale_ratio DESC, total_transactions DESC
        LIMIT 30;
    `;

    const rentalResults = await pool.query(rentalQuery);
    const saleResults = await pool.query(saleQuery);
    const newsaleResults = await pool.query(newsaleQuery);

    console.log('newsaleResults:', newsaleResults.rows[2]);

    return NextResponse.json({
      rental: rentalResults.rows,
      sale: saleResults.rows,
      newsale: newsaleResults.rows,
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
  }
}