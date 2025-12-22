"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, TrendingUp, Users, CheckSquare, Wallet, Settings, LogOut, Menu, X, Bell, BarChart3, Gamepad2, Droplet, ArrowUpDown, UserCheck, Trophy } from "lucide-react"
import { useState as useReactState, useEffect as useReactEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { walletService } from "@/lib/wallet"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Investments", href: "/dashboard/invest", icon: TrendingUp },
  { name: "Trades", href: "/dashboard/trades", icon: ArrowUpDown },
  { name: "Stocks", href: "/dashboard/stocks", icon: BarChart3 },
  { name: "Gaming Tokens", href: "/dashboard/gaming-tokens", icon: Gamepad2 },
  { name: "Crude Oil", href: "/dashboard/crude-oil", icon: Droplet },
  { name: "Active Users", href: "/dashboard/active-users", icon: UserCheck },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { name: "Referrals", href: "/dashboard/referrals", icon: Users },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    // Load unread notification count
    const loadUnreadCount = async () => {
      if (isAuthenticated) {
        try {
          const response = await apiClient.getUnreadNotificationCount()
          if (response.data) {
            setUnreadNotificationCount(response.data.count || 0)
          }
        } catch (error) {
          console.error("Failed to load unread notification count:", error)
        }
      }
    }

    loadUnreadCount()
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  useEffect(() => {
    // Check for existing wallet connection
    const wallet = walletService.getWallet()
    if (wallet) {
      setWalletAddress(wallet.address)
    }

    // Listen for wallet account changes
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          localStorage.setItem("walletAddress", accounts[0])
        } else {
          setWalletAddress(null)
          localStorage.removeItem("walletAddress")
        }
      }

      ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const handleConnectWallet = async () => {
    setWalletLoading(true)
    try {
      const result = await walletService.connectWallet()
      if (result.success && result.address) {
        setWalletAddress(result.address)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setWalletLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const userInitials = user
    ? `${user.username?.charAt(0).toUpperCase() || ""}${user.email?.charAt(0).toUpperCase() || ""}`
    : "U"

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r border-primary/30 z-50 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-primary/30">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold font-[family-name:var(--font-orbitron)]">1C</span>
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)] glow-cyan">1C Traders</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scroll">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const showBadge = item.name === "Notifications" && unreadNotificationCount > 0
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors relative",
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-foreground/70 hover:bg-primary/10 hover:text-primary",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {showBadge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-primary/30">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-3 border-primary/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive bg-transparent"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-primary/30">
          <div className="flex items-center justify-between p-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Wallet Connection */}
              {walletAddress ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary hidden sm:inline">
                    {formatAddress(walletAddress)}
                  </span>
                  <span className="text-sm font-medium text-primary sm:hidden">
                    {walletAddress.slice(0, 4)}...{walletAddress.slice(-2)}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={handleConnectWallet}
                  disabled={walletLoading}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {walletLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}

              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </span>
                  )}
                </Button>
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-primary/30">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">{user?.username || "User"}</div>
                  <div className="text-xs text-foreground/60">
                    {user?.balance !== undefined ? `$${user.balance.toLocaleString()}` : "Member"}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center font-bold">
                  {userInitials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
