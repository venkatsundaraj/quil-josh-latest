"use client";

import { useState, FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down-menu";

import { Icons } from "@/components/icons";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserAccountNavProps {
  user: User;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none border-none focus:outline-none focus:border-none">
        <Icons.User className="w-6 h-6 p-1 border border-border rounded-lg text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-center gap-2 flex-col px-2 py-1">
          {user.name ? (
            <h4 className="text-lg font-semibold font-paragraph leading-6 text-foreground">
              {user.name}
            </h4>
          ) : null}
          {user.email ? (
            <p className="text-sm font-normal font-paragraph leading-6 text-foreground">
              {user.email}
            </p>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={cn({ "cursor-not-allowed opacity-80": isLoading })}
          onSelect={async (e) => {
            try {
              e.preventDefault();
              setIsLoading(true);
              return signOut({
                callbackUrl: `${window.location.origin}/login`,
              });
            } catch (err) {
              console.log(err);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
