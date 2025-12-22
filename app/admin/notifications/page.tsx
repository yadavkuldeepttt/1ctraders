"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin-layout"
import { adminApiClient } from "@/lib/admin-api-client"
import { Bell, Send, Users, User, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [notificationType, setNotificationType] = useState<"single" | "broadcast" | "multiple">("single")
  const [formData, setFormData] = useState({
    userId: "",
    selectedUserIds: [] as string[],
    title: "",
    message: "",
    type: "info",
    userType: "all",
  })

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true)
        const response = await adminApiClient.getAllUsers(1000)
        if (response.data) {
          setUsers(response.data.users || [])
        } else if (response.error) {
          console.error("Failed to load users:", response.error)
        }
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (notificationType === "single") {
        if (!formData.userId || !formData.title || !formData.message) {
          toast.error("Please fill in all required fields")
          setLoading(false)
          return
        }

        const response = await adminApiClient.sendNotification(
          formData.userId,
          formData.title,
          formData.message,
          formData.type
        )

        if (response.data) {
          toast.success(response.data.message || "Notification sent successfully")
          setFormData({ userId: "", selectedUserIds: [], title: "", message: "", type: "info", userType: "all" })
        } else if (response.error) {
          toast.error(response.error)
        }
      } else if (notificationType === "broadcast") {
        if (!formData.title || !formData.message) {
          toast.error("Please fill in title and message")
          setLoading(false)
          return
        }

        const response = await adminApiClient.broadcastNotification(
          formData.title,
          formData.message,
          formData.type,
          formData.userType
        )

        if (response.data) {
          toast.success(response.data.message || "Notification broadcasted successfully")
          setFormData({ userId: "", selectedUserIds: [], title: "", message: "", type: "info", userType: "all" })
        } else if (response.error) {
          toast.error(response.error)
        }
      } else if (notificationType === "multiple") {
        if (formData.selectedUserIds.length === 0 || !formData.title || !formData.message) {
          toast.error("Please select at least one user and fill in all required fields")
          setLoading(false)
          return
        }

        const response = await adminApiClient.sendMultipleNotifications(
          formData.selectedUserIds,
          formData.title,
          formData.message,
          formData.type
        )

        if (response.data) {
          toast.success(response.data.message || "Notifications sent successfully")
          setFormData({ userId: "", selectedUserIds: [], title: "", message: "", type: "info", userType: "all" })
        } else if (response.error) {
          toast.error(response.error)
        }
      }
    } catch (error: any) {
      console.error("Failed to send notification:", error)
      toast.error(error.message || "Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
            Send Notifications
          </h1>
          <p className="text-foreground/70">Send notifications to users or broadcast to all users</p>
        </div>

        <Card className="p-6 bg-card border-primary/30">
          <div className="mb-6">
            <Label className="text-lg font-semibold mb-4 block">Notification Type</Label>
            <div className="flex gap-4">
              <Button
                variant={notificationType === "single" ? "default" : "outline"}
                onClick={() => setNotificationType("single")}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Single User
              </Button>
              <Button
                variant={notificationType === "broadcast" ? "default" : "outline"}
                onClick={() => setNotificationType("broadcast")}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Broadcast (All Users)
              </Button>
              <Button
                variant={notificationType === "multiple" ? "default" : "outline"}
                onClick={() => setNotificationType("multiple")}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Multiple Users
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {notificationType === "single" && (
              <div>
                <Label htmlFor="userId">Select User *</Label>
                {loadingUsers ? (
                  <div className="text-sm text-foreground/60">Loading users...</div>
                ) : (
                  <Select
                    value={formData.userId}
                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username} ({user.email}) - {user.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {notificationType === "multiple" && (
              <div>
                <Label>Select Users *</Label>
                {loadingUsers ? (
                  <div className="text-sm text-foreground/60">Loading users...</div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto border border-primary/30 rounded-lg p-3">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={formData.selectedUserIds.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedUserIds: [...formData.selectedUserIds, user.id],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                selectedUserIds: formData.selectedUserIds.filter((id) => id !== user.id),
                              })
                            }
                          }}
                          className="w-4 h-4 text-primary border-primary/30 rounded"
                        />
                        <label
                          htmlFor={`user-${user.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {user.username} ({user.email}) - {user.status}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {formData.selectedUserIds.length > 0 && (
                  <p className="text-sm text-primary mt-2">
                    {formData.selectedUserIds.length} user(s) selected
                  </p>
                )}
              </div>
            )}

            {notificationType === "broadcast" && (
              <div>
                <Label htmlFor="userType">User Type</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => setFormData({ ...formData, userType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="investors">Investors Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notification title"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notification message"
                rows={5}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Notification Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </Card>

        <Card className="p-6 bg-card border-primary/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Notification Guidelines</h3>
              <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
                <li>Single User: Send to a specific user by their user ID</li>
                <li>Broadcast: Send to all users or all investors</li>
                <li>Multiple Users: Send to specific users by providing comma-separated user IDs</li>
                <li>Notifications are automatically created for task completions and investments</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

