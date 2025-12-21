export type InvestmentType = "oil" | "shares" | "crypto" | "ai"
export type InvestmentStatus = "active" | "completed" | "cancelled"

export interface Investment {
  id: string
  userId: string
  type: InvestmentType
  amount: number
  roiPercentage: number
  dailyReturn: number
  totalReturns: number
  totalRoiEarned: number // Track total ROI earned (max 300% of amount)
  totalCommissionEarned: number // Track total commission earned (max 400% of amount)
  startDate: Date
  endDate: Date
  status: InvestmentStatus
  lastPaidDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateInvestmentDTO {
  userId: string
  type: InvestmentType
  amount: number
}

export interface InvestmentPlan {
  type: InvestmentType
  name: string
  roiMin: number
  roiMax: number
  minInvest: number
  maxInvest: number
  durationDays: number
}

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    type: "oil",
    name: "Oil Investment",
    roiMin: 1.5, // 1.5% daily per $100
    roiMax: 2.5, // 2.5% daily per $100
    minInvest: 100,
    maxInvest: 5000,
    durationDays: 365,
  },
  {
    type: "shares",
    name: "Shares Trading",
    roiMin: 1.5, // 1.5% daily per $100
    roiMax: 2.5, // 2.5% daily per $100
    minInvest: 100,
    maxInvest: 10000,
    durationDays: 365,
  },
  {
    type: "crypto",
    name: "Crypto Trading",
    roiMin: 1.5, // 1.5% daily per $100
    roiMax: 2.5, // 2.5% daily per $100
    minInvest: 100,
    maxInvest: 25000,
    durationDays: 365,
  },
  {
    type: "ai",
    name: "AI Trading Bot",
    roiMin: 1.5, // 1.5% daily per $100
    roiMax: 2.5, // 2.5% daily per $100
    minInvest: 100,
    maxInvest: 50000,
    durationDays: 365,
  },
]

// Constants for investment limits
export const MAX_ROI_PERCENTAGE = 300 // 300% ROI limit
export const MAX_COMMISSION_PERCENTAGE = 400 // 400% commission limit
