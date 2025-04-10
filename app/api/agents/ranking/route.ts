// app/api/agents/rankings/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'steven',
  password: 'steven_1234',
  host: 'localhost',
  port: 5432,
  database: 'real_estate',
});

export async function GET() {
  try {
    const rentalQuery = `
      SELECT salesperson_name, salesperson_reg_num, COUNT(*) AS transaction_count
      FROM transactions
      WHERE LOWER(transaction_type) LIKE '%rental%' AND transaction_date >= NOW() - INTERVAL '1 years'
      AND length(salesperson_reg_num) > 1
      GROUP BY salesperson_name, salesperson_reg_num
      ORDER BY transaction_count DESC
      LIMIT 20;
    `;

    const saleQuery = `
      SELECT salesperson_name, salesperson_reg_num, COUNT(*) AS transaction_count
      FROM transactions
      WHERE LOWER(transaction_type) LIKE '%sale%' AND transaction_date >= NOW() - INTERVAL '1 years'
      AND length(salesperson_reg_num) > 1
      GROUP BY salesperson_name, salesperson_reg_num
      ORDER BY transaction_count DESC
      LIMIT 20;
    `;

    const rentalResults = await pool.query(rentalQuery);
    const saleResults = await pool.query(saleQuery);

    return NextResponse.json({
      rental: rentalResults.rows,
      sale: saleResults.rows,
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
  }
}