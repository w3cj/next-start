import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import options from "@/config/auth";
import db from "@/db";
import sessions from "@/db/schema/sessions";
import users from "@/db/schema/users";

export async function POST() {
  try {
    const session = await getServerSession(options);
    console.log("[DELETE_ACCOUNT] Session:", session);

    if (!session?.user?.email) {
      console.log("[DELETE_ACCOUNT] No session or email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[DELETE_ACCOUNT] Attempting to disable account for:", session.user.email);

    // Get the user ID first
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      console.log("[DELETE_ACCOUNT] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all sessions for this user
    await db.delete(sessions).where(eq(sessions.userId, user.id));
    console.log("[DELETE_ACCOUNT] Deleted all sessions for user");

    // Soft delete the user by setting disabled flag
    const result = await db
      .update(users)
      .set({ disabled: true })
      .where(eq(users.id, user.id))
      .returning();

    console.log("[DELETE_ACCOUNT] Update result:", result);

    return NextResponse.json({ 
      message: "Account deleted",
      signOut: true 
    }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_ACCOUNT] Error:", error);
    if (error instanceof Error) {
      console.error("[DELETE_ACCOUNT] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 