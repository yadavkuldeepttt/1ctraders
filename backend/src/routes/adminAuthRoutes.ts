import { Router } from "express"
import { adminLogin, createAdmin, getAdminProfile } from "../controllers/adminAuthController"
import { authMiddleware } from "../middleware/authMiddleware"
import { adminMiddleware } from "../middleware/adminMiddleware"

const router = Router()

// Test route to verify routing is working
router.get("/test", (_req: any, res: any) => {
  res.json({ message: "Admin auth routes are working", timestamp: new Date().toISOString() })
})

// Public admin routes (NO middleware - these should be accessible without token)
router.post("/login", adminLogin)
router.post("/create", createAdmin) // For manual admin creation via Postman

// Protected admin routes (require authentication)
router.get("/profile", authMiddleware, adminMiddleware, getAdminProfile)

export default router

