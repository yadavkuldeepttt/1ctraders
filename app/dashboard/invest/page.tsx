"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleDollarSign, BarChart3, Bitcoin, Cpu, TrendingUp, Shield, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api-client"
import { useRouter } from "next/navigation"

export default function InvestPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [amount, setAmount] = useState("")
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user, refreshUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const plans = [
    {
      id: 1,
      name: "Oil Investment",
      icon: CircleDollarSign,
      roiMin: 1.5, // 1.5% daily per $100
      roiMax: 2.5, // 2.5% daily per $100
      minInvest: 100,
      maxInvest: 5000,
      duration: "365 days",
      color: "from-amber-500/20 to-orange-500/20",
      features: ["Daily ROI: 1.5-2.5%", "ROI Limit: 300%", "Commission Limit: 400%", "Stable returns"],
    },
    {
      id: 2,
      name: "Shares Trading",
      icon: BarChart3,
      roiMin: 1.5, // 1.5% daily per $100
      roiMax: 2.5, // 2.5% daily per $100
      minInvest: 100,
      maxInvest: 10000,
      duration: "365 days",
      color: "from-blue-500/20 to-cyan-500/20",
      features: ["Daily ROI: 1.5-2.5%", "ROI Limit: 300%", "Commission Limit: 400%", "Market-based"],
    },
    {
      id: 3,
      name: "Crypto Trading",
      icon: Bitcoin,
      roiMin: 1.5, // 1.5% daily per $100
      roiMax: 2.5, // 2.5% daily per $100
      minInvest: 100,
      maxInvest: 25000,
      duration: "365 days",
      color: "from-purple-500/20 to-pink-500/20",
      features: ["Daily ROI: 1.5-2.5%", "ROI Limit: 300%", "Commission Limit: 400%", "High returns"],
    },
    {
      id: 4,
      name: "AI Trading Bot",
      icon: Cpu,
      roiMin: 1.5, // 1.5% daily per $100
      roiMax: 2.5, // 2.5% daily per $100
      minInvest: 100,
      maxInvest: 50000,
      duration: "365 days",
      color: "from-green-500/20 to-emerald-500/20",
      features: ["Daily ROI: 1.5-2.5%", "ROI Limit: 300%", "Commission Limit: 400%", "AI-powered"],
    },
  ]

  const handleInvest = async () => {
    if (!selectedPlan) {
      setError("Please select an investment plan")
      return
    }

    const investmentAmount = parseFloat(amount)
    const plan = plans.find((p) => p.id === selectedPlan)

    if (!plan) {
      setError("Invalid investment plan")
      return
    }

    if (isNaN(investmentAmount) || investmentAmount < plan.minInvest) {
      setError(`Minimum investment is $${plan.minInvest}`)
      return
    }

    if (investmentAmount > plan.maxInvest) {
      setError(`Maximum investment is $${plan.maxInvest}`)
      return
    }

    if (user && investmentAmount > user.balance) {
      setError("Insufficient balance")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await apiClient.createInvestment({
        type: plan.name,
        amount: investmentAmount,
      })

      if (response.error) {
        setError(response.error)
      } else {
        setSuccess(`Successfully invested $${investmentAmount} in ${plan.name}`)
        setAmount("")
        setSelectedPlan(null)
        await refreshUser()
        // Refresh page after 2 seconds
        setTimeout(() => {
          router.refresh()
        }, 2000)
      }
    } catch (err) {
      setError("Failed to create investment")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || loading) {
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
              <p className="text-foreground/70 animate-pulse">Loading investment plans...</p>
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
            Investment Plans
          </h1>
          <p className="text-foreground/70">Choose your investment strategy and start earning</p>
        </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500">
              {success}
            </div>
          )}

        {/* Investment Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id
            return (
              <Card
                key={plan.id}
                className={`p-6 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all duration-300 cursor-pointer relative overflow-hidden rounded-2xl ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-50 rounded-2xl`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    {isSelected && (
                      <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                        Selected
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">{plan.name}</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Daily ROI:</span>
                      <span className="text-primary font-bold text-lg">
                        {plan.roiMin}% - {plan.roiMax}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Min Investment:</span>
                      <span className="font-bold text-foreground">${plan.minInvest}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Max Investment:</span>
                      <span className="font-bold text-foreground">${plan.maxInvest.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/70">Duration:</span>
                      <span className="font-bold text-foreground">{plan.duration}</span>
                    </div>
                  </div>

                  <div className="border-t border-primary/30 pt-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-foreground/80">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Investment Form */}
        {selectedPlan && (
          <Card className="p-6 bg-card border-primary/30 card-glow rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-orbitron)]">
              Complete Your Investment
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    className="bg-input border-primary/30"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={plans.find((p) => p.id === selectedPlan)?.minInvest}
                    max={plans.find((p) => p.id === selectedPlan)?.maxInvest}
                  />
                  <p className="text-sm text-foreground/60">
                    Min: ${plans.find((p) => p.id === selectedPlan)?.minInvest} - Max: $
                    {plans.find((p) => p.id === selectedPlan)?.maxInvest.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-primary/50 bg-transparent">
                      Wallet Balance
                    </Button>
                    <Button variant="outline" className="border-primary/50 bg-transparent">
                      Crypto
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-glow"
                  size="lg"
                  onClick={handleInvest}
                  disabled={
                    loading ||
                    !amount ||
                    Number.parseFloat(amount) < (plans.find((p) => p.id === selectedPlan)?.minInvest || 0)
                  }
                >
                  {loading ? "Processing..." : "Invest Now"}
                </Button>
              </div>

              <div className="space-y-4">
                <Card className="p-4 bg-background/50 border-primary/20">
                  <h3 className="font-bold mb-3 font-[family-name:var(--font-orbitron)]">Investment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Plan:</span>
                      <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Amount:</span>
                      <span className="font-medium">${amount || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Estimated Daily ROI:</span>
                      <span className="font-medium text-primary">
                        $
                        {amount
                          ? (
                              (Number.parseFloat(amount) * (plans.find((p) => p.id === selectedPlan)?.roiMin || 0)) /
                              100
                            ).toFixed(2)
                          : "0"}{" "}
                        - $
                        {amount
                          ? (
                              (Number.parseFloat(amount) * (plans.find((p) => p.id === selectedPlan)?.roiMax || 0)) /
                              100
                            ).toFixed(2)
                          : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Max ROI (300%):</span>
                      <span className="font-medium text-primary">
                        ${amount ? (Number.parseFloat(amount) * 3).toFixed(2) : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Max Total (400%):</span>
                      <span className="font-medium text-primary">
                        ${amount ? (Number.parseFloat(amount) * 4).toFixed(2) : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Duration:</span>
                      <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.duration}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-background/50 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground/70">
                      <p className="font-medium text-foreground mb-1">Secure Investment</p>
                      <p>
                        Your investment is protected with bank-grade security. Returns are calculated and distributed
                        daily.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-background/50 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground/70">
                      <p className="font-medium text-foreground mb-1">Instant Activation</p>
                      <p>Your investment will be activated immediately and start earning from tomorrow.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        )}

        {/* Why Invest Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-primary/30 card-glow rounded-2xl">
            <TrendingUp className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">Guaranteed Returns</h3>
            <p className="text-foreground/70">Earn consistent daily ROI on all your investments</p>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow rounded-2xl">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">Secure Platform</h3>
            <p className="text-foreground/70">Your investments are protected with advanced security</p>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow rounded-2xl">
            <Clock className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">Fast Withdrawals</h3>
            <p className="text-foreground/70">Withdraw your earnings anytime with instant processing</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}
