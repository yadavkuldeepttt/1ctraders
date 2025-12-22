import type { Request, Response } from "express"
import mongoose from "mongoose"
import { TransactionModel } from "../db/models/TransactionModel"
import { UserModel } from "../db/models/UserModel"
import { createPayment, verifyIPNSignature } from "../services/nowpaymentsService"
import { verifyOTP } from "../services/otpService"

type ControllerResponse = Response | void

/**
 * Create crypto payment with coin selection
 * POST /api/payments/crypto
 */
export const createCryptoPayment = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { amount, coin, otp, orderId } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" })
    }

    if (!coin) {
      return res.status(400).json({ error: "Cryptocurrency selection is required" })
    }

    if (!otp) {
      return res.status(400).json({ error: "OTP is required for crypto payments" })
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Verify OTP
    if (!user.email) {
      return res.status(400).json({ error: "User email not found" })
    }

    const otpResult = verifyOTP(user.email, otp)
    if (!otpResult.valid) {
      return res.status(400).json({ error: otpResult.error || "Invalid or expired OTP" })
    }

    // Check if 2FA is enabled (recommended)
    if (!user.twoFactorEnabled) {
      // Still allow, but log a warning
      console.warn(`User ${userId} making crypto payment without 2FA enabled`)
    }

    // Create NowPayments payment
    const paymentResult = await createPayment(
      amount,
      "USD",
      coin,
      orderId || `INV-${Date.now()}-${userId}`,
      user.email
    )

    if (!paymentResult.success) {
      return res.status(500).json({ error: paymentResult.error || "Failed to create payment" })
    }

    // Create transaction record
    const transaction = await TransactionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      type: "deposit",
      amount,
      status: "pending",
      description: `Crypto deposit via ${coin}`,
      paymentMethod: "crypto",
      paymentCurrency: coin,
      paymentId: paymentResult.data?.payment_id,
      paymentUrl: paymentResult.data?.invoice_url,
    })

    res.status(201).json({
      message: "Payment created successfully",
      transaction: transaction.toJSON(),
      payment: paymentResult.data,
    })
  } catch (error) {
    console.error("Create crypto payment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * NowPayments IPN webhook handler
 * POST /api/payments/nowpayments/ipn
 */
export const handleNowPaymentsIPN = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const signature = req.headers["x-nowpayments-sig"] as string
    // Body is raw buffer for signature verification
    const rawBody = req.body as Buffer
    const payload = JSON.parse(rawBody.toString())

    // Verify IPN signature using raw body
    if (!verifyIPNSignature(rawBody, signature)) {
      console.error("Invalid IPN signature")
      return res.status(401).json({ error: "Invalid signature" })
    }

    const { payment_id, payment_status, order_id, pay_amount, pay_currency } = payload

    // Find transaction by payment ID
    const transaction = await TransactionModel.findOne({
      paymentId: payment_id,
    })

    if (!transaction) {
      console.error("Transaction not found for IPN:", payment_id, order_id)
      return res.status(404).json({ error: "Transaction not found" })
    }

    // Update transaction with payment data
    transaction.paymentStatus = payment_status
    if (pay_amount) {
      transaction.cryptoAmount = parseFloat(pay_amount)
    }
    if (pay_currency) {
      transaction.coin = pay_currency.toUpperCase()
    }

    // Update transaction status and credit wallet ONLY when finished
    if (payment_status === "finished") {
      transaction.status = "completed"
      transaction.completedAt = new Date()

      // Credit user wallet - THIS IS WHERE BALANCE INCREASES
      const user = await UserModel.findById(transaction.userId)
      if (user) {
        user.balance = (user.balance || 0) + transaction.amount
        user.totalDeposits = (user.totalDeposits || 0) + transaction.amount
        await user.save()

        // Create notification
        try {
          const { createNotification } = await import("../services/notificationService")
          await createNotification({
            userId: user._id.toString(),
            title: "Deposit Completed!",
            message: `Your deposit of $${transaction.amount} has been completed successfully. Your wallet has been credited.`,
            type: "success",
            relatedId: transaction._id.toString(),
            relatedType: "transaction",
          })
        } catch (notifError) {
          console.error("Error creating deposit notification:", notifError)
        }
      }
    } else if (payment_status === "failed" || payment_status === "expired") {
      transaction.status = "failed"
    } else {
      transaction.status = "pending"
    }

    await transaction.save()

    res.json({ message: "IPN processed successfully" })
  } catch (error) {
    console.error("IPN handler error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get payment status
 * GET /api/payments/:paymentId/status
 */
export const getPaymentStatus = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { paymentId } = req.params
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const transaction = await TransactionModel.findOne({
      paymentId,
      userId: new mongoose.Types.ObjectId(userId),
    })

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    res.json({ transaction: transaction.toJSON() })
  } catch (error) {
    console.error("Get payment status error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

