import { NextResponse } from "next/server";

console.log("=== TEST ROUTE FILE LOADED ===");

export async function GET() {
    console.log("=== TEST ROUTE HIT ===");
    return NextResponse.json({ message: "Test route working", logCheck: "Check your server console for logs" });
}
