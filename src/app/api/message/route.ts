import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { SendMessageValidator } from "@/lib/validations/message"
import { NextRequest, NextResponse } from "next/server"

export const POST = async function (req: NextRequest, res: NextResponse) {
  try {
    const user = await getCurrentUser()
    const body = await req.json()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { fileId, message } = SendMessageValidator.parse(body)

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId: user.id,
      },
    })

    if (!file) {
      return new Response("Not Found", { status: 401 })
    }

    const messageData = await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId: user.id,
        fieldId: fileId,
      },
    })

    return new Response(JSON.stringify(messageData), { status: 200 })
  } catch (err) {
    console.log(err)
  }
}
