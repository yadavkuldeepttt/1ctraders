export interface Referral {
    id: string;
    referrerId: string;
    referredUserId: string;
    level: number;
    totalEarnings: number;
    status: "active" | "inactive";
    createdAt: Date;
    updatedAt: Date;
}
export interface ReferralCommission {
    id: string;
    referralId: string;
    amount: number;
    investmentId: string;
    level: number;
    createdAt: Date;
}
export declare const REFERRAL_LEVELS: {
    level: number;
    percentage: number;
}[];
export declare const MAX_REFERRAL_COMMISSION_PERCENTAGE = 20;
//# sourceMappingURL=Referral.d.ts.map