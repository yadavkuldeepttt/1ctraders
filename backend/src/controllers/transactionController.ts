import type { Request, Response } from "express"

type ControllerResponse = Response | void
import mongoose from "mongoose"
import { TransactionModel } from "../db/models/TransactionModel"
import { UserModel } from "../db/models/UserModel"

export const createDeposit = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { amount, paymentMethod } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" })
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const transaction = await TransactionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      type: "deposit",
      amount,
      status: "pending",
      description: `Deposit via ${paymentMethod || "wallet"}`,
      txHash: `0x${Math.random().toString(36).substring(2, 15)}`,
    })

    res.status(201).json({
      message: "Deposit request created",
      transaction: transaction.toJSON(),
    })
  } catch (error) {
    console.error("Create deposit error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const createWithdrawal = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { amount, withdrawalAddress } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" })
    }

    if (!withdrawalAddress) {
      return res.status(400).json({ error: "Withdrawal address is required" })
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    // Check user balance
    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" })
    }

    const transaction = await TransactionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      type: "withdrawal",
      amount,
      status: "pending",
      description: "Withdrawal request",
      withdrawalAddress,
    })

    res.status(201).json({
      message: "Withdrawal request created",
      transaction: transaction.toJSON(),
    })
  } catch (error) {
    console.error("Create withdrawal error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUserTransactions = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { type, status, limit = 50 } = req.query

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const query: any = { userId: new mongoose.Types.ObjectId(userId) }

    if (type) {
      query.type = type
    }

    if (status) {
      query.status = status
    }

    const userTransactions = await TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))

    res.json({
      transactions: userTransactions.map((tx) => tx.toJSON()),
      total: userTransactions.length,
    })
  } catch (error) {
    console.error("Get transactions error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getTransactionById = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" })
    }

    const transaction = await TransactionModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    res.json(transaction.toJSON())
  } catch (error) {
    console.error("Get transaction error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
