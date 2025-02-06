import { env } from "@/env/server"
import { createTransport } from "nodemailer"

const transporter = createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: env.SMTP_SECURE === "true",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    })
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`)
    return info
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
} 