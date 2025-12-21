"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionById = exports.getUserTransactions = exports.createWithdrawal = exports.createDeposit = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionModel_1 = require("../db/models/TransactionModel");
const UserModel_1 = require("../db/models/UserModel");
const createDeposit = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount, paymentMethod } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const transaction = await TransactionModel_1.TransactionModel.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            type: "deposit",
            amount,
            status: "pending",
            description: `Deposit via ${paymentMethod || "wallet"}`,
            txHash: `0x${Math.random().toString(36).substring(2, 15)}`,
        });
        res.status(201).json({
            message: "Deposit request created",
            transaction: transaction.toJSON(),
        });
    }
    catch (error) {
        console.error("Create deposit error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createDeposit = createDeposit;
const createWithdrawal = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount, withdrawalAddress } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }
        if (!withdrawalAddress) {
            return res.status(400).json({ error: "Withdrawal address is required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        // Check user balance
        const user = await UserModel_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }
        const transaction = await TransactionModel_1.TransactionModel.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            type: "withdrawal",
            amount,
            status: "pending",
            description: "Withdrawal request",
            withdrawalAddress,
        });
        res.status(201).json({
            message: "Withdrawal request created",
            transaction: transaction.toJSON(),
        });
    }
    catch (error) {
        console.error("Create withdrawal error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createWithdrawal = createWithdrawal;
const getUserTransactions = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, status, limit = 50 } = req.query;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const query = { userId: new mongoose_1.default.Types.ObjectId(userId) };
        if (type) {
            query.type = type;
        }
        if (status) {
            query.status = status;
        }
        const userTransactions = await TransactionModel_1.TransactionModel.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit));
        res.json({
            transactions: userTransactions.map((tx) => tx.toJSON()),
            total: userTransactions.length,
        });
    }
    catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUserTransactions = getUserTransactions;
const getTransactionById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const transaction = await TransactionModel_1.TransactionModel.findOne({
            _id: new mongoose_1.default.Types.ObjectId(id),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json(transaction.toJSON());
    }
    catch (error) {
        console.error("Get transaction error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getTransactionById = getTransactionById;
//# sourceMappingURL=transactionController.js.map