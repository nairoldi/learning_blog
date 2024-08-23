import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return NextResponse.json({ success: true, result: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

