"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			console.log("Attempting to sign up:", email);
			console.log("Sending request to: /api/auth/signup");
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			console.log("Signup response status:", res.status);
			const data = await res.json();
			console.log("Signup response data:", data);

			if (res.ok) {
				router.push("/auth/login");
			} else {
				setError(data.error || "Signup failed");
			}
		} catch (error) {
			console.error("Signup error:", error);
			setError("An unexpected error occurred");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="bg-slate-900 p-8 rounded-lg shadow-lg max-w-md w-full">
				<h1 className="text-4xl text-white font-bold text-center mb-6">
					Signup
				</h1>
				{error && <p className="text-red-500 text-center mb-4">{error}</p>}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-white text-sm font-bold mb-2">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-3 border border-slate-700 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500"
							placeholder="Enter your email"
							required
						/>
					</div>
					<div>
						<label className="block text-white text-sm font-bold mb-2">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-3 border border-slate-700 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500"
							placeholder="Enter your password"
							required
						/>
					</div>
					<div>
						<label className="block text-white text-sm font-bold mb-2">Confirm Password</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full p-3 border border-slate-700 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500"
							placeholder="Confirm your password"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-indigo-500 text-white font-bold py-3 rounded-lg hover:bg-indigo-600 transition duration-300"
					>
						Signup
					</button>
				</form>
				<p className="text-center text-slate-400 mt-6">
					Already have an account?{" "}
					<a
						href="/auth/login"
						className="text-indigo-400 hover:text-indigo-500"
					>
						Login
					</a>
				</p>
			</div>
		</div>
	);
}
