"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
})

type FormData = z.infer<typeof formSchema>

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>("")
  const [success, setSuccess] = React.useState<boolean>(false)

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
      setSuccess(false)

      const response = await fetch("/api/auth/forgot-password", {
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

      setSuccess(true)
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
        {error && (
          <div className="text-danger text-sm">{error}</div>
        )}
        {success && (
          <div className="text-success text-sm">
            If an account exists with that email, a password reset link will be sent.
          </div>
        )}
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isLoading={isLoading}
        >
          {isLoading ? "Sending reset link..." : "Send reset link"}
        </Button>
      </form>
      <Button
        variant="light"
        onPress={() => router.push("/auth/signin")}
        className="w-full"
      >
        Back to sign in
      </Button>
    </div>
  )
} 