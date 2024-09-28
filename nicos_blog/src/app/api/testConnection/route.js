import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log("Attempting to fetch users...");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      }
    });
    console.log("Users fetched successfully. Count:", users.length);
    users.forEach(user => console.log("User:", user.email));
    return NextResponse.json({ success: true, userCount: users.length, users });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
