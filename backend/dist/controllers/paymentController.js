"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentStatus = exports.handleNowPaymentsIPN = exports.createCryptoPayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionModel_1 = require("../db/models/TransactionModel");
const UserModel_1 = require("../db/models/UserModel");
const nowpaymentsService_1 = require("../services/nowpaymentsService");
const otpService_1 = require("../services/otpService");
/**
 * Create crypto payment with coin selection
 * POST /api/payments/crypto
 */
const createCryptoPayment = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount, coin, otp, orderId } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }
        if (!coin) {
            return res.status(400).json({ error: "Cryptocurrency selection is required" });
        }
        if (!otp) {
            return res.status(400).json({ error: "OTP is required for crypto payments" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await UserModel_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Verify OTP
        if (!user.email) {
            return res.status(400).json({ error: "User email not found" });
        }
        const otpResult = (0, otpService_1.verifyOTP)(user.email, otp);
        if (!otpResult.valid) {
            return res.status(400).json({ error: otpResult.error || "Invalid or expired OTP" });
        }
        // Check if 2FA is enabled (recommended)
        if (!user.twoFactorEnabled) {
            // Still allow, but log a warning
            console.warn(`User ${userId} making crypto payment without 2FA enabled`);
        }
        // Create NowPayments payment
        const paymentResult = await (0, nowpaymentsService_1.createPayment)(amount, "USD", coin, orderId || `INV-${Date.now()}-${userId}`, user.email);
        if (!paymentResult.success) {
            return res.status(500).json({ error: paymentResult.error || "Failed to create payment" });
        }
        // Create transaction record
        const transaction = await TransactionModel_1.TransactionModel.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            type: "deposit",
            amount,
            status: "pending",
            description: `Crypto deposit via ${coin}`,
            paymentMethod: "crypto",
            paymentCurrency: coin,
            paymentId: paymentResult.data?.payment_id,
            paymentUrl: paymentResult.data?.invoice_url,
        });
        res.status(201).json({
            message: "Payment created successfully",
            transaction: transaction.toJSON(),
            payment: paymentResult.data,
        });
    }
    catch (error) {
        console.error("Create crypto payment error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createCryptoPayment = createCryptoPayment;
/**
 * NowPayments IPN webhook handler
 * POST /api/payments/nowpayments/ipn
 */
const handleNowPaymentsIPN = async (req, res) => {
    try {
        const signature = req.headers["x-nowpayments-sig"];
        // Body is raw buffer for signature verification
        const rawBody = req.body;
        const payload = JSON.parse(rawBody.toString());
        // Verify IPN signature using raw body
        if (!(0, nowpaymentsService_1.verifyIPNSignature)(rawBody, signature)) {
            console.error("Invalid IPN signature");
            return res.status(401).json({ error: "Invalid signature" });
        }
        const { payment_id, payment_status, order_id, pay_amount, pay_currency } = payload;
        // Find transaction by payment ID
        const transaction = await TransactionModel_1.TransactionModel.findOne({
            paymentId: payment_id,
        });
        if (!transaction) {
            console.error("Transaction not found for IPN:", payment_id, order_id);
            return res.status(404).json({ error: "Transaction not found" });
        }
        // Update transaction with payment data
        transaction.paymentStatus = payment_status;
        if (pay_amount) {
            transaction.cryptoAmount = parseFloat(pay_amount);
        }
        if (pay_currency) {
            transaction.coin = pay_currency.toUpperCase();
        }
        // Update transaction status and credit wallet ONLY when finished
        if (payment_status === "finished") {
            transaction.status = "completed";
            transaction.completedAt = new Date();
            // Credit user wallet - THIS IS WHERE BALANCE INCREASES
            const user = await UserModel_1.UserModel.findById(transaction.userId);
            if (user) {
                user.balance = (user.balance || 0) + transaction.amount;
                user.totalDeposits = (user.totalDeposits || 0) + transaction.amount;
                await user.save();
                // Create notification
                try {
                    const { createNotification } = await Promise.resolve().then(() => __importStar(require("../services/notificationService")));
                    await createNotification({
                        userId: user._id.toString(),
                        title: "Deposit Completed!",
                        message: `Your deposit of $${transaction.amount} has been completed successfully. Your wallet has been credited.`,
                        type: "success",
                        relatedId: transaction._id.toString(),
                        relatedType: "transaction",
                    });
                }
                catch (notifError) {
                    console.error("Error creating deposit notification:", notifError);
                }
            }
        }
        else if (payment_status === "failed" || payment_status === "expired") {
            transaction.status = "failed";
        }
        else {
            transaction.status = "pending";
        }
        await transaction.save();
        res.json({ message: "IPN processed successfully" });
    }
    catch (error) {
        console.error("IPN handler error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.handleNowPaymentsIPN = handleNowPaymentsIPN;
/**
 * Get payment status
 * GET /api/payments/:paymentId/status
 */
const getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const transaction = await TransactionModel_1.TransactionModel.findOne({
            paymentId,
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json({ transaction: transaction.toJSON() });
    }
    catch (error) {
        console.error("Get payment status error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getPaymentStatus = getPaymentStatus;
//# sourceMappingURL=paymentController.js.map