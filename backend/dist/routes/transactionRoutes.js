"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/deposit/create", authMiddleware_1.authMiddleware, transactionController_1.createDeposit);
router.post("/withdrawal", authMiddleware_1.authMiddleware, transactionController_1.createWithdrawal);
router.get("/", authMiddleware_1.authMiddleware, transactionController_1.getUserTransactions);
router.get("/:id", authMiddleware_1.authMiddleware, transactionController_1.getTransactionById);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map