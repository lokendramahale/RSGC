"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "coordinator"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasRole: (role: User["role"]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Decode JWT to get expiration
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
      return JSON.parse(jsonPayload)
    } catch (err) {
      return null
    }
  }

  // Auto logout on token expiry
  const scheduleLogout = (token: string) => {
    const decoded = parseJwt(token)
    if (decoded?.exp) {
      const expiryTime = decoded.exp * 1000 - Date.now()
      if (expiryTime > 0) {
        setTimeout(() => {
          logout()
        }, expiryTime)
      } else {
        logout()
      }
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("rsgc_user")
    const storedToken = localStorage.getItem("rsgc_token")

    if (storedUser && storedToken) {
      const decoded = parseJwt(storedToken)
      if (decoded?.exp * 1000 > Date.now()) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
        scheduleLogout(storedToken)
      } else {
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) return false

      const data = await res.json()
      const { token, user } = data

      if (token && user) {
        localStorage.setItem("rsgc_token", token)
        localStorage.setItem("rsgc_user", JSON.stringify(user))
        setToken(token)
        setUser(user)
        scheduleLogout(token)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("rsgc_user")
    localStorage.removeItem("rsgc_token")
    setUser(null)
    setToken(null)
  }

  const hasRole = (role: User["role"]) => user?.role === role

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
