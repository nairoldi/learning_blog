'use client';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

export default function NavAuthButtons() {
  // Get session data and status
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("Auth status:", status);

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      // Sign out the user
      await signOut({ redirect: false });
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally, show an error message to the user
    }
  };

  // Show nothing while loading
  if (status === "loading") {
    return null; // or a loading spinner
  }

  // Show logout button if authenticated
  if (status === "authenticated") {
    return (
      <button 
        onClick={handleSignOut} 
        className="text-white/90 hover:text-white text-xl"
      >
        <FaSignOutAlt className="text-4xl" />
      </button>
    );
  }

  // Show login and signup links if not authenticated
  return (
    <>
      <Link href="/auth/signup" className="text-white/90 hover:text-white text-xl">Signup</Link>
      <Link href="/auth/login" className="text-white/90 hover:text-white text-xl">Login</Link>
    </>
  );
}
