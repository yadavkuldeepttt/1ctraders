"use client"

import { useState, useEffect } from "react"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, DollarSign, Activity, UserCheck, Settings, BarChart3, Shield } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { AdminRoute } from "@/components/admin-route"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalInvestments: 0,
    totalPaidOut: 0,
    pendingWithdrawals: 0,
    todaySignups: 0,
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem("admin-traders-token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      try {
        setLoading(true)
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        
        // Fetch stats
        const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!statsResponse.ok) {
          if (statsResponse.status === 401 || statsResponse.status === 403) {
            localStorage.removeItem("admin-traders-token")
            localStorage.removeItem("admin-user")
            router.push("/admin/login")
            return
          }
          throw new Error("Failed to load stats")
        }

        const statsData = await statsResponse.json()
        
        // Calculate today's signups
        const usersResponse = await fetch(`${API_BASE_URL}/admin/users?limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        let todaySignups = 0
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          todaySignups = usersData.users.filter((user: any) => {
            const userDate = new Date(user.createdAt)
            userDate.setHours(0, 0, 0, 0)
            return userDate.getTime() === today.getTime()
          }).length
          
          // Get recent users
          setRecentUsers(usersData.users.slice(0, 5))
        }

        setStats({
          totalUsers: statsData.totalUsers || 0,
          activeUsers: statsData.activeUsers || 0,
          totalInvestments: statsData.totalInvestments || 0,
          totalPaidOut: statsData.totalPaidOut || 0,
          pendingWithdrawals: statsData.pendingWithdrawals || 0,
          todaySignups,
        })
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router])

  useEffect(() => {
    gsap.from(".admin-stat-card", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    })
  }, [])

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 bg-primary/30 rounded-lg animate-ping"></div>
              </div>
              <p className="text-foreground/70 animate-pulse">Loading dashboard...</p>
            </div>
          </div>
        </AdminLayout>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
      <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
            Admin Dashboard
          </h1>
          <p className="text-foreground/70">Platform overview and management</p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="admin-stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground/60">Total Users</span>
            </div>
            <div className="text-3xl font-bold mb-2">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-green-500">+{stats.todaySignups} today</div>
          </Card>

          <Card className="admin-stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm text-foreground/60">Active Users</span>
            </div>
            <div className="text-3xl font-bold mb-2">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-foreground/60">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% active rate
            </div>
          </Card>

          <Card className="admin-stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground/60">Total Investments</span>
            </div>
            <div className="text-3xl font-bold mb-2">${(stats.totalInvestments / 1000).toFixed(1)}K</div>
            <div className="text-sm text-foreground/60">Total invested</div>
          </Card>

          <Card className="admin-stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm text-foreground/60">Total Paid Out</span>
            </div>
            <div className="text-3xl font-bold mb-2">${(stats.totalPaidOut / 1000).toFixed(1)}K</div>
            <div className="text-sm text-foreground/60">All-time withdrawals</div>
          </Card>

          <Card className="admin-stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-sm text-foreground/60">Pending Withdrawals</span>
            </div>
            <div className="text-3xl font-bold mb-2">${stats.pendingWithdrawals.toFixed(2)}</div>
            <div className="text-sm text-foreground/60">Requires approval</div>
          </Card>

          <Card className="admin-stat-card p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 card-glow">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="font-bold mb-2 font-[family-name:var(--font-orbitron)]">Quick Actions</h3>
                <p className="text-sm text-foreground/70 mb-4">Manage platform</p>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">View Reports</Button>
            </div>
          </Card>
        </div>

        {/* Recent Users */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">Recent Users</h2>
            <Button variant="outline" className="border-primary/50 bg-transparent">
              View All Users
            </Button>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-center text-foreground/70 py-8">No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id || user._id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center font-bold">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold">{user.username}</div>
                    <div className="text-sm text-foreground/60">{user.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === "active" ? "bg-green-500/20 text-green-500" : "bg-amber-500/20 text-amber-500"
                    }`}
                  >
                    {user.status}
                  </div>
                  <div className="text-sm text-foreground/60 mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-primary/30 card-glow">
            <BarChart3 className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">Investment Analytics</h3>
            <p className="text-foreground/70 mb-4">View detailed investment trends and performance</p>
            <Button variant="outline" className="w-full border-primary/50 bg-transparent">
              View Analytics
            </Button>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            <Users className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">User Management</h3>
            <p className="text-foreground/70 mb-4">Manage users, verify accounts, handle support</p>
            <Button variant="outline" className="w-full border-primary/50 bg-transparent">
              Manage Users
            </Button>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            <Settings className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">Platform Settings</h3>
            <p className="text-foreground/70 mb-4">Configure platform parameters and features</p>
            <Button variant="outline" className="w-full border-primary/50 bg-transparent">
              Open Settings
            </Button>
          </Card>
        </div>
      </div>
      </AdminLayout>
    </AdminRoute>
  )
}
