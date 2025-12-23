"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin-layout"
import { AdminRoute } from "@/components/admin-route"
import { TrendingUp, CheckCircle2, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadInvestments = async () => {
      const token = localStorage.getItem("admin-traders-token")
      if (!token) {
        router.push("/admin/login")
        return
      }

      try {
        setLoading(true)
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api"
        // Note: You'll need to add this endpoint to adminController
        const response = await fetch(`${API_BASE_URL}/investments`, {
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
          throw new Error("Failed to load investments")
        }

        const data = await response.json()
        setInvestments(Array.isArray(data) ? data : data.investments || [])
      } catch (error) {
        console.error("Failed to load investments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInvestments()
  }, [router])

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
              Investment Management
            </h1>
            <p className="text-foreground/70">View all platform investments</p>
          </div>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-foreground/70">Loading investments...</p>
              </div>
            ) : investments.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/70">No investments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/30">
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Package</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">ROI %</th>
                      <th className="text-left p-4">Total Returns</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment) => (
                      <tr
                        key={investment.id || investment._id}
                        className="border-b border-primary/20 hover:bg-primary/5"
                      >
                        <td className="p-4">
                          <div className="font-medium">
                            {investment.userId?.username || investment.userId?.email || "Unknown"}
                          </div>
                        </td>
                        <td className="p-4">{investment.packageName || "N/A"}</td>
                        <td className="p-4">${investment.amount?.toFixed(2) || "0.00"}</td>
                        <td className="p-4">{investment.roiPercentage || 0}%</td>
                        <td className="p-4">${investment.totalReturns?.toFixed(2) || "0.00"}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              investment.status === "active"
                                ? "bg-green-500/20 text-green-500"
                                : investment.status === "completed"
                                  ? "bg-blue-500/20 text-blue-500"
                                  : "bg-gray-500/20 text-gray-500"
                            }`}
                          >
                            {investment.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-foreground/60">
                          {new Date(investment.createdAt).toLocaleDateString()}
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

