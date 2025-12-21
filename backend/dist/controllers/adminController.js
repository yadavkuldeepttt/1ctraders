"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveWithdrawal = exports.getPendingWithdrawals = exports.updateUserStatus = exports.getAllUsers = exports.getDashboardStats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = require("../db/models/UserModel");
const InvestmentModel_1 = require("../db/models/InvestmentModel");
const TransactionModel_1 = require("../db/models/TransactionModel");
const getDashboardStats = async (_req, res) => {
    try {
        const totalUsers = await UserModel_1.UserModel.countDocuments();
        const activeUsers = await UserModel_1.UserModel.countDocuments({ status: "active" });
        const investments = await InvestmentModel_1.InvestmentModel.find();
        const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const completedWithdrawals = await TransactionModel_1.TransactionModel.find({
            type: "withdrawal",
            status: "completed",
        });
        const totalPaidOut = completedWithdrawals.reduce((sum, tx) => sum + tx.amount, 0);
        const pendingWithdrawals = await TransactionModel_1.TransactionModel.find({
            type: "withdrawal",
            status: "pending",
        });
        const pendingAmount = pendingWithdrawals.reduce((sum, tx) => sum + tx.amount, 0);
        res.json({
            totalUsers,
            activeUsers,
            totalInvestments,
            totalPaidOut,
            pendingWithdrawals: pendingAmount,
        });
    }
    catch (error) {
        console.error("Get admin stats error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getDashboardStats = getDashboardStats;
const getAllUsers = async (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;
        const query = {};
        if (status) {
            query.status = status;
        }
        const total = await UserModel_1.UserModel.countDocuments(query);
        const users = await UserModel_1.UserModel.find(query)
            .skip(Number(offset))
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        const paginatedUsers = users.map((user) => user.toJSON());
        res.json({
            users: paginatedUsers,
            total,
            limit: Number(limit),
            offset: Number(offset),
        });
    }
    catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await UserModel_1.UserModel.findByIdAndUpdate(userId, { status, updatedAt: new Date() }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userWithoutPassword = user.toJSON();
        res.json({
            message: "User status updated",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Update user status error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateUserStatus = updateUserStatus;
const getPendingWithdrawals = async (_req, res) => {
    try {
        const pendingWithdrawals = await TransactionModel_1.TransactionModel.find({
            type: "withdrawal",
            status: "pending",
        }).populate("userId", "username email");
        res.json({
            withdrawals: pendingWithdrawals.map((tx) => tx.toJSON()),
            total: pendingWithdrawals.length,
        });
    }
    catch (error) {
        console.error("Get pending withdrawals error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getPendingWithdrawals = getPendingWithdrawals;
const approveWithdrawal = async (req, res) => {
    try {
        const { transactionId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }
        const transaction = await TransactionModel_1.TransactionModel.findByIdAndUpdate(transactionId, {
            status: "completed",
            completedAt: new Date(),
            updatedAt: new Date(),
        }, { new: true });
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json({
            message: "Withdrawal approved",
            transaction: transaction.toJSON(),
        });
    }
    catch (error) {
        console.error("Approve withdrawal error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.approveWithdrawal = approveWithdrawal;
//# sourceMappingURL=adminController.js.map