import db from "@/db"
import { passwordResetToken } from "@/db/schema"
import users from "@/db/schema/users"
import { hashPassword } from "@/utils/auth/password"
import { and, eq, gt } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find valid token
    const resetToken = await db.query.passwordResetToken.findFirst({
      where: and(
        eq(passwordResetToken.token, token),
        gt(passwordResetToken.expires, new Date())
      ),
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user's password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, resetToken.userId))

    // Delete used token
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.id, resetToken.id))

    return NextResponse.json({
      message: "Password reset successful",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
} 