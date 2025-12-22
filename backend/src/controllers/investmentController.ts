import type { Request, Response } from "express"

type ControllerResponse = Response | void
import mongoose from "mongoose"
import type { CreateInvestmentDTO } from "../models/Investment"
import { INVESTMENT_PLANS } from "../models/Investment"
import { InvestmentModel } from "../db/models/InvestmentModel"
import { UserModel } from "../db/models/UserModel"

export const getInvestmentPlans = async (_req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    res.json({
      plans: INVESTMENT_PLANS,
    })
  } catch (error) {
    console.error("Get investment plans error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const createInvestment = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { type, amount } = req.body as CreateInvestmentDTO

    // Validate input
    if (!type || !amount) {
      return res.status(400).json({ error: "Investment type and amount are required" })
    }

    // Find plan
    const plan = INVESTMENT_PLANS.find((p) => p.type === type)
    if (!plan) {
      return res.status(400).json({ error: "Invalid investment type" })
    }

    // Validate amount
    if (amount < plan.minInvest || amount > plan.maxInvest) {
      return res.status(400).json({
        error: `Investment amount must be between $${plan.minInvest} and $${plan.maxInvest}`,
      })
    }

    // Calculate ROI (random within range: 1.5-2.5% daily per $100)
    const roiPercentage = plan.roiMin + Math.random() * (plan.roiMax - plan.roiMin)
    const dailyReturn = (amount * roiPercentage) / 100

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    // Check if user exists and has sufficient balance
    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" })
    }

    // Create investment with ROI and commission limits
    const newInvestment = await InvestmentModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      amount,
      roiPercentage,
      dailyReturn,
      totalReturns: 0,
      totalRoiEarned: 0, // Track ROI earned (max 300% of amount)
      totalCommissionEarned: 0, // Track commission earned (max 400% of amount)
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
      status: "active",
    })

    // Update user balance and total invested
    user.balance -= amount
    user.totalInvested += amount
    await user.save()

    // Create notification for investment creation
    try {
      const { createNotification } = await import("../services/notificationService")
      await createNotification({
        userId: userId,
        title: "Investment Created!",
        message: `Your ${type} investment of $${amount} has been created successfully. You will start earning daily ROI of ${roiPercentage.toFixed(2)}%.`,
        type: "investment",
        relatedId: newInvestment._id.toString(),
        relatedType: "investment",
      })
    } catch (notifError) {
      console.error("Error creating investment notification:", notifError)
      // Don't fail the request if notification creation fails
    }

    res.status(201).json({
      message: "Investment created successfully",
      investment: newInvestment.toJSON(),
    })
  } catch (error) {
    console.error("Create investment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUserInvestments = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const userInvestments = await InvestmentModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 })

    res.json({
      investments: userInvestments.map((inv) => inv.toJSON()),
      total: userInvestments.length,
    })
  } catch (error) {
    console.error("Get user investments error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getInvestmentById = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" })
    }

    const investment = await InvestmentModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!investment) {
      return res.status(404).json({ error: "Investment not found" })
    }

    res.json(investment.toJSON())
  } catch (error) {
    console.error("Get investment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
