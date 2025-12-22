import { Router } from "express"
import {
  sendPaymentOTP,
  verifyPaymentOTP,
  sendVerificationOTP,
  verifyVerificationOTP,
  sendLoginOTP,
  verifyLoginOTP,
} from "../controllers/otpController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

// OTP routes require authentication (for payments)
router.post("/send", authMiddleware, sendPaymentOTP)
router.post("/verify", authMiddleware, verifyPaymentOTP)

// Public OTP routes for email verification (registration)
router.post("/send-verification", sendVerificationOTP)
router.post("/verify-verification", verifyVerificationOTP)

// Public OTP routes for login (optional 2FA)
router.post("/send-login", sendLoginOTP)
router.post("/verify-login", verifyLoginOTP)

export default router


