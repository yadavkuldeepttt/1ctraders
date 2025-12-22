import type { Request, Response } from "express"
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notificationService"
import mongoose from "mongoose"

type ControllerResponse = Response | void

/**
 * Get user notifications
 * GET /api/notifications
 */
export const getNotifications = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { limit = 50, unreadOnly } = req.query

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const notifications = await getUserNotifications(
      userId,
      Number(limit),
      unreadOnly === "true"
    )

    res.json({ notifications })
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get unread notification count
 * GET /api/notifications/unread-count
 */
export const getUnreadNotificationCount = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const count = await getUnreadCount(userId)
    res.json({ count })
  } catch (error) {
    console.error("Get unread count error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
export const markNotificationAsRead = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" })
    }

    const notification = await markAsRead(id, userId)
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }

    res.json({ notification })
  } catch (error) {
    console.error("Mark notification as read error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
export const markAllNotificationsAsRead = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const result = await markAllAsRead(userId)
    res.json(result)
  } catch (error) {
    console.error("Mark all notifications as read error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export const deleteUserNotification = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" })
    }

    const result = await deleteNotification(id, userId)
    res.json(result)
  } catch (error) {
    console.error("Delete notification error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

