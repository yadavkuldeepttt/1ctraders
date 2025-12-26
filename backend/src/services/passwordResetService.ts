import nodemailer from "nodemailer"
import crypto from "crypto"
import dotenv from "dotenv"

dotenv.config()

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

/**
 * Send password reset email with reset link
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Gmail credentials are configured
    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailPassword) {
      // In development, log the reset link instead of sending email
      if (process.env.NODE_ENV === "development") {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
        const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
        console.warn("⚠️  Gmail credentials not configured. Password reset link generated but email not sent.")
        console.warn(`📧 Password reset link for ${email}:`)
        console.warn(`🔗 ${resetLink}`)
        return { success: true }
      } else {
        // In production, return error
        return {
          success: false,
          error: "Email service not configured. Please contact administrator.",
        }
      }
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    })

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
    const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    // Send email
    await transporter.sendMail({
      from: gmailUser,
      to: email,
      subject: "1C Traders - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #00d4d4 0%, #00a8a8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">1C Traders</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6;">
              You requested to reset your password for your 1C Traders account. Click the button below to reset your password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="display: inline-block; background: #00d4d4; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #00d4d4; word-break: break-all; font-size: 12px; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${resetLink}
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <strong>Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 10px;">
              For security reasons, never share this link with anyone.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} 1C Traders. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    // In development, also log the reset link
    if (process.env.NODE_ENV === "development") {
      console.log(`📧 Password reset email sent to ${email}`)
      console.log(`🔗 Reset link: ${resetLink}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error("Send password reset email error:", error)

    // If it's an authentication error and we're in development, still return success
    if (error.code === "EAUTH" && process.env.NODE_ENV === "development") {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
      const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
      console.warn("⚠️  Email authentication failed. Password reset link generated but email not sent.")
      console.warn(`🔗 Reset link: ${resetLink}`)
      return { success: true }
    }

    return { success: false, error: error.message || "Failed to send password reset email" }
  }
}
