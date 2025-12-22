"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otpController_1 = require("../controllers/otpController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// OTP routes require authentication (for payments)
router.post("/send", authMiddleware_1.authMiddleware, otpController_1.sendPaymentOTP);
router.post("/verify", authMiddleware_1.authMiddleware, otpController_1.verifyPaymentOTP);
// Public OTP routes for email verification (registration)
router.post("/send-verification", otpController_1.sendVerificationOTP);
router.post("/verify-verification", otpController_1.verifyVerificationOTP);
// Public OTP routes for login (optional 2FA)
router.post("/send-login", otpController_1.sendLoginOTP);
router.post("/verify-login", otpController_1.verifyLoginOTP);
exports.default = router;
//# sourceMappingURL=otpRoutes.js.map