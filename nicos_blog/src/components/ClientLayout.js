'use client';
/**
 * ClientLayout is a wrapper component that provides the SessionProvider to the application.    
 * This allows the application to use the useSession hook to access the session state.
 * The SessionProvider is a client-side component that provides the session state to the application.
 * The session state is used to determine if the user is authenticated and to access the user's information.
 */
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
