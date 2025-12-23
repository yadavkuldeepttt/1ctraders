"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDailyROI = processDailyROI;
const mongoose_1 = __importDefault(require("mongoose"));
const InvestmentModel_1 = require("../db/models/InvestmentModel");
const UserModel_1 = require("../db/models/UserModel");
const TransactionModel_1 = require("../db/models/TransactionModel");
const ReferralModel_1 = require("../db/models/ReferralModel");
const Referral_1 = require("../models/Referral");
const Investment_1 = require("../models/Investment");
/**
 * Calculate daily ROI for an investment
 * Returns the ROI amount or null if investment has reached limits
 */
async function calculateDailyROI(investment) {
    const maxRoiEarnings = (investment.amount * Investment_1.MAX_ROI_PERCENTAGE) / 100;
    const remainingRoi = maxRoiEarnings - investment.totalRoiEarned;
    if (remainingRoi <= 0) {
        return null; // Investment has reached ROI limit
    }
    // Calculate today's ROI (randomized between 1.5-2.5% per $100)
    const dailyRoi = investment.dailyReturn;
    // Don't exceed the remaining ROI limit
    return Math.min(dailyRoi, remainingRoi);
}
/**
 * Check if user has active referrals (networking)
 */
async function hasActiveReferrals(userId) {
    const referrals = await ReferralModel_1.ReferralModel.find({
        referrerId: new mongoose_1.default.Types.ObjectId(userId),
        status: "active",
    });
    return referrals.length > 0;
}
/**
 * Calculate commission for referral network
 * Commissions are paid to referrers and count towards their own investment limits
 */
async function distributeReferralCommissions(investment, roiAmount) {
    const investor = await UserModel_1.UserModel.findById(investment.userId);
    if (!investor)
        return;
    // Get referral chain up to 12 levels
    // Build chain: Level 1 = direct referrer, Level 2 = who referred the referrer, etc.
    const referralChain = [];
    // Level 1: Direct referrer (who referred the investor)
    let currentUser = investor;
    for (let level = 1; level <= 12; level++) {
        // Get the referral code of who referred current user
        const referrerCode = currentUser.referredBy;
        if (!referrerCode)
            break;
        // Find the referrer user by their referral code
        const referrer = await UserModel_1.UserModel.findOne({ referralCode: referrerCode });
        if (!referrer)
            break;
        // Add to chain
        referralChain.push({
            userId: referrer._id.toString(),
            level,
        });
        // Move up the chain
        currentUser = referrer;
    }
    // Distribute commissions to referrers
    let totalCommissionPercentage = 0;
    for (const chainLink of referralChain) {
        if (totalCommissionPercentage >= Referral_1.MAX_REFERRAL_COMMISSION_PERCENTAGE)
            break;
        const levelConfig = Referral_1.REFERRAL_LEVELS.find((l) => l.level === chainLink.level);
        if (!levelConfig)
            continue;
        const commissionPercentage = Math.min(levelConfig.percentage, Referral_1.MAX_REFERRAL_COMMISSION_PERCENTAGE - totalCommissionPercentage);
        const commissionAmount = (roiAmount * commissionPercentage) / 100;
        // Update referrer's balance directly
        const referrer = await UserModel_1.UserModel.findById(chainLink.userId);
        if (referrer) {
            referrer.balance += commissionAmount;
            referrer.totalEarnings += commissionAmount;
            await referrer.save();
            // Add commission to referrer's active investments (counts towards their 400% limit)
            const referrerInvestments = await InvestmentModel_1.InvestmentModel.find({
                userId: new mongoose_1.default.Types.ObjectId(chainLink.userId),
                status: "active",
            });
            // Distribute commission across referrer's investments
            if (referrerInvestments.length > 0) {
                const commissionPerInvestment = commissionAmount / referrerInvestments.length;
                for (const refInvestment of referrerInvestments) {
                    const maxCommissionEarnings = (refInvestment.amount * Investment_1.MAX_COMMISSION_PERCENTAGE) / 100;
                    const remainingCommission = maxCommissionEarnings - refInvestment.totalCommissionEarned;
                    if (remainingCommission > 0) {
                        const actualCommission = Math.min(commissionPerInvestment, remainingCommission);
                        refInvestment.totalCommissionEarned += actualCommission;
                        refInvestment.totalReturns += actualCommission;
                        await refInvestment.save();
                    }
                }
            }
            // Create commission transaction
            await TransactionModel_1.TransactionModel.create({
                userId: new mongoose_1.default.Types.ObjectId(chainLink.userId),
                type: "referral",
                amount: commissionAmount,
                status: "completed",
                description: `Referral commission level ${chainLink.level} from investment`,
                completedAt: new Date(),
            });
            // Create commission record
            const referral = await ReferralModel_1.ReferralModel.findOne({
                referrerId: new mongoose_1.default.Types.ObjectId(chainLink.userId),
                referredUserId: investment.userId,
                level: chainLink.level,
            });
            if (referral) {
                await ReferralModel_1.ReferralCommissionModel.create({
                    referralId: referral._id,
                    investmentId: investment._id,
                    amount: commissionAmount,
                    level: chainLink.level,
                });
            }
        }
        totalCommissionPercentage += commissionPercentage;
    }
}
/**
 * Process daily ROI for all active investments
 */
async function processDailyROI() {
    try {
        console.log("🔄 Starting daily ROI processing...");
        const activeInvestments = await InvestmentModel_1.InvestmentModel.find({
            status: "active",
        }).populate("userId");
        let processedCount = 0;
        let expiredCount = 0;
        for (const investment of activeInvestments) {
            try {
                // Check if investment has expired (past end date)
                if (new Date() > investment.endDate) {
                    investment.status = "completed";
                    await investment.save();
                    expiredCount++;
                    continue;
                }
                // Check if we've already paid today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (investment.lastPaidDate &&
                    new Date(investment.lastPaidDate).setHours(0, 0, 0, 0) === today.getTime()) {
                    continue; // Already paid today
                }
                // Calculate daily ROI
                const roiAmount = await calculateDailyROI(investment);
                if (roiAmount === null || roiAmount <= 0) {
                    // Check if investment should expire based on limits
                    const hasNetworking = await hasActiveReferrals(investment.userId._id.toString());
                    const maxEarnings = hasNetworking
                        ? (investment.amount * Investment_1.MAX_COMMISSION_PERCENTAGE) / 100
                        : (investment.amount * Investment_1.MAX_ROI_PERCENTAGE) / 100;
                    if (investment.totalReturns >= maxEarnings) {
                        investment.status = "completed";
                        await investment.save();
                        expiredCount++;
                        console.log(`✅ Investment ${investment._id} expired (reached limit)`);
                    }
                    continue;
                }
                // Update investment
                investment.totalRoiEarned += roiAmount;
                investment.totalReturns += roiAmount;
                investment.lastPaidDate = new Date();
                await investment.save();
                // Update user balance
                const user = await UserModel_1.UserModel.findById(investment.userId._id);
                if (user) {
                    user.balance += roiAmount;
                    user.totalEarnings += roiAmount;
                    await user.save();
                    // Create ROI transaction
                    await TransactionModel_1.TransactionModel.create({
                        userId: investment.userId._id,
                        type: "roi",
                        amount: roiAmount,
                        status: "completed",
                        description: `Daily ROI for ${investment.type} investment`,
                        completedAt: new Date(),
                    });
                    // Distribute referral commissions
                    await distributeReferralCommissions(investment, roiAmount);
                    // Check if investment should expire after ROI distribution
                    const hasNetworking = await hasActiveReferrals(investment.userId._id.toString());
                    const maxEarnings = hasNetworking
                        ? (investment.amount * Investment_1.MAX_COMMISSION_PERCENTAGE) / 100
                        : (investment.amount * Investment_1.MAX_ROI_PERCENTAGE) / 100;
                    if (investment.totalReturns >= maxEarnings) {
                        investment.status = "completed";
                        await investment.save();
                        expiredCount++;
                        console.log(`✅ Investment ${investment._id} expired (reached ${hasNetworking ? "400%" : "300%"} limit)`);
                    }
                    processedCount++;
                }
            }
            catch (error) {
                console.error(`Error processing investment ${investment._id}:`, error);
            }
        }
        console.log(`✅ Daily ROI processing complete: ${processedCount} processed, ${expiredCount} expired`);
    }
    catch (error) {
        console.error("❌ Error in daily ROI processing:", error);
        throw error;
    }
}
//# sourceMappingURL=dailyRoiService.js.map