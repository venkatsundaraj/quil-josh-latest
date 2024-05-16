import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter, Nunito_Sans } from "next/font/google"
import "./globals.css"
import "react-loading-skeleton/dist/skeleton.css"
import "simplebar-react/dist/simplebar.min.css"
import Provider from "@/components/provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--paragraph" })
const roboto = Nunito_Sans({
  subsets: ["latin"],
  variable: "--heading",
})

export const metadata: Metadata = {
  title: "Medical Tracker",
  description: "To track all the medical equipments",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Provider>
        <body
          className={cn(
            `${inter.variable} ${roboto.variable}`,
            "antialiased grainy font-sans min-h-screen w-screen relative overflow-x-hidden"
          )}
        >
          <ThemeProvider defaultTheme="system" enableSystem attribute="class">
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </Provider>
    </html>
  )
}
