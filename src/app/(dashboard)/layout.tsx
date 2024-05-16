import React, { FC } from "react"
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"
import UserAccountNav from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mod-toggle"
import { Icons } from "@/components/icons"

interface layoutProps {
  children: React.ReactNode
}

const layout = async ({ children }: layoutProps) => {
  const user = await getCurrentUser()

  if (!user) notFound()

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-background">
      {/* <section className="flex container items-start justify-center pt-10 gap-10">
        <dev className="w-full mt-14">{children}</dev>
      </section> */}
      {children}
    </main>
  )
}

export default layout
