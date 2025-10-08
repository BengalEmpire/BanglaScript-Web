import type React from "react"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata = {
  title: "BanglaScript - Write JavaScript in Bengali | বাংলা ভাষায় প্রোগ্রামিং",
  description:
    "BanglaScript is a Bangla-to-JavaScript transpiler that enables developers to write programs in Bengali syntax. Write in Bangla, Run in JavaScript.",
  keywords:
    "BanglaScript, Bengali Programming, Bangla Language Transpiler, Bengali Developers, JavaScript, Open Source, Developer Tools",
  authors: [{ name: "Mahmud Rahman" }],
  openGraph: {
    title: "BanglaScript - Write JavaScript in Bengali",
    description:
      "Write programs in Bengali syntax and compile to JavaScript. Making programming accessible for Bengali speakers.",
    type: "website",
    locale: "en_US",
    alternateLocale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "BanglaScript - Write JavaScript in Bengali",
    description: "Write programs in Bengali syntax and compile to JavaScript.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
