"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function DeleteAccountButton() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete account");
      }

      // Always sign out after successful account deletion
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(error instanceof Error ? error.message : "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button 
        color="danger" 
        variant="flat"
        onPress={() => {
          setError(null);
          setIsDeleteModalOpen(true);
        }}
      >
        Delete Account
      </Button>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setError(null);
          setIsDeleteModalOpen(false);
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Delete Account</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <p className="text-danger">Your account will be permanently disabled and you won't be able to sign in again with this email.</p>
            {error && (
              <p className="text-danger">{error}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setError(null);
                setIsDeleteModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteAccount}
              isLoading={isDeleting}
            >
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 