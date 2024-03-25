import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "./db";

export const getCurrentUser = async function () {
  const session = await getServerSession(authOptions);

  return session?.user;
};
