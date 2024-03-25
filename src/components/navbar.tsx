import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { ModeToggle } from "./mod-toggle";

const Navbar = () => {
  return (
    <nav className="absolute h-16 inset-x-0 top-0 z-30 w-screen border-b border-border bg-background backdrop-blur-lg transition-all">
      <div className="container h-full">
        <div className="flex h-full w-full  items-center justify-between border-b border-border">
          <Link
            href="/"
            className="flex z-40 font-semibold items-center justify-center flex-nowrap gap-2"
          >
            <Icons.Music2 className="w-8 h-8 text-primary" />
            <span className="font-heading font-bold text-lg md:text-xl lg:text-2xl">
              Home
            </span>
          </Link>

          <div className="items-center space-x-4 sm:flex font-paragraph gap-6">
            <ModeToggle />
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
