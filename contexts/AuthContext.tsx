"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  username: string
  email: string
  balance: number
  totalInvested: number
  totalEarnings: number
  referralCode: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: {
    username: string
    email: string
    password: string
    confirmPassword: string
    referralCode?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load token and verify on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
      
      if (storedToken) {
        setToken(storedToken)
        // Verify token and get user
        const response = await apiClient.verifyToken()
        if (response.data?.valid && response.data?.user) {
          setUser(response.data.user)
        } else {
          // Token invalid, clear it
          localStorage.removeItem("traders-token")
          setToken(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login({ username, password })
      
      if (response.error) {
        return { success: false, error: response.error }
      }

      if (response.data?.token && response.data?.user) {
        const { token: newToken, user: userData } = response.data
        setToken(newToken)
        setUser(userData)
        localStorage.setItem("traders-token", newToken)
        return { success: true }
      }

      return { success: false, error: "Invalid response from server" }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Login failed" }
    }
  }

  const register = async (userData: {
    username: string
    email: string
    password: string
    confirmPassword: string
    referralCode?: string
  }) => {
    try {
      if (userData.password !== userData.confirmPassword) {
        return { success: false, error: "Passwords do not match" }
      }

      const response = await apiClient.register({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        referralCode: userData.referralCode,
      })

      if (response.error) {
        return { success: false, error: response.error }
      }

      if (response.data?.token && response.data?.user) {
        const { token: newToken, user: userData } = response.data
        setToken(newToken)
        setUser(userData)
        localStorage.setItem("traders-token", newToken)
        return { success: true }
      }

      return { success: false, error: "Invalid response from server" }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Registration failed" }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("traders-token")
    router.push("/")
  }

  const refreshUser = async () => {
    if (!token) return
    
    try {
      const response = await apiClient.getProfile()
      if (response.data) {
        setUser(response.data)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  // Show loader during initial auth check
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center shadow-lg shadow-primary/50">
              <span className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-primary-foreground">1C</span>
            </div>
            <div className="absolute inset-0 bg-primary/30 rounded-lg animate-ping"></div>
            <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)] glow-cyan">1C Traders</h2>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

