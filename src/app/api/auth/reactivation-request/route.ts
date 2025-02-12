import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";

import db from "@/db";
import users from "@/db/schema/users";

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists and is disabled
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({
        message: "If your account exists and is disabled, you will receive an email with further instructions.",
      });
    }

    if (!user.disabled) {
      return NextResponse.json({
        message: "If your account exists and is disabled, you will receive an email with further instructions.",
      });
    }

    // Send reactivation request email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // Send to admin email
      subject: "Account Reactivation Request",
      html: `
        <h1>Account Reactivation Request</h1>
        <p>A user has requested to reactivate their account:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>To reactivate this account, please use the admin panel.</p>
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Account Reactivation Request Received",
      html: `
        <h1>Account Reactivation Request Received</h1>
        <p>We have received your request to reactivate your account.</p>
        <p>Our team will review your request and get back to you shortly.</p>
        <p>Thank you for your patience.</p>
      `,
    });

    return NextResponse.json({
      message: "If your account exists and is disabled, you will receive an email with further instructions.",
    });
  } catch (error) {
    console.error("[REACTIVATION_REQUEST]", error);
    return NextResponse.json(
      { error: "Failed to process reactivation request" },
      { status: 500 }
    );
  }
} 