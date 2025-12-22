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
  // NOWPayments fields
  paymentId?: string
  coin?: string
  cryptoAmount?: number
  payAddress?: string
  paymentStatus?: "waiting" | "confirming" | "confirmed" | "sending" | "partially_paid" | "finished" | "failed" | "refunded" | "expired"
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
