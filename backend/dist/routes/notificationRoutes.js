"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All notification routes require authentication
router.get("/", authMiddleware_1.authMiddleware, notificationController_1.getNotifications);
router.get("/unread-count", authMiddleware_1.authMiddleware, notificationController_1.getUnreadNotificationCount);
router.patch("/:id/read", authMiddleware_1.authMiddleware, notificationController_1.markNotificationAsRead);
router.patch("/read-all", authMiddleware_1.authMiddleware, notificationController_1.markAllNotificationsAsRead);
router.delete("/:id", authMiddleware_1.authMiddleware, notificationController_1.deleteUserNotification);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map