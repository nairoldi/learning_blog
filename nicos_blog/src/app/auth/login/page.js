"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/dist/server/api-utils";


export default function LoginPage() {
	const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			if (result.error) {
				setError(result.error);
				console.error("Login error:", result.error);
			} else {
				router.push("/"); // Redirect to home page or dashboard
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("An unexpected error occurred");
		}
	};

	return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-4xl text-white font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-white text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-700 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-700 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-bold py-3 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-indigo-400 hover:text-indigo-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
	);
}
