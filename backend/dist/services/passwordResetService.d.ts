/**
 * Generate a secure random token for password reset
 */
export declare function generateResetToken(): string;
/**
 * Send password reset email with reset link
 */
export declare function sendPasswordResetEmail(email: string, resetToken: string): Promise<{
    success: boolean;
    error?: string;
}>;
//# sourceMappingURL=passwordResetService.d.ts.map