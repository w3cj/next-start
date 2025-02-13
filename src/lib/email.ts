import { createTransport } from "nodemailer"

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

type EmailOptions = {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ 
  to, 
  subject, 
  html, 
  from = process.env.SMTP_FROM 
}: EmailOptions) {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
    throw new Error("Failed to send email")
  }
} 