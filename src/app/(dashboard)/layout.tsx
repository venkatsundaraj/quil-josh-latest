import React, { FC } from "react";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import UserAccountNav from "@/components/user-account-nav";
import { ModeToggle } from "@/components/mod-toggle";
import { Icons } from "@/components/icons";

interface layoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: layoutProps) => {
  const user = await getCurrentUser();

  if (!user) notFound();

  return (
    <main className="min-h-screen w-screen bg-background">
      <nav className="absolute h-16 inset-x-0 top-0 z-30 w-screen border-b border-border bg-background backdrop-blur-lg transition-all">
        <div className="container h-full">
          <header className="flex h-full w-full items-center justify-between border-b border-border">
            <Icons.Axe className="w-8 h-8 text-primary" />
            <div className="flex items-center justify-center gap-6">
              <ModeToggle />
              <UserAccountNav user={user} />
            </div>
          </header>
        </div>
      </nav>
      <div className="flex container items-start justify-center pt-10 gap-10">
        <main className="w-full mt-14">{children}</main>
      </div>
    </main>
  );
};

export default layout;
