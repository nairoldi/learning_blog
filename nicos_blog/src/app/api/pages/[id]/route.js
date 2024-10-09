import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * Get a single page by id
 * @param {Request} req
 * @param {Object} params
 * @returns {Promise<NextResponse>}
 */
export async function GET(req, { params }) {
    try {
        const page = await prisma.page.findUnique({
            where: { id: params.id },
            include: { children: true }
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error('Error fetching page:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * Update a page by id
 * @param {Request} req
 * @param {Object} params
 * @returns {Promise<NextResponse>}
 */
export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, parentId } = await req.json();
    try {
        const page = await prisma.page.update({
            where: { id: params.id },
            data: { title, content, parentId }
        });
        return NextResponse.json(page);
    } catch (error) {
        console.error('Error updating page:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * Delete a page by id
 * @param {Request} req
 * @param {Object} params
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Find the page to be deleted
        const pageToDelete = await prisma.page.findUnique({
            where: { id: params.id },
            include: { children: true }
        });

        if (!pageToDelete) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        // Update children to have the parent of the deleted page
        await prisma.page.updateMany({
            where: { parentId: params.id },
            data: { parentId: pageToDelete.parentId }
        });

        // Delete the page
        await prisma.page.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: "Page deleted successfully" });
    } catch (error) {
        console.error('Error deleting page:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
