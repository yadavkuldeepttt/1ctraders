"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserNotification = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getUnreadNotificationCount = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Get user notifications
 * GET /api/notifications
 */
const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const { limit = 50, unreadOnly } = req.query;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const notifications = await (0, notificationService_1.getUserNotifications)(userId, Number(limit), unreadOnly === "true");
        res.json({ notifications });
    }
    catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getNotifications = getNotifications;
/**
 * Get unread notification count
 * GET /api/notifications/unread-count
 */
const getUnreadNotificationCount = async (req, res) => {
    try {
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const count = await (0, notificationService_1.getUnreadCount)(userId);
        res.json({ count });
    }
    catch (error) {
        console.error("Get unread count error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUnreadNotificationCount = getUnreadNotificationCount;
/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const notification = await (0, notificationService_1.markAsRead)(id, userId);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        res.json({ notification });
    }
    catch (error) {
        console.error("Mark notification as read error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await (0, notificationService_1.markAllAsRead)(userId);
        res.json(result);
    }
    catch (error) {
        console.error("Mark all notifications as read error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
const deleteUserNotification = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const result = await (0, notificationService_1.deleteNotification)(id, userId);
        res.json(result);
    }
    catch (error) {
        console.error("Delete notification error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteUserNotification = deleteUserNotification;
//# sourceMappingURL=notificationController.js.map