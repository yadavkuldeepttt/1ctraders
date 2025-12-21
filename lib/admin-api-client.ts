const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface AdminApiResponse<T> {
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
  ): Promise<AdminApiResponse<T>> {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin-traders-token") : null

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
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

  // Admin Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async getProfile() {
    return this.request<any>("/admin/auth/profile", {
      method: "GET",
    })
  }

  // Admin Dashboard endpoints
  async getDashboardStats() {
    return this.request<any>("/admin/stats", {
      method: "GET",
    })
  }

  // User Management endpoints
  async getAllUsers(params?: { status?: string; limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append("status", params.status)
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.offset) queryParams.append("offset", params.offset.toString())

    const query = queryParams.toString()
    return this.request<any>(`/admin/users${query ? `?${query}` : ""}`, {
      method: "GET",
    })
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request<any>(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  // Withdrawal Management endpoints
  async getPendingWithdrawals() {
    return this.request<any>("/admin/withdrawals/pending", {
      method: "GET",
    })
  }

  async approveWithdrawal(transactionId: string) {
    return this.request<any>(`/admin/withdrawals/${transactionId}/approve`, {
      method: "POST",
    })
  }

  // Investment endpoints (for admin view)
  async getAllInvestments() {
    return this.request<any>("/investments", {
      method: "GET",
    })
  }
}

export const adminApiClient = new AdminApiClient(API_BASE_URL)

