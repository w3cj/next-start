import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";

import { checkAdminStatus } from "@/app/admin/actions";
import options from "@/config/auth";
import db from "@/db";

import ManageUserActions from "./manage-user-actions";

export default async function AdminUsersPage() {
  const session = await getServerSession(options);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const isAdminUser = await checkAdminStatus();
  if (!isAdminUser) {
    redirect("/");
  }

  // Get all users
  const allUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.email)],
  });

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">User Management</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {allUsers.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      {user.disabled && (
                        <Chip color="danger" size="sm">
                          Disabled
                        </Chip>
                      )}
                      {user.emailVerified && (
                        <Chip color="success" size="sm">
                          Verified
                        </Chip>
                      )}
                    </div>
                  </div>
                  <ManageUserActions user={user} />
                </div>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 