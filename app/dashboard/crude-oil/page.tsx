"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import { Droplet, TrendingUp, CheckCircle2, Clock } from "lucide-react"

export default function CrudeOilPage() {
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInvestments = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getDummyCrudeOil()
        if (response.data) {
          setInvestments(response.data.investments || [])
        }
      } catch (error) {
        console.error("Failed to load crude oil investments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInvestments()
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
              Crude Oil Investments - Russia
            </h1>
            <p className="text-foreground/70">Explore crude oil investment opportunities in Russian oil fields</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.length === 0 ? (
              <Card className="p-8 text-center bg-card border-primary/30 col-span-full">
                <p className="text-foreground/70">No crude oil investments available</p>
              </Card>
            ) : (
              investments.map((investment, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500/20 rounded-lg">
                        <Droplet className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)]">
                          {investment.location}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {investment.status === "completed" ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-green-500">Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-amber-500" />
                              <span className="text-xs text-amber-500">Active</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Barrel Price:</span>
                      <span className="font-bold">${investment.barrelPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Quantity:</span>
                      <span className="font-semibold">{investment.quantity.toFixed(2)} barrels</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total Value:</span>
                      <span className="font-bold text-primary">
                        ${investment.totalValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">ROI:</span>
                      <span className="font-bold text-green-500 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {investment.roi}%
                      </span>
                    </div>
                    <div className="pt-3 border-t border-primary/20">
                      <div className="text-xs text-foreground/60">
                        Started: {new Date(investment.startDate).toLocaleDateString()}
                      </div>
                      {investment.endDate && (
                        <div className="text-xs text-foreground/60 mt-1">
                          Ended: {new Date(investment.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

