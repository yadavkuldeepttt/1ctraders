const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api"

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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
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

  async forgotPassword(email: string) {
    return this.request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async verifyResetToken(token: string, email: string) {
    const queryParams = new URLSearchParams({
      token: token,
      email: email,
    })
    return this.request<{ message: string; valid: boolean }>(`/auth/verify-reset-token?${queryParams.toString()}`, {
      method: "GET",
    })
  }

  async resetPassword(token: string, email: string, newPassword: string) {
    return this.request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, email, newPassword }),
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
  async createDeposit(depositData: { amountUSD: number; coin: string }) {
    return this.request<{
      message: string
      transaction: any
      payment: {
        paymentId: string
        payAddress: string
        payAmount: string
        coin: string
        amountUSD: number
        status: string
      }
    }>("/transactions/deposit/create", {
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

  // OTP endpoints (authenticated)
  async sendOTP() {
    return this.request<{ message: string; otp?: string }>("/otp/send", {
      method: "POST",
    })
  }

  async verifyOTP(otp: string) {
    return this.request<{ message: string; verified: boolean }>("/otp/verify", {
      method: "POST",
      body: JSON.stringify({ otp }),
    })
  }

  // Public OTP endpoints (for registration)
  async sendVerificationOTP(email: string) {
    return this.request<{ message: string; otp?: string }>("/otp/send-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async verifyVerificationOTP(email: string, otp: string) {
    return this.request<{ message: string; verified: boolean }>("/otp/verify-verification", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    })
  }

  // Public OTP endpoints (for login)
  async sendLoginOTP(email: string) {
    return this.request<{ message: string; otp?: string }>("/otp/send-login", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async verifyLoginOTP(email: string, otp: string) {
    return this.request<{ message: string; verified: boolean }>("/otp/verify-login", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    })
  }

  // Payment endpoints
  async createCryptoPayment(data: { amount: number; coin: string; otp: string; orderId?: string }) {
    return this.request<any>("/payments/crypto", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getPaymentStatus(paymentId: string) {
    return this.request<any>(`/payments/${paymentId}/status`, {
      method: "GET",
    })
  }

  // Public endpoints (no authentication required)
  async getActiveUsers() {
    return this.request<{ activeUsers: any[]; totalActive: number }>("/public/active-users", {
      method: "GET",
    })
  }

  async getLeaderboard(type: "earnings" | "invested" | "balance" = "earnings", limit: number = 10) {
    return this.request<{ leaderboard: any[]; type: string }>(`/public/leaderboard?type=${type}&limit=${limit}`, {
      method: "GET",
    })
  }

  // Dummy data endpoints
  async getDummyTrades(limit: number = 20) {
    return this.request<{ trades: any[] }>(`/dummy/trades?limit=${limit}`, {
      method: "GET",
    })
  }

  async getDummyStocks() {
    return this.request<{ stocks: any[] }>("/dummy/stocks", {
      method: "GET",
    })
  }

  async getDummyGamingTokens() {
    return this.request<{ tokens: any[] }>("/dummy/gaming-tokens", {
      method: "GET",
    })
  }

  async getDummyCrudeOil() {
    return this.request<{ investments: any[] }>("/dummy/crude-oil", {
      method: "GET",
    })
  }

  async getAllDummyData() {
    return this.request<{ trades: any[]; stocks: any[]; tokens: any[]; investments: any[] }>("/dummy/all", {
      method: "GET",
    })
  }

  // Notification endpoints
  async getNotifications(limit: number = 50, unreadOnly: boolean = false) {
    return this.request<{ notifications: any[] }>(`/notifications?limit=${limit}&unreadOnly=${unreadOnly}`, {
      method: "GET",
    })
  }

  async getUnreadNotificationCount() {
    return this.request<{ count: number }>("/notifications/unread-count", {
      method: "GET",
    })
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request<{ notification: any }>(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    })
  }

  async markAllNotificationsAsRead() {
    return this.request<{ success: boolean; updated: number }>("/notifications/read-all", {
      method: "PATCH",
    })
  }

  async deleteNotification(notificationId: string) {
    return this.request<{ success: boolean }>(`/notifications/${notificationId}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

