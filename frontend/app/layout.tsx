import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../../backend/contexts/auth-context"
import { ThemeProvider } from "@/components/providers/theme-provider" // ✅ Add this

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RSGC - Remote Surveillance Garbage Collection",
  description: "Smart waste management system with IoT integration",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider> {/* ✅ Enables class-based dark mode */}
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
