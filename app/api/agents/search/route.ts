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
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT salesperson_name, salesperson_reg_num 
       FROM transactions 
       WHERE LOWER(salesperson_name) LIKE LOWER($1) 
       LIMIT 1`,
      [`%${name}%`]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ agent: null });
    }

    return NextResponse.json({ agent: result.rows[0] });
  } catch (error) {
    console.error('Database query error:', error); // Log the error
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}