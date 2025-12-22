export interface User {
  id: string
  username: string
  email: string
  password: string
  phone?: string
  referralCode: string
  referredBy?: string
  balance: number
  totalInvested: number
  totalEarnings: number
  totalWithdrawn: number
  totalDeposits?: number // Total deposits made
  points: number // Points earned from tasks
  pendingPoints: number // Points pending conversion to money
  role: "user" | "admin" // User role
  status: "active" | "suspended" | "pending"
  emailVerified: boolean
  twoFactorEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserDTO {
  username: string
  email: string
  password: string
  phone?: string
  referralCode?: string
}

export interface UpdateUserDTO {
  username?: string
  email?: string
  phone?: string
  password?: string
}
