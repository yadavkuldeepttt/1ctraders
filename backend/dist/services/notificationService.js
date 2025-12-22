"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getUserNotifications = exports.createBulkNotifications = exports.createNotification = void 0;
const NotificationModel_1 = require("../db/models/NotificationModel");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Create a notification for a user
 */
const createNotification = async (params) => {
    try {
        const notification = await NotificationModel_1.NotificationModel.create({
            userId: new mongoose_1.default.Types.ObjectId(params.userId),
            title: params.title,
            message: params.message,
            type: params.type || "info",
            relatedId: params.relatedId,
            relatedType: params.relatedType,
            isRead: false,
        });
        return notification.toJSON();
    }
    catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};
exports.createNotification = createNotification;
/**
 * Create notifications for multiple users (for admin broadcasts)
 */
const createBulkNotifications = async (userIds, title, message, type = "info") => {
    try {
        const notifications = userIds.map((userId) => ({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            title,
            message,
            type,
            isRead: false,
        }));
        await NotificationModel_1.NotificationModel.insertMany(notifications);
        return { success: true, count: notifications.length };
    }
    catch (error) {
        console.error("Error creating bulk notifications:", error);
        throw error;
    }
};
exports.createBulkNotifications = createBulkNotifications;
/**
 * Get user notifications
 */
const getUserNotifications = async (userId, limit = 50, unreadOnly = false) => {
    try {
        const query = {
            userId: new mongoose_1.default.Types.ObjectId(userId),
        };
        if (unreadOnly) {
            query.isRead = false;
        }
        const notifications = await NotificationModel_1.NotificationModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);
        return notifications.map((n) => n.toJSON());
    }
    catch (error) {
        console.error("Error getting user notifications:", error);
        throw error;
    }
};
exports.getUserNotifications = getUserNotifications;
/**
 * Get unread notification count
 */
const getUnreadCount = async (userId) => {
    try {
        const count = await NotificationModel_1.NotificationModel.countDocuments({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            isRead: false,
        });
        return count;
    }
    catch (error) {
        console.error("Error getting unread count:", error);
        throw error;
    }
};
exports.getUnreadCount = getUnreadCount;
/**
 * Mark notification as read
 */
const markAsRead = async (notificationId, userId) => {
    try {
        const notification = await NotificationModel_1.NotificationModel.findOneAndUpdate({
            _id: new mongoose_1.default.Types.ObjectId(notificationId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }, { isRead: true }, { new: true });
        return notification?.toJSON();
    }
    catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};
exports.markAsRead = markAsRead;
/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId) => {
    try {
        const result = await NotificationModel_1.NotificationModel.updateMany({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            isRead: false,
        }, { isRead: true });
        return { success: true, updated: result.modifiedCount };
    }
    catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};
exports.markAllAsRead = markAllAsRead;
/**
 * Delete notification
 */
const deleteNotification = async (notificationId, userId) => {
    try {
        const result = await NotificationModel_1.NotificationModel.deleteOne({
            _id: new mongoose_1.default.Types.ObjectId(notificationId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        return { success: result.deletedCount > 0 };
    }
    catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=notificationService.js.map