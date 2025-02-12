"use client";

import { Button } from "@nextui-org/react";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  disabled: boolean;
}

interface Props {
  user: User;
}

export default function ManageUserActions({ user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivateAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/admin/users/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to activate account");
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error activating account:", error);
      setError(error instanceof Error ? error.message : "Failed to activate account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-danger text-sm">{error}</p>}
      {user.disabled ? (
        <Button
          color="success"
          variant="flat"
          size="sm"
          onPress={handleActivateAccount}
          isLoading={isLoading}
        >
          Activate Account
        </Button>
      ) : (
        <Button
          color="default"
          variant="flat"
          size="sm"
          isDisabled
        >
          Active
        </Button>
      )}
    </div>
  );
} 