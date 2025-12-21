import { Router } from "express"
import { register, login, getProfile, verifyToken } from "../controllers/authController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/profile", authMiddleware, getProfile)
router.get("/verify", authMiddleware, verifyToken)

export default router
