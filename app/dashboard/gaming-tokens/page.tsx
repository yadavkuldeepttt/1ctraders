"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import { TrendingUp, TrendingDown, Gamepad2 } from "lucide-react"

export default function GamingTokensPage() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTokens = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getDummyGamingTokens()
        if (response.data) {
          setTokens(response.data.tokens || [])
        }
      } catch (error) {
        console.error("Failed to load gaming tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTokens()
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
              Gaming Tokens
            </h1>
            <p className="text-foreground/70">Explore gaming tokens and blockchain gaming assets</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.length === 0 ? (
              <Card className="p-8 text-center bg-card border-primary/30 col-span-full">
                <p className="text-foreground/70">No gaming tokens available</p>
              </Card>
            ) : (
              tokens.map((token, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Gamepad2 className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold font-[family-name:var(--font-orbitron)]">
                          {token.symbol}
                        </h3>
                      </div>
                      <p className="text-sm text-foreground/70">{token.name}</p>
                      <p className="text-xs text-foreground/60 mt-1">{token.game}</p>
                    </div>
                    {token.change24h >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Price:</span>
                      <span className="font-bold text-lg">${token.price.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">24h Change:</span>
                      <span
                        className={`font-semibold ${
                          token.change24h >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">24h Volume:</span>
                      <span className="text-sm">${token.volume24h.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Market Cap:</span>
                      <span className="text-sm">${token.marketCap.toLocaleString()}</span>
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

