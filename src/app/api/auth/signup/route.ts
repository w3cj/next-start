import db from "@/db"
import users from "@/db/schema/users"
import { hashPassword } from "@/utils/auth/password"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    console.log("Starting signup process...")
    
    const body = await req.json()
    console.log("Received body:", { ...body, password: '[REDACTED]' })
    
    const { email, password } = signupSchema.parse(body)
    console.log("Validation passed")

    // Check if user exists
    console.log("Checking for existing user...")
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    console.log("Existing user check result:", !!existingUser)

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    console.log("Hashing password...")
    const hashedPassword = await hashPassword(password)
    console.log("Password hashed successfully")

    // Create new user
    console.log("Creating new user...")
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        image: '',
      })
      .returning()
    console.log("User created successfully:", { id: newUser.id, email: newUser.email })

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
        redirect: '/',
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Signup error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 