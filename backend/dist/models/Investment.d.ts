export type InvestmentType = "oil" | "shares" | "crypto" | "ai";
export type InvestmentStatus = "active" | "completed" | "cancelled";
export interface Investment {
    id: string;
    userId: string;
    type: InvestmentType;
    amount: number;
    roiPercentage: number;
    dailyReturn: number;
    totalReturns: number;
    totalRoiEarned: number;
    totalCommissionEarned: number;
    startDate: Date;
    endDate: Date;
    status: InvestmentStatus;
    lastPaidDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateInvestmentDTO {
    userId: string;
    type: InvestmentType;
    amount: number;
}
export interface InvestmentPlan {
    type: InvestmentType;
    name: string;
    roiMin: number;
    roiMax: number;
    minInvest: number;
    maxInvest: number;
    durationDays: number;
}
export declare const INVESTMENT_PLANS: InvestmentPlan[];
export declare const MAX_ROI_PERCENTAGE = 300;
export declare const MAX_COMMISSION_PERCENTAGE = 400;
//# sourceMappingURL=Investment.d.ts.map