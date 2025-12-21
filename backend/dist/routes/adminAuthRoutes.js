"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuthController_1 = require("../controllers/adminAuthController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = (0, express_1.Router)();
// Test route to verify routing is working
router.get("/test", (_req, res) => {
    res.json({ message: "Admin auth routes are working", timestamp: new Date().toISOString() });
});
// Public admin routes (NO middleware - these should be accessible without token)
router.post("/login", adminAuthController_1.adminLogin);
router.post("/create", adminAuthController_1.createAdmin); // For manual admin creation via Postman
// Protected admin routes (require authentication)
router.get("/profile", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, adminAuthController_1.getAdminProfile);
exports.default = router;
//# sourceMappingURL=adminAuthRoutes.js.map