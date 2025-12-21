"use client"

import { useState, useEffect } from "react"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, DollarSign, Activity, UserCheck, Settings, BarChart3 } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 5420,
    activeUsers: 4892,
    totalInvestments: 2584300,
    totalPaidOut: 1245600,
    pendingWithdrawals: 45200,
    todaySignups: 87,
  })

  const [recentUsers] = useState([
    { id: 1, username: "user123", email: "user@example.com", status: "active", joined: "2025-01-15" },
    { id: 2, username: "investor456", email: "invest@example.com", status: "active", joined: "2025-01-15" },
    { id: 3, username: "trader789", email: "trade@example.com", status: "pending", joined: "2025-01-14" },
  ])

  useEffect(() => {
    gsap.from(".admin-stat-card", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    })
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
            Admin Dashboard
          </h1>
          <p className="text-foreground/70">Platform overview and management</p>
        </div>

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
            <div className="text-3xl font-bold mb-2">${(stats.totalInvestments / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-green-500">+12.5% this month</div>
          </Card>

          <Card className="admin-stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm text-foreground/60">Total Paid Out</span>
            </div>
            <div className="text-3xl font-bold mb-2">${(stats.totalPaidOut / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-foreground/60">All-time withdrawals</div>
          </Card>

          <Card className="admin-stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-sm text-foreground/60">Pending Withdrawals</span>
            </div>
            <div className="text-3xl font-bold mb-2">${(stats.pendingWithdrawals / 1000).toFixed(1)}K</div>
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
            {recentUsers.map((user) => (
              <div
                key={user.id}
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
                  <div className="text-sm text-foreground/60 mt-1">{user.joined}</div>
                </div>
              </div>
            ))}
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
  )
}
