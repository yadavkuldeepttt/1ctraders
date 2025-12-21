"use client"

import { useState, useEffect } from "react"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  TrendingUp,
  Users,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  BarChart3,
  Bitcoin,
  Cpu,
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api-client"

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBalance: user?.balance || 0,
    totalInvested: user?.totalInvested || 0,
    totalEarnings: user?.totalEarnings || 0,
    activeInvestments: 0,
    referrals: 0,
    pendingTasks: 0,
  })


  const [investments] = useState([
    { id: 1, type: "Oil", amount: 2000, roi: 3.5, daily: 70, status: "active", icon: CircleDollarSign },
    { id: 2, type: "Shares", amount: 3000, roi: 4.2, daily: 126, status: "active", icon: BarChart3 },
    { id: 3, type: "Crypto", amount: 2500, roi: 5.8, daily: 145, status: "active", icon: Bitcoin },
    { id: 4, type: "AI Trading", amount: 2500, roi: 7.2, daily: 180, status: "active", icon: Cpu },
  ])

  const [recentActivity] = useState([
    { id: 1, type: "deposit", amount: 500, date: "2025-01-15", status: "completed" },
    { id: 2, type: "roi", amount: 145, date: "2025-01-15", status: "completed" },
    { id: 3, type: "referral", amount: 50, date: "2025-01-14", status: "completed" },
    { id: 4, type: "withdrawal", amount: 200, date: "2025-01-14", status: "pending" },
  ])

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Update stats with user data first
        setStats((prev) => ({
          ...prev,
          totalBalance: user.balance || 0,
          totalInvested: user.totalInvested || 0,
          totalEarnings: user.totalEarnings || 0,
        }))

        // Load user investments
        const investmentsResponse = await apiClient.getUserInvestments()
        if (investmentsResponse.data) {
          const activeInvestments = investmentsResponse.data.investments.filter(
            (inv: any) => inv.status === "active"
          ).length
          setStats((prev) => ({
            ...prev,
            activeInvestments,
          }))
        }

        // Load referral stats
        const referralsResponse = await apiClient.getReferralStats()
        if (referralsResponse.data) {
          setStats((prev) => ({
            ...prev,
            referrals: referralsResponse.data.totalReferrals || 0,
          }))
        }

        // Load tasks
        const tasksResponse = await apiClient.getUserTasks()
        if (tasksResponse.data) {
          const pendingTasks = tasksResponse.data.tasks.filter(
            (task: any) => task.status === "pending" || task.status === "available"
          ).length
          setStats((prev) => ({
            ...prev,
            pendingTasks,
          }))
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()

    gsap.from(".stat-card", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    })

    gsap.from(".investment-item", {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.3,
      ease: "power2.out",
    })
  }, [user])

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-primary-foreground">1C</span>
                </div>
                <div className="absolute inset-0 bg-primary/30 rounded-lg animate-ping"></div>
              </div>
              <p className="text-foreground/70 animate-pulse">Loading dashboard...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
            Welcome back{user?.username ? `, ${user.username}` : ""}!
          </h1>
          <p className="text-foreground/70">Here's your investment overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground/60">Total Balance</span>
            </div>
            <div className="text-3xl font-bold mb-2">${stats.totalBalance.toLocaleString()}</div>
            <div className="flex items-center text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+12.5% this month</span>
            </div>
          </Card>

          <Card className="stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground/60">Total Invested</span>
            </div>
            <div className="text-3xl font-bold mb-2">${stats.totalInvested.toLocaleString()}</div>
            <div className="text-sm text-foreground/60">{stats.activeInvestments} active investments</div>
          </Card>

          <Card className="stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <CircleDollarSign className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground/60">Total Earnings</span>
            </div>
            <div className="text-3xl font-bold mb-2">${stats.totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-foreground/60">
              ROI: {((stats.totalEarnings / stats.totalInvested) * 100).toFixed(1)}%
            </div>
          </Card>

          <Card className="stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground/60">Referrals</span>
            </div>
            <div className="text-3xl font-bold mb-2">{stats.referrals}</div>
            <Link href="/dashboard/referrals" className="text-sm text-primary hover:underline">
              View referral tree
            </Link>
          </Card>

          <Card className="stat-card p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-foreground/60">Pending Tasks</span>
            </div>
            <div className="text-3xl font-bold mb-2">{stats.pendingTasks}</div>
            <Link href="/dashboard/tasks" className="text-sm text-primary hover:underline">
              Complete tasks
            </Link>
          </Card>

          <Card className="stat-card p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 card-glow">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="font-bold mb-2 font-[family-name:var(--font-orbitron)]">Quick Actions</h3>
                <p className="text-sm text-foreground/70 mb-4">Start investing now</p>
              </div>
              <Link href="/dashboard/invest">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  New Investment
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Active Investments */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">Active Investments</h2>
            <Link href="/dashboard/invest">
              <Button variant="outline" className="border-primary/50 bg-transparent">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {investments.map((investment) => {
              const Icon = investment.icon
              return (
                <div
                  key={investment.id}
                  className="investment-item flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{investment.type}</h3>
                      <div className="flex items-center gap-4 text-sm text-foreground/60">
                        <span>Amount: ${investment.amount}</span>
                        <span>•</span>
                        <span>ROI: {investment.roi}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">${investment.daily}/day</div>
                    <div className="text-sm text-foreground/60">Daily return</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-orbitron)]">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "deposit"
                        ? "bg-green-500/20"
                        : activity.type === "withdrawal"
                          ? "bg-red-500/20"
                          : activity.type === "roi"
                            ? "bg-blue-500/20"
                            : "bg-purple-500/20"
                    }`}
                  >
                    {activity.type === "deposit" && <ArrowDownRight className="w-4 h-4 text-green-500" />}
                    {activity.type === "withdrawal" && <ArrowUpRight className="w-4 h-4 text-red-500" />}
                    {activity.type === "roi" && <TrendingUp className="w-4 h-4 text-blue-500" />}
                    {activity.type === "referral" && <Users className="w-4 h-4 text-purple-500" />}
                  </div>
                  <div>
                    <div className="font-medium capitalize">{activity.type}</div>
                    <div className="text-sm text-foreground/60">{activity.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${activity.type === "withdrawal" ? "text-red-500" : "text-green-500"}`}>
                    {activity.type === "withdrawal" ? "-" : "+"}${activity.amount}
                  </div>
                  <div className="text-sm text-foreground/60 capitalize">{activity.status}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
