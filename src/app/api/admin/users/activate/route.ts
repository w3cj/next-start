import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import options from "@/config/auth";
import db from "@/db";
import users from "@/db/schema/users";

// Helper to check if user is admin
async function isAdmin(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  // TODO: Add proper admin role check based on your requirements
  return user?.email === "admin@example.com"; // Replace with your admin check logic
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(options);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the current user is an admin
    const isAdminUser = await isAdmin(session.user.email);
    if (!isAdminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Reactivate the user
    const result = await db
      .update(users)
      .set({ 
        disabled: false,
      })
      .where(eq(users.id, userId))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Account activated",
      user: {
        id: result[0].id,
        email: result[0].email,
      }
    });
  } catch (error) {
    console.error("[ACTIVATE_ACCOUNT] Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 