import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * Get all pages    
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
    try {
        const pages = await prisma.page.findMany({
            select: {
                id: true,
                title: true,
                parentId: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(pages);
    } catch (error) {
        console.error('Error fetching pages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
/**
 * Create a new page
 * @returns {Promise<NextResponse>}
 */
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { title, content, parentId } = await req.json();

  try {
    const newPage = await prisma.page.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        parentId: parentId || null, // Use null if parentId is not provided
      },
    });

    return new Response(JSON.stringify({ success: true, pageId: newPage.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating page:', error);
    return new Response(JSON.stringify({ error: 'Failed to create page' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


