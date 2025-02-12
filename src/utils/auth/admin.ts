import { eq } from "drizzle-orm";

import db from "@/db";
import users from "@/db/schema/users";

// List of admin emails
const ADMIN_EMAILS = [
  "admin@example.com",
  "b2kcloud@gmail.com", // Adding your email as admin
];

export async function isAdmin(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  
  if (!user) return false;
  
  // Check if the user's email is in the admin list
  return ADMIN_EMAILS.includes(user.email);
} 