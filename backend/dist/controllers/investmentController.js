"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvestmentById = exports.getUserInvestments = exports.createInvestment = exports.getInvestmentPlans = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Investment_1 = require("../models/Investment");
const InvestmentModel_1 = require("../db/models/InvestmentModel");
const UserModel_1 = require("../db/models/UserModel");
const getInvestmentPlans = async (_req, res) => {
    try {
        res.json({
            plans: Investment_1.INVESTMENT_PLANS,
        });
    }
    catch (error) {
        console.error("Get investment plans error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getInvestmentPlans = getInvestmentPlans;
const createInvestment = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, amount } = req.body;
        // Validate input
        if (!type || !amount) {
            return res.status(400).json({ error: "Investment type and amount are required" });
        }
        // Find plan
        const plan = Investment_1.INVESTMENT_PLANS.find((p) => p.type === type);
        if (!plan) {
            return res.status(400).json({ error: "Invalid investment type" });
        }
        // Validate amount
        if (amount < plan.minInvest || amount > plan.maxInvest) {
            return res.status(400).json({
                error: `Investment amount must be between $${plan.minInvest} and $${plan.maxInvest}`,
            });
        }
        // Calculate ROI (random within range: 1.5-2.5% daily per $100)
        const roiPercentage = plan.roiMin + Math.random() * (plan.roiMax - plan.roiMin);
        const dailyReturn = (amount * roiPercentage) / 100;
        // Validate user ID
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        // Check if user exists and has sufficient balance
        const user = await UserModel_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }
        // Create investment with ROI and commission limits
        const newInvestment = await InvestmentModel_1.InvestmentModel.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
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
        });
        // Update user balance and total invested
        user.balance -= amount;
        user.totalInvested += amount;
        await user.save();
        res.status(201).json({
            message: "Investment created successfully",
            investment: newInvestment.toJSON(),
        });
    }
    catch (error) {
        console.error("Create investment error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createInvestment = createInvestment;
const getUserInvestments = async (req, res) => {
    try {
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const userInvestments = await InvestmentModel_1.InvestmentModel.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }).sort({ createdAt: -1 });
        res.json({
            investments: userInvestments.map((inv) => inv.toJSON()),
            total: userInvestments.length,
        });
    }
    catch (error) {
        console.error("Get user investments error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUserInvestments = getUserInvestments;
const getInvestmentById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const investment = await InvestmentModel_1.InvestmentModel.findOne({
            _id: new mongoose_1.default.Types.ObjectId(id),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!investment) {
            return res.status(404).json({ error: "Investment not found" });
        }
        res.json(investment.toJSON());
    }
    catch (error) {
        console.error("Get investment error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getInvestmentById = getInvestmentById;
//# sourceMappingURL=investmentController.js.map