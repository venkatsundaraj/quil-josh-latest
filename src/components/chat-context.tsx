import { useMutation } from "@tanstack/react-query"
import React, { useState } from "react"
import { useToast } from "./ui/use-toast"

type StreamResponse = {
  addMessage: () => void
  message: string
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export const ChatContext = React.createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
})

interface Props {
  fileId: string
  children: React.ReactNode
}

const ChatContextProvider = function ({ fileId, children }: Props) {
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { toast } = useToast()
  const { mutate: sendMessage } = useMutation({
    mutationFn: async function ({ message }: { message: string }) {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      return response.body
    },
  })

  const addMessage = () => sendMessage({ message })
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  return (
    <ChatContext.Provider
      value={{ addMessage, handleInputChange, message, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  )
}
