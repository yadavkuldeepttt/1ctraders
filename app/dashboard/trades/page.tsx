"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function TradesPage() {
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrades = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getDummyTrades(20)
        if (response.data) {
          setTrades(response.data.trades || [])
        }
      } catch (error) {
        console.error("Failed to load trades:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrades()
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
              Trading History
            </h1>
            <p className="text-foreground/70">View your recent trading activity and performance</p>
          </div>

          <div className="grid gap-4">
            {trades.length === 0 ? (
              <Card className="p-8 text-center bg-card border-primary/30">
                <p className="text-foreground/70">No trades available</p>
              </Card>
            ) : (
              trades.map((trade, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          trade.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"
                        }`}
                      >
                        {trade.type === "buy" ? (
                          <ArrowUpRight className={`w-6 h-6 ${trade.type === "buy" ? "text-green-500" : "text-red-500"}`} />
                        ) : (
                          <ArrowDownRight className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)]">
                          {trade.symbol}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          {trade.type === "buy" ? "Buy Order" : "Sell Order"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        {trade.amount} @ ${trade.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-foreground/70">
                        {new Date(trade.timestamp).toLocaleDateString()}
                      </div>
                      {trade.profit !== undefined && (
                        <div
                          className={`text-sm font-semibold mt-1 ${
                            trade.profit >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {trade.profit >= 0 ? "+" : ""}${trade.profit.toFixed(2)}
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

