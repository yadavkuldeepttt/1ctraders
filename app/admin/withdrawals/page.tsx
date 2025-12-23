"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin-layout"
import { AdminRoute } from "@/components/admin-route"
import { DollarSign, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadWithdrawals = async () => {
      const token = localStorage.getItem("admin-traders-token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      try {
        setLoading(true)
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api"
        const response = await fetch(`${API_BASE_URL}/admin/withdrawals/pending`, {
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
          throw new Error("Failed to load withdrawals")
        }

        const data = await response.json()
        setWithdrawals(data.withdrawals || [])
      } catch (error) {
        console.error("Failed to load withdrawals:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWithdrawals()
  }, [router])

  const handleApprove = async (transactionId: string) => {
    const token = localStorage.getItem("admin-traders-token")
    if (!token) return

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api"
      const response = await fetch(`${API_BASE_URL}/admin/withdrawals/${transactionId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Reload withdrawals
        const withdrawalsResponse = await fetch(`${API_BASE_URL}/admin/withdrawals/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (withdrawalsResponse.ok) {
          const data = await withdrawalsResponse.json()
          setWithdrawals(data.withdrawals || [])
        }
      }
    } catch (error) {
      console.error("Failed to approve withdrawal:", error)
    }
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
              Withdrawal Management
            </h1>
            <p className="text-foreground/70">Review and approve withdrawal requests</p>
          </div>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-foreground/70">Loading withdrawals...</p>
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/70">No pending withdrawals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id || withdrawal._id}
                    className="p-6 bg-background/50 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">
                            {withdrawal.userId?.username || withdrawal.userId?.email || "Unknown User"}
                          </h3>
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm font-medium">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-foreground/60">{withdrawal.userId?.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${withdrawal.amount?.toFixed(2)}</div>
                        <div className="text-sm text-foreground/60">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">Withdrawal Address</p>
                        <p className="font-mono text-sm break-all">{withdrawal.withdrawalAddress || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">Transaction Hash</p>
                        <p className="font-mono text-sm break-all">{withdrawal.txHash || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handleApprove(withdrawal.id || withdrawal._id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}

