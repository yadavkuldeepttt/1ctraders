"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    const emailParam = searchParams.get("email")

    if (!tokenParam || !emailParam) {
      setError("Invalid reset link. Missing token or email.")
      setVerifying(false)
      return
    }

    setToken(tokenParam)
    setEmail(emailParam)

    // Verify token
    const verifyToken = async () => {
      try {
        const response = await apiClient.verifyResetToken(tokenParam, emailParam)
        if (response.error) {
          setError(response.error)
          setTokenValid(false)
        } else {
          setTokenValid(true)
        }
      } catch (err) {
        setError("Failed to verify reset token. The link may be invalid or expired.")
        setTokenValid(false)
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password || !confirmPassword) {
      setError("Please enter both password fields")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.resetPassword(token, email, password)
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <Card className="w-full max-w-md p-8 bg-card border-primary/30 rounded-2xl">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground/70">Verifying reset link...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
        <Card className="w-full max-w-md p-8 bg-card border-destructive/30 rounded-2xl">
          <div className="text-center space-y-4">
            <div className="p-3 bg-destructive/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Invalid Reset Link</h2>
            <p className="text-foreground/70">
              {error || "This password reset link is invalid or has expired. Please request a new one."}
            </p>
            <div className="pt-4 space-y-2">
              <Link href="/auth/forgot-password">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Request New Reset Link
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full border-primary/50 hover:bg-primary/10">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
        <Card className="w-full max-w-md p-8 bg-card border-green-500/30 rounded-2xl">
          <div className="text-center space-y-4">
            <div className="p-3 bg-green-500/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Password Reset Successful!</h2>
            <p className="text-foreground/70">
              Your password has been reset successfully. You will be redirected to the login page shortly.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                Go to Login
              </Button>
            </Link>
          </div>
        </Card>
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

      <Card className="w-full max-w-md p-8 bg-card border-primary/30 card-glow rounded-2xl relative z-10">
        <div className="mb-6">
          <h2 className="text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">
            Reset Password
          </h2>
          <p className="text-foreground/70">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pl-10 pr-10 bg-input border-primary/30 h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
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
            <p className="text-xs text-foreground/60">Password must be at least 6 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="pl-10 pr-10 bg-input border-primary/30 h-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-glow py-6 text-lg font-semibold rounded-xl shadow-lg"
            size="lg"
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="animate-spin">⏳</span>
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>

          <div className="text-center text-sm">
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              Back to Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <Card className="w-full max-w-md p-8 bg-card border-primary/30 rounded-2xl">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading...</p>
          </div>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

