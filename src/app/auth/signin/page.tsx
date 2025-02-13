import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/auth/sign-in-form";
import options from "@/config/auth";

export default async function SignInPage() {
  const session = await getServerSession(options);

  if (session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Sign In</h1>
        </CardHeader>
        <CardBody>
          <SignInForm />
         
        </CardBody>
      </Card>
    </div>
  );
} 