import { PrismaClient } from "@prisma/client";

declare module global {
  var cachedPrisma: PrismaClient;
}

let prisma = new PrismaClient();

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  } else {
    prisma = global.cachedPrisma;
  }
}

export const db = prisma;
