"use client";

import {
    Avatar,
    Button,
    ButtonGroup,
    CircularProgress,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButton({ minimal = true }: { minimal?: boolean }) {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <CircularProgress aria-label="Loading authentication status..." />;
  }

  if (status === "authenticated") {
    const signOutClick = () =>
      signOut({
        callbackUrl: "/",
      });
    if (minimal) {
      return (
        <Button onClick={signOutClick} color="danger" variant="ghost">
          <IconBrandGoogle />
          Sign Out
        </Button>
      );
    }

    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            showFallback={!data.user?.image}
            src={data.user?.image || ""}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <Link href="/profile" className="font-semibold text-primary hover:underline">
              {data.user?.email}
            </Link>
          </DropdownItem>
          <DropdownItem key="sign-out" color="danger" onClick={signOutClick}>
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <ButtonGroup>
      <Button
        color="primary"
        onClick={() => router.push("/auth/signin")}
      >
        Sign In
      </Button>
      <Button
        color="primary"
        variant="flat"
        onClick={() => router.push("/auth/signup")}
      >
        Sign Up
      </Button>
    </ButtonGroup>
  );
}
