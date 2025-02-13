import db from "@/db"
import { passwordResetToken, user } from "@/db/schema/auth"
import { env } from "@/env/server"
import { createId } from "@paralleldrive/cuid2"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { createTransport } from "nodemailer"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

// Create nodemailer transporter with your env variables
const transporter = createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT), // Make sure port is a number
  secure: env.SMTP_SECURE === 'true', // Convert string to boolean
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    console.log('Processing reset request for:', email)

    // Find user by email using direct query
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)
      .then(rows => rows[0])

    console.log('User found:', foundUser ? 'yes' : 'no')

    if (!foundUser) {
      // Return 200 even if user doesn't exist for security
      return NextResponse.json({
        message: "If an account exists with that email, a password reset link will be sent.",
      })
    }

    try {
      // Delete any existing reset tokens for this user
      await db
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.userId, foundUser.id))
      
      console.log('Deleted existing reset tokens')

      // Create reset token
      const token = createId()
      const expires = new Date(Date.now() + 3600000) // 1 hour from now

      // Save token to database
      await db
        .insert(passwordResetToken)
        .values({
          userId: foundUser.id,
          token,
          expires,
        })

      console.log('Created new reset token')

      // Generate reset link
      const resetUrl = `${env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

      // Send email
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "Reset Your Password",
        html: `
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      })

      console.log('Email sent successfully')

    } catch (innerError) {
      console.error('Inner operation failed:', innerError)
      throw innerError
    }

    return NextResponse.json({
      message: "If an account exists with that email, a password reset link will be sent.",
    })
  } catch (error) {
    // More detailed error logging
    console.error("Password reset error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    )
  }
} 