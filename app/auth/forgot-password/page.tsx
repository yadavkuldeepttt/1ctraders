"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email) {
      setError("Email is required")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.forgotPassword(email)
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
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
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
          <h2 className="text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">
            Forgot Password
          </h2>
          <p className="text-foreground/70">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-br from-green-500/20 to-green-500/10 border-2 border-green-500/50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <Label className="text-base font-bold text-foreground">Email Sent!</Label>
                  <p className="text-xs text-foreground/70">Check your inbox</p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 mb-4">
                If an account with that email exists, we've sent you a password reset link. Please check your email inbox and click the link to reset your password.
              </p>
              <p className="text-xs text-foreground/60">
                <strong>Note:</strong> The reset link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
            </div>
            <div className="text-center">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full border-primary/50 hover:bg-primary/10">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 bg-input border-primary/30 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-glow py-6 text-lg font-semibold rounded-xl shadow-lg"
              size="lg"
              disabled={loading || !email}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="animate-spin">⏳</span>
                  Sending Reset Link...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-foreground/70">Remember your password? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

