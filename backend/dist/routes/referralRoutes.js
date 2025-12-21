"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referralController_1 = require("../controllers/referralController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/stats", authMiddleware_1.authMiddleware, referralController_1.getReferralStats);
router.get("/", authMiddleware_1.authMiddleware, referralController_1.getUserReferrals);
router.get("/tree", authMiddleware_1.authMiddleware, referralController_1.getReferralTree);
exports.default = router;
//# sourceMappingURL=referralRoutes.js.map