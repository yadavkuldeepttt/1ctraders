"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.get("/active-users", publicController_1.getActiveUsers);
router.get("/leaderboard", publicController_1.getLeaderboard);
exports.default = router;
//# sourceMappingURL=publicRoutes.js.map