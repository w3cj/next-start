import { Card, CardBody, User } from "@nextui-org/react";
import { getServerSession } from "next-auth";

import options from "@/config/auth";
import requireAuth from "@/utils/require-auth";

export default async function Profile() {
  await requireAuth();
  const session = (await getServerSession(options))!;

  return (
    <Card className="mx-auto mt-4 max-w-md">
      <CardBody>
        <User
          name={session.user?.name}
          description={session.user?.email}
          avatarProps={{
            showFallback: !session.user?.image,
            src: session.user?.image || "",
          }}
        />
      </CardBody>
    </Card>
  );
}
