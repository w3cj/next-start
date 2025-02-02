import db from "@/db"
import { users } from "@/db/schema/auth"
import { hashPassword } from "@/utils/auth/password"
import { SQL } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = signupSchema.parse(body)

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: (users: any, { eq }: { eq: (a: any, b: any) => SQL }) => 
        eq(users.email, email),
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    // Create new user
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
      })
      .returning()

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 