"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "driver" | "coordinator"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem("rsgc_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication logic
    const mockUsers = {
      "admin@rsgc.com": { id: "1", name: "Admin User", email: "admin@rsgc.com", role: "admin" as const },
      "driver@rsgc.com": { id: "2", name: "John Driver", email: "driver@rsgc.com", role: "driver" as const },
      "coordinator@rsgc.com": {
        id: "3",
        name: "Jane Coordinator",
        email: "coordinator@rsgc.com",
        role: "coordinator" as const,
      },
    }

    const foundUser = mockUsers[email as keyof typeof mockUsers]

    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("rsgc_user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("rsgc_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
