const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

class AdminApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin-traders-token") : null

    if (!token) {
      return {
        error: "Admin authentication required. Please login.",
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers as Record<string, string> || {}),
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle unauthorized/forbidden
        if (response.status === 401 || response.status === 403) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("admin-traders-token")
            localStorage.removeItem("admin-user")
            window.location.href = "/admin/login"
          }
          return {
            error: "Admin authentication failed. Please login again.",
          }
        }
        return {
          error: data.error || "An error occurred",
          message: data.message,
        }
      }

      return { data, message: data.message }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  // Admin notification endpoints
  async sendNotification(userId: string, title: string, message: string, type: string = "info") {
    return this.request<{ notification: any; message: string }>("/admin/notifications/send", {
      method: "POST",
      body: JSON.stringify({ userId, title, message, type }),
    })
  }

  async broadcastNotification(title: string, message: string, type: string = "info", userType: string = "all") {
    return this.request<{ success: boolean; count: number; message: string }>("/admin/notifications/broadcast", {
      method: "POST",
      body: JSON.stringify({ title, message, type, userType }),
    })
  }

  async sendMultipleNotifications(userIds: string[], title: string, message: string, type: string = "info") {
    return this.request<{ success: boolean; count: number; message: string }>("/admin/notifications/send-multiple", {
      method: "POST",
      body: JSON.stringify({ userIds, title, message, type }),
    })
  }

  // Admin user endpoints
  async getAllUsers(limit: number = 100, status?: string) {
    const params = new URLSearchParams()
    params.append("limit", limit.toString())
    if (status) {
      params.append("status", status)
    }
    return this.request<{ users: any[] }>(`/admin/users?${params.toString()}`, {
      method: "GET",
    })
  }

  // Admin withdrawal endpoints
  async getPendingWithdrawals() {
    return this.request<{ withdrawals: any[] }>("/admin/withdrawals/pending", {
      method: "GET",
    })
  }

  async approveWithdrawal(transactionId: string) {
    return this.request<{ message: string }>(`/admin/withdrawals/${transactionId}/approve`, {
      method: "POST",
    })
  }

  // Admin dashboard stats
  async getDashboardStats() {
    return this.request<{
      totalUsers: number
      activeUsers: number
      totalInvestments: number
      totalWithdrawals: number
      pendingWithdrawals: number
    }>("/admin/stats", {
      method: "GET",
    })
  }

  // Admin task endpoints
  async getAllTasks() {
    return this.request<{ tasks: any[] }>("/admin/tasks", {
      method: "GET",
    })
  }

  async createTask(taskData: any) {
    return this.request<{ task: any }>("/admin/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  }

  async updateTask(taskId: string, taskData: any) {
    return this.request<{ task: any }>(`/admin/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(taskData),
    })
  }

  async deleteTask(taskId: string) {
    return this.request<{ message: string }>(`/admin/tasks/${taskId}`, {
      method: "DELETE",
    })
  }

  // Admin user status update
  async updateUserStatus(userId: string, status: string) {
    return this.request<{ user: any }>(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }
}

export const adminApiClient = new AdminApiClient(API_BASE_URL)
