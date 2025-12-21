"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff, User, Mail, Lock, Users, Gift, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { walletService } from "@/lib/wallet"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    agreeTerms: false,
  })
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()

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

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Username validation
    if (!formData.username) {
      errors.username = "Username is required"
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    } else if (formData.username.length > 30) {
      errors.username = "Username must be less than 30 characters"
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    // Terms validation
    if (!formData.agreeTerms) {
      errors.terms = "Please agree to the Terms of Service and Privacy Policy"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        referralCode: formData.referralCode || undefined,
      })

      if (result.success) {
    router.push("/dashboard")
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (err) {
      setError("An error occurred during registration")
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
        {/* Left Panel - Benefits */}
        <Card className="p-8 bg-card border-primary/30 card-glow rounded-2xl">
          <div className="flex flex-col h-full">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4 font-[family-name:var(--font-orbitron)] text-foreground">
              Get Started
            </h2>
            <p className="text-lg text-foreground/70 mb-6">
              Join 1C Traders and start earning daily returns on your investments.
            </p>
            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Daily ROI Returns</p>
                  <p className="text-sm text-foreground/60">Earn 1.5-2.5% daily on investments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">12-Level Referrals</p>
                  <p className="text-sm text-foreground/60">Earn up to 20% commission</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Crypto Payments</p>
                  <p className="text-sm text-foreground/60">Secure and instant transactions</p>
                </div>
              </div>
            </div>
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

        {/* Right Panel - Register */}
        <Card className="p-8 bg-card border-primary/30 card-glow rounded-2xl">
          <div className="mb-6">
            <h2 className="text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">
              Create Account
            </h2>
            <p className="text-foreground/70">Sign up to start investing</p>
        </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="username"
                  placeholder="Choose a username (min 3 characters)"
                  className={`pl-10 bg-input border-primary/30 h-12 ${
                    validationErrors.username ? "border-destructive" : ""
                  }`}
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value })
                    if (validationErrors.username) {
                      setValidationErrors({ ...validationErrors, username: "" })
                    }
                  }}
                  required
                  minLength={3}
                  maxLength={30}
                />
              </div>
              {validationErrors.username && (
                <p className="text-sm text-destructive">{validationErrors.username}</p>
              )}
              {formData.username && formData.username.length < 3 && (
                <p className="text-sm text-foreground/60">
                  {3 - formData.username.length} more character(s) required
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`pl-10 bg-input border-primary/30 h-12 ${
                    validationErrors.email ? "border-destructive" : ""
                  }`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (validationErrors.email) {
                      setValidationErrors({ ...validationErrors, email: "" })
                    }
                  }}
                  required
                />
              </div>
              {validationErrors.email && (
                <p className="text-sm text-destructive">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min 6 characters)"
                  className={`pl-10 pr-10 bg-input border-primary/30 h-12 ${
                    validationErrors.password ? "border-destructive" : ""
                  }`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: "" })
                    }
                  }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-destructive">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`pl-10 pr-10 bg-input border-primary/30 h-12 ${
                    validationErrors.confirmPassword ? "border-destructive" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value })
                    if (validationErrors.confirmPassword) {
                      setValidationErrors({ ...validationErrors, confirmPassword: "" })
                    }
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
              )}
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-foreground">Referral Code (Optional)</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="referralCode"
                  placeholder="Enter referral code"
                  className="pl-10 bg-input border-primary/30 h-12"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, agreeTerms: checked as boolean })
                  if (validationErrors.terms) {
                    setValidationErrors({ ...validationErrors, terms: "" })
                  }
                }}
                required
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer leading-tight text-foreground/70">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {validationErrors.terms && (
              <p className="text-sm text-destructive">{validationErrors.terms}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-glow py-6 text-lg font-semibold rounded-xl"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-foreground/70">Already have an account? </span>
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
