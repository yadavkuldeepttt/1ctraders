const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== "undefined" ? localStorage.getItem("traders-token") : null

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

  // Auth endpoints
  async register(userData: {
    username: string
    email: string
    password: string
    referralCode?: string
  }) {
    return this.request<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { username: string; password: string }) {
    return this.request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async getProfile() {
    return this.request<any>("/auth/profile", {
      method: "GET",
    })
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user?: any }>("/auth/verify", {
      method: "GET",
    })
  }

  async updateProfile(profileData: { username?: string; email?: string; phone?: string }) {
    return this.request<any>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    })
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return this.request<any>("/auth/password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
    })
  }

  async updateTwoFactor(twoFactorEnabled: boolean) {
    return this.request<any>("/auth/two-factor", {
      method: "PATCH",
      body: JSON.stringify({ twoFactorEnabled }),
    })
  }

  // Investment endpoints
  async getInvestmentPlans() {
    return this.request<any>("/investments/plans", {
      method: "GET",
    })
  }

  async createInvestment(investmentData: { type: string; amount: number }) {
    return this.request<any>("/investments", {
      method: "POST",
      body: JSON.stringify(investmentData),
    })
  }

  async getUserInvestments() {
    return this.request<any>("/investments", {
      method: "GET",
    })
  }

  // Transaction endpoints
  async createDeposit(depositData: { amount: number; paymentMethod: string; cryptoAddress?: string }) {
    return this.request<any>("/transactions/deposit", {
      method: "POST",
      body: JSON.stringify(depositData),
    })
  }

  async createWithdrawal(withdrawalData: { amount: number; withdrawalAddress: string }) {
    return this.request<any>("/transactions/withdrawal", {
      method: "POST",
      body: JSON.stringify(withdrawalData),
    })
  }

  async getUserTransactions() {
    return this.request<any>("/transactions", {
      method: "GET",
    })
  }

  // Referral endpoints
  async getReferralStats() {
    return this.request<any>("/referrals/stats", {
      method: "GET",
    })
  }

  async getUserReferrals() {
    return this.request<any>("/referrals", {
      method: "GET",
    })
  }

  // Task endpoints
  async getAvailableTasks() {
    return this.request<any>("/tasks/available", {
      method: "GET",
    })
  }

  async getUserTasks() {
    return this.request<any>("/tasks", {
      method: "GET",
    })
  }

  async completeTask(taskId: string) {
    return this.request<any>(`/tasks/${taskId}/complete`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

