import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany(); // Make sure the 'user' model exists
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
