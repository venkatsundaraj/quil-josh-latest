"use client"
import { FC, useState } from "react"
import UploadButton from "./upload-button"
import { trpc } from "@/app/_trpc/client"
import Skeleton from "react-loading-skeleton"
import { Icons } from "./icons"
import { format } from "date-fns"
import { File } from "@prisma/client"
import Link from "next/link"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = ({}) => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null)
  const utils = trpc.useContext()
  const { data: files, isLoading } = trpc.getUserFiles.useQuery()
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate()
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id)
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null)
    },
  })

  return (
    <section className="container grid place-items-center gap-6 mt-16">
      <h1 className="text-foreground text-4xl ">Upload Files</h1>
      <UploadButton />
      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6  divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((item, i) => (
              <li key={i}>
                <Link
                  href={`/dashboard/${item.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-foreground">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Icons.Plus className="h-4 w-4" />
                    {format(new Date(item.createdAt), "MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  <Button
                    onClick={() => {
                      deleteFile({ id: item.id })
                    }}
                    size="sm"
                    className="w-full"
                    variant="destructive"
                  >
                    {currentlyDeletingFile ? (
                      <Icons.Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <ul className="mt-8 grid grid-cols-1 gap-6  divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton
            count={1}
            width={340}
            className="bg-background min-h-[132px] w-full"
          />
          <Skeleton
            count={1}
            width={340}
            className="bg-background min-h-[132px] w-full"
          />
          <Skeleton
            count={1}
            width={340}
            className="bg-background min-h-[132px] w-full"
          />
        </ul>
      ) : (
        <div className="flex items-center flex-col justify-center gap-6 mt-8">
          <Icons.Ghost className="w-8 h-8 text-foreground" />
          <h4 className="text-md text-foreground text-center">
            Please upload the pdf files to chat
          </h4>
        </div>
      )}
    </section>
  )
}

export default Dashboard
