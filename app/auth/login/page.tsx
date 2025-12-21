"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff, User, Lock, Wrench, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { walletService } from "@/lib/wallet"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  })
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    setMounted(true)
    // Check if already authenticated
    if (isAuthenticated) {
      router.push("/dashboard")
    }
    // Check for existing wallet connection
    const wallet = walletService.getWallet()
    if (wallet) {
      setWalletAddress(wallet.address)
    }
  }, [isAuthenticated, router])

  const handleConnectWallet = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await walletService.connectWallet()
      if (result.success && result.address) {
        setWalletAddress(result.address)
      } else {
        setError(result.error || "Failed to connect wallet")
      }
    } catch (err) {
      setError("Failed to connect wallet")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await login(formData.username, formData.password)
      if (result.success) {
    router.push("/dashboard")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Circuit board background pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent"></div>
      </div>

      {/* Animated background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 relative z-10">
        {/* Left Panel - Discounts */}
        <Card className="p-8 bg-card border-primary/30 card-glow rounded-2xl">
          <div className="flex flex-col h-full">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4 font-[family-name:var(--font-orbitron)] text-foreground">
              Discounts
            </h2>
            <p className="text-lg text-foreground/70 mb-8 flex-grow">
              Enjoy significant savings on services when you pay with 1C Traders Tokens.
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-glow py-6 text-lg font-semibold rounded-xl"
              size="lg"
              onClick={handleConnectWallet}
              disabled={loading}
            >
              <Wallet className="w-5 h-5 mr-2" />
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
            </Button>
          </div>
        </Card>

        {/* Right Panel - Sign In */}
        <Card className="p-8 bg-card border-primary/30 card-glow rounded-2xl">
          <div className="mb-6">
            <h2 className="text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">
              Sign In
            </h2>
            <p className="text-foreground/70">Enter your credentials</p>
        </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10 bg-input border-primary/30 h-12"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-input border-primary/30 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer text-foreground/70">
                  Remember Me
                </Label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-glow py-6 text-lg font-semibold rounded-xl"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-foreground/70">Don't have an account yet? </span>
            <Link href="/auth/register" className="text-primary hover:underline font-semibold">
              Sign up here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
