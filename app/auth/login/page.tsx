"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Link from "next/link"
import { Eye, EyeOff, Lock, Wrench, Wallet, Mail, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { walletService } from "@/lib/wallet"
import { apiClient } from "@/lib/api-client"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [step, setStep] = useState<"credentials" | "otp">("credentials")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
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

  const handleSendOTP = async (email: string) => {
    if (!email) {
      setError("Email is required")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setSendingOtp(true)
    setError(null)

    try {
      const response = await apiClient.sendLoginOTP(email)
      if (response.error) {
        setError(response.error)
        setSendingOtp(false)
      } else {
        setOtpSent(true)
        setError(null)
        // In development, show OTP if returned
        if (response.data?.otp) {
          setError(`OTP sent! (Dev mode: ${response.data.otp})`)
        }
        setSendingOtp(false)
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
      setSendingOtp(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    if (!formData.email) {
      setError("Email is required")
      return
    }

    setVerifyingOtp(true)
    setError(null)

    try {
      const response = await apiClient.verifyLoginOTP(formData.email, otp)
      if (response.error) {
        setError(response.error)
      } else {
        setOtpVerified(true)
        setError(null)
        // Proceed with login after OTP verification
        await proceedWithLogin()
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const proceedWithLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use email as username (backend accepts both)
      const result = await login(formData.email, formData.password)
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

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate credentials are entered
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    // Move to OTP step and automatically send OTP
    setStep("otp")
    await handleSendOTP(formData.email)
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

          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-input border-primary/30 h-12"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-glow py-6 text-lg font-semibold rounded-xl shadow-lg"
                size="lg"
                disabled={loading || sendingOtp || !formData.email || !formData.password}
              >
                {sendingOtp ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="animate-spin">⏳</span>
                    Sending OTP...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <span className="text-sm text-foreground/70">Credentials</span>
                </div>
                <div className="flex-1 h-px bg-primary/20"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">2</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">OTP Verification</span>
                </div>
              </div>

              {/* OTP Verification Section */}
              {otpSent && !otpVerified && (
                <div className="space-y-4 p-5 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/50 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-bold text-foreground">Enter Verification Code</Label>
                      <p className="text-xs text-foreground/70">Step 2 of 2</p>
                    </div>
                  </div>
                  <div className="bg-card/50 p-3 rounded-lg border border-primary/30">
                    <p className="text-xs text-foreground/70 mb-1">Code sent to:</p>
                    <p className="text-sm font-semibold text-primary">{formData.email}</p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Enter 6-Digit Code</Label>
                    <div className="flex justify-center py-2">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        disabled={verifyingOtp}
                        className="gap-2"
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="w-12 h-14 text-lg font-bold border-2 border-primary/50 data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20" />
                          <InputOTPSlot index={1} className="w-12 h-14 text-lg font-bold border-2 border-primary/50 data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20" />
                          <InputOTPSlot index={2} className="w-12 h-14 text-lg font-bold border-2 border-primary/50 data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20" />
                          <InputOTPSlot index={3} className="w-12 h-14 text-lg font-bold border-2 border-primary/50 data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20" />
                          <InputOTPSlot index={4} className="w-12 h-14 text-lg font-bold border-2 border-primary/50 data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20" />
                          <InputOTPSlot index={5} className="w-12 h-14 text-lg font-bold border-2 border-primary/50 data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-primary/50 hover:bg-primary/10"
                        onClick={() => {
                          setStep("credentials")
                          setOtpSent(false)
                          setOtp("")
                          setError(null)
                        }}
                        disabled={verifyingOtp}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleVerifyOTP}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                        disabled={verifyingOtp || otp.length !== 6}
                        size="lg"
                      >
                        {verifyingOtp ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            Verifying...
                          </span>
                        ) : (
                          "Verify & Sign In"
                        )}
                      </Button>
                    </div>
                    <div className="pt-2 border-t border-primary/20">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendOTP(formData.email)}
                        disabled={sendingOtp}
                        className="w-full text-sm text-primary hover:text-primary/80"
                      >
                        {sendingOtp ? (
                          <span className="flex items-center gap-2 justify-center">
                            <span className="animate-spin">⏳</span>
                            Resending...
                          </span>
                        ) : (
                          "Didn't receive code? Resend OTP"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Show loading state while sending OTP */}
              {!otpSent && sendingOtp && (
                <div className="space-y-4 p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-bold text-foreground">Sending OTP</Label>
                      <p className="text-xs text-foreground/70">Please wait while we send the code...</p>
                    </div>
                  </div>
                  <div className="flex justify-center py-4">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          )}

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
