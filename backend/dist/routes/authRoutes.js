"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/forgot-password", authController_1.forgotPassword);
router.get("/verify-reset-token", authController_1.verifyResetToken);
router.post("/reset-password", authController_1.resetPassword);
router.get("/profile", authMiddleware_1.authMiddleware, authController_1.getProfile);
router.get("/verify", authMiddleware_1.authMiddleware, authController_1.verifyToken);
router.patch("/profile", authMiddleware_1.authMiddleware, authController_1.updateProfile);
router.patch("/password", authMiddleware_1.authMiddleware, authController_1.changePassword);
router.patch("/two-factor", authMiddleware_1.authMiddleware, authController_1.updateTwoFactor);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map