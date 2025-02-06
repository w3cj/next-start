import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import db from "@/db";
import users from "@/db/schema/users";
import { env } from "@/env/server";
import { verifyPassword } from "@/utils/auth/password";
import { eq } from "drizzle-orm";

interface UserWithPassword {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
  image: string | null;
  emailVerified: Date | null;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider === "google") {
        return true;
      }

      // For credentials, require email verification (optional)
      if (account?.provider === "credentials") {
        return true;
      }

      // Prevent sign in without email verification
      return false;
    }
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        }) as UserWithPassword | null;

        if (!user) {
          throw new Error("No user found");
        }

        if (!user.password) {
          throw new Error("GOOGLE_USER");  // Special error code for Google users
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      }
    })
  ],
};

export default authOptions;
