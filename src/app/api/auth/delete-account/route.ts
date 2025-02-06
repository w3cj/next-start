import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import options from "@/config/auth";
import { db } from "@/db";
import { users } from "@/db/schema/users";

export async function POST() {
  try {
    const session = await getServerSession(options);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Soft delete the user by setting disabled flag
    await db
      .update(users)
      .set({ disabled: true })
      .where(eq(users.email, session.user.email));

    return new NextResponse("Account deleted", { status: 200 });
  } catch (error) {
    console.error("[DELETE_ACCOUNT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 