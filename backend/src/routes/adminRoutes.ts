import { Router } from "express"
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getPendingWithdrawals,
  approveWithdrawal,
} from "../controllers/adminController"
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/adminTaskController"
import { authMiddleware } from "../middleware/authMiddleware"
import { adminMiddleware } from "../middleware/adminMiddleware"

const router = Router()

// All admin routes require both auth and admin middleware
router.use(authMiddleware, adminMiddleware)

router.get("/stats", getDashboardStats)
router.get("/users", getAllUsers)
router.patch("/users/:userId/status", updateUserStatus)
router.get("/withdrawals/pending", getPendingWithdrawals)
router.post("/withdrawals/:transactionId/approve", approveWithdrawal)

// Task management routes
router.get("/tasks", getAllTasks)
router.get("/tasks/:taskId", getTask)
router.post("/tasks", createTask)
router.patch("/tasks/:taskId", updateTask)
router.delete("/tasks/:taskId", deleteTask)

export default router
