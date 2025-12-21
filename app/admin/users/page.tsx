"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminLayout } from "@/components/admin-layout"
import { AdminRoute } from "@/components/admin-route"
import { Users, Search, UserCheck, UserX, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    const loadUsers = async () => {
      const token = localStorage.getItem("admin-traders-token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      try {
        setLoading(true)
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        const queryParams = new URLSearchParams()
        if (statusFilter !== "all") {
          queryParams.append("status", statusFilter)
        }
        queryParams.append("limit", "100")

        const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("admin-traders-token")
            localStorage.removeItem("admin-user")
            router.push("/admin/login")
            return
          }
          throw new Error("Failed to load users")
        }

        const data = await response.json()
        setUsers(data.users || [])
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [statusFilter, router])

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    const token = localStorage.getItem("admin-traders-token")
    if (!token) return

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Reload users
        const queryParams = new URLSearchParams()
        if (statusFilter !== "all") {
          queryParams.append("status", statusFilter)
        }
        queryParams.append("limit", "100")

        const usersResponse = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (usersResponse.ok) {
          const data = await usersResponse.json()
          setUsers(data.users || [])
        }
      }
    } catch (error) {
      console.error("Failed to update user status:", error)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
              User Management
            </h1>
            <p className="text-foreground/70">Manage all platform users</p>
          </div>

          {/* Filters */}
          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <Input
                  placeholder="Search users by username or email..."
                  className="pl-10 bg-input border-primary/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter === "all" ? "" : "border-primary/50 bg-transparent"}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  onClick={() => setStatusFilter("active")}
                  className={statusFilter === "active" ? "" : "border-primary/50 bg-transparent"}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "suspended" ? "default" : "outline"}
                  onClick={() => setStatusFilter("suspended")}
                  className={statusFilter === "suspended" ? "" : "border-primary/50 bg-transparent"}
                >
                  Suspended
                </Button>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="p-6 bg-card border-primary/30 card-glow">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-foreground/70">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/70">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/30">
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Balance</th>
                      <th className="text-left p-4">Invested</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Joined</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id || user._id} className="border-b border-primary/20 hover:bg-primary/5">
                        <td className="p-4">
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-foreground/60">{user.referralCode}</div>
                        </td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">${user.balance?.toFixed(2) || "0.00"}</td>
                        <td className="p-4">${user.totalInvested?.toFixed(2) || "0.00"}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              user.status === "active"
                                ? "bg-green-500/20 text-green-500"
                                : user.status === "suspended"
                                  ? "bg-red-500/20 text-red-500"
                                  : "bg-amber-500/20 text-amber-500"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-foreground/60">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {user.status === "active" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                                onClick={() => handleStatusUpdate(user.id || user._id, "suspended")}
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                                onClick={() => handleStatusUpdate(user.id || user._id, "active")}
                              >
                                Activate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}

