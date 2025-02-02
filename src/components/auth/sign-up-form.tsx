"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@nextui-org/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof formSchema>

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Sign in the user after successful signup
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Redirect to home page or wherever specified in the response
      router.push(data.redirect || "/")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            {...register("email")}
            type="email"
            label="Email"
            placeholder="name@example.com"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
        </div>
        <div className="space-y-2">
          <Input
            {...register("password")}
            type="password"
            label="Password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
        </div>
        {error && (
          <div className="text-danger text-sm">{error}</div>
        )}
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isLoading={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  )
} 