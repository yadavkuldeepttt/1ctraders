import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { UserModel } from "../db/models/UserModel"

type ControllerResponse = Response | void

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

/**
 * Admin Login
 * POST /api/admin/auth/login
 */
export const adminLogin = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    // Log the request for debugging
    console.log("Admin login attempt:", {
      method: req.method,
      path: req.path,
      url: req.url,
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
    })

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user by email
    const user = await UserModel.findOne({ email: email.toLowerCase() })

    if (!user) {
      console.log("Admin login failed: User not found for email:", email)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check if user is admin
    if (user.role !== "admin") {
      console.log("Admin login failed: User is not admin. Role:", user.role)
      return res.status(403).json({ error: "Access denied. Admin privileges required." })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log("Admin login failed: Invalid password for user:", email)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    const userWithoutPassword = user.toJSON()

    console.log("Admin login successful for:", email)

    res.json({
      message: "Admin login successful",
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Admin login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Create Admin (for manual creation via Postman)
 * POST /api/admin/auth/create
 * Note: In production, this should be protected or removed
 */
export const createAdmin = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" })
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({ error: "User with this email or username already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate unique referral code (even for admin)
    const referralCode = `1CT-${username.toUpperCase()}-${Date.now().toString().slice(-4)}`

    // Create admin user
    const adminUser = await UserModel.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      referralCode,
      balance: 0,
      totalInvested: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
      points: 0,
      pendingPoints: 0,
      role: "admin",
      status: "active",
      emailVerified: true,
      twoFactorEnabled: false,
    })

    const userWithoutPassword = adminUser.toJSON()

    res.status(201).json({
      message: "Admin created successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Create admin error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get Admin Profile
 * GET /api/admin/auth/profile
 */
export const getAdminProfile = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findById(userId)

    if (!user || user.role !== "admin") {
      return res.status(404).json({ error: "Admin not found" })
    }

    const userWithoutPassword = user.toJSON()
    res.json(userWithoutPassword)
  } catch (error) {
    console.error("Get admin profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

