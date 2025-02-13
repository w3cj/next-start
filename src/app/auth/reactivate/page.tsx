import { ReactivateAccountDialog } from "@/components/auth/reactivate-account-dialog"

export default function ReactivateAccountPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <ReactivateAccountDialog />
      </div>
    </div>
  )
} 