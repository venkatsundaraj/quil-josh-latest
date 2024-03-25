"use client";

import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  imageFileValidation,
  imageValidationType,
} from "@/lib/validations/file";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

interface UploadButtonDuplicateProps {}

const UploadButtonDuplicate: FC<UploadButtonDuplicateProps> = ({}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: startPolling } = trpc.getImageFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const {
    handleSubmit,
    formState: { errors, isLoading },
    register,
  } = useForm<imageValidationType>({
    resolver: zodResolver(imageFileValidation),
  });
  const triggerInterval = () => {
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }

        return prev + 5;
      });
    }, 400);

    return interval;
  };

  const onSubmit = async function (fileData: imageValidationType) {
    setIsUploading(true);
    const progressTrigger = triggerInterval();
    console.log(fileData.file);
    const res = await startUpload([fileData.file[0]]);

    if (!res) {
      return toast({
        title: "File upload Failed",
        description: "File upload Failed",
        variant: "destructive",
      });
    }

    const [uploadFile] = res;

    if (!uploadFile.key) {
      return toast({
        title: "Couldn't find the key",
        description: "File upload Failed",
        variant: "destructive",
      });
    }

    clearInterval(progressTrigger);
    setProgressValue(100);
    startPolling({ key: uploadFile.key });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center gap-2"
    >
      <label htmlFor="image">Upload Document</label>
      <Input
        disabled={isLoading}
        id="image"
        type="file"
        {...register("file")}
      />
      {errors.file ? (
        <p className="text-destructive text-sm">{errors.file.message}</p>
      ) : (
        <p className="text-destructive text-sm h-5"></p>
      )}
      {isUploading ? (
        <Progress
          indicatorBar={progressValue === 100 ? "bg-green-500" : ""}
          value={progressValue}
        />
      ) : null}
      <Button disabled={isLoading} type="submit">
        Submit
      </Button>
    </form>
  );
};

export default UploadButtonDuplicate;
