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
import { signIn, signOut, useSession } from "next-auth/react";
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
            <p className="font-semibold">{data.user?.email}</p>
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
        onClick={() => signIn("google")}
        startContent={<IconBrandGoogle />}
      >
        Sign in with Google
      </Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button color="primary" variant="flat">
            <span className="text-lg">▼</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Sign in options" 
          onAction={(key) => {
            if (key === "email") {
              router.push("/auth/signin");
            }
          }}
        >
          <DropdownItem key="email">
            Sign in with Email
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
}
