"use client";

import { Button, ButtonGroup } from "@nextui-org/react";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  disabled: boolean;
  role: 'admin' | 'user';
}

interface Props {
  user: User;
}

export default function ManageUserActions({ user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUser = async (action: 'activate' | 'deactivate' | 'make-admin' | 'remove-admin') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} account`);
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error(`Error ${action} account:`, error);
      setError(error instanceof Error ? error.message : `Failed to ${action} account`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-end">
      {error && <p className="text-danger text-sm">{error}</p>}
      <ButtonGroup size="sm">
        {user.disabled ? (
          <Button
            color="success"
            variant="flat"
            onPress={() => handleUpdateUser('activate')}
            isLoading={isLoading}
          >
            Activate
          </Button>
        ) : (
          <Button
            color="danger"
            variant="flat"
            onPress={() => handleUpdateUser('deactivate')}
            isLoading={isLoading}
          >
            Deactivate
          </Button>
        )}
        {user.role === 'admin' ? (
          <Button
            color="default"
            variant="flat"
            onPress={() => handleUpdateUser('remove-admin')}
            isLoading={isLoading}
          >
            Remove Admin
          </Button>
        ) : (
          <Button
            color="primary"
            variant="flat"
            onPress={() => handleUpdateUser('make-admin')}
            isLoading={isLoading}
          >
            Make Admin
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
} 