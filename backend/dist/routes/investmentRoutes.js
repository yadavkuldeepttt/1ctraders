"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const investmentController_1 = require("../controllers/investmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/plans", investmentController_1.getInvestmentPlans);
router.post("/", authMiddleware_1.authMiddleware, investmentController_1.createInvestment);
router.get("/", authMiddleware_1.authMiddleware, investmentController_1.getUserInvestments);
router.get("/:id", authMiddleware_1.authMiddleware, investmentController_1.getInvestmentById);
exports.default = router;
//# sourceMappingURL=investmentRoutes.js.map