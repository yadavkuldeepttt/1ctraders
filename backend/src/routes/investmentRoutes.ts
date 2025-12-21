import { Router } from "express"
import {
  getInvestmentPlans,
  createInvestment,
  getUserInvestments,
  getInvestmentById,
} from "../controllers/investmentController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

router.get("/plans", getInvestmentPlans)
router.post("/", authMiddleware, createInvestment)
router.get("/", authMiddleware, getUserInvestments)
router.get("/:id", authMiddleware, getInvestmentById)

export default router
