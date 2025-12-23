import { Router } from "express"
import { register, login, getProfile, verifyToken, updateProfile, changePassword, updateTwoFactor, forgotPassword, verifyResetToken, resetPassword } from "../controllers/authController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.get("/verify-reset-token", verifyResetToken)
router.post("/reset-password", resetPassword)
router.get("/profile", authMiddleware, getProfile)
router.get("/verify", authMiddleware, verifyToken)
router.patch("/profile", authMiddleware, updateProfile)
router.patch("/password", authMiddleware, changePassword)
router.patch("/two-factor", authMiddleware, updateTwoFactor)

export default router
