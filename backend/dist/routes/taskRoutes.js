"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/available", authMiddleware_1.authMiddleware, taskController_1.getAvailableTasks);
router.get("/", authMiddleware_1.authMiddleware, taskController_1.getUserTasks);
router.post("/:taskId/complete", authMiddleware_1.authMiddleware, taskController_1.completeTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map