"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/dist/server/api-utils";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
    });
    
    if (!result.error) {
      router.push("/");
    }
    else {
      alert("Login failed: " + result.error);
    }
	};

	return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl text-white font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-bold mb-2">Email</label>
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
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-700 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
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
