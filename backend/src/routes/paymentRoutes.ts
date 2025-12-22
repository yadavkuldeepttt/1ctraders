import { Router } from "express"
import { createCryptoPayment, handleNowPaymentsIPN, getPaymentStatus } from "../controllers/paymentController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

// Public IPN webhook (no auth, verified by signature)
// This route is handled in index.ts with raw body parser
router.post("/nowpayments/ipn", handleNowPaymentsIPN)

// Protected payment routes
router.post("/crypto", authMiddleware, createCryptoPayment)
router.get("/:paymentId/status", authMiddleware, getPaymentStatus)

export default router

