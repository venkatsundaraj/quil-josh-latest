import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { OpenAIEmbeddings } from "@langchain/openai"
import { pinecone } from "@/lib/pinecone"
import { PineconeStore } from "@langchain/pinecone"

const f = createUploadthing()

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await getCurrentUser()

      if (!user || !user.id) {
        throw new Error("Something went wrong, Cant find the user")
      }
      return {
        user,
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const uploadedFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.user.id,
          uploadStatus: "PROCESSING",
          url: `https://utfs.io/f/${file.key}`,
        },
      })
      console.log(uploadedFile)
      try {
        const response = await fetch(`https://utfs.io/f/${file.key}`)

        const blob = await response.blob()

        const loader = new PDFLoader(blob)
        console.log("good", loader, blob, response)
        const pageLevelDocs = await loader.load()

        const pagesAmount = pageLevelDocs.length

        // const pineconeValue = await pinecone()
        const pineconeIndex = pinecone.Index("quill")

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        })

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: uploadedFile.id,
        })

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: uploadedFile.id,
          },
        })
      } catch (err) {
        console.log(err)
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: uploadedFile.id,
          },
        })
      }
    }),
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await getCurrentUser()

      if (!user || !user.id) {
        throw new Error("Something went wrong, Cant find the user")
      }
      return {
        user,
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const uploadedFile = await db.file.create({
        data: {
          name: file.name,
          key: file.key,
          userId: metadata.user.id,
          uploadStatus: "PROCESSING",
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        },
      })
      try {
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        )
        console.log(response)
        const blob = await response.blob()

        const loader = new PDFLoader(blob)

        const pageLevelDocs = await loader.load()

        const pagesAmount = pageLevelDocs.length

        // const pineconeValue = await pinecone()
        const pineconeIndex = pinecone.Index("quill")

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        })

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: uploadedFile.id,
        })

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: uploadedFile.id,
          },
        })
      } catch (err) {
        console.log(err)
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: uploadedFile.id,
          },
        })
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
