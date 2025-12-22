import type { Request, Response } from "express"
import { createNotification, createBulkNotifications } from "../services/notificationService"
import { UserModel } from "../db/models/UserModel"
import mongoose from "mongoose"

type ControllerResponse = Response | void

/**
 * Send notification to a specific user
 * POST /api/admin/notifications/send
 */
export const sendNotification = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { userId, title, message, type = "info" } = req.body

    if (!userId || !title || !message) {
      return res.status(400).json({ error: "userId, title, and message are required" })
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const notification = await createNotification({
      userId,
      title,
      message,
      type,
    })

    res.json({ notification, message: "Notification sent successfully" })
  } catch (error) {
    console.error("Send notification error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Send notification to all users (broadcast)
 * POST /api/admin/notifications/broadcast
 */
export const broadcastNotification = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { title, message, type = "info", userType = "all" } = req.body

    if (!title || !message) {
      return res.status(400).json({ error: "title and message are required" })
    }

    // Get all active users or filter by type
    let query: any = { status: "active" }
    if (userType === "investors") {
      query.totalInvested = { $gt: 0 }
    }

    const users = await UserModel.find(query).select("_id")
    const userIds = users.map((user) => user._id.toString())

    if (userIds.length === 0) {
      return res.status(400).json({ error: "No users found" })
    }

    const result = await createBulkNotifications(userIds, title, message, type)

    res.json({
      ...result,
      message: `Notification broadcasted to ${result.count} users`,
    })
  } catch (error) {
    console.error("Broadcast notification error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Send notification to multiple specific users
 * POST /api/admin/notifications/send-multiple
 */
export const sendMultipleNotifications = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { userIds, title, message, type = "info" } = req.body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds array is required" })
    }

    if (!title || !message) {
      return res.status(400).json({ error: "title and message are required" })
    }

    // Validate all user IDs
    const invalidIds = userIds.filter((id: string) => !mongoose.Types.ObjectId.isValid(id))
    if (invalidIds.length > 0) {
      return res.status(400).json({ error: `Invalid user IDs: ${invalidIds.join(", ")}` })
    }

    const result = await createBulkNotifications(userIds, title, message, type)

    res.json({
      ...result,
      message: `Notification sent to ${result.count} users`,
    })
  } catch (error) {
    console.error("Send multiple notifications error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

