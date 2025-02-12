"use client";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

export default function ReactivationRequestForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/reactivation-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Request Account Reactivation</h2>
        <p className="text-default-500">
          If your account has been disabled, enter your email address below to request reactivation.
        </p>
      </div>

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      {message && (
        <p className="text-success">{message}</p>
      )}

      {error && (
        <p className="text-danger">{error}</p>
      )}

      <Button
        type="submit"
        color="primary"
        isLoading={isLoading}
        className="w-full"
      >
        Request Reactivation
      </Button>
    </form>
  );
} 