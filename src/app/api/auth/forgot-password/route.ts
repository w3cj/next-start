import db from "@/db"
import { passwordResetToken } from "@/db/schema/auth"
import users from "@/db/schema/users"
import { env } from "@/env/server"
import { sendEmail } from "@/utils/email/smtp"
import { getPasswordResetEmailHtml } from "@/utils/email/templates/password-reset"
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
    const user = await db.query.users.findFirst({
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

    // Generate reset link
    const resetLink = `${env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

    // Send email
    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: getPasswordResetEmailHtml(resetLink),
    })

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