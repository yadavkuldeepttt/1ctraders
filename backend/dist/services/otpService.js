"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.sendOTP = sendOTP;
exports.verifyOTP = verifyOTP;
exports.cleanupExpiredOTPs = cleanupExpiredOTPs;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Store OTPs in memory (in production, use Redis)
const otpStore = new Map();
// OTP expires in 10 minutes
const OTP_EXPIRY = 10 * 60 * 1000;
/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Send OTP via email
 */
async function sendOTP(email, options) {
    try {
        const otp = generateOTP();
        const expiresAt = Date.now() + OTP_EXPIRY;
        // Store OTP
        otpStore.set(email, { code: otp, expiresAt, email });
        // Check if Gmail credentials are configured
        const gmailUser = process.env.GMAIL_USER;
        const gmailPassword = process.env.GMAIL_APP_PASSWORD;
        if (!gmailUser || !gmailPassword) {
            // In development, return OTP directly without sending email
            if (process.env.NODE_ENV === "development") {
                console.warn("⚠️  Gmail credentials not configured. OTP generated but email not sent.");
                console.warn(`📧 OTP for ${email}: ${otp}`);
                return {
                    success: true,
                    otp, // Return OTP in development when credentials are missing
                };
            }
            else {
                // In production, return error
                return {
                    success: false,
                    error: "Email service not configured. Please contact administrator.",
                };
            }
        }
        // Configure email transporter
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: gmailUser,
                pass: gmailPassword,
            },
        });
        const subject = options?.subject || "1C Traders - Crypto Payment OTP";
        const title = options?.title || "1C Traders - Payment Verification";
        const purpose = options?.purpose || "crypto payment verification";
        // Send email
        await transporter.sendMail({
            from: gmailUser,
            to: email,
            subject,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00d4d4;">${title}</h2>
          <p>Your OTP for ${purpose} is:</p>
          <div style="background: #00d4d4; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
        });
        // In development, also return OTP for testing
        return {
            success: true,
            ...(process.env.NODE_ENV === "development" && { otp }), // Only in dev
        };
    }
    catch (error) {
        console.error("Send OTP error:", error);
        // If it's an authentication error and we're in development, still return OTP
        if (error.code === "EAUTH" && process.env.NODE_ENV === "development") {
            const stored = otpStore.get(email);
            if (stored) {
                console.warn("⚠️  Email authentication failed. OTP generated but email not sent.");
                console.warn(`📧 OTP for ${email}: ${stored.code}`);
                return {
                    success: true,
                    otp: stored.code,
                };
            }
        }
        return { success: false, error: error.message || "Failed to send OTP" };
    }
}
/**
 * Verify OTP
 */
function verifyOTP(email, code) {
    const stored = otpStore.get(email);
    if (!stored) {
        return { valid: false, error: "OTP not found or expired" };
    }
    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        return { valid: false, error: "OTP expired" };
    }
    if (stored.code !== code) {
        return { valid: false, error: "Invalid OTP" };
    }
    // OTP is valid, remove it
    otpStore.delete(email);
    return { valid: true };
}
/**
 * Clean up expired OTPs
 */
function cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
        }
    }
}
// Clean up expired OTPs every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);
//# sourceMappingURL=otpService.js.map