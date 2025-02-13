import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import db from "@/db"
import { users } from "@/db/schema"
import { sendEmail } from "@/lib/email"
import { z } from "zod"

const reactivateSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = reactivateSchema.parse(body)

    // Check if user exists and is disabled
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({
        message: "If your account exists and is disabled, you will receive further instructions via email.",
      })
    }

    if (!user.disabled) {
      return NextResponse.json({
        message: "If your account exists and is disabled, you will receive further instructions via email.",
      })
    }

    // Send reactivation request email to admin
    await sendEmail({
      to: process.env.SMTP_FROM!,
      subject: "Account Reactivation Request",
      html: `
        <h1>Account Reactivation Request</h1>
        <p>A user has requested to reactivate their account:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Please review this request and take appropriate action.</p>
      `,
    })

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: "Account Reactivation Request Received",
      html: `
        <h1>Account Reactivation Request Received</h1>
        <p>We have received your request to reactivate your account.</p>
        <p>Our team will review your request and get back to you shortly.</p>
        <p>Thank you for your patience.</p>
      `,
    })

    return NextResponse.json({
      message: "If your account exists and is disabled, you will receive further instructions via email.",
    })
  } catch (error) {
    console.error("Reactivation request error:", error)
    return NextResponse.json(
      { error: "Failed to process reactivation request" },
      { status: 500 }
    )
  }
} 