"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

export default function StocksPage() {
  const [stocks, setStocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getDummyStocks()
        if (response.data) {
          setStocks(response.data.stocks || [])
        }
      } catch (error) {
        console.error("Failed to load stocks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStocks()
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
              Stock Market
            </h1>
            <p className="text-foreground/70">Browse available stocks and market data</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.length === 0 ? (
              <Card className="p-8 text-center bg-card border-primary/30 col-span-full">
                <p className="text-foreground/70">No stocks available</p>
              </Card>
            ) : (
              stocks.map((stock, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold font-[family-name:var(--font-orbitron)]">
                          {stock.symbol}
                        </h3>
                      </div>
                      <p className="text-sm text-foreground/70">{stock.name}</p>
                    </div>
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Price:</span>
                      <span className="font-bold text-lg">${stock.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Change:</span>
                      <span
                        className={`font-semibold ${
                          stock.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Volume:</span>
                      <span className="text-sm">{stock.volume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Market Cap:</span>
                      <span className="text-sm">${stock.marketCap.toLocaleString()}</span>
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

