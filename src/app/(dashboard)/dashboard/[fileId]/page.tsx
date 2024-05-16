import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"
import { FC } from "react"
import ChatWrapper from "@/components/chat-wrapper"
import PdfRenderer from "@/components/pdf-renderer"

interface pageProps {
  params: {
    fileId: string
  }
}

const page = async ({ params }: pageProps) => {
  const { fileId } = params
  const user = await getCurrentUser()
  if (!user) notFound()

  const file = await db.file.findFirst({
    where: {
      id: fileId,
    },
  })

  if (!file) notFound()
  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)] mt-16 w-100">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  )
}

export default page
