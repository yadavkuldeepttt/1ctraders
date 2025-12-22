import { Router } from "express"
import { getActiveUsers, getLeaderboard } from "../controllers/publicController"

const router = Router()

// Public routes (no authentication required)
router.get("/active-users", getActiveUsers)
router.get("/leaderboard", getLeaderboard)

export default router

