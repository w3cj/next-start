'use client'

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface GoogleUserModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export function GoogleUserModal({ isOpen, onClose, email }: GoogleUserModalProps) {
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" })
  }

  const handleSignUp = () => {
    router.push("/auth/signup")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Google Account Found</ModalHeader>
        <ModalBody>
          <p>
            The email address <strong>{email}</strong> is already associated with a
            Google account. You can:
          </p>
          <ul className="list-disc list-inside my-4">
            <li>Sign in with Google</li>
            <li>Create a new account with a different email</li>
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={handleGoogleSignIn}>
            Sign in with Google
          </Button>
          <Button color="secondary" variant="flat" onPress={handleSignUp}>
            Create New Account
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 