"use server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import db from "@/db";
import users from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function checkAdminStatus() {
  const session = await getServerSession(options);
  if (!session?.user?.email) return false;

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });
  
  return user?.role === 'admin';
} 