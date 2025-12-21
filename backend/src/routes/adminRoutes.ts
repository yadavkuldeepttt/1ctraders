import { Router } from "express"
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getPendingWithdrawals,
  approveWithdrawal,
} from "../controllers/adminController"
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

export default router
