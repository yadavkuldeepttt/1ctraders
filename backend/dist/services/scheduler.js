"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = startScheduler;
const dailyRoiService_1 = require("./dailyRoiService");
const pointsConversionService_1 = require("./pointsConversionService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Schedule daily ROI processing
 * Runs every day at a specified time (default: 00:00 UTC)
 */
function startScheduler() {
    console.log("⏰ Starting scheduler...");
    // Process immediately on startup (for testing)
    if (process.env.NODE_ENV === "development") {
        console.log("🔧 Development mode: Processing ROI immediately");
        (0, dailyRoiService_1.processDailyROI)().catch(console.error);
        (0, pointsConversionService_1.convertPointsToMoney)().catch(console.error);
    }
    // Calculate milliseconds until next midnight UTC
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setUTCHours(24, 0, 0, 0);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();
    // Schedule first run at midnight
    setTimeout(() => {
        (0, dailyRoiService_1.processDailyROI)().catch(console.error);
        (0, pointsConversionService_1.convertPointsToMoney)().catch(console.error);
        // Then run every 24 hours
        setInterval(() => {
            (0, dailyRoiService_1.processDailyROI)().catch(console.error);
            (0, pointsConversionService_1.convertPointsToMoney)().catch(console.error);
        }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    }, msUntilMidnight);
    // Also run points conversion every hour (to check for eligible conversions)
    setInterval(() => {
        (0, pointsConversionService_1.convertPointsToMoney)().catch(console.error);
    }, 60 * 60 * 1000); // 1 hour in milliseconds
    console.log(`⏰ Scheduler started. Next run at: ${nextMidnight.toISOString()}`);
}
//# sourceMappingURL=scheduler.js.map