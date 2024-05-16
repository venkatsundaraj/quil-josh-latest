"use client"

import { FC, useState } from "react"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Dropzone from "react-dropzone"
import { Icons } from "./icons"
import { Progress } from "./ui/progress"
import { cn } from "@/lib/utils"
import { uploadFiles, useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/components/ui/use-toast"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"
import { imageValidation } from "@/lib/validations/file"
import UploadButtonDuplicate from "./upload-button-duplicate"
interface UploadButtonProps {}

const UploadDropzone = function () {
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [progressBarValue, setProgressBarValue] = useState<number>(0)

  const { startUpload } = useUploadThing("pdfUploader")
  const { toast } = useToast()
  const router = useRouter()
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`)
    },
    retry: true,
    retryDelay: 500,
  })

  const generateProgressBar = function () {
    const interval = setInterval(() => {
      setProgressBarValue((prev) => {
        if (progressBarValue >= 95) {
          clearInterval(interval)
          return progressBarValue
        }
        return prev + 5
      })
    }, 500)

    return interval
  }
  return (
    <Dropzone
      multiple={false}
      onDrop={async (file) => {
        const validateImage = imageValidation.safeParse({ file })

        if (!validateImage.success) {
          return toast({
            title: "File Uploding Failes in frontend",
            variant: "destructive",
            description: "Something Went Wrong",
          })
        }
        setIsUploading(true)
        const progressInterval = generateProgressBar()

        const res = await startUpload(file)

        if (!res) {
          return toast({
            title: "File Uploding Failes",
            variant: "destructive",
            description: "Something Went Wrong",
          })
        }

        const [fileResponse] = res
        const key = fileResponse.key

        if (!key) {
          return toast({
            title: "File Uploding Failes",
            variant: "destructive",
            description: "Something Went Wrong",
          })
        }

        clearInterval(progressInterval)
        setProgressBarValue(100)
        startPolling({ key })
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Icons.Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <Icons.File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={progressBarValue}
                    indicatorBar={
                      progressBarValue === 100 ? "bg-green-500" : ""
                    }
                    className={cn("h-1 w-full bg-zinc-200")}
                  />
                  {progressBarValue === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Icons.Loader2 className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}
            </label>
            <input
              {...getInputProps()}
              type="file"
              id="dropzone-file"
              className="hidden"
            />
          </div>
        </div>
      )}
    </Dropzone>
  )
}

const UploadButton: FC<UploadButtonProps> = ({}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit PDF</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[425px]">
          <UploadDropzone />
        </DialogContent>
      </Dialog>
      {/* <UploadButtonDuplicate /> */}
    </>
  )
}

export default UploadButton
