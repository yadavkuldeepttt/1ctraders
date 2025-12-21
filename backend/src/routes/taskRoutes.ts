import { Router } from "express"
import { getAvailableTasks, getUserTasks, completeTask } from "../controllers/taskController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

router.get("/available", authMiddleware, getAvailableTasks)
router.get("/", authMiddleware, getUserTasks)
router.post("/:taskId/complete", authMiddleware, completeTask)

export default router
