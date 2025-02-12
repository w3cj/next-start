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
  disabled: boolean;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
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
      // Check if the account is disabled for all sign-in methods
      if (user.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        if (dbUser?.disabled) {
          throw new Error("This account has been disabled. Please contact support to reactivate your account.");
        }
      }

      // For Google sign-in
      if (account?.provider === "google") {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        if (existingUser?.disabled) {
          throw new Error("This account has been disabled. Please contact support to reactivate your account.");
        }
      }

      return true;
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

        if (user.disabled) {
          throw new Error("Account is disabled");
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
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    }
  }
};

export default authOptions;
