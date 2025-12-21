"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Loader2 } from "lucide-react"

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("admin-traders-token")
      const adminUser = localStorage.getItem("admin-user")

      if (!token || !adminUser) {
        router.push("/admin/login")
        return
      }

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        // Verify token with backend
        const response = await fetch(`${API_BASE_URL}/admin/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          localStorage.removeItem("admin-traders-token")
          localStorage.removeItem("admin-user")
          router.push("/admin/login")
          return
        }

        const user = await response.json()
        if (user.role === "admin") {
          setIsAdmin(true)
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Admin verification error:", error)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 bg-primary/30 rounded-lg animate-ping"></div>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-foreground/70">Verifying admin access...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}

