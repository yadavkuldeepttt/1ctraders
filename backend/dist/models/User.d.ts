export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    referralCode: string;
    referredBy?: string;
    balance: number;
    totalInvested: number;
    totalEarnings: number;
    totalWithdrawn: number;
    points: number;
    pendingPoints: number;
    role: "user" | "admin";
    status: "active" | "suspended" | "pending";
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
    phone?: string;
    referralCode?: string;
}
export interface UpdateUserDTO {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
}
//# sourceMappingURL=User.d.ts.map