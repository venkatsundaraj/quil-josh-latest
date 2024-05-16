import { FC } from "react"
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"
import Dashboard from "@/components/dashboard"

interface pageProps {}

const page = async ({}: pageProps) => {
  const user = await getCurrentUser()
  if (!user) notFound()
  return <Dashboard />
}

export default page
