import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { checkAdminStatus } from "@/app/admin/actions";
import options from "@/config/auth";
import db from "@/db";
import users from "@/db/schema/users";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(options);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the current user is an admin
    const isAdminUser = await checkAdminStatus();
    if (!isAdminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if trying to remove last admin
    const admins = await db.select().from(users).where(eq(users.role, 'admin'));
    if (admins.length === 1) {
      return NextResponse.json({ 
        error: "Cannot remove the last admin" 
      }, { status: 400 });
    }

    // Remove admin role
    const result = await db
      .update(users)
      .set({ 
        role: 'user',
      })
      .where(eq(users.id, userId))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Admin role removed",
      user: {
        id: result[0].id,
        email: result[0].email,
        role: result[0].role,
      }
    });
  } catch (error) {
    console.error("[REMOVE_ADMIN] Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 