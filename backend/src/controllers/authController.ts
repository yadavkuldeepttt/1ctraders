import type { Request, Response } from "express"
import dotenv from "dotenv"

dotenv.config()

type ControllerResponse = Response | void
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import type { CreateUserDTO } from "../models/User"
import { UserModel } from "../db/models/UserModel"
import { ReferralModel } from "../db/models/ReferralModel"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export const register = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { username, email, password, phone, referralCode } = req.body as CreateUserDTO

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" })
    }

    // Check if user exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate unique referral code
    const userReferralCode = `1CT-${username.toUpperCase()}-${Date.now().toString().slice(-4)}`

    // Create user
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      phone,
      referralCode: userReferralCode,
      referredBy: referralCode,
      balance: 0,
      totalInvested: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
      status: "active",
      emailVerified: false,
      twoFactorEnabled: false,
    })

    // Create referral record if referral code was provided
    if (referralCode) {
      const referrer = await UserModel.findOne({ referralCode: referralCode })
      if (referrer) {
        // Create level 1 referral (direct)
        await ReferralModel.create({
          referrerId: new mongoose.Types.ObjectId(referrer._id),
          referredUserId: new mongoose.Types.ObjectId(newUser._id),
          level: 1,
          totalEarnings: 0,
          status: "active",
        })

        // Create referral records for levels 2-12 (upline chain)
        let currentReferrer = referrer
        for (let level = 2; level <= 12; level++) {
          if (!currentReferrer.referredBy) break

          const uplineReferrer = await UserModel.findOne({
            referralCode: currentReferrer.referredBy,
          })
          if (!uplineReferrer) break

          await ReferralModel.create({
            referrerId: new mongoose.Types.ObjectId(uplineReferrer._id),
            referredUserId: new mongoose.Types.ObjectId(newUser._id),
            level,
            totalEarnings: 0,
            status: "active",
          })

          currentReferrer = uplineReferrer
        }
      }
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Convert to JSON to get transformed document
    const userWithoutPassword = newUser.toJSON()

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const login = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" })
    }

    // Find user
    const user = await UserModel.findOne({
      $or: [{ username }, { email: username }],
    })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Convert to JSON to get transformed document
    const userWithoutPassword = user.toJSON()

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getProfile = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId // From auth middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const userWithoutPassword = user.toJSON()
    res.json(userWithoutPassword)
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const verifyToken = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId // From auth middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ valid: false, error: "Invalid user ID" })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(401).json({ valid: false, error: "User not found" })
    }

    const userWithoutPassword = user.toJSON()
    res.json({ valid: true, user: userWithoutPassword })
  } catch (error) {
    console.error("Verify token error:", error)
    res.status(401).json({ valid: false, error: "Invalid token" })
  }
}

export const updateProfile = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { username, email, phone } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if username or email is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await UserModel.findOne({ username })
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" })
      }
      user.username = username
    }

    if (email && email !== user.email) {
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return res.status(400).json({ error: "Email already taken" })
      }
      user.email = email.toLowerCase()
    }

    if (phone !== undefined) {
      user.phone = phone || ""
    }

    await user.save()

    const userWithoutPassword = user.toJSON()
    res.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const changePassword = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { currentPassword, newPassword } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    res.json({
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const updateTwoFactor = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { twoFactorEnabled } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: Boolean(twoFactorEnabled) },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const userWithoutPassword = user.toJSON()
    res.json({
      message: "Two-factor authentication updated",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Update two-factor error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
