import { Card, CardBody, User } from "@nextui-org/react";
import { getServerSession } from "next-auth";

import DeleteAccountButton from "@/components/profile/delete-account-button";
import options from "@/config/auth";
import requireAuth from "@/utils/require-auth";

export default async function Profile() {
  await requireAuth();
  const session = (await getServerSession(options))!;

  return (
    <Card className="mx-auto mt-4 max-w-md">
      <CardBody className="gap-4">
        <User
          name={session.user?.name}
          description={session.user?.email}
          avatarProps={{
            showFallback: !session.user?.image,
            src: session.user?.image || "",
          }}
        />
        <DeleteAccountButton />
      </CardBody>
    </Card>
  );
}
