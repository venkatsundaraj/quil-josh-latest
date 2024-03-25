import { FC } from "react";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import Dashboard from "@/components/dashboard";

interface pageProps {}

const page = async ({}: pageProps) => {
  const user = await getCurrentUser();
  if (!user) notFound();
  return (
    <main className="w-full min-h-screen">
      <Dashboard />
    </main>
  );
};

export default page;
