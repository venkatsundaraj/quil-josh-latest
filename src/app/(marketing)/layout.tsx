import React, { FC } from "react";
import { getCurrentUser } from "@/lib/session";

interface layoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: layoutProps) => {
  return <main className="min-h-screen w-screen">{children}</main>;
};

export default layout;
