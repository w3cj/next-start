"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@nextui-org/react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof formSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
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
    if (!token) {
      setError("Missing reset token")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      setSuccess(false)

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(true)
      // Redirect to sign in page after 2 seconds
      setTimeout(() => {
        router.push("/auth/signin")
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-danger text-sm">
        Invalid reset link. Please request a new password reset.
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            {...register("password")}
            type="password"
            label="New Password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
        </div>
        <div className="space-y-2">
          <Input
            {...register("confirmPassword")}
            type="password"
            label="Confirm Password"
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />
        </div>
        {error && (
          <div className="text-danger text-sm">{error}</div>
        )}
        {success && (
          <div className="text-success text-sm">
            Password reset successful! Redirecting to sign in...
          </div>
        )}
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isLoading={isLoading}
        >
          {isLoading ? "Resetting password..." : "Reset password"}
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