"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@nextui-org/react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
})

type FormData = z.infer<typeof formSchema>

export function ReactivateAccountDialog() {
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

      const response = await fetch("/api/auth/reactivate", {
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
      <div className="text-center">
        <h2 className="text-xl font-semibold">Request Account Reactivation</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address to request account reactivation
        </p>
      </div>

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
            Your reactivation request has been sent. Our support team will review it and contact you shortly.
          </div>
        )}
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isLoading={isLoading}
        >
          {isLoading ? "Sending request..." : "Request Reactivation"}
        </Button>
      </form>
    </div>
  )
} 