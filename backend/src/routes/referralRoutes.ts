import { Router } from "express"
import { getReferralStats, getUserReferrals, getReferralTree } from "../controllers/referralController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

router.get("/stats", authMiddleware, getReferralStats)
router.get("/", authMiddleware, getUserReferrals)
router.get("/tree", authMiddleware, getReferralTree)

export default router
