"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public IPN webhook (no auth, verified by signature)
// This route is handled in index.ts with raw body parser
router.post("/nowpayments/ipn", paymentController_1.handleNowPaymentsIPN);
// Protected payment routes
router.post("/crypto", authMiddleware_1.authMiddleware, paymentController_1.createCryptoPayment);
router.get("/:paymentId/status", authMiddleware_1.authMiddleware, paymentController_1.getPaymentStatus);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map