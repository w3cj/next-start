"use client"

import { GoogleUserModal } from "@/components/auth/google-user-modal"
import { Icons } from "@/components/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Link } from "@nextui-org/react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof formSchema>

export function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>("")
  const [showGoogleModal, setShowGoogleModal] = React.useState(false)
  const [googleEmail, setGoogleEmail] = React.useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error === "GOOGLE_USER") {
        setGoogleEmail(values.email)
        setShowGoogleModal(true)
      } else if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (error) {
      setError("Something went wrong")
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
          <div className="text-right">
            <Link href="/auth/forgot-password" size="sm">
              Forgot password?
            </Link>
          </div>
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
          Sign In
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="bordered"
        type="button"
        disabled={isLoading}
        onClick={() => signIn("google", { callbackUrl })}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>

      <GoogleUserModal 
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        email={googleEmail}
      />
    </div>
  )
} 