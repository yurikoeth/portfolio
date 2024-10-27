import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Your Name | Software Engineer",
  description: "Software Engineer, UI/UX Designer, and Problem Solver",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main className="bg-white dark:bg-[#111] text-black dark:text-white min-h-screen transition-colors duration-200">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}