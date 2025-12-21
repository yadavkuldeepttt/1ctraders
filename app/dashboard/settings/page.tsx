"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard-layout"
import { User, Mail, Bell, Shield, Smartphone } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    username: "johndoe",
    email: "john@example.com",
    phone: "+1234567890",
  })

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    investmentAlerts: true,
    referralAlerts: true,
    weeklyReports: true,
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: user?.twoFactorEnabled || false,
    loginAlerts: true,
  })

  const handleSaveProfile = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate username
      if (profile.username.length < 3) {
        setError("Username must be at least 3 characters")
        setLoading(false)
        return
      }

      // TODO: Implement API call to update profile
      // For now, just update local state
      await refreshUser()
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = () => {
    console.log("[v0] Notifications updated:", notifications)
    alert("Notification settings updated!")
  }

  const handleSaveSecurity = () => {
    console.log("[v0] Security updated:", security)
    alert("Security settings updated!")
  }

  if (!user) {
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
              <p className="text-foreground/70 animate-pulse">Loading settings...</p>
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
              Settings
            </h1>
            <p className="text-foreground/70">Manage your account settings and preferences</p>
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

        {/* Profile Settings */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">Profile Information</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="bg-input border-primary/30"
                minLength={3}
                maxLength={30}
                disabled={loading}
              />
              {profile.username && profile.username.length < 3 && (
                <p className="text-sm text-foreground/60">
                  Username must be at least 3 characters ({3 - profile.username.length} more required)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bg-input border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="bg-input border-primary/30"
              />
            </div>

            <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">Security</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-foreground/60">Add an extra layer of security</div>
                </div>
              </div>
              <Switch
                checked={security.twoFactorAuth}
                onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Login Alerts</div>
                  <div className="text-sm text-foreground/60">Get notified of new logins</div>
                </div>
              </div>
              <Switch
                checked={security.loginAlerts}
                onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Change Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Current password"
                className="bg-input border-primary/30 mb-2"
              />
              <Input
                id="newPassword"
                type="password"
                placeholder="New password"
                className="bg-input border-primary/30 mb-2"
              />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="bg-input border-primary/30"
              />
            </div>

            <Button onClick={handleSaveSecurity} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Update Security Settings
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-foreground/60">Receive updates via email</div>
                </div>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">SMS Notifications</div>
                  <div className="text-sm text-foreground/60">Receive updates via SMS</div>
                </div>
              </div>
              <Switch
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20">
              <div>
                <div className="font-medium">Investment Alerts</div>
                <div className="text-sm text-foreground/60">ROI updates and investment notifications</div>
              </div>
              <Switch
                checked={notifications.investmentAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, investmentAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20">
              <div>
                <div className="font-medium">Referral Alerts</div>
                <div className="text-sm text-foreground/60">New referral and commission notifications</div>
              </div>
              <Switch
                checked={notifications.referralAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, referralAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20">
              <div>
                <div className="font-medium">Weekly Reports</div>
                <div className="text-sm text-foreground/60">Get weekly performance summaries</div>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
              />
            </div>

            <Button
              onClick={handleSaveNotifications}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Notification Settings
            </Button>
          </div>
        </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
