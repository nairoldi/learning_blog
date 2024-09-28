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
        console.log("Authorize function called with email:", credentials?.email);
        
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          console.log("User found:", user ? "Yes" : "No");

          if (!user) {
            throw new Error("No user found with this email");
          }

          console.log("Stored hashed password:", user.pass ? "Exists" : "Missing");

          if (!user.pass) {
            throw new Error("User account is not properly set up");
          }

          // Validate password
          const isPasswordValid = await compare(credentials.password, user.pass);
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          console.log("Authentication successful for user:", user.email);

          // Return user data for session
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw error; // Re-throw the error to be handled by NextAuth
        }
      }
    })
  ],
  callbacks: {
    // Customize JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    // Customize session object
    async session({ session, token }) {
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
