"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMultipleNotifications = exports.broadcastNotification = exports.sendNotification = void 0;
const notificationService_1 = require("../services/notificationService");
const UserModel_1 = require("../db/models/UserModel");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Send notification to a specific user
 * POST /api/admin/notifications/send
 */
const sendNotification = async (req, res) => {
    try {
        const { userId, title, message, type = "info" } = req.body;
        if (!userId || !title || !message) {
            return res.status(400).json({ error: "userId, title, and message are required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const notification = await (0, notificationService_1.createNotification)({
            userId,
            title,
            message,
            type,
        });
        res.json({ notification, message: "Notification sent successfully" });
    }
    catch (error) {
        console.error("Send notification error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendNotification = sendNotification;
/**
 * Send notification to all users (broadcast)
 * POST /api/admin/notifications/broadcast
 */
const broadcastNotification = async (req, res) => {
    try {
        const { title, message, type = "info", userType = "all" } = req.body;
        if (!title || !message) {
            return res.status(400).json({ error: "title and message are required" });
        }
        // Get all active users or filter by type
        let query = { status: "active" };
        if (userType === "investors") {
            query.totalInvested = { $gt: 0 };
        }
        const users = await UserModel_1.UserModel.find(query).select("_id");
        const userIds = users.map((user) => user._id.toString());
        if (userIds.length === 0) {
            return res.status(400).json({ error: "No users found" });
        }
        const result = await (0, notificationService_1.createBulkNotifications)(userIds, title, message, type);
        res.json({
            ...result,
            message: `Notification broadcasted to ${result.count} users`,
        });
    }
    catch (error) {
        console.error("Broadcast notification error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.broadcastNotification = broadcastNotification;
/**
 * Send notification to multiple specific users
 * POST /api/admin/notifications/send-multiple
 */
const sendMultipleNotifications = async (req, res) => {
    try {
        const { userIds, title, message, type = "info" } = req.body;
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ error: "userIds array is required" });
        }
        if (!title || !message) {
            return res.status(400).json({ error: "title and message are required" });
        }
        // Validate all user IDs
        const invalidIds = userIds.filter((id) => !mongoose_1.default.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({ error: `Invalid user IDs: ${invalidIds.join(", ")}` });
        }
        const result = await (0, notificationService_1.createBulkNotifications)(userIds, title, message, type);
        res.json({
            ...result,
            message: `Notification sent to ${result.count} users`,
        });
    }
    catch (error) {
        console.error("Send multiple notifications error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendMultipleNotifications = sendMultipleNotifications;
//# sourceMappingURL=adminNotificationController.js.map