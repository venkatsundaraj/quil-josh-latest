import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await getCurrentUser();

      if (!user || !user.id) {
        throw new Error("Something went wrong, Cant find the user");
      }
      return {
        user,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const uploadedFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.user.id,
          uploadStatus: "PROCESSIONG",
          url: `https://utfs.io/f/${file.key}`,
        },
      });
    }),
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await getCurrentUser();

      if (!user || !user.id) {
        throw new Error("Something went wrong, Cant find the user");
      }
      return {
        user,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const uploadedFile = await db.file.create({
        data: {
          name: file.name,
          key: file.key,
          userId: metadata.user.id,
          uploadStatus: "PROCESSIONG",
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
