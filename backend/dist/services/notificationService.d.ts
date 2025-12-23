import mongoose from "mongoose";
export interface CreateNotificationParams {
    userId: string;
    title: string;
    message: string;
    type?: "info" | "success" | "warning" | "error" | "task" | "investment" | "system";
    relatedId?: string;
    relatedType?: "task" | "investment" | "transaction" | "referral";
}
/**
 * Create a notification for a user
 */
export declare const createNotification: (params: CreateNotificationParams) => Promise<mongoose.FlattenMaps<import("../db/models/NotificationModel").NotificationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>>;
/**
 * Create notifications for multiple users (for admin broadcasts)
 */
export declare const createBulkNotifications: (userIds: string[], title: string, message: string, type?: "info" | "success" | "warning" | "error" | "task" | "investment" | "system") => Promise<{
    success: boolean;
    count: number;
}>;
/**
 * Get user notifications
 */
export declare const getUserNotifications: (userId: string, limit?: number, unreadOnly?: boolean) => Promise<mongoose.FlattenMaps<import("../db/models/NotificationModel").NotificationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>[]>;
/**
 * Get unread notification count
 */
export declare const getUnreadCount: (userId: string) => Promise<number>;
/**
 * Mark notification as read
 */
export declare const markAsRead: (notificationId: string, userId: string) => Promise<mongoose.FlattenMaps<import("../db/models/NotificationModel").NotificationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>>;
/**
 * Mark all notifications as read for a user
 */
export declare const markAllAsRead: (userId: string) => Promise<{
    success: boolean;
    updated: number;
}>;
/**
 * Delete notification
 */
export declare const deleteNotification: (notificationId: string, userId: string) => Promise<{
    success: boolean;
}>;
//# sourceMappingURL=notificationService.d.ts.map