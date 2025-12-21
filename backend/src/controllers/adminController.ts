import type { Request, Response } from "express"
import mongoose from "mongoose"
import { UserModel } from "../db/models/UserModel"
import { InvestmentModel } from "../db/models/InvestmentModel"
import { TransactionModel } from "../db/models/TransactionModel"

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await UserModel.countDocuments()
    const activeUsers = await UserModel.countDocuments({ status: "active" })

    const investments = await InvestmentModel.find()
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0)

    const completedWithdrawals = await TransactionModel.find({
      type: "withdrawal",
      status: "completed",
    })
    const totalPaidOut = completedWithdrawals.reduce((sum, tx) => sum + tx.amount, 0)

    const pendingWithdrawals = await TransactionModel.find({
      type: "withdrawal",
      status: "pending",
    })
    const pendingAmount = pendingWithdrawals.reduce((sum, tx) => sum + tx.amount, 0)

    res.json({
      totalUsers,
      activeUsers,
      totalInvestments,
      totalPaidOut,
      pendingWithdrawals: pendingAmount,
    })
  } catch (error) {
    console.error("Get admin stats error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query

    const query: any = {}
    if (status) {
      query.status = status
    }

    const total = await UserModel.countDocuments(query)
    const users = await UserModel.find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ createdAt: -1 })

    const paginatedUsers = users.map((user) => user.toJSON())

    res.json({
      users: paginatedUsers,
      total,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { status } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { status, updatedAt: new Date() },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const userWithoutPassword = user.toJSON()

    res.json({
      message: "User status updated",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Update user status error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getPendingWithdrawals = async (req: Request, res: Response) => {
  try {
    const pendingWithdrawals = await TransactionModel.find({
      type: "withdrawal",
      status: "pending",
    }).populate("userId", "username email")

    res.json({
      withdrawals: pendingWithdrawals.map((tx) => tx.toJSON()),
      total: pendingWithdrawals.length,
    })
  } catch (error) {
    console.error("Get pending withdrawals error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const approveWithdrawal = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ error: "Invalid transaction ID" })
    }

    const transaction = await TransactionModel.findByIdAndUpdate(
      transactionId,
      {
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    res.json({
      message: "Withdrawal approved",
      transaction: transaction.toJSON(),
    })
  } catch (error) {
    console.error("Approve withdrawal error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
