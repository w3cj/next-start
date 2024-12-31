"use client";

import { useActionState } from "react";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Textarea } from "@nextui-org/react";

import { InsertGuestbookEntrySchema } from "@/db/schema/guestbook-entries";

import { createGuestbookEntry } from "./actions";

export default function GuestbookClient() {
  const [lastResult, action] = useActionState(createGuestbookEntry, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: InsertGuestbookEntrySchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      noValidate
      className="mt-4 flex flex-col gap-2"
    >
      <Textarea
        label="Message"
        key={fields.message.key}
        name={fields.message.name}
        placeholder="Enter your message"
        className="w-full"
        isInvalid={!fields.message.valid}
        errorMessage={fields.message.errors}
      />
      <Button type="submit">Create</Button>
    </form>
  );
}
