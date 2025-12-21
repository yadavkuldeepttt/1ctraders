"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPointsToMoney = convertPointsToMoney;
const UserModel_1 = require("../db/models/UserModel");
const TransactionModel_1 = require("../db/models/TransactionModel");
const TaskModel_1 = require("../db/models/TaskModel");
// Points to money conversion rate: 1 point = $0.01 (100 points = $1)
const POINTS_TO_MONEY_RATE = 0.01;
// Conversion delay in hours (default: 24 hours)
const CONVERSION_DELAY_HOURS = parseInt(process.env.POINTS_CONVERSION_HOURS || "24");
/**
 * Convert pending points to money for users
 * Points are converted after the specified delay (default 24 hours)
 */
async function convertPointsToMoney() {
    try {
        console.log("🔄 Starting points to money conversion...");
        const users = await UserModel_1.UserModel.find({
            pendingPoints: { $gt: 0 },
        });
        let convertedCount = 0;
        let totalConverted = 0;
        for (const user of users) {
            try {
                // Find tasks completed more than CONVERSION_DELAY_HOURS ago
                const cutoffTime = new Date();
                cutoffTime.setHours(cutoffTime.getHours() - CONVERSION_DELAY_HOURS);
                const eligibleTasks = await TaskModel_1.UserTaskModel.find({
                    userId: user._id,
                    status: "completed",
                    completedAt: { $lte: cutoffTime },
                    rewardClaimed: false,
                });
                if (eligibleTasks.length === 0)
                    continue;
                // Calculate total points to convert
                let pointsToConvert = 0;
                for (const task of eligibleTasks) {
                    // Get task reward (points)
                    const taskDoc = await task.populate("taskId");
                    if (taskDoc.taskId) {
                        const taskReward = taskDoc.taskId.reward || 0;
                        pointsToConvert += taskReward;
                        task.rewardClaimed = true;
                        await task.save();
                    }
                }
                if (pointsToConvert > 0) {
                    // Convert points to money
                    const moneyAmount = pointsToConvert * POINTS_TO_MONEY_RATE;
                    // Update user
                    user.pendingPoints = Math.max(0, user.pendingPoints - pointsToConvert);
                    user.points += pointsToConvert;
                    user.balance += moneyAmount;
                    user.totalEarnings += moneyAmount;
                    await user.save();
                    // Create transaction
                    await TransactionModel_1.TransactionModel.create({
                        userId: user._id,
                        type: "task",
                        amount: moneyAmount,
                        status: "completed",
                        description: `Points converted to money: ${pointsToConvert} points = $${moneyAmount.toFixed(2)}`,
                        completedAt: new Date(),
                    });
                    convertedCount++;
                    totalConverted += moneyAmount;
                    console.log(`✅ Converted ${pointsToConvert} points to $${moneyAmount.toFixed(2)} for user ${user.username}`);
                }
            }
            catch (error) {
                console.error(`Error converting points for user ${user._id}:`, error);
            }
        }
        console.log(`✅ Points conversion complete: ${convertedCount} users, $${totalConverted.toFixed(2)} converted`);
    }
    catch (error) {
        console.error("❌ Error in points conversion:", error);
        throw error;
    }
}
//# sourceMappingURL=pointsConversionService.js.map