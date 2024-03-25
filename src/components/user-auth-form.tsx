"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { AxiosError } from "axios";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  async function onSubmit(data: FormData) {
    try {
      const user = await signIn("email", {
        email: data.email.toLowerCase(),
        redirect: false,
        callbackUrl: searchParams.get("from") || "/dashboard",
      });
      console.log(user);
    } catch (err) {
      if (err instanceof AxiosError) {
        return setError("root", { message: err.message });
      }
      if (err instanceof z.ZodError) {
        return setError("root", { message: err.message });
      }
      return setError("root", { message: "Something went wrong" });
    }
  }

  return (
    <div className={cn("grid gap-6 bg-background", className)} {...props}>
      <form className="bg-background" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isSubmitting}
              {...register("email")}
            />
            {errors?.email ? (
              <p className="px-1 text-xs text-destructive h-4">
                {errors.email.message}
              </p>
            ) : (
              <p className="h-4"></p>
            )}
          </div>
          <button
            className={cn(buttonVariants({ size: "lg" }))}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </button>
        </div>
      </form>
    </div>
  );
}
