"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseWithZod } from "@conform-to/zod";
import { getServerSession } from "next-auth";

import options from "@/config/auth";
import db from "@/db";
import guestbookEntries, {
  InsertGuestbookEntrySchema,
} from "@/db/schema/guestbook-entries";
import requireAuth from "@/utils/require-auth";

export async function createGuestbookEntry(
  prevState: unknown,
  formData: FormData
) {
  await requireAuth();
  const submission = parseWithZod(formData, {
    schema: InsertGuestbookEntrySchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const session = (await getServerSession(options))!;

  await db.insert(guestbookEntries).values({
    userId: session.user.id,
    message: submission.value.message,
  });

  revalidatePath("/guestbook");
  redirect("/guestbook");
}
