import { z } from "zod";

export const userAuthSchema = z.object({
  email: z
    .string()
    .email()
    .superRefine((val) => val === "venkatesh@firebrandlabs.in"),
});

export type UserAuthSchema = z.infer<typeof userAuthSchema>;
