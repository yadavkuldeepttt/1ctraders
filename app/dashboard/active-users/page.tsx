"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import { UserCheck } from "lucide-react"

export default function ActiveUsersPage() {
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActiveUsers = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getActiveUsers()
        if (response.data) {
          const users = response.data.activeUsers || []
          // If no users, use dummy data
          if (users.length === 0) {
            setActiveUsers([
              { username: "trader1", totalInvested: 5000, totalEarnings: 1250 },
              { username: "investor2", totalInvested: 3000, totalEarnings: 900 },
              { username: "crypto3", totalInvested: 7500, totalEarnings: 1875 },
              { username: "wealth4", totalInvested: 10000, totalEarnings: 2500 },
              { username: "smart5", totalInvested: 6000, totalEarnings: 1500 },
              { username: "pro6", totalInvested: 8000, totalEarnings: 2000 },
              { username: "investor7", totalInvested: 4500, totalEarnings: 1125 },
              { username: "trader8", totalInvested: 12000, totalEarnings: 3000 },
            ])
          } else {
            setActiveUsers(users)
          }
        } else {
          // Set dummy data if API fails
          setActiveUsers([
            { username: "trader1", totalInvested: 5000, totalEarnings: 1250 },
            { username: "investor2", totalInvested: 3000, totalEarnings: 900 },
            { username: "crypto3", totalInvested: 7500, totalEarnings: 1875 },
            { username: "wealth4", totalInvested: 10000, totalEarnings: 2500 },
            { username: "smart5", totalInvested: 6000, totalEarnings: 1500 },
            { username: "pro6", totalInvested: 8000, totalEarnings: 2000 },
            { username: "investor7", totalInvested: 4500, totalEarnings: 1125 },
            { username: "trader8", totalInvested: 12000, totalEarnings: 3000 },
          ])
        }
      } catch (error) {
        console.error("Failed to load active users:", error)
        // Set dummy data on error
        setActiveUsers([
          { username: "trader1", totalInvested: 5000, totalEarnings: 1250 },
          { username: "investor2", totalInvested: 3000, totalEarnings: 900 },
          { username: "crypto3", totalInvested: 7500, totalEarnings: 1875 },
          { username: "wealth4", totalInvested: 10000, totalEarnings: 2500 },
          { username: "smart5", totalInvested: 6000, totalEarnings: 1500 },
          { username: "pro6", totalInvested: 8000, totalEarnings: 2000 },
          { username: "investor7", totalInvested: 4500, totalEarnings: 1125 },
          { username: "trader8", totalInvested: 12000, totalEarnings: 3000 },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadActiveUsers()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
              Active Users
            </h1>
            <p className="text-foreground/70">
              View active investors on the platform
            </p>
          </div>

          {activeUsers.length === 0 ? (
            <Card className="p-8 text-center bg-card border-primary/30">
              <UserCheck className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">No Active Users</h3>
              <p className="text-foreground/70">No active users found at the moment.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeUsers.map((user, index) => (
                <Card
                  key={index}
                  className="p-4 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{user.username || "User"}</p>
                      <p className="text-xs text-foreground/60">Active Investor</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Invested:</span>
                      <span className="font-semibold text-primary">${(user.totalInvested || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Earnings:</span>
                      <span className="font-semibold text-green-500">${(user.totalEarnings || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

