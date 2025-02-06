import db from "@/db"
import { passwordResetToken } from "@/db/schema/auth"
import users from "@/db/schema/users"
import { env } from "@/env/server"
import { createId } from "@paralleldrive/cuid2"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Find user by email
    const user = await db.query.user.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      // Return 200 even if user doesn't exist for security
      return NextResponse.json({
        message: "If an account exists with that email, a password reset link will be sent.",
      })
    }

    // Delete any existing reset tokens for this user
    await db.delete(passwordResetToken)
      .where(eq(passwordResetToken.userId, user.id))

    // Create reset token
    const token = createId()
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await db.insert(passwordResetToken).values({
      userId: user.id,
      token,
      expires,
    })

    // TODO: Send email with reset link
    // For now, we'll just log it
    const resetLink = `${env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
    console.log('Password reset link:', resetLink)

    return NextResponse.json({
      message: "If an account exists with that email, a password reset link will be sent.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
} 