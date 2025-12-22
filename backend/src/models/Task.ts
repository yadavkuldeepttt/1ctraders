export type TaskType = "social" | "referral" | "daily" | "special" | "ad"
export type TaskStatus = "available" | "completed" | "pending" | "expired"

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  reward: number
  requirements?: Record<string, any>
  expiresAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserTask {
  id: string
  userId: string
  taskId: string
  status: TaskStatus
  progress?: number
  completedAt?: Date
  rewardClaimed: boolean
  createdAt: Date
  updatedAt: Date
}
