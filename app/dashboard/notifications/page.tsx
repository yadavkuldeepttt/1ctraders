"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, Trash2, CheckCheck } from "lucide-react"
import { toast } from "sonner"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getNotifications()
      if (response.data) {
        setNotifications(response.data.notifications || [])
      }
    } catch (error) {
      console.error("Failed to load notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await apiClient.getUnreadNotificationCount()
      if (response.data) {
        setUnreadCount(response.data.count || 0)
      }
    } catch (error) {
      console.error("Failed to load unread count:", error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await apiClient.markNotificationAsRead(notificationId)
      if (response.data) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
        toast.success("Notification marked as read")
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await apiClient.markAllNotificationsAsRead()
      if (response.data) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
        toast.success("All notifications marked as read")
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error)
      toast.error("Failed to mark all as read")
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await apiClient.deleteNotification(notificationId)
      if (response.data?.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
        toast.success("Notification deleted")
      }
    } catch (error) {
      console.error("Failed to delete notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
      case "task":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "investment":
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-primary" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
      case "task":
        return "border-green-500/30 bg-green-500/10"
      case "warning":
        return "border-amber-500/30 bg-amber-500/10"
      case "error":
        return "border-red-500/30 bg-red-500/10"
      case "investment":
        return "border-blue-500/30 bg-blue-500/10"
      default:
        return "border-primary/30 bg-primary/10"
    }
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
                Notifications
              </h1>
              <p className="text-foreground/70">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All as Read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Card className="p-12 text-center bg-card border-primary/30">
              <Bell className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">No Notifications</h3>
              <p className="text-foreground/70">You're all caught up! No notifications at the moment.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-6 bg-card border-primary/30 card-glow transition-all ${
                    !notification.isRead ? "border-primary/60 bg-primary/5" : ""
                  } ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)] mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-foreground/80">{notification.message}</p>
                        </div>
                        {!notification.isRead && (
                          <span className="ml-4 w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-foreground/60">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-8"
                            >
                              Mark as Read
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(notification.id)}
                            className="h-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

