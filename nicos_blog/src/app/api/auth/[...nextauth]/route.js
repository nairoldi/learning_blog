// handles the authentication configuration.
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Assumed prisma client is exported here
import bcrypt from "bcrypt";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if the user exists
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && await bcrypt.compare(credentials.password, user.pass)) {
          return user;
        }
        else {
           throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/signup", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET, 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session, user.role = token.role;
      return session;
    },
  },
  pages: {
    singIn: "auth/login"
  },
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
