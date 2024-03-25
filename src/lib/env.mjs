import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SMTP_FROM: z.string().min(1),
    POSTMARK_API_KEY: z.string().min(1),
    POSTMARK_TEMPLATE_ID: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    UPLOADTHING_SECRET: z.string().min(),
    UPLOADTHING_APP_ID: z.string().min(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SMTP_FROM: process.env.SMTP_FROM,
    POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
    POSTMARK_TEMPLATE_ID: process.env.POSTMARK_TEMPLATE_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
  },
});
