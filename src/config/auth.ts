import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

import db from "@/db";
import { env } from "@/env/server";
import { DrizzleEmailAdapter } from "@/utils/drizzle-email-adapter";

const options: NextAuthOptions = {
  adapter: DrizzleEmailAdapter(db),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
    }),
  ],
};

export default options;
