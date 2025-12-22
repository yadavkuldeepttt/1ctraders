import type { Request, Response } from "express"
import { UserModel } from "../db/models/UserModel"

type ControllerResponse = Response | void

/**
 * Get active users (public endpoint)
 * GET /api/public/active-users
 */
export const getActiveUsers = async (_req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    // Get users who have been active in the last 7 days (have investments or recent activity)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const activeUsers = await UserModel.find({
      status: "active",
      $or: [
        { totalInvested: { $gt: 0 } },
        { updatedAt: { $gte: sevenDaysAgo } },
      ],
    })
      .select("username email totalInvested totalEarnings createdAt")
      .sort({ updatedAt: -1 })
      .limit(20)

    // Format users for display
    const formattedUsers = activeUsers.map((user) => ({
      username: user.username,
      totalInvested: user.totalInvested || 0,
      totalEarnings: user.totalEarnings || 0,
      joinedDate: user.createdAt,
    }))

    res.json({
      activeUsers: formattedUsers,
      totalActive: formattedUsers.length,
    })
  } catch (error) {
    console.error("Get active users error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get leaderboard (public endpoint)
 * GET /api/public/leaderboard
 */
export const getLeaderboard = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { type = "earnings", limit = 10 } = req.query

    let sortField = "totalEarnings"
    if (type === "invested") {
      sortField = "totalInvested"
    } else if (type === "balance") {
      sortField = "balance"
    }

    const leaderboard = await UserModel.find({
      status: "active",
      [sortField]: { $gt: 0 },
    })
      .select("username email totalInvested totalEarnings balance createdAt")
      .sort({ [sortField]: -1 })
      .limit(Number(limit))

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalInvested: user.totalInvested || 0,
      totalEarnings: user.totalEarnings || 0,
      balance: user.balance || 0,
      joinedDate: user.createdAt,
    }))

    res.json({
      leaderboard: formattedLeaderboard,
      type,
    })
  } catch (error) {
    console.error("Get leaderboard error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

