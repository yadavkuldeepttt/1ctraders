export interface Referral {
  id: string
  referrerId: string
  referredUserId: string
  level: number
  totalEarnings: number
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface ReferralCommission {
  id: string
  referralId: string
  amount: number
  investmentId: string
  level: number
  createdAt: Date
}

// Updated referral system: 8% direct, 1% levels 2-12, capped at 20% total
export const REFERRAL_LEVELS = [
  { level: 1, percentage: 8 }, // Direct referral: 8%
  { level: 2, percentage: 1 }, // Level 2: 1%
  { level: 3, percentage: 1 }, // Level 3: 1%
  { level: 4, percentage: 1 }, // Level 4: 1%
  { level: 5, percentage: 1 }, // Level 5: 1%
  { level: 6, percentage: 1 }, // Level 6: 1%
  { level: 7, percentage: 1 }, // Level 7: 1%
  { level: 8, percentage: 1 }, // Level 8: 1%
  { level: 9, percentage: 1 }, // Level 9: 1%
  { level: 10, percentage: 1 }, // Level 10: 1%
  { level: 11, percentage: 1 }, // Level 11: 1%
  { level: 12, percentage: 1 }, // Level 12: 1%
]

export const MAX_REFERRAL_COMMISSION_PERCENTAGE = 20 // Total commission capped at 20%
