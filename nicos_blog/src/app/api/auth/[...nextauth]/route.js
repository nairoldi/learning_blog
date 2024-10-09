import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email); // Fetch user from DB
        if (user && await verifyPassword(credentials.password, user.pass)) {
          console.log("Authentication successful for user:", user.email);
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        }
        return null; // Return null if authentication fails
      }
    })
  ],
  callbacks: {
    // Customize JWT token
    async jwt({ token, user }) {
      console.log("JWT Callback called with token:", token);
      console.log("JWT Callback - User:", user);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    // Customize session object
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  // Custom pages for authentication
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/signup",
  },
  session: {
    strategy: "jwt", // Use JWT for session handling
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for JWT encryption
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
