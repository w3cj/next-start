import { sendEmail } from "@/utils/email/smtp"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await sendEmail({
      to: process.env.SMTP_USER!,
      subject: "Test Email",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify the SMTP configuration.</p>
        <p>If you're seeing this, the email functionality is working correctly!</p>
      `,
    })

    return NextResponse.json({
      message: "Test email sent successfully",
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      { error: "Failed to send test email", details: error },
      { status: 500 }
    )
  }
} 