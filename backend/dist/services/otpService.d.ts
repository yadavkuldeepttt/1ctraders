/**
 * Generate a 6-digit OTP
 */
export declare function generateOTP(): string;
/**
 * Send OTP via email
 */
export declare function sendOTP(email: string, options?: {
    subject?: string;
    title?: string;
    purpose?: string;
}): Promise<{
    success: boolean;
    otp?: string;
    error?: string;
}>;
/**
 * Verify OTP
 */
export declare function verifyOTP(email: string, code: string): {
    valid: boolean;
    error?: string;
};
/**
 * Clean up expired OTPs
 */
export declare function cleanupExpiredOTPs(): void;
//# sourceMappingURL=otpService.d.ts.map