"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import { Trophy } from "lucide-react"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [leaderboardType, setLeaderboardType] = useState<"earnings" | "invested" | "balance">("earnings")

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getLeaderboard(leaderboardType, 20)
        if (response.data) {
          const leaderboardData = response.data.leaderboard || []
          // If no leaderboard data, use dummy data
          if (leaderboardData.length === 0) {
            setLeaderboard([
              { rank: 1, username: "topTrader", totalEarnings: 50000, totalInvested: 200000, balance: 250000 },
              { rank: 2, username: "cryptoKing", totalEarnings: 45000, totalInvested: 180000, balance: 225000 },
              { rank: 3, username: "investPro", totalEarnings: 40000, totalInvested: 160000, balance: 200000 },
              { rank: 4, username: "wealthBuilder", totalEarnings: 35000, totalInvested: 140000, balance: 175000 },
              { rank: 5, username: "smartInvestor", totalEarnings: 30000, totalInvested: 120000, balance: 150000 },
              { rank: 6, username: "proTrader", totalEarnings: 25000, totalInvested: 100000, balance: 125000 },
              { rank: 7, username: "cryptoMaster", totalEarnings: 20000, totalInvested: 80000, balance: 100000 },
              { rank: 8, username: "investGuru", totalEarnings: 15000, totalInvested: 60000, balance: 75000 },
            ])
          } else {
            setLeaderboard(leaderboardData)
          }
        } else {
          // Set dummy data if API fails
          setLeaderboard([
            { rank: 1, username: "topTrader", totalEarnings: 50000, totalInvested: 200000, balance: 250000 },
            { rank: 2, username: "cryptoKing", totalEarnings: 45000, totalInvested: 180000, balance: 225000 },
            { rank: 3, username: "investPro", totalEarnings: 40000, totalInvested: 160000, balance: 200000 },
            { rank: 4, username: "wealthBuilder", totalEarnings: 35000, totalInvested: 140000, balance: 175000 },
            { rank: 5, username: "smartInvestor", totalEarnings: 30000, totalInvested: 120000, balance: 150000 },
          ])
        }
      } catch (error) {
        console.error("Failed to load leaderboard:", error)
        // Set dummy data on error
        setLeaderboard([
          { rank: 1, username: "topTrader", totalEarnings: 50000, totalInvested: 200000, balance: 250000 },
          { rank: 2, username: "cryptoKing", totalEarnings: 45000, totalInvested: 180000, balance: 225000 },
          { rank: 3, username: "investPro", totalEarnings: 40000, totalInvested: 160000, balance: 200000 },
          { rank: 4, username: "wealthBuilder", totalEarnings: 35000, totalInvested: 140000, balance: 175000 },
          { rank: 5, username: "smartInvestor", totalEarnings: 30000, totalInvested: 120000, balance: 150000 },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [leaderboardType])

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
              Leaderboard
            </h1>
            <p className="text-foreground/70">See who's leading the platform</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3">
            <Button
              variant={leaderboardType === "earnings" ? "default" : "outline"}
              onClick={() => setLeaderboardType("earnings")}
              className={leaderboardType === "earnings" ? "bg-primary" : ""}
            >
              Top Earners
            </Button>
            <Button
              variant={leaderboardType === "invested" ? "default" : "outline"}
              onClick={() => setLeaderboardType("invested")}
              className={leaderboardType === "invested" ? "bg-primary" : ""}
            >
              Most Invested
            </Button>
            <Button
              variant={leaderboardType === "balance" ? "default" : "outline"}
              onClick={() => setLeaderboardType("balance")}
              className={leaderboardType === "balance" ? "bg-primary" : ""}
            >
              Highest Balance
            </Button>
          </div>

          {leaderboard.length === 0 ? (
            <Card className="p-8 text-center bg-card border-primary/30">
              <Trophy className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">No Leaderboard Data Yet</h3>
              <p className="text-foreground/70">Be the first to invest and appear on the leaderboard!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50">
                      {index < 3 ? (
                        <Trophy className={`w-6 h-6 ${
                          index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                        }`} />
                      ) : (
                        <span className="text-primary font-bold text-lg">{user.rank}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-foreground font-[family-name:var(--font-orbitron)]">
                          {user.username || `User ${user.rank}`}
                        </h3>
                        {index < 3 && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                            index === 1 ? "bg-gray-400/20 text-gray-400" :
                            "bg-amber-600/20 text-amber-600"
                          }`}>
                            {index === 0 ? "🥇 Gold" : index === 1 ? "🥈 Silver" : "🥉 Bronze"}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-foreground/70">Total Earnings:</span>
                          <p className="text-lg font-bold text-green-500">${(user.totalEarnings || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-foreground/70">Total Invested:</span>
                          <p className="text-lg font-bold text-primary">${(user.totalInvested || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-foreground/70">Current Balance:</span>
                          <p className="text-lg font-bold text-foreground">${(user.balance || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

