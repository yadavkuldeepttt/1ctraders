export type TransactionType = "deposit" | "withdrawal" | "roi" | "referral" | "task"
export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled"

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  description: string
  txHash?: string
  withdrawalAddress?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface CreateTransactionDTO {
  userId: string
  type: TransactionType
  amount: number
  description: string
  withdrawalAddress?: string
}
