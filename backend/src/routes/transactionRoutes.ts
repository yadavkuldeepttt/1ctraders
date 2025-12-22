import { Router } from "express"
import {
  createDeposit,
  createWithdrawal,
  getUserTransactions,
  getTransactionById,
} from "../controllers/transactionController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

router.post("/deposit/create", authMiddleware, createDeposit)
router.post("/withdrawal", authMiddleware, createWithdrawal)
router.get("/", authMiddleware, getUserTransactions)
router.get("/:id", authMiddleware, getTransactionById)

export default router
