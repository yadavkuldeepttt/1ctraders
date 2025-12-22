import { Router } from "express"
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteUserNotification,
} from "../controllers/notificationController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

// All notification routes require authentication
router.get("/", authMiddleware, getNotifications)
router.get("/unread-count", authMiddleware, getUnreadNotificationCount)
router.patch("/:id/read", authMiddleware, markNotificationAsRead)
router.patch("/read-all", authMiddleware, markAllNotificationsAsRead)
router.delete("/:id", authMiddleware, deleteUserNotification)

export default router

