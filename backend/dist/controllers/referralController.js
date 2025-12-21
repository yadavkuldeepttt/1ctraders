"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferralTree = exports.getUserReferrals = exports.getReferralStats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Referral_1 = require("../models/Referral");
const ReferralModel_1 = require("../db/models/ReferralModel");
const getReferralStats = async (req, res) => {
    try {
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const userReferrals = await ReferralModel_1.ReferralModel.find({
            referrerId: new mongoose_1.default.Types.ObjectId(userId),
        });
        const referralIds = userReferrals.map((ref) => ref._id);
        const commissions = await ReferralModel_1.ReferralCommissionModel.find({
            referralId: { $in: referralIds },
        });
        const totalEarnings = commissions.reduce((sum, comm) => sum + comm.amount, 0);
        const activeReferrals = userReferrals.filter((ref) => ref.status === "active").length;
        const referralsByLevel = await Promise.all(Referral_1.REFERRAL_LEVELS.map(async (level) => {
            const levelReferrals = userReferrals.filter((ref) => ref.level === level.level);
            const levelReferralIds = levelReferrals.map((ref) => ref._id);
            const levelCommissions = await ReferralModel_1.ReferralCommissionModel.find({
                referralId: { $in: levelReferralIds },
            });
            const levelEarnings = levelCommissions.reduce((sum, comm) => sum + comm.amount, 0);
            return {
                level: level.level,
                percentage: level.percentage,
                count: levelReferrals.length,
                earnings: levelEarnings,
            };
        }));
        res.json({
            totalReferrals: userReferrals.length,
            activeReferrals,
            totalEarnings,
            referralsByLevel,
        });
    }
    catch (error) {
        console.error("Get referral stats error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getReferralStats = getReferralStats;
const getUserReferrals = async (req, res) => {
    try {
        const userId = req.userId;
        const { level } = req.query;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const query = { referrerId: new mongoose_1.default.Types.ObjectId(userId) };
        if (level) {
            query.level = Number(level);
        }
        const userReferrals = await ReferralModel_1.ReferralModel.find(query);
        res.json({
            referrals: userReferrals.map((ref) => ref.toJSON()),
            total: userReferrals.length,
        });
    }
    catch (error) {
        console.error("Get user referrals error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUserReferrals = getUserReferrals;
const getReferralTree = async (req, res) => {
    try {
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        // Build referral tree (simplified for demo)
        const buildTree = async (referrerId, maxLevel = 12) => {
            const directReferrals = await ReferralModel_1.ReferralModel.find({
                referrerId,
                level: { $lte: maxLevel },
            });
            const children = await Promise.all(directReferrals.map((ref) => buildTree(new mongoose_1.default.Types.ObjectId(ref.referredUserId.toString()), maxLevel)));
            return directReferrals.map((ref, index) => ({
                ...ref.toJSON(),
                children: children[index],
            }));
        };
        const tree = await buildTree(new mongoose_1.default.Types.ObjectId(userId));
        res.json({
            tree,
        });
    }
    catch (error) {
        console.error("Get referral tree error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getReferralTree = getReferralTree;
//# sourceMappingURL=referralController.js.map