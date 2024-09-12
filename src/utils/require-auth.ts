import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import options from "@/config/auth";

export default async function requireAuth() {
  const session = await getServerSession(options);
  if (!session?.user) {
    redirect("/");
  }
}
