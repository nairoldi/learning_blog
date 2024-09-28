'use client';
import Link from 'next/link';
import { useSession } from "next-auth/react";

export default function HomeAuthButtons() {
  const { status } = useSession();

  // Only show buttons if user is not authenticated
  if (status !== "unauthenticated") {
    return null;
  }

  return (
    <div className="space-x-4">
      <Link href="/auth/login" className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-300">
        Login
      </Link>
      <Link href="/auth/signup" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
        Sign Up
      </Link>
    </div>
  );
}
