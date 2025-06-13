import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: "Whisper App",
  description: "A modern email client built with Next.js",
  keywords: ["email", "next.js", "react"],
  //no website yet
  authors: [{ name: "Diaa Hanna", url: "https://yourwebsite.com" }],
  themeColor: "#90cef4",
  openGraph: {
    title: "Whisper App",
    description: "Whisper is a decentralized, censorship-resistant email/messaging system that leverages Ethereum's blockchain and the peer-to-peer communication layer provided by libp2p. It aims to replace traditional email systems with a private, secure, and trust-less alternative that runs entirely on decentralized infrastructure.",
    url: "https://whisper.eth",
    siteName: "Whisper",
    locale: "en_US",
    type: "website",
  },
}

