import { NotificationModel } from "../db/models/NotificationModel"
import mongoose from "mongoose"

export interface CreateNotificationParams {
  userId: string
  title: string
  message: string
  type?: "info" | "success" | "warning" | "error" | "task" | "investment" | "system"
  relatedId?: string
  relatedType?: "task" | "investment" | "transaction" | "referral"
}

/**
 * Create a notification for a user
 */
export const createNotification = async (params: CreateNotificationParams) => {
  try {
    const notification = await NotificationModel.create({
      userId: new mongoose.Types.ObjectId(params.userId),
      title: params.title,
      message: params.message,
      type: params.type || "info",
      relatedId: params.relatedId,
      relatedType: params.relatedType,
      isRead: false,
    })

    return notification.toJSON()
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

/**
 * Create notifications for multiple users (for admin broadcasts)
 */
export const createBulkNotifications = async (
  userIds: string[],
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" | "task" | "investment" | "system" = "info"
) => {
  try {
    const notifications = userIds.map((userId) => ({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      message,
      type,
      isRead: false,
    }))

    await NotificationModel.insertMany(notifications)
    return { success: true, count: notifications.length }
  } catch (error) {
    console.error("Error creating bulk notifications:", error)
    throw error
  }
}

/**
 * Get user notifications
 */
export const getUserNotifications = async (
  userId: string,
  limit: number = 50,
  unreadOnly: boolean = false
) => {
  try {
    const query: any = {
      userId: new mongoose.Types.ObjectId(userId),
    }

    if (unreadOnly) {
      query.isRead = false
    }

    const notifications = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)

    return notifications.map((n) => n.toJSON())
  } catch (error) {
    console.error("Error getting user notifications:", error)
    throw error
  }
}

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId: string) => {
  try {
    const count = await NotificationModel.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    })
    return count
  } catch (error) {
    console.error("Error getting unread count:", error)
    throw error
  }
}

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string, userId: string) => {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(notificationId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      { isRead: true },
      { new: true }
    )

    return notification?.toJSON()
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId: string) => {
  try {
    const result = await NotificationModel.updateMany(
      {
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false,
      },
      { isRead: true }
    )

    return { success: true, updated: result.modifiedCount }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string, userId: string) => {
  try {
    const result = await NotificationModel.deleteOne({
      _id: new mongoose.Types.ObjectId(notificationId),
      userId: new mongoose.Types.ObjectId(userId),
    })

    return { success: result.deletedCount > 0 }
  } catch (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}

