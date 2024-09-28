import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";

export async function POST(req) {
    const { email, password } = await req.json();
    console.log("Login attempt for email:", email);

    // Validate input
    if (!email || !password) {
        return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    try {
        // Attempt to sign in
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        console.log("SignIn result:", result);

        if (result.error) {
            // Return error response if sign-in failed
            return NextResponse.json({ success: false, error: result.error }, { status: 401 });
        }

        // Return success response
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Login error:", error);
        // Return generic error for unexpected errors
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}