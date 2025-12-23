import type { Request, Response } from "express"
import { sendOTP, verifyOTP } from "../services/otpService"
import { UserModel } from "../db/models/UserModel"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

type ControllerResponse = Response | void

/**
 * Send OTP for crypto payment
 * POST /api/otp/send
 */
export const sendPaymentOTP = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!user.email) {
      return res.status(400).json({ error: "User email not found" })
    }

    // Check if 2FA is enabled (recommended but not required)
    if (!user.twoFactorEnabled) {
      // Still allow OTP, but suggest enabling 2FA
    }

    const result = await sendOTP(user.email)

    if (!result.success) {
      return res.status(500).json({ error: result.error || "Failed to send OTP" })
    }

    // In development, return OTP for testing. In production, don't return it
    res.json({
      message: "OTP sent to your email",
      ...(process.env.NODE_ENV === "development" && { otp: result.otp }), // Only in dev
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Verify OTP for crypto payment
 * POST /api/otp/verify
 */
export const verifyPaymentOTP = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { otp } = req.body

    if (!otp) {
      return res.status(400).json({ error: "OTP is required" })
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!user.email) {
      return res.status(400).json({ error: "User email not found" })
    }

    const result = verifyOTP(user.email, otp)

    if (!result.valid) {
      return res.status(400).json({ error: result.error || "Invalid OTP" })
    }

    res.json({ message: "OTP verified successfully", verified: true })
  } catch (error) {
    console.error("Verify OTP error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Send OTP for email verification (public, for registration)
 * POST /api/otp/send-verification
 */
export const sendVerificationOTP = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    const result = await sendOTP(email, {
      subject: "1C Traders - Email Verification OTP",
      title: "1C Traders - Email Verification",
      purpose: "email verification",
    })

    if (!result.success) {
      return res.status(500).json({ error: result.error || "Failed to send OTP" })
    }

    // In development, return OTP for testing. In production, don't return it
    res.json({
      message: "OTP sent to your email",
      ...(process.env.NODE_ENV === "development" && { otp: result.otp }), // Only in dev
    })
  } catch (error) {
    console.error("Send verification OTP error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Verify OTP for email verification (public, for registration)
 * POST /api/otp/verify-verification
 */
export const verifyVerificationOTP = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { email, otp } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    if (!otp) {
      return res.status(400).json({ error: "OTP is required" })
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    const result = verifyOTP(email, otp)

    if (!result.valid) {
      return res.status(400).json({ error: result.error || "Invalid OTP" })
    }

    res.json({ message: "OTP verified successfully", verified: true })
  } catch (error) {
    console.error("Verify verification OTP error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Send OTP for login (public, optional 2FA)
 * POST /api/otp/send-login
 */
export const sendLoginOTP = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    // Check if user exists
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const result = await sendOTP(email, {
      subject: "1C Traders - Login Verification OTP",
      title: "1C Traders - Login Verification",
      purpose: "login verification",
    })

    if (!result.success) {
      return res.status(500).json({ error: result.error || "Failed to send OTP" })
    }

    // In development, return OTP for testing. In production, don't return it
    res.json({
      message: "OTP sent to your email",
      ...(process.env.NODE_ENV === "development" && { otp: result.otp }), // Only in dev
    })
  } catch (error) {
    console.error("Send login OTP error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Verify OTP for login (public, optional 2FA)
 * POST /api/otp/verify-login
 */
export const verifyLoginOTP = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { email, otp } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    if (!otp) {
      return res.status(400).json({ error: "OTP is required" })
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    const result = verifyOTP(email, otp)

    if (!result.valid) {
      return res.status(400).json({ error: result.error || "Invalid OTP" })
    }

    res.json({ message: "OTP verified successfully", verified: true })
  } catch (error) {
    console.error("Verify login OTP error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}


