import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

console.log("Signup route file loaded");

export async function POST(req) {
	console.log("Signup POST route hit");
	let email, password;
	try {
		const body = await req.json();
		console.log("Received body:", body);
		email = body.email;
		password = body.password;
		console.log("Parsed email and password");
	} catch (error) {
		console.error("Error parsing request body:", error);
		return NextResponse.json(
			{ success: false, error: "Invalid request body" },
			{ status: 400 }
		);
	}

	// Validate input
	if (!email || !password) {
		console.log("Missing email or password");
		return NextResponse.json(
			{ success: false, error: "Email and password are required" },
			{ status: 400 }
		);
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return NextResponse.json(
			{ success: false, error: "Invalid email format" },
			{ status: 400 }
		);
	}

	// Validate password strength (example: at least 8 characters)
	if (password.length < 8) {
		return NextResponse.json(
			{ success: false, error: "Password must be at least 8 characters long" },
			{ status: 400 }
		);
	}

	try {
		console.log("Checking for existing user");
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			console.log("User already exists:", email);
			return NextResponse.json(
				{ success: false, error: "User already exists" },
				{ status: 400 }
			);
		}

		console.log("Hashing password");
		const hashedPassword = await hash(password, 10);

		console.log("Attempting to create user:", email);
		const user = await prisma.user.create({
			data: {
				email,
				pass: hashedPassword,
			},
		});

		console.log("User created successfully:", user.email);
		return NextResponse.json(
			{ success: true, message: "User created successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to create user: " + error.message },
			{ status: 500 }
		);
	}
}
