"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const adminTaskController_1 = require("../controllers/adminTaskController");
const adminNotificationController_1 = require("../controllers/adminNotificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = (0, express_1.Router)();
// All admin routes require both auth and admin middleware
router.use(authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware);
router.get("/stats", adminController_1.getDashboardStats);
router.get("/users", adminController_1.getAllUsers);
router.patch("/users/:userId/status", adminController_1.updateUserStatus);
router.get("/withdrawals/pending", adminController_1.getPendingWithdrawals);
router.post("/withdrawals/:transactionId/approve", adminController_1.approveWithdrawal);
// Task management routes
router.get("/tasks", adminTaskController_1.getAllTasks);
router.get("/tasks/:taskId", adminTaskController_1.getTask);
router.post("/tasks", adminTaskController_1.createTask);
router.patch("/tasks/:taskId", adminTaskController_1.updateTask);
router.delete("/tasks/:taskId", adminTaskController_1.deleteTask);
// Notification management routes
router.post("/notifications/send", adminNotificationController_1.sendNotification);
router.post("/notifications/broadcast", adminNotificationController_1.broadcastNotification);
router.post("/notifications/send-multiple", adminNotificationController_1.sendMultipleNotifications);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map