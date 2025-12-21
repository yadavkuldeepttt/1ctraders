"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api-client"
import { Users, Copy, CheckCircle2, TrendingUp, Award } from "lucide-react"

export default function ReferralsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    thisMonth: 0,
  })
  const [referrals, setReferrals] = useState<any[]>([])
  
  const referralCode = user?.referralCode || "1CT-XXXX"
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : "https://1ctraders.app"}/auth/register?ref=${referralCode}`

  useEffect(() => {
    const loadReferralData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await apiClient.getReferralStats()
        if (response.data) {
          setStats({
            totalReferrals: response.data.totalReferrals || 0,
            activeReferrals: response.data.activeReferrals || 0,
            totalEarnings: response.data.totalEarnings || 0,
            thisMonth: 0, // TODO: Calculate monthly earnings
          })
        }

        const referralsResponse = await apiClient.getUserReferrals()
        if (referralsResponse.data) {
          setReferrals(referralsResponse.data.referrals || [])
        }
      } catch (error) {
        console.error("Failed to load referral data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReferralData()
  }, [user])

  const levels = [
    { level: 1, percentage: 8, referrals: 0, earnings: 0 }, // Direct: 8%
    { level: 2, percentage: 1, referrals: 0, earnings: 0 }, // Level 2: 1%
    { level: 3, percentage: 1, referrals: 0, earnings: 0 }, // Level 3: 1%
    { level: 4, percentage: 1, referrals: 0, earnings: 0 }, // Level 4: 1%
    { level: 5, percentage: 1, referrals: 0, earnings: 0 }, // Level 5: 1%
    { level: 6, percentage: 1, referrals: 0, earnings: 0 }, // Level 6: 1%
    { level: 7, percentage: 1, referrals: 0, earnings: 0 }, // Level 7: 1%
    { level: 8, percentage: 1, referrals: 0, earnings: 0 }, // Level 8: 1%
    { level: 9, percentage: 1, referrals: 0, earnings: 0 }, // Level 9: 1%
    { level: 10, percentage: 1, referrals: 0, earnings: 0 }, // Level 10: 1%
    { level: 11, percentage: 1, referrals: 0, earnings: 0 }, // Level 11: 1%
    { level: 12, percentage: 1, referrals: 0, earnings: 0 }, // Level 12: 1%
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
              <p className="text-foreground/70 animate-pulse">Loading referrals...</p>
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
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
            Referral Program
          </h1>
          <p className="text-foreground/70">Earn from 12 levels of referrals</p>
        </div>

        {/* Referral Link Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 card-glow">
          <h2 className="text-xl font-bold mb-4 font-[family-name:var(--font-orbitron)]">Your Referral Link</h2>
          <div className="flex gap-3">
            <Input value={referralLink} readOnly className="bg-background/50 border-primary/30" />
            <Button onClick={copyToClipboard} className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-foreground/70 mt-3">
            Share this link with friends and earn commission from their investments up to 12 levels deep!
          </p>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalReferrals}</div>
            <div className="text-sm text-foreground/60">Total Referrals</div>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.activeReferrals}</div>
            <div className="text-sm text-foreground/60">Active Referrals</div>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">${stats.totalEarnings}</div>
            <div className="text-sm text-foreground/60">Total Earnings</div>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Award className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">${stats.thisMonth}</div>
            <div className="text-sm text-foreground/60">This Month</div>
          </Card>
        </div>

        {/* Commission Levels */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-orbitron)]">Commission Structure</h2>
          <div className="space-y-3">
            {levels.map((level) => (
              <div
                key={level.level}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-primary">L{level.level}</span>
                  </div>
                  <div>
                    <div className="font-bold">Level {level.level}</div>
                    <div className="text-sm text-foreground/60">{level.percentage}% commission</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{level.referrals} referrals</div>
                  <div className="text-sm text-primary">${level.earnings} earned</div>
                </div>
              </div>
            ))}
            <div className="text-center py-4 text-foreground/60">
              <p className="text-sm">Total commission capped at 20% • Earn from all 12 levels</p>
            </div>
          </div>
        </Card>

        {/* Recent Referrals */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-orbitron)]">Recent Referrals</h2>
          <div className="space-y-3">
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-foreground/70">
                <p>No referrals yet. Start sharing your referral link!</p>
              </div>
            ) : (
              referrals.slice(0, 10).map((referral: any) => (
                <div
                  key={referral._id || referral.id}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center font-bold">
                      {referral.referredUserId?.username?.substring(0, 2).toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-bold">{referral.referredUserId?.username || "User"}</div>
                      <div className="text-sm text-foreground/60">
                        Level {referral.level} • {referral.createdAt ? new Date(referral.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">${referral.totalEarnings || 0}</div>
                    <div className="text-sm text-green-500 capitalize">{referral.status || "active"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* How it Works */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-orbitron)]">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-bold mb-2">Share Your Link</h3>
              <p className="text-sm text-foreground/70">
                Copy your unique referral link and share it with friends, family, or on social media.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-bold mb-2">They Invest</h3>
              <p className="text-sm text-foreground/70">
                When someone signs up using your link and makes an investment, they become your referral.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-bold mb-2">Earn Commission</h3>
              <p className="text-sm text-foreground/70">
                Earn up to 10% commission from direct referrals and bonuses from 12 levels deep.
              </p>
            </div>
          </div>
        </Card>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
