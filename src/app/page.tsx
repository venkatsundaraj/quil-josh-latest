import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen text-center bg-background flex-col items-center justify-center">
      <div className="container grid grid-cols-1 lg:grid-cols-2">
        <div className="w-full flex items-center justify-center">
          <Icons.AudioLines className="min-w-[200px] text-primary aspect-square w-1/3 h-1/3 stroke-2" />
        </div>
        <div className="flex w-full items-center flex-col justify-center gap-3 min-h-screen">
          <h1 className="max-w-5xl text-5xl font-bold md:text-6xl font-heading lg:text-7xl">
            To fun with<span className="text-primary"> PDF</span>
          </h1>
          <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg font-paragraph">
            Get answers from your pdf by avoiding reading everything
          </p>

          <Link
            className={buttonVariants({
              size: "lg",
              variant: "default",
              className: "mt-5",
            })}
            href="/dashboard"
          >
            Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
