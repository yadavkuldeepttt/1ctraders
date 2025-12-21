import type { Request, Response } from "express"

type ControllerResponse = Response | void
import mongoose from "mongoose"
import { REFERRAL_LEVELS } from "../models/Referral"
import { ReferralModel, ReferralCommissionModel } from "../db/models/ReferralModel"

export const getReferralStats = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const userReferrals = await ReferralModel.find({
      referrerId: new mongoose.Types.ObjectId(userId),
    })

    const referralIds = userReferrals.map((ref) => ref._id)
    const commissions = await ReferralCommissionModel.find({
      referralId: { $in: referralIds },
    })

    const totalEarnings = commissions.reduce((sum, comm) => sum + comm.amount, 0)
    const activeReferrals = userReferrals.filter((ref) => ref.status === "active").length

    const referralsByLevel = await Promise.all(
      REFERRAL_LEVELS.map(async (level) => {
        const levelReferrals = userReferrals.filter((ref) => ref.level === level.level)
        const levelReferralIds = levelReferrals.map((ref) => ref._id)
        const levelCommissions = await ReferralCommissionModel.find({
          referralId: { $in: levelReferralIds },
        })
        const levelEarnings = levelCommissions.reduce((sum, comm) => sum + comm.amount, 0)

        return {
          level: level.level,
          percentage: level.percentage,
          count: levelReferrals.length,
          earnings: levelEarnings,
        }
      })
    )

    res.json({
      totalReferrals: userReferrals.length,
      activeReferrals,
      totalEarnings,
      referralsByLevel,
    })
  } catch (error) {
    console.error("Get referral stats error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUserReferrals = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { level } = req.query

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const query: any = { referrerId: new mongoose.Types.ObjectId(userId) }

    if (level) {
      query.level = Number(level)
    }

    const userReferrals = await ReferralModel.find(query)

    res.json({
      referrals: userReferrals.map((ref) => ref.toJSON()),
      total: userReferrals.length,
    })
  } catch (error) {
    console.error("Get user referrals error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getReferralTree = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    // Build referral tree (simplified for demo)
    const buildTree = async (referrerId: mongoose.Types.ObjectId, maxLevel = 12): Promise<any[]> => {
      const directReferrals = await ReferralModel.find({
        referrerId,
        level: { $lte: maxLevel },
      })

      const children: any[] = await Promise.all(
        directReferrals.map((ref) => buildTree(new mongoose.Types.ObjectId(ref.referredUserId.toString()), maxLevel))
      )

      return directReferrals.map((ref, index) => ({
        ...ref.toJSON(),
        children: children[index],
      }))
    }

    const tree = await buildTree(new mongoose.Types.ObjectId(userId))

    res.json({
      tree,
    })
  } catch (error) {
    console.error("Get referral tree error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
