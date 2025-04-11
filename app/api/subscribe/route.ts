// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
});

export async function POST(request: Request) {
  try {
    const { email, user_type } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!['agent', 'non-agent'].includes(user_type)) {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO email_subscriptions (email, user_type) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
      [email, user_type]
    );

    return NextResponse.json({ message: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Error saving email:', error);
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
  }
}